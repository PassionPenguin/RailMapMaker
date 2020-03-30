/*

    Package PassionPenguin/RailMapMaker


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
                if ((!state.newPath) && (pathInfo[state.pathId][0].stations.last().x === curX) && (pathInfo[state.pathId][0].stations.last().y === curY)) {
                    builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "Same station, skip.");
                    return; // 两点同位
                }
            } catch (err) {
                // 无需抛出
            }

            if (state.newPath) {
                let svg = pg.$("#resSvg")[0];
                let path = document.createElementNS(svg.namespaceURI, "path");
                let stations = document.createElementNS(svg.namespaceURI, "g");
                path.setAttributeNS(null, "stroke", "#000");
                path.setAttributeNS(null, "id", "UnnamedPath_" + state.pathId);
                path.setAttributeNS(null, "class", "pathElement");
                stations.setAttributeNS(null, "id", "UnnamedStations_" + state.pathId);
                svg.appendChild(path);
                svg.appendChild(stations);
                builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "New Path Created: id=" + state.pathId);
                pathInfo[state.pathId] = {
                    color: "#000",
                    id: state.pathId,
                    name: "UnnamedPath_" + state.pathId,
                    opacity: 1, stations: [{x: curX, y: curY, type: "destination", routeToNext: "0"}]
                };
                state.newPath = false;
            } else {
                builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "New Station Created: [x,y]=" + curX + ", " + curY);
                pathInfo[state.pathId].stations.push({
                    x: curX, y: curY, type: "destination", routeToNext: "0"
                });
            }
            drawMap(state.pathId);
        },
        MoveEventListener: (element) => {
            element.setAttribute("style", "left:" + (min(event.offsetX) - pg.$("#pg-app")[0].scrollLeft) + "px; top:" + (min(event.offsetY) - pg.$("#pg-app")[0].scrollTop) + "px;");
            event.stopPropagation();
        },

        attachClickEvent: (element) => {
            builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Event", "Event Attached: EditStation.Click");
            element.addEventListener("click", attachEvent.EditStation.ClickEventListener);
        },

        detachClickEvent: (element) => {
            builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Event", "Event Detached: EditStation.Click");
            element.removeEventListener("click", attachEvent.EditStation.ClickEventListener);
        },

        attachMoveEvent: (element, target) => {
            builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Event", "Event Attached: EditStation.Move");
            element.addEventListener("mousemove", () => {
                attachEvent.EditStation.MoveEventListener(target)
            });
        },

        detachMoveEvent: (element, target) => {
            builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Event", "Event Detached: EditStation.Move");
            element.removeEventListener("mousemove", (target) => {
                attachEvent.EditStation.MoveEventListener(target)
            });
        }
    }
}