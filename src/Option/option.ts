import { ActionMode, AutoMode, OffBehavior } from '../types/types';

export type Option = {
  actionMode: ActionMode;
  autoMode: AutoMode;
  autoState: boolean;
  offBehavior: OffBehavior;
};

const initOption: Option = {
  actionMode: 'muteCurrentTab',
  autoMode: 'current',
  autoState: false,
  offBehavior: 'release',
};

export function saveOption(opt: Option = initOption) {
  chrome.storage.local.set({ ...opt });
}

export function loadOption(opt: Option = initOption) {
  chrome.storage.local.get({ ...opt });
}
