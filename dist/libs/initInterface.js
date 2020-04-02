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
                    let popup_storyboardFileListContent = cE({
                        type: "div",
                        attr: [["style", "position:relative;width:100%;height:100%;"]]
                    });
                    popup_storyboardFileListContent.appendChild(cE({
                        type: "div",
                        attr: [["class", "pg-storyboard-file-title"], ["style", "    width: fit-content;margin: 10px!important;font: 300 20px/1 Anodina,sans-serif;color: var(--dark);"]],
                        innerHTML: strings.recentFiles,
                    }));
                    JSONParser(LocaleStorageManager.get("fileList")).then(val => {
                        (val.length === 0) ? popup_storyboardFileListContent.appendChild(cE({
                            type: "span",
                            attr: [["style", "left:50%;top:50%;transform:translate(-50%,-50%);position:absolute;display:inline-block;font:24px/1 Anodina,sans-serif;color:var(--grey);"]],
                            innerHTML: strings.noFile
                        })) : val.forEach(e => {
                            JSONParser(LocaleStorageManager.get('fileData_' + e)).then(i => {
                                popup_storyboardFileListContent.appendChild(cE({
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
                    popup_storyboardFileList.appendChild(popup_storyboardFileListContent);
                    view.appendChild(popup_storyboardFileList);
                }, {size: "large"});
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>attachment</span><span> " + strings.importFile + " (*.rmg) </span>",
            onclick: () => {
                let file = cE({type: "input", attr: [[type, "file"], ["accept", ".rmg"]]});
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
                            time: -1,
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
                    "lastModified": new Date().getTime(),
                    "width": 4000,
                    "height": 4000,
                    "textStyle": "",
                    "primaryNameStyle": "font:18px/1 Anodina,sans-serif;",
                    "secondaryNameStyle": "font:11px/1 Anodina,sans-serif;color:var(--grey)",
                    "pathInfo": [
                        {
                            "lineCap": "round",
                            "lineJoin": "round",
                            "strokeWidth": "5px",
                            "color": "#f3d03e",
                            "id": 0,
                            "name": "Line 1",
                            "opacity": 1,
                            "stations": [
                                {
                                    "x": 2100,
                                    "y": 3025,
                                    "type": "destination",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "西塱",
                                            "Xilang"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2100,
                                    "y": 2900,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "坑口",
                                            "Kengkou"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2100,
                                    "y": 2775,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "花地湾",
                                            "Huadiwan"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2100,
                                    "y": 2650,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "芳村",
                                            "Fangcun"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2100,
                                    "y": 2525,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "黄沙",
                                            "Huangsha"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2100,
                                    "y": 2400,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "长寿路",
                                            "Changshou Lu"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2225,
                                    "y": 2275,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "陈家祠",
                                            "Chen Clan Academy"
                                        ],
                                        "position": 1,
                                        "alignment": "middle"
                                    }
                                },
                                {
                                    "x": 2350,
                                    "y": 2275,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "西门口",
                                            "Ximenkou"
                                        ],
                                        "position": 1,
                                        "alignment": "middle"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 2275,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "公园前",
                                            "Gongyuanqian"
                                        ],
                                        "position": 5,
                                        "alignment": "end"
                                    }
                                },
                                {
                                    "x": 2600,
                                    "y": 2275,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "农讲所",
                                            "Peasant's Movement Institute"
                                        ],
                                        "position": 1,
                                        "alignment": "middle"
                                    }
                                },
                                {
                                    "x": 2725,
                                    "y": 2275,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "烈士陵园",
                                            "Martyrs' Park"
                                        ],
                                        "position": 1,
                                        "alignment": "middle"
                                    }
                                },
                                {
                                    "x": 2850,
                                    "y": 2275,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "东山口",
                                            "Dongshankou"
                                        ],
                                        "position": 1,
                                        "alignment": "middle"
                                    }
                                },
                                {
                                    "x": 2975,
                                    "y": 2275,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "杨箕",
                                            "Yangji"
                                        ],
                                        "position": 1,
                                        "alignment": "middle"
                                    }
                                },
                                {
                                    "x": 3100,
                                    "y": 2275,
                                    "type": "common",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "体育西路",
                                            "Tiyu Xilu"
                                        ],
                                        "position": 1,
                                        "alignment": "middle"
                                    }
                                },
                                {
                                    "x": 3225,
                                    "y": 2150,
                                    "type": "common",
                                    "routeToNext": "3",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "体育中心",
                                            "Tianhe Sports Center"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 3100,
                                    "y": 2025,
                                    "type": "destination",
                                    "routeToNext": "2",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "广州东站",
                                            "Guangzhou East\nRailway Station"
                                        ],
                                        "position": 3,
                                        "alignment": "end"
                                    }
                                }
                            ]
                        },
                        {
                            "lineCap": "round",
                            "lineJoin": "round",
                            "strokeWidth": "5px",
                            "color": "#00629b",
                            "id": 0,
                            "name": "Line 2",
                            "opacity": 1,
                            "stations": [
                                {
                                    "x": 2225,
                                    "y": 3775,
                                    "type": "destination",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "广州南站",
                                            "Guangzhou South Railway Station"
                                        ],
                                        "position": 3,
                                        "alignment": "end"
                                    }
                                },
                                {
                                    "x": 2350,
                                    "y": 3650,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "石壁",
                                            "Shibi"
                                        ],
                                        "position": 0,
                                        "alignment": "middle"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 3525,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "会江",
                                            "Huijiang"
                                        ],
                                        "position": 0,
                                        "alignment": "end"
                                    }
                                },
                                {
                                    "x": 2600,
                                    "y": 3400,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "南浦",
                                            "Nanpu"
                                        ],
                                        "position": 3,
                                        "alignment": "end"
                                    }
                                },
                                {
                                    "x": 2600,
                                    "y": 3275,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "洛溪",
                                            "Luoxi"
                                        ],
                                        "position": 3,
                                        "alignment": "end"
                                    }
                                },
                                {
                                    "x": 2600,
                                    "y": 3150,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "南洲",
                                            "Nanzhou"
                                        ],
                                        "position": 3,
                                        "alignment": "end"
                                    }
                                },
                                {
                                    "x": 2600,
                                    "y": 3025,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "东晓南",
                                            "Dongxiaonan"
                                        ],
                                        "position": 3,
                                        "alignment": "end"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 2900,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "江泰路",
                                            "Jiangtai Lu"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 2775,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "昌岗",
                                            "Changgang"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 2650,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "江南西",
                                            "Jiangnanxi"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 2525,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "市二宫",
                                            "2nd Workers Cultural Palace"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 2400,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "海珠广场",
                                            "Haizhu Square"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 2150,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "纪念堂",
                                            "Sun Yat-sen Memorial Hall"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 2025,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "越秀公园",
                                            "Yuexiu Park"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 1900,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "广州火车站",
                                            "Guangzhou Railway Station"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 1775,
                                    "type": "common",
                                    "routeToNext": "0",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "三元里",
                                            "Sanyuanli"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 1650,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "飞翔公园",
                                            "Feixiang Park"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 1525,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "白云公园",
                                            "Baiyun Park"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 1400,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "白云文化广场",
                                            "Baiyun Culture Square"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2475,
                                    "y": 1275,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "萧岗",
                                            "Xiaogang"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2600,
                                    "y": 1150,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "江夏",
                                            "Jiangxia"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2725,
                                    "y": 1025,
                                    "type": "common",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "黄边",
                                            "Huangbian"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                },
                                {
                                    "x": 2850,
                                    "y": 900,
                                    "type": "destination",
                                    "routeToNext": "4",
                                    "text": {
                                        "type": "withSecondaryName",
                                        "name": [
                                            "嘉禾望岗",
                                            "Jiahewanggang"
                                        ],
                                        "position": 4,
                                        "alignment": "start"
                                    }
                                }
                            ]
                        }
                    ]
                }
                JSONParser(LocaleStorageManager.get("fileList")).then(i => {
                    i.push(JSON.parse(LocaleStorageManager.get("fileList")).length)
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
                    i.push(JSON.parse(LocaleStorageManager.get("fileList")).length)
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
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>settings</span><span> " + strings.preference + " </span>",
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
                        innerHTML: strings.preference
                    }));
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
                                let selector = cE({
                                    type: "pg-selector",
                                    attr: [["on_valueChange", "(e)=>{CookieManager.set('language',e);window.location.reload();}"], ["style", "    margin: 0 auto;display: block;width: 100px;text-align: center;"]]
                                });
                                e.appendChild(selector);
                                builder.locales.forEach((name, index) => {
                                    if (index === Int(CookieManager.get('language'))) selector.appendChild(cE({
                                        type: 'span',
                                        innerText: name
                                    }));
                                    selector.appendChild(cE({type: "opt", innerText: name}));
                                });
                                PenguinUI_selector.init();
                            });
                        }
                    }));
                });
            }
        }));
        storyboardCtrlList.appendChild(cE({
            type: "p",
            innerHTML: "<span class='mi'>memory</span><span> " + strings.debugInfo + " </span>",
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
                        innerHTML: strings.browserInfo
                    }));
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
                });
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
                    navigator.getInstalledRelatedApps()
                        .then((relatedApps) => {
                            relatedApps.forEach((app) => {
                                if (app.id !== "com.passionpenguin.railmapmaker" && builder.installable && installAppPrompt !== null)
                                    bottomSelector.appendChild(cE({
                                        type: "button",
                                        attr: [["class", "button"], ["style", "width:fit-content;float:right;display:inline-block;line-height:30px!important;color:var(--theme);"]],
                                        innerText: strings.install,
                                        onclick: () => {
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
                                    }));
                            });
                        });
                    bottomSelector.appendChild(cE({
                        type: "button",
                        attr: [["style", "border:none!important;width:fit-content;float:right;display:inline-block;line-height:30px!important;"], ["class", "button"]],
                        innerText: strings.cancel, onclick: () => {
                            WindowManager.remove(channelId)
                        }
                    }));
                    view.appendChild(bottomSelector);
                }, {size: "small"});
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
                        // prefDialog()
                    }], ["mouse", strings.select, strings.selectPath, strings.selectPathDescription, () => {
                        selectLineDialog();
                    }], ["home", strings.home, strings.home, strings.backHomeDescription, () => {
                        NotificationManager.create(strings.fileSaved, 0, {
                            icon: "done",
                            icon_color: "#8BC34A"
                        });
                        [...pg.$("[windowid]")].forEach(e => {
                            WindowManager.remove(e.getAttribute("windowid"));
                        })
                        initInterface(0);
                    }], ["build", strings.edit, strings.edit, strings.editPathsInfo, () => {
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

        HoverTips.create(toggle, strings.helper_more, strings.helper_moreDescription)

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