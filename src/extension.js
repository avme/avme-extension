const EventEmitter = require('events');
const EthereumProvider = require('ethereum-provider');
const detectEthereumProvider = require('@metamask/detect-provider');

class Connection extends EventEmitter {
  constructor () {
    super();
    window.addEventListener('message', event => {
      if (event && event.source === window && event.data && event.data.type === 'eth:payload') {
        this.emit('payload', event.data.payload)
      }
    })
    setTimeout(() => this.emit('connect'), 0);
  }

  send (payload) {
    window.postMessage({ type: 'eth:send', payload }, window.location.origin);
  }
}

let extensionEnabled = window.localStorage.getItem('__avmePlugin__');
let isConnected = window.localStorage.getItem('isConnected');

try {
  extensionEnabled = JSON.parse(extensionEnabled);
} catch (e) {
  extensionEnabled = false;
}
(async () =>{
  const provider = await detectEthereumProvider();
  if (extensionEnabled) {
    // alert(`extensionEnabled ${extensionEnabled}`);
    // setTimeout(()=>{
  
    
    
    
    // // From now on, this should always be true:
    // // provider === window.ethereum
    // startApp(provider); // initialize your app
    
    class MetaMaskProvider extends EthereumProvider {}
    try {
      window.ethereum = new MetaMaskProvider(new Connection());
      window.ethereum.isAvmeExtension = true;
      window.ethereum.isMetaMask = true;
      window.ethereum._metamask = true;
      window.ethereum.setMaxListeners(0);

      // alert(`injected`);
    } catch (e) {
      console.error('Error:', e)
    }
    // }, 250);
  }
})();
