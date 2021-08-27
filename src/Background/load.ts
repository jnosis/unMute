import { initStorage, loadOption, loadStorage } from '../Option/option';
import ContextMenu from '../UI/contextMenus';
import Notification from '../UI/notification';
import { doAutoMute, updateActionBadge } from './update';

export class Load {
  constructor(callback: Function, details?: chrome.runtime.InstalledDetails) {
    onLoad(callback, details);
  }
}

function onLoad(callback: Function, details?: chrome.runtime.InstalledDetails) {
  const isUpdated = details?.reason === 'update';
  loadStorage('wasInit', ({ wasInit }) => {
    console.log(`Initialize: ${!!wasInit}`);
    if (wasInit) {
      load(callback, isUpdated);
    } else {
      initStorage(() => load(callback, isUpdated));
    }
  });
  if (isUpdated) Notification.create();
}

function load(callback: Function, isUpdated: boolean) {
  loadOption((option) => {
    console.log(`load`);
    isUpdated || chrome.storage.local.set({ recentTabIds: JSON.stringify([]) });
    ContextMenu.createAll(option);
    doAutoMute();
    updateActionBadge();
    setTimeout(callback, 100);
  });
}
