import { Api } from '../Api/api';
import I18N from '../I18N/i18n';

export default abstract class Notification {
  static async create() {
    Api.notifications.create('updated', {
      type: 'basic',
      iconUrl: './icons/icon128.png',
      title: await I18N.getMessage('notificationTitle'),
      message: `${await I18N.getMessage(
        'changelog_2_0_0'
      )}\n${await I18N.getMessage('changelog_1_8')}`,
      requireInteraction: true,
    });
  }
}
