import Mute from '../Mute/mute';
import { loadOption, loadStorage, StorageProperties } from '../Option/option';
import { ContextMenuId } from '../types/types';
import ActionBadge from '../UI/actionBadge';
import ContextMenu from '../UI/contextMenus';

export function update(ids?: ContextMenuId[]) {
  console.trace(`update`);
  doAutoMute();
  updateActionBadge();
  updateContextMenus(ids);
}

export function doAutoMute() {
  loadStorage(
    ['autoState', 'autoMode', 'recentTabIds', 'fixedTabId'],
    ({ autoState, autoMode, recentTabIds, fixedTabId }: StorageProperties) => {
      if (autoState) {
        const recentTabId = recentTabIds ? recentTabIds[0] : undefined;
        switch (autoMode) {
          case 'current':
            Mute.doAutoMute(autoMode);
            break;
          case 'recent':
            Mute.doAutoMute(autoMode, recentTabId);
            break;
          case 'fix':
            Mute.doAutoMute(autoMode, fixedTabId);
            break;
          case 'all':
            Mute.doAutoMute(autoMode);
            break;
          case 'fixOR':
            Mute.doAutoMute(autoMode, fixedTabId, recentTabId);
            break;
          case 'fixOC':
            Mute.doAutoMute(autoMode, fixedTabId);
            break;
          default:
            throw new Error(`Unavailable AutoMode: ${autoMode}`);
        }
      }
    }
  );
}

export function updateContextMenus(
  ids: ContextMenuId[] = [
    'muteCurrentTab',
    'autoMute',
    'autoMode',
    'actionMode',
  ]
) {
  console.trace(`updateContextMenus: ${ids}`);
  loadOption(
    (option) =>
      option.contextMenus && ids.forEach((id) => ContextMenu.update(option, id))
  );
}

export function toggleContextMenus() {
  loadOption((option) => ContextMenu.toggle(option));
}

export function updateActionBadge() {
  console.trace(`updateActionBadge`);
  loadStorage(['fixedTabId'], ({ fixedTabId }) =>
    loadOption((option) => ActionBadge.update(option, fixedTabId))
  );
}
