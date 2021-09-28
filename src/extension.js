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
let isConnected = window.localStorage.getItem('__isConnected__');

try {
  extensionEnabled = JSON.parse(extensionEnabled);
} catch (e) {
  extensionEnabled = false;
}

try {
  isConnected = JSON.parse(isConnected);
} catch (e) {
  isConnected = false;
  window.localStorage.setItem('__isConnected__', JSON.stringify(false));
}

// if(isConnected != true)
// {
//   window.localStorage.setItem('__isConnected__', false);
// }

(async () =>{
  await detectEthereumProvider();
  if (extensionEnabled && isConnected) {
    class MetaMaskProvider extends EthereumProvider {}
    try {
      window.ethereum = new MetaMaskProvider(new Connection());
      window.ethereum.isAvmeExtension = true;
      window.ethereum.isMetaMask = true;
      window.ethereum._metamask = true;
      window.ethereum.setMaxListeners(0);
    } catch (e) {
      console.error('Error:', e)
    }
  }
  // else if(extensionEnabled == false && isConnected)
  // {
  //   window.localStorage.setItem('__isConnected__', JSON.stringify(false));
  // }
  
  
  // console.log("extensionEnabled");
  // console.log(extensionEnabled);
  // console.log("isConnected");
  // console.log(isConnected);

})();
