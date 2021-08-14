import { ActionMode, AutoMode, Language, OffBehavior } from '../types/types';

export type Option = {
  actionMode: ActionMode;
  autoMode: AutoMode;
  autoState: boolean;
  offBehavior: OffBehavior;
  language: Language;
};

type StorageKeys =
  | 'actionMode'
  | 'autoMode'
  | 'autoState'
  | 'offBehavior'
  | 'recentTabIds'
  | 'fixedTabId'
  | 'wasInit'
  | 'language';

export type StorageProperties = {
  actionMode?: ActionMode;
  autoMode?: AutoMode;
  autoState?: boolean;
  offBehavior?: OffBehavior;
  recentTabIds?: string;
  fixedTabId?: number;
  wasInit?: boolean;
  language?: Language;
};

export const defaultOption: Option = {
  actionMode: 'muteCurrentTab',
  autoMode: 'current',
  autoState: false,
  offBehavior: 'release',
  language: 'en',
};

export function saveStorage(
  storage: StorageProperties = defaultOption,
  callback?: () => void
) {
  console.trace(`Save storage: ${storage}`);
  console.table({ ...storage });
  chrome.storage.local.set({ ...storage }, callback);
}
export function initStorage(callback?: () => void) {
  saveStorage({ ...defaultOption, wasInit: true }, callback);
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
    ['actionMode', 'autoMode', 'autoState', 'offBehavior', 'language'],
    (items) => {
      const option: Option = {
        actionMode: items.actionMode || defaultOption.actionMode,
        autoMode: items.autoMode || defaultOption.autoMode,
        autoState: !!items.autoState,
        offBehavior: items.offBehavior || defaultOption.offBehavior,
        language: items.language || defaultOption.language,
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
  static reset() {
    console.trace(`Reset option`);
    saveStorage();
  }

  static setLanguage(language: Language, callback?: () => void) {
    console.trace(`Set language: ${language}`);
    saveStorage({ language }, callback);
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
