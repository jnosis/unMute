export type ActionMode =
  | 'muteCurrentTab'
  | 'toggleAllTab'
  | 'autoMute'
  | 'autoMode'
  | 'fixTab';
export type Command = ActionMode;
export type AutoMode = 'current' | 'recent' | 'fix' | 'all';
export type AutoState = 'on' | 'off';
export type OffBehavior = 'release' | 'notRelease';
export type Color = '#579242' | '#9c2829' | '#5f6368';
