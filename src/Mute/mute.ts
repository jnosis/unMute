import { browser } from '../Api/api';
import { AutoMode } from '../types/types';

export default abstract class Mute {
  static async toggleMute(tabId: number) {
    const tab = await browser.tabs.get(tabId);
    let muted = !tab.mutedInfo?.muted;
    console.trace(`Toggling current tab: ${muted}`);
    browser.tabs.update(tabId, { muted });
  }
  static async toggleAllTab() {
    const tabs = await browser.tabs.query({ audible: true });
    console.trace(`Toggling all tabs`);
    tabs.forEach((tab) => tab.id && this.toggleMute(tab.id));
  }

  static async doAutoMute(mode: AutoMode, tabId?: number, hiddenId?: number) {
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
      case 'fixOR':
        this.doFixOrRecentMode(tabId, hiddenId);
        break;
      case 'fixOC':
        this.doFixOrCurrentMode(tabId);
        break;

      default:
        throw new Error(`Unavailable AutoMode: ${mode}`);
    }
  }
  static async doCurrentMode() {
    const tabs = await browser.tabs.query({ audible: true });
    const [currentTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    console.trace(`Do current mode: ${currentTab}`);
    if (currentTab?.id) {
      const currentTabId = currentTab.id;
      tabs
        .map((tab) => tab.id)
        .forEach((id) =>
          browser.tabs.update(id as number, { muted: id !== currentTabId })
        );
    }
  }
  static async doRecentMode(recentTabId?: number) {
    console.trace(`Do recent mode: ${recentTabId}`);
    const tabs = await browser.tabs.query({ audible: true });
    tabs
      .map((tab) => tab.id)
      .forEach((id) =>
        browser.tabs.update(id as number, { muted: id !== recentTabId })
      );
  }
  static async doFixMode(fixedTabId?: number) {
    console.trace(`Do fix mode: ${fixedTabId}`);
    const tabs = await browser.tabs.query({ audible: true });
    tabs
      .map((tab) => tab.id)
      .forEach((id) =>
        browser.tabs.update(id as number, { muted: id !== fixedTabId })
      );
  }
  static async doAllMode() {
    console.trace(`Do all mode`);
    const tabs = await browser.tabs.query({ audible: true, muted: false });
    tabs
      .map((tab) => tab.id)
      .forEach((id) => browser.tabs.update(id as number, { muted: true }));
  }
  static async releaseAllMute() {
    const tabs = await browser.tabs.query({ audible: true, muted: true });
    tabs.forEach(
      (tab) => tab.id && browser.tabs.update(tab.id, { muted: false })
    );
  }

  static async doFixOrRecentMode(fixedTabId?: number, recentTabId?: number) {
    console.trace(`Do fix or recent mode: ${fixedTabId}, ${recentTabId}`);
    const tabs = await browser.tabs.query({ audible: true });
    tabs
      .map((tab) => tab.id)
      .forEach((id) =>
        browser.tabs.update(id as number, {
          muted: id !== fixedTabId && id !== recentTabId,
        })
      );
  }
  static async doFixOrCurrentMode(fixedTabId?: number) {
    console.trace(`Do fix or current mode: ${fixedTabId}`);
    const tabs = await browser.tabs.query({ audible: true });
    const [currentTab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    let currentTabId = currentTab ? currentTab.id : undefined;

    tabs
      .map((tab) => tab.id)
      .forEach((id) =>
        browser.tabs.update(id as number, {
          muted: id !== fixedTabId && id !== currentTabId,
        })
      );
  }
}
