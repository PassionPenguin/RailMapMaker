import { Path, Station, StationAlignment } from '@types';

export interface LabelNode {
  id: number;
  x: number;
  y: number;
  primary: string;
  secondary?: string;
  textAnchor: 'start' | 'middle' | 'end';
  alignment: StationAlignment;
}

export interface StationNode {
  id: number;
  x: number;
  y: number;
  type: Station['type'];
  stationStyle: Station['stationStyle'];
}

export interface BuiltPath {
  d: string;
  stroke: string;
  strokeWidth: string;
  lineCap: Path['lineCap'];
  lineJoin: Path['lineJoin'];
  labels: LabelNode[];
  stations: StationNode[];
}

export const GRID_SIZE = 25;

export const snapToGrid = (value: number) => {
  const remainder = value % GRID_SIZE;
  return remainder > GRID_SIZE / 2 ? value + (GRID_SIZE - remainder) : value - remainder;
};

const buildLabel = (node: Station, id: number): LabelNode => {
  let deviationX = 0;
  let deviationY = 0;
  const position = node.text.position;
  const deviation = 20;

  if ([0, 1, 2].includes(position)) deviationY -= node.text.type === 'withSecondaryName' ? 1.75 * deviation : deviation;
  else if ([5, 6, 7].includes(position)) deviationY += 1.75 * deviation;
  if ([0, 3, 5].includes(position)) deviationX -= deviation;
  else if ([2, 4, 7].includes(position)) deviationX += deviation;

  let textAnchor: 'start' | 'middle' | 'end' = 'middle';
  if (node.text.alignment === 'start') textAnchor = 'start';
  else if (node.text.alignment === 'end') textAnchor = 'end';

  return {
    id,
    x: node.x + deviationX,
    y: node.y + deviationY,
    primary: node.text.name[0],
    secondary: node.text.type === 'withSecondaryName' ? node.text.name[1] : undefined,
    textAnchor,
    alignment: node.text.alignment
  };
};

