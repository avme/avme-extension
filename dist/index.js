(()=>{var e={312:(e,t,n)=>{const s=n(187);e.exports=class extends s{constructor(e,t,n){super(),this.targets=t,this.options=n,this.connections=e,this.connected=!1,this.status="loading",this.interval=n.interval||5e3,this.name=n.name||"default",this.inSetup=!0,this.connect()}connect(e=0){if(this.connection&&"connected"===this.connection.status&&e>=this.connection.index);else if(0===this.targets.length);else{const{protocol:t,location:n}=this.targets[e];this.connection=this.connections[t](n,this.options),this.connection.on("error",(t=>this.connected?this.listenerCount("error")?this.emit("error",t):void console.warn("eth-provider - Uncaught connection error: "+t.message):this.connectionError(e,t))),this.connection.on("close",(()=>{this.connected=!1,this.emitClose(),this.closing||this.refresh()})),this.connection.on("connect",(()=>{this.connection.target=this.targets[e],this.connection.index=e,this.targets[e].status=this.connection.status,this.connected=!0,this.inSetup=!1,this.emit("connect")})),this.connection.on("data",(e=>this.emit("data",e))),this.connection.on("payload",(e=>this.emit("payload",e)))}}refresh(e=this.interval){clearTimeout(this.connectTimer),this.connectTimer=setTimeout((()=>this.connect()),e)}connectionError(e,t){this.targets[e].status=t,this.targets.length-1===e?(this.inSetup=!1,this.refresh()):this.connect(++e)}emitClose(){this.emit("close")}close(){this.closing=!0,this.connection&&this.connection.close&&!this.connection.closed?this.connection.close():this.emit("close"),clearTimeout(this.connectTimer),clearTimeout(this.setupTimer)}error(e,t,n=-1){this.emit("payload",{id:e.id,jsonrpc:e.jsonrpc,error:{message:t,code:n}})}send(e){this.inSetup?this.setupTimer=setTimeout((()=>this.send(e)),100):this.connection.closed?this.error(e,"Not connected",4900):this.connection.send(e)}}},215:(e,t,n)=>{const s=n(433),i=n(487),r=n(746),o={ethereum:"undefined"!=typeof window&&void 0!==window.ethereum?window.ethereum:null,web3:"undefined"!=typeof window&&void 0!==window.web3?window.web3.currentProvider:null},c="undefined"!=typeof window&&void 0!==window.WebSocket?window.WebSocket:null,a="undefined"!=typeof window&&void 0!==window.XMLHttpRequest?window.XMLHttpRequest:null;o.ethereum&&(o.ethereum.__isProvider=!0);const h={injected:o.ethereum||n(713)(o.web3),ipc:n(195)("IPC connections are unavliable in the browser"),ws:n(397)(c),http:n(278)(a)};e.exports=(e,t)=>{!e||Array.isArray(e)||"object"!=typeof e||t||(t=e,e=void 0),e||(e=["injected","frame"]),t||(t={}),(e=[].concat(e)).forEach((e=>{if(e.startsWith("alchemy")&&!t.alchemyId)throw new Error("Alchemy was included as a connection target but no Alchemy project ID was passed in options e.g. { alchemyId: '123abc' }");if(e.startsWith("infura")&&!t.infuraId)throw new Error("Infura was included as a connection target but no Infura project ID was passed in options e.g. { infuraId: '123abc' }")}));const n=r(t);return i(h,s(e,n),t)}},278:(e,t,n)=>{const s=n(187),{v4:i}=n(614);let r;class o extends s{constructor(e,t,n){super(),r=e,this.options=n,this.connected=!1,this.subscriptions=!1,this.status="loading",this.url=t,this.pollId=i(),setTimeout((()=>this.create()),0),this._emit=(...e)=>this.closed?null:this.emit(...e)}create(){if(!r)return this._emit("error",new Error("No HTTP transport available"));this.on("error",(()=>{this.connected&&this.close()})),this.init()}init(){this.send({jsonrpc:"2.0",method:"net_version",params:[],id:1},((e,t)=>{if(e)return this._emit("error",e);this.connected=!0,this._emit("connect"),this.send({jsonrpc:"2.0",id:1,method:"eth_pollSubscriptions",params:[this.pollId,"immediate"]},((e,t)=>{e||(this.subscriptions=!0,this.pollSubscriptions())}))}))}pollSubscriptions(){this.send({jsonrpc:"2.0",id:1,method:"eth_pollSubscriptions",params:[this.pollId]},((e,t)=>{if(e)return this.subscriptionTimeout=setTimeout((()=>this.pollSubscriptions()),1e4),this._emit("error",e);this.closed||(this.subscriptionTimeout=this.pollSubscriptions()),t&&t.map((e=>{let t;try{t=JSON.parse(e)}catch(e){t=!1}return t})).filter((e=>e)).forEach((e=>this._emit("payload",e)))}))}close(){this.closed=!0,this._emit("close"),clearTimeout(this.subscriptionTimeout),this.removeAllListeners()}filterStatus(e){if(e.status>=200&&e.status<300)return e;const t=new Error(e.statusText);throw t.res=e,t.message}error(e,t,n=-1){this._emit("payload",{id:e.id,jsonrpc:e.jsonrpc,error:{message:t,code:n}})}send(e,t){if(this.closed)return this.error(e,"Not connected");if("eth_subscribe"===e.method){if(!this.subscriptions)return this.error(e,"Subscriptions are not supported by this HTTP endpoint");e.pollId=this.pollId}const n=new r;let s=!1;const i=(i,r)=>{if(!s)if(n.abort(),s=!0,t)t(i,r);else{const{id:t,jsonrpc:n}=e,s=i?{id:t,jsonrpc:n,error:{message:i.message,code:i.code}}:{id:t,jsonrpc:n,result:r};this._emit("payload",s)}};n.open("POST",this.url,!0),n.setRequestHeader("Content-Type","application/json"),n.timeout=6e4,n.onerror=i,n.ontimeout=i,n.onreadystatechange=()=>{if(4===n.readyState)try{const e=JSON.parse(n.responseText);i(e.error,e.result)}catch(e){i(e)}},n.send(JSON.stringify(e))}}e.exports=e=>(t,n)=>new o(e,t,n)},713:(e,t,n)=>{const s=n(187);class i extends s{constructor(e,t){super(),e?setTimeout((()=>this.emit("error",new Error("Injected web3 provider is not currently supported"))),0):setTimeout((()=>this.emit("error",new Error("No injected provider found"))),0)}}e.exports=e=>t=>new i(e,t)},195:(e,t,n)=>{const s=n(187);class i extends s{constructor(e){super(),setTimeout((()=>this.emit("error",new Error(e))),0)}}e.exports=e=>()=>new i(e)},397:(e,t,n)=>{const s=n(187),i=n(868);let r;class o extends s{constructor(e,t,n){super(),r=e,setTimeout((()=>this.create(t,n)),0)}create(e,t){r||this.emit("error",new Error("No WebSocket transport available"));try{this.socket=new r(e,[],{origin:t.origin})}catch(e){return this.emit("error",e)}this.socket.addEventListener("error",(e=>this.emit("error",e))),this.socket.addEventListener("open",(()=>{this.emit("connect"),this.socket.addEventListener("message",(e=>{const t="string"==typeof e.data?e.data:"";i(t,((e,t)=>{e||t.forEach((e=>{Array.isArray(e)?e.forEach((e=>this.emit("payload",e))):this.emit("payload",e)}))}))})),this.socket.addEventListener("close",(e=>this.onClose(e)))}))}onClose(e){this.socket=null,this.closed=!0,this.emit("close"),this.removeAllListeners()}close(){this.socket?this.socket.close():this.onClose()}error(e,t,n=-1){this.emit("payload",{id:e.id,jsonrpc:e.jsonrpc,error:{message:t,code:n}})}send(e){this.socket&&this.socket.readyState===this.socket.CONNECTING?setTimeout((t=>this.send(e)),10):!this.socket||this.socket.readyState>1?(this.connected=!1,this.error(e,"Not connected")):this.socket.send(JSON.stringify(e))}}e.exports=e=>(t,n)=>new o(e,t,n)},868:e=>{let t,n;e.exports=(e,s)=>{const i=[];e.replace(/\}[\n\r]?\{/g,"}|--|{").replace(/\}\][\n\r]?\[\{/g,"}]|--|[{").replace(/\}[\n\r]?\[\{/g,"}|--|[{").replace(/\}\][\n\r]?\{/g,"}]|--|{").split("|--|").forEach((e=>{let r;t&&(e=t+e);try{r=JSON.parse(e)}catch(i){return t=e,clearTimeout(n),void(n=setTimeout((()=>s(new Error("Parse response timeout"))),15e3))}clearTimeout(n),t=null,r&&i.push(r)})),s(null,i)}},746:e=>{e.exports=(e={})=>({injected:["injected"],frame:["ws://127.0.0.1:1248","http://127.0.0.1:1248"],direct:["ws://127.0.0.1:8546","http://127.0.0.1:8545"],infura:[`wss://mainnet.infura.io/ws/v3/${e.infuraId}`,`https://mainnet.infura.io/v3/${e.infuraId}`],alchemy:[`wss://eth-mainnet.ws.alchemyapi.io/v2/${e.alchemyId}`,`https://eth-mainnet.alchemyapi.io/v2/${e.alchemyId}`],infuraRopsten:[`wss://ropsten.infura.io/ws/v3/${e.infuraId}`,`https://ropsten.infura.io/v3/${e.infuraId}`],alchemyRopsten:[`wss://eth-ropsten.ws.alchemyapi.io/v2/${e.alchemyId}`,`https://eth-ropsten.alchemyapi.io/v2/${e.alchemyId}`],infuraRinkeby:[`wss://rinkeby.infura.io/ws/v3/${e.infuraId}`,`https://rinkeby.infura.io/v3/${e.infuraId}`],alchemyRinkeby:[`wss://eth-rinkeby.ws.alchemyapi.io/v2/${e.alchemyId}`,`https://eth-rinkeby.alchemyapi.io/v2/${e.alchemyId}`],infuraKovan:[`wss://kovan.infura.io/ws/v3/${e.infuraId}`,`https://kovan.infura.io/v3/${e.infuraId}`],alchemyKovan:[`wss://eth-kovan.ws.alchemyapi.io/v2/${e.alchemyId}`,`https://eth-kovan.alchemyapi.io/v2/${e.alchemyId}`],infuraGoerli:[`wss://goerli.infura.io/ws/v3/${e.infuraId}`,`https://goerli.infura.io/ws/v3/${e.infuraId}`],alchemyGoerli:[`wss://eth-goerli.ws.alchemyapi.io/v2/${e.alchemyId}`,`https://eth-goerli.alchemyapi.io/v2/${e.alchemyId}`],infuraPolygon:[`wss://polygon-mainnet.infura.io/ws/v3/${e.infuraId}`,`https://polygon-mainnet.infura.io/v3/${e.infuraId}`],infuraArbitrum:[`wss://arbitrum-mainnet.infura.io/ws/v3/${e.infuraId}`,`https://arbitrum-mainnet.infura.io/v3/${e.infuraId}`],infuraOptimism:[`wss://optimism-mainnet.infura.io/ws/v3/${e.infuraId}`,`https://optimism-mainnet.infura.io/v3/${e.infuraId}`],idChain:["wss://idchain.one/ws/"],xDai:["https://rpc.xdaichain.com","https://dai.poa.network"],optimism:["https://mainnet.optimism.io"]})},487:(e,t,n)=>{const s=n(187),i=n(202),r=n(312),o=e=>{function t(t){e.status=t,e instanceof s&&e.emit("status",t)}async function n(){try{await e.send("eth_syncing")&&t("syncing")}catch(e){}}async function i(){if(e.inSetup)return setTimeout(i,1e3);try{await e.send("eth_chainId"),t("connected"),setTimeout(n,500)}catch(e){t("disconnected")}}return t("loading"),i(),e.on("connect",(()=>i())),e.on("close",(()=>t("disconnected"))),e};e.exports=(e,t,n)=>{if(e.injected.__isProvider&&t.map((e=>e.type)).indexOf("injected")>-1)return delete e.injected.__isProvider,o(e.injected);const s=new i(new r(e,t,n));return s.setMaxListeners(128),o(s)}},433:e=>{const t=e=>"injected"===e?"injected":e.endsWith(".ipc")?"ipc":e.startsWith("wss://")||e.startsWith("ws://")?"ws":e.startsWith("https://")||e.startsWith("http://")?"http":"";e.exports=(e,n)=>[].concat(...[].concat(e).map((e=>n[e]?n[e].map((n=>({type:e,location:n,protocol:t(n)}))):{type:"custom",location:e,protocol:t(e)}))).filter((e=>!(!e.protocol&&"injected"!==e.type&&(console.log('eth-provider | Invalid provider preset/location: "'+e.location+'"'),1))))},202:(e,t,n)=>{const s=n(187);e.exports=class extends s{constructor(e){super(),this.enable=this.enable.bind(this),this._send=this._send.bind(this),this.send=this.send.bind(this),this._sendBatch=this._sendBatch.bind(this),this.subscribe=this.subscribe.bind(this),this.unsubscribe=this.unsubscribe.bind(this),this.sendAsync=this.sendAsync.bind(this),this.sendAsyncBatch=this.sendAsyncBatch.bind(this),this.isConnected=this.isConnected.bind(this),this.close=this.close.bind(this),this.request=this.request.bind(this),this.connected=!1,this.nextId=1,this.promises={},this.subscriptions=[],this.connection=e,this.connection.on("connect",(()=>this.checkConnection())),this.connection.on("close",(()=>{this.connected=!1,this.emit("close"),this.emit("disconnect")})),this.connection.on("payload",(e=>{const{id:t,method:n,error:s,result:i}=e;if(void 0!==t){if(this.promises[t]){const n=this.promises[t].method;if(n&&["eth_accounts","eth_requestAccounts"].includes(n)){const e=i||[];this.accounts=e,this.selectedAddress=e[0],this.coinbase=e[0]}e.error?this.promises[t].reject(s):this.promises[t].resolve(i),delete this.promises[t]}}else n&&n.indexOf("_subscription")>-1&&(this.emit(e.params.subscription,e.params.result),this.emit(n,e.params),this.emit("message",{type:e.method,data:{subscription:e.params.subscription,result:e.params.result}}),this.emit("data",e))})),this.on("newListener",((e,t)=>{"chainChanged"===e&&!this.attemptedChainSubscription&&this.connected?this.startChainSubscription():"accountsChanged"===e&&!this.attemptedAccountsSubscription&&this.connected?this.startAccountsSubscription():"networkChanged"===e&&!this.attemptedNetworkSubscription&&this.connected&&(this.startNetworkSubscription(),console.warn("The networkChanged event is being deprecated, use chainChainged instead"))}))}async checkConnection(e){if(!this.checkConnectionRunning&&!this.connected){this.checkConnectionRunning=!0;try{this.networkVersion=await this._send("net_version",[],!1),this.chainId=await this._send("eth_chainId",[],!1),this.checkConnectionRunning=!1,this.connected=!0,this.emit("connect",{chainId:this.chainId}),clearTimeout(this.checkConnectionTimer),this.listenerCount("networkChanged")&&!this.attemptedNetworkSubscription&&this.startNetworkSubscription(),this.listenerCount("chainChanged")&&!this.attemptedChainSubscription&&this.startNetworkSubscription(),this.listenerCount("accountsChanged")&&!this.attemptedAccountsSubscription&&this.startAccountsSubscription()}catch(t){e||setTimeout((()=>this.checkConnection(!0)),1e3),this.checkConnectionTimer=setInterval((()=>this.checkConnection(!0)),4e3),this.checkConnectionRunning=!1,this.connected=!1}}}async startNetworkSubscription(){this.attemptedNetworkSubscription=!0;try{const e=await this.subscribe("eth_subscribe","networkChanged");this.on(e,(e=>{this.networkVersion=e,this.emit("networkChanged",e)}))}catch(e){console.warn("Unable to subscribe to networkChanged",e)}}async startChainSubscription(){this.attemptedChainSubscription=!0;try{const e=await this.subscribe("eth_subscribe","chainChanged");this.on(e,(e=>{this.chainId=e,this.emit("chainChanged",e)}))}catch(e){console.warn("Unable to subscribe to chainChanged",e)}}async startAccountsSubscription(){this.attemptedAccountsSubscription=!0;try{const e=await this.subscribe("eth_subscribe","accountsChanged");this.on(e,(e=>{this.selectedAddress=e[0],this.emit("accountsChanged",e)}))}catch(e){console.warn("Unable to subscribe to accountsChanged",e)}}enable(){return new Promise(((e,t)=>{this._send("eth_accounts").then((n=>{if(n.length>0)this.accounts=n,this.selectedAddress=n[0],this.coinbase=n[0],this.emit("enable"),e(n);else{const e=new Error("User Denied Full Provider");e.code=4001,t(e)}})).catch(t)}))}_send(e,t=[],n=!0){const s=(n,s)=>{let i;"object"==typeof e&&null!==e?(i=e,i.params=i.params||[],i.jsonrpc="2.0",i.id=this.nextId++):i={jsonrpc:"2.0",id:this.nextId++,method:e,params:t},this.promises[i.id]={resolve:n,reject:s,method:e},i.method&&"string"==typeof i.method?i.params instanceof Array?this.connection.send(i):(this.promises[i.id].reject(new Error("Params is not a valid array.")),delete this.promises[i.id]):(this.promises[i.id].reject(new Error("Method is not a valid string.")),delete this.promises[i.id])};return this.connected||!n?new Promise(s):new Promise(((e,t)=>{const n=()=>(clearTimeout(i),e(new Promise(s))),i=setTimeout((()=>{this.off("connect",n),t(new Error("Not connected"))}),5e3);this.once("connect",n)}))}send(...e){return this._send(...e)}_sendBatch(e){return Promise.all(e.map((e=>this._send(e.method,e.params))))}subscribe(e,t,n=[]){return this._send(e,[t,...n]).then((e=>(this.subscriptions.push(e),e)))}unsubscribe(e,t){return this._send(e,[t]).then((e=>{if(e)return this.subscriptions=this.subscriptions.filter((e=>e!==t)),this.removeAllListeners(t),e}))}sendAsync(e,t){return t&&"function"==typeof t?e?(e.jsonrpc="2.0",e.id=e.id||this.nextId++,e instanceof Array?this.sendAsyncBatch(e,t):this._send(e.method,e.params).then((n=>{t(null,{id:e.id,jsonrpc:e.jsonrpc,result:n})})).catch((e=>{t(e)}))):t(new Error("Invalid Payload")):t(new Error("Invalid or undefined callback provided to sendAsync"))}sendAsyncBatch(e,t){return this._sendBatch(e).then((n=>{const s=n.map(((t,n)=>({id:e[n].id,jsonrpc:e[n].jsonrpc,result:t})));t(null,s)})).catch((e=>{t(e)}))}isConnected(){return this.connected}close(){this.connection&&this.connection.close&&this.connection.close(),this.connected=!1;const e=new Error("Provider closed, subscription lost, please subscribe again.");this.subscriptions.forEach((t=>this.emit(t,e))),this.subscriptions=[],this.chainId=void 0,this.networkVersion=void 0,this.selectedAddress=void 0}request(e){return this._send(e.method,e.params)}}},187:e=>{"use strict";var t,n="object"==typeof Reflect?Reflect:null,s=n&&"function"==typeof n.apply?n.apply:function(e,t,n){return Function.prototype.apply.call(e,t,n)};t=n&&"function"==typeof n.ownKeys?n.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var i=Number.isNaN||function(e){return e!=e};function r(){r.init.call(this)}e.exports=r,e.exports.once=function(e,t){return new Promise((function(n,s){function i(n){e.removeListener(t,r),s(n)}function r(){"function"==typeof e.removeListener&&e.removeListener("error",i),n([].slice.call(arguments))}f(e,t,r,{once:!0}),"error"!==t&&function(e,t,n){"function"==typeof e.on&&f(e,"error",t,{once:!0})}(e,i)}))},r.EventEmitter=r,r.prototype._events=void 0,r.prototype._eventsCount=0,r.prototype._maxListeners=void 0;var o=10;function c(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function a(e){return void 0===e._maxListeners?r.defaultMaxListeners:e._maxListeners}function h(e,t,n,s){var i,r,o,h;if(c(n),void 0===(r=e._events)?(r=e._events=Object.create(null),e._eventsCount=0):(void 0!==r.newListener&&(e.emit("newListener",t,n.listener?n.listener:n),r=e._events),o=r[t]),void 0===o)o=r[t]=n,++e._eventsCount;else if("function"==typeof o?o=r[t]=s?[n,o]:[o,n]:s?o.unshift(n):o.push(n),(i=a(e))>0&&o.length>i&&!o.warned){o.warned=!0;var d=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");d.name="MaxListenersExceededWarning",d.emitter=e,d.type=t,d.count=o.length,h=d,console&&console.warn&&console.warn(h)}return e}function d(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function u(e,t,n){var s={fired:!1,wrapFn:void 0,target:e,type:t,listener:n},i=d.bind(s);return i.listener=n,s.wrapFn=i,i}function l(e,t,n){var s=e._events;if(void 0===s)return[];var i=s[t];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?function(e){for(var t=new Array(e.length),n=0;n<t.length;++n)t[n]=e[n].listener||e[n];return t}(i):m(i,i.length)}function p(e){var t=this._events;if(void 0!==t){var n=t[e];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function m(e,t){for(var n=new Array(t),s=0;s<t;++s)n[s]=e[s];return n}function f(e,t,n,s){if("function"==typeof e.on)s.once?e.once(t,n):e.on(t,n);else{if("function"!=typeof e.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof e);e.addEventListener(t,(function i(r){s.once&&e.removeEventListener(t,i),n(r)}))}}Object.defineProperty(r,"defaultMaxListeners",{enumerable:!0,get:function(){return o},set:function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");o=e}}),r.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},r.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||i(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},r.prototype.getMaxListeners=function(){return a(this)},r.prototype.emit=function(e){for(var t=[],n=1;n<arguments.length;n++)t.push(arguments[n]);var i="error"===e,r=this._events;if(void 0!==r)i=i&&void 0===r.error;else if(!i)return!1;if(i){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var c=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw c.context=o,c}var a=r[e];if(void 0===a)return!1;if("function"==typeof a)s(a,this,t);else{var h=a.length,d=m(a,h);for(n=0;n<h;++n)s(d[n],this,t)}return!0},r.prototype.addListener=function(e,t){return h(this,e,t,!1)},r.prototype.on=r.prototype.addListener,r.prototype.prependListener=function(e,t){return h(this,e,t,!0)},r.prototype.once=function(e,t){return c(t),this.on(e,u(this,e,t)),this},r.prototype.prependOnceListener=function(e,t){return c(t),this.prependListener(e,u(this,e,t)),this},r.prototype.removeListener=function(e,t){var n,s,i,r,o;if(c(t),void 0===(s=this._events))return this;if(void 0===(n=s[e]))return this;if(n===t||n.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete s[e],s.removeListener&&this.emit("removeListener",e,n.listener||t));else if("function"!=typeof n){for(i=-1,r=n.length-1;r>=0;r--)if(n[r]===t||n[r].listener===t){o=n[r].listener,i=r;break}if(i<0)return this;0===i?n.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(n,i),1===n.length&&(s[e]=n[0]),void 0!==s.removeListener&&this.emit("removeListener",e,o||t)}return this},r.prototype.off=r.prototype.removeListener,r.prototype.removeAllListeners=function(e){var t,n,s;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[e]),this;if(0===arguments.length){var i,r=Object.keys(n);for(s=0;s<r.length;++s)"removeListener"!==(i=r[s])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=n[e]))this.removeListener(e,t);else if(void 0!==t)for(s=t.length-1;s>=0;s--)this.removeListener(e,t[s]);return this},r.prototype.listeners=function(e){return l(this,e,!0)},r.prototype.rawListeners=function(e){return l(this,e,!1)},r.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):p.call(e,t)},r.prototype.listenerCount=p,r.prototype.eventNames=function(){return this._eventsCount>0?t(this._events):[]}},614:(e,t,n)=>{"use strict";var s;n.r(t),n.d(t,{NIL:()=>E,parse:()=>v,stringify:()=>d,v1:()=>f,v3:()=>j,v4:()=>k,v5:()=>A,validate:()=>c,version:()=>T});var i=new Uint8Array(16);function r(){if(!s&&!(s="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto)))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return s(i)}const o=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,c=function(e){return"string"==typeof e&&o.test(e)};for(var a=[],h=0;h<256;++h)a.push((h+256).toString(16).substr(1));const d=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=(a[e[t+0]]+a[e[t+1]]+a[e[t+2]]+a[e[t+3]]+"-"+a[e[t+4]]+a[e[t+5]]+"-"+a[e[t+6]]+a[e[t+7]]+"-"+a[e[t+8]]+a[e[t+9]]+"-"+a[e[t+10]]+a[e[t+11]]+a[e[t+12]]+a[e[t+13]]+a[e[t+14]]+a[e[t+15]]).toLowerCase();if(!c(n))throw TypeError("Stringified UUID is invalid");return n};var u,l,p=0,m=0;const f=function(e,t,n){var s=t&&n||0,i=t||new Array(16),o=(e=e||{}).node||u,c=void 0!==e.clockseq?e.clockseq:l;if(null==o||null==c){var a=e.random||(e.rng||r)();null==o&&(o=u=[1|a[0],a[1],a[2],a[3],a[4],a[5]]),null==c&&(c=l=16383&(a[6]<<8|a[7]))}var h=void 0!==e.msecs?e.msecs:Date.now(),f=void 0!==e.nsecs?e.nsecs:m+1,v=h-p+(f-m)/1e4;if(v<0&&void 0===e.clockseq&&(c=c+1&16383),(v<0||h>p)&&void 0===e.nsecs&&(f=0),f>=1e4)throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");p=h,m=f,l=c;var y=(1e4*(268435455&(h+=122192928e5))+f)%4294967296;i[s++]=y>>>24&255,i[s++]=y>>>16&255,i[s++]=y>>>8&255,i[s++]=255&y;var b=h/4294967296*1e4&268435455;i[s++]=b>>>8&255,i[s++]=255&b,i[s++]=b>>>24&15|16,i[s++]=b>>>16&255,i[s++]=c>>>8|128,i[s++]=255&c;for(var w=0;w<6;++w)i[s+w]=o[w];return t||d(i)},v=function(e){if(!c(e))throw TypeError("Invalid UUID");var t,n=new Uint8Array(16);return n[0]=(t=parseInt(e.slice(0,8),16))>>>24,n[1]=t>>>16&255,n[2]=t>>>8&255,n[3]=255&t,n[4]=(t=parseInt(e.slice(9,13),16))>>>8,n[5]=255&t,n[6]=(t=parseInt(e.slice(14,18),16))>>>8,n[7]=255&t,n[8]=(t=parseInt(e.slice(19,23),16))>>>8,n[9]=255&t,n[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,n[11]=t/4294967296&255,n[12]=t>>>24&255,n[13]=t>>>16&255,n[14]=t>>>8&255,n[15]=255&t,n};function y(e,t,n){function s(e,s,i,r){if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));for(var t=[],n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof s&&(s=v(s)),16!==s.length)throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");var o=new Uint8Array(16+e.length);if(o.set(s),o.set(e,s.length),(o=n(o))[6]=15&o[6]|t,o[8]=63&o[8]|128,i){r=r||0;for(var c=0;c<16;++c)i[r+c]=o[c];return i}return d(o)}try{s.name=e}catch(e){}return s.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",s.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",s}function b(e){return 14+(e+64>>>9<<4)+1}function w(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function g(e,t,n,s,i,r){return w((o=w(w(t,e),w(s,r)))<<(c=i)|o>>>32-c,n);var o,c}function _(e,t,n,s,i,r,o){return g(t&n|~t&s,e,t,i,r,o)}function I(e,t,n,s,i,r,o){return g(t&s|n&~s,e,t,i,r,o)}function C(e,t,n,s,i,r,o){return g(t^n^s,e,t,i,r,o)}function S(e,t,n,s,i,r,o){return g(n^(t|~s),e,t,i,r,o)}const j=y("v3",48,(function(e){if("string"==typeof e){var t=unescape(encodeURIComponent(e));e=new Uint8Array(t.length);for(var n=0;n<t.length;++n)e[n]=t.charCodeAt(n)}return function(e){for(var t=[],n=32*e.length,s="0123456789abcdef",i=0;i<n;i+=8){var r=e[i>>5]>>>i%32&255,o=parseInt(s.charAt(r>>>4&15)+s.charAt(15&r),16);t.push(o)}return t}(function(e,t){e[t>>5]|=128<<t%32,e[b(t)-1]=t;for(var n=1732584193,s=-271733879,i=-1732584194,r=271733878,o=0;o<e.length;o+=16){var c=n,a=s,h=i,d=r;n=_(n,s,i,r,e[o],7,-680876936),r=_(r,n,s,i,e[o+1],12,-389564586),i=_(i,r,n,s,e[o+2],17,606105819),s=_(s,i,r,n,e[o+3],22,-1044525330),n=_(n,s,i,r,e[o+4],7,-176418897),r=_(r,n,s,i,e[o+5],12,1200080426),i=_(i,r,n,s,e[o+6],17,-1473231341),s=_(s,i,r,n,e[o+7],22,-45705983),n=_(n,s,i,r,e[o+8],7,1770035416),r=_(r,n,s,i,e[o+9],12,-1958414417),i=_(i,r,n,s,e[o+10],17,-42063),s=_(s,i,r,n,e[o+11],22,-1990404162),n=_(n,s,i,r,e[o+12],7,1804603682),r=_(r,n,s,i,e[o+13],12,-40341101),i=_(i,r,n,s,e[o+14],17,-1502002290),n=I(n,s=_(s,i,r,n,e[o+15],22,1236535329),i,r,e[o+1],5,-165796510),r=I(r,n,s,i,e[o+6],9,-1069501632),i=I(i,r,n,s,e[o+11],14,643717713),s=I(s,i,r,n,e[o],20,-373897302),n=I(n,s,i,r,e[o+5],5,-701558691),r=I(r,n,s,i,e[o+10],9,38016083),i=I(i,r,n,s,e[o+15],14,-660478335),s=I(s,i,r,n,e[o+4],20,-405537848),n=I(n,s,i,r,e[o+9],5,568446438),r=I(r,n,s,i,e[o+14],9,-1019803690),i=I(i,r,n,s,e[o+3],14,-187363961),s=I(s,i,r,n,e[o+8],20,1163531501),n=I(n,s,i,r,e[o+13],5,-1444681467),r=I(r,n,s,i,e[o+2],9,-51403784),i=I(i,r,n,s,e[o+7],14,1735328473),n=C(n,s=I(s,i,r,n,e[o+12],20,-1926607734),i,r,e[o+5],4,-378558),r=C(r,n,s,i,e[o+8],11,-2022574463),i=C(i,r,n,s,e[o+11],16,1839030562),s=C(s,i,r,n,e[o+14],23,-35309556),n=C(n,s,i,r,e[o+1],4,-1530992060),r=C(r,n,s,i,e[o+4],11,1272893353),i=C(i,r,n,s,e[o+7],16,-155497632),s=C(s,i,r,n,e[o+10],23,-1094730640),n=C(n,s,i,r,e[o+13],4,681279174),r=C(r,n,s,i,e[o],11,-358537222),i=C(i,r,n,s,e[o+3],16,-722521979),s=C(s,i,r,n,e[o+6],23,76029189),n=C(n,s,i,r,e[o+9],4,-640364487),r=C(r,n,s,i,e[o+12],11,-421815835),i=C(i,r,n,s,e[o+15],16,530742520),n=S(n,s=C(s,i,r,n,e[o+2],23,-995338651),i,r,e[o],6,-198630844),r=S(r,n,s,i,e[o+7],10,1126891415),i=S(i,r,n,s,e[o+14],15,-1416354905),s=S(s,i,r,n,e[o+5],21,-57434055),n=S(n,s,i,r,e[o+12],6,1700485571),r=S(r,n,s,i,e[o+3],10,-1894986606),i=S(i,r,n,s,e[o+10],15,-1051523),s=S(s,i,r,n,e[o+1],21,-2054922799),n=S(n,s,i,r,e[o+8],6,1873313359),r=S(r,n,s,i,e[o+15],10,-30611744),i=S(i,r,n,s,e[o+6],15,-1560198380),s=S(s,i,r,n,e[o+13],21,1309151649),n=S(n,s,i,r,e[o+4],6,-145523070),r=S(r,n,s,i,e[o+11],10,-1120210379),i=S(i,r,n,s,e[o+2],15,718787259),s=S(s,i,r,n,e[o+9],21,-343485551),n=w(n,c),s=w(s,a),i=w(i,h),r=w(r,d)}return[n,s,i,r]}(function(e){if(0===e.length)return[];for(var t=8*e.length,n=new Uint32Array(b(t)),s=0;s<t;s+=8)n[s>>5]|=(255&e[s/8])<<s%32;return n}(e),8*e.length))})),k=function(e,t,n){var s=(e=e||{}).random||(e.rng||r)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,t){n=n||0;for(var i=0;i<16;++i)t[n+i]=s[i];return t}return d(s)};function x(e,t,n,s){switch(e){case 0:return t&n^~t&s;case 1:return t^n^s;case 2:return t&n^t&s^n&s;case 3:return t^n^s}}function L(e,t){return e<<t|e>>>32-t}const A=y("v5",80,(function(e){var t=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){var s=unescape(encodeURIComponent(e));e=[];for(var i=0;i<s.length;++i)e.push(s.charCodeAt(i))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);for(var r=e.length/4+2,o=Math.ceil(r/16),c=new Array(o),a=0;a<o;++a){for(var h=new Uint32Array(16),d=0;d<16;++d)h[d]=e[64*a+4*d]<<24|e[64*a+4*d+1]<<16|e[64*a+4*d+2]<<8|e[64*a+4*d+3];c[a]=h}c[o-1][14]=8*(e.length-1)/Math.pow(2,32),c[o-1][14]=Math.floor(c[o-1][14]),c[o-1][15]=8*(e.length-1)&4294967295;for(var u=0;u<o;++u){for(var l=new Uint32Array(80),p=0;p<16;++p)l[p]=c[u][p];for(var m=16;m<80;++m)l[m]=L(l[m-3]^l[m-8]^l[m-14]^l[m-16],1);for(var f=n[0],v=n[1],y=n[2],b=n[3],w=n[4],g=0;g<80;++g){var _=Math.floor(g/20),I=L(f,5)+x(_,v,y,b)+w+t[_]+l[g]>>>0;w=b,b=y,y=L(v,30)>>>0,v=f,f=I}n[0]=n[0]+f>>>0,n[1]=n[1]+v>>>0,n[2]=n[2]+y>>>0,n[3]=n[3]+b>>>0,n[4]=n[4]+w>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]})),E="00000000-0000-0000-0000-000000000000",T=function(e){if(!c(e))throw TypeError("Invalid UUID");return parseInt(e.substr(14,1),16)}}},t={};function n(s){var i=t[s];if(void 0!==i)return i.exports;var r=t[s]={exports:{}};return e[s](r,r.exports,n),r.exports}n.d=(e,t)=>{for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;chrome.browserAction.setPopup({popup:"index.html"}),new Promise((async e=>{let t,n;await chrome.storage.sync.get(["address"],(async e=>{void 0===e.address?(t="127.0.0.1",chrome.storage.sync.set({address:t})):t=e.address})),await chrome.storage.sync.get(["port"],(async s=>{void 0===s.port?(n=4812,chrome.storage.sync.set({port:n})):n=s.port,e({address:t,port:n})}))})).then((e=>{s(e)}));const t=t=>{e=t.toString(),chrome.storage.local.set({isConnected:t}),chrome.tabs.query({},(e=>{e.forEach((e=>{e.url.match(/^(?=(^http|^https))(?!(.*mozilla))/i)&&chrome.tabs.executeScript(e.id,{code:"localStorage['__avmePlugin__']"},(n=>{"true"==n&&(chrome.tabs.executeScript(e.id,{code:`localStorage.setItem('__isConnected__', ${JSON.stringify(t)});`}),chrome.tabs.reload(e.id))}))}))}))};t(!1);const s=e=>{let{address:i,port:r}=e;const o=n(215)([`ws://${i}:${r}?identity=avme-plugin`,`http://${i}:${r}?identity=avme-plugin`]),c={},a={},h=e=>{const t=e.split("/");return t[0]+"//"+t[2]};o.on("connect",(()=>{t(!0),console.log(`Connected to ${i}:${r}`)})),o.on("disconnect",(()=>t(!1))),o.connection.on("payload",(e=>{if(void 0!==e.id){if(a[e.id]){const{tabId:t,payloadId:n}=a[e.id];"eth_subscribe"===a[e.id].method&&e.result?c[e.result]={tabId:t,send:e=>chrome.tabs.sendMessage(t,e)}:"eth_unsubscribe"===a[e.id].method&&(e.params?[].concat(e.params):[]).forEach((e=>delete c[e])),chrome.tabs.sendMessage(t,Object.assign({},e,{id:n})),delete a[e.id]}}else e.method&&e.method.indexOf("_subscription")>-1&&c[e.params.subscription]&&c[e.params.subscription].send(e)})),chrome.runtime.onMessage.addListener(((e,t,n)=>{if("wallet_call"===e.method)return o.connection.send(e);const s=o.nextId++;a[s]={tabId:t.tab.id,payloadId:e.id,method:e.method};const i=Object.assign({},e,{id:s,__frameOrigin:h(t.url)});o.connection.send(i)})),chrome.storage.onChanged.addListener((function(e,t){let n=!1;for(let[t,{oldValue:s,newValue:o}]of Object.entries(e))"address"===t?(i=o,n=!0):"port"===t&&(r=o,n=!0);n&&(o.connection.close(),s({address:i,port:r}))}))};chrome.tabs.onUpdated.addListener(((t,n,s)=>{"complete"==n.status&&chrome.tabs.executeScript(t,{code:"localStorage['__avmePlugin__']"},(n=>{"true"==n[0]&&chrome.tabs.executeScript(t,{code:"localStorage['__isConnected__']"},(t=>{e!=t[0]&&(chrome.tabs.executeScript(s.id,{code:`localStorage.setItem('__isConnected__', ${JSON.stringify(e)});`}),chrome.tabs.reload(s.id))}))}))}))})()})();