import * as browser from './Api/api';
import localizeHtmlPage from './locale';
import { loadOption } from './Option/option';
import { OptionPageMessageId } from './types/types';

document.addEventListener('DOMContentLoaded', () => {
  localizeHtmlPage();
  loadOptionsPage();
});
document.addEventListener('click', saveOptionsPage);
browser.storage.onChanged.addListener(loadOptionsPage);

async function sendMessage(id: OptionPageMessageId, value: string | boolean) {
  console.trace(id, value);
  const response = await browser.runtime.sendMessage({ id, value });
  console.log(`Response: ${response.response}`);
  if (response.response === 'reset') location.reload();
}

function saveOptionsPage(event: MouseEvent) {
  const target = event.target as HTMLInputElement;
  const name = target.getAttribute('name');
  const id = target.id;
  console.log({ name, id });

  if (name === 'actionMode') {
    const value = target.value;
    sendMessage('actionMode', value);
  } else if (id === 'autoState') {
    const value = target.checked;
    sendMessage('autoState', value);
  } else if (name === 'autoMode') {
    const value = target.value;
    sendMessage('autoMode', value);
  } else if (name === 'offBehavior') {
    const value = target.value;
    sendMessage('offBehavior', value);
  } else if (name === 'recentBehavior') {
    const value = target.value;
    sendMessage('recentBehavior', value);
  } else if (id === 'contextMenus') {
    const value = target.checked;
    sendMessage('contextMenus', value);
  } else if (id === 'reset') {
    sendMessage('reset', true);
    location.reload();
  } else if (id === 'changelog') {
    const url = browser.runtime.getURL('changelog.html');
    browser.tabs.create({ url });
  }
}

function loadOptionsPage() {
  loadOption(
    ({
      actionMode,
      autoState,
      autoMode,
      offBehavior,
      recentBehavior,
      contextMenus,
    }) => {
      const actionModeOption = document.querySelector(
        `#${actionMode}`
      ) as HTMLInputElement;
      const autoSateOption = document.querySelector(
        `#autoState`
      ) as HTMLInputElement;
      const isFix = autoMode.slice(0, 3) === 'fix';
      const autoModeOption = document.querySelector(
        isFix ? '#fix' : `#${autoMode}`
      ) as HTMLInputElement;
      const offBehaviorOption = document.querySelector(
        `#${offBehavior}`
      ) as HTMLInputElement;
      const recentBehaviorOption = document.querySelector(
        `#recent_${recentBehavior}`
      ) as HTMLInputElement;
      const contextMenusOption = document.querySelector(
        `#contextMenus`
      ) as HTMLInputElement;

      console.table({
        actionMode,
        autoState,
        autoMode,
        offBehavior,
        recentBehavior,
        contextMenus,
      });

      actionModeOption.checked = true;
      autoSateOption.checked = autoState;
      autoModeOption.checked = true;
      offBehaviorOption.checked = true;
      recentBehaviorOption.checked = true;
      contextMenusOption.checked = contextMenus;
    }
  );
}
