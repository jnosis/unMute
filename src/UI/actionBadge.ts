import { browser } from '../Api/api';
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
    browser.action.setBadgeText({ text: '' });
    const tabs = await browser.tabs.query({});
    tabs.forEach((tab) => {
      if (tab.audible) {
        tab.id && browser.action.enable(tab.id);
      } else {
        tab.id && browser.action.disable(tab.id);
      }
    });
  }

  private static async updateToggleAllTabs(autoState: boolean) {
    console.trace(`Update action: toggleAllTabs: ${autoState}`);
    browser.action.setBadgeText({ text: '' });
    const tabs = await browser.tabs.query({});
    if (!autoState) {
      tabs.forEach((tab) => tab.id && browser.action.enable(tab.id));
    } else {
      tabs.forEach((tab) => tab.id && browser.action.disable(tab.id));
    }
  }

  private static async updateAutoMute(autoState: boolean) {
    console.trace(`Update action: autoState: ${autoState}`);
    const tabs = await browser.tabs.query({});
    const color: Color = autoState ? this.green : this.red;
    const text: 'on' | 'off' = autoState ? 'on' : 'off';
    tabs.forEach((tab) => {
      const tabId = tab.id;
      if (tabId) {
        browser.action.enable(tabId);
        browser.action.setBadgeBackgroundColor({ color, tabId });
      }
    });
    browser.action.setBadgeText({ text });
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

    const tabs = await browser.tabs.query({});
    const color: Color = autoState ? this.green : this.red;
    tabs.forEach((tab) => {
      const tabId = tab.id;
      if (tabId) {
        browser.action.enable(tabId);
        browser.action.setBadgeBackgroundColor({ color, tabId });
      }
    });
    browser.action.setBadgeText({ text });
  }

  private static async updateFixTab(
    autoMode: AutoMode,
    autoState: boolean,
    fixTabId?: number
  ) {
    console.trace(`Update action: fixTab: ${fixTabId}`);
    const tabs = await browser.tabs.query({});
    if (autoState && autoMode === 'fix') {
      tabs.forEach((tab) => {
        const tabId = tab.id;
        const color: Color = tabId === fixTabId ? this.green : this.red;
        if (tabId) {
          browser.action.enable(tabId);
          browser.action.setBadgeBackgroundColor({ color, tabId });
        }
      });
    } else {
      tabs.forEach((tab) => {
        const tabId = tab.id;
        const color: Color = this.grey;
        if (tabId) {
          browser.action.setBadgeBackgroundColor({ color, tabId });
          browser.action.disable(tabId);
        }
      });
    }
    browser.action.setBadgeText({ text: 'fix' });
  }
}
