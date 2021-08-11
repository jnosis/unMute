import Mute from './Mute/mute';
import {
  loadOption,
  loadStorage,
  saveStorage,
  StorageProperties,
} from './Option/option';
import { Command, ContextMenuId } from './types/types';
import ActionBadge from './UI/actionBadge';
import ContextMenu from './UI/contextMenus';
import Notification from './UI/notification';

chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener((details) => {
  initialize();
  if (details.reason === 'update') Notification.create(onNotificationClick);
});

function initialize() {
  saveStorage();
  chrome.storage.local.set({ recentTabIds: JSON.stringify([]) });
  ContextMenu.createAll(onContextMenuClick);
  ActionBadge.update();
}

chrome.action.onClicked.addListener((tab) => tab.id && onActionClick(tab.id));

chrome.commands.onCommand.addListener(
  (command, tab) => tab.id && onCommand(command as Command, tab.id)
);

function onActionClick(tabId: number) {
  Mute.toggleMute(tabId);
}

function onCommand(command: Command, tabId: number) {
  switch (command) {
    case 'muteCurrentTab':
      Mute.toggleMute(tabId);
      break;
    case 'toggleAllTabs':
      Mute.toggleAllTab();
      break;
    case 'autoMute':
      loadStorage('autoState', ({ autoState }) =>
        saveStorage({ autoState: !autoState }, () => {
          doAutoMute();
          updateContextMenus();
          updateActionBadge();
        })
      );
      break;
    case 'autoMode':
      break;
    case 'fixTab':
      break;

    default:
      throw new Error(`Unavailable command: ${command}`);
  }
}

function onNotificationClick(notificationId: string) {
  if (notificationId === 'updated') {
    let url = chrome.runtime.getURL('changelog.html');
    chrome.tabs.create({ url });
  }
  chrome.notifications.clear(notificationId);
}

function onContextMenuClick(menuItemId: ContextMenuId, tabId: number) {
  switch (menuItemId) {
    case 'muteCurrentTab':
      Mute.toggleMute(tabId);
      break;
    case 'on':
      break;
    case 'off':
      break;
    case 'current':
      break;
    case 'recent':
      break;
    case 'fix':
      break;
    case 'all':
      break;
    case 'fixTab':
      break;
    case 'actionMode_muteCurrentTab':
      break;
    case 'actionMode_autoMute':
      break;
    case 'actionMode_autoMode':
      break;
    case 'actionMode_fixTab':
      break;
    case 'actionMode_toggleAllTabs':
      break;
    case 'toggleAllTabs':
      Mute.toggleAllTab();
      break;
    case 'shortcuts':
      chrome.tabs.create({ url: 'chrome://extensions/shortcuts' });
      break;
    case 'changelog':
      let url = chrome.runtime.getURL('changelog.html');
      chrome.tabs.create({ url });
      break;

    default:
      throw new Error(`Unavailable contextMenu: ${menuItemId}`);
  }
}

chrome.tabs.onActivated.addListener(async ({ tabId }: { tabId: number }) =>
  onTabActivated(tabId)
);
chrome.tabs.onActivated.addListener(async () => doAutoMute());
chrome.tabs.onActivated.addListener(async () => updateContextMenus());
chrome.tabs.onActivated.addListener(async () => updateActionBadge());

function onTabActivated(tabId: number) {
  loadStorage(['recentTabIds'], async ({ recentTabIds }: StorageProperties) => {
    console.trace(`Tab activated: ${tabId}`);
    const tab = await chrome.tabs.get(tabId);
    let ids: number[] = recentTabIds ? JSON.parse(recentTabIds) : [];
    if (tab.audible) {
      ids = [...new Set([tabId, ...ids])];
      chrome.storage.local.set({ recentTabIds: JSON.stringify(ids) }, () => {});
    }
  });
}

function doAutoMute() {
  loadStorage(
    ['autoState', 'autoMode', 'recentTabIds', 'fixedTabId'],
    ({ autoState, autoMode, recentTabIds, fixedTabId }: StorageProperties) => {
      console.log(autoState);
      if (autoState) {
        console.log(autoMode);
        switch (autoMode) {
          case 'current':
            Mute.doAutoMute(autoMode);
            break;
          case 'recent':
            recentTabIds &&
              Mute.doAutoMute(autoMode, JSON.parse(recentTabIds)[0]);
            break;
          case 'fix':
            Mute.doAutoMute(autoMode, fixedTabId);
            break;
          case 'all':
            Mute.doAutoMute(autoMode);
            break;
          default:
            throw new Error(`Unavailable AutoMode: ${autoMode}`);
        }
      }
    }
  );
}

function updateContextMenus() {
  loadOption(ContextMenu.updateAll);
}

function updateActionBadge() {
  loadStorage(['fixedTabId'], (items) =>
    loadOption((option) => ActionBadge.update(option, items.fixedTabId))
  );
}
