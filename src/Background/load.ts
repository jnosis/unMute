import { browser } from '../Api/api';
import {
  initStorage,
  loadOption,
  loadStorage,
  saveStorage,
} from '../Option/option';
import ContextMenu from '../UI/contextMenus';
import Notification from '../UI/notification';
import { doAutoMute, updateActionBadge } from './update';

export class Load {
  constructor(
    callback: () => void,
    details?: browser.runtime.InstalledDetails
  ) {
    this.onLoad(callback, details);
  }

  private onLoad(
    callback: () => void,
    details?: browser.runtime.InstalledDetails
  ) {
    const isUpdated = details?.reason === 'update';
    loadStorage('wasInit', ({ wasInit }) => {
      console.log(`Initialize: ${!!wasInit}`);
      if (wasInit) {
        this.load(callback, isUpdated);
      } else {
        initStorage(() => this.load(callback, isUpdated));
      }
    });
    if (isUpdated) Notification.create();
  }

  private load(callback: () => void, isUpdated: boolean) {
    loadOption((option) => {
      console.log(`load`);
      isUpdated || saveStorage({ recentTabIds: JSON.stringify([]) });
      ContextMenu.createAll(option);
      doAutoMute();
      updateActionBadge();
      setTimeout(callback, 100);
    });
  }
}
