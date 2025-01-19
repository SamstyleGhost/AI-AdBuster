// import './index.css'
//
//
// setTimeout(() => {
//   const elements = document.querySelectorAll('div[id^="google_ads_iframe"]')
//   console.log(elements)
//   
//   for (let index = 0; index < elements.length; index++) {
//     const element = elements[index];
//     element.outerHTML = "Hello from this side"
//   }
// }, 5000)
// 

import { checkAds } from "./utils/utils";

const potentialAds = new Set<string>();

// Monitor DOM changes
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) { // Ensure it's an element node
              const tagName = node.tagName.toLowerCase();
              if (tagName === 'div' || tagName === 'script') {
                  const nodeId = node.id ? node.id : '';
                  if(nodeId !== '') {
                    potentialAds.add(nodeId)
                  }
              }
          }
      });
  });
  console.log("Potential Ads are: ", potentialAds)
});
observer.observe(document.body, { childList: true, subtree: true });

const callGroq = async () => {
  const idsArray: string[] = Array.from(potentialAds)
  const response = await checkAds(idsArray)
  const JSONresponse = await JSON.parse(response?.content)
  console.log(JSONresponse)
}

window.addEventListener("load", () => [
  callGroq()
])

// Intercept Fetch and XHR
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  console.log(`Fetch Request: ${args[0]}`);
  const response = await originalFetch(...args);
  const clone = response.clone();
  clone.text().then(text => console.log(`Response from ${args[0]}:`, text));
  return response;
};

const originalXHR = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
  console.log(`XHR Request: ${method} ${url}`);
  this.addEventListener('load', function () {
      console.log(`Response from ${url}:`, this.responseText);
  });
  return originalXHR.apply(this, arguments);
};

// Override DOM modification methods
const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
Object.defineProperty(Element.prototype, 'innerHTML', {
  set(value) {
      console.log('innerHTML set on', this, 'with value:', value);
      originalInnerHTML.set.call(this, value);
  },
  get() {
      return originalInnerHTML.get.call(this);
  }
});