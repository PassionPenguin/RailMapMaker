/*

    Package PassionPenguin/RailMapMaker


    Created by @Wongchito
    Co-authored-by @PassionPenguin
    Last upd by @PassionPenguin

 */

const exportDialog = (originalSvg) => {
    WindowManager.create((view, channelId) => {
        let svg = originalSvg.cloneNode(true);
        view.setAttribute("style", "position:relative;")
        let topView = cE({
            type: "div",
            attr: [["style", "height:calc(100% - 48px);width:100%;display:inline-flex;overflow:hidden;"]]
        })
        let preview = cE({
            type: "div",
            attr: [["style", "flex:1;width:calc(100% - 300px);overflow:scroll;"], ["id", "previewWindow"]]
        });
        svg.id = "exportSvg";
        svg.style.border = "1px solid transparent";
        svg.style.backgroundImage = "url(./assets/mipmap/opacity.png)";
        svg.style.backgroundSize = "50px";
        svg.style.backgroundRepeat = "repeat";
        preview.appendChild(svg);
        topView.appendChild(preview);
        let pref = cE({type: "div", attr: [["style", "width:300px;"]]});
        topView.appendChild(pref);
        view.appendChild(topView);
        pref.appendChild(cE({
            type: "p",
            attr: [["style", "margin:30px auto 20px auto;display:block;width:calc(100% - 40px);font:20px/1 Anodina,sans-serif"]],
            innerHTML: strings.exportPrefs
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 10px auto 0 auto;display:block;width:calc(100% - 40px);height: 28px;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.backgroundColor + "</div><div style='width:100px;display: inline-block'><pg-selector id='transparentBackground' on_valueChange='(e)=>{let svg=pg.$(\"#exportSvg\")[0];if(e===\"0\"){svg.style.background=\"transparent\";svg.style.backgroundImage=\"url(./assets/mipmap/opacity.png)\";svg.style.backgroundSize=\"50px\";svg.style.backgroundRepeat=\"repeat\";}else{svg.style.backgroundImage=\"\";svg.style.backgroundSize=\"\";svg.backgroundRepeat=\"\";if(e===\"1\"){svg.style.background = \"#fff\";}else{svg.style.background = \"#000\";}}}'><opt>" + strings.transparent + "</opt><opt>" + strings.white + "</opt><opt>" + strings.black + "</opt></pg-selector></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 10px auto 0 auto;display:block;width:calc(100% - 40px);height: 28px;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.scale + "</div><div style='width:100px;display: inline-block'><pg-selector id='scaleSize' on_valueChange='(e)=>{e=[\"100%\",\"25%\",\"50%\",\"75%\",\"125%\",\"150%\",\"175%\",\"200%\",\"300%\",\"400%\",\"500%\"][e];pg.$(\"#previewWindow\")[0].children[0].setAttribute(\"style\",\"width:\"+e+\";height:\"+e);state.scale=e;let viewBox=pg.$(\"#exportSvg\")[0].getAttribute(\"viewBox\").split(\" \");pg.$(\"#actuallyWidth\")[0].innerHTML=Int(viewBox[2])*(Int(e)/100);pg.$(\"#actuallyHeight\")[0].innerHTML=Int(viewBox[3])*(Int(e)/100);}'><opt>100%</opt><opt>25%</opt><opt>50%</opt><opt>75%</opt><opt>125%</opt><opt>150%</opt><opt>175%</opt><opt>200%</opt><opt>300%</opt><opt>400%</opt><opt>500%</opt></pg-selector></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 10px auto 0 auto;display:block;width:calc(100% - 40px);height: 28px;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.format + "</div><div style='width:100px;display: inline-block'><pg-selector id='formatSelector' on_valueChange='(e)=>{state.format=e}'><opt>RMG</opt><opt>PNG</opt><opt>JPEG</opt><opt>SVG</opt></pg-selector></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 20px auto 0 auto;display:block;width:calc(100% - 40px);vertical-align: middle;"]],
            innerHTML: "<div style='font:800 13px/18px Anodina,sans-serif;display: inline-block;vertical-align: middle;color:var(--grey)'>" + strings.jpgNotAlphaSupportNote + "</div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 20px auto 0 auto;display:block;width:calc(100% - 40px);vertical-align: middle;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.displayBorder + "</div><div style='width:100px;display: inline-block;height:28px;vertical-align: middle;'><pg-switchtoggle id='displayBorder' on_valueChange='(e)=>{e===\"true\"?pg.$(\"#exportSvg\")[0].style.borderColor=\"#000\":pg.$(\"#exportSvg\")[0].style.borderColor=\"transparent\"}'></pg-switchtoggle></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 20px auto 0 auto;display:block;width:calc(100% - 40px);vertical-align: middle;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.fileName + "</div><div style='width:100px;display: inline-block;height:28px;vertical-align: middle;'><input type='text' id='fileName' style='border:0;border-bottom:1px solid var(--light);background:var(--white);outline:none;width:100%;height:100%;font:14px/1 Anodina,sans-serif'></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 20px auto 0 auto;display:block;width:calc(100% - 40px);vertical-align: middle;"]],
            innerHTML: "<div style='font:800 13px/18px Anodina,sans-serif;display: inline-block;vertical-align: middle;color:var(--grey)'>" + strings.previewNote + "</div>"
        }));
        let viewBox = svg.getAttribute('viewBox').split(' ');
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 20px auto 0 auto;display:block;width:calc(100% - 40px);vertical-align: middle;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.actuallyWidth + "</div><div style='width:100px;display: inline-block;height:28px;vertical-align: middle;font:14px/1 Anodina,sans-serif;' id='actuallyWidth'>" + Int(viewBox[2]) + "</div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 20px auto 0 auto;display:block;width:calc(100% - 40px);vertical-align: middle;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.actuallyHeight + "</div><div style='width:100px;display: inline-block;height:28px;vertical-align: middle;font:14px/1 Anodina,sans-serif;' id='actuallyHeight'>" + Int(viewBox[3]) + "</div>"
        }));
        let bottomSelector = cE({
            type: "div",
            attr: [["style", "display:block;width:calc(100% - 40px);height:48px;position: fixed;bottom: 0;z-index: 1001;"]]
        });
        bottomSelector.appendChild(cE({
            type: "button",
            attr: [["class", "button"], ["style", "width:fit-content;float:right;display:inline-block;line-height:30px!important;color:var(--theme);"]],
            innerText: strings.export,
            onclick: () => {
                exportDrawable(svg)
            }
        }));
        bottomSelector.appendChild(cE({
            type: "button",
            attr: [["style", "border:none!important;width:fit-content;float:right;display:inline-block;line-height:30px!important;"], ["class", "button"]],
            innerText: strings.cancel, onclick: () => WindowManager.remove(channelId)
        }));
        view.appendChild(bottomSelector);
    }, {size: "medium", title: strings.exportAssets});
    PenguinUI_selector.init();
    PenguinUI_switchToggle.init();
};

