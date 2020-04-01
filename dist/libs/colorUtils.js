/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const colorUtils = {
    RGBtoHSB: (rgb) => {
        let hsb = {h: 0, s: 0, b: 0};
        let min = Math.min(rgb.r, rgb.g, rgb.b);
        let max = Math.max(rgb.r, rgb.g, rgb.b);
        let delta = max - min;
        hsb.b = max;
        hsb.s = max !== 0 ? 255 * delta / max : 0;
        if (hsb.s !== 0) {
            if (rgb.r === max) hsb.h = (rgb.g - rgb.b) / delta;
            else if (rgb.g === max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
            else hsb.h = 4 + (rgb.r - rgb.g) / delta;
        } else hsb.h = -1;
        hsb.h *= 60;
        if (hsb.h < 0) hsb.h += 360;
        hsb.s *= 100 / 255;
        hsb.b *= 100 / 255;
        return hsb;
    },
    HSBToRGB: (hsb) => {
        let rgb = {};
        let h = Math.round(hsb.h);
        let s = Math.round(hsb.s * 255 / 100);
        let v = Math.round(hsb.b * 255 / 100);

        if (s === 0) {
            rgb.r = rgb.g = rgb.b = v;
        } else {
            let t1 = v;
            let t2 = (255 - s) * v / 255;
            let t3 = (t1 - t2) * (h % 60) / 60;

            if (h === 360) h = 0;

            if (h < 60) {
                rgb.r = t1;
                rgb.b = t2;
                rgb.g = t2 + t3
            } else if (h < 120) {
                rgb.g = t1;
                rgb.b = t2;
                rgb.r = t1 - t3
            } else if (h < 180) {
                rgb.g = t1;
                rgb.r = t2;
                rgb.b = t2 + t3
            } else if (h < 240) {
                rgb.b = t1;
                rgb.r = t2;
                rgb.g = t1 - t3
            } else if (h < 300) {
                rgb.b = t1;
                rgb.g = t2;
                rgb.r = t2 + t3
            } else if (h < 360) {
                rgb.r = t1;
                rgb.g = t2;
                rgb.b = t1 - t3
            } else {
                rgb.r = 0;
                rgb.g = 0;
                rgb.b = 0
            }
        }

        return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)};
    },
    getColor: (element, curValue, returnFunc) => {
        let colorSelector = cE({type: "div", attr: [["class", "pg-color-selector"]]});
        let brightnessAndSaturation = cE({
            type: "div",
            attr: [["style", "position: relative;width:320px;height:180px;background:#f00"]]
        });
        let brightness = cE({
            type: "div",
            attr: [["style", "width:320px;height:180px;background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));background: -webkit-linear-gradient(to right, #fff, rgba(255, 255, 255, 0));"]]
        });
        brightnessAndSaturation.appendChild(brightness);
        brightness.appendChild(cE({
            type: "div",
            attr: [["style", "width:320px;height:180px;background: -webkit-linear-gradient(to top, #000, rgba(0, 0, 0, 0));background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));position:absolute;overflow:hidden;"]]
        }));
        let BaSCursor = cE({
            type: "div",
            attr: [["style", "width: 5px;height: 5px;border-radius: 50%;border: 2.5px solid #fff;position: absolute;transform: translate(-100%, -100%);"]]
        });
        brightness.appendChild(BaSCursor);
        colorSelector.appendChild(brightnessAndSaturation);

        let otherArea = cE({
            type: "div",
            attr: [["class", "pg-color-other"], ["style", "width:320px;height:120px;position:relative;font-size:0;"]]
        });
        let resultColor = cE({
            type: "div",
            attr: [["style", "width:40px;height:40px;top:25px;left:20px;position:absolute;border-radius:50%;border-radius:5px;border:1px solid var(--light)"]]
        });
        otherArea.appendChild(resultColor);

        let hueAndAlpha = cE({
            type: "div",
            attr: [["style", "position:absolute;right:0;top:20px;height:80px;"]]
        });
        let HueSelector = cE({
            type: "div",
            attr: [["style", "width: 240px;height: 20px;background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);background: -webkit-linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);position:relative;overflow:hidden;"]]
        })
        let HueCursor = cE({
            type: "div",
            attr: [["style", "width: 10px;height: 10px;border-radius: 50%;border: 2.5px solid #000;position: absolute;transform: translate(-100%, -50%);top:50%;left:7.5px"]]
        });
        HueSelector.appendChild(HueCursor);
        hueAndAlpha.appendChild(HueSelector);
        let AlphaSelector = cE({
            type: "div",
            attr: [["style", "margin-top:10px;width: 240px;height: 20px;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAAgCAYAAABkS8DlAAAACXBIWXMAABefAAAXnwFLnDNSAAAC20lEQVR4nO3dyXLaQBSF4YsQIEEWNnPe/7XicnZmNo6rQMyptpENFJJa3YtU6v7fEkQfqSXg7G7l19PTSe6oSOXey1fiZiw/h8PC47IkSSIvo9HVu5VKca6czy+KIxn0+875m81GxuNJuqBd7sX5RVEkvW7XK386m5XOTTUaDel2Ou75260s5ouC4Oy3TH778dE53xhPJl6f97n/xu3+2z5/KZ/9N+aLz/23Tr05P9/9Xy6X9gffZIdhKD9aLefs/X4vq9WqdO5lfjOOnfMPh4Os1uuc2Py7Uq1WJY4ir/xksymd+5UfBB/fQVfH4/HjN+Ar13Kd9PyCIJBareacfzqdZLvblc695JMv52fQJTdlngEf5h645JY5Jk/g9WkAAPBfogAAAKAQBQAAAIUoAAAAKEQBAABAIQoAAAAKUQAAAFCIAgAAgEIUAAAAFKIAAACgEAUAAACFKAAAAChEAQAAQCEKAAAACoXNuJl/1QXjYKHb9mKcqAszzjNvpGXRsMs033Us5u040bLr7Ha7/AMK1is7zvR2tZ3FONM81TDMzrIYh+vDrH+1Rsm9N+NwoZsZKez7DPr41/m+KifPK3h+/m134J3rjONYhoOBc3aSJN/z/LNiczY4iiPp93rO+Wae/2Q6vZ9rMeXa5PvO8585zrM351dv1KXTbjvnGy+jUbncm+MeHx6kXq8752ftf1FuqtftOmcbs/ncKTflu/+L11en3JTZfx/Ltzfn7LBalVar5ZX/5/39O9f2Q+fzM/nmN8iVmee/TpLSuSlTYKIo8sq3KuAZ98PM8294fPfMLPvcAlzwHJj8Wk4BtXE33/o38LPE+vwJm3tQ1mVe4Fliy/x937tOKjQAAApRAAAAUIgCAACAQhQAAAAUogAAAKAQBQAAAIUoAAAAKEQBAABAIQoAAAAKUQAAAFCIAgAAgEIUAAAAFKIAAACgEAUAAACFKAAAAGgjIn8Bh3Wkkk3r1joAAAAASUVORK5CYII=');background-size:325px;position:relative;overflow:hidden;"]]
        })
        let AlphaCursor = cE({
            type: "div",
            attr: [["style", "width: 10px;height: 10px;border-radius: 50%;border: 2.5px solid #000;position: absolute;transform: translate(-100%, -50%);top:50%;left:247.5px"]]
        });
        AlphaSelector.appendChild(AlphaCursor);
        hueAndAlpha.appendChild(AlphaSelector);
        otherArea.appendChild(hueAndAlpha);

        colorSelector.appendChild(otherArea);


        brightnessAndSaturation.onclick = (event) => {
            if (event.clientX > 320 || event.clientX < 0 || event.clientY > 180 || event.clientY < 0) return;
            BaSHandler(event);
        }
        brightnessAndSaturation.onmousedown = (mouseDownEvent) => {
            if (mouseDownEvent.clientX > 320 || mouseDownEvent.clientX < 0 || mouseDownEvent.clientY > 180 || mouseDownEvent.clientY < 0) return;
            BaSHandler(mouseDownEvent);
            brightnessAndSaturation.onmousemove = (mouseOverEvent) => {
                if (mouseOverEvent.clientX > 320 || mouseOverEvent.clientX < 0 || mouseOverEvent.clientY > 180 || mouseOverEvent.clientY < 0) return;
                BaSHandler(mouseOverEvent);
            };
            brightnessAndSaturation.onmouseup = brightnessAndSaturation.onmouseleave = () => {
                brightnessAndSaturation.onmousemove = () => {
                }
            };
        }
        HueSelector.onclick = (event) => {
            if (event.clientX > 322.5 || event.clientX < 82.5) return;
            HueHandler(event);
        }
        HueSelector.onmousedown = (mouseDownEvent) => {
            if (mouseDownEvent.clientX > 322.5 || mouseDownEvent.clientX < 82.5) return;
            HueHandler(mouseDownEvent);
            HueSelector.onmousemove = (mouseOverEvent) => {
                if (mouseOverEvent.clientX > 322.5 || mouseOverEvent.clientX < 82.5) return;
                HueHandler(mouseOverEvent);
            };
            HueSelector.onmouseup = HueSelector.onmouseleave = () => {
                HueSelector.onmousemove = () => {
                }
            };
        }
        AlphaSelector.onclick = (event) => {
            if (event.clientX > 322.5 || event.clientX < 82.5) return;
            AlphaHandler(event);
        }
        AlphaSelector.onmousedown = (mouseDownEvent) => {
            if (mouseDownEvent.clientX > 322.5 || mouseDownEvent.clientX < 82.5) return;
            AlphaHandler(mouseDownEvent);
            AlphaSelector.onmousemove = (mouseOverEvent) => {
                if (mouseOverEvent.clientX > 322.5 || mouseOverEvent.clientX < 82.5) return;
                AlphaHandler(mouseOverEvent);
            };
            AlphaSelector.onmouseup = AlphaSelector.onmouseleave = () => {
                AlphaSelector.onmousemove = () => {
                }
            };
        }

        const BaSHandler = (e) => {
            let event = {};
            if (e.clientX - 5 >= 320) event.clientX = 320;
            else if (e.clientY - 5 < 0) event.clientY = 0;
            else event.clientX = e.clientX + 5;
            if (e.clientY - 5 >= 180) event.clientX = 180;
            else if (e.clientY - 5 < 0) event.clientY = 0;
            else event.clientY = e.clientY + 5;
            BaSCursor.style.left = event.clientX + "px";
            BaSCursor.style.top = event.clientY + "px";
            render();
        };

        const HueHandler = (e) => {
            let event = {};
            if (e.clientX - 340 >= 0) event.clientX = 332.5;
            else if (e.clientX - 90 < 0) event.clientX = 90;
            else event.clientX = e.clientX + 7.5;
            HueCursor.style.left = (event.clientX - 82.5) + "px";
            const rgb = colorUtils.HSBToRGB({
                    h: (parseFloat(HueCursor.style.left) - 7.5) / 240 * 360, s: 100, b: 100
                }
            );
            brightnessAndSaturation.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
            render();
        };

        const AlphaHandler = (e) => {
            let event = {};
            if (e.clientX - 340 >= 0) event.clientX = 332.5;
            else if (e.clientX - 90 < 0) event.clientX = 90;
            else event.clientX = e.clientX + 7.5;
            AlphaCursor.style.left = (event.clientX - 82.5) + "px";
            render();
        };

        const render = () => {
            const hue = (parseFloat(HueCursor.style.left) - 7.5) / 240 * 360;
            const saturation = (parseFloat(BaSCursor.style.left) - 5) / 320 * 100;
            const brightness = (180 - (parseFloat(BaSCursor.style.top) - 5)) / 180 * 100;
            const alpha = (parseFloat(AlphaCursor.style.left) - 7.5) / 240;
            const rgb = colorUtils.HSBToRGB({
                    h: hue, s: saturation, b: brightness
                }
            );
            resultColor.style.backgroundColor = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
        };

        element.appendChild(colorSelector);

    }
};