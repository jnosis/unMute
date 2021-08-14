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
      _();
    } else {
      initStorage(_);
    }
  });

  function _() {
    loadOption((option) => {
      console.log(`_`);
      chrome.storage.local.set({ recentTabIds: JSON.stringify([]) });
      ContextMenu.createAll(onContextMenuClick, option);
      doAutoMute();
      updateActionBadge();
    });
  }
}

chrome.storage.onChanged.addListener((changes) => onStorageChanged(changes));

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) =>
  onMessage(message, sender, sendResponse)
);

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
    let oldIds: number[] = !!recentTabIds ? JSON.parse(recentTabIds) : [];
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
      ? saveStorage({ recentTabIds: JSON.stringify(newIds) })
      : update();
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

chrome.tabs.onRemoved.addListener((tabId, _removeInfo) => onTabRemoved(tabId));

function onTabRemoved(tabId: number) {
  console.log(`Tab removed: ${tabId}`);
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
  loadOption((option) => ContextMenu.updateAll(option));
}

function updateActionBadge() {
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

// * for Dev
function showStorage() {
  loadStorage(null, (items) => console.table({ ...items }));
}
