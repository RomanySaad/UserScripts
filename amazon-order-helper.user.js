// ==UserScript==
// @name         Amazon Order Helper
// @namespace    https://www.amazon.com/
// @version      0.4
// @description  User Script for Amazon Order Helper
// @author       Romany Saad
// @match        https://www.amazon.com/gp/css/order-history*
// @match        https://www.amazon.com/gp/your-account/order-history*
// @match        https://www.amazon.com/your-orders/orders*
// @match        https://www.amazon.com/gp/your-account/order-details*
// @match        https://www.amazon.com/gp/css/summary/print.html*
// @updateURL    https://raw.githubusercontent.com/RomanySaad/UserScripts/master/amazon-order-helper.user.js
// @downloadURL  https://raw.githubusercontent.com/RomanySaad/UserScripts/master/amazon-order-helper.user.js
// ==/UserScript==

(function() {

    'use strict';

    var arr = [].slice.call(document.getElementsByClassName("a-fixed-left-grid-inner"));
    arr.forEach(function(element) {
        var currentElement = element.getElementsByClassName("a-col-right")[0].getElementsByClassName("a-link-normal")[0];
        insertTextBox(currentElement);
    });

    if (!arr.length) {
        var invoiceArr = [].slice.call(document.getElementsByTagName("i"));
        invoiceArr.forEach(function(element) {
            insertTextBox(element);
        });
    }
})();

function insertTextBox(element) {
    element.insertAdjacentHTML("afterend", `<input style="width: 100%; cursor: pointer;" value="${element.innerText.replace('"', '&quot;')}" onClick='navigator.clipboard.writeText("${element.innerText.replace(/"/g, '\\&quot;').replace(/'/g, '&apos;')}")'></input>`);
};
