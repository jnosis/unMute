import I18N from '../I18N/i18n';
import { defaultOption, Option } from '../Option/option';
import { ContextMenuId } from '../types/types';

export default abstract class ContextMenu {
  static createContextMenus(option: Option = defaultOption) {
    chrome.contextMenus.removeAll();
    this.createContextMenuAndItsChildren(option, 'muteCurrentTab');
    this.createContextMenuAndItsChildren(option, 'autoMute', false, true, [
      'on',
      'off',
    ]);
    this.createContextMenuAndItsChildren(option, 'autoMode', false, true, [
      'current',
      'recent',
      'fix',
      'all',
    ]);
    this.createContextMenuAndItsChildren(option, 'actionMode', false, true, [
      'actionMode_muteCurrentTab',
      'actionMode_toggleAllTabs',
      'actionMode_autoMute',
      'actionMode_autoMode',
      'actionMode_fixTab',
    ]);
    this.createContextMenuAndItsChildren(option, 'toggleAllTabs', false);
    this.createContextMenuAndItsChildren(option, 'shortcuts', true);
    this.createContextMenuAndItsChildren(option, 'changelog', true);
  }
  static updateContextMenu(
    option: Option = defaultOption,
    id: ContextMenuId,
    updatedProperties?: chrome.contextMenus.UpdateProperties
  ) {
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
    } else if (id === 'actionMode') {
      chrome.contextMenus.update(`actionMode_${option.actionMode}`, {
        checked: true,
      });
    }
  }

  private static createContextMenuAndItsChildren(
    option: Option = defaultOption,
    id: ContextMenuId,
    isUI: boolean = false,
    hasChildId: boolean = false,
    childIds?: Array<ContextMenuId>
  ) {
    chrome.contextMenus.create(
      {
        id,
        title: `chrome.i18n.getMessage(contextMenu_${id})`,
        contexts: isUI ? ['action'] : ['page', 'video', 'audio', 'action'],
      },
      () => {
        I18N.bypassI18NinMV3(id, I18N.setI18NtoContextMenus);
        if (hasChildId && childIds) {
          childIds.forEach((childId) =>
            chrome.contextMenus.create(
              {
                id: `${childId}`,
                parentId: id,
                title: `chrome.i18n.getMessage(contextMenu_${childId})`,
                contexts: isUI
                  ? ['action']
                  : ['page', 'video', 'audio', 'action'],
                type: 'radio',
              },
              () => I18N.bypassI18NinMV3(childId, I18N.setI18NtoContextMenus)
            )
          );
          this.updateContextMenu(option, id);
        }
      }
    );
  }
}
