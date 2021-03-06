const dom = document;
const _find = document.querySelector.bind(dom);

const popupHeight = _find('#main').offsetHeight;
const image = _find('#toggle-extension').querySelector('IMG');
const label = _find("#label-status");
const sync = chrome.storage != undefined || chrome.storage != null ? true : false;

const isConnected = isConnected => {
    if(isConnected) 
    {
        // _find("#label-connected").innerHTML = "<span class=\"avme\">Wallet</span> detected";
        _find("#label-connected").innerHTML = "";
        _find('#main').querySelector('.center-flex').style.marginTop = '0';
        _find("#toggle-extension").classList.remove("disabled");
    }
    else
    {
        _find("#label-connected").innerHTML = "<span class=\"avme\">AVME</span> Wallet wasn't detected.";
        _find('#main').querySelector('.center-flex').style.marginTop = '32px';
        _find("#toggle-extension").classList.add("disabled");
    }
}

const extensionToggle = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, currentTab => {
        let origin = getOrigin(currentTab[0].url);
        console.log(origin);
        ///Query of the current page extension
        chrome.tabs.executeScript(currentTab[0].id, { code: 'localStorage[\'__avmePlugin__\']' }, (currentResult) => {
            let enabled = false;
            console.log(`ENABLED IN THIS PAGE? ${currentResult}`);
            if(currentResult)
            {
                try {
                    enabled = JSON.parse(currentResult[0]);
                } catch (e) {
                    console.log("FAILED TO PARSE IF IT WAS ENABLED");
                    enabled = false;
                }
                console.log(`localStorage.setItem('__avmePlugin__', ${JSON.stringify(!enabled)});`);
                chrome.tabs.executeScript(currentTab[0].id, { code: `localStorage.setItem('__avmePlugin__', ${JSON.stringify(!enabled)});`});
                chrome.tabs.query({}, tabs => {
                    tabs.forEach(tab => {
                        if(tab.url.match("\\b"+origin+"\\b"))
                        {
                            chrome.tabs.reload(tab.id);
                        }
                    });
                });
                
                if (!enabled) {
                    image.src = './toggle-on.png';
                    label.innerHTML = "Connected as <span class=\"metamask\">MetaMask</span>";
                } else {
                    image.src = './toggle-off.png';
                    label.innerHTML = "Extension is now <span style=\"color: red;\">Disabled</span>";
                }
            }
        });
    });
}

var connected;

_find('#open-options').addEventListener("click", async () => {
    _find('#options-popup').classList.remove('disabled');
    if(sync)
    {
        await chrome.storage.sync.get(['address'], async ({address}) => {
            _find('#address').value = address;
        });
        await chrome.storage.sync.get(['port'], async ({port}) => {
            _find('#port').value = port;
        });
    }
    _find("#main").style.height = (_find('#options-popup').offsetHeight + 28) + "px";
});
    
_find('#close-options').addEventListener("click", () => {
    _find('#options-popup').classList.add('disabled');
    if(sync)
    {
        chrome.storage.sync.set({'address':_find('#address').value});
        chrome.storage.sync.set({'port':_find('#port').value});
    }
    
    _find("#main").style.height = popupHeight + "px";
});

_find('#toggle-extension').addEventListener("click", extensionToggle);

if (sync)
{
    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (let [key, { newValue }] of Object.entries(changes)) {
            if(key === 'isConnected' && namespace === 'local') isConnected(newValue);
        }    
    });
    new Promise(resolve => {
        chrome.storage.local.get(['isConnected'], ({isConnected}) => {
            resolve(isConnected);
        });
    }).then(res => {
        isConnected(res);
    });
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.executeScript(tabs[0].id, { code: 'localStorage[\'__avmePlugin__\']' }, (enabledInSite) => {
        chrome.tabs.executeScript(tabs[0].id, { code: 'localStorage[\'__isConnected__\']' }, (isConnected) => {
            let enabled = true;
            let connected = true;
            let first = false;
            if (enabledInSite) {
                try {
                    enabled = JSON.parse(enabledInSite[0]);
                } catch (e) {
                    enabled = true;
                    first = true;
                }
            }
            if (isConnected) {
                try {
                    connected = JSON.parse(isConnected[0]);
                } catch (e) {
                    connected = true;
                }
            }
            if(first)
            {
                enabled = true;
                chrome.tabs.executeScript(tabs[0].id, { code: `localStorage.setItem('__avmePlugin__', ${JSON.stringify(enabled)});` });
                chrome.tabs.reload(tabs[0].id);
            }

            if (enabled && connected) {
                image.src = './toggle-on.png';
                label.innerHTML = "Connected as <span class=\"metamask\">MetaMask</span>";
                // label.innerHTML = "Loading...";
            } else if (connected) {
                image.src = './toggle-off.png';
                label.innerHTML = "Extension is now <span style=\"color: red;\">Disabled</span>";
            } else if (enabled)
            {
                image.src = './toggle-off.png';
                label.innerHTML = "Couldn't find the <span class=\"avme\">Wallet</span>";
            }
        });
    });
});

const getOrigin = url => {
    const path = url.split('/')
    return path[0] + '//' + path[2]
}