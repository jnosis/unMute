import { browser } from '../Api/api';

export default abstract class Notification {
  static async create() {
    browser.notifications.create('updated', {
      type: 'basic',
      iconUrl: './icons/icon128.png',
      title: browser.i18n.getMessage('notificationTitle'),
      message: `${browser.i18n.getMessage(
        'changelog_2_0_0'
      )}\n${browser.i18n.getMessage('changelog_1_8')}`,
      requireInteraction: true,
    });
  }
}
