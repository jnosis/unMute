import { ActionMode, AutoMode, OffBehavior } from '../types/types';

export type Option = {
  actionMode: ActionMode;
  autoMode: AutoMode;
  autoState: boolean;
  offBehavior: OffBehavior;
};

export const defaultOption: Option = {
  actionMode: 'muteCurrentTab',
  autoMode: 'current',
  autoState: false,
  offBehavior: 'release',
};

export function saveOption(config: Option = defaultOption) {
  chrome.storage.local.set({ ...config });
}

export async function loadOption(keys: string | string[]) {
  chrome.storage.local.get(keys).then((item) => console.log(item));
}
