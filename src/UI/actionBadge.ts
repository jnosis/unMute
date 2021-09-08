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
        this.updateMuteCurrentTab(option.autoState);
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

  private static async updateMuteCurrentTab(autoState: boolean) {
    console.trace(`Update action: muteCurrentTab`);
    browser.action.setBadgeText({ text: '' });
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const audible = tab?.audible;
    if (audible && !autoState) {
      browser.action.enable();
    } else {
      browser.action.disable();
    }
  }

  private static async updateToggleAllTabs(autoState: boolean) {
    console.trace(`Update action: toggleAllTabs: ${autoState}`);
    browser.action.setBadgeText({ text: '' });
    if (!autoState) {
      browser.action.enable();
    } else {
      browser.action.disable();
    }
  }

  private static async updateAutoMute(autoState: boolean) {
    console.trace(`Update action: autoState: ${autoState}`);
    // const tabs = await browser.tabs.query({});
    const color: Color = autoState ? this.green : this.red;
    const text: 'on' | 'off' = autoState ? 'on' : 'off';
    browser.action.enable();
    browser.action.setBadgeBackgroundColor({ color });
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
      case 'fixOR':
      case 'fixOC':
        text = 'F';
        break;
      case 'all':
        text = 'A';
        break;
      default:
        text = '';
        break;
    }

    const color: Color = autoState ? this.green : this.red;
    browser.action.enable();
    browser.action.setBadgeBackgroundColor({ color });
    browser.action.setBadgeText({ text });
  }

  private static async updateFixTab(
    autoMode: AutoMode,
    autoState: boolean,
    fixTabId?: number
  ) {
    console.trace(`Update action: fixTab: ${fixTabId}`);
    if (autoState && autoMode.slice(0, 3) === 'fix') {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tabId = tab?.id;
      const color: Color = tabId && tabId === fixTabId ? this.green : this.red;
      browser.action.enable();
      browser.action.setBadgeBackgroundColor({ color });
      browser.action.setBadgeText({ text: 'fix' });
    } else {
      const color: Color = this.grey;
      browser.action.setBadgeText({ text: '' });
      browser.action.setBadgeBackgroundColor({ color });
      browser.action.disable();
    }
  }
}
