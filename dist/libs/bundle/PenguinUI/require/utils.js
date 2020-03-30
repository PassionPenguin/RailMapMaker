/*

    Package PassionPenguin/PenguinUI


    Created by @PassionPenguin
    Last upd by @PassionPenguin

 */

const utils = {
    colorReserve: (oldValue) => {
        // HEX
        return "#" + (0xFFFFFF - 'Ox' + oldValue.replace(/#/g, "")).toString(16).replace(/-/, "");
    }
}