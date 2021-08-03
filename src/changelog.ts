import localizeHtmlPage from './locale';

const version = document.querySelector('#version') as HTMLLabelElement;
version.textContent = `v ${getVersion()}`;
localizeHtmlPage();

function getVersion(): string {
  const v = chrome.runtime.getManifest().version;
  return v;
}
