import { browser } from '../Api/api';
import { ActionMode, AutoMode, OffBehavior } from '../types/types';
import { loadOption, saveOption } from './option';

export function setActionMode(actionMode: ActionMode, callback?: () => void) {
  console.trace(`Set action mode: ${actionMode}`);
  saveOption({ actionMode }, callback);
  browser.storage.sync.set({ actionMode });
}
export function setAutoMode(autoMode: AutoMode, callback?: () => void) {
  console.trace(`Set auto mode: ${autoMode}`);
  saveOption({ autoMode }, callback);
  browser.storage.sync.set({ autoMode });
}
export function setAutoState(autoState: boolean, callback?: () => void) {
  console.trace(`Set auto state: ${autoState}`);
  saveOption({ autoState }, callback);
  browser.storage.sync.set({ autoState });
}
export function setOffBehavior(
  offBehavior: OffBehavior,
  callback?: () => void
) {
  console.trace(`Set off behavior: ${offBehavior}`);
  saveOption({ offBehavior }, callback);
  browser.storage.sync.set({ offBehavior });
}
export function setRecentBehavior(
  recentBehavior: OffBehavior,
  callback?: () => void
) {
  console.trace(`Set off behavior: ${recentBehavior}`);
  saveOption({ recentBehavior }, callback);
  browser.storage.sync.set({ recentBehavior });
}
export function setContextMenus(contextMenus: boolean, callback?: () => void) {
  console.trace(`Set context menus: ${contextMenus}`);
  saveOption({ contextMenus }, callback);
  browser.storage.sync.set({ contextMenus });
}
export function reset() {
  console.trace(`Reset option`);
  saveOption();
}

export function toggleAutoMute(callback?: () => void) {
  console.trace(`Toggle auto mute`);
  loadOption(({ autoState }) => {
    setAutoState(!autoState, callback);
  });
}

export function rotateAutoMode(callback?: () => void) {
  console.trace(`Rotate auto mode`);
  loadOption(({ autoMode }) => {
    switch (autoMode) {
      case 'current':
        setAutoMode('recent', callback);
        break;
      case 'recent':
        setAutoMode('fix', callback);
        break;
      case 'fix':
      case 'fixOR':
      case 'fixOC':
        setAutoMode('all', callback);
        break;
      case 'all':
        setAutoMode('current', callback);
        break;

      default:
        throw Error(`Unavailable auto mode ${autoMode}`);
    }
  });
}
