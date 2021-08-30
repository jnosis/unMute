import { Api } from '../Api/api';
import { Option } from '../Option/option';
import { AutoMode, Color } from '../types/types';

export default abstract class ActionBadge {
  private static green: Color = '#579242';
  private static red: Color = '#9c2829';
  private static grey: Color = '#5f6368';
  static update(option: Option, fixTabId?: number) {
    console.trace(`Update action badge`);
    switch (option.actionMode) {
      case 'muteCurrentTab':
        this.updateMuteCurrentTab();
        break;
      case 'toggleAllTabs':
        this.updateToggleAllTabs(option.autoState);
        break;
      case 'autoMute':
        this.updateAutoMute(option.autoState);
        break;
      case 'autoMode':
        this.updateAutoMode(option.autoMode, option.autoState);
        break;
      case 'fixTab':
        this.updateFixTab(option.autoMode, option.autoState, fixTabId);
        break;

      default:
        throw new Error(`Unavailable actionMode: ${option.actionMode}`);
    }
  }

  private static async updateMuteCurrentTab() {
    console.trace(`Update action: muteCurrentTab`);
    chrome.browserAction.setBadgeText({ text: '' });
    const tabs = await Api.queryTabs({});
    tabs.forEach((tab) => {
      if (tab.audible) {
        tab.id && chrome.browserAction.enable(tab.id);
      } else {
        tab.id && chrome.browserAction.disable(tab.id);
      }
    });
  }

  private static async updateToggleAllTabs(autoState: boolean) {
    console.trace(`Update action: toggleAllTabs: ${autoState}`);
    chrome.browserAction.setBadgeText({ text: '' });
    const tabs = await Api.queryTabs({});
    if (!autoState) {
      tabs.forEach((tab) => tab.id && chrome.browserAction.enable(tab.id));
    } else {
      tabs.forEach((tab) => tab.id && chrome.browserAction.disable(tab.id));
    }
  }

  private static async updateAutoMute(autoState: boolean) {
    console.trace(`Update action: autoState: ${autoState}`);
    const tabs = await Api.queryTabs({});
    const color: Color = autoState ? this.green : this.red;
    const text: 'on' | 'off' = autoState ? 'on' : 'off';
    tabs.forEach((tab) => {
      const tabId = tab.id;
      if (tabId) {
        chrome.browserAction.enable(tabId);
        chrome.browserAction.setBadgeBackgroundColor({ color, tabId });
      }
    });
    chrome.browserAction.setBadgeText({ text });
  }

  private static async updateAutoMode(autoMode: AutoMode, autoState: boolean) {
    console.trace(`Update action: autoMode: ${autoMode}`);
    let text: string;
    switch (autoMode) {
      case 'current':
        text = 'C';
        break;
      case 'recent':
        text = 'R';
        break;
      case 'fix':
        text = 'F';
        break;
      case 'all':
        text = 'A';
        break;
      default:
        text = '';
        break;
    }

    const tabs = await Api.queryTabs({});
    const color: Color = autoState ? this.green : this.red;
    tabs.forEach((tab) => {
      const tabId = tab.id;
      if (tabId) {
        chrome.browserAction.enable(tabId);
        chrome.browserAction.setBadgeBackgroundColor({ color, tabId });
      }
    });
    chrome.browserAction.setBadgeText({ text });
  }

  private static async updateFixTab(
    autoMode: AutoMode,
    autoState: boolean,
    fixTabId?: number
  ) {
    console.trace(`Update action: fixTab: ${fixTabId}`);
    const tabs = await Api.queryTabs({});
    if (autoState && autoMode === 'fix') {
      tabs.forEach((tab) => {
        const tabId = tab.id;
        const color: Color = tabId === fixTabId ? this.green : this.red;
        if (tabId) {
          chrome.browserAction.enable(tabId);
          chrome.browserAction.setBadgeBackgroundColor({ color, tabId });
        }
      });
    } else {
      tabs.forEach((tab) => {
        const tabId = tab.id;
        const color: Color = this.grey;
        if (tabId) {
          chrome.browserAction.setBadgeBackgroundColor({ color, tabId });
          chrome.browserAction.disable(tabId);
        }
      });
    }
    chrome.browserAction.setBadgeText({ text: 'fix' });
  }
}
