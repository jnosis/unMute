import { browser } from './Api/api';
import localizeHtmlPage from './locale';
import { HiddenMode } from './types/types';

const version = document.querySelector('#version') as HTMLLabelElement;
const special = document.querySelector('#special');
version.textContent = `v ${getVersion()}`;
localizeHtmlPage();

function getVersion(): string {
  const v = browser.runtime.getManifest().version;
  return v;
}

async function sendHiddenMode(mode: HiddenMode) {
  const response = await browser.runtime.sendMessage({
    id: 'hidden',
    value: mode,
  });
  console.log(`Response: ${response.response}`);
}

special?.addEventListener('click', async () => {
  sendHiddenMode('fixOR');
});
version.addEventListener('click', async () => {
  sendHiddenMode('fixOC');
});
