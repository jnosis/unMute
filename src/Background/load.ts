import * as browser from '../Api/api';
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
  constructor(details?: browser.runtime.InstalledDetails) {
    this.onLoad(details);
  }

  private onLoad(details?: browser.runtime.InstalledDetails) {
    const isUpdated = details?.reason === 'update';
    loadStorage('wasInit', ({ wasInit }) => {
      console.log(`Initialize: ${!!wasInit}`);
      if (wasInit) {
        this.load(isUpdated);
      } else {
        initStorage(() => this.load(isUpdated));
      }
    });
    if (isUpdated) Notification.create();
  }

  private load(isUpdated: boolean) {
    loadOption((option) => {
      console.log(`load`);
      isUpdated || saveStorage({ recentTabIds: [] });
      ContextMenu.createAll(option);
      doAutoMute();
      updateActionBadge();
    });
  }
}
