import { StorageProperties } from '../Option/option';
import { Command, OptionPageResponse } from '../types/types';

type OnStorageChanged = (changes: StorageProperties) => void;
type OnMessage = (
  message: OptionPageResponse,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) => void;
type OnActionClick = (tabId: number) => void;
type OnCommand = (command: Command, tabId: number) => void;
type OnTabActivated = (tabId: number) => void;
type OnTabUpdated = (
  tabId: number,
  _changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => void;
type OnWindowFocusChanged = (windowId: number) => void;
type OnTabRemoved = (tabId: number) => void;

export class Listener {
  constructor(
    onStorageChanged: OnStorageChanged,
    onMessage: OnMessage,
    onActionClick: OnActionClick,
    onCommand: OnCommand,
    onTabActivated: OnTabActivated,
    onTabUpdated: OnTabUpdated,
    onWindowFocusChanged: OnWindowFocusChanged,
    onTabRemoved: OnTabRemoved
  ) {
    chrome.storage.onChanged.addListener((changes) =>
      onStorageChanged(changes)
    );

    chrome.runtime.onMessage.addListener(onMessage);

    chrome.action.onClicked.addListener(
      (tab) => tab.id && onActionClick(tab.id)
    );

    chrome.commands.onCommand.addListener(
      (command, tab) => tab.id && onCommand(command as Command, tab.id)
    );

    chrome.tabs.onActivated.addListener(async ({ tabId }) =>
      onTabActivated(tabId)
    );

    chrome.tabs.onUpdated.addListener(onTabUpdated);

    chrome.windows.onFocusChanged.addListener(onWindowFocusChanged);

    chrome.tabs.onRemoved.addListener(onTabRemoved);
  }
}
