
function createTimeObject(topPosition, leftPosition, divId, objectStyle, objectTime, objectWidth, objectHeight, objectFont) {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);

    if(document.getElementsByClassName('clock')[0]) {
        var clockDiv = document.getElementsByClassName('clock')[0];
        clockDiv.innerHTML = hr + ":" + min + ":" + sec ;
        //console.log("updated");

    }
    else {
        var clockDiv = document.createElement('div');
        clockDiv.setAttribute('id', divId);
        clockDiv.setAttribute('class', 'icon-middle sunny resize-drag clock');


        clockDiv.innerHTML = hr + ":" + min + ":" + sec;

        var style = window.getComputedStyle(clockDiv);
        clockDiv.style.top = topPosition;
        clockDiv.style.left = leftPosition;
        clockDiv.setAttribute('top', topPosition);
        clockDiv.setAttribute('left', leftPosition);

        clockDiv.setAttribute('object-style', objectStyle);

        if (objectFont !== "noFont") {
            fontFamilies2.push(objectFont); //add the font if there is a selected font

            clockDiv.setAttribute('object-font', objectFont);

            clockDiv.style.fontFamily = objectFont;
        }
        else {
            clockDiv.setAttribute('object-font', "noFont");
        }

        if (objectWidth == "startWidth" && objectHeight == "startHeight") {
            // console.log("startWidthHeight: " + style.getPropertyValue('width') + " " + style.getPropertyValue('height'));
            // temperatureStyleDiv.style.width = "100px";
            // temperatureStyleDiv.style.height = "50px";
            clockDiv.setAttribute('object-width', style.getPropertyValue('width'));
            clockDiv.setAttribute('object-height', style.getPropertyValue('height'));
        }
        else {
            clockDiv.style.width = objectWidth;
            clockDiv.style.height = objectHeight;
            // console.log("objectWidthHeight " + objectWidth + " " + objectHeight);
            clockDiv.setAttribute('object-width', objectWidth);
            clockDiv.setAttribute('object-height', objectHeight);
        }

        var font = parseFloat(clockDiv.getAttribute('object-height'));
        clockDiv.style.fontSize = font / 3 + 'px';

        document.getElementsByClassName('middle-side')[0].appendChild(clockDiv);

        var functionCaller = arguments.callee.caller.name;
        if (functionCaller == "drop") {
            console.log("if");
            addToUndoArray(clockDiv.id, "addObject", topPosition, leftPosition, clockDiv.getAttribute('object-style'), objectTime, clockDiv.getAttribute('object-width'), clockDiv.getAttribute('object-height'),clockDiv.getAttribute('object-font'), "noMessage");
        }

        weatherStyleToCss(divId, topPosition, leftPosition, clockDiv.getAttribute('object-style'), "no-time", clockDiv.getAttribute('object-width'), clockDiv.getAttribute('object-height'),clockDiv.getAttribute('object-font'));

    }

    clockTimer = setTimeout(function() {createTimeObject(clockDiv.getAttribute('top'),clockDiv.getAttribute('left'),clockDiv.id,clockDiv.getAttribute('object-style'),"no-time",clockDiv.getAttribute('object-width'),clockDiv.getAttribute('object-height'),clockDiv.getAttribute('object-font')) }, 1000);

}

/*
If the seconds, minutes or hours are less than 10 add a zero before the number.
 */
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function createDateObject (topPosition, leftPosition, divId, objectStyle, objectTime, objectWidth, objectHeight, objectFont) {
    var today = new Date();
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var curWeekDay = days[today.getDay()];
    var curDay = today.getDate();
    var curMonth = months[today.getMonth()];
    var curYear = today.getFullYear();

    if(document.getElementsByClassName('date')[0]) {
        var dateDiv = document.getElementsByClassName('date')[0];
        dateDiv.innerHTML = curWeekDay+", "+curDay+" "+curMonth+" "+curYear;
        // console.log("updated");

    }
    else {

        var dateDiv = document.createElement('div');
        dateDiv.setAttribute('id', divId);
        dateDiv.setAttribute('class', 'icon-middle sunny resize-drag date');

        var date = curWeekDay + ", " + curDay + " " + curMonth + " " + curYear;
        dateDiv.innerHTML = date;

        var style = window.getComputedStyle(dateDiv);
        dateDiv.style.top = topPosition;
        dateDiv.style.left = leftPosition;
        dateDiv.setAttribute('top', topPosition);
        dateDiv.setAttribute('left', leftPosition);

        dateDiv.setAttribute('object-style', objectStyle);

        if (objectFont !== "noFont") {
            fontFamilies2.push(objectFont); //add the font if there is a selected font

            dateDiv.setAttribute('object-font', objectFont);

            dateDiv.style.fontFamily = objectFont;
        }
        else {
            dateDiv.setAttribute('object-font', "noFont");
        }

        if (objectWidth == "startWidth" && objectHeight == "startHeight") {
            // console.log("startWidthHeight: " + style.getPropertyValue('width') + " " + style.getPropertyValue('height'));
            // temperatureStyleDiv.style.width = "100px";
            // temperatureStyleDiv.style.height = "50px";
            dateDiv.setAttribute('object-width', style.getPropertyValue('width'));
            dateDiv.setAttribute('object-height', style.getPropertyValue('height'));
        }
        else {
            dateDiv.style.width = objectWidth;
            dateDiv.style.height = objectHeight;
            // console.log("objectWidthHeight " + objectWidth + " " + objectHeight);
            dateDiv.setAttribute('object-width', objectWidth);
            dateDiv.setAttribute('object-height', objectHeight);
        }

        var font = parseFloat(dateDiv.getAttribute('object-height'));
        dateDiv.style.fontSize = font / 3 + 'px';

        document.getElementsByClassName('middle-side')[0].appendChild(dateDiv);

        var functionCaller = arguments.callee.caller.name;
        if (functionCaller == "drop") {
            console.log("if");
            addToUndoArray(dateDiv.id, "addObject", topPosition, leftPosition, dateDiv.getAttribute('object-style'), objectTime, dateDiv.getAttribute('object-width'), dateDiv.getAttribute('object-height'),dateDiv.getAttribute('object-font'), "noMessage");
        }

        weatherStyleToCss(divId, topPosition, leftPosition, dateDiv.getAttribute('object-style'), "no-time", dateDiv.getAttribute('object-width'), dateDiv.getAttribute('object-height'),dateDiv.getAttribute('object-font'));

    }

    dateTimer = setTimeout(function() {createDateObject(dateDiv.getAttribute('top'),dateDiv.getAttribute('left'),dateDiv.id,dateDiv.getAttribute('object-style'),"no-time",dateDiv.getAttribute('object-width'),dateDiv.getAttribute('object-height'),dateDiv.getAttribute('object-font')) }, 60000);

}

