import { browser } from '../Api/api';
import Mute from '../Mute/mute';
import {
  ChangeOption,
  loadOption,
  loadStorage,
  saveStorage,
  StorageProperties,
} from '../Option/option';
import {
  ActionMode,
  AutoMode,
  Command,
  ContextMenuId,
  OffBehavior,
  OptionPageMessage,
} from '../types/types';
import { update } from './update';

export class Listener {
  constructor() {
    chrome.storage.onChanged.addListener((changes) =>
      onStorageChanged(changes)
    );

    chrome.runtime.onMessage.addListener(onMessage);

    chrome.notifications.onClicked.addListener((notificationId) =>
      onNotificationClick(notificationId)
    );

    chrome.browserAction.onClicked.addListener(
      (tab) => tab.id && onActionClick(tab.id)
    );

    chrome.commands.onCommand.addListener(
      (command, tab) => tab.id && onCommand(command as Command, tab.id)
    );

    chrome.contextMenus.onClicked.addListener(
      ({ menuItemId }, tab) =>
        tab?.id && onContextMenuClick(menuItemId as ContextMenuId, tab.id)
    );

    chrome.tabs.onActivated.addListener(async ({ tabId }) =>
      onTabActivated(tabId)
    );

    chrome.tabs.onUpdated.addListener(onTabUpdated);

    chrome.windows.onFocusChanged.addListener(onWindowFocusChanged);

    chrome.tabs.onRemoved.addListener(onTabRemoved);
  }
}

function onNotificationClick(notificationId: string) {
  if (notificationId === 'updated') {
    let url = browser.runtime.getURL('changelog.html');
    browser.tabs.create({ url });
  }
  browser.notifications.clear(notificationId);
}

function onStorageChanged(changes: {
  [key: string]: browser.storage.StorageChange;
}) {
  if (
    !changes.actionMode &&
    !changes.autoState &&
    !changes.autoMode &&
    !changes.fixedTabId &&
    !changes.recentTabIds
  ) {
    return;
  }
  console.log(`Storage change: ${changes}`);
  console.table({ ...changes });

  if (changes.autoState) {
    const autoState = changes.autoState;
    if (!autoState.newValue) {
      checkOffBehavior();
    }
  }

  update();
}

function onMessage(
  message: OptionPageMessage,
  sender: browser.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  console.log(`On message: ${message}`);
  const response = { response: '' };
  if (sender.id === browser.runtime.id) {
    switch (message.id) {
      case 'actionMode':
        ChangeOption.setActionMode(message.value as ActionMode);
        response.response = `${message.id} => ${message.value}`;
        break;
      case 'autoState':
        ChangeOption.setAutoState(!!message.value);
        response.response = `${message.id} => ${message.value}`;
        break;
      case 'autoMode':
        ChangeOption.setAutoMode(message.value as AutoMode);
        response.response = `${message.id} => ${message.value}`;
        break;
      case 'offBehavior':
        ChangeOption.setOffBehavior(message.value as OffBehavior);
        response.response = `${message.id} => ${message.value}`;
        break;
      case 'reset':
        ChangeOption.reset();
        response.response = `${message.id}`;
        break;

      default:
        response.response = `Wrong message: ${message.id}`;
        break;
    }
    sendResponse(response);
  }
}

function onActionClick(tabId: number) {
  console.log(`Action click: ${tabId}`);
  loadOption(({ actionMode }) => {
    switch (actionMode) {
      case 'muteCurrentTab':
        Mute.toggleMute(tabId);
        break;
      case 'toggleAllTabs':
        Mute.toggleAllTab();
        break;
      case 'autoMute':
        ChangeOption.toggleAutoMute(() => setFixTab(tabId));
        break;
      case 'autoMode':
        ChangeOption.rotateAutoMode(() => setFixTab(tabId));
        break;
      case 'fixTab':
        setFixTab(tabId);
        break;

      default:
        throw new Error(`Unavailable action mode: ${actionMode}`);
    }
  });
}

function onCommand(command: Command, tabId: number) {
  console.log(`On command: ${tabId}`);
  switch (command) {
    case 'muteCurrentTab':
      Mute.toggleMute(tabId);
      break;
    case 'toggleAllTabs':
      Mute.toggleAllTab();
      break;
    case 'autoMute':
      ChangeOption.toggleAutoMute(() => setFixTab(tabId));
      break;
    case 'autoMode':
      ChangeOption.rotateAutoMode(() => setFixTab(tabId));
      break;
    case 'fixTab':
      setFixTab(tabId);
      break;
    // Dev Code: start
    case 'dev':
      showStorage();
      break;
    // Dev Code: end

    default:
      throw new Error(`Unavailable command: ${command}`);
  }
}

