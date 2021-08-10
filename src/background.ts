import Mute from './Mute/mute';
import { Command, ContextMenuId } from './types/types';
import ContextMenu from './UI/contextMenus';
import Notification from './UI/notification';

chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener((details) => {
  initialize();
  if (details.reason === 'update') Notification.create(onNotificationClick);
});

function initialize() {
  ContextMenu.createAll(onContextMenuClick);
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
      break;
    case 'autoMode':
      break;
    case 'fixTab':
      break;

    default:
      throw new Error(`unavailable command: ${command}`);
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
      throw new Error(`unavailable contextMenu: ${menuItemId}`);
  }
}
