/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Co-authored-by @Wongchito
    Last upd by @PassionPenguin

 */

// const reloadMap = id => {
//     const map = pathInfo[id];
//     const pathElement = pg.$('#UnnamedPath_' + id)[0];
//     const stationsElement = pg.$('#UnnamedStations_' + id)[0];
//     stationsElement.innerHTML = '';
//     pathElement.setAttributeNS(null, 'd', 'M' + map.stations[0].x + ' ' + map.stations[0].y);
//     let path = pathElement.getAttributeNS(null, 'd');
//     let [prevX, prevY] = [map.stations.x, map.stations.y];
//
//     map.stations.forEach((e, i) => {
//             let stationNode = document.createElementNS(pg.$('#resSvg')[0].namespaceURI, 'use');
//             stationNode.setAttributeNS(null, 'href', '#stationStyle_' + state.stationStyle);
//             stationNode.setAttributeNS(null, 'fill', map.color);
//             stationNode.setAttributeNS(null, 'x', '0');
//             stationNode.setAttributeNS(null, 'y', '0');
//             stationsElement.appendChild(stationNode);
//             stationNode.setAttributeNS(null, 'style', 'transform: matrix(1, 0, 0, 1, ' + (e.x - 8) + ', ' + (e.y - 8) + ');');
//             if (e.type === 'destination') stationNode.setAttributeNS(null, 'style', 'transform: matrix(1, 0, 0, 1, ' + (e.x - 12) + ', ' + (e.y - 12) + ') scale(1.5);');
//
//             if (i > 0) {
//                 if (prevX === e.x) {
//                     path += `V${e.y}`;
//                 } else if (prevY === e.y) {
//                     path += `H${e.x}`;
//                 } else {
//                     if (i < map.stations.length - 2) {
//                         try {
//                             let next_points = map.stations[i + 1].filter(i => [i.x, i.y]);
//                             if (Math.abs((prevX - next_points[0]) / (prevY - next_points[1])) === 1)
//                                 path += `L${e.x},${e.y}`;
//                             else {
//                                 if (prevX > e.x && prevY > e.y) {
//                                     let k1 = (prevX - e.x) / (prevY - e.y);
//                                     let k2;
//                                     if (i < map.stations.length - 1)
//                                         k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                                     else k2 = k1 * (-1)
//                                     if (k1 * k2 === -1) {
//                                         path += `h${e.x - prevX + 10}a10,10,0,0,1-10-10V${e.y}`;
//                                     } else {
//                                         let R = 30;
//                                         let adx = (Math.sqrt(2) * R) / 2;
//                                         let ady = R - adx;
//                                         let dl = prevY - e.y - ady;
//                                         let dx = prevX - e.x - adx - dl;
//                                         path += `h${-dx}a30,30,0,0,1,${-adx},${-ady}L${e.x},${e.y}`;
//                                     }
//                                 } else if (prevX > e.x && prevY < e.y) {
//                                     let k1 = (prevX - e.x) / (prevY - e.y);
//                                     let k2;
//                                     if (i < map.stations.length - 1)
//                                         k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                                     else k2 = k1 * (-1)
//
//                                     if (k1 * k2 === -1) {
//                                         path += `h${e.x - prevX + 10}a10,10,0,0,0-10,10V${e.y}`;
//                                     } else {
//                                         let R = 30;
//                                         let adx = (Math.sqrt(2) * R) / 2;
//                                         let ady = R - adx;
//                                         let dl = prevY - e.y - ady;
//                                         let dx = e.x - prevX - adx - dl;
//                                         path += `h${dx}a30,30,0,0,0,${-adx},${ady}L${e.x},${e.y}`;
//                                     }
//                                 } else if (prevX < e.x && prevY > e.y) {
//                                     let k1 = (prevX - e.x) / (prevY - e.y);
//                                     let k2;
//                                     if (i < map.stations.length - 1)
//                                         k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                                     else k2 = k1 * (-1)
//
//                                     if (k1 * k2 === -1) {
//                                         path += `h${e.x - prevX - 10}a10,-10,0,0,0,10,-10V${e.y}`;
//                                     } else {
//                                         let R = 30;
//                                         let adx = (Math.sqrt(2) * R) / 2;
//                                         let ady = R - adx;
//                                         let dl = prevY - e.y - ady;
//                                         let dx = e.x - prevX - adx - dl;
//                                         path += `h${dx}a30,30,0,0,0,${adx},${-ady}L${e.x},${e.y}`;
//                                     }
//                                 } else if (prevX < e.x && prevY < e.y) {
//                                     let k1 = (prevX - e.x) / (prevY - e.y);
//                                     let k2;
//                                     if (i < map.stations.length - 1)
//                                         k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                                     else k2 = k1 * (-1)
//
//                                     if (k1 * k2 === -1) {
//                                         path += `h${e.x - prevX - 10}a10,10,0,0,1,10,10V${e.y}`;
//                                     } else {
//                                         let R = 30;
//                                         let adx = (Math.sqrt(2) * R) / 2;
//                                         let ady = R - adx;
//                                         let dl = e.y - prevY - ady;
//                                         let dx = e.x - prevX - adx - dl;
//                                         path += `h${dx}a30,30,0,0,1,${adx},${ady}L${e.x},${e.y}`;
//                                     }
//                                 }
//                             }
//                         } catch (e) {
//                             if (prevX > e.x && prevY > e.y) {
//                                 let k1 = (prevX - e.x) / (prevY - e.y);
//                                 let k2;
//                                 if (i < map.stations.length - 1)
//                                     k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                                 else k2 = k1 * (-1)
//                                 if (k1 * k2 === -1) {
//                                     path += `h${e.x - prevX + 10}a10,10,0,0,1-10-10V${e.y}`;
//                                 } else {
//                                     let R = 30;
//                                     let adx = (Math.sqrt(2) * R) / 2;
//                                     let ady = R - adx;
//                                     let dl = prevY - e.y - ady;
//                                     let dx = prevX - e.x - adx - dl;
//                                     path += `h${-dx}a30,30,0,0,1,${-adx},${-ady}L${e.x},${e.y}`;
//                                 }
//                             } else if (prevX > e.x && prevY < e.y) {
//                                 let k1 = (prevX - e.x) / (prevY - e.y);
//                                 let k2;
//                                 if (i < map.stations.length - 1)
//                                     k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                                 else k2 = k1 * (-1)
//
//                                 if (k1 * k2 === -1) {
//                                     path += `h${e.x - prevX + 10}a10,10,0,0,0-10,10V${e.y}`;
//                                 } else {
//                                     let R = 30;
//                                     let adx = (Math.sqrt(2) * R) / 2;
//                                     let ady = R - adx;
//                                     let dl = prevY - e.y - ady;
//                                     let dx = e.x - prevX - adx - dl;
//                                     path += `h${dx}a30,30,0,0,0,${-adx},${ady}L${e.x},${e.y}`;
//                                 }
//                             } else if (prevX < e.x && prevY > e.y) {
//                                 let k1 = (prevX - e.x) / (prevY - e.y);
//                                 let k2;
//                                 if (i < map.stations.length - 1)
//                                     k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                                 else k2 = k1 * (-1)
//
//                                 if (k1 * k2 === -1) {
//                                     path += `h${e.x - prevX - 10}a10,-10,0,0,0,10,-10V${e.y}`;
//                                 } else {
//                                     let R = 30;
//                                     let adx = (Math.sqrt(2) * R) / 2;
//                                     let ady = R - adx;
//                                     let dl = prevY - e.y - ady;
//                                     let dx = e.x - prevX - adx - dl;
//                                     path += `h${dx}a30,30,0,0,0,${adx},${-ady}L${e.x},${e.y}`;
//                                 }
//                             } else if (prevX < e.x && prevY < e.y) {
//                                 let k1 = (prevX - e.x) / (prevY - e.y);
//                                 let k2;
//                                 if (i < map.stations.length - 1)
//                                     k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                                 else k2 = k1 * (-1)
//
//                                 if (k1 * k2 === -1) {
//                                     path += `h${e.x - prevX - 10}a10,10,0,0,1,10,10V${e.y}`;
//                                 } else {
//                                     let R = 30;
//                                     let adx = (Math.sqrt(2) * R) / 2;
//                                     let ady = R - adx;
//                                     let dl = e.y - prevY - ady;
//                                     let dx = e.x - prevX - adx - dl;
//                                     path += `h${dx}a30,30,0,0,1,${adx},${ady}L${e.x},${e.y}`;
//                                 }
//                             }
//                         }
//                     } else {
//                         if (prevX > e.x && prevY > e.y) {
//                             let k1 = (prevX - e.x) / (prevY - e.y);
//                             let k2;
//                             if (i < map.stations.length - 1)
//                                 k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                             else k2 = k1 * (-1)
//                             if (k1 * k2 === -1) {
//                                 path += `h${e.x - prevX + 10}a10,10,0,0,1-10-10V${e.y}`;
//                             } else {
//                                 let R = 30;
//                                 let adx = (Math.sqrt(2) * R) / 2;
//                                 let ady = R - adx;
//                                 let dl = prevY - e.y - ady;
//                                 let dx = prevX - e.x - adx - dl;
//                                 path += `h${-dx}a30,30,0,0,1,${-adx},${-ady}L${e.x},${e.y}`;
//                             }
//                         } else if (prevX > e.x && prevY < e.y) {
//                             let k1 = (prevX - e.x) / (prevY - e.y);
//                             let k2;
//                             if (i < map.stations.length - 1)
//                                 k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                             else k2 = k1 * (-1)
//
//                             if (k1 * k2 === -1) {
//                                 path += `h${e.x - prevX + 10}a10,10,0,0,0-10,10V${e.y}`;
//                             } else {
//                                 let R = 30;
//                                 let adx = (Math.sqrt(2) * R) / 2;
//                                 let ady = R - adx;
//                                 let dl = prevY - e.y - ady;
//                                 let dx = e.x - prevX - adx - dl;
//                                 path += `h${dx}a30,30,0,0,0,${-adx},${ady}L${e.x},${e.y}`;
//                             }
//                         } else if (prevX < e.x && prevY > e.y) {
//                             let k1 = (prevX - e.x) / (prevY - e.y);
//                             let k2;
//                             if (i < map.stations.length - 1)
//                                 k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                             else k2 = k1 * (-1)
//
//                             if (k1 * k2 === -1) {
//                                 path += `h${e.x - prevX - 10}a10,-10,0,0,0,10,-10V${e.y}`;
//                             } else {
//                                 let R = 30;
//                                 let adx = (Math.sqrt(2) * R) / 2;
//                                 let ady = R - adx;
//                                 let dl = prevY - e.y - ady;
//                                 let dx = e.x - prevX - adx - dl;
//                                 path += `h${dx}a30,30,0,0,0,${adx},${-ady}L${e.x},${e.y}`;
//                             }
//                         } else if (prevX < e.x && prevY < e.y) {
//                             let k1 = (prevX - e.x) / (prevY - e.y);
//                             let k2;
//                             if (i < map.stations.length - 1)
//                                 k2 = (e.x - map.stations[i + 1].x) / (e.y - map.stations[i + 1].y);
//                             else k2 = k1 * (-1)
//
//                             if (k1 * k2 === -1) {
//                                 path += `h${e.x - prevX - 10}a10,10,0,0,1,10,10V${e.y}`;
//                             } else {
//                                 let R = 30;
//                                 let adx = (Math.sqrt(2) * R) / 2;
//                                 let ady = R - adx;
//                                 let dl = e.y - prevY - ady;
//                                 let dx = e.x - prevX - adx - dl;
//                                 path += `h${dx}a30,30,0,0,1,${adx},${ady}L${e.x},${e.y}`;
//                             }
//                         } else
//                             path += `L${e.x},${e.y}`;
//                     }
//                 }
//             }
//             [prevX, prevY] = [e.x, e.y];
//         }
//     );
//     pathElement.setAttributeNS(null, 'd', path)
// }