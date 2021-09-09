import { browser } from '../Api/api';
import { AutoMode } from '../types/types';

export async function toggleMute(tabId: number) {
  const tab = await browser.tabs.get(tabId);
  let muted = !tab.mutedInfo?.muted;
  console.trace(`Toggling current tab: ${muted}`);
  browser.tabs.update(tabId, { muted });
}
export async function toggleAllTabs() {
  const tabs = await browser.tabs.query({ audible: true });
  console.trace(`Toggling all tabs`);
  tabs.forEach((tab) => tab.id && toggleMute(tab.id));
}

export async function doAutoMute(
  mode: AutoMode,
  tabId?: number,
  hiddenId?: number
) {
  console.trace(`Do auto mute: ${mode}, ${tabId}`);
  switch (mode) {
    case 'current':
      doCurrentMode();
      break;
    case 'recent':
      doRecentMode(tabId);
      break;
    case 'fix':
      doFixMode(tabId);
      break;
    case 'all':
      doAllMode();
      break;
    case 'fixOR':
      doFixOrRecentMode(tabId, hiddenId);
      break;
    case 'fixOC':
      doFixOrCurrentMode(tabId);
      break;

    default:
      throw new Error(`Unavailable AutoMode: ${mode}`);
  }
}
export async function doCurrentMode() {
  const tabs = await browser.tabs.query({ audible: true });
  const [currentTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  console.trace(`Do current mode: ${currentTab}`);
  if (currentTab?.id) {
    const currentTabId = currentTab.id;
    tabs
      .map((tab) => tab.id)
      .forEach((id) =>
        browser.tabs.update(id as number, { muted: id !== currentTabId })
      );
  }
}
export async function doRecentMode(recentTabId?: number) {
  console.trace(`Do recent mode: ${recentTabId}`);
  const tabs = await browser.tabs.query({ audible: true });
  tabs
    .map((tab) => tab.id)
    .forEach((id) =>
      browser.tabs.update(id as number, { muted: id !== recentTabId })
    );
}
export async function doFixMode(fixedTabId?: number) {
  console.trace(`Do fix mode: ${fixedTabId}`);
  const tabs = await browser.tabs.query({ audible: true });
  tabs
    .map((tab) => tab.id)
    .forEach((id) =>
      browser.tabs.update(id as number, { muted: id !== fixedTabId })
    );
}
export async function doAllMode() {
  console.trace(`Do all mode`);
  const tabs = await browser.tabs.query({ audible: true, muted: false });
  tabs
    .map((tab) => tab.id)
    .forEach((id) => browser.tabs.update(id as number, { muted: true }));
}
export async function releaseAllMute() {
  const tabs = await browser.tabs.query({ audible: true, muted: true });
  tabs.forEach(
    (tab) => tab.id && browser.tabs.update(tab.id, { muted: false })
  );
}

export async function doFixOrRecentMode(
  fixedTabId?: number,
  recentTabId?: number
) {
  console.trace(`Do fix or recent mode: ${fixedTabId}, ${recentTabId}`);
  const tabs = await browser.tabs.query({ audible: true });
  tabs
    .map((tab) => tab.id)
    .forEach((id) =>
      browser.tabs.update(id as number, {
        muted: id !== fixedTabId && id !== recentTabId,
      })
    );
}
export async function doFixOrCurrentMode(fixedTabId?: number) {
  console.trace(`Do fix or current mode: ${fixedTabId}`);
  const tabs = await browser.tabs.query({ audible: true });
  const [currentTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  let currentTabId = currentTab ? currentTab.id : undefined;

  tabs
    .map((tab) => tab.id)
    .forEach((id) =>
      browser.tabs.update(id as number, {
        muted: id !== fixedTabId && id !== currentTabId,
      })
    );
}
