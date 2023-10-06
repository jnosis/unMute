import * as browser from '../Api/api';
import { Option } from '../Option/option';
import { ContextMenuId } from '../types/types';

export async function createAll(option: Option) {
  console.trace(`create all context menus`);
  await browser.contextMenus.removeAll();

  if (!option.contextMenus) {
    return;
  }
  await createByIdAndItsChildren(option, 'muteCurrentTab');
  await createByIdAndItsChildren(option, 'autoMute', false, ['on', 'off']);
  await createByIdAndItsChildren(option, 'autoMode', false, [
    'current',
    'recent',
    'fix',
    'all',
  ]);
  await createByIdAndItsChildren(option, 'actionMode', false, [
    'actionMode_muteCurrentTab',
    'actionMode_toggleAllTabs',
    'actionMode_autoMute',
    'actionMode_autoMode',
    'actionMode_fixTab',
  ]);
  await createByIdAndItsChildren(option, 'toggleAllTabs', false);
  await createByIdAndItsChildren(option, 'shortcuts', true);
  await createByIdAndItsChildren(option, 'changelog', true);
}

export async function update(
  option: Option,
  id: ContextMenuId,
  updatedProperties?: browser.contextMenus.UpdateProperties
) {
  try {
    console.trace(`Update context menu: ${id}`);
    if (!!updatedProperties) {
      browser.contextMenus.update(id, updatedProperties);
    } else if (id === 'autoMute') {
      browser.contextMenus.update(option.autoState ? 'on' : 'off', {
        checked: true,
      });
      browser.contextMenus.update('muteCurrentTab', {
        visible: option.autoState ? false : true,
      });
      browser.contextMenus.update('toggleAllTabs', {
        visible: option.autoState ? false : true,
      });
    } else if (id === 'autoMode') {
      if (option.autoMode !== 'fixOR' && option.autoMode !== 'fixOC') {
        browser.contextMenus.update(`${option.autoMode}`, {
          checked: true,
        });
      } else {
        browser.contextMenus.update('fix', { checked: true });
      }
    } else if (id === 'actionMode') {
      browser.contextMenus.update(`actionMode_${option.actionMode}`, {
        checked: true,
      });
    } else if (id === 'muteCurrentTab') {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tab) {
        if (tab.audible) {
          const messageId: ContextMenuId = tab.mutedInfo?.muted
            ? 'unmuteCurrentTab'
            : 'muteCurrentTab';
          browser.contextMenus.update(id, {
            title: browser.i18n.getMessage(`contextMenu_${messageId}`),
          });
          browser.contextMenus.update(id, { visible: true });
        } else {
          browser.contextMenus.update(id, { visible: false });
        }
      }
    }
  } catch (error) {
    setTimeout(() => {
      update(option, id, updatedProperties);
    }, 0);
  }
}

export function toggle(option: Option) {
  console.trace(`toggle context menus`);
  if (option.contextMenus) {
    createAll(option);
  } else {
    console.log('remove all context menus');
    browser.contextMenus.removeAll();
  }
}

export async function createByIdAndItsChildren(
  option: Option,
  id: ContextMenuId,
  isUI: boolean = false,
  childIds?: ContextMenuId[]
) {
  console.trace(`Create context menu: ${id}`);
  await browser.contextMenus.create({
    id,
    title: browser.i18n.getMessage(`contextMenu_${id}`),
    contexts: isUI ? ['action'] : ['page', 'video', 'audio', 'action'],
  });
  if (!!childIds) {
    childIds.forEach(async (childId) => {
      console.trace(`Create child context menu: ${childId}`);
      browser.contextMenus.create({
        id: `${childId}`,
        parentId: id,
        title: browser.i18n.getMessage(`contextMenu_${childId}`),
        contexts: isUI ? ['action'] : ['page', 'video', 'audio', 'action'],
        type: 'radio',
        checked:
          id === 'autoMute'
            ? childId === (option.autoState ? 'on' : 'off')
            : id === 'autoMode'
            ? childId === option.autoMode
            : childId === `${id}_${option.actionMode}`,
      });
    });
  } else {
    update(option, id);
  }
}
