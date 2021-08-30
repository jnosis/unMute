// Promisify chrome api
export namespace Api.tabs {
  export function get(tabId: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve) => chrome.tabs.get(tabId, resolve));
  }

  export function update(
    tabId: number,
    updateProperties: chrome.tabs.UpdateProperties
  ): Promise<chrome.tabs.Tab | undefined> {
    return new Promise((resolve) =>
      chrome.tabs.update(tabId, updateProperties, resolve)
    );
  }

  export function query(
    queryInfo: chrome.tabs.QueryInfo
  ): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve) => chrome.tabs.query(queryInfo, resolve));
  }
}

export namespace Api.windows {
  export function getCurrent(): Promise<chrome.windows.Window> {
    return new Promise((resolve) => chrome.windows.getCurrent(resolve));
  }
}

export namespace Api.storage {
  interface StorageArea {
    get(
      keys: string | string[] | { [key: string]: any } | null
    ): Promise<{ [key: string]: any }>;
    set(items: { [key: string]: any }): Promise<void>;
  }

  class LocalStorageArea implements StorageArea {
    get(
      keys: string | string[] | { [key: string]: any } | null = null
    ): Promise<{ [key: string]: any }> {
      return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
    }

    set(items: { [key: string]: any }): Promise<void> {
      return new Promise((resolve) => chrome.storage.local.set(items, resolve));
    }
  }

  class SyncStorageArea implements StorageArea {
    get(
      keys: string | string[] | { [key: string]: any } | null = null
    ): Promise<{ [key: string]: any }> {
      return new Promise((resolve) => chrome.storage.sync.get(keys, resolve));
    }

    set(items: { [key: string]: any }): Promise<void> {
      return new Promise((resolve) => chrome.storage.sync.set(items, resolve));
    }

    clear(): Promise<void> {
      return new Promise((resolve) => chrome.storage.sync.clear(resolve));
    }
  }

  export const sync = new SyncStorageArea();
  export const local = new LocalStorageArea();
}
