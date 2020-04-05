/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const initDrawable = () => {
    contentData.pathInfo.forEach(e => {
        let svg = pg.$("#resSvg")[0];

        let pathsGroup, stationsGroup, namesGroup;
        if (pg.$("#AllPathsGroup").length === 0) {
            pathsGroup = document.createElementNS(svg.namespaceURI, "g");
            pathsGroup.setAttributeNS(null, "id", "AllPathsGroup");
            svg.appendChild(pathsGroup);
        } else pathsGroup = pg.$("#AllPathsGroup")[0];

        if (pg.$("#AllStationsGroup").length === 0) {
            stationsGroup = document.createElementNS(svg.namespaceURI, "g");
            stationsGroup.setAttributeNS(null, "id", "AllStationsGroup");
            svg.appendChild(stationsGroup);
        } else stationsGroup = pg.$("#AllStationsGroup")[0];

        if (pg.$("#stationNames").length === 0) {
            namesGroup = document.createElementNS(svg.namespaceURI, "g");
            namesGroup.setAttributeNS(null, "id", "stationNames");
        } else namesGroup = pg.$("#stationNames")[0];
        svg.appendChild(namesGroup);

        let path = document.createElementNS(svg.namespaceURI, "path");
        let stations = document.createElementNS(svg.namespaceURI, "g");
        path.setAttributeNS(null, "stroke", "#000");
        path.setAttributeNS(null, "id", "Path_" + e.id);
        path.setAttributeNS(null, "class", "pathElement");
        stations.setAttributeNS(null, "id", "Stations_" + e.id);
        stations.setAttributeNS(null, "class", "stationsGroup");
        pathsGroup.appendChild(path);
        stationsGroup.appendChild(stations);

        let names = document.createElementNS(svg.namespaceURI, "g");
        names.setAttributeNS(null, "id", "Names_" + e.id);
        names.setAttributeNS(null, "class", "nameGroup");
        namesGroup.appendChild(names);
        svg.appendChild(namesGroup);

    });
    for (let i = 0; i < contentData.pathInfo.length; i++) {
        drawMap(i);
    }
    state.pathId = contentData.pathInfo.length - 1;
};