/* globals chrome */

/// EXTENSION ENTRY POINT


/*User settings*/

const init = new Promise(async (resolve) => {
    let address;
    let port;
    /// ADDRESS
    await chrome.storage.sync.get(['address'], async (result) => {

        console.log(`result ${result.address}`)
        if(result.address === undefined)
        {
            address = '127.0.0.1';
            chrome.storage.sync.set({address});
        }
        else address = result.address;

        console.log(`final param ${address}`);
    });

    /// PORT
    await chrome.storage.sync.get(['port'], async (result) => {

    console.log(`result ${result.port}`)
    if(result.port === undefined)
    {
        port = 6969;
        chrome.storage.sync.set({port});
    }
    else port = result.port;

    console.log(`final param ${port}`);

    resolve({address,port});
    });
})

init.then((url) => {
    startProviders(url);
});


const startProviders = url => {
    let {address, port} = url;
    console.info(`STARTING WS CLIENT AT: "ws://${address}:${port}?identity=avme-plugin"`);
    const ethProvider = require('eth-provider');
    const provider = ethProvider(`ws://${address}:${port}?identity=avme-plugin`);
    const subs = {};
    const pending = {};

    const getOrigin = url => {
        const path = url.split('/')
        return path[0] + '//' + path[2]
    }

    const pop = show => {
        if (show) chrome.browserAction.setPopup({ popup: 'pop.html' });
        else chrome.browserAction.setPopup({ popup: 'settings.html' });
    }
    
    pop(true);

    provider.on('connect', () => pop(false));
    provider.on('disconnect', () => pop(true));

    provider.connection.on('payload', payload => {
        console.log(payload);
        if (typeof payload.id !== 'undefined') {
            if (pending[payload.id]) {
                const { tabId, payloadId } = pending[payload.id]
                if (pending[payload.id].method === 'eth_subscribe' && payload.result) {
                    subs[payload.result] = { tabId, send: subload => chrome.tabs.sendMessage(tabId, subload) }
                }
                else if (pending[payload.id].method === 'eth_unsubscribe') {
                    const params = payload.params ? [].concat(payload.params) : []
                    params.forEach(sub => delete subs[sub])
                }
                chrome.tabs.sendMessage(tabId, Object.assign({}, payload, { id: payloadId }))
                delete pending[payload.id]
            }
        }
        else if (payload.method && payload.method.indexOf('_subscription') > -1 && subs[payload.params.subscription])
        {   // Emit subscription result to tab
            subs[payload.params.subscription].send(payload)
        }
    })

    chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
        // console.log('ESSE FDP TA DISPARANDO MAIS REQUEST');
        if (payload.method === 'wallet_call') return provider.connection.send(payload)
        const id = provider.nextId++
        pending[id] = { tabId: sender.tab.id, payloadId: payload.id, method: payload.method }
        const load = Object.assign({}, payload, { id, __frameOrigin: getOrigin(sender.url) })
        provider.connection.send(load)
    })

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            console.log(
                `Storage key "${key}" in namespace "${namespace}" changed.`,
                `Old value was "${oldValue}", new value is "${newValue}".`
            );
            if(key === 'address') address = newValue;
            if(key === 'port') port = newValue;
        }    
        //   provider.close();
        // console.log(provider);
        // if(provider.isConnected())
        // {
        //     console.info(`Closing Connection to... ${address}:${url}`);
        //     provider.close();
        // }
        provider.connection.close();
        startProviders({address,port});
    });
}


    // const ethProvider = require('eth-provider');

    // const getOrigin = url => {
    //     const path = url.split('/')
    //     return path[0] + '//' + path[2]
    // }

    // const pop = show => {
    //     if (show) chrome.browserAction.setPopup({ popup: 'pop.html' });
    //     else chrome.browserAction.setPopup({ popup: 'settings.html' });
    // }

    // const url = `ws://${address}:${port}?identity=avme-plugin`;
    // console.log(url);
    // const provider = ethProvider(`ws://${address}:${port}?identity=avme-plugin`);
    // // const provider = ethProvider(`ws://127.0.0.1:6969?identity=avme-plugin`);
    // const subs = {};
    // const pending = {};

    // pop(true);
    // provider.on('connect', () => pop(false));
    // provider.on('disconnect', () => pop(true));

    // provider.connection.on('payload', payload => {
    //     console.log(payload);
    //     if (typeof payload.id !== 'undefined') {
    //         if (pending[payload.id]) {
    //             const { tabId, payloadId } = pending[payload.id]
    //             if (pending[payload.id].method === 'eth_subscribe' && payload.result) {
    //                 subs[payload.result] = { tabId, send: subload => chrome.tabs.sendMessage(tabId, subload) }
    //             }
    //             else if (pending[payload.id].method === 'eth_unsubscribe') {
    //                 const params = payload.params ? [].concat(payload.params) : []
    //                 params.forEach(sub => delete subs[sub])
    //             }
    //             chrome.tabs.sendMessage(tabId, Object.assign({}, payload, { id: payloadId }))
    //             delete pending[payload.id]
    //         }
    //     }
    //     else if (payload.method && payload.method.indexOf('_subscription') > -1 && subs[payload.params.subscription])
    //     {   // Emit subscription result to tab
    //         subs[payload.params.subscription].send(payload)
    //     }
    // })

    // chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
    //     if (payload.method === 'wallet_call') return provider.connection.send(payload)
    //     const id = provider.nextId++
    //     pending[id] = { tabId: sender.tab.id, payloadId: payload.id, method: payload.method }
    //     const load = Object.assign({}, payload, { id, __frameOrigin: getOrigin(sender.url) })
    //     provider.connection.send(load)
    // })






    // chrome.browserAction.onClicked.addListener(tab => {
    //   if (provider.connected) {
    //     const load = { jsonrpc: '2.0', id: 1, method: 'wallet_call', params: [] }
    //     provider.connection.send(load)
    //   } else {
    //     if (provider && provider.close) provider.close()
    //     provider = ethProvider('ws://127.0.0.1:1248?identity=avme-plugin')
    //   }
    // })

    /*
    const unsubscribeTab = tabId => {
        Object.keys(pending).forEach(id => { if (pending[id].tabId === tabId) delete pending[id] })
        Object.keys(subs).forEach(sub => {
        if (subs[sub].tabId === tabId) {
            provider.send({ jsonrpc: '2.0', id: 1, method: 'eth_unsubscribe', params: [sub] })
            delete subs[sub]
        }
        })
    }

    chrome.tabs.onRemoved.addListener((tabId, removed) => unsubscribeTab(tabId))
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { if (changeInfo.url) unsubscribeTab(tabId) })
    */