function onContextMenuClick(menuItemId: ContextMenuId, tabId: number) {
  console.log(`Context menu click: (${menuItemId} : ${tabId})`);
  switch (menuItemId) {
    case 'muteCurrentTab':
      Mute.toggleMute(tabId);
      break;
    case 'on':
      ChangeOption.setAutoState(true, () => setFixTab(tabId));
      break;
    case 'off':
      ChangeOption.setAutoState(false);
      break;
    case 'current':
      ChangeOption.setAutoMode('current', () => setFixTab(tabId));
      break;
    case 'recent':
      ChangeOption.setAutoMode('recent', () => setFixTab(tabId));
      break;
    case 'fix':
      ChangeOption.setAutoMode('fix', () => setFixTab(tabId));
      break;
    case 'all':
      ChangeOption.setAutoMode('all', () => setFixTab(tabId));
      break;
    case 'fixTab':
      setFixTab(tabId);
      break;
    case 'actionMode_muteCurrentTab':
      ChangeOption.setActionMode('muteCurrentTab');
      break;
    case 'actionMode_autoMute':
      ChangeOption.setActionMode('autoMute');
      break;
    case 'actionMode_autoMode':
      ChangeOption.setActionMode('autoMode');
      break;
    case 'actionMode_fixTab':
      ChangeOption.setActionMode('fixTab');
      break;
    case 'actionMode_toggleAllTabs':
      ChangeOption.setActionMode('toggleAllTabs');
      break;
    case 'toggleAllTabs':
      Mute.toggleAllTab();
      break;
    case 'shortcuts':
      browser.tabs.create({ url: 'chrome://extensions/shortcuts' });
      break;
    case 'changelog':
      let url = browser.runtime.getURL('changelog.html');
      browser.tabs.create({ url });
      break;

    default:
      throw new Error(`Unavailable contextMenu: ${menuItemId}`);
  }
}

function onTabActivated(tabId: number) {
  console.log(`Tab activated: ${tabId}`);
  loadStorage(['recentTabIds'], async ({ recentTabIds }: StorageProperties) => {
    const tab = await browser.tabs.get(tabId);
    const audible = !!tab.audible;
    const ids: number[] = recentTabIds ? JSON.parse(recentTabIds) : [];
    await setUpdatedRecentTabIds(tabId, ids, audible, true);
  });
}

function onTabUpdated(
  tabId: number,
  _changeInfo: browser.tabs.TabChangeInfo,
  tab: browser.tabs.Tab
) {
  console.log(`Tab updated: ${tabId}`);
  loadStorage('recentTabIds', async ({ recentTabIds }) => {
    const window = await browser.windows.getCurrent();
    console.log(`WindowId: ${tab.windowId}, ${window.id}`);

    const audible = !!tab.audible;
    const isRecent = tab.active && tab.windowId === window.id;
    const ids: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
    await setUpdatedRecentTabIds(tabId, ids, audible, isRecent);
  });
}

function onWindowFocusChanged(windowId: number) {
  console.log(`Window focus changed: ${windowId}`);
  loadStorage(
    ['autoMode', 'recentTabIds'],
    async ({ autoMode, recentTabIds }) => {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      const tabId = tab?.id;

      if (tab && tabId) {
        const audible = !!tab.audible;
        const isRecent = tab.active && tab.windowId === windowId;
        const ids: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
        await setUpdatedRecentTabIds(tabId, ids, audible, isRecent);
      }

      if (autoMode === 'current') update(['muteCurrentTab']);
    }
  );
}

function onTabRemoved(tabId: number) {
  console.log(`Tab removed: ${tabId}`);
  loadStorage('recentTabIds', async ({ recentTabIds }) => {
    const oldIds: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
    await setUpdatedRecentTabIds(tabId, oldIds, false, true);
  });
}

async function checkRecentTabIds(ids: number[]): Promise<number[]> {
  const tabs = await browser.tabs.query({ audible: true });
  const recentRecentTabIds: number[] = tabs.map((tab) => tab.id as number);
  return ids.filter((id) => recentRecentTabIds.includes(id));
}

async function updateRecentTabIds(
  tabId: number,
  ids: number[],
  audible: boolean,
  isRecent: boolean
): Promise<number[]> {
  let updatedIds: number[] = [...ids];
  if (audible) {
    if (isRecent) {
      updatedIds = [...new Set([tabId, ...ids])];
    } else {
      updatedIds = [...new Set([...ids, tabId])];
    }
  }
  updatedIds = await checkRecentTabIds(updatedIds);

  return updatedIds;
}

function equal<T>(arr1: T[], arr2: T[]): boolean {
  return (
    arr1.length === arr2.length &&
    arr1.every((item, index) => item === arr2[index])
  );
}

async function setUpdatedRecentTabIds(
  tabId: number,
  ids: number[],
  audible: boolean,
  isRecent: boolean
) {
  console.trace(`SetUpdatedRecentTabIds: ${tabId}`);
  const updatedIds = await updateRecentTabIds(tabId, ids, audible, isRecent);

  equal(updatedIds, ids)
    ? update(['muteCurrentTab'])
    : saveStorage({ recentTabIds: JSON.stringify(updatedIds) });
}

function setFixTab(tabId: number) {
  loadOption(
    ({ autoMode, autoState }) =>
      autoState && autoMode === 'fix' && saveStorage({ fixedTabId: tabId })
  );
}

function checkOffBehavior() {
  loadOption(
    ({ offBehavior }) => offBehavior === 'release' && Mute.releaseAllMute()
  );
}

// Dev Code: start
function showStorage() {
  loadStorage(null, (items) => console.table({ ...items }));
}
// Dev Code: end
