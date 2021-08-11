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
  | 'fixedTabId';

export type StorageProperties = {
  actionMode?: ActionMode;
  autoMode?: AutoMode;
  autoState?: boolean;
  offBehavior?: OffBehavior;
  recentTabIds?: string;
  fixedTabId?: number;
};

export const defaultOption: Option = {
  actionMode: 'autoMute',
  autoMode: 'current',
  autoState: true,
  offBehavior: 'release',
};

export function saveStorage(
  option: StorageProperties = defaultOption,
  callback?: () => void
) {
  chrome.storage.local.set({ ...option }, callback);
}

export async function loadStorage(
  keys: StorageKeys | StorageKeys[] | null = null,
  callback: (items: StorageProperties) => void
) {
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
