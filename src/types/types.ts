export type ActionMode =
  | 'muteCurrentTab'
  | 'toggleAllTabs'
  | 'autoMute'
  | 'autoMode'
  | 'fixTab';
export type Command = ActionMode | 'dev';
export type HiddenMode = 'fixOR' | 'fixOC';
export type AutoMode = 'current' | 'recent' | 'fix' | 'all' | HiddenMode;
export type AutoState = 'on' | 'off';
export type OffBehavior = 'release' | 'notRelease';
export type ContextMenuId =
  | 'actionMode'
  | 'actionMode_muteCurrentTab'
  | 'actionMode_toggleAllTabs'
  | 'actionMode_autoMute'
  | 'actionMode_autoMode'
  | 'actionMode_fixTab'
  | 'unmuteCurrentTab'
  | ActionMode
  | AutoMode
  | AutoState
  | OffBehavior
  | 'shortcuts'
  | 'changelog';
export type Color = '#50873d' | '#9c2829' | '#5f6368';
export type OptionPageMessageId =
  | 'actionMode'
  | 'autoState'
  | 'autoMode'
  | 'offBehavior'
  | 'recentBehavior'
  | 'contextMenus'
  | 'reset'
  | 'hidden';
export type OptionPageMessage = {
  id: OptionPageMessageId;
  value: string | boolean;
};
export type OptionPageResponse = {
  response: string;
};
