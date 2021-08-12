import Mute from './Mute/mute';
import {
  ChangeOption,
  defaultOption,
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
  loadStorage('wasInit', ({ wasInit }) => {
    console.log(`Initialize: ${!!wasInit}`);
    if (wasInit) {
      _();
    } else {
      saveStorage({ ...defaultOption, wasInit: true }, _);
    }
  });

  function _() {
    console.log(`_`);
    chrome.storage.local.set({ recentTabIds: JSON.stringify([]) });
    ActionBadge.update();
    ContextMenu.createAll(onContextMenuClick);
    doAutoMute();
  }
}

chrome.storage.onChanged.addListener((changes) => onStorageChanged(changes));

function onStorageChanged(changes: StorageProperties) {
  if (
    changes.autoState ||
    changes.autoMode ||
    changes.fixedTabId ||
    changes.recentTabIds
  ) {
    update();
  }
}

chrome.action.onClicked.addListener((tab) => tab.id && onActionClick(tab.id));

chrome.commands.onCommand.addListener(
  (command, tab) => tab.id && onCommand(command as Command, tab.id)
);

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
        ChangeOption.toggleAutoMute();
        break;
      case 'autoMode':
        ChangeOption.rotateAutoMode();
        break;
      case 'fixTab':
        saveStorage({ fixedTabId: tabId });
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
      ChangeOption.toggleAutoMute();
      break;
    case 'autoMode':
      ChangeOption.rotateAutoMode();
      break;
    case 'fixTab':
      saveStorage({ fixedTabId: tabId });
      break;
    case 'dev':
      showStorage();
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
  console.log(`Context menu click: (${ContextMenu} : ${tabId})`);
  switch (menuItemId) {
    case 'muteCurrentTab':
      Mute.toggleMute(tabId);
      break;
    case 'on':
      ChangeOption.setAutoState(true);
      break;
    case 'off':
      ChangeOption.setAutoState(false);
      break;
    case 'current':
      ChangeOption.setAutoMode('current');
      break;
    case 'recent':
      ChangeOption.setAutoMode('recent');
      break;
    case 'fix':
      ChangeOption.setAutoMode('fix');
      break;
    case 'all':
      ChangeOption.setAutoMode('all');
      break;
    case 'fixTab':
      saveStorage({ fixedTabId: tabId });
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
  onTabActivated(tabId, update)
);

function onTabActivated(tabId: number, callback: () => void) {
  console.log(`Tab activated: ${tabId}`);
  loadStorage(['recentTabIds'], async ({ recentTabIds }: StorageProperties) => {
    const tab = await chrome.tabs.get(tabId);
    let ids: number[] = recentTabIds ? JSON.parse(recentTabIds) : [];
    if (tab.audible) {
      ids = [...new Set([tabId, ...ids])];
    }
    chrome.storage.local.set({ recentTabIds: JSON.stringify(ids) });
    callback();
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
  onTabUpdated(tabId, changeInfo, tab)
);

function onTabUpdated(
  tabId: number,
  _changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  console.log(`Tab updated: ${tabId}`);
  loadStorage('recentTabIds', async ({ recentTabIds }) => {
    let ids: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
    const window = await chrome.windows.getCurrent();
    console.log(`WindowId: ${tab.windowId}, ${window.id}`);

    if (tab.audible) {
      if (tab.active && tab.windowId === window.id) {
        ids = [...new Set([tabId, ...ids])];
      } else {
        ids = [...new Set([...ids, tabId])];
      }
    } else if (ids.includes(tabId)) {
      ids = ids.filter((id) => id !== tabId);
    }

    saveStorage({ recentTabIds: JSON.stringify(ids) });
  });
}

chrome.windows.onFocusChanged.addListener((windowId) =>
  onWindowFocusChanged(windowId)
);

function onWindowFocusChanged(windowId: number) {
  console.log(`Window focus changed: ${windowId}`);
  loadStorage(
    ['autoMode', 'recentTabIds'],
    async ({ autoMode, recentTabIds }) => {
      let ids: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      const tabId = tab?.id;

      if (tab && tabId) {
        if (tab.audible) {
          if (tab.active && tab.windowId === windowId) {
            ids = [...new Set([tabId, ...ids])];
          } else {
            ids = [...new Set([...ids, tabId])];
          }
          saveStorage({ recentTabIds: JSON.stringify(ids) });
        }
      }

      if (autoMode === 'current') doAutoMute();
    }
  );
}

chrome.tabs.onRemoved.addListener((tabId, { windowId }) =>
  onTabRemoved(tabId, windowId)
);

function onTabRemoved(tabId: number, windowId: number) {
  console.log(`Tab removed: ${tabId}, ${windowId}`);
  loadStorage('recentTabIds', ({ recentTabIds }) => {
    let ids: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
    if (ids.includes(tabId)) {
      ids = ids.filter((id) => id !== tabId);
    }

    saveStorage({ recentTabIds: JSON.stringify(ids) });
  });
}

function update() {
  console.trace(`update`);
  doAutoMute();
  updateActionBadge();
  updateContextMenus();
}

function doAutoMute() {
  loadStorage(
    ['autoState', 'autoMode', 'recentTabIds', 'fixedTabId'],
    ({ autoState, autoMode, recentTabIds, fixedTabId }: StorageProperties) => {
      if (autoState) {
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
  loadStorage(['fixedTabId'], ({ fixedTabId }) =>
    loadOption((option) => ActionBadge.update(option, fixedTabId))
  );
}

// * for Dev
function showStorage() {
  loadStorage(null, (items) => console.table({ ...items }));
}
