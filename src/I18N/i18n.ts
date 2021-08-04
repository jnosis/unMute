// * bypass i18n
export default abstract class I18N {
  static bypassI18NinMV3(
    id: string,
    language: 'en' | 'ko',
    getI18N: Function,
    changelogs?: Array<string>
  ) {
    const url = `_locales/${language}/messages.json`;
    fetch(url)
      .then((response) => response.json())
      .then((messageJSON) => {
        if (changelogs) {
          const title = messageJSON[id].message;
          let message = '';
          changelogs.forEach(
            (log) => (message += `${messageJSON[log].message} `)
          );
          getI18N(title, message);
        } else {
          const title = messageJSON[`contextMenu_${id}`].message;
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
