// ==UserScript==
// @name         Amazon Order Helper
// @namespace    https://www.amazon.com/
// @version      0.1
// @description  User Script for Amazon Order Helper
// @author       Romany Saad
// @match        https://www.amazon.com/gp/css/order-history/*
// @match        https://www.amazon.com/gp/your-account/order-history/*
// @updateURL    https://raw.githubusercontent.com/RomanySaad/UserScripts/master/amazon-order-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/RomanySaad/UserScripts/master/amazon-order-helper.user.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("a-fixed-left-grid-inner").forEach(function(element) {
        var currentElement = element.getElementsByClassName("a-col-right")[0].getElementsByClassName("a-link-normal")[0];
        currentElement.insertAdjacentHTML('afterend', '<br/><input style="width: 100%" value="' + currentElement.innerText + '"></input>');
    }
    );
})();
