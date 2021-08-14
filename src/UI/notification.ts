import I18N from '../I18N/i18n';
import { Language } from '../types/types';

type OnClickedListener = (notificationId: string) => void;

export default abstract class Notification {
  static create(listener: OnClickedListener, language: Language) {
    I18N.bypassI18NinMV3(
      'notificationTitle',
      I18N.setI18NtoNotification,
      language,
      ['changelog_1_0_0', 'changelog_1_0_1']
    );
    // chrome.notifications.create('updated', {
    //   type: 'basic',
    //   iconUrl: './icons/icon128.png',
    //   title: chrome.i18n.getMessage('notificationTitle'),
    //   message: chrome.i18n.getMessage('changelog_1_0_0'),
    //   requireInteraction: true,
    // });
    chrome.notifications.onClicked.addListener((notificationId: string) =>
      listener(notificationId)
    );
  }
}
