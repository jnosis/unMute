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
  OptionPageResponse,
} from '../types/types';
import { toggleContextMenus, update } from './update';

type RecentConditions = {
  audible: boolean;
  isRecent: boolean;
  isRelease: boolean;
};

export class Listener {
  constructor() {
    browser.storage.onChanged.addListener((changes, areaName) =>
      this.onStorageChanged(changes, areaName)
    );

    browser.runtime.onMessage.addListener((message, sender, sendResponse) =>
      this.onMessage(message, sender, sendResponse)
    );

    browser.notifications.onClicked.addListener((notificationId) =>
      this.onNotificationClick(notificationId)
    );

    browser.action.onClicked.addListener(
      (tab) => tab.id && this.onActionClick(tab.id)
    );

    browser.commands.onCommand.addListener(
      (command, tab) => tab.id && this.onCommand(command as Command, tab.id)
    );

    browser.contextMenus.onClicked.addListener(
      ({ menuItemId }, tab) =>
        tab?.id && this.onContextMenuClick(menuItemId as ContextMenuId, tab.id)
    );

    browser.tabs.onActivated.addListener(({ tabId }) =>
      this.onTabActivated(tabId)
    );

    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) =>
      this.onTabUpdated(tabId, changeInfo, tab)
    );

    browser.windows.onFocusChanged.addListener((windowId) =>
      this.onWindowFocusChanged(windowId)
    );

    browser.tabs.onRemoved.addListener((tabId) => this.onTabRemoved(tabId));
  }

  private onStorageChanged(
    changes: {
      [key: string]: browser.storage.StorageChange;
    },
    areaName: 'sync' | 'local' | 'managed'
  ) {
    switch (areaName) {
      case 'local':
        this.onLocalChanged(changes);
        break;
      case 'sync':
        this.onSyncChanged(changes);
        break;

      default:
        break;
    }
  }

  private onLocalChanged(changes: {
    [key: string]: browser.storage.StorageChange;
  }) {
    if (
      !changes.actionMode &&
      !changes.autoState &&
      !changes.autoMode &&
      !changes.recentBehavior &&
      !changes.fixedTabId &&
      !changes.contextMenus &&
      !changes.recentTabIds
    ) {
      return;
    }
    console.log(`Storage change: ${changes}`);
    console.table({ ...changes });

    if (changes.autoState) {
      const autoState = changes.autoState;
      if (!autoState.newValue) {
        this.checkOffBehavior();
      }
    }
    if (changes.recentBehavior) {
      const recentBehavior = changes.recentBehavior;
      if (recentBehavior.newValue === 'notRelease') {
        loadStorage('recentTabIds', ({ recentTabIds }) => {
          recentTabIds &&
            this.setUpdatedRecentTabIds(-1, recentTabIds, {
              audible: false,
              isRecent: false,
              isRelease: false,
            });
        });
      }
    }
    if (changes.contextMenus) {
      toggleContextMenus();
    } else {
      update();
    }
  }

  private onSyncChanged(changes: {
    [key: string]: browser.storage.StorageChange;
  }) {
    if (
      !changes.actionMode &&
      !changes.autoState &&
      !changes.autoMode &&
      !changes.offBehavior &&
      !changes.recentBehavior &&
      !changes.contextMenus
    ) {
      return;
    }
    console.log(`Sync change: ${changes}`);
    console.table({ ...changes });

    if (changes.actionMode) {
      const actionMode = changes.actionMode.newValue;
      saveStorage({ actionMode });
    }
    if (changes.autoState) {
      const autoState = changes.autoState.newValue;
      saveStorage({ autoState });
    }
    if (changes.autoMode) {
      const autoMode = changes.autoMode.newValue;
      saveStorage({ autoMode });
    }
    if (changes.offBehavior) {
      const offBehavior = changes.offBehavior.newValue;
      saveStorage({ offBehavior });
    }
    if (changes.recentBehavior) {
      const recentBehavior = changes.recentBehavior.newValue;
      saveStorage({ recentBehavior });
    }
    if (changes.contextMenus) {
      const contextMenus = changes.contextMenus.newValue;
      saveStorage({ contextMenus });
    }
  }

  private onMessage(
    message: OptionPageMessage,
    sender: browser.runtime.MessageSender,
    sendResponse: (response?: OptionPageResponse) => void
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
        case 'recentBehavior':
          ChangeOption.setRecentBehavior(message.value as OffBehavior);
          response.response = `${message.id} => ${message.value}`;
          break;
        case 'contextMenus':
          ChangeOption.setContextMenus(!!message.value);
          response.response = `${message.id} => ${message.value}`;
          break;
        case 'reset':
          ChangeOption.reset();
          response.response = `${message.id}`;
          break;
        case 'hidden':
          ChangeOption.setAutoMode(message.value as AutoMode);
          response.response = 'special';
          break;

        default:
          response.response = `Wrong message: ${message.id}`;
          break;
      }
      sendResponse(response);
    }
  }

  private onNotificationClick(notificationId: string) {
    if (notificationId === 'updated') {
      let url = browser.runtime.getURL('changelog.html');
      browser.tabs.create({ url });
    }
    browser.notifications.clear(notificationId);
  }

  private onActionClick(tabId: number) {
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
          ChangeOption.toggleAutoMute(() => this.setFixTab(tabId));
          break;
        case 'autoMode':
          ChangeOption.rotateAutoMode(() => this.setFixTab(tabId));
          break;
        case 'fixTab':
          this.setFixTab(tabId);
          break;

        default:
          throw new Error(`Unavailable action mode: ${actionMode}`);
      }
    });
  }

  private onCommand(command: Command, tabId: number) {
    console.log(`On command: ${tabId}`);
    switch (command) {
      case 'muteCurrentTab':
        Mute.toggleMute(tabId);
        break;
      case 'toggleAllTabs':
        Mute.toggleAllTab();
        break;
      case 'autoMute':
        ChangeOption.toggleAutoMute(() => this.setFixTab(tabId));
        break;
      case 'autoMode':
        ChangeOption.rotateAutoMode(() => this.setFixTab(tabId));
        break;
      case 'fixTab':
        this.setFixTab(tabId);
        break;
      // Dev Code: start
      case 'dev':
        this.showStorage();
        break;
      // Dev Code: end

      default:
        throw new Error(`Unavailable command: ${command}`);
    }
  }

  private onContextMenuClick(menuItemId: ContextMenuId, tabId: number) {
    console.log(`Context menu click: (${menuItemId} : ${tabId})`);
    switch (menuItemId) {
      case 'muteCurrentTab':
        Mute.toggleMute(tabId);
        break;
      case 'on':
        ChangeOption.setAutoState(true, () => this.setFixTab(tabId));
        break;
      case 'off':
        ChangeOption.setAutoState(false);
        break;
      case 'current':
        ChangeOption.setAutoMode('current', () => this.setFixTab(tabId));
        break;
      case 'recent':
        ChangeOption.setAutoMode('recent', () => this.setFixTab(tabId));
        break;
      case 'fix':
        ChangeOption.setAutoMode('fix', () => this.setFixTab(tabId));
        break;
      case 'all':
        ChangeOption.setAutoMode('all', () => this.setFixTab(tabId));
        break;
      case 'fixTab':
        this.setFixTab(tabId);
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

  private onTabActivated(tabId: number) {
    console.log(`Tab activated: ${tabId}`);
    loadStorage(
      ['recentTabIds', 'recentBehavior'],
      async ({ recentTabIds, recentBehavior }: StorageProperties) => {
        const tab = await browser.tabs.get(tabId);
        const audible = !!tab.audible;
        const isRelease = recentBehavior === 'release';
        const ids: number[] = recentTabIds ? recentTabIds : [];

        await this.setUpdatedRecentTabIds(tabId, ids, {
          audible,
          isRelease,
          isRecent: true,
        });
      }
    );
  }

  private onTabUpdated(
    tabId: number,
    changeInfo: browser.tabs.TabChangeInfo,
    tab: browser.tabs.Tab
  ) {
    console.log(`Tab updated: ${tabId} audible: ${changeInfo.status}`);
    loadStorage(
      ['recentTabIds', 'recentBehavior'],
      async ({ recentTabIds, recentBehavior }) => {
        const window = await browser.windows.getCurrent();
        const audible = !!tab.audible;
        const isRecent = tab.active && tab.windowId === window.id;
        const isRelease = recentBehavior === 'release';
        const conditions = { audible, isRecent, isRelease };
        const ids: number[] = !!recentTabIds ? recentTabIds : [];

        await this.setUpdatedRecentTabIds(tabId, ids, conditions);
      }
    );
  }

  private onWindowFocusChanged(windowId: number) {
    console.log(`Window focus changed: ${windowId}`);
    loadStorage(
      ['recentTabIds', 'recentBehavior'],
      async ({ recentTabIds, recentBehavior }) => {
        const [tab] = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (tab && tab.id) {
          const audible = !!tab.audible;
          const isRecent = tab.active && tab.windowId === windowId;
          const isRelease = recentBehavior === 'release';
          const conditions = { audible, isRecent, isRelease };
          const ids: number[] = !!recentTabIds ? recentTabIds : [];

          await this.setUpdatedRecentTabIds(tab.id, ids, conditions);
        }
      }
    );
  }

  private onTabRemoved(tabId: number) {
    console.log(`Tab removed: ${tabId}`);
    loadStorage(
      ['recentTabIds', 'recentBehavior'],
      async ({ recentTabIds, recentBehavior }) => {
        const isRelease = recentBehavior === 'release';
        const conditions = { isRelease, audible: false, isRecent: true };
        const oldIds: number[] = !!recentTabIds ? recentTabIds : [];

        await this.setUpdatedRecentTabIds(tabId, oldIds, conditions);
      }
    );
  }

  private async setUpdatedRecentTabIds(
    tabId: number,
    ids: number[],
    conditions: RecentConditions
  ) {
    console.trace(`SetUpdatedRecentTabIds: ${tabId}`);
    const updatedIds = await this.updateRecentTabIds(tabId, ids, conditions);

    this.equal(updatedIds, ids)
      ? update(['muteCurrentTab'])
      : saveStorage({ recentTabIds: updatedIds });
  }

  private async updateRecentTabIds(
    tabId: number,
    ids: number[],
    conditions: RecentConditions
  ): Promise<number[]> {
    const { audible, isRecent, isRelease } = conditions;
    let updatedIds: number[] = [...ids];

    if (audible) {
      if (isRecent) {
        updatedIds = [...new Set([tabId, ...ids])];
      } else if (isRelease) {
        updatedIds = [...new Set([...ids, tabId])];
      }
    }
    updatedIds = await this.checkRecentTabIds(updatedIds, isRelease);

    return updatedIds;
  }

  private async checkRecentTabIds(
    ids: number[],
    isRelease: boolean
  ): Promise<number[]> {
    const tabs = await browser.tabs.query({ audible: true });
    const recentRecentTabIds: number[] = tabs.map((tab) => tab.id as number);

    return ids
      .filter((_id, index) => isRelease || index === 0)
      .filter((id) => recentRecentTabIds.includes(id));
  }

  private equal<T>(arr1: T[], arr2: T[]): boolean {
    return (
      arr1.length === arr2.length &&
      arr1.every((item, index) => item === arr2[index])
    );
  }

  private setFixTab(tabId: number) {
    loadOption(
      ({ autoMode, autoState }) =>
        autoState &&
        autoMode.slice(0, 3) === 'fix' &&
        saveStorage({ fixedTabId: tabId })
    );
  }

  private checkOffBehavior() {
    loadOption(
      ({ offBehavior }) => offBehavior === 'release' && Mute.releaseAllMute()
    );
  }

  // Dev Code: start
  private showStorage() {
    loadStorage(null, (items) => console.table({ ...items }));
  }
  // Dev Code: end
}
