import I18N from '../I18N/i18n';
import { Option } from '../Option/option';
import { ContextMenuId } from '../types/types';

type OnClickedListener = (menuItemId: ContextMenuId, tabId: number) => void;

export default abstract class ContextMenu {
  static async createAll(listener: OnClickedListener, option: Option) {
    console.trace(`create all context menus`);
    chrome.contextMenus.removeAll(async () => {
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
    });

    chrome.contextMenus.onClicked.addListener(
      ({ menuItemId }, tab) =>
        tab?.id && listener(menuItemId as ContextMenuId, tab.id)
    );
  }

  static async update(
    option: Option,
    id: ContextMenuId,
    updatedProperties?: chrome.contextMenus.UpdateProperties
  ) {
    console.trace(`Update context menu: ${id}`);
    if (!!updatedProperties) {
      chrome.contextMenus.update(id, updatedProperties);
    } else if (id === 'autoMute') {
      chrome.contextMenus.update(option.autoState ? 'on' : 'off', {
        checked: true,
      });
      chrome.contextMenus.update('muteCurrentTab', {
        visible: option.autoState ? false : true,
      });
      chrome.contextMenus.update('toggleAllTabs', {
        visible: option.autoState ? false : true,
      });
    } else if (id === 'autoMode') {
      chrome.contextMenus.update(`${option.autoMode}`, {
        checked: true,
      });
    } else if (id === 'actionMode') {
      chrome.contextMenus.update(`actionMode_${option.actionMode}`, {
        checked: true,
      });
    } else if (id === 'muteCurrentTab') {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const tab = tabs[0];
      if (tab) {
        if (tab.audible) {
          const messageId: ContextMenuId = tab.mutedInfo?.muted
            ? 'unmuteCurrentTab'
            : 'muteCurrentTab';
          chrome.contextMenus.update(id, {
            title: await I18N.getMessage(`contextMenu_${messageId}`),
          });
          chrome.contextMenus.update(id, { visible: true });
        } else {
          chrome.contextMenus.update(id, { visible: false });
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
    chrome.contextMenus.create(
      {
        id,
        title: await I18N.getMessage(`contextMenu_${id}`),
        contexts: isUI ? ['action'] : ['page', 'video', 'audio', 'action'],
      },
      () => {
        if (hasChildId && childIds) {
          childIds.forEach(async (childId) => {
            console.trace(`Create child context menu: ${childId}`);
            chrome.contextMenus.create({
              id: `${childId}`,
              parentId: id,
              title: await I18N.getMessage(`contextMenu_${childId}`),
              contexts: isUI
                ? ['action']
                : ['page', 'video', 'audio', 'action'],
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
    );
  }
}
