import { browser } from '../Api/api';
import { Option } from '../Option/option';
import { AutoMode, Color } from '../types/types';

const green: Color = '#579242';
const red: Color = '#9c2829';
const grey: Color = '#5f6368';
export function update(option: Option, fixTabId?: number) {
  console.trace(`Update action badge`);
  switch (option.actionMode) {
    case 'muteCurrentTab':
      updateMuteCurrentTab(option.autoState);
      break;
    case 'toggleAllTabs':
      updateToggleAllTabs(option.autoState);
      break;
    case 'autoMute':
      updateAutoMute(option.autoState);
      break;
    case 'autoMode':
      updateAutoMode(option.autoMode, option.autoState);
      break;
    case 'fixTab':
      updateFixTab(option.autoMode, option.autoState, fixTabId);
      break;

    default:
      throw new Error(`Unavailable actionMode: ${option.actionMode}`);
  }
}

export async function updateMuteCurrentTab(autoState: boolean) {
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

export async function updateToggleAllTabs(autoState: boolean) {
  console.trace(`Update action: toggleAllTabs: ${autoState}`);
  browser.action.setBadgeText({ text: '' });
  if (!autoState) {
    browser.action.enable();
  } else {
    browser.action.disable();
  }
}

export async function updateAutoMute(autoState: boolean) {
  console.trace(`Update action: autoState: ${autoState}`);
  const color: Color = autoState ? green : red;
  const text: 'on' | 'off' = autoState ? 'on' : 'off';
  browser.action.enable();
  browser.action.setBadgeBackgroundColor({ color });
  browser.action.setBadgeText({ text });
}

export async function updateAutoMode(autoMode: AutoMode, autoState: boolean) {
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

  const color: Color = autoState ? green : red;
  browser.action.enable();
  browser.action.setBadgeBackgroundColor({ color });
  browser.action.setBadgeText({ text });
}

export async function updateFixTab(
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
    const color: Color = tabId && tabId === fixTabId ? green : red;
    browser.action.enable();
    browser.action.setBadgeBackgroundColor({ color });
    browser.action.setBadgeText({ text: 'fix' });
  } else {
    const color: Color = grey;
    browser.action.setBadgeText({ text: '' });
    browser.action.setBadgeBackgroundColor({ color });
    browser.action.disable();
  }
}
