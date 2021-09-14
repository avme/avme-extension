/* globals chrome */

const ethProvider = require('eth-provider')
const provider = ethProvider('ws://127.0.0.1:6969?identity=avme-plugin')
const subs = {}
const pending = {}

const getOrigin = url => {
  const path = url.split('/')
  return path[0] + '//' + path[2]
}

const pop = show => {
  if (show) {
    chrome.browserAction.setPopup({ popup: 'pop.html' })
  } else {
    chrome.browserAction.setPopup({ popup: 'settings.html' })
  }
}

pop(true)
provider.on('connect', () => pop(false))
provider.on('disconnect', () => pop(true))

provider.connection.on('payload', payload => {
  console.log(payload);
  if (typeof payload.id !== 'undefined') {
    if (pending[payload.id]) {
      const { tabId, payloadId } = pending[payload.id]
      if (pending[payload.id].method === 'eth_subscribe' && payload.result) {
        subs[payload.result] = { tabId, send: subload => chrome.tabs.sendMessage(tabId, subload) }
      } else if (pending[payload.id].method === 'eth_unsubscribe') {
        const params = payload.params ? [].concat(payload.params) : []
        params.forEach(sub => delete subs[sub])
      }
      chrome.tabs.sendMessage(tabId, Object.assign({}, payload, { id: payloadId }))
      delete pending[payload.id]
    }
  } else if (payload.method && payload.method.indexOf('_subscription') > -1 && subs[payload.params.subscription]) { // Emit subscription result to tab
    subs[payload.params.subscription].send(payload)
  }
})

chrome.runtime.onMessage.addListener((payload, sender, sendResponse) => {
  if (payload.method === 'wallet_call') return provider.connection.send(payload)
  const id = provider.nextId++
  pending[id] = { tabId: sender.tab.id, payloadId: payload.id, method: payload.method }
  const load = Object.assign({}, payload, { id, __frameOrigin: getOrigin(sender.url) })
  provider.connection.send(load)
})

// chrome.browserAction.onClicked.addListener(tab => {
//   if (provider.connected) {
//     const load = { jsonrpc: '2.0', id: 1, method: 'wallet_call', params: [] }
//     provider.connection.send(load)
//   } else {
//     if (provider && provider.close) provider.close()
//     provider = ethProvider('ws://127.0.0.1:1248?identity=avme-plugin')
//   }
// })

const unsubscribeTab = tabId => {
  Object.keys(pending).forEach(id => { if (pending[id].tabId === tabId) delete pending[id] })
  Object.keys(subs).forEach(sub => {
    if (subs[sub].tabId === tabId) {
      provider.send({ jsonrpc: '2.0', id: 1, method: 'eth_unsubscribe', params: [sub] })
      delete subs[sub]
    }
  })
}

chrome.tabs.onRemoved.addListener((tabId, removed) => unsubscribeTab(tabId))
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { if (changeInfo.url) unsubscribeTab(tabId) })
