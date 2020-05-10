export type StationAlignment = 'start' | 'middle' | 'end';
export type StationPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type StationTextType = 'singleNameOnly' | 'withSecondaryName';

export interface StationText {
  type: StationTextType;
  name: [string, string?];
  position: StationPosition;
  alignment: StationAlignment;
}

export type StationStyle = 'rect' | 'circle';
export type StationType = 'destination' | 'common';

export interface Station {
  x: number;
  y: number;
  type: StationType;
  routeToNext: string;
  text: StationText;
  stationStyle: StationStyle;
}

export type LineCap = 'butt' | 'round' | 'square' | 'inherit';
export type LineJoin = 'butt' | 'round' | 'square' | 'inherit';

export interface Path {
  id: number;
  name: string;
  color: string;
  strokeWidth: string;
  lineCap: LineCap;
  lineJoin: LineJoin;
  opacity: number;
  stations: Station[];
}

export interface ContentData {
  name: string;
  author: string;
  lastModified: number;
  width: number;
  height: number;
  textStyle: string;
  primaryNameStyle: string;
  secondaryNameStyle: string;
  pathInfo: Path[];
}

export type Locale = 'en-US' | 'zh-CN' | 'zh-HK' | 'zh-YUE';

export interface SavedFileMeta {
  id: number;
  name: string;
  lastModified: number;
  author: string;
  size: number;
}
