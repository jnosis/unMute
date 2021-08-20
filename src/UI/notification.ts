import I18N from '../I18N/i18n';

type OnClickedListener = (notificationId: string) => void;

export default abstract class Notification {
  static async create(listener: OnClickedListener) {
    chrome.notifications.create('updated', {
      type: 'basic',
      iconUrl: './icons/icon128.png',
      title: await I18N.getMessage('notificationTitle'),
      message: `${await I18N.getMessage(
        'changelog_2_0_0'
      )}\n${await I18N.getMessage('changelog_1_8')}`,
      requireInteraction: true,
    });
    chrome.notifications.onClicked.addListener((notificationId: string) =>
      listener(notificationId)
    );
  }
}
