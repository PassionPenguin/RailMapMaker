/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const initInterface = (type) => {
    /*
    * type: Int
        * 0 => Enter interface
        * 1 => Editor interface
    * */

    if (ProgressManager.query.indexOf(0) !== -1)
        ProgressManager.update(0, 66.6, 100);
    else ProgressManager.create(0, 0, 100);
    let view = pg.$("#pg-app")[0];
    if (contentData === null || type === 0) {
        // enter interface
        view.innerHTML = "";
        let storyboard = cE({type: "div", attr: [["class", "pg-storyboard"]]});
        view.appendChild(storyboard);
        storyboard.appendChild(cE({
            type: "div",
            attr: [["class", "pg-storyboard-banner"]],
            innerHTML: "<img src='./assets/mipmap/icon.png' alt='icon'><h1>" + strings.appName + "</h1><h3>" + strings.version + " " + builder.displayVersion + "</h3>"
        }));
        let storyboardCtrlList = cE({
            type: "div",
            attr: [["class", "pg-storyboard-list"]]
        });
        storyboard.appendChild(storyboardCtrlList);
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>attachment</span><span> " + strings.importFile + " (*.rmg) </span>",
            onclick: () => {
                // upload an rmg file
                let file = cE({type: "input", attr: [["type", "file"], ["accept", ".rmg"]]});
                file.click();
                file.onchange = () => {
                    let fileContent = file.files[0];
                    if (fileContent.name.substring(fileContent.name.lastIndexOf(".")) !== ".rmg") {

                        return;
                    }
                    let reader = new FileReader();
                    reader.readAsText(fileContent);
                    reader.onload = () => {
                        window.contentData = {
                            content: reader.result,
                            size: fileContent.size,
                            name: fileContent.name,
                            lastModified: fileContent.lastModified, type: fileContent.type
                        };
                        NotificationManager.create(strings.system, strings.uploaded + " <span class='color-primary'>" + fileContent.name + "</span>", 0, {
                            time: -1,
                            icon: "check"
                        });
                        try {
                            pathInfo = JSON.parse(reader.result);
                        } catch (e) {
                            NotificationManager.create(strings.system, strings.parseErr + " <span class='color-primary'>" + fileContent.name + "</span>: " + e, 0, {
                                time: -1,
                                icon: "close"
                            });
                            contentData = null;
                            initInterface(0);
                        }
                        if (Array.isArray(pathInfo)) {
                            for (let i = 0; i < pathInfo.length; i++) {
                                reloadMap(i);
                            }
                            initInterface(1);
                        } else {
                            NotificationManager.create(strings.system, strings.parseErr + " <span class='color-primary'>" + fileContent.name + "</span>: " + strings.not_arr, 0, {
                                time: -1,
                                icon: "close"
                            });
                            contentData = null;
                            initInterface(0);
                        }
                    }
                }
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>dashboard</span><span> " + strings.openTemplate + "</span>",
            onclick: () => {
                [...view.children].forEach((e) => {
                    e.setAttribute("style", "transition:500ms;opacity:0;");
                    setTimeout(() => {
                        view.removeChild(e)
                    }, 500);
                    view.appendChild(cE({
                        type: "div",
                        attr: [["id", "grid"], ["style", "background:url('./assets/mipmap/grid.png') repeat;width:200vw;height:200vh;z-index:0; background-size: 50px;"]]
                    }));
                    view.appendChild(cE({
                        type: "div",
                        attr: [["id", "drawable"]],
                        innerHTML: "<svg id=\"resSvg\" xmlns=\"http://www.w3.org/2000/svg\"><defs><symbol id='stationStyle_circle'><path d='M0 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0z' style='fill:var(--white);stroke-width: 2px;'/></symbol><symbol id='stationStyle_rect'><path d='M0,0v16h16V0H0z M14,14H2V2h12V14z' style='fill:unset!important'/></symbol></defs></svg>"
                    }));
                    view.appendChild(cE({type: "div", attr: [["id", "cursor"]]}));

                    attachEvent.EditStation.attachClickEvent(pg.$("#drawable")[0]);
                    attachEvent.EditStation.attachMoveEvent(pg.$("#drawable")[0], pg.$("#cursor")[0]);
                    pathInfo = [{
                        "color": "#000",
                        "id": 0,
                        "name": "UnnamedPath_0",
                        "opacity": 1,
                        "stations": [{"x": 225, "y": 1025, "type": "destination", "routeToNext": ""}, {
                            "x": 225,
                            "y": 900,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 225, "y": 775, "type": "destination", "routeToNext": ""}, {
                            "x": 225,
                            "y": 650,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 225, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 350,
                            "y": 525,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 475, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 600,
                            "y": 525,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 725, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 850,
                            "y": 525,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 975, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 1100,
                            "y": 525,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 1225, "y": 525, "type": "destination", "routeToNext": ""}, {
                            "x": 1325,
                            "y": 425,
                            "type": "destination",
                            "routeToNext": ""
                        }, {"x": 1225, "y": 325, "type": "destination", "routeToNext": ""}]
                    }]; // TODO: Create an json file and export and enter here.
                    contentData = "[{\"color\":\"#000\",\"id\":0,\"name\":\"UnnamedPath_0\",\"opacity\":1,\"stations\":[{\"x\":225,\"y\":1025,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":225,\"y\":900,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":225,\"y\":775,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":225,\"y\":650,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":225,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":350,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":475,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":600,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":725,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":850,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":975,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":1100,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":1225,\"y\":525,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":1325,\"y\":425,\"type\":\"destination\",\"routeToNext\":\"\"},{\"x\":1225,\"y\":325,\"type\":\"destination\",\"routeToNext\":\"\"}]}]";
                    pathInfo.forEach(e => {
                        let svg = pg.$("#resSvg")[0];
                        let path = document.createElementNS(svg.namespaceURI, "path");
                        let stations = document.createElementNS(svg.namespaceURI, "g");
                        path.setAttributeNS(null, "stroke", "#000");
                        path.setAttributeNS(null, "id", "UnnamedPath_" + e.id);
                        stations.setAttributeNS(null, "id", "UnnamedStations_" + e.id);
                        svg.appendChild(path);
                        svg.appendChild(stations);
                        state.pathId++;
                    });
                    for (let i = 0; i < pathInfo.length; i++) {
                        reloadMap(i);
                    }
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>info</span><span> " + strings.about + " </span>",
            onclick: () => {
                // open about window
                WindowManager.create((e) => {
                    e.appendChild(cE({
                        type: "img",
                        attr: [["alt", "icon"], ["style", "width: 128px;display: block;margin: 0 auto;"], ["src", "./assets/mipmap/icon.png"]]
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 900 28px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;"]],
                        innerHTML: strings.appName
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 16px/1 Anodina, sans-serif;text-align: center;margin: 10px 0 20px 0;color: var(--grey);"]],
                        innerHTML: strings.version + " " + builder.displayVersion
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.buildTime + "\t" + new Date(builder.buildTime).toLocaleDateString()
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.curLanguage + "\t" + builder.locales[pg.language]
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.curMode + "\t" + ((builder.debugMode === 0) ? strings.production : strings.dev)
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.developer + "\t<a href='https://github.com/PassionPenguin'>@PassionPenguin</a> <a href='https://github.com/wongchito'>@wongchito</a>"
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: "Repo\t<a href='https://github.com/PassionPenguin/RailMapMaker'>RailMapMaker on GitHub</a>"
                    }));

                    builder.bundles.forEach(i => {
                        e.appendChild(cE({
                            type: "p",
                            attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                            innerHTML: "Bundle " + i.name + "\t" + i.version
                        }));
                    });
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>settings</span><span> " + strings.preference + " </span>",
            onclick: () => {
                // open preference window

            }
        }));
    } else if (type === 1) {
        // editor interface
        [...view.children].forEach((e) => {
            e.setAttribute("style", "transition:500ms;opacity:0;");
            setTimeout(() => {
                view.removeChild(e)
            }, 500);
            view.appendChild(cE({
                type: "div",
                attr: [["id", "grid"], ["style", "background:url('./assets/mipmap/grid.png') repeat;width:200vw;height:200vh;z-index:0; background-size: 50px;"]]
            }));
            view.appendChild(cE({
                type: "div",
                attr: [["id", "drawable"]],
                innerHTML: "<svg id=\"resSvg\" xmlns=\"http://www.w3.org/2000/svg\"><defs><symbol id='stationStyle_circle'><path d='M0 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0z' style='fill:var(--white);stroke-width: 2px;'/></symbol><symbol id='stationStyle_rect'><path d='M0,0v16h16V0H0z M14,14H2V2h12V14z' style='fill:unset!important'/></symbol></defs></svg>"
            }));
            view.appendChild(cE({type: "div", attr: [["id", "cursor"]]}));

            attachEvent.EditStation.attachClickEvent(pg.$("#drawable")[0]);
            attachEvent.EditStation.attachMoveEvent(pg.$("#drawable")[0], pg.$("#cursor")[0]);
        })
    }


    ProgressManager.update(0, 0, 0);
    setTimeout(() => {
        ProgressManager.remove(0);
    }, 500);
}