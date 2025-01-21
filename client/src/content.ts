import { convertToDefault, convertToExorcism, convertToVampire, data, getReplacementContent, iframedata, setReplacementContentStyles } from "./utils/utils";
import { getAdDescription } from "./utils/ai";

// When the user clicks on changing the modes, it will send a signal here which will change the styling of the elements
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "changeMode") {
    console.log(`Mode changed to: ${message.mode}`);
    if(message.mode === "exorcism") {
      convertToExorcism();
    } else if(message.mode === "vampire") {
      convertToVampire();
    } else {
      convertToDefault()
    }
    sendResponse({ success: true });
  }
});

// Since mostly, advertisements are embedded through an iframe, checking these separately
const checkIframes = () => {
  const selectors = iframedata.join(',')
  const iframes = document.querySelectorAll<HTMLIFrameElement>(selectors);

  iframes.forEach((iframe) => {
    const replacementContent = document.createElement('div');
    replacementContent.setAttribute('data-replaced', 'true');
    replacementContent.setAttribute('aria-hidden', "true");
    setReplacementContentStyles(replacementContent)
    replacementContent.innerHTML = getReplacementContent("No halloween for this advertisement!");

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDoc) {
        const image = iframeDoc.querySelector<HTMLImageElement>('img');
        if(image) {
          console.log(`Iframe ID: ${iframe.id}, src: ${image.src}`);
            getAdDescription(image.src)
            .then((res) => {
              replacementContent.innerHTML = getReplacementContent(res)
            })
            .catch((err) => {
              console.error('Error fetching ad description:', err);
              replacementContent.innerHTML = getReplacementContent("Sorry! No description!")
            });
        }
      } else {
        console.error(`Could not access document of iframe with ID: ${iframe.id}`);
      }
    } catch (error) {
      console.error(`Error accessing iframe with ID: `,iframe.id, error);
    }
    
    // Helps with the spacing and the empty gap that would be present when the initial element is removed
    const parentElement = iframe.parentElement;
    if(parentElement && parentElement.id.startsWith('google_ads_iframe_')) parentElement.replaceWith(replacementContent);
    else iframe.replaceWith(replacementContent);
  });
}

// Checking any other elements that match the known selectors
const checkDivs = () => {
  const selectors = data.join(',');
  const elements = document.querySelectorAll<HTMLDivElement>(selectors)

  elements.forEach(ele => {
    const replacementContent = document.createElement('div');
    replacementContent.setAttribute('data-replaced', 'true');
    replacementContent.setAttribute('aria-hidden', "true");
    setReplacementContentStyles(replacementContent)
    replacementContent.innerHTML = getReplacementContent("No halloween for this advertisement!");
    ele.replaceWith(replacementContent)
  })
}

const replaceAds = () => {
  checkIframes()
  checkDivs()
}

// Would react to DOM changes since advertisements are embedded dynamically onto the websites
const observer = new MutationObserver(replaceAds);
observer.observe(document.body, { childList: true, subtree: true });