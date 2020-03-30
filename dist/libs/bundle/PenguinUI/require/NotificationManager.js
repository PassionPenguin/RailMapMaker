/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const NotificationManager = {
    query: [], // store the id of notifications
    create: (title, msg, chanelId, extra) => {
        /*
        *
        * title: String, store the title display
        * msg: String, store the content display
        * chanelId: store the chanelId
        * extra:
            * priority:
                * 0 -> normal, default value
                    * display at the right-bottom as a small toast, normal theme
                * 1 -> warning
                    * display at the right-bottom as a small toast, warning theme
                * 2 -> alert
                    * display at the right-bottom as a small toast, alert theme
            * dismissible:
                * 0 -> no
                * 1 -> yes, default value
            * icon:
                * undefined, default value
                * url: String, with material-icons-name
            * time:
                * 2000, default value
                * -1, never disappear, must be dismissible or it will be annoying
                * Int, in milliseconds
        *
        * */

        let pref = {};
        if (extra !== undefined)
            pref = {
                priority: extra.priority !== undefined ? extra.priority : 0,
                dismissible: extra.dismissible !== undefined ? extra.dismissible : 1,
                icon: extra.icon !== undefined ? extra.icon : undefined,
                time: extra.time !== undefined ? extra.time : 2000
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
                attr: [["class", "pg-notification-icon mi"]], innerText: pref.icon
            }));

        notification.appendChild(cE({type: 'div', attr: [["class", "pg-notification-title"]], innerText: title}));

        notification.appendChild(cE({type: 'div', attr: [["class", "pg-notification-msg"]], innerHTML: msg}));

        let dismissNotification = () => {
            notification.classList.add("remove");
            setTimeout(() => {
                try {
                    document.body.removeChild(notification);
                } catch (e) {
                    // may not be able to remove if it's dismissible
                }
            }, 1000);
            NotificationManager.query = NotificationManager.query.filter(i => i !== chanelId);
        }

        if (pref.dismissible === 1)
            notification.appendChild(cE({
                type: 'button',
                attr: [["class", "pg-notification-button"]],
                innerText: "Got It!", onclick: dismissNotification
            }));

        if (pref.time !== -1)
            setTimeout(dismissNotification, pref.time);
    }
};