/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const MediaQuery = {
    screenWidth: () => {
        const w = window.innerWidth;
        let result = [];
        if (w > 320)
            result.push("xxs");
        if (w > 480)
            result.push("xs");
        if (w > 640)
            result.push("sm");
        if (w > 720)
            result.push("md");
        if (w > 768)
            result.push("lg");
        if (w > 1024)
            result.push("xlg");
        if (w > 1680)
            result.push("xxlg");
        return result;
    },
    screeHeight: () => {
        const h = window.innerHeight;
        let result = [];
        if (h > 320)
            result.push("xxs");
        if (h > 480)
            result.push("xs");
        if (h > 640)
            result.push("sm");
        if (h > 720)
            result.push("md");
        if (h > 768)
            result.push("lg");
        if (h > 1024)
            result.push("xlg");
        if (h > 1680)
            result.push("xxlg");
        return result;
    }
};