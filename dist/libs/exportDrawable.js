/*

    Package PassionPenguin/RailMapMaker


    Created by @Wongchito
    Co-authored-by @PassionPenguin
    Last upd by @PassionPenguin

 */

const exportDialog = (svg, path) => {
    WindowManager.create((view) => {
        view.setAttribute("style", "position:relative;")
        let topView = cE({
            type: "div",
            attr: [["style", "height:calc(100% - 48px);width:100%;display:inline-flex;overflow:hidden;"]]
        })
        let preview = cE({
            type: "div",
            attr: [["style", "flex:1;width:calc(100% - 300px);overflow:scroll;background:url(./assets/mipmap/opacity.png) repeat;background-size: 50px;border: 1px solid;"], ["id", "previewWindow"]]
        });
        svg.id = "exportSvg";
        preview.appendChild(svg);
        topView.appendChild(preview);
        let pref = cE({type: "div", attr: [["style", "width:300px;"]]});
        pref.appendChild(cE({
            type: "p",
            attr: [["style", "margin:30px auto 20px auto;display:block;width:calc(100% - 40px);font:20px/1 Anodina,sans-serif"]],
            innerHTML: strings.exportPrefs
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 10px auto 0 auto;display:block;width:calc(100% - 40px);height: 28px;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.backgroundColor + "</div><div style='width:100px;display: inline-block'><pg-selector id='transparentBackground' on_valueChange='(e)=>{switch (e) {case \"0\":pg.$(\"#previewWindow\")[0].style.background = \"url(./assets/mipmap/opacity.png) repeat\";break;case \"1\":pg.$(\"#previewWindow\")[0].style.background = \"#fff\";break;case \"2\":pg.$(\"#previewWindow\")[0].style.background = \"#000\";break;}}'><opt>" + strings.transparent + "</opt><opt>" + strings.white + "</opt><opt>" + strings.black + "</opt></pg-selector></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 10px auto 0 auto;display:block;width:calc(100% - 40px);height: 28px;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.scale + "</div><div style='width:100px;display: inline-block'><pg-selector id='transparentBackground' on_valueChange='(e)=>{pg.$(\"#previewWindow\")[0].style.transform=\"scale(e)\";state.scale=e;}'><opt>25%</opt><opt>50%</opt><opt>75%</opt><opt>100%</opt><opt>125%</opt><opt>150%</opt><opt>175%</opt><opt>200%</opt><opt>300%</opt><opt>400%</opt><opt>500%</opt></pg-selector></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 10px auto 0 auto;display:block;width:calc(100% - 40px);height: 28px;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.format + "</div><div style='width:100px;display: inline-block'><pg-selector id='transparentBackground' on_valueChange='(e)=>{state.format=e}'><opt>RMG</opt><opt>PNG</opt><opt>JPEG</opt><opt>SVG</opt></pg-selector></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 20px auto 0 auto;display:block;width:calc(100% - 40px);vertical-align: middle;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.displayBorder + "</div><div style='width:100px;display: inline-block;height:28px;vertical-align: middle;'><pg-switchtoggle id='displayBorder' on_valueChange='(e)=>{e===\"true\"?pg.$(\"#previewWindow\")[0].style.borderColor=\"#000\":pg.$(\"#previewWindow\")[0].style.borderColor=\"transparent\"}'></pg-switchtoggle></div>"
        }));
        pref.appendChild(cE({
            type: "div",
            attr: [["style", "margin: 20px auto 0 auto;display:block;width:calc(100% - 40px);vertical-align: middle;"]],
            innerHTML: "<div style='width:calc(100% - 100px);display: inline-block;font:800 14px/1 Anodina,sans-serif;color:var(--grey);'>" + strings.fileName + "</div><div style='width:100px;display: inline-block;height:28px;vertical-align: middle;'><input type='text' id='fileName' style='border:0;border-bottom:1px solid var(--light);background:var(--white);outline:none;width:100%;height:100%;font:14px/1 Anodina,sans-serif'></div>"
        }));
        topView.appendChild(pref);
        view.appendChild(topView);
        let bottomSelector = cE({
            type: "div",
            attr: [["style", "display:block;width:100%;height:48px;position: fixed;bottom: 0;z-index: 1001;"]]
        });
        bottomSelector.appendChild(cE({
            type: "button",
            attr: [["class", "button"], ["style", "width:fit-content;float:right;display:inline-block;line-height:30px!important;"]],
            innerText: strings.export,
            onclick: () => {
                exportDrawable(svg)
            }
        }));
        bottomSelector.appendChild(cE({
            type: "button",
            attr: [["style", "color:var(--theme);border:none!important;width:fit-content;float:right;display:inline-block;line-height:30px!important;"], ["class", "button"]],
            innerText: strings.cancel
        }));
        view.appendChild(bottomSelector);
    });
    PenguinUI_selector.init();
    PenguinUI_switchToggle.init();
};

const exportDrawable = (svgEl) => {
    let format, scale, name;
    if (["0", "1", "2", "3"].indexOf(state.format) !== -1) {
        format = ["RMG", "image/png", "image/jpg", "SVG"][Int(state.format)];
        state.format = "";
    } else format = "image/png";
    if (isNaN(Int(state.scale))) scale = 1;
    else {
        scale = Int(state.scale);
        state.scale = 1
    }

    if (pg.$("#fileName")[0].value === "")
        name = "rmg." + new Date().toLocaleString();
    else name = pg.$("#fileName")[0].value;

    console.log(format, name, scale);

    if (format === "RMG")
        saveDrawableAs(btoa(JSON.stringify(pathInfo)), name + ".rmg");
    else if (format === "SVG")
        saveDrawableAs(btoa(new XMLSerializer().serializeToString(svgEl)), name + ".svg");
    else {
        let svgW = svgEl.viewBox.baseVal.width;
        let svgH = svgEl.viewBox.baseVal.height;

        svgEl.removeAttribute('height');

        let canvas = cE({type: "canvas"});
        document.body.appendChild(canvas);
        canvas.width = Number(svgW) * window.devicePixelRatio * scale;
        canvas.height = Number(svgH) * window.devicePixelRatio * scale;

        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let img = new Image();
        console.log("", img, "onload");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        saveDrawableAs(canvas.toDataURL(format), name + (format === "image/png" ? ".png" : ".jpg"));
        document.body.removeChild(canvas);
    }
}

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
}
