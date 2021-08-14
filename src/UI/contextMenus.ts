import I18N from '../I18N/i18n';
import { Option } from '../Option/option';
import { ContextMenuId, Language } from '../types/types';

type OnClickedListener = (menuItemId: ContextMenuId, tabId: number) => void;

export default abstract class ContextMenu {
  static createAll(listener: OnClickedListener, option: Option) {
    console.trace(`create all context menus`);
    chrome.contextMenus.removeAll(() => {
      this.createByIdAndItsChildren(option, 'muteCurrentTab');
      this.createByIdAndItsChildren(option, 'autoMute', false, true, [
        'on',
        'off',
      ]);
      this.createByIdAndItsChildren(option, 'autoMode', false, true, [
        'current',
        'recent',
        'fix',
        'all',
      ]);
      this.createByIdAndItsChildren(option, 'actionMode', false, true, [
        'actionMode_muteCurrentTab',
        'actionMode_toggleAllTabs',
        'actionMode_autoMute',
        'actionMode_autoMode',
        'actionMode_fixTab',
      ]);
      this.createByIdAndItsChildren(option, 'toggleAllTabs', false);
      this.createByIdAndItsChildren(option, 'shortcuts', true);
      this.createByIdAndItsChildren(option, 'changelog', true);
    });

    chrome.contextMenus.onClicked.addListener(
      ({ menuItemId }, tab) => tab?.id && listener(menuItemId, tab.id)
    );
  }

  static updateAll(option: Option) {
    this.update(option, 'muteCurrentTab');
    this.update(option, 'autoMute');
    this.update(option, 'autoMode');
    this.update(option, 'actionMode');
  }

  static async update(
    option: Option,
    id: ContextMenuId,
    updatedProperties?: chrome.contextMenus.UpdateProperties
  ) {
    console.trace(`Update context menu: ${id}`);
    if (!!updatedProperties) {
      chrome.contextMenus.update(id, updatedProperties, () =>
        this.catchUpdateErrorBeforeCreate(option, id, updatedProperties)
      );
    } else if (id === 'autoMute') {
      chrome.contextMenus.update(
        option.autoState ? 'on' : 'off',
        {
          checked: true,
        },
        () => this.catchUpdateErrorBeforeCreate(option, id, updatedProperties)
      );
      chrome.contextMenus.update(
        'muteCurrentTab',
        {
          visible: option.autoState ? false : true,
        },
        () => this.catchUpdateErrorBeforeCreate(option, id, updatedProperties)
      );
      chrome.contextMenus.update(
        'toggleAllTabs',
        {
          visible: option.autoState ? false : true,
        },
        () => this.catchUpdateErrorBeforeCreate(option, id, updatedProperties)
      );
    } else if (id === 'autoMode') {
      chrome.contextMenus.update(
        `${option.autoMode}`,
        {
          checked: true,
        },
        () => this.catchUpdateErrorBeforeCreate(option, id, updatedProperties)
      );
    } else if (id === 'actionMode') {
      chrome.contextMenus.update(
        `actionMode_${option.actionMode}`,
        {
          checked: true,
        },
        () => this.catchUpdateErrorBeforeCreate(option, id, updatedProperties)
      );
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
          I18N.bypassI18NinMV3(
            id,
            I18N.setI18NtoContextMenus,
            option.language,
            undefined,
            messageId
          );
          chrome.contextMenus.update(id, { visible: true }, () =>
            this.catchUpdateErrorBeforeCreate(option, id, updatedProperties)
          );
        } else {
          chrome.contextMenus.update(id, { visible: false }, () =>
            this.catchUpdateErrorBeforeCreate(option, id, updatedProperties)
          );
        }
      }
    }
  }

  private static createByIdAndItsChildren(
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
        title: `chrome.i18n.getMessage(contextMenu_${id})`,
        contexts: isUI ? ['action'] : ['page', 'video', 'audio', 'action'],
      },
      () => {
        I18N.bypassI18NinMV3(id, I18N.setI18NtoContextMenus, option.language);
        if (hasChildId && childIds) {
          childIds.forEach((childId) => {
            console.trace(`Create child context menu: ${childId}`);
            chrome.contextMenus.create(
              {
                id: `${childId}`,
                parentId: id,
                title: `chrome.i18n.getMessage(contextMenu_${childId})`,
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
              },
              () => {
                I18N.bypassI18NinMV3(
                  childId,
                  I18N.setI18NtoContextMenus,
                  option.language
                );
              }
            );
          });
        } else {
          this.update(option, id);
        }
      }
    );
  }

  private static catchUpdateErrorBeforeCreate(
    option: Option,
    id: ContextMenuId,
    updatedProperties?: chrome.contextMenus.UpdateProperties
  ) {
    if (chrome.runtime.lastError) {
      setTimeout(() => {
        ContextMenu.update(option, id, updatedProperties);
      }, 0);
    }
  }

  static updateLanguage(language: Language) {
    I18N.bypassI18NinMV3('autoMute', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('autoMode', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('actionMode', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('toggleAllTabs', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('shortcuts', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('changelog', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('on', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('off', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('current', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('recent', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('fix', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3('all', I18N.setI18NtoContextMenus, language);
    I18N.bypassI18NinMV3(
      'actionMode_muteCurrentTab',
      I18N.setI18NtoContextMenus,
      language
    );
    I18N.bypassI18NinMV3(
      'actionMode_toggleAllTabs',
      I18N.setI18NtoContextMenus,
      language
    );
    I18N.bypassI18NinMV3(
      'actionMode_autoMute',
      I18N.setI18NtoContextMenus,
      language
    );
    I18N.bypassI18NinMV3(
      'actionMode_autoMode',
      I18N.setI18NtoContextMenus,
      language
    );
    I18N.bypassI18NinMV3(
      'actionMode_fixTab',
      I18N.setI18NtoContextMenus,
      language
    );
  }
}
