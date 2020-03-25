/*

    Package PassionPenguin/mapGenerator


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const reloadMap = (id) => {
    const map = pathInfo[id][0];
    const path = pathInfo[id].path;
    let not_visited = false, shouldIntercept = false;
    path.setAttributeNS(null, "d", "M" + map.stations[0].x + " " + map.stations[0].y);

    if (map.stations.length === 2) {
        path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + " L" + map.stations[1].x + " " + map.stations[1].y);
    } else if (map.stations.length !== 1)
        map.stations.forEach((e, index) => {
            // 首先需要判断 一般分三类
            // k===0            水平垂直线
            // k===1            45度斜线
            // k!==1&&k!==0     需要组合线
            let k;
            console.log(index, e);
            try {
                if ((index >= map.stations.length - 2) &&
                    (e.x !== map.stations[index + 1].x || e.y !== map.stations[index + 1].y)) { // 末尾的转折，无需判断更多
                    path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + "C" + e.x + " " + e.y + " " + e.x + " " + e.y + " " + map.stations[index + 1].x + " " + map.stations[index + 1].y);
                    shouldIntercept = true;
                    return;
                }
            } catch (e) {
            }

            if (index >= map.stations.length - 1 || shouldIntercept) return;
            else if (index >= map.stations.length - 2) {
                path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + "L" + map.stations[index + 1].x + " " + map.stations[index + 1].y);
                shouldIntercept = true;
                return;
            }

            if (e.x === map.stations[index + 1].x || e.y === map.stations[index + 1].y) k = 0; // 垂直水平直线
            else k = (e.x - map.stations[index + 1].x) / (e.y - map.stations[index + 1].y); // 斜率

            console.log(k);
            console.log("(x, y): \t" + e.x + "\t" + map.stations[index + 1].x + "\t" + e.y + "\t" + map.stations[index + 1].y);
            if (k === 0) {
                // 垂直水平型
                if (not_visited) {
                    // TODO: min-max turning size
                    // 属于四十五度的折线
                    path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + "C" + e.x + " " + e.y + " " + e.x + " " + e.y + " " + map.stations[index + 1].x + " " + map.stations[index + 1].y);
                    not_visited = false;
                }
                if (!(e.x === map.stations[index + 1].x && e.x === map.stations[index + 2].x || e.y === map.stations[index + 1].y && e.y === map.stations[index + 2].y)) {
                    // 不是同一水平线，忽略，传送给处理45度/组合
                    not_visited = true;
                } else {
                    if (not_visited) {
                        // TODO: min-max turning size
                        path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + "C" + e.x + " " + e.y + " " + e.x + " " + e.y + " " + map.stations[index + 1].x + " " + map.stations[index + 1].y);
                        not_visited = false;
                    } else
                        path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + "L" + map.stations[index + 1].x + " " + map.stations[index + 1].y);
                }
            } else if (Math.abs(k) === 1) {
                // 45度斜线
                if (not_visited) {
                    // 属于四十五度的折线
                    // TODO: min-max turning size
                    path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + "C" + e.x + " " + e.y + " " + e.x + " " + e.y + " " + map.stations[index + 1].x + " " + map.stations[index + 1].y);
                    not_visited = false;
                } else {
                    let ktmp;
                    if (map.stations[index + 2].x === map.stations[index + 1].x || map.stations[index + 2].y === map.stations[index + 1].y) ktmp = 0; // 垂直水平直线
                    else ktmp = (map.stations[index + 2].x - map.stations[index + 1].x) / (map.stations[index + 2].y - map.stations[index + 1].y); // 斜率

                    if (Math.abs(ktmp) === 1)
                        path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + "L" + map.stations[index + 2].x + " " + map.stations[index + 2].y);
                    else not_visited = true;
                }
            } else {
                // TODO: upd non-usual-type's line
            }
        });
    else
        path.setAttributeNS(null, "d", path.getAttributeNS(null, "d") + "a 5 5 0 0 0 0 0 a 5 5 0 0 0 0 0");
}