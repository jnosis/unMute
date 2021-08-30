export abstract class Api {
  // Promisify chrome api
  static getSyncStorage(): Promise<{ [key: string]: any }> {
    return new Promise((resolve) => chrome.storage.sync.get(resolve));
  }

  static getTab(tabId: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => chrome.tabs.get(tabId, resolve));
  }

  static queryTabs(
    queryInfo: chrome.tabs.QueryInfo
  ): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve) => chrome.tabs.query(queryInfo, resolve));
  }

  static getCurrentWindow(): Promise<chrome.windows.Window> {
    return new Promise((resolve) => chrome.windows.getCurrent(resolve));
  }
}
