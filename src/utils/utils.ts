export const data : string[] = [
  'div[data-google-query-id]:not([data-replaced="true"])',
  'div[id^="google_ads_iframe"]:not([data-replaced="true"])',
  'div[id^="_vdo_ads_player_ai"]:not([data-replaced="true"])',
  'iframe[aria-label="Advertisement"]:not([data-replaced="true"])',
  'iframe[src*="doubleclick.net"]:not([data-replaced="true"])',
  'iframe[src*="adsystem"]:not([data-replaced="true"])',
]

export const getReplacementContent = (description: string) => {
  
  return `
      <i class="icon-class">🔔</i>
      <span>${description}</span>
`
} 