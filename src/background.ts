import Mute from './Mute/mute';

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
  chrome.notifications.create('updated', {
    type: 'basic',
    iconUrl: './icons/icon128.png',
    title: chrome.i18n.getMessage('notificationTitle'),
    message: chrome.i18n.getMessage('changelog_1_0_0'),
    requireInteraction: true,
  });
}

chrome.action.onClicked.addListener((tab) => onActionClick(tab.id as number));

chrome.commands.onCommand.addListener((command, tab) =>
  onCommand(command, tab.id as number)
);

chrome.contextMenus.onClicked.addListener(({ menuItemId }, tab) =>
  onContextMenuClick(menuItemId, tab)
);

function onActionClick(tabId: number) {
  Mute.toggleMute(tabId);
}

function onCommand(command: string, tabId: number) {
  switch (command) {
    case 'muteCurrentTab':
      Mute.toggleMute(tabId);
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
