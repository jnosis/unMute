import { Language } from '../types/types';

// * bypass i18n
export default abstract class I18N {
  static async bypassI18NinMV3(
    id: string,
    setI18N: Function,
    changelogs?: Array<string>,
    messageId: string = id
  ) {
    const language: Language = 'en';
    const url = chrome.runtime.getURL(`_locales/${language}/messages.json`);
    const messages = await this.fetchMessagesJSON(url);
    if (changelogs) {
      const title = messages[id]?.message;
      let message = changelogs.reduce(
        (message, log) => `${messages[log]?.message}\n${message}`,
        ''
      );
      setI18N(title, message);
    } else {
      const title = messages[`contextMenu_${messageId}`]?.message;
      setI18N(id, title);
    }
  }

  static setI18NtoContextMenus(id: string, title: string) {
    chrome.contextMenus.update(id, {
      title,
    });
  }

  static setI18NtoNotification(title: string, message: string) {
    chrome.notifications.create('updated', {
      title,
      message,
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      requireInteraction: true,
    });
  }

  private static async fetchMessagesJSON(
    request: RequestInfo
  ): Promise<{ [id: string]: { message: string } }> {
    const response = await fetch(request);
    const messages = await response.json();
    return messages;
  }
}
