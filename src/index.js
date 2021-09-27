chrome.browserAction.setPopup({ popup: 'index.html' });

/*User settings*/

const init = new Promise(async (resolve) => {
    // console.log("INIT FOI CHAMADO");
    let address;
    let port;
    /// ADDRESS
    await chrome.storage.sync.get(['address'], async (result) => {

        // console.log(`result ${result.address}`)
        if(result.address === undefined)
        {
            address = '127.0.0.1';
            chrome.storage.sync.set({address});
        }
        else address = result.address;

        // console.log(`final param ${address}`);
    });

    /// PORT
    await chrome.storage.sync.get(['port'], async (result) => {

        // console.log(`result ${result.port}`)
        if(result.port === undefined)
        {
            port = 4812;
            chrome.storage.sync.set({port});
        }
        else port = result.port;

        // console.log(`final param ${port}`);

        resolve({address,port});
    });
})


init.then((url) => {
    startProviders(url);
});

const connected = isConnected => {
    chrome.storage.local.set({isConnected});
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            if(tab.url.match(/^http|https/i))
            {
            chrome.tabs.executeScript(tab.id,{code: 'localStorage[\'__avmePlugin__\']'},
                usingPlugin =>
                {
                    // console.log(`${usingPlugin}  :  ${tab.url}`);
                    if(usingPlugin == 'true')
                    {
                        chrome.tabs.executeScript(tab.id, {code : `localStorage.setItem('__isConnected__', ${JSON.stringify(isConnected)});`});
                        chrome.tabs.reload(tab.id);
                    }
                }
            )}
        });
        
    });
}

connected(false);

const startProviders = url => {
    let {address, port} = url;
    const identity = 'avme-plugin';
    // const identity = 'frame-extension';
    // console.info(`STARTING WS CLIENT AT: "ws://${address}:${port}?identity=${identity}"`);
    const ethProvider = require('eth-provider');
    const provider = ethProvider(`ws://${address}:${port}?identity=${identity}`);
    const subs = {};
    const pending = {};

    const getOrigin = url => {
        const path = url.split('/')
        return path[0] + '//' + path[2]
    }

    provider.on('connect', () => {
        connected(true);
        // console.log(`Connected to ${address}:${port}`);
    });

    provider.on('disconnect', () => connected(false));

    provider.connection.on('payload', payload => {
        // console.log(payload);
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
        if (payload.method === 'wallet_call') return provider.connection.send(payload)
        const id = provider.nextId++
        pending[id] = { tabId: sender.tab.id, payloadId: payload.id, method: payload.method }
        const load = Object.assign({}, payload, { id, __frameOrigin: getOrigin(sender.url) })
        provider.connection.send(load)
    })

    chrome.storage.onChanged.addListener(function (changes, namespace) {
        let shouldRestart = false;
        for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
            // console.log(
            //     `Storage key "${key}" in namespace "${namespace}" changed.`,
            //     `Old value was "${oldValue}", new value is "${newValue}".`
            // );
            if(key === 'address') 
            {
                address = newValue;
                shouldRestart = true;
            }
            else if(key === 'port')
            {
                port = newValue;
                shouldRestart = true;
            }
        }
        if(shouldRestart)
        {
            provider.connection.close();
            startProviders({address,port});
        }
    });
}
/// Listining if any page update

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     if(changeInfo.status == 'complete')
//     {
//         console.log(`TAB ID: ${tabId}`);
//         console.log(`changeInfo: ${JSON.stringify(changeInfo)}`);
//         console.log(`TAB: ${JSON.stringify(tab)}`);
//     }
// });
// chrome.tabs.query({}, (tabs) => {
//     console.log(tabs);
//     });