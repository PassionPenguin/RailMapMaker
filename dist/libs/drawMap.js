/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Co-authored-by @Wongchito
    Last upd by @PassionPenguin

 */

const drawMap = id => {
    const info = pathInfo[id];
    const map = info.stations;
    let path = `M${map[0].x},${map[0].y}`;
    let pathEl = pg.$("path.pathElement")[id];
    for (let i = 1; i < map.length; i++) {
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
            } else {
                // 直线
                path += `L${node.x},${node.y}`;
            }
        }
        path += `M${node.x},${node.y}`;
    }
    pathEl.setAttributeNS(null, "d", path);
    pathEl.setAttributeNS(null, "stroke", info.color);
    pathEl.setAttributeNS(null, "stroke-width", info.strokeWidth);
    pathEl.setAttributeNS(null, "stroke-linecap", info.lineCap);
    pathEl.setAttributeNS(null, "stroke-linejoin", info.lineJoin);
    builder.debug("PassionPenguin/mapMaker", "attachWindowCursorEvent.js", "Path", "Path drew: " + path);
    return path;
};