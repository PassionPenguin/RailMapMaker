/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const ProgressManager = {
    query: [], // store the id of progresss
    create: (chanelId, curProgress, maxProgress) => {
        /*
        *
        * title: String, store the title display
        * msg: String, store the content display
        * chanelId: store the chanelId
        * curProgress: Int, default value: 0
        * maxProgress: Int, default value: 100
        *
        * */

        curProgress = ((curProgress === undefined) ? 0 : curProgress)
        maxProgress = ((maxProgress === undefined) ? 100 : maxProgress)

        let progress;
        if (ProgressManager.query.indexOf(chanelId) !== -1)
            progress = document.querySelectorAll("[progress=_id='" + chanelId + "']")[0]
        else {
            progress = cE({
                type: "div",
                attr: [["class", "pg-progress"], ["progress_id", chanelId]]
            });
            ProgressManager.query.push(chanelId);
        }

        if (maxProgress === 0)
            //infinity
            progress.appendChild(cE({
                type: "div",
                attr: [["class", "pg-progress-bar pg-progress-infinity"]]
            }));
        else
            progress.appendChild(cE({
                type: "div",
                attr: [["style", "width:" + ((curProgress / maxProgress) * 100) + "%"], ["class", "pg-progress-bar"]]
            }));

        document.body.appendChild(progress);

    }, update: (chanelId, curProgress, maxProgress) => {
        let progress = document.querySelectorAll("[progress_id='" + chanelId + "']")[0]
        if (maxProgress === 0) {
            progress.children[0].setAttribute("style", "");
            progress.children[0].classList.add("pg-progress-infinity");
        } else {
            progress.children[0].setAttribute("style", "width: " + (curProgress / maxProgress) * 100 + "%");
            progress.children[0].classList.remove("pg-progress-infinity");
        }
    }, remove: (chanelId) => {
        let progress = document.querySelectorAll("[progress_id='" + chanelId + "']")[0]
        progress.classList.add("remove");
        setTimeout(() => {
            try {
                document.body.removeChild(progress);
            } catch (exception) {
            }
        }, 1000)
        ProgressManager.query = ProgressManager.query.filter(i => i !== chanelId);
    }
};