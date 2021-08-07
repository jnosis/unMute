import I18N from '../I18N/i18n';
import { initOption, Option } from '../Option/option';
import { ContextMenuId } from '../types/types';

export default abstract class ContextMenu {
  static createContextMenus(opt: Option = initOption) {
    chrome.contextMenus.removeAll();
    this.createContextMenuAndItsChildren(opt, 'muteCurrentTab');
    this.createContextMenuAndItsChildren(opt, 'autoMute', false, true, [
      'on',
      'off',
    ]);
    this.createContextMenuAndItsChildren(opt, 'autoMode', false, true, [
      'current',
      'recent',
      'fix',
      'all',
    ]);
    this.createContextMenuAndItsChildren(opt, 'actionMode', false, true, [
      'actionMode_muteCurrentTab',
      'actionMode_toggleAllTabs',
      'actionMode_autoMute',
      'actionMode_autoMode',
      'actionMode_fixTab',
    ]);
    this.createContextMenuAndItsChildren(opt, 'toggleAllTabs', false);
    this.createContextMenuAndItsChildren(opt, 'shortcuts', true);
    this.createContextMenuAndItsChildren(opt, 'changelog', true);
  }
  static updateContextMenu(
    opt: Option = initOption,
    id: ContextMenuId,
    updatedProperties?: chrome.contextMenus.UpdateProperties
  ) {
    if (!!updatedProperties) {
      chrome.contextMenus.update(id, updatedProperties);
    } else if (id === 'autoMute') {
      chrome.contextMenus.update(opt.autoState ? 'on' : 'off', {
        checked: true,
      });
      chrome.contextMenus.update('muteCurrentTab', {
        visible: opt.autoState ? false : true,
      });
      chrome.contextMenus.update('toggleAllTabs', {
        visible: opt.autoState ? false : true,
      });
    } else if (id === 'actionMode') {
      chrome.contextMenus.update(`actionMode_${opt.actionMode}`, {
        checked: true,
      });
    }
  }

  private static createContextMenuAndItsChildren(
    opt: Option = initOption,
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
          this.updateContextMenu(opt, id);
        }
      }
    );
  }
}
