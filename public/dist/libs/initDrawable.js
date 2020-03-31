/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const initDrawable = () => {
    contentData.pathInfo.forEach(e => {
        let svg = pg.$("#resSvg")[0];

        let pathsGroup, stationsGroup;
        if (pg.$("#AllPathsGroup").length === 0) {
            pathsGroup = document.createElementNS(svg.namespaceURI, "g")
            pathsGroup.setAttributeNS(null, "id", "AllPathsGroup");
            svg.appendChild(pathsGroup);
        } else pathsGroup = pg.$("#AllPathsGroup")[0];

        if (pg.$("#AllStationsGroup").length === 0) {
            stationsGroup = document.createElementNS(svg.namespaceURI, "g")
            stationsGroup.setAttributeNS(null, "id", "AllStationsGroup");
            svg.appendChild(stationsGroup);
        } else stationsGroup = pg.$("#AllStationsGroup")[0];

        let path = document.createElementNS(svg.namespaceURI, "path");
        let stations = document.createElementNS(svg.namespaceURI, "g");
        path.setAttributeNS(null, "stroke", "#000");
        path.setAttributeNS(null, "id", "UnnamedPath_" + e.id);
        path.setAttributeNS(null, "class", "pathElement");
        stations.setAttributeNS(null, "id", "UnnamedStations_" + e.id);
        stations.setAttributeNS(null, "class", "stationsGroup");
        pathsGroup.appendChild(path);
        stationsGroup.appendChild(stations);
    });
    for (let i = 0; i < contentData.pathInfo.length; i++) {
        drawMap(i);
    }
    state.pathId = contentData.pathInfo.length - 1;
};