export const data : string[] = [
  'div[id*="vdo_ads_player_ai"]:not([data-replaced="true"])',
  'div[id*="_ad_"]:not([data-replaced="true"])',
  'vdo:not([data-replaced="true"])',
]

export const iframedata : string[] = [
  'iframe[aria-label="Advertisement"]:not([data-replaced="true"])',
  'iframe[src*="doubleclick.net"]:not([data-replaced="true"])',
  'iframe[src*="adsystem"]:not([data-replaced="true"])',
  'iframe[id^="google_ads_iframe_"]:not([data-replaced="true"])',
  'iframe[name*="nlpcaptcha"]:not([data-replaced="true"])',
]

export const getReplacementContent = (description: string) => {
  
  return `
      <p style="margin: 0px 10px;" class="icon-class">🎃</p>
      <span style="color: #fff; mix-blend-mode: difference;">${description}</span>
`
} 

export const setReplacementContentStyles = (element : HTMLDivElement) => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  const themeColor = themeColorMeta ? themeColorMeta.getAttribute('content') : null;
  element.style.width = "100%";
  element.style.padding = "8px";
  element.style.textAlign = "center";
  element.style.display = "flex";
  element.style.justifyContent = "center";
  element.style.alignItems = "center";
  element.style.backgroundColor = `${themeColor !== null ? themeColor : "#000"}`
}

export const convertToVampire = () => {
  const elements : NodeListOf<HTMLDivElement> = document.querySelectorAll('div[data-replaced="true"]');
  elements.forEach(element => {
    setReplacementContentStyles(element)
    element.style.filter = "grayscale(100%)";
  })
}

export const convertToExorcism = () => {
  const elements = document.querySelectorAll('div[data-replaced="true"]');
  elements.forEach(element => {
    element.setAttribute('style', 'display: none;')
  })
}

export const convertToDefault = () => {
  const elements : NodeListOf<HTMLDivElement> = document.querySelectorAll('div[data-replaced="true"]');
  elements.forEach(element => {
    setReplacementContentStyles(element);
    element.style.filter = "grayscale(0%)";
  })
}