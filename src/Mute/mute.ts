import { Api } from '../Api/api';
import { AutoMode } from '../types/types';

export default abstract class Mute {
  static async toggleMute(tabId: number) {
    const tab = await Api.tabs.get(tabId);
    let muted = !tab.mutedInfo?.muted;
    console.trace(`Toggling current tab: ${muted}`);
    Api.tabs.update(tabId, { muted });
  }
  static async toggleAllTab() {
    const tabs = await Api.tabs.query({ audible: true });
    console.trace(`Toggling all tabs`);
    tabs.forEach((tab) => tab.id && this.toggleMute(tab.id));
  }

  static async doAutoMute(mode: AutoMode, tabId?: number) {
    console.trace(`Do auto mute: ${mode}, ${tabId}`);
    switch (mode) {
      case 'current':
        this.doCurrentMode();
        break;
      case 'recent':
        this.doRecentMode(tabId);
        break;
      case 'fix':
        this.doFixMode(tabId);
        break;
      case 'all':
        this.doAllMode();
        break;

      default:
        throw new Error(`Unavailable AutoMode: ${mode}`);
    }
  }
  static async doCurrentMode() {
    const tabs = await Api.tabs.query({ audible: true });
    const currentTabs = await Api.tabs.query({
      active: true,
      currentWindow: true,
    });
    const currentTab = currentTabs[0];
    console.trace(`Do current mode: ${currentTab}`);
    if (currentTab?.id) {
      const currentTabId = currentTab.id;
      tabs
        .map((tab) => tab.id)
        .forEach((id) =>
          Api.tabs.update(id as number, { muted: id !== currentTabId })
        );
    }
  }
  static async doRecentMode(recentTabId?: number) {
    console.trace(`Do recent mode: ${recentTabId}`);
    const tabs = await Api.tabs.query({ audible: true });
    tabs
      .map((tab) => tab.id)
      .forEach((id) =>
        Api.tabs.update(id as number, { muted: id !== recentTabId })
      );
  }
  static async doFixMode(fixedTabId?: number) {
    console.trace(`Do fix mode: ${fixedTabId}`);
    const tabs = await Api.tabs.query({ audible: true });
    tabs
      .map((tab) => tab.id)
      .forEach((id) =>
        Api.tabs.update(id as number, { muted: id !== fixedTabId })
      );
  }
  static async doAllMode() {
    console.trace(`Do all mode`);
    const tabs = await Api.tabs.query({ audible: true, muted: false });
    tabs
      .map((tab) => tab.id)
      .forEach((id) => Api.tabs.update(id as number, { muted: true }));
  }
  static async releaseAllMute() {
    const tabs = await Api.tabs.query({ audible: true, muted: true });
    tabs.forEach((tab) => tab.id && Api.tabs.update(tab.id, { muted: false }));
  }
}
