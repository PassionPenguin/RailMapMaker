/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const WindowManager = {
    query: [],
    create: (returnFunc, opt) => {
        opt = opt || {};
        opt.mode = opt.mode || "default";
        opt.size = opt.size || "medium";
        opt.zIndex = opt.zIndex || "1000";
        opt.withMask = opt.withMask || "true";
        opt.withBlur = opt.withBlur || "true";
        opt.alignment = opt.alignment || "center";
        opt.backStyle = opt.backStyle || "default";
        opt.channelId = opt.channelId || WindowManager.query.length;
        opt.onQuit = opt.onQuit || (() => {
        });
        opt.title = opt.title || "Untitled Window";
        opt.withTitle = opt.withTitle || true;
        WindowManager.query.push(opt.channelId);
        let WindowFrame = cE({
            type: "div",
            attr: [["class", `pg-window ${opt.size} ${opt.mode} ${opt.alignment}`], ["style", `z-index: ${opt.zIndex}`], ["windowId", opt.channelId], ["onquit", opt.onQuit]]
        });
        let WindowMask;
        if (opt.withMask !== "none") WindowMask = cE({
            type: "div",
            attr: [["class", "pg-window pg-window-mask"], ["style", `z-index: ${Int(opt.zIndex) - 1};position:fixed;left:0;top:0;`], ["maskId", opt.channelId]],
            onclick: () => {
                WindowManager.remove(opt.channelId);
            }
        });
        let content = cE({type: "div", attr: [["class", "pg-window-content"]]});
        document.body.appendChild(WindowFrame);
        if (opt.withMask !== "none")
            document.body.appendChild(WindowMask);
        if (opt.withBlur !== "none")
            pg.$("#pg-app")[0].style.filter = "blur(10px)";
        WindowFrame.appendChild(content);
        let headbar = cE({type: "div", attr: [["class", "pg-window-topBar"]], innerHTML: "<div></div>"});
        content.appendChild(headbar);
        headbar.children[0].appendChild(cE({
            type: "span",
            attr: [["class", `pg-window-close ${opt.backStyle !== 'default' ? 'close' : ''}`], ["style", `z-index:${opt.zIndex + 1}`]],
            innerHTML: `${opt.backStyle === 'default' ? '<span class=\'mi\'>chevron_left</span><span>' + strings.back + '</span>' : '<span class="mi">close</span>'}`,
            onclick: () => {
                WindowManager.remove(opt.channelId);
                opt.onQuit();
            }
        }));
        if (opt.withTitle)
            headbar.children[0].appendChild(cE({
                type: "div",
                attr: [["class", `pg-window-title`]],
                innerHTML: opt.title
            }));
        else content.classList.add("withoutTitleBar");

        let innerContent = cE({type: "div", attr: [["class", "pg-window-innerContent"]]});
        content.appendChild(innerContent);

        returnFunc(innerContent, opt.channelId);
    }, remove: (channelId) => {
        pg.$(`[windowId='${channelId}']`)[0].classList.add("remove");
        setTimeout(() => {
            try {
                eval(pg.$(`[windowId='${channelId}']`)[0].getAttribute("onquit"))();
                document.body.removeChild(pg.$(`[maskId='${channelId}']`)[0]);
            } catch (e) {
            }
            document.body.removeChild(pg.$(`[windowId='${channelId}']`)[0]);
            pg.$("#pg-app")[0].style.filter = "";
        }, 500);
        WindowManager.query.filter(i => i !== channelId);
    }
};