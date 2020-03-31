/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const MediaQuery = {
    screenWidth: () => {
        return window.innerWidth > 320 ? window.innerWidth > 480 ? window.innerWidth > 640 ? window.innerWidth > 720 ? window.innerWidth > 768 ? window.innerWidth > 1024 ? window.innerWidth > 1920 : "xxlg" : "xlg" : "lg" : "md" : "sm" : "ssm";
    }
};