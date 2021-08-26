import { Listener } from './Listener/listener';
import Mute from './Mute/mute';
import {
  ChangeOption,
  initStorage,
  loadOption,
  loadStorage,
  saveStorage,
  StorageProperties,
} from './Option/option';
import {
  ActionMode,
  AutoMode,
  Command,
  ContextMenuId,
  OffBehavior,
  OptionPageResponse,
} from './types/types';
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
      load();
    } else {
      initStorage(load);
    }
  });

  function load() {
    loadOption((option) => {
      console.log(`load`);
      chrome.storage.local.set({ recentTabIds: JSON.stringify([]) });
      ContextMenu.createAll(onContextMenuClick, option);
      doAutoMute();
      updateActionBadge();
      setTimeout(addListener, 100);
    });
  }
}

function addListener() {
  new Listener(
    onStorageChanged,
    onMessage,
    onActionClick,
    onCommand,
    onTabActivated,
    onTabUpdated,
    onWindowFocusChanged,
    onTabRemoved
  );
}

function onStorageChanged(changes: StorageProperties) {
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
    const autoState =
      changes.autoState && (changes.autoState as chrome.storage.StorageChange);
    if (!autoState.newValue) {
      checkOffBehavior();
    }
  }

  update();
}

function onMessage(
  message: OptionPageResponse,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  console.log(`On message: ${message}`);
  if (sender.id === chrome.runtime.id) {
    switch (message.message) {
      case 'actionMode':
        ChangeOption.setActionMode(message.value as ActionMode);
        break;
      case 'autoState':
        ChangeOption.setAutoState(!!message.value);
        break;
      case 'autoMode':
        ChangeOption.setAutoMode(message.value as AutoMode);
        break;
      case 'offBehavior':
        ChangeOption.setOffBehavior(message.value as OffBehavior);
        break;
      case 'reset':
        ChangeOption.reset();
        break;

      default:
        break;
    }
    sendResponse(message);
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

function onTabActivated(tabId: number) {
  console.log(`Tab activated: ${tabId}`);
  loadStorage(['recentTabIds'], async ({ recentTabIds }: StorageProperties) => {
    const tab = await chrome.tabs.get(tabId);
    const oldIds: number[] = recentTabIds ? JSON.parse(recentTabIds) : [];
    let newIds: number[] = [...oldIds];
    if (tab.audible) {
      newIds = [...new Set([tabId, ...oldIds])];
    } else if (oldIds.includes(tabId)) {
      newIds = oldIds.filter((id) => id !== tabId);
    }

    newIds.length === oldIds.length &&
    newIds.every((id, index) => id === oldIds[index])
      ? update(['muteCurrentTab'])
      : saveStorage({ recentTabIds: JSON.stringify(newIds) });
  });
}

function onTabUpdated(
  tabId: number,
  _changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) {
  console.log(`Tab updated: ${tabId}`);
  loadStorage('recentTabIds', async ({ recentTabIds }) => {
    const oldIds: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
    let newIds: number[] = [...oldIds];
    const window = await chrome.windows.getCurrent();
    console.log(`WindowId: ${tab.windowId}, ${window.id}`);

    if (tab.audible) {
      if (tab.active && tab.windowId === window.id) {
        newIds = [...new Set([tabId, ...oldIds])];
      } else {
        newIds = [...new Set([...oldIds, tabId])];
      }
    } else if (oldIds.includes(tabId)) {
      newIds = oldIds.filter((id) => id !== tabId);
    }

    newIds.length === oldIds.length &&
    newIds.every((id, index) => id === oldIds[index])
      ? update(['muteCurrentTab'])
      : saveStorage({ recentTabIds: JSON.stringify(newIds) });
  });
}

function onWindowFocusChanged(windowId: number) {
  console.log(`Window focus changed: ${windowId}`);
  loadStorage(
    ['autoMode', 'recentTabIds'],
    async ({ autoMode, recentTabIds }) => {
      const oldIds: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
      let newIds: number[] = [...oldIds];
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      const tabId = tab?.id;

      if (tab && tabId) {
        if (tab.audible) {
          if (tab.active && tab.windowId === windowId) {
            newIds = [...new Set([tabId, ...oldIds])];
          } else {
            newIds = [...new Set([...oldIds, tabId])];
          }
        } else if (oldIds.includes(tabId)) {
          newIds = oldIds.filter((id) => id !== tabId);
        }

        newIds.length === oldIds.length &&
        newIds.every((id, index) => id === oldIds[index])
          ? update(['muteCurrentTab'])
          : saveStorage({ recentTabIds: JSON.stringify(newIds) });
      }

      if (autoMode === 'current') doAutoMute();
    }
  );
}

function onTabRemoved(tabId: number) {
  console.log(`Tab removed: ${tabId}`);
  loadStorage('recentTabIds', ({ recentTabIds }) => {
    let ids: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
    if (ids.includes(tabId)) {
      ids = ids.filter((id) => id !== tabId);
      saveStorage({ recentTabIds: JSON.stringify(ids) });
      return;
    }

    update();
  });
}

function update(ids?: ContextMenuId[]) {
  console.trace(`update`);
  doAutoMute();
  updateActionBadge();
  updateContextMenus(ids);
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

function updateContextMenus(
  ids: ContextMenuId[] = [
    'muteCurrentTab',
    'autoMute',
    'autoMode',
    'actionMode',
  ]
) {
  console.trace(`updateContextMenus: ${ids}`);
  loadOption((option) => ids.forEach((id) => ContextMenu.update(option, id)));
}

function updateActionBadge() {
  console.trace(`updateActionBadge`);
  loadStorage(['fixedTabId'], ({ fixedTabId }) =>
    loadOption((option) => ActionBadge.update(option, fixedTabId))
  );
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
