const EventEmitter = require('events')
const EthereumProvider = require('ethereum-provider')

class Connection extends EventEmitter {
  constructor () {
    super()
    window.addEventListener('message', event => {
      if (event && event.source === window && event.data && event.data.type === 'eth:payload') {
        this.emit('payload', event.data.payload)
      }
    })
    setTimeout(() => this.emit('connect'), 0)
  }

  send (payload) {
    window.postMessage({ type: 'eth:send', payload }, window.location.origin)
  }
}

let mmAppear = window.localStorage.getItem('__frameAppearAsMM__')

try {
  mmAppear = JSON.parse(mmAppear)
} catch (e) {
  mmAppear = false
}

if (mmAppear) {
  class MetaMaskProvider extends EthereumProvider {}

  try {
    window.ethereum = new MetaMaskProvider(new Connection())
    window.ethereum.isMetaMask = true
    window.ethereum._metamask = true
    window.ethereum.setMaxListeners(0)
  } catch (e) {
    console.error('Error:', e)
  }
} else {
  class ExtensionProvider extends EthereumProvider {}

  try {
    window.ethereum = new ExtensionProvider(new Connection())
    window.ethereum.isAvme = true
    window.ethereum.setMaxListeners(0)
  } catch (e) {
    console.error('Error:', e)
  }
}
