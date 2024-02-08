import * as browser from '../Api/api';

export async function create() {
  browser.notifications.create('updated', {
    type: 'basic',
    iconUrl: './icons/icon128.png',
    title: browser.i18n.getMessage('notificationTitle'),
    message: `${browser.i18n.getMessage(
      'welcome_v3'
      // )}\n${browser.i18n.getMessage(
      //   'changelog_3_0_0'
    )}\n${browser.i18n.getMessage('changelog_3_0_0')}`,
    // requireInteraction: true,
  });
}
