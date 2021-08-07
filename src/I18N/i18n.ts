// * bypass i18n
export default abstract class I18N {
  static async bypassI18NinMV3(
    id: string,
    setI18N: Function,
    changelogs?: Array<string>
  ) {
    const messages = await this.fetchMessagesJSON('en');
    if (changelogs) {
      const title = messages[id]?.message;
      let message = changelogs.reduce(
        (message, log) => `${messages[log]?.message}\n${message}`,
        ''
      );
      setI18N(title, message);
    } else {
      const title = messages[`contextMenu_${id}`]?.message;
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

  static async fetchMessagesJSON(
    language: 'en' | 'ko'
  ): Promise<{ [id: string]: { message: string } }> {
    const url = chrome.runtime.getURL(`_locales/${language}/messages.json`);
    const response = await fetch(url);
    const messages = await response.json();
    return messages;
  }
}
