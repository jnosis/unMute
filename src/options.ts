import localizeHtmlPage from './locale';
import { loadOption } from './Option/option';
import { OptionPageMessage, OptionPageResponse } from './types/types';

document.addEventListener('DOMContentLoaded', () => {
  localizeHtmlPage();
  loadOptionsPage();
});
document.addEventListener('click', saveOptionsPage);
chrome.storage.onChanged.addListener(loadOptionsPage);

function sendMessage(message: OptionPageMessage, value: string | boolean) {
  console.trace(message, value);
  chrome.runtime.sendMessage(
    { message, value },
    (response: OptionPageResponse) => {
      console.log(`Response: ${response.message}`);
      if (response.message === 'reset') location.reload();
    }
  );
}

function saveOptionsPage(event: MouseEvent) {
  const target = event.target as HTMLInputElement;
  const name = target.getAttribute('name');
  const id = target.id;
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
  } else if (id === 'reset') {
    sendMessage('reset', true);
    location.reload();
  } else if (id === 'changelog') {
    const url = chrome.runtime.getURL('changelog.html');
    chrome.tabs.create({ url });
  } else if (id === 'language') {
    const value = target.value;
    sendMessage('language', value);
  }
}

function loadOptionsPage() {
  loadOption(({ actionMode, autoState, autoMode, offBehavior }) => {
    const actionModeOption = document.querySelector(
      `#${actionMode}`
    ) as HTMLInputElement;
    const autoSateOption = document.querySelector(
      `#autoState`
    ) as HTMLInputElement;
    const autoModeOption = document.querySelector(
      `#${autoMode}`
    ) as HTMLInputElement;
    const offBehaviorOption = document.querySelector(
      `#${offBehavior}`
    ) as HTMLInputElement;

    actionModeOption.checked = true;
    autoSateOption.checked = autoState;
    autoModeOption.checked = true;
    offBehaviorOption.checked = true;
  });
}
