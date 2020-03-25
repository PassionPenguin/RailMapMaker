/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const attachEvent = {
    // Package: EditStation
    EditStation: {
        ClickEventListener: (event) => {
            if (state.newPath) {
                pathInfo.push([]);
                state.pathId++;
            }

            let curX = min(event.offsetX);
            let curY = min(event.offsetY);
            try {
                console.log(curX, curY);
                if ((!state.newPath) && (pathInfo[state.pathId][0].stations.last().x === curX) && (pathInfo[state.pathId][0].stations.last().y === curY)) {
                    return; // 两点同位
                }
            } catch (err) {
                // 无需抛出
            }

            if (state.newPath) {
                let svg = pg.$("#resSvg")[0];
                let path = document.createElementNS(svg.namespaceURI, "path");
                path.setAttributeNS(null, "stroke", "#000");
                svg.appendChild(path);
                pathInfo[state.pathId].push({
                    color: "#000",
                    id: state.pathId,
                    name: "UnnamedPath_" + state.pathId,
                    opacity: 1, stations: [{x: curX, y: curY, type: "destination", routeToNext: ""}]
                });
                pathInfo[state.pathId].path = path;
                state.newPath = false;
            } else
                pathInfo[state.pathId][0].stations.push({
                    x: curX, y: curY, type: "destination", routeToNext: ""
                });
            reloadMap(state.pathId);
        },
        MoveEventListener: (element) => {
            element.setAttribute("style", "left:" + min(event.offsetX) + "px; top:" + min(event.offsetY) + "px;");
            event.stopPropagation();
        },

        attachClickEvent: (element) => {
            if (builder.debugMode)
                builder.debug("PassionPenguin/mapMaker", "attachWindowCursorEvent.js", "Event", "Event Attached: EditStation.Click");
            element.addEventListener("click", attachEvent.EditStation.ClickEventListener);
        },

        detachClickEvent: (element) => {
            if (builder.debugMode)
                builder.debug("PassionPenguin/mapMaker", "attachWindowCursorEvent.js", "Event", "Event Detached: EditStation.Click");
            element.removeEventListener("click", attachEvent.EditStation.ClickEventListener);
        },

        attachMoveEvent: (element, target) => {
            if (builder.debugMode)
                builder.debug("PassionPenguin/mapMaker", "attachWindowCursorEvent.js", "Event", "Event Attached: EditStation.Move");
            element.addEventListener("mousemove", () => {
                attachEvent.EditStation.MoveEventListener(target)
            });
        },

        detachMoveEvent: (element, target) => {
            if (builder.debugMode)
                builder.debug("PassionPenguin/mapMaker", "attachWindowCursorEvent.js", "Event", "Event Detached: EditStation.Move");
            element.removeEventListener("mousemove", (target) => {
                attachEvent.EditStation.MoveEventListener(target)
            });
        }
    }
}