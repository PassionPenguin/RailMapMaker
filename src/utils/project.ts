import { ContentData, Path, Station } from '@types';
import { findColor } from '@data/colors';
import { snapToGrid } from './geometry';

const baseText = {
  type: 'withSecondaryName' as const,
  name: ['Station', 'Station'],
  position: 1,
  alignment: 'middle' as const
};

export const createStation = (x: number, y: number): Station => ({
  x: snapToGrid(x),
  y: snapToGrid(y),
  type: 'destination',
  routeToNext: '0',
  text: { ...baseText },
  stationStyle: 'rect'
});

export const createBlankProject = (): ContentData => ({
  name: 'Untitled Project',
  author: 'You',
  lastModified: Date.now(),
  width: 2000,
  height: 2000,
  textStyle: '',
  primaryNameStyle: 'font:18px/1 Anodina,sans-serif;',
  secondaryNameStyle: 'font:11px/1 Anodina,sans-serif;color:var(--grey)',
  pathInfo: [
    {
      id: 0,
      name: 'Line 1',
      color: findColor(0),
      lineCap: 'round',
      lineJoin: 'round',
      strokeWidth: '5px',
      opacity: 1,
      stations: []
    }
  ]
});

export const createDemoProject = (): ContentData => ({
  name: 'Guangzhou Sketch',
  author: 'RailMapMaker',
  lastModified: Date.now(),
  width: 2400,
  height: 1800,
  textStyle: '',
  primaryNameStyle: 'font:18px/1 Anodina,sans-serif;',
  secondaryNameStyle: 'font:11px/1 Anodina,sans-serif;color:var(--grey)',
  pathInfo: [
    {
      id: 0,
      name: 'Line 1',
      color: findColor(0),
      lineCap: 'round',
      lineJoin: 'round',
      strokeWidth: '5px',
      opacity: 1,
      stations: [
        {
          x: 200,
          y: 1200,
          type: 'destination',
          routeToNext: '2',
          text: { type: 'withSecondaryName', name: ['西塱', 'Xilang'], position: 4, alignment: 'start' },
          stationStyle: 'rect'
        },
        {
          x: 600,
          y: 1200,
          type: 'common',
          routeToNext: '2',
          text: { type: 'withSecondaryName', name: ['坑口', 'Kengkou'], position: 4, alignment: 'start' },
          stationStyle: 'rect'
        },
        {
          x: 1000,
          y: 1200,
          type: 'common',
          routeToNext: '3',
          text: { type: 'withSecondaryName', name: ['公园前', 'Gongyuanqian'], position: 5, alignment: 'end' },
          stationStyle: 'rect'
        },
        {
          x: 1000,
          y: 800,
          type: 'destination',
          routeToNext: '2',
          text: { type: 'withSecondaryName', name: ['广州东站', 'Guangzhou East'], position: 3, alignment: 'end' },
          stationStyle: 'rect'
        }
      ]
    },
    {
      id: 1,
      name: 'Line 2',
      color: findColor(1),
      lineCap: 'round',
      lineJoin: 'round',
      strokeWidth: '5px',
      opacity: 1,
      stations: [
        {
          x: 600,
          y: 1500,
          type: 'destination',
          routeToNext: '2',
          text: { type: 'withSecondaryName', name: ['广州南站', 'Guangzhou South'], position: 3, alignment: 'end' },
          stationStyle: 'rect'
        },
        {
          x: 600,
          y: 1200,
          type: 'common',
          routeToNext: '2',
          text: { type: 'withSecondaryName', name: ['江泰路', 'Jiangtai Lu'], position: 4, alignment: 'start' },
          stationStyle: 'rect'
        },
        {
          x: 600,
          y: 900,
          type: 'common',
          routeToNext: '2',
          text: { type: 'withSecondaryName', name: ['海珠广场', 'Haizhu Square'], position: 4, alignment: 'start' },
          stationStyle: 'rect'
        },
        {
          x: 600,
          y: 600,
          type: 'destination',
          routeToNext: '2',
          text: { type: 'withSecondaryName', name: ['嘉禾望岗', 'Jiahewanggang'], position: 4, alignment: 'start' },
          stationStyle: 'rect'
        }
      ]
    }
  ]
});

export const ensureTerminalTypes = (stations: Station[]): Station[] => {
  if (!stations.length) return stations;
  const updated = stations.map((station, idx) => ({
    ...station,
    type: idx === 0 || idx === stations.length - 1 ? 'destination' : 'common'
  }));
  return updated;
};

export const addStationToPath = (path: Path, station: Station): Path => {
  const stations = [...path.stations];
  if (stations.length) stations[stations.length - 1] = { ...stations[stations.length - 1], type: 'common' };
  stations.push(station);
  const normalized = ensureTerminalTypes(stations);
  return { ...path, stations: normalized };
};

export const insertStationToPath = (path: Path, station: Station, afterIndex: number): Path => {
  const stations = [...path.stations];
  if (stations.length) {
    stations[0] = { ...stations[0], type: 'destination' };
    stations[stations.length - 1] = { ...stations[stations.length - 1], type: 'destination' };
  }
  const insertAt = Math.min(Math.max(afterIndex + 1, 0), stations.length);
  stations.splice(insertAt, 0, station);
  const normalized = ensureTerminalTypes(stations);
  return { ...path, stations: normalized };
};

export const updateStation = (path: Path, index: number, value: Partial<Station>): Path => {
  const stations = path.stations.map((s, i) => (i === index ? { ...s, ...value } : s));
  return { ...path, stations: ensureTerminalTypes(stations) };
};

export const removeStation = (path: Path, index: number): Path => {
  const stations = path.stations.filter((_, i) => i !== index);
  return { ...path, stations: ensureTerminalTypes(stations) };
};

export const updatePath = (project: ContentData, pathId: number, updater: (path: Path) => Path): ContentData => {
  const nextPaths = project.pathInfo.map((p) => (p.id === pathId ? updater(p) : p));
  return { ...project, pathInfo: nextPaths, lastModified: Date.now() };
};

export const addPath = (project: ContentData): ContentData => {
  const nextId = (project.pathInfo.at(-1)?.id ?? -1) + 1;
  const path: Path = {
    id: nextId,
    name: `Line ${nextId + 1}`,
    color: findColor(nextId),
    lineCap: 'round',
    lineJoin: 'round',
    strokeWidth: '5px',
    opacity: 1,
    stations: []
  };
  return { ...project, pathInfo: [...project.pathInfo, path], lastModified: Date.now() };
};
