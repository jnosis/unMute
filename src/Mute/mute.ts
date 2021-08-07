export default abstract class Mute {
  static async toggleMute(tabId: number) {
    const tab = await chrome.tabs.get(tabId);
    let muted = !tab.mutedInfo?.muted;
    chrome.tabs.update(tabId, { muted });
  }
  static async toggleAllTab() {
    const tabs = await chrome.tabs.query({ audible: true });
    tabs.forEach((tab) => tab.id && this.toggleMute(tab.id));
  }

  static async releaseAllMute() {
    const tabs = await chrome.tabs.query({ audible: true, muted: true });
    tabs.forEach(
      (tab) => tab.id && chrome.tabs.update(tab.id, { muted: false })
    );
  }
}
