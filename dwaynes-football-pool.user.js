// ==UserScript==
// @name         Dwayne's Football Pool User Script
// @namespace    https://armchair.club/
// @version      0.8.4
// @description  User Script for Dwayne's Football Pool
// @author       Romany Saad
// @match        https://armchair.club/*
// @updateURL   https://raw.githubusercontent.com/RomanySaad/UserScripts/master/dwaynes-football-pool.user.js
// @downloadURL https://raw.githubusercontent.com/RomanySaad/UserScripts/master/dwaynes-football-pool.user.js
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant   GM_getValue
// @grant   GM_setValue
// ==/UserScript==

'use strict';

var $ = window.$;

var friends = GM_getValue("friends", null);
var friendsArray = [];
if (friends) {
    friendsArray = friends.split(',');
}

// Highlight friends
friendsArray.forEach(function (friendName) {
    if (friendName.length > 0) {
        $("td:contains(" + friendName.toUpperCase() + ")").parent().addClass("danger");
    }
});

if (window.location.href.indexOf("grid.cfm") > -1) {
    var headerCells = $("table.table-condensed tr").first().find("td:gt(2)");

    var currentUser = headerCells.filter(function(){
        var color = $(this).css("background-color");
        return color === "rgb(254, 243, 180)" ;
    }).text();

    var selectList = document.createElement("select");
    selectList.id = "permutationSelect";
    selectList.style = "position:fixed; top:200px; left:5px; width: 230px; z-index: 999;";

    $("body").append(selectList);

    headerCells.each(function () {
        var innerText = ($(this).text() || "").toString().toLowerCase();

        var option = document.createElement("option");
        option.value = headerCells.index(this);
        option.text = innerText;
        option.selected = (currentUser == innerText);

        if (friendsArray.indexOf(innerText) > -1) {
            //console.log(headerCells.index(this));
            var i = headerCells.index(this) + 4;
            $('table.table-condensed tr td:nth-child(' + i + ')').addClass("danger");
        }

        $(this).css('cursor', 'pointer');
        $(this).on("click", function () {
            toggleFriend($(this), $(this).text());
        });

        selectList.appendChild(option);
    });

    var rows = $("table.table-condensed tr:gt(0)");
    rows.each(function () {
        if (!$(this).hasClass("active")) {
            $(this).css('cursor', 'pointer');
            $(this).on("click", function () {
                toggleResult($(this));
            });
        }
    });
}

//Increase width for MAX points column
$("div.container").last().width("70%");

//Add max width column
$("table.table-striped").last().find("tr").each(function () {
    var possiblePoints = $(this).find("code").text().replace("«", "").replace("»", "");
    var currentPoints = $(this).children().last().text().split(" ")[0];

    var totalPossiblePoints = parseInt(possiblePoints) + parseInt(currentPoints);

    if (totalPossiblePoints) {
        $(this).last().append("<td style='color: green;'>" + totalPossiblePoints + "</td>");
    } else {
        $(this).last().append("<td style='color: green;'></td>");
    }
});

//Add max width column header
$("table.table-striped").last().find("th").each(function () {
    if ($(this).text() == "Rec") {
        $("table.table-striped").last().find("th").last().after("<th>Max</th>");
    }
});

//Sorting: http://stackoverflow.com/questions/3160277/jquery-table-sort
$('th').click(function () {
    var table = $(this).parents('table').eq(0);
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()));
    this.asc = !this.asc;
    if (!this.asc) { rows = rows.reverse(); }
    for (var i = 0; i < rows.length; i++) { table.append(rows[i]); }
});

if (window.location.href.indexOf("grid.cfm") > -1) {
    var permutationButton = document.createElement("button");
    permutationButton.id = "permutationButton";
    permutationButton.type = "button";
    permutationButton.classList = "btn btn-primary";
    permutationButton.style = "position:fixed; top:240px; left:5px; width: 230px; z-index: 999;";

    var buttonText = document.createTextNode('Permutation Computation');

    permutationButton.appendChild(buttonText);

    $("body").append(permutationButton);

    permutationButton.addEventListener("click", PermutationComputation, false);
}

function toggleFriend(element, friendName) {
    var i = headerCells.index(element) + 4;
    var column = $('table.table-condensed tr td:nth-child(' + i + ')');

    var friendIndex = friendsArray.indexOf(friendName);
    var friendExists = friendIndex > -1;

    if (friendExists) {
        column.removeClass("danger");
        friendsArray.splice(friendIndex);
    }
    else {
        column.addClass("danger");
        friendsArray.push(friendName);
    }

    friends = friendsArray.join(',');
    GM_setValue("friends", friends);

    console.log(friends);
}

function toggleResult(element) {
    if (element.hasClass("success")) {
        element.removeClass("success");
    }
    else {
        element.addClass("success");
    }
}

function updateProgress(progressValue) {
    var progressValueText = progressValue.toFixed(2) + '%';

    $('.progress-bar').css('width', progressValueText).attr('aria-valuenow', progressValue);
    $('.progress-bar').innerText = progressValueText;
    console.log(progressValueText);
}

//Permutation Computation
function PermutationComputation() {
    if (window.location.href.indexOf("grid.cfm") > -1) {

        $("#permutationButton").hide();
        var progressBar = '<div class="progress" style="position:fixed; top:200px; left:5px; width: 230px; z-index: 999;"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div></div>';
        $("body").append(progressBar);

        //0=Away
        //1=Home
        var gamesCount = $("table.table-condensed tr.active").length;
        var completeGamesCount = $("table.table-condensed tr.success").length;
        var pendingGamesCount = gamesCount - completeGamesCount;

        //console.log(gamesCount);
        //console.log(completeGamesCount);
        //console.log(pendingGamesCount);

        var permutationMin = "";
        var permutationMax = "";

        var completeGames = $("table.table-condensed tr");

        completeGames.each(function () {
            if ($(this).hasClass("success")) {
                //console.log((completeGames.index(this)) / 3);

                var homeTest = (completeGames.index(this)) / 3;
                if (homeTest == homeTest.toFixed()) {
                    //console.log("Home");
                    permutationMax += "1";
                } else {
                    permutationMax += "0";
                }
            }
        });

        permutationMin = permutationMax;

        for (i = 0; i < pendingGamesCount; i++) {
            permutationMax += "1";
            permutationMin += "0";
        }

        permutationMin = ('0000000000000000' + permutationMin).slice(-gamesCount);
        permutationMax = ('0000000000000000' + permutationMax).slice(-gamesCount);

        //console.log(permutationMin);
        //console.log(permutationMax);

        var permutationMinDec = parseInt(Bin2Dec(permutationMin));
        var permutationMaxDec = parseInt(Bin2Dec(permutationMax));

        var rankArray = [];
        var sumOfRanks = 0;
        var userIndex = $("#permutationSelect").val();

        for (var i = permutationMinDec; i <= permutationMaxDec; i++) {
            var progressValue = (i / permutationMaxDec * 100);
            updateProgress(progressValue);
            //console.log(i);

            var permutationBin = ('0000000000000000' + Dec2Bin(i)).slice(-gamesCount);

            //console.log(permutationBin);

            var resultArray = [];

            for (var j = 0; j < permutationBin.length; j++) {
                //console.log(i[j]);
                var resultToTest = parseInt(permutationBin[j]);

                var awayRow = $("table.table-condensed tr")[2 + (j * 3)];
                var homeRow = $("table.table-condensed tr")[3 + (j * 3)];

                //console.log(resultToTest);

                var awayCells = $(awayRow).find('td:gt(2)');
                var homeCells = $(homeRow).find('td:gt(2)');
                var currentCells;

                if (resultToTest === 0) {
                    currentCells = awayCells;
                }
                else if (resultToTest == 1) {
                    currentCells = homeCells;
                }

                currentCells.each(function () {
                    var currentIndex = currentCells.index(this);

                    if (currentIndex > -1) {
                        if (currentIndex == userIndex) {
                            $(this).attr("style", "background-color:#DEDEDE; text-align:center;");
                        }

                        var confidencePoints = parseInt($(this).text());
                        if (confidencePoints > 0) {
                            if (!resultArray[currentIndex]) {
                                resultArray[currentIndex] = 0;
                            }
                            resultArray[currentIndex] += confidencePoints;
                            //console.log(confidencePoints);
                        }
                    }
                });
            }

            //console.log(resultArray);
            var userTotal = resultArray[userIndex];
            //console.log(userTotal);

            resultArray.sort(function (a, b) { return b - a; });

            var userRank = resultArray.indexOf(userTotal) + 1;
            //console.log(userRank);
            //if (userRank == 0){
            //    console.log(userRank);
            //    console.log(resultArray);
            //    console.log(sortedArray);
            //}

            if (!rankArray[userRank]) {
                rankArray[userRank] = 0;
            }
            rankArray[userRank] += 1;
        }

        if (rankArray && rankArray.length > 0) {
            sumOfRanks = rankArray.reduce(function (previousValue, currentValue) {
                return currentValue + previousValue;
            });
        }

        console.log(rankArray);
        console.log(sumOfRanks);

        $('.progress').hide();
        $("#permutationSelect").hide();

        var resultTable = document.createElement("table");
        resultTable.id = "resultTable";
        resultTable.classList = "table table-condensed table-striped";
        resultTable.style = "position: absolute; top:200px; left:5px; width: 230px; z-index: 999;";

        var thead = document.createElement('thead');

        var trh = document.createElement('tr');

        var tdh = document.createElement('td');
        tdh.innerHTML = "Rank";
        trh.appendChild(tdh);

        var tdh2 = document.createElement('td');
        tdh2.innerHTML = "Permutations";
        trh.appendChild(tdh2);

        thead.appendChild(trh);

        resultTable.appendChild(thead);

        var tbody = document.createElement('tbody');

        for (var x = 0; x < rankArray.length; x++) {
            var currentValue = rankArray[x];

            if (currentValue) {
                var tr = document.createElement('tr');

                var td = document.createElement('td');
                td.innerHTML = x;
                tr.appendChild(td);

                var td2 = document.createElement('td');
                td2.innerHTML = currentValue + " (" + (currentValue / sumOfRanks * 100).toFixed(2) + "%)";
                tr.appendChild(td2);

                tbody.appendChild(tr);
            }
        }

        resultTable.appendChild(tbody);

        $("body").append(resultTable);
    }
}

function comparer(index) {
    return function (a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
    };
}

function getCellValue(row, index) { return $(row).children('td').eq(index).html(); }

function Dec2Bin(n) { if (!checkDec(n) || n < 0) return 0; return n.toString(2); }

function Bin2Dec(n) { if (!checkBin(n)) return 0; return parseInt(n, 2).toString(10); }

function checkBin(n) { return /^[01]{1,64}$/.test(n); }

function checkDec(n) { return /^[0-9]{1,64}$/.test(n); }

function checkHex(n) { return /^[0-9A-Fa-f]{1,64}$/.test(n); }

function pad(s, z) { s = "" + s; return s.length < z ? pad("0" + s, z) : s; }

function unpad(s) { s = "" + s; return s.replace(/^0+/, ''); }