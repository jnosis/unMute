import I18N from './I18N/i18n';
import Mute from './Mute/mute';
import { Command } from './types/types';

chrome.runtime.onStartup.addListener(() => console.log(`start`));
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'update') createNotification();
});
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId === 'updated') {
    chrome.tabs.create({ url: './changelog.html' });
  }
  chrome.notifications.clear(notificationId);
});

function createNotification() {
  I18N.bypassI18NinMV3('notificationTitle', 'en', I18N.getI18NtoNotification, [
    'changelog_1_0_0',
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

chrome.contextMenus.onClicked.addListener(({ menuItemId }, tab) =>
  onContextMenuClick(menuItemId, tab)
);

function onActionClick(tabId: number) {
  Mute.toggleMute(tabId);
}

function onCommand(command: Command, tabId: number) {
  switch (command) {
    case 'muteCurrentTab':
      Mute.toggleMute(tabId);
      break;
    case 'toggleAllTab':
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

function onContextMenuClick(
  menuItemId: string,
  tab: chrome.tabs.Tab | undefined
) {
  console.log(`${menuItemId} ${tab}`);
}
