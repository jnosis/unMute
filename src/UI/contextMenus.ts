import { browser } from '../Api/api';
import { Option } from '../Option/option';
import { ContextMenuId } from '../types/types';

export default abstract class ContextMenu {
  static async createAll(option: Option) {
    console.trace(`create all context menus`);
    await browser.contextMenus.removeAll();

    await this.createByIdAndItsChildren(option, 'muteCurrentTab');
    await this.createByIdAndItsChildren(option, 'autoMute', false, true, [
      'on',
      'off',
    ]);
    await this.createByIdAndItsChildren(option, 'autoMode', false, true, [
      'current',
      'recent',
      'fix',
      'all',
    ]);
    await this.createByIdAndItsChildren(option, 'actionMode', false, true, [
      'actionMode_muteCurrentTab',
      'actionMode_toggleAllTabs',
      'actionMode_autoMute',
      'actionMode_autoMode',
      'actionMode_fixTab',
    ]);
    await this.createByIdAndItsChildren(option, 'toggleAllTabs', false);
    await this.createByIdAndItsChildren(option, 'shortcuts', true);
    await this.createByIdAndItsChildren(option, 'changelog', true);
  }

  static async update(
    option: Option,
    id: ContextMenuId,
    updatedProperties?: browser.contextMenus.UpdateProperties
  ) {
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
      browser.contextMenus.update(`${option.autoMode}`, {
        checked: true,
      });
    } else if (id === 'actionMode') {
      browser.contextMenus.update(`actionMode_${option.actionMode}`, {
        checked: true,
      });
    } else if (id === 'muteCurrentTab') {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
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
  }

  private static async createByIdAndItsChildren(
    option: Option,
    id: ContextMenuId,
    isUI: boolean = false,
    hasChildId: boolean = false,
    childIds?: Array<ContextMenuId>
  ) {
    console.trace(`Create context menu: ${id}`);
    await browser.contextMenus.create({
      id,
      title: browser.i18n.getMessage(`contextMenu_${id}`),
      contexts: isUI
        ? ['browser_action']
        : ['page', 'video', 'audio', 'browser_action'],
    });
    if (hasChildId && childIds) {
      childIds.forEach(async (childId) => {
        console.trace(`Create child context menu: ${childId}`);
        browser.contextMenus.create({
          id: `${childId}`,
          parentId: id,
          title: browser.i18n.getMessage(`contextMenu_${childId}`),
          contexts: isUI
            ? ['browser_action']
            : ['page', 'video', 'audio', 'browser_action'],
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
      this.update(option, id);
    }
  }
}
