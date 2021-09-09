import { browser } from '../Api/api';
import {
  initStorage,
  loadOption,
  loadStorage,
  saveStorage,
} from '../Option/option';
import * as ContextMenu from '../UI/contextMenus';
import * as Notification from '../UI/notification';
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
        this.load(isUpdated, callback);
      } else {
        initStorage(() => this.load(isUpdated, callback));
      }
    });
    if (isUpdated) Notification.create();
  }

  private load(isUpdated: boolean, callback: () => void) {
    loadOption((option) => {
      console.log(`load`);
      isUpdated || saveStorage({ recentTabIds: [] });
      ContextMenu.createAll(option);
      doAutoMute();
      updateActionBadge();
      setTimeout(callback, 100);
    });
  }
}
