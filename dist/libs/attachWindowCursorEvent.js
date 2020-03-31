/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const attachEvent = {
    // Package: EditStation
    EditStation: {
        ClickEventListener: (event) => {
            let curX = min(event.offsetX);
            let curY = min(event.offsetY);
            try {
                if ((!state.newPath) && (contentData.pathInfo[state.pathId][0].stations.last().x === curX) && (contentData.pathInfo[state.pathId][0].stations.last().y === curY)) {
                    builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "Same station, skip.");
                    return; // 两点同位
                }
            } catch (err) {
                // 无需抛出
            }

            if (state.newPath) {
                contentData.push({
                    name: "Unnamed Project", author: "@User", lastModified: new Date().getTime(), pathInf: {
                        "lineCap": "round",
                        "lineJoin": "round",
                        "strokeWidth": "5px",
                        "color": "#000",
                        "id": state.pathId,
                        "opacity": 1,
                        "stations": [{"x": curX, "y": curY, "type": "destination", "routeToNext": ""}]
                    }
                });
                state.newPath = false;
                initDrawable();
                builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "New Path Created: id=" + state.pathId);
            } else {
                builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "New Station Created: [x,y]=" + curX + ", " + curY);
                contentData.pathInfo[state.pathId].stations.push({
                    x: curX, y: curY, type: "destination", routeToNext: "0"
                });
                drawMap(state.pathId);
            }
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