export const buildPath = (path: Path): BuiltPath => {
  const map = path.stations;
  const labels: LabelNode[] = [];
  const stations: StationNode[] = [];

  if (!map.length) {
    return {
      d: '',
      stroke: path.color,
      strokeWidth: path.strokeWidth,
      lineCap: path.lineCap,
      lineJoin: path.lineJoin,
      labels,
      stations
    };
  }

  let d = `M${map[0].x},${map[0].y}`;
  labels.push(buildLabel(map[0], 0));
  stations.push({ id: 0, x: map[0].x, y: map[0].y, stationStyle: map[0].stationStyle, type: map[0].type });

  for (let i = 1; i < map.length; i++) {
    labels.push(buildLabel(map[i], i));
    stations.push({ id: i, x: map[i].x, y: map[i].y, stationStyle: map[i].stationStyle, type: map[i].type });

    const node = map[i];
    const prevNode = map[i - 1];

    if (prevNode.x === node.x) {
      d += `V${node.y}`;
    } else if (prevNode.y === node.y) {
      d += `H${node.x}`;
    } else {
      const dirX = node.x > prevNode.x;
      const dirY = node.y > prevNode.y;

      const r = GRID_SIZE;
      const Rx = dirX ? r : -r;
      const Ry = dirY ? r : -r;
      const sqrtX = Rx / Math.sqrt(2);
      const sqrtY = Ry / Math.sqrt(2);
      const restX = node.x - prevNode.x - 2 * sqrtX - 2 * Rx;
      const restY = node.y - prevNode.y - 2 * sqrtY - 2 * Ry;
      const distanceBigger = Math.abs(restX) > Math.abs(restY);
      const absDistX = Math.abs(restX);
      const absDistY = Math.abs(restY);

      if (node.routeToNext === '0') {
        // Diagonal, vertical-first
        if (Math.abs(restX) === Math.abs(restY))
          d += `v${Ry}c0,${sqrtY},0,${sqrtY},${sqrtX},${2 * sqrtY}l${restX},${restY}c${sqrtX},${sqrtY},${sqrtX},${Ry},${Rx + sqrtX},${Ry}h${Rx}`;
        else if (distanceBigger)
          d += `v${Ry}c0,${sqrtY},0,${sqrtY},${sqrtX},${2 * sqrtY}l${restX * restY > 0 ? restY : -restY},${restY}c${sqrtX},${sqrtY},${sqrtX},${Ry},${Rx + sqrtX},${Ry}h${dirX ? absDistX - absDistY + Rx : absDistY - absDistX + Rx}`;
        else
          d += `v${dirY ? absDistY - absDistX + Ry : absDistX - absDistY + Ry}c0,${sqrtY},0,${sqrtY},${sqrtX},${2 * sqrtY}l${restX},${restX * restY > 0 ? restX : -restX}c${sqrtX},${sqrtY},${sqrtX},${Ry},${Rx + sqrtX},${Ry}h${Rx}`;
      } else if (node.routeToNext === '1') {
        // Diagonal, horizontal-first
        if (Math.abs(restX) === Math.abs(restY))
          d += `h${Rx}c${sqrtX},0,${sqrtX},0,${2 * sqrtX},${sqrtY}l${restX},${restY}c${sqrtX},${sqrtY},${Rx},${sqrtY},${Rx},${Ry + sqrtY}v${Ry}`;
        else if (distanceBigger)
          d += `h${dirX ? absDistX - absDistY + Rx : absDistY - absDistX + Rx}c${sqrtX},0,${sqrtX},0,${2 * sqrtX},${sqrtY}l${restX * restY > 0 ? restY : -restY},${restY}c${sqrtX},${sqrtY},${Rx},${sqrtY},${Rx},${Ry + sqrtY}v${Ry}`;
        else
          d += `h${Rx}c${sqrtX},0,${sqrtX},0,${2 * sqrtX},${sqrtY}l${restX},${restX * restY > 0 ? restX : -restX}c${sqrtX},${sqrtY},${Rx},${sqrtY},${Rx},${Ry + sqrtY}v${dirY ? absDistY - absDistX + Ry : absDistX - absDistY + Ry}`;
      } else if (node.routeToNext === '2') {
        // Vertical first
        d += `v${node.y - prevNode.y - Ry}c0,${Ry},0,${Ry},${sqrtX},${Ry}h${node.x - prevNode.x - sqrtX}`;
      } else if (node.routeToNext === '3') {
        // Horizontal first
        d += `h${node.x - prevNode.x - Rx}c${Rx},0,${Rx},0,${Rx},${sqrtY}v${node.y - prevNode.y - sqrtY}`;
      } else if (node.routeToNext === '4') {
        // Diagonal vertical-first, single bend
        d += `v${node.y - prevNode.y - Ry * 2 + (node.y > prevNode.y ? -1 : 1) * Math.abs(node.x - prevNode.x - Rx)}c0,${Ry},0,${Ry},${sqrtX},${sqrtY + Ry},l${node.x - prevNode.x - Rx},${(restX * restY > 0 ? 1 : -1) * (node.x - prevNode.x - Rx)}`;
      } else if (node.routeToNext === '5') {
        // Diagonal horizontal-first, single bend
        d += `h${node.x - prevNode.x - Rx * 2 + (node.x > prevNode.x ? -1 : 1) * Math.abs(node.y - prevNode.y - Ry)}c${Rx},0,${Rx},0,${sqrtX + Rx},${sqrtY},l${(restY * restX > 0 ? 1 : -1) * (node.y - prevNode.y - Ry)},${node.y - prevNode.y - Ry}`;
      } else if (node.routeToNext === '6') {
        // Diagonal vertical-first, single bend from diagonal start
        d += `l${node.x - prevNode.x - Rx},${(restX * restY > 0 ? 1 : -1) * (node.x - prevNode.x - Rx)}c${Rx},${Ry},${Rx},${Ry},${Rx},${sqrtY + Ry}v${node.y - prevNode.y - Ry * 2 + (node.y > prevNode.y ? -1 : 1) * Math.abs(node.x - prevNode.x - Rx)}`;
      } else if (node.routeToNext === '7') {
        // Diagonal horizontal-first, single bend from diagonal start
        d += `l${(restY * restX > 0 ? 1 : -1) * (node.y - prevNode.y - Ry)},${node.y - prevNode.y - Ry}c${Rx},${Ry},${Rx},${Ry},${Rx + sqrtX},${Ry}v${node.x - prevNode.x - Rx * 2 + (node.x > prevNode.x ? -1 : 1) * Math.abs(node.y - prevNode.y - Ry)}`;
      } else {
        d += `L${node.x},${node.y}`;
      }
    }
    d += `M${node.x},${node.y}`;
  }

  return {
    d,
    stroke: path.color,
    strokeWidth: path.strokeWidth,
    lineCap: path.lineCap,
    lineJoin: path.lineJoin,
    labels,
    stations
  };
};
