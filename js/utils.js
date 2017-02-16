 /*exported DevUtils*/
const DevUtils = (function () {
    "use strict";

    function formatBytes(bytes) {
        if (bytes < 1024) {
            return bytes + " Bytes";
        }
        else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(3) + " KB";
        }
        else if (bytes < 1073741824) {
            return (bytes / 1048576).toFixed(3) + " MB";
        }
        else {
            return (bytes / 1073741824).toFixed(3) + " GB";

        }
    }

    function calculateEfficienty(n, total){
        let result;
        
        if(total === 0 || n === 0){
            result = 'N/A';
        }else{
            result = (100 - Math.floor((n /total) *100)) + "%";
        }

        return result;
    }

    function storeSessionItem(key, value){
        if(sessionStorage){
            sessionStorage.setItem(key, value);
        }
    }

    function getSessionItem(key){
        let value = "";
        if(sessionStorage){
           value = sessionStorage.getItem(key);
        }

        return value;
    }
    

    return {
        formatBytes: formatBytes,
        calculateEfficienty: calculateEfficienty,
        storeItem: storeSessionItem,
        retrieveItem: getSessionItem
    };

    

})();
