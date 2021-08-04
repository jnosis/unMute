export default abstract class Mute {
  static toggleMute(tabId: number) {
    chrome.tabs.get(tabId, async (tab: chrome.tabs.Tab) => {
      let muted = !tab.mutedInfo?.muted;
      await chrome.tabs.update(tabId, { muted });
    });
  }
  static toggleAllTab() {
    chrome.tabs.query({ audible: true }, (tabs) => {
      tabs.forEach((tab) => tab.id && this.toggleMute(tab.id));
    });
  }

  static releaseAllMute() {
    chrome.tabs.query({ audible: true, muted: true }, (tabs) =>
      tabs.forEach(
        (tab) => tab.id && chrome.tabs.update(tab.id, { muted: false })
      )
    );
  }
}
