const dom = document;
const _find = document.querySelector.bind(dom);

document.addEventListener('DOMContentLoaded', function () {

    _find('#options-popup').addEventListener("click", async () => {
        _find('.options').classList.remove('disabled');
        await chrome.storage.sync.get(['address'], async ({address}) => {
            _find('#address').value = address;
        });
        await chrome.storage.sync.get(['port'], async ({port}) => {
            _find('#port').value = port;
        });
    });
        
    _find('#close-options').addEventListener("click", () => {
        _find('.options').classList.add('disabled');
        chrome.storage.sync.set({'address':_find('#address').value});
        chrome.storage.sync.set({'port':_find('#port').value});
    });

    _find('#close-popup').addEventListener("click", () => window.close());
});