// ==UserScript==
// @name         Ebay Cost Calculator
// @namespace    https://www.ebay.com/
// @version      0.1
// @description  User Script for Dwayne's Football Pool
// @author       Romany Saad
// @match        https://www.ebay.com/*
// @updateURL    https://raw.githubusercontent.com/RomanySaad/UserScripts/master/ebay-cost-calculator.user.js
// @downloadURL  https://raw.githubusercontent.com/RomanySaad/UserScripts/master/ebay-cost-calculator.user.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

'use strict';

var $ = window.$;
$(".s-item--watch-at-corner").each(
    function(index, itemDiv){
        $(itemDiv).find('.s-item__image-section').append(
            '<div style="font-weight: bold; font-size: 24px;">Shipped: $' + parseFloat( parseFloat($(itemDiv).find('.s-item__price').text().replace('$','')) + parseFloat($(itemDiv).find('.s-item__shipping').text().replace('+$','').replace(' shipping', '').replace('Free', '0'))).toFixed(2) +'</div>'
        );
    });
