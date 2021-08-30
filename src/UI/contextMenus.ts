import { Api } from '../Api/api';
import I18N from '../I18N/i18n';
import { Option } from '../Option/option';
import { ContextMenuId } from '../types/types';

export default abstract class ContextMenu {
  static async createAll(option: Option) {
    console.trace(`create all context menus`);
    await Api.contextMenus.removeAll();

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
    updatedProperties?: Api.contextMenus.UpdateProperties
  ) {
    console.trace(`Update context menu: ${id}`);
    if (!!updatedProperties) {
      Api.contextMenus.update(id, updatedProperties);
    } else if (id === 'autoMute') {
      Api.contextMenus.update(option.autoState ? 'on' : 'off', {
        checked: true,
      });
      Api.contextMenus.update('muteCurrentTab', {
        visible: option.autoState ? false : true,
      });
      Api.contextMenus.update('toggleAllTabs', {
        visible: option.autoState ? false : true,
      });
    } else if (id === 'autoMode') {
      Api.contextMenus.update(`${option.autoMode}`, {
        checked: true,
      });
    } else if (id === 'actionMode') {
      Api.contextMenus.update(`actionMode_${option.actionMode}`, {
        checked: true,
      });
    } else if (id === 'muteCurrentTab') {
      const tabs = await Api.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      if (tab) {
        if (tab.audible) {
          const messageId: ContextMenuId = tab.mutedInfo?.muted
            ? 'unmuteCurrentTab'
            : 'muteCurrentTab';
          Api.contextMenus.update(id, {
            title: await I18N.getMessage(`contextMenu_${messageId}`),
          });
          Api.contextMenus.update(id, { visible: true });
        } else {
          Api.contextMenus.update(id, { visible: false });
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
    await Api.contextMenus.create({
      id,
      title: await I18N.getMessage(`contextMenu_${id}`),
      contexts: isUI
        ? ['browser_action']
        : ['page', 'video', 'audio', 'browser_action'],
    });
    if (hasChildId && childIds) {
      childIds.forEach(async (childId) => {
        console.trace(`Create child context menu: ${childId}`);
        Api.contextMenus.create({
          id: `${childId}`,
          parentId: id,
          title: await I18N.getMessage(`contextMenu_${childId}`),
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
