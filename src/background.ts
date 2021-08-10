import I18N from './I18N/i18n';
import Mute from './Mute/mute';
import { Command, ContextMenuId } from './types/types';
import ContextMenu from './UI/contextMenus';

chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener((details) => {
  initialize();
  if (details.reason === 'update') createNotification();
});
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'updated') {
    let url = chrome.runtime.getURL('changelog.html');
    chrome.tabs.create({ url });
  }
  chrome.notifications.clear(notificationId);
});

function initialize() {
  ContextMenu.createAll(onContextMenuClick);
}

function createNotification() {
  I18N.bypassI18NinMV3('notificationTitle', I18N.setI18NtoNotification, [
    'changelog_1_0_0',
    'changelog_1_0_1',
  ]);
  // chrome.notifications.create('updated', {
  //   type: 'basic',
  //   iconUrl: './icons/icon128.png',
  //   title: chrome.i18n.getMessage('notificationTitle'),
  //   message: chrome.i18n.getMessage('changelog_1_0_0'),
  //   requireInteraction: true,
  // });
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
