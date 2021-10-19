const fs = require('fs')
const path = require('path')
const ncp = require('ncp')

const inject = `
  var extension = String.raw\`${fs.readFileSync(path.join(__dirname, "../dist/extension.js")).toString()}\`
  try {
    chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => window.postMessage({type: 'eth:payload', payload: payload}, window.location.origin))
    window.addEventListener('message', event => {
      if (event.source === window && event.data && event.data.type === 'eth:send') chrome.runtime.sendMessage(event.data.payload)
    })
    let script = document.createElement('script')
    script.setAttribute('type', 'text/javascript')
    script.innerText = extension
    script.onload = function () { this.remove() }
    document.head ? document.head.prepend(script) : document.documentElement.prepend(script)
  } catch (e) {
    console.log(e)
  }
`
fs.writeFile(path.join(__dirname, '../dist-firefox/inject.js'), inject, err => { if (err) throw err })
const copy = files => files.forEach(file => fs.createReadStream(path.join(__dirname, file)).pipe(fs.createWriteStream(path.join(__dirname, '../dist-firefox/', file))))
copy(['./manifest.json', './index.html', './icon.png', './icon.png'])
ncp(path.join(__dirname, './icons'), path.join(__dirname, '../dist-firefox/icons'))
