// * bypass i18n
export default abstract class I18N {
  static bypassI18NinMV3(
    id: string,
    language: 'en' | 'ko',
    getI18N: Function,
    changelogs: Array<string> | null
  ) {
    const url = `_locales/${language}/messages.json`;
    fetch(url)
      .then((response) => response.json())
      .then((messageJSON) => {
        const title = messageJSON[id].message;
        if (changelogs) {
          let message = '';
          changelogs.forEach(
            (log) => (message += `${messageJSON[log].message} `)
          );
          getI18N(title, message);
        } else {
          getI18N(id, title);
        }
      });
  }

  static getI18NtoContextMenus(id: string, title: string) {
    chrome.contextMenus.update(id, {
      title,
    });
  }

  static getI18NtoNotification(title: string, message: string) {
    chrome.notifications.create('updated', {
      title,
      message,
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      requireInteraction: true,
    });
  }
}
