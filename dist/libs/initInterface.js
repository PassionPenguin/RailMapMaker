/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const initInterface = (type, returnFunc) => {
    /*
    * type: Int
        * 0 => Enter interface
        * 1 => Editor interface
    * */

    if (ProgressManager.query.indexOf(0) !== -1)
        ProgressManager.update(0, 66.6, 100);
    else ProgressManager.create(0, 0, 100);
    let view = pg.$("#pg-app")[0];
    if (type === 0) {
        // enter interface
        [...view.children].forEach((e) => {
            e.setAttribute("style", "transition:500ms;opacity:0;");
            setTimeout(() => {
                try {
                    view.removeChild(e);
                } catch (exception) {
                }
            }, 500);
        });
        let storyboard = cE({type: "div", attr: [["class", "pg-storyboard"]]});
        let storyboardFileList = cE({type: "div", attr: [["class", "pg-storyboard-fileList"]]});
        let storyboardFileListContent = cE({
            type: "div",
            attr: [["style", "position:relative;width:100%;height:100%;"]]
        });
        JSONParser(LocaleStorageManager.get("fileList")).then(val => {
            (val.length === 0) ? storyboardFileListContent.appendChild(cE({
                type: "span",
                attr: [["style", "left:50%;top:50%;transform:translate(-50%,-50%);position:absolute;display:inline-block;font:24px/1 Anodina,sans-serif;color:var(--grey);"]],
                innerHTML: strings.noFile
            })) : val.forEach(e => {
                JSONParser(LocaleStorageManager.get('fileData_' + e)).then(i => {
                    storyboardFileListContent.appendChild(cE({
                        type: "div", attr: [["class", "pg-storyboard-file"]],
                        innerHTML: `<p class='fileName'>${i.name}</p><span class='fileMeta'>${new Date(i.lastModified).toLocaleString()} | ${i.author} </span>`,
                        onclick: () => {
                            window.contentData = i;
                            initInterface(1);
                            initDrawable();
                        }
                    }))
                });
            });
        });
        storyboardFileList.appendChild(storyboardFileListContent);
        view.appendChild(storyboard);
        view.appendChild(storyboardFileList);
        storyboard.appendChild(cE({
            type: "div",
            attr: [["class", "pg-storyboard-banner"]],
            innerHTML: "<img src='./assets/mipmap/icon@1024.png' alt='icon'><h1>" + strings.appName + "</h1><h3>" + strings.version + " " + builder.displayVersion + "</h3>"
        }));
        let storyboardCtrlList = cE({
            type: "div",
            attr: [["class", "pg-storyboard-list"]]
        });
        storyboard.appendChild(storyboardCtrlList);
        storyboardCtrlList.appendChild(cE({
            type: "p",
            attr: [["class", "xlg-exclude"], ["style", "margin-top: 20px!important;"]],
            innerHTML: "<span class='mi'>folder</span><span> " + strings.recentFiles + " </span>",
            onclick: () => {
                WindowManager.create((view, channelId) => {
                    let popup_storyboardFileList = cE({type: "div", attr: [["class", "pg-storyboard-fileList"]]});
                    JSONParser(LocaleStorageManager.get("fileList")).then(val => {
                        (val.length === 0) ? popup_storyboardFileList.appendChild(cE({
                            type: "span",
                            attr: [["style", "left:50%;top:50%;transform:translate(-50%,-50%);position:absolute;display:inline-block;font:24px/1 Anodina,sans-serif;color:var(--grey);"]],
                            innerHTML: strings.noFile
                        })) : val.forEach(e => {
                            JSONParser(LocaleStorageManager.get('fileData_' + e)).then(i => {
                                popup_storyboardFileList.appendChild(cE({
                                    type: "div", attr: [["class", "pg-storyboard-file"]],
                                    innerHTML: `<p class='fileName' style="font-weight:600;font-size:18px;">${i.name}</p><span class='fileMeta'>${new Date(i.lastModified).toLocaleString()} | ${i.author} </span>`,
                                    onclick: () => {
                                        window.contentData = i;
                                        initInterface(1);
                                        initDrawable();
                                        WindowManager.remove(channelId);
                                    }
                                }));
                            });
                        });
                    });
                    view.appendChild(popup_storyboardFileList);
                }, {size: "large", title: strings.recentFiles});
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>attachment</span><span> " + strings.importFile + " (*.rmg) </span>",
            onclick: () => {
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
                        NotificationManager.create(strings.uploaded + " <span class='color-primary'>" + fileContent.name + "</span>", 0, {
                            icon: "check"
                        });
                        try {
                            window.contentData = JSON.parse(reader.result.toString());
                            initInterface(1);
                            initDrawable();
                        } catch (e) {
                            NotificationManager.create(strings.parseErr + " <span class='color-primary'>" + fileContent.name + "</span>: " + e, 0, {
                                time: -1,
                                icon: "close"
                            });
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
                state.fileId++;
                window.contentData = {
                    "name": "Guangzhou Line",
                    "author": "Penguin",
                    "lastModified": 1586246429221,
                    "width": 4000,
                    "height": 4000,
                    "textStyle": "",
                    "primaryNameStyle": "font:18px/1 Anodina,sans-serif;",
                    "secondaryNameStyle": "font:11px/1 Anodina,sans-serif;color:var(--grey)",
                    "pathInfo": [{
                        "lineCap": "round",
                        "lineJoin": "round",
                        "strokeWidth": "5px",
                        "color": "#f3d03e",
                        "id": 0,
                        "name": "Line 1",
                        "opacity": 1,
                        "stations": [{
                            "x": 225,
                            "y": 2150,
                            "type": "destination",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["西塱", "Xilang"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 225,
                            "y": 2025,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["坑口", "Kengkou"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 225,
                            "y": 1900,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["花地湾", "Huadiwan"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 225,
                            "y": 1775,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["芳村", "Fangcun"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 225,
                            "y": 1650,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["黄沙", "Huangsha"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 350,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["长寿路", "Changshou Lu"],
                                "position": 1,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 475,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["陈家祠", "Chen Clan Academy"],
                                "position": 1,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 600,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["西门口", "Ximenkou"],
                                "position": 1,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["公园前", "Gongyuanqian"],
                                "position": 5,
                                "alignment": "end"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 850,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["农讲所", "Peasant's Movement Institute"],
                                "position": 1,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 975,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["烈士陵园", "Martyrs' Park"],
                                "position": 1,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 1100,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["东山口", "Dongshankou"],
                                "position": 1,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 1225,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["杨箕", "Yangji"],
                                "position": 1,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 1350,
                            "y": 1525,
                            "type": "common",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["体育西路", "Tiyu Xilu"],
                                "position": 1,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 1475,
                            "y": 1400,
                            "type": "common",
                            "routeToNext": "3",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["体育中心", "Tianhe Sports Center"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 1350,
                            "y": 1275,
                            "type": "destination",
                            "routeToNext": "2",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["广州东站", "Guangzhou East\nRailway Station"],
                                "position": 3,
                                "alignment": "end"
                            },
                            "stationStyle": "rect"
                        }]
                    }, {
                        "lineCap": "round",
                        "lineJoin": "round",
                        "strokeWidth": "5px",
                        "color": "#00629b",
                        "id": 1,
                        "name": "Line 2",
                        "opacity": 1,
                        "stations": [{
                            "x": 625,
                            "y": 3025,
                            "type": "destination",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["广州南站", "Guangzhou South Railway Station"],
                                "position": 3,
                                "alignment": "end"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 2925,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["石壁", "Shibi"],
                                "position": 0,
                                "alignment": "middle"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 825,
                            "y": 2825,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["会江", "Huijiang"],
                                "position": 0,
                                "alignment": "end"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 925,
                            "y": 2675,
                            "type": "common",
                            "routeToNext": "6",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["南浦", "Nanpu"],
                                "position": 3,
                                "alignment": "end"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 925,
                            "y": 2575,
                            "type": "common",
                            "routeToNext": "4",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["洛溪", "Luoxi"],
                                "position": 3,
                                "alignment": "end"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 925,
                            "y": 2450,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["南洲", "Nanzhou"],
                                "position": 3,
                                "alignment": "end"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 825,
                            "y": 2300,
                            "type": "common",
                            "routeToNext": "4",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["东晓南", "Dongxiaonan"],
                                "position": 3,
                                "alignment": "end"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 2150,
                            "type": "common",
                            "routeToNext": "6",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["江泰路", "Jiangtai Lu"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 2025,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["昌岗", "Changgang"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 1900,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["江南西", "Jiangnanxi"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 1775,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["市二宫", "2nd Workers Cultural Palace"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 1650,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["海珠广场", "Haizhu Square"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 1400,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["纪念堂", "Sun Yat-sen Memorial Hall"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 1275,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["越秀公园", "Yuexiu Park"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 1150,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["广州火车站", "Guangzhou Railway Station"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 1025,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["三元里", "Sanyuanli"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 900,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["飞翔公园", "Feixiang Park"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 775,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["白云公园", "Baiyun Park"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 650,
                            "type": "common",
                            "routeToNext": "4",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["白云文化广场", "Baiyun Culture Square"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 725,
                            "y": 525,
                            "type": "common",
                            "routeToNext": "4",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["萧岗", "Xiaogang"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 825,
                            "y": 350,
                            "type": "common",
                            "routeToNext": "4",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["江夏", "Jiangxia"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 925,
                            "y": 250,
                            "type": "common",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["黄边", "Huangbian"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }, {
                            "x": 1025,
                            "y": 150,
                            "type": "destination",
                            "routeToNext": "8",
                            "text": {
                                "type": "withSecondaryName",
                                "name": ["嘉禾望岗", "Jiahewanggang"],
                                "position": 4,
                                "alignment": "start"
                            },
                            "stationStyle": "rect"
                        }]
                    }]
                };
                JSONParser(LocaleStorageManager.get("fileList")).then(i => {
                    i.push(JSON.parse(LocaleStorageManager.get("fileList")).length);
                    LocaleStorageManager.set("fileList", JSON.stringify(i));
                });
                initInterface(1, () => {
                    initDrawable();
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>open_in_new</span><span> " + strings.openNew + "</span>",
            onclick: () => {
                state.fileId++;
                JSONParser(LocaleStorageManager.get("fileList")).then(i => {
                    i.push(JSON.parse(LocaleStorageManager.get("fileList")).length);
                    LocaleStorageManager.set("fileList", JSON.stringify(i));
                });
                window.contentData = {
                    name: "Untitled Project",
                    author: "Unnamed User",
                    lastModified: new Date().getTime(),
                    width: 2000,
                    height: 2000,
                    textStyle: "",
                    primaryNameStyle: "",
                    secondaryNameStyle: "",
                    pathInfo: [{
                        stations: []
                    }]
                };
                initInterface(1, () => {
                    initDrawable();
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>build</span><span> " + strings.test + "</span>",
            onclick: () => {
                let info = [];
                for (let i = 0; i < 158; i++) {
                    let a = [];
                    for (let i = 0; i < 14; i++) {
                        let randomSeedA = Int(Math.random() * (5 - 1 + 1)),
                            randomSeedB = Int(Math.random() * (5 - 1 + 1));
                        a.push({
                            x: Int(Math.random() * (9999)),
                            y: Int(Math.random() * (9999)),
                            type: "common",
                            routeToNext: Int(Math.random() * 8).toString(),
                            text: {
                                name: [["天河公园", "东郊公园", "爱心公园", "流花湖公园", "雕塑公园"][randomSeedA] + ["东", "西", "南", "北", "中"][randomSeedB],
                                    ["Tianhe Park", "Eastend Park", "Love Park", "Liuhua Lake Park", "Sculpture Park"][randomSeedA] + [" East", " West", " South", " North", " Middle"][randomSeedB]],
                                type: "withSecondaryName",
                                position: Int(Math.random() * 8),
                                alignment: ["start", "middle", "end"][Int(Math.random() * 3)]
                            }, stationStyle: ["rect", "circle"][Int(Math.random() * 2)]
                        })
                    }
                    info.push({
                        stations: a,
                        "lineCap": "round",
                        "lineJoin": "round",
                        "strokeWidth": "5px",
                        "color": "#f3d03e",
                        "id": 0,
                        "name": "Line 1",
                        "opacity": 1,
                    });
                }
                window.contentData = {
                    "name": "Guangzhou Line",
                    "author": "Penguin",
                    "lastModified": 1586072905067,
                    "width": 9999,
                    "height": 9999,
                    "textStyle": "",
                    "primaryNameStyle": "font:18px/1 Anodina,sans-serif;",
                    "secondaryNameStyle": "font:11px/1 Anodina,sans-serif;color:var(--grey)", "pathInfo": info
                };
                initInterface(1, () => {
                    initDrawable();
                    pg.$("#resSvg")[0].setAttribute("viewBox", "0 0 9999 9999");
                    pg.$("#resSvg")[0].style.width = 999 + "px";
                    pg.$("#resSvg")[0].style.height = 999 + "px";
                    pg.$("#grid")[0].style.width = 999 + "px";
                    pg.$("#grid")[0].style.height = 999 + "px";
                    pg.$("#drawable")[0].style.width = 999 + "px";
                    pg.$("#drawable")[0].style.height = 999 + "px";
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>info</span><span> " + strings.about + " </span>",
            onclick: () => {
                WindowManager.create((e) => {
                    e.appendChild(cE({
                        type: "img",
                        attr: [["alt", "icon"], ["style", "width: 128px;display: block;margin: 0 auto;"], ["src", "./assets/mipmap/icon@1024.png"]]
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
                }, {title: strings.about});
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>settings</span><span> " + strings.preference + " </span>",
            onclick: () => {
                WindowManager.create((e) => {
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.curLanguage + "\t" + builder.locales[pg.language],
                        onclick: () => {
                            WindowManager.create((e) => {
                                e.appendChild(cE({
                                    type: "img",
                                    attr: [["alt", "icon"], ["style", "width: 128px;display: block;margin: 0 auto;"], ["src", "./assets/mipmap/icon@1024.png"]]
                                }));
                                e.appendChild(cE({
                                    type: "p",
                                    attr: [["style", "font: 900 28px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;"]],
                                    innerHTML: strings.appName
                                }));
                                e.appendChild(cE({
                                    type: "p",
                                    attr: [["style", "font: 400 16px/1 Anodina, sans-serif;text-align: center;margin: 20px 0;color: var(--grey);"]],
                                    innerHTML: strings.language
                                }));
                                [["zh-CN", [[240, 0]]], ["zh-HK", [[240, 0], [204, 0]]], ["zh-YUE", [[240, 0]]], ["en-US", [[132, 0]]]].forEach((i, index) => {
                                    let flag = "<div style='display:inline-block;width:96px;'>";
                                    i[1].forEach(j => {
                                        flag += `<span style='display:inline-block;width:36px;height:24px;margin:0 3px;background:url(./assets/mipmap/flags.png);background-position:${j[0]}px ${j[1]};background-size:240px;vertical-align:middle;'></span>`;
                                    });
                                    e.appendChild(cE({
                                        type: "div",
                                        attr: [["style", "width:200px;margin:10px auto;font:900 16px/1 Anodina,sans-serif;"]],
                                        innerHTML: `${flag}</div><span style="margin-left:20px;vertical-align:middle;">${i[0]}</span>`,
                                        onclick: () => {
                                            CookieManager.set("language", index);
                                            window.location.reload();
                                        }
                                    }));
                                });
                            }, {title: strings.language});
                        }
                    }));
                }, {title: strings.preference});
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>memory</span><span> " + strings.debugInfo + " </span>",
            onclick: () => {
                WindowManager.create((e) => {
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/1 Anodina, sans-serif;text-align: center;margin: 10px 0;color: var(--grey);"]],
                        innerHTML: strings.windowWidth + "\t" + window.innerWidth + "\t" + strings.windowHeight + "\t" + window.innerHeight
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/21px Anodina, sans-serif;text-align: center;margin: 10px auto;color: var(--grey);width:80%;"]],
                        innerHTML: strings.browserAgent + "<br>" + navigator.userAgent
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/21px Anodina, sans-serif;text-align: center;margin: 10px auto;color: var(--grey);width:80%;"]],
                        innerHTML: strings.cookieEnabled + ":\t" + (navigator.cookieEnabled ? strings.enabled : strings.disabled)
                    }));
                    e.appendChild(cE({
                        type: "p",
                        attr: [["style", "font: 400 14px/21px Anodina, sans-serif;text-align: center;margin: 10px auto;color: var(--grey);width:80%;"]],
                        innerHTML: strings.onLine + ":\t" + (navigator.onLine ? strings.cur_onLine : strings.cur_offLine)
                    }));
                }, {title: strings.browserInfo});
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            attr: [["class", "standalone-exclude"]],
            innerHTML: "<span class='mi'>get_app</span><span> " + strings.installApp + " </span>",
            onclick: () => {
                WindowManager.create((view, channelId) => {
                        let topView = cE({
                            type: "div",
                            attr: [["style", "height:calc(100% - 48px);width:100%;;overflow:hidden;"]]
                        });
                        let pref = cE({type: "div", attr: [["style", "width:360px;margin:0 auto;"]]});
                        topView.appendChild(pref);
                        view.appendChild(topView);
                        pref.appendChild(cE({
                            type: "p",
                            attr: [["style", "margin:30px auto 10px auto;display:block;width:calc(100% - 40px);font:20px/1 Anodina,sans-serif;text-align:center;"]],
                            innerHTML: strings.installApp
                        }));
                        pref.appendChild(cE({
                            type: "p",
                            attr: [["style", "margin:30px auto 10px auto;display:block;width:calc(100% - 40px);font:300 14px/21px Anodina,sans-serif"]],
                            innerHTML: strings.installAppDescription
                        }));
                        let bottomSelector = cE({
                            type: "div",
                            attr: [["style", "display:block;width:calc(100% - 40px);height:48px;position: fixed;bottom: 0;z-index: 1001;"]]
                        });
                        bottomSelector.appendChild(cE({
                            type: "button",
                            attr: [["class", "button"], ["style", "width:fit-content;float:right;display:inline-block;line-height:30px!important;color:var(--theme);"]],
                            innerText: strings.install,
                            onclick: () => {
                                if (installAppPrompt.prompt === undefined) {
                                    NotificationManager.create(strings.failedInstalling, 999, {
                                        icon: "clear",
                                        iconColor: "#f44336"
                                    })
                                    WindowManager.remove(channelId);
                                } else {
                                    installAppPrompt.prompt();
                                    // Wait for the user to respond to the prompt
                                    installAppPrompt.userChoice.then((choiceResult) => {
                                        if (choiceResult.outcome === 'accepted') {
                                            window.addEventListener('appinstalled', (evt) => {
                                                NotificationManager.create(strings.installedApp, 0);
                                            }, {once: true});
                                        } else {
                                            NotificationManager.create(strings.dismissedInstallPrompt, 0);
                                        }
                                    })
                                }
                            }
                        }));

                        bottomSelector.appendChild(cE({
                            type: "button",
                            attr: [["style", "border:none!important;width:fit-content;float:right;display:inline-block;line-height:30px!important;"], ["class", "button"]],
                            innerText: strings.cancel, onclick: () => {
                                WindowManager.remove(channelId)
                            }
                        }));
                        view.appendChild(bottomSelector);
                    },
                    {
                        size: "small", title: strings.installApp
                    }
                );
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>delete</span><span> " + strings.clearData + " </span>",
            onclick: () => {
                navigator.serviceWorker.getRegistrations().then(
                    function (registrations) {
                        for (let registration of registrations) {
                            registration.unregister();
                        }
                    });
                LocaleStorageManager.clearData();
                CookieManager.clear();
                NotificationManager.create(strings.clearedData, 0, {icon: "delete", iconColor: "#f44336"});
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }));
    } else if (type === 1) {
        // editor interface
        [...view.children].forEach((e) => {
            e.setAttribute("style", "transition:500ms;opacity:0;");
            setTimeout(() => {
                try {
                    view.removeChild(e);
                } catch (exception) {
                }
            }, 500);
        });

        view.appendChild(cE({
            type: "div",
            attr: [["id", "grid"], ["style", `background:url('./assets/mipmap/grid.png') repeat;width:${contentData.width}px;height:${contentData.height}px;z-index:0; background-size: 50px;`]]
        }));
        view.appendChild(cE({
            type: "div",
            attr: [["id", "drawable"], ["style", `width:${contentData.width}px;height:${contentData.height}px;`]],
            innerHTML: `<svg id=\"resSvg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox='0 0 ${contentData.width} ${contentData.height}' style="width:${contentData.width}px;height:${contentData.height}px;"><defs><style>._bg-white{fill:#fff;}</style><symbol id='stationStyle_circle'><circle class=\"_bg-white\" cx=\"8\" cy=\"8\" r=\"8\"/><path class=\"_circleStroke\" d=\"M8,0C3.58,0,0,3.58,0,8s3.58,8,8,8s8-3.58,8-8S12.42,0,8,0z M8,14c-3.31,0-6-2.69-6-6c0-3.31,2.69-6,6-6s6,2.69,6,6C14,11.31,11.31,14,8,14z\"/></symbol><symbol id='stationStyle_rect'><path d='M0,0v16h16v-16z' class='_bg-white'/><path d='M0,0v16h16V0H0z M14,14H2V2h12V14z' class='_rectStroke'/></symbol></defs></svg>`
        }));
        view.appendChild(cE({type: "div", attr: [["id", "cursor"]]}));

        let helper_list_display = false;

        let toggle = cE({
            type: "div",
            attr: [["class", "toggle-Helper"]],
            innerHTML: "<div class='button'><span class='mi'>layers</span>" + strings.helper_toggle + "</div>",
            onclick: (e) => {
                if (!helper_list_display) {
                    helper_list_display = true;
                    let list = cE({type: "div", attr: [["class", "helper_list"]]});
                    [["open_in_new", strings.export, strings.exportAssets, strings.exportAssetsDescrption, () => {
                        exportDialog(pg.$("#resSvg")[0]);
                    }], ["settings", strings.settings, strings.openSettings, strings.openSettingsDescription, () => {
                        let editor = cE({type: "div", attr: [["id", "pg-prefEditor"]]});

                        editor.appendChild(cE({
                            type: "div",
                            attr: [["class", "pg-prefEditor-drawableName"], ["style", "margin:10px;"]],
                            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">text_fields</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.drawableName}</span><input value="${contentData.name}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="contentData.name=this.value;savePathComp.current();">`
                        }));
                        editor.appendChild(cE({
                            type: "div",
                            attr: [["class", "pg-prefEditor-author"], ["style", "margin:10px;"]],
                            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">person</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.drawableAuthor}</span><input value="${contentData.author}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="contentData.author=this.value;savePathComp.current();">`
                        }));
                        editor.appendChild(cE({
                            type: "div",
                            attr: [["class", "pg-prefEditor-drawableHeight"], ["style", "margin:10px;"]],
                            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">height</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.drawableHeight}</span><input value="${contentData.height}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="contentData.height=Int(this.value);savePathComp.current();pg.$('#grid')[0].style.height=Int(this.value)+'px';pg.$('#drawable')[0].style.height=Int(this.value)+'px';let viewBox=pg.$('#resSvg')[0].getAttribute('viewBox').split(' ');viewBox[3]=Int(this.value);pg.$('#resSvg')[0].setAttribute('viewBox',viewBox.join(' '));contentData.pathInfo.forEach((i,index)=>{drawMap(index)})" type="number">`
                        }));
                        editor.appendChild(cE({
                            type: "div",
                            attr: [["class", "pg-prefEditor-drawableWidth"], ["style", "margin:10px;"]],
                            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);transform:rotate(90deg)">height</span><span style="width:100px;display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.drawableWidth}</span><input value="${contentData.width}" style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:80px;" oninput="contentData.width=Int(this.value);savePathComp.current();pg.$('#grid')[0].style.width=Int(this.value)+'px';pg.$('#drawable')[0].style.width=Int(this.value)+'px';let viewBox=pg.$('#resSvg')[0].getAttribute('viewBox').split(' ');viewBox[2]=Int(this.value);pg.$('#resSvg')[0].setAttribute('viewBox',viewBox.join(' '));contentData.pathInfo.forEach((i,index)=>{drawMap(index)})" type="number">`
                        }));
                        editor.appendChild(cE({
                            type: "div",
                            attr: [["class", "pg-prefEditor-primaryNameStyle"], ["style", "margin:10px;"]],
                            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">style</span><span style="display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.primaryNameStyle}</span><textarea style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:100%;height:100px;" oninput="contentData.primaryNameStyle=this.value;savePathComp.current();contentData.pathInfo.forEach((i,index)=>{drawMap(index)})">${contentData.primaryNameStyle}</textarea>`
                        }));
                        editor.appendChild(cE({
                            type: "div",
                            attr: [["class", "pg-prefEditor-secondaryNameStyle"], ["style", "margin:10px;"]],
                            innerHTML: `<span class="mi" style="vertical-align: middle;color:var(--grey);">style</span><span style="display:inline-block;color:var(--grey);font:14px/1 Anodina,sans-serif;margin:10px;">${strings.secondaryNameStyle}</span><textarea style="border:0;outline:none;border-bottom:1px solid var(--light);padding:5px;width:100%;height:100px;" oninput="contentData.secondaryNameStyle=this.value;savePathComp.current();contentData.pathInfo.forEach((i,index)=>{drawMap(index)})">${contentData.secondaryNameStyle}</textarea>`
                        }));
                        if (MediaQuery.screenWidth().includes("xlg"))
                            WindowManager.create((view) => {
                                pg.$("#scroll-use")[0].style.left = "320px";
                                pg.$("#scroll-use")[0].style.right = "0";
                                pg.$("#scroll-use")[0].style.width = "calc(100vw - 320px)";
                                view.appendChild(editor);
                            }, {
                                withMask: "none",
                                withBlur: "none",
                                size: "extraSmall",
                                mode: "vertical_split",
                                alignment: "vertical_center horizontal_left", onQuit: () => {
                                    pg.$("#scroll-use")[0].style.left = "unset";
                                    pg.$("#scroll-use")[0].style.right = "unset";
                                    pg.$("#scroll-use")[0].style.width = "unset";
                                },
                                title: strings.preference
                            });
                        else if (MediaQuery.screeHeight().includes("xlg"))
                            WindowManager.create((view) => {
                                pg.$("#scroll-use")[0].style.bottom = "320px";
                                pg.$("#scroll-use")[0].style.top = "0";
                                pg.$("#scroll-use")[0].style.height = "calc(100vh - 320px)";
                                view.appendChild(editor);
                            }, {
                                withMask: "none",
                                withBlur: "none",
                                size: "extraSmall",
                                mode: "horizontal_split",
                                alignment: "vertical_bottom horizontal_left", onQuit: () => {
                                    pg.$("#scroll-use")[0].style.bottom = "unset";
                                    pg.$("#scroll-use")[0].style.top = "unset";
                                    pg.$("#scroll-use")[0].style.height = "unset";
                                },
                                title: strings.preference
                            });
                        else
                            WindowManager.create((view) => {
                                // editor.appendChild();
                                view.appendChild(editor);
                            }, {size: "medium", title: strings.preference});
                    }], ["home", strings.home, strings.home, strings.backHomeDescription, () => {
                        NotificationManager.create(strings.fileSaved, 0, {
                            icon: "done",
                            icon_color: "#8BC34A"
                        });
                        [...pg.$("[windowid]")].forEach(e => {
                            WindowManager.remove(e.getAttribute("windowid"));
                        });
                        initInterface(0);
                    }], ["place", strings.station, strings.station, strings.editStationsInfo, () => {
                        StationEditorComp.showStationEditor();
                    }], ["all_inclusive", strings.path, strings.path, strings.editPathsInfo, () => {
                        LineEditorComp.showLineEditor();
                    }]].forEach((result) => {
                        let element = cE({
                            type: "div",
                            attr: [["class", "helper_list_item button"]],
                            innerHTML: "<span class='mi'>" + result[0] + "</span><span>" + result[1] + "</span>",
                            onclick: result[4]
                        });
                        list.appendChild(element);
                        HoverTips.create(element, result[2], result[3]);
                    });
                    document.body.appendChild(list);
                    e.stopPropagation();
                    window.addEventListener("click", () => {
                        try {
                            helper_list_display = false;
                            document.body.removeChild(pg.$(".helper_list")[0]);
                        } catch (e) {
                        }
                    }, {once: true});
                } else {
                    helper_list_display = false;
                    document.body.removeChild(pg.$(".helper_list")[0]);
                }
            }
        });

        HoverTips.create(toggle, strings.helper_more, strings.helper_moreDescription);

        view.appendChild(toggle);

        if (returnFunc)
            returnFunc();

        attachEvent.EditStation.attachClickEvent(pg.$("#drawable")[0]);
        attachEvent.EditStation.attachMoveEvent(pg.$("#drawable")[0], pg.$("#cursor")[0]);
    }


    ProgressManager.update(0, 0, 0);
    setTimeout(() => {
        ProgressManager.remove(0);
    }, 500);
}