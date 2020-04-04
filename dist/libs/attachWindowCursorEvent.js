/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const attachEvent = {
    // Package: EditStation
    EditStation: {
        ClickEventListener: (event) => {
            /*
            * @param: event :Event <Event>
            * @return: void
            */
            let curX = min(event.offsetX);
            let curY = min(event.offsetY);
            let lastData = contentData.pathInfo[state.pathId].stations.last();
            try {
                if ((!state.newPath) && (lastData.x === curX) && (lastData.y === curY)) {
                    console.log(lastData, curX, curY);
                    builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "Same station, skip.");
                    return; // 两点同位
                } else if ((!state.newPath) && (lastData.x !== curX && lastData.y !== curY) && (Math.abs(lastData.x - curX) < 100 || Math.abs(lastData.y - curY) < 100)) {
                    console.log("\t", lastData, curX, curY);
                    builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "Too near, skip.");
                    return; // 两点同位
                }
            } catch (err) {
                // 无需抛出
            }

            if (state.newPath) {
                contentData.pathInfo.push({
                    lineCap: "round",
                    lineJoin: "round",
                    strokeWidth: "5px",
                    color: "#000",
                    id: state.pathId,
                    name: `UnnamedPath_${state.pathId}`,
                    opacity: 1,
                    stations: [{
                        x: curX,
                        y: curY,
                        type: "destination",
                        routeToNext: "",
                        "text": {
                            "type": "withSecondaryName",
                            "name": [
                                "天河公园",
                                "Tianhe Park"
                            ],
                            "position": 1,
                            "alignment": "middle"
                        }
                    }]
                });
                state.newPath = false;
                initDrawable();
                builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "New Path Created: id=" + state.pathId);
            } else {
                builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Path", "New Station Created: [x,y]=" + curX + ", " + curY);
                if (contentData.pathInfo[state.pathId].stations.length > 1)
                    contentData.pathInfo[state.pathId].stations.last().type = "common";

                contentData.pathInfo[state.pathId].stations.push({
                    x: curX, y: curY, type: "destination", routeToNext: "0",
                    "text": {
                        "type": "withSecondaryName",
                        "name": [
                            "天河公园",
                            "Tianhe Park"
                        ],
                        "position": 1,
                        "alignment": "middle"
                    }
                });
                drawMap(state.pathId);
            }
        },
        MoveEventListener: (element, event) => {
            /*
            * @param: element :Element <The Cursor Element>
            * @param: event :Event <Event>
            * @return: void
            */
            let curX = min(event.offsetX) + pg.$("#pg-app")[0].getBoundingClientRect().x - pg.$("#pg-app")[0].scrollLeft;
            let curY = min(event.offsetY) + pg.$("#pg-app")[0].getBoundingClientRect().y - pg.$("#pg-app")[0].scrollTop;
            element.setAttribute("style", "left:" + curX + "px; top:" + curY + "px;");
            event.stopPropagation();
        },

        attachClickEvent: (element) => {
            /*
            * @param: element :Element <Element need to be bound to Click Event>
            * @return: void
            */
            builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Event", "Event Attached: EditStation.Click");
            element.onclick = (event) => {
                attachEvent.EditStation.ClickEventListener(event);
            }
        },

        attachMoveEvent: (element, target) => {
            /*
            * @param: element :Element <Element need to be bound to Click Event>
            * @param: target :Element <Cursor Element need to be bound to Click Event>
            * @return: void
            */
            builder.debug("PassionPenguin/RailMapMaker", "attachWindowCursorEvent.js", "Event", "Event Attached: EditStation.Move");
            element.addEventListener("mousemove", (event) => {
                event.stopPropagation();
                attachEvent.EditStation.MoveEventListener(target, event)
            });
        },
    }
}