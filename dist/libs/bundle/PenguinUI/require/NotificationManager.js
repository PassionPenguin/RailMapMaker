/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const NotificationManager = {
    query: [], // store the id of notifications
    create: (msg, chanelId, extra) => {
        /*
        *
        * title: String, store the title display
        * msg: String, store the content display
        * chanelId: store the chanelId
        * extra:
            * icon:
                * undefined, default value
                * url: String, with material-icons-name
            * iconColor:
                * HEX: String
        *
        * */

        let pref = {};
        if (extra !== undefined)
            pref = {
                icon: extra.icon !== undefined ? extra.icon : undefined,
                iconColor: extra.iconColor !== "var(--theme800)" ? extra.iconColor : "var(--theme800)"
            };
        let notification;
        if (NotificationManager.query.indexOf(chanelId) !== -1)
            notification = document.querySelectorAll("[notification_id='" + chanelId + "']")[0]
        else {
            notification = cE({
                type: "div",
                attr: [["class", ("pg-notification " + (pref.icon !== undefined ? " withIcon" : "") + ("priority_" + pref.priority))], ["notification_id", chanelId]]
            });
            NotificationManager.query.push(chanelId);
        }
        notification.innerHTML = "";
        document.body.appendChild(notification);

        if (pref.icon !== undefined)
            notification.appendChild(cE({
                type: 'div',
                attr: [["class", "pg-notification-icon mi"], ["style", `color:${pref.iconColor};`]],
                innerText: pref.icon
            }));

        notification.appendChild(cE({type: 'div', attr: [["class", "pg-notification-msg"]], innerHTML: msg}));

        setTimeout(() => {
            NotificationManager.remove(chanelId)
        }, 2000);

    }, remove: (channelId) => {
        let dismissNotification = () => {
            pg.$(`[notification_id=\"${channelId}\"]`)[0].classList.add("remove");
            setTimeout(() => {
                try {
                    document.body.removeChild(pg.$(`[notification_id=\"${channelId}\"]`)[0]);
                } catch (e) {
                    // may not be able to remove if it's dismissible
                }
            }, 1000);
            NotificationManager.query = NotificationManager.query.filter(i => i !== channelId);
        }
        setTimeout(dismissNotification, 2000);
    }
};