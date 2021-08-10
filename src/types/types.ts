export type ActionMode =
  | 'muteCurrentTab'
  | 'toggleAllTabs'
  | 'autoMute'
  | 'autoMode'
  | 'fixTab';
export type Command = ActionMode;
export type AutoMode = 'current' | 'recent' | 'fix' | 'all';
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
export type Color = '#579242' | '#9c2829' | '#5f6368';
export type Language = 'en' | 'ko';
