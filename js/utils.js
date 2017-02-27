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

    function calculateEfficienty(n, total) {
        let result;

        if (total === 0 || n === 0) {
            result = 'N/A';
        } else {
            result = (100 - Math.floor((n / total) * 100)) + "%";
        }

        return result;
    }

    function storeSessionItem(key, value) {
        if (sessionStorage) {
            sessionStorage.setItem(key, value);
        }
    }

    function getSessionItem(key) {
        let value = "";
        if (sessionStorage) {
            value = sessionStorage.getItem(key);
        }

        return value;
    }

    function storeLocalItem(key, value) {
        if (localStorage) {
            localStorage.setItem(key, value);
        }
    }

    function getLocalItem(key) {
        let value = "";
        if (localStorage) {
            value = localStorage.getItem(key);
        }

        return value;
    }


    function initLoadFile(btnId, inputId, editor) {

        if (!window.FileReader) {
            $(btnId).hide();
            return;
        }


        $(btnId).on('click', function () {
            $(inputId).trigger('click');
        });

        $(inputId).on('change', function () {

            const $i = $(inputId); // Put file input ID here
            const input = $i[0]; // Getting the element from jQuery
            if (input.files && input.files[0]) {
                const file = input.files[0]; // The file
                const fr = new FileReader(); // FileReader instance
                fr.onload = function () {
                    editor.setValue(fr.result);
                };
                fr.readAsText(file);
            }

        });
    }

    return {
        formatBytes: formatBytes,
        calculateEfficienty: calculateEfficienty,
        storeItem: storeSessionItem,
        retrieveItem: getSessionItem,
        storeLocalItem: storeLocalItem,
        getLocalItem: getLocalItem,
        initLoadFile: initLoadFile
    };


})();
