import { getAdDescription } from "./utils/utils";


const data : string[] = [
  'div[data-google-query-id]:not([data-replaced="true"])',
  'div[id^="google_ads_iframe"]:not([data-replaced="true"])',
  'div[id^="_vdo_ads_player_ai"]:not([data-replaced="true"])',
  'iframe[aria-label="Advertisement"]:not([data-replaced="true"])'
]


const replaceAds = () => {
  const selectors = data.join(',');
  const elements = document.querySelectorAll(selectors);

  elements.forEach((element) => {
    element.setAttribute('data-replaced', 'true');

    const replacementContent = document.createElement('div');
    replacementContent.innerHTML = `
      <i class="icon-class">🔔</i>
      <span>Loading description...</span>
    `;

    let adDescription = "Sorry! no description";

    if (element.tagName !== "IFRAME") {
      const iframe = element.querySelector('iframe');
      if (iframe) {
        try {
          const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
          const iframeImage = iframeDoc?.querySelector('img');

          if (iframeImage) {
            console.log('Image found inside iframe with src:', iframeImage.src);
            getAdDescription(iframeImage.src)
              .then((res) => {
                console.log("Ad description is:", res);
                adDescription = res;

                replacementContent.innerHTML = `
                  <i class="icon-class">🔔</i>
                  <span>${adDescription}</span>
                `;
              })
              .catch((err) => {
                console.error('Error fetching ad description:', err);
                replacementContent.innerHTML = `
                  <i class="icon-class">🔔</i>
                  <span>Sorry! no description</span>
                `;
              });
          }
        } catch (error) {
          console.error('Error accessing iframe content:', error);
          replacementContent.innerHTML = `
            <i class="icon-class">🔔</i>
            <span>Sorry! no description</span>
          `;
        }
      }
    }

    const imageEle = element.querySelector('img');
    if (imageEle) {
      console.log(imageEle.src);
    } else {
      replacementContent.innerHTML = `
        <i class="icon-class">🔔</i>
        <span>Sorry! no description</span>
      `;
    }

    element.replaceWith(replacementContent);
  });
};

const removeAds = () => {
  const selectors = data.join(',')
  const elements = document.querySelectorAll(selectors);
  elements.forEach(element => {
    element.remove()
  })
}

const observer = new MutationObserver(replaceAds);
observer.observe(document.body, { childList: true, subtree: true });

// import { checkAds } from "./utils/utils";
//
// const potentialAds = new Set<string>();
//
// // Monitor DOM changes
// const observer = new MutationObserver(mutations => {
//   mutations.forEach(mutation => {
//       mutation.addedNodes.forEach(node => {
//           if (node.nodeType === Node.ELEMENT_NODE) { // Ensure it's an element node
//               const tagName = node.tagName.toLowerCase();
//               if (tagName === 'div' || tagName === 'script') {
//                   const nodeId = node.id ? node.id : '';
//                   if(nodeId !== '') {
//                     potentialAds.add(nodeId)
//                   }
//               }
//           }
//       });
//   });
//   console.log("Potential Ads are: ", potentialAds)
// });
// observer.observe(document.body, { childList: true, subtree: true });
//
// const callGroq = async () => {
//   const idsArray: string[] = Array.from(potentialAds)
//   const response = await checkAds(idsArray)
//   const JSONresponse : string[] = await JSON.parse(response?.content)
//
//   JSONresponse.map(ad => {
//     document.querySelector()
//   }) 
//
//   console.log(JSONresponse)
// }
//
// window.addEventListener("load", () => [
//   callGroq()
// ])
//
// // Intercept Fetch and XHR
// const originalFetch = window.fetch;
// window.fetch = async (...args) => {
//   console.log(`Fetch Request: ${args[0]}`);
//   const response = await originalFetch(...args);
//   const clone = response.clone();
//   clone.text().then(text => console.log(`Response from ${args[0]}:`, text));
//   return response;
// };
//
// const originalXHR = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function (method, url) {
//   console.log(`XHR Request: ${method} ${url}`);
//   this.addEventListener('load', function () {
//       console.log(`Response from ${url}:`, this.responseText);
//   });
//   return originalXHR.apply(this, arguments);
// };
//
// // Override DOM modification methods
// const originalInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
// Object.defineProperty(Element.prototype, 'innerHTML', {
//   set(value) {
//       console.log('innerHTML set on', this, 'with value:', value);
//       originalInnerHTML.set.call(this, value);
//   },
//   get() {
//       return originalInnerHTML.get.call(this);
//   }
// });