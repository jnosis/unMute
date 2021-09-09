import { browser } from '../Api/api';
import { ActionMode, AutoMode, OffBehavior } from '../types/types';
import * as Change from './changeOption';

export type Option = {
  actionMode: ActionMode;
  autoMode: AutoMode;
  autoState: boolean;
  offBehavior: OffBehavior;
  recentBehavior: OffBehavior;
  contextMenus: boolean;
};

type StorageKeys =
  | 'actionMode'
  | 'autoMode'
  | 'autoState'
  | 'offBehavior'
  | 'recentBehavior'
  | 'contextMenus'
  | 'recentTabIds'
  | 'fixedTabId'
  | 'wasInit';

export type StorageProperties = {
  actionMode?: ActionMode;
  autoMode?: AutoMode;
  autoState?: boolean;
  offBehavior?: OffBehavior;
  recentBehavior?: OffBehavior;
  contextMenus?: boolean;
  recentTabIds?: number[];
  fixedTabId?: number;
  wasInit?: boolean;
};

export const defaultOption: Option = {
  actionMode: 'muteCurrentTab',
  autoMode: 'current',
  autoState: false,
  offBehavior: 'release',
  recentBehavior: 'notRelease',
  contextMenus: true,
};

export async function saveStorage(storage: StorageProperties) {
  console.trace(`Save storage: ${storage}`);
  console.table({ ...storage });
  await browser.storage.local.set({ ...storage });
}
export async function saveOption(
  storage: StorageProperties = defaultOption,
  callback?: () => void
) {
  browser.storage.sync.set({ ...storage }).then(callback);
}
export async function initStorage(callback?: () => void) {
  const initValues = await getPreviousValues();
  console.table({ ...initValues });
  saveOption(initValues, callback);
  saveStorage(initValues);
}
async function getPreviousValues(): Promise<StorageProperties> {
  const values: StorageProperties = { ...defaultOption, wasInit: true };
  const previousStorage = await browser.storage.sync.get();
  if (!previousStorage) {
    console.log(`Not exist previous storage`);
    return values;
  }
  if (!!previousStorage.wasInit) {
    return previousStorage;
  }

  if (previousStorage.BROWSER_ACTION_MODE !== undefined) {
    switch (previousStorage.BROWSER_ACTION_MODE) {
      case 'mute_current_tab':
        values.actionMode = 'muteCurrentTab';
        break;
      case 'auto_mute':
        values.actionMode = 'autoMute';
        break;
      case 'auto_recent':
        values.actionMode = 'autoMode';
        break;
      case 'auto_fix':
        values.actionMode = 'fixTab';
        break;
      case 'toggle_all_tabs':
        values.actionMode = 'toggleAllTabs';
        break;

      default:
        values.actionMode = 'muteCurrentTab';
        break;
    }
    if (previousStorage.AUTO_RECENT) {
      values.autoMode = 'recent';
    } else if (previousStorage.AUTO_FIX) {
      values.autoMode = 'fix';
    } else {
      values.autoMode = 'current';
    }
    values.autoState = !!previousStorage.AUTO_MUTE;
    if (previousStorage.AUTO_OFF !== undefined) {
      values.offBehavior = previousStorage.AUTO_OFF ? 'release' : 'notRelease';
    }
    await browser.storage.sync.clear();
  }

  return values;
}

export async function loadStorage(
  keys: StorageKeys | StorageKeys[] | null = null,
  callback: (items: StorageProperties) => void
) {
  console.trace(`Load storage: ${keys}`);
  const items = await browser.storage.local.get(keys);
  callback(items);
}
export async function loadOption(callback: (option: Option) => void) {
  loadStorage(
    [
      'actionMode',
      'autoMode',
      'autoState',
      'offBehavior',
      'recentBehavior',
      'contextMenus',
    ],
    (items) => {
      const option: Option = {
        actionMode: items.actionMode || defaultOption.actionMode,
        autoMode: items.autoMode || defaultOption.autoMode,
        autoState: !!items.autoState,
        offBehavior: items.offBehavior || defaultOption.offBehavior,
        recentBehavior: items.recentBehavior || defaultOption.recentBehavior,
        contextMenus: !!items.contextMenus,
      };
      callback(option);
    }
  );
}

export const ChangeOption = Change;