const exportDrawable = (svgEl) => {
    let svg = svgEl.cloneNode(true);
    let format, scale, name;
    if (["0", "1", "2", "3"].indexOf(state.format) !== -1)
        format = ["RMG", "image/png", "image/jpeg", "SVG"][Int(state.format)];
    else format = "RMG";
    if (isNaN(Int(state.scale))) scale = 1;
    else {
        scale = Int(state.scale);
    }

    if (svg.style.backgroundImage !== "") {
        svg.style.backgroundImage = "";
        svg.style.backgroundSize = "";
        svg.style.backgroundRepeat = "";
    }

    if (pg.$("#fileName")[0].value === "")
        name = "rmg." + new Date().toLocaleString();
    else name = pg.$("#fileName")[0].value;

    if (format === "RMG")
        saveDrawableAs('data:image/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(contentData)))), name + ".rmg");
    else if (format === "SVG")
        saveDrawableAs('data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(new XMLSerializer().serializeToString(svg)))), name + ".svg");
    else {
        if (svg.style.background === "transparent" && format === "image/jpeg") {
            svg.style.background = "#fff";
        }

        let svgW = svg.viewBox.baseVal.width;
        let svgH = svg.viewBox.baseVal.height;

        svg.removeAttribute('height');

        let canvas = cE({type: "canvas"});
        document.body.appendChild(canvas);
        canvas.width = Number(svgW) * window.devicePixelRatio * scale;
        canvas.height = Number(svgH) * window.devicePixelRatio * scale;

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg.outerHTML)));
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            saveDrawableAs(canvas.toDataURL(format), name + (format === "image/png" ? ".png" : ".jpg"));
            document.body.removeChild(canvas);
        }
    }
};

const saveDrawableAs = (uri, filename) => {
    let link = document.createElement('a');

    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        //Firefox requires the link to be in the body
        document.body.appendChild(link);
        //simulate click
        link.click();
        //remove the link when done
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
};