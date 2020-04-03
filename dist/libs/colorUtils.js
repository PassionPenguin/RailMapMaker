/*

    Package PassionPenguin/RailMapMaker


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const colorUtils = {
    RGBtoHSV: (rgb) => {
        let r = rgb.r, g = rgb.g, b = rgb.b;

        let max = Math.max(r, g, b), min = Math.min(r, g, b),
            d = max - min,
            h,
            s = (max === 0 ? 0 : d / max),
            v = max / 255;

        switch (max) {
            case min:
                h = 0;
                break;
            case r:
                h = (g - b) + d * (g < b ? 6 : 0);
                h /= 6 * d;
                break;
            case g:
                h = (b - r) + d * 2;
                h /= 6 * d;
                break;
            case b:
                h = (r - g) + d * 4;
                h /= 6 * d;
                break;
        }

        return {
            h: h,
            s: s,
            v: v
        };
    },
    HSVToRGB: (HSV) => {
        let r, g, b, i, f, p, q, t, h = HSV.h, s = HSV.s, v = HSV.v;
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v, g = t, b = p;
                break;
            case 1:
                r = q, g = v, b = p;
                break;
            case 2:
                r = p, g = v, b = t;
                break;
            case 3:
                r = p, g = q, b = v;
                break;
            case 4:
                r = t, g = p, b = v;
                break;
            case 5:
                r = v, g = p, b = q;
                break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    },
    HEXtoRGB: (hex) => {
        hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
        return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
    },
    HEXtoHSV: (hex) => {
        return colorUtils.RGBtoHSV(colorUtils.HEXtoRGB(hex));
    },
    RGBtoHEX: (rgb) => {
        let hex = [
            rgb.r.toString(16),
            rgb.g.toString(16),
            rgb.b.toString(16)
        ];
        hex.map(function (str, i) {
            if (str.length === 1) {
                hex[i] = '0' + str;
            }
        });

        return hex.join('');
    },
    getColor: (element, curValue, palette, returnFunc) => {
        let colorSelector = cE({type: "div", attr: [["class", "pg-color-selector"], ["style", "position:relative;"]]});
        element.appendChild(colorSelector);
        let brightnessAndSaturation = cE({
            type: "div",
            attr: [["style", "margin:0 auto;position: relative;width:320px;height:180px;background:#f00"]]
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
            attr: [["class", "pg-color-other"], ["style", "margin:0 auto;width:320px;height:120px;position:relative;font-size:0;"]]
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

        let palettesBox = cE({
            type: "div",
            attr: [["style", "width:320px;margin:0 auto;font-size:0;max-height:200px;overflow:hidden scroll;"]]
        });
        let palettes = cE({type: "div", attr: [["style", "vertical-align:middle;width:280px;display:inline-block;"]]});

        let selectPalette = cE({
            type: "div",
            attr: [["style", "width:320px;height:250px;position:absolute;bottom:0;left:50%;transform:translate(-50%);background:var(--white);visibility:hidden;opacity:0;transition:500ms;overflow-y:scroll;"]]
        });
        let selectPaletteToggle = cE({
            type: "div",
            attr: [["style", "width:40px;display:inline-block;vertical-align:top;"]],
            innerHTML: "<span class='mi button' style='text-align:center;color:var(--dark);font:900 18px/36px \"Material Icons\",sans-serif;'>unfold_more</span>",
            onclick: () => {
                selectPalette.style.opacity = "1";
                selectPalette.style.visibility = "visible";
            }
        });

        palettesBox.appendChild(palettes);
        palettesBox.appendChild(selectPaletteToggle);
        colorSelector.appendChild(palettesBox);
        colorSelector.appendChild(selectPalette);
        let paletteContainer = cE({type: "div", attr: [["style", "font-size:0;"]]});
        palettes.appendChild(paletteContainer);
        colorPalette[0].colors.forEach(color => {
            let colorBlock = cE({
                type: "div",
                attr: [["style", `background:${color[0]};width:18px;height:18px;border-radius:4px;display:inline-block;margin:5px;`]],
                onclick: () => {
                    let HSV = colorUtils.HEXtoHSV(color[0]);
                    HueCursor.style.left = (HSV.h * 240 + 7.5) + "px";
                    const rgb = colorUtils.HSVToRGB({
                            h: HSV.h, s: 1, v: 1
                        }
                    );
                    brightnessAndSaturation.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
                    BaSCursor.style.left = (HSV.s * 320 + 5) + "px";
                    BaSCursor.style.top = (185 - HSV.v * 180) + "px";
                    resultColor.style.backgroundColor = color[0];
                    input.value = color[0];
                }
            });
            paletteContainer.appendChild(colorBlock);
            let hover = null, bcr = colorBlock.getBoundingClientRect();
            colorBlock.onmouseenter = () => {
                hover = cE({
                    type: "div",
                    attr: [["style", `position:fixed;left:${bcr.x + 9}px;top:${bcr.y - 18}px;transform:translate(-50%,-50%);width:fit-content;padding:10px 20px;background:var(--white);border-radius:5px;z-index:${Int(getStyle(element, "zIndex")) + 1};box-shadow:rgba(0, 0, 0, 0.1) 0 0 6px, rgba(0, 0, 0, 0.05) 0 1px 6px;font: 800 14px/1 Anodina,sans-serif;`]],
                    innerText: color[1]
                });
                document.body.appendChild(hover);
            };
            colorBlock.onmouseleave = () => {
                document.body.removeChild(hover);
            };
        });

        colorPalette.forEach((colors, index) => {
            let colorsPreview = "";
            [0, 1, 2, 3, 4, 5].forEach(i => {
                colorsPreview += `<div style="background:${colors.colors[i][0]};width:18px;height:18px;border-radius:4px;display:inline-block;margin:5px;vertical-align:middle;"></div>`
            });
            selectPalette.appendChild(cE({
                type: "div",
                attr: [["style", "padding:5px;width:calc(100% - 20px)"], ["class", "button"]],
                innerHTML: `<span style="font:900 16px/28px Anodina, sans-serif;margin-right:20px;color:var(--grey);width:100px;text-overflow:ellipsis;overflow: hidden;white-space:nowrap;vertical-align:middle;display:inline-block;">${colors.name}</span>${colorsPreview}`,
                onclick: () => {
                    palettes.innerHTML = "";
                    selectPalette.style.opacity = "0";
                    selectPalette.style.visibility = "hidden";
                    let paletteContainer = cE({type: "div", attr: [["style", "font-size:0;"]]});
                    palettes.appendChild(paletteContainer);
                    colorPalette[index].colors.forEach(color => {
                        let colorBlock = cE({
                            type: "div",
                            attr: [["style", `background:${color[0]};width:18px;height:18px;border-radius:4px;display:inline-block;margin:5px;`]],
                            onclick: () => {
                                let HSV = colorUtils.HEXtoHSV(color[0]);
                                HueCursor.style.left = (HSV.h * 240 + 7.5) + "px";
                                const rgb = colorUtils.HSVToRGB({
                                        h: HSV.h, s: 1, v: 1
                                    }
                                );
                                brightnessAndSaturation.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
                                BaSCursor.style.left = (HSV.s * 320 + 5) + "px";
                                BaSCursor.style.top = (185 - HSV.v * 180) + "px";
                                resultColor.style.backgroundColor = color[0];
                                input.value = color[0];
                            }
                        });
                        paletteContainer.appendChild(colorBlock);
                        let hover = null, bcr = colorBlock.getBoundingClientRect();
                        colorBlock.onmouseenter = () => {
                            hover = cE({
                                type: "div",
                                attr: [["style", `position:fixed;left:${bcr.x + 9}px;top:${bcr.y - 18}px;transform:translate(-50%,-50%);width:fit-content;padding:10px 20px;background:var(--white);border-radius:5px;z-index:${Int(getStyle(element, "zIndex")) + 1};box-shadow:rgba(0, 0, 0, 0.1) 0 0 6px, rgba(0, 0, 0, 0.05) 0 1px 6px;font: 800 14px/1 Anodina,sans-serif;`]],
                                innerText: color[1]
                            });
                            document.body.appendChild(hover);
                        };
                        colorBlock.onmouseleave = () => {
                            document.body.removeChild(hover);
                        };
                    });
                }
            }));
        });

        let inputArea = cE({
            type: "div",
            attr: [["style", "margin:0 auto;width:320px;font-size:0;height:44px;vertical-align:middle;"]]
        });
        let input = cE({
            type: "input",
            attr: [["style", "outline:none;padding:5px;display:inline-block;width:240px;font-size:14px;vertical-align:middle;"], ["class", "button"], ["id", "inputValue"], ["placeholder", "#000000"]]
        });
        let submit = cE({
            type: "button",
            attr: [["class", "button"], ["style", "display:inline-block;width:50px;font-size:18px;height:50px;vertical-align:middle;"]],
            innerHTML: "<span class='mi'>done</span>",
            onclick: (e) => {
                console.log(input.value);
                writer(colorUtils.HEXtoHSV(input.value));
            }
        });
        inputArea.appendChild(input);
        inputArea.appendChild(submit);
        colorSelector.appendChild(inputArea);
        let bottomSelector = cE({
            type: "div",
            attr: [["style", "display:block;width:calc(100% - 40px);height:48px;position: fixed;bottom: 0;z-index: 1001;"]]
        });
        bottomSelector.appendChild(cE({
            type: "button",
            attr: [["class", "button"], ["style", "width:fit-content;float:right;display:inline-block;line-height:30px!important;color:var(--theme);"]],
            innerText: strings.confirm,
            onclick: () => {
                const hue = (parseFloat(HueCursor.style.left) - 7.5) / 240;
                const saturation = (parseFloat(BaSCursor.style.left) - 5) / 320;
                const brightness = (180 - (parseFloat(BaSCursor.style.top) - 5)) / 180;
                const rgb = colorUtils.HSVToRGB({
                        h: hue, s: saturation, v: brightness
                    }
                );
                returnFunc("#" + colorUtils.RGBtoHEX(rgb));
            }
        }));
        colorSelector.appendChild(bottomSelector);


        brightnessAndSaturation.onclick = (event) => {
            if (event.offsetX > 320 || event.offsetX < 0 || event.offsetY > 180 || event.offsetY < 0) return;
            BaSHandler(event);
        }
        brightnessAndSaturation.onmousedown = (mouseDownEvent) => {
            if (mouseDownEvent.offsetX > 320 || mouseDownEvent.offsetX < 0 || mouseDownEvent.offsetY > 180 || mouseDownEvent.offsetY < 0) return;
            BaSHandler(mouseDownEvent);
            brightnessAndSaturation.onmousemove = (mouseOverEvent) => {
                if (mouseOverEvent.offsetX > 320 || mouseOverEvent.offsetX < 0 || mouseOverEvent.offsetY > 180 || mouseOverEvent.offsetY < 0) return;
                BaSHandler(mouseOverEvent);
            };
            brightnessAndSaturation.onmouseup = brightnessAndSaturation.onmouseleave = () => {
                brightnessAndSaturation.onmousemove = () => {
                }
            };
        }
        HueSelector.onclick = (event) => {
            if (event.target !== HueSelector) return;
            if (event.offsetX > 240 || event.offsetX < 0) return;
            HueHandler(event);
        }
        HueSelector.onmousedown = (mouseDownEvent) => {
            if (mouseDownEvent.target !== HueSelector) return;
            if (mouseDownEvent.offsetX > 240 || mouseDownEvent.offsetX < 0) return;
            HueHandler(mouseDownEvent);
            HueSelector.onmousemove = (mouseOverEvent) => {
                if (mouseOverEvent.target !== HueSelector) return;
                if (mouseOverEvent.offsetX > 240 || mouseOverEvent.offsetX < 0) return;
                HueHandler(mouseOverEvent);
            };
            HueSelector.onmouseup = HueSelector.onmouseleave = () => {
                HueSelector.onmousemove = () => {
                }
            };
        }
        AlphaSelector.onclick = (event) => {
            if (event.target !== AlphaSelector) return;
            if (event.offsetX > 240 || event.offsetX < 0) return;
            AlphaHandler(event);
        }
        AlphaSelector.onmousedown = (mouseDownEvent) => {
            if (mouseDownEvent.target !== AlphaSelector) return;
            if (mouseDownEvent.offsetX > 240 || mouseDownEvent.offsetX < 0) return;
            AlphaHandler(mouseDownEvent);
            AlphaSelector.onmousemove = (mouseOverEvent) => {
                if (mouseOverEvent.target !== AlphaSelector) return;
                if (mouseOverEvent.offsetX > 240 || mouseOverEvent.offsetX < 0) return;
                AlphaHandler(mouseOverEvent);
                console.log(mouseOverEvent.offsetX, mouseOverEvent.offsetY, mouseOverEvent.target);
            };
            AlphaSelector.onmouseup = AlphaSelector.onmouseleave = () => {
                AlphaSelector.onmousemove = () => {
                }
            };
        }

        const BaSHandler = (e) => {
            let event = {};
            if (e.offsetX >= 320) event.offsetX = 320;
            else if (e.offsetX < 10) event.offsetX = 10;
            else event.offsetX = e.offsetX;
            if (e.offsetY >= 180) event.offsetY = 180;
            else if (e.offsetY < 10) event.offsetY = 10;
            else event.offsetY = e.offsetY;
            BaSCursor.style.left = event.offsetX + "px";
            BaSCursor.style.top = event.offsetY + "px";
            render();
        };

        const HueHandler = (e) => {
            let event = {};
            if (e.offsetX - 240 >= 0) event.offsetX = 240;
            else if (e.offsetX < 0) event.offsetX = 0;
            else event.offsetX = e.offsetX + 7.5;
            HueCursor.style.left = event.offsetX + "px";
            const rgb = colorUtils.HSVToRGB({
                    h: (parseFloat(HueCursor.style.left) - 7.5) / 240, s: 1, v: 1
                }
            );
            brightnessAndSaturation.style.backgroundColor = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
            render();
        };

        const AlphaHandler = (e) => {
            let event = {};
            if (e.offsetX - 240 >= 0) event.offsetX = 240;
            else if (e.offsetX < 0) event.offsetX = 0;
            else event.offsetX = e.offsetX + 7.5;
            AlphaCursor.style.left = event.offsetX + "px";
            render();
        };

        const render = () => {
            const hue = (parseFloat(HueCursor.style.left) - 7.5) / 240;
            const saturation = (parseFloat(BaSCursor.style.left) - 5) / 320;
            const brightness = (180 - (parseFloat(BaSCursor.style.top) - 5)) / 180;
            const alpha = (parseFloat(AlphaCursor.style.left) - 7.5) / 240;
            const rgb = colorUtils.HSVToRGB({
                    h: hue, s: saturation, v: brightness
                }
            );
            resultColor.style.backgroundColor = `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
            input.value = "#" + colorUtils.RGBtoHEX(rgb);
        };

        const writer = (HSV) => {
            const bgRgb = colorUtils.HSVToRGB({
                    h: HSV.h, s: 1, v: 1
                }
            );
            const rgb = colorUtils.HSVToRGB({
                    h: HSV.h, s: HSV.s, v: HSV.v
                }
            );
            brightnessAndSaturation.style.backgroundColor = `rgb(${bgRgb.r},${bgRgb.g},${bgRgb.b})`;
            HueCursor.style.left = (HSV.h * 240 + 7.5) + "px";
            BaSCursor.style.left = (HSV.s * 320 + 5) + "px";
            BaSCursor.style.top = (185 - HSV.v * 180) + "px";
            resultColor.style.backgroundColor = `rgba(${rgb.r},${rgb.g},${rgb.b},1)`;
            input.value = "#" + colorUtils.RGBtoHEX(rgb);
        }
    }
};