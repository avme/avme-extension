const dom = document;
const _find = document.querySelector.bind(dom);

document.addEventListener('DOMContentLoaded', function () {

    const popupHeight = _find('#main').offsetHeight;

    const sync = chrome.storage != undefined || chrome.storage != null ? true : false;

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

    // _find('#close-popup').addEventListener("click", () => window.close());
});