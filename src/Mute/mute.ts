export default abstract class Mute {
  static toggleMute(tabId: number) {
    chrome.tabs.get(tabId, async (tab: chrome.tabs.Tab) => {
      let muted = !tab.mutedInfo?.muted;
      await chrome.tabs.update(tabId, { muted });
    });
  }
}
