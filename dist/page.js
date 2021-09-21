const dom = document;
const _find = document.querySelector.bind(dom);

const popupHeight = _find('#main').offsetHeight;

const sync = chrome.storage != undefined || chrome.storage != null ? true : false;

const isConnected = isConnected => {
    // alert("IS CONNECTED " + isConnected);
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
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.executeScript(tabs[0].id, { code: 'localStorage[\'__avmePlugin__\']' }, (results) => {
          let enabled = false;
          if (results) {
            try {
                enabled = JSON.parse(results[0]);
            } catch (e) {
                enabled = false;
            }
            chrome.tabs.executeScript(tabs[0].id, { code: `localStorage.setItem('__avmePlugin__', ${JSON.stringify(!enabled)}); window.location.reload();` });
          }
          window.close();
        })
      }
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

// _find('#toggle-extension').addEventListener("click", () => {
    // alert('lovin');
    ///If enabled then disable it, else enable it...

    // if(window.localStorage.getItem('extension-enabled') == 'true')
    // {
    //     window.localStorage.setItem('extension-enabled',false);
    //     _find('#toggle-extension').querySelector('IMG').src = './toggle-off.png';
    //     _find("#label-status").innerHTML = "Extension is now <span style=\"color: red;\">Disabled</span>";
    // }
    // else
    // {
    //     window.localStorage.setItem('extension-enabled',true);
    //     _find('#toggle-extension').querySelector('IMG').src = './toggle-on.png';
    //     _find("#label-status").innerHTML = "Loading...";
    // }
    // console.log(window.localStorage.getItem('extension-enabled'));
    
// });

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
    chrome.tabs.executeScript(tabs[0].id, { code: 'localStorage[\'__avmePlugin__\']' }, (results) => {
        let enabled = true;
        if (results) {
            try {
                enabled = JSON.parse(results[0]);
            } catch (e) {
                enabled = true;
            }
        }
        // enabled = enabled == null ? true : enabled;
        if(enabled == null)
        {
            enabled = true;
            chrome.tabs.executeScript(tabs[0].id, { code: `localStorage.setItem('__avmePlugin__', ${JSON.stringify(enabled)}); window.location.reload();` });
        }

        // const sub = document.getElementById('mmAppearSub');

        const image = _find('#toggle-extension').querySelector('IMG');
        const label = _find("#label-status");

        if (enabled) {
            image.src = './toggle-on.png';
            label.innerHTML = "Connected as <span class=\"metamask\">MetaMask</span>";
            // label.innerHTML = "Loading...";
        } else {
            image.src = './toggle-off.png';
            label.innerHTML = "Extension is now <span style=\"color: red;\">Disabled</span>";
        }
        // sub.innerHTML = `${getOrigin(tabs[0].url)}`
    })
  })

// if(window.localStorage.getItem('extension-enabled') == undefined) window.localStorage.setItem('extension-enabled', false);

// if(window.localStorage.getItem('extension-enabled') == 'true')
// {
//     _find('#toggle-extension').querySelector('IMG').src = './toggle-on.png';
//     _find("#label-status").innerHTML = "Loading...";
// }
// else
// {
//     _find('#toggle-extension').querySelector('IMG').src = './toggle-off.png';
//     _find("#label-status").innerHTML = "Extension is now <span style=\"color: red;\">Disabled</span>";
// }

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
