(() => {
    window.JSONParser = (val) => {
        const result = JSON.parse(val);
        return {
            value: result, then: (i) => {
                i(result);
            }
        }
    };
    window.getStyle = (el, styleProp) => {
        return getComputedStyle(el, null)[styleProp];
    }
})();