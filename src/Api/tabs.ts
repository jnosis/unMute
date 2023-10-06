import { isChromium } from './platform';

export type Tab = chrome.tabs.Tab;
export type TabChangeInfo = chrome.tabs.TabChangeInfo;
export type CreateProperties = chrome.tabs.CreateProperties;
export type UpdateProperties = chrome.tabs.UpdateProperties;
export type QueryInfo = chrome.tabs.QueryInfo;

export function get(tabId: number): Promise<Tab> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab);
        }
      })
    );
  }
  return browser.tabs.get(tabId) as Promise<Tab>;
}

export function update(
  tabId: number,
  updateProperties: UpdateProperties
): Promise<Tab | undefined> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.tabs.update(tabId, updateProperties, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab);
        }
      })
    );
  }
  return browser.tabs.update(tabId, updateProperties) as Promise<
    Tab | undefined
  >;
}

export function query(queryInfo: QueryInfo): Promise<Tab[]> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.tabs.query(queryInfo, (tabs) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tabs);
        }
      })
    );
  }
  return browser.tabs.query(queryInfo) as Promise<Tab[]>;
}

export function create(createProperties: CreateProperties): Promise<Tab> {
  if (isChromium) {
    return new Promise((resolve, reject) =>
      chrome.tabs.create(createProperties, (tab) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(tab);
        }
      })
    );
  }
  return browser.tabs.create(createProperties) as Promise<Tab>;
}

export const onActivated = chrome.tabs.onActivated;
export const onUpdated = chrome.tabs.onUpdated;
export const onRemoved = chrome.tabs.onRemoved;
