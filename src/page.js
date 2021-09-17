const dom = document;
const _find = document.querySelector.bind(dom);

const popupHeight = _find('#main').offsetHeight;

const sync = chrome.storage != undefined || chrome.storage != null ? true : false;

const isConnected = isConnected => {
    if(isConnected) _find("#label-status").innerHTML = "Connected as <span id=\"metamask\">MetaMask</span>";
    else _find("#label-status").innerHTML = "<span id=\"avme\">AVME</span> Wallet wasn't detected.";
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

if (sync)
{
    chrome.storage.onChanged.addListener((changes, namespace) => {
        for (let [key, { newValue }] of Object.entries(changes)) {
            if(key === 'isConnected') isConnected(newValue);
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



// isConnected(connected);
// alert(connected);
// new Promise(resolve => {
//     chrome.storage.local.get(['isConnected'], ({isConnected}) => {
//         resolve(isConnected);
//     });
// }).then(res => {
//     isConnected(res);
// });


// _find('#close-popup').addEventListener("click", () => window.close());
