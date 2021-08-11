import { ActionMode, AutoMode, OffBehavior } from '../types/types';

export type Option = {
  actionMode: ActionMode;
  autoMode: AutoMode;
  autoState: boolean;
  offBehavior: OffBehavior;
};

type StorageKeys =
  | 'actionMode'
  | 'autoMode'
  | 'autoState'
  | 'offBehavior'
  | 'recentTabIds'
  | 'fixedTabId'
  | 'wasInit';

export type StorageProperties = {
  actionMode?: ActionMode;
  autoMode?: AutoMode;
  autoState?: boolean;
  offBehavior?: OffBehavior;
  recentTabIds?: string;
  fixedTabId?: number;
  wasInit?: boolean;
};

export const defaultOption: Option = {
  actionMode: 'muteCurrentTab',
  autoMode: 'current',
  autoState: false,
  offBehavior: 'release',
};

export function saveStorage(
  storage: StorageProperties = defaultOption,
  callback?: () => void
) {
  console.trace(`Save storage: ${storage}`);
  console.table({ ...storage });
  chrome.storage.local.set({ ...storage }, callback);
}

export async function loadStorage(
  keys: StorageKeys | StorageKeys[] | null = null,
  callback: (items: StorageProperties) => void
) {
  console.trace(`Load storage: ${keys}`);
  chrome.storage.local.get(keys, callback);
}
export async function loadOption(callback: (option: Option) => void) {
  loadStorage(
    ['actionMode', 'autoMode', 'autoState', 'offBehavior'],
    (items) => {
      const option: Option = {
        actionMode: items.actionMode || defaultOption.actionMode,
        autoMode: items.autoMode || defaultOption.autoMode,
        autoState: !!items.autoState,
        offBehavior: items.offBehavior || defaultOption.offBehavior,
      };
      callback(option);
    }
  );
}

export abstract class ChangeOption {
  static setActionMode(actionMode: ActionMode, callback?: () => void) {
    console.trace(`Set action mode: ${actionMode}`);
    saveStorage({ actionMode }, callback);
  }
  static setAutoMode(autoMode: AutoMode, callback?: () => void) {
    console.trace(`Set auto mode: ${autoMode}`);
    saveStorage({ autoMode }, callback);
  }
  static setAutoState(autoState: boolean, callback?: () => void) {
    console.trace(`Set auto state: ${autoState}`);
    saveStorage({ autoState }, callback);
  }
  static setOffBehavior(offBehavior: OffBehavior, callback?: () => void) {
    console.trace(`Set off behavior: ${offBehavior}`);
    saveStorage({ offBehavior }, callback);
  }

  static toggleAutoMute(callback?: () => void) {
    console.trace(`Toggle auto mute`);
    loadOption(({ autoState }) => {
      this.setAutoState(!autoState, callback);
    });
  }

  static rotateAutoMode(callback?: () => void) {
    console.trace(`Rotate auto mode`);
    loadOption(({ autoMode }) => {
      switch (autoMode) {
        case 'current':
          this.setAutoMode('recent', callback);
          break;
        case 'recent':
          this.setAutoMode('fix', callback);
          break;
        case 'fix':
          this.setAutoMode('all', callback);
          break;
        case 'all':
          this.setAutoMode('current', callback);
          break;

        default:
          throw Error(`Unavailable auto mode ${autoMode}`);
      }
    });
  }
}
