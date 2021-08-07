import { ActionMode, AutoMode, OffBehavior } from '../types/types';

export type Option = {
  actionMode: ActionMode;
  autoMode: AutoMode;
  autoState: boolean;
  offBehavior: OffBehavior;
};

export const initOption: Option = {
  actionMode: 'muteCurrentTab',
  autoMode: 'current',
  autoState: false,
  offBehavior: 'release',
};

export function saveOption(opt: Option = initOption) {
  chrome.storage.local.set({ ...opt });
}

export function loadOption(keys: string | string[]) {
  chrome.storage.local.get(keys).then((item) => console.log(item));
}
