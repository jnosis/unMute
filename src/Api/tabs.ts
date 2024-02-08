import { isChromium } from './platform';

export type Tab = chrome.tabs.Tab;
export type TabChangeInfo = chrome.tabs.TabChangeInfo;
export type CreateProperties = chrome.tabs.CreateProperties;
export type UpdateProperties = chrome.tabs.UpdateProperties;
export type QueryInfo = chrome.tabs.QueryInfo;

export function get(tabId: number): Promise<Tab> {
  return isChromium
    ? chrome.tabs.get(tabId)
    : (browser.tabs.get(tabId) as Promise<Tab>);
}

export function update(
  tabId: number,
  updateProperties: UpdateProperties
): Promise<Tab | undefined> {
  return isChromium
    ? chrome.tabs.update(tabId, updateProperties)
    : (browser.tabs.update(tabId, updateProperties) as Promise<
        Tab | undefined
      >);
}

export function query(queryInfo: QueryInfo): Promise<Tab[]> {
  return isChromium
    ? chrome.tabs.query(queryInfo)
    : (browser.tabs.query(queryInfo) as Promise<Tab[]>);
}

export function create(createProperties: CreateProperties): Promise<Tab> {
  return isChromium
    ? chrome.tabs.create(createProperties)
    : (browser.tabs.create(createProperties) as Promise<Tab>);
}

export const onActivated = isChromium
  ? chrome.tabs.onActivated
  : browser.tabs.onActivated;
export const onUpdated = isChromium
  ? chrome.tabs.onUpdated
  : (browser.tabs.onUpdated as typeof chrome.tabs.onUpdated);
export const onRemoved = isChromium
  ? chrome.tabs.onRemoved
  : browser.tabs.onRemoved;
