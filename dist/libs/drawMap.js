/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Co-authored-by @Wongchito
    Last upd by @PassionPenguin

 */

const drawMap = id => {
    /*
    * @param: id :Int <Path which id = id need to be drawn>
    * @return: void
    */
    const info = contentData.pathInfo[id];
    const map = info.stations;
    if (map.length > 0) {
        let path = `M${map[0].x},${map[0].y}`;
        let pathEl = pg.$("path.pathElement")[id];
        let stationsGroup = pg.$("g.stationsGroup")[id];
        let namesGroup = pg.$("g.nameGroup")[id];
        stationsGroup.innerHTML = "";
        namesGroup.innerHTML = "";
        const appendStation = (nodeId) => {
            /*
            * @param: nodeId :Int <Node which id = nodeId which need to be drawn>
            * @return: void
            */
            let stationNode = document.createElementNS(pg.$('#resSvg')[0].namespaceURI, 'use');
            stationNode.setAttributeNS(null, 'href', '#stationStyle_' + map[nodeId].stationStyle);
            stationNode.setAttributeNS(null, 'fill', map.color);
            stationNode.setAttributeNS(null, 'x', '0');
            stationNode.setAttributeNS(null, 'y', '0');
            stationNode.setAttributeNS(null, 'style', 'transform: matrix(1, 0, 0, 1, ' + (map[nodeId].x - 8) + ', ' + (map[nodeId].y - 8) + ');');
            if (map[nodeId].type === 'destination') stationNode.setAttributeNS(null, 'style', 'transform: matrix(1, 0, 0, 1, ' + (map[nodeId].x - 10) + ', ' + (map[nodeId].y - 10) + ') scale(1.2);');
            stationsGroup.appendChild(stationNode);

            let name = document.createElementNS(pg.$('#resSvg')[0].namespaceURI, 'g');
            let primaryName = document.createElementNS(pg.$('#resSvg')[0].namespaceURI, 'text');
            primaryName.setAttributeNS(null, "style", contentData.primaryNameStyle);
            primaryName.innerHTML = map[nodeId].text.name[0];
            name.appendChild(primaryName);

            if (map[nodeId].text.type === "withSecondaryName") {
                let secondaryName = document.createElementNS(pg.$('#resSvg')[0].namespaceURI, 'text');
                secondaryName.setAttributeNS(null, "style", contentData.secondaryNameStyle);
                secondaryName.setAttributeNS(null, "dy", "16");
                secondaryName.innerHTML = map[nodeId].text.name[1];
                name.appendChild(secondaryName);
            }

            if (map[nodeId].text.alignment === "start")
                name.setAttributeNS(null, "text-anchor", "start");
            if (map[nodeId].text.alignment === "end")
                name.setAttributeNS(null, "text-anchor", "end");
            else if (map[nodeId].text.alignment === "middle")
                name.setAttributeNS(null, "text-anchor", "middle");

            let deviationX = 0, deviationY = 0, position = map[nodeId].text.position,
                deviation = 20;

            if (map[nodeId].type === "destination") {
                if ([0, 1, 2].indexOf(position) !== -1) deviationY -= map[nodeId].text.type === "withSecondaryName" ? 1.75 * deviation : deviation;
                else if ([5, 6, 7].indexOf(position) !== -1) deviationY += 1.75 * deviation;
                if ([0, 3, 5].indexOf(position) !== -1) deviationX -= deviation;
                else if ([2, 4, 7].indexOf(position) !== -1) deviationX += deviation;
            } else {
                if ([0, 1, 2].indexOf(position) !== -1) deviationY -= map[nodeId].text.type === "withSecondaryName" ? 1.75 * deviation : deviation;
                else if ([5, 6, 7].indexOf(position) !== -1) deviationY += 1.75 * deviation;
                if ([0, 3, 5].indexOf(position) !== -1) deviationX -= deviation;
                else if ([2, 4, 7].indexOf(position) !== -1) deviationX += deviation;
            }

            name.setAttributeNS(null, 'style', `transform: matrix(1, 0, 0, 1, ${map[nodeId].x + deviationX}, ${map[nodeId].y + deviationY})`);
            name.setAttributeNS(null, 'originalPosition', `[${map[nodeId].x}, ${map[nodeId].y}]`);

            namesGroup.appendChild(name);

        };
        appendStation(0);


        for (let i = 1; i < map.length; i++) {
            appendStation(i);

            const node = map[i];
            const prev_node = map[i - 1];

            if (prev_node.x === node.x)
                path += `V${node.y}`;
            else if (prev_node.y === node.y)
                path += `H${node.x}`;
            else {

                const dirX = node.x > prev_node.x; // true => 往右 false => 往左
                const dirY = node.y > prev_node.y; // true => 往下 false => 往上

                const r = 25;

                const Rx = dirX ? r : -r;
                const Ry = dirY ? r : -r;
                const sqrtX = Rx / Math.sqrt(2);
                const sqrtY = Ry / Math.sqrt(2);
                const restX = node.x - prev_node.x - 2 * sqrtX - 2 * Rx; // 斜线only
                const restY = node.y - prev_node.y - 2 * sqrtY - 2 * Ry; // 斜线only
                const distanceBigger = Math.abs(restX) > Math.abs(restY);
                const absDistX = Math.abs(restX);
                const absDistY = Math.abs(restY);

                if (node.routeToNext === "0") {
                    // 斜線，垂直方優先
                    if (Math.abs(restX) === Math.abs(restY))
                        path += `v${Ry}c0,${sqrtY},0,${sqrtY},${sqrtX},${2 * sqrtY}l${restX},${restY}c${sqrtX},${sqrtY},${sqrtX},${Ry},${Rx + sqrtX},${Ry}h${Rx}`;
                    else if (distanceBigger)
                        path += `v${Ry}c0,${sqrtY},0,${sqrtY},${sqrtX},${2 * sqrtY}l${restX * restY > 0 ? restY : -restY},${restY}c${sqrtX},${sqrtY},${sqrtX},${Ry},${Rx + sqrtX},${Ry}h${dirX ? (absDistX - absDistY + Rx) : (absDistY - absDistX + Rx)}`;
                    else
                        path += `v${dirY ? (absDistY - absDistX + Ry) : (absDistX - absDistY + Ry)}c0,${sqrtY},0,${sqrtY},${sqrtX},${2 * sqrtY}l${restX},${restX * restY > 0 ? restX : -restX}c${sqrtX},${sqrtY},${sqrtX},${Ry},${Rx + sqrtX},${Ry}h${Rx}`;
                } else if (node.routeToNext === "1") {
                    // 斜線，水平方優先
                    if (Math.abs(restX) === Math.abs(restY))
                        path += `h${Rx}c${sqrtX},0,${sqrtX},0,${2 * sqrtX},${sqrtY}l${restX},${restY}c${sqrtX},${sqrtY},${Rx},${sqrtY},${Rx},${Ry + sqrtY}v${Ry}`;
                    else if (distanceBigger)
                        path += `h${dirX ? (absDistX - absDistY + Rx) : (absDistY - absDistX + Rx)}c${sqrtX},0,${sqrtX},0,${2 * sqrtX},${sqrtY}l${restX * restY > 0 ? restY : -restY},${restY}c${sqrtX},${sqrtY},${Rx},${sqrtY},${Rx},${Ry + sqrtY}v${Ry}`;
                    else
                        path += `h${Rx}c${sqrtX},0,${sqrtX},0,${2 * sqrtX},${sqrtY}l${restX},${restX * restY > 0 ? restX : -restX}c${sqrtX},${sqrtY},${Rx},${sqrtY},${Rx},${Ry + sqrtY}v${dirY ? (absDistY - absDistX + Ry) : (absDistX - absDistY + Ry)}`;
                } else if (node.routeToNext === "2") {
                    // 垂直線，垂直方優先
                    path += `v${node.y - prev_node.y - Ry}c0,${Ry},0,${Ry},${sqrtX},${Ry}h${node.x - prev_node.x - sqrtX}`;
                } else if (node.routeToNext === "3") {
                    // 垂直線，水平方優先
                    path += `h${node.x - prev_node.x - Rx}c${Rx},0,${Rx},0,${Rx},${sqrtY}v${node.y - prev_node.y - sqrtY}`;
                } else if (node.routeToNext === "4") {
                    // 斜线，垂直方优先，仅一次转弯
                    path += `v${node.y - prev_node.y - Ry * 2 + (node.y > prev_node.y ? -1 : 1) * Math.abs(node.x - prev_node.x - Rx)}c0,${Ry},0,${Ry},${sqrtX},${sqrtY + Ry},l${node.x - prev_node.x - Rx},${(restX * restY > 0 ? 1 : -1) * (node.x - prev_node.x - Rx)}`;
                } else if (node.routeToNext === "5") {
                    // 斜线，水平方优先，仅一次转弯
                    path += `h${node.x - prev_node.x - Rx * 2 + (node.x > prev_node.x ? -1 : 1) * Math.abs(node.y - prev_node.y - Ry)}c${Rx},0,${Rx},0,${sqrtX + Rx},${sqrtY},l${(restY * restX > 0 ? 1 : -1) * (node.y - prev_node.y - Ry)},${node.y - prev_node.y - Ry}`;
                } else if (node.routeToNext === "6") {
                    // 斜线，垂直方优先，仅一次转弯，斜方出发
                    path += `l${node.x - prev_node.x - Rx},${(restX * restY > 0 ? 1 : -1) * (node.x - prev_node.x - Rx)}c${Rx},${Ry},${Rx},${Ry},${Rx},${sqrtY + Ry}v${node.y - prev_node.y - Ry * 2 + (node.y > prev_node.y ? -1 : 1) * Math.abs(node.x - prev_node.x - Rx)}`;
                } else if (node.routeToNext === "7") {
                    // 斜线，水平方优先，仅一次转弯，斜方出发
                    path += `l${(restY * restX > 0 ? 1 : -1) * (node.y - prev_node.y - Ry)},${node.y - prev_node.y - Ry}c${Rx},${Ry},${Rx},${Ry},${Rx + sqrtX},${Ry}v${node.x - prev_node.x - Rx * 2 + (node.x > prev_node.x ? -1 : 1) * Math.abs(node.y - prev_node.y - Ry)}`;
                } else {
                    // 直线
                    path += `L${node.x},${node.y}`;
                }
            }
            path += `M${node.x},${node.y}`;
        }


        pathEl.setAttributeNS(null, "d", path);
        pathEl.setAttributeNS(null, "stroke", info.color);
        pathEl.setAttributeNS(null, "fill", "transparent");
        pathEl.setAttributeNS(null, "stroke-width", info.strokeWidth);
        pathEl.setAttributeNS(null, "stroke-linecap", info.lineCap);
        pathEl.setAttributeNS(null, "stroke-linejoin", info.lineJoin);
        builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "Path drew: " + path);
        savePathComp.current();
        if (map.length > 0)
            return path;
    }
    savePathComp.current();
};