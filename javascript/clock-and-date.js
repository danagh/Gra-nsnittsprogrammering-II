/*
This file handles the creation and all options for the clock and date elements.
 */

/*
Create a clock object and add the current time to it.
The creation of the clock and how it handles time is taken from http://www.elated.com/articles/creating-a-javascript-clock/
 */
/*
The difference in this object is that it stores an second-chooser attribute so that it knows if the clock should show the seconds ticking or not.
Furthermore this attribute has to be stored so that the checkbox is checked/unchecked depending on the user's choice.
This element also has to store the selected font.
 */
function createTimeObject(topPosition, leftPosition, divId, objectStyle, objectTime, objectWidth, objectHeight, objectFont, secondChooser) {
    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);

    //When the function is recalled just update the innerHTML and not the whole element.
    if(document.getElementsByClassName('clock')[0]) {
        var clockDiv = document.getElementsByClassName('clock')[0];
        var showSeconds = clockDiv.getAttribute('seconds');
        if (showSeconds == 'true') { //depending on the user's choice do or don't show the seconds
            clockDiv.innerHTML = hr + ":" + min + ":" + sec ;
        }
        else clockDiv.innerHTML = hr + ":" + min ;

        //console.log("updated");

    }
    //goes into this else-statement the first time the element is created.
    else {
        var clockDiv = document.createElement('div');
        clockDiv.style.color = 'white';
        clockDiv.setAttribute('id', divId);
        clockDiv.setAttribute('class', 'icon-middle sunny resize-drag clock');

        clockDiv.setAttribute('seconds', secondChooser);

        if (secondChooser == 'true') { //depending on the user's choice do or don't show the seconds
            clockDiv.innerHTML = hr + ":" + min + ":" + sec ;
        }
        else clockDiv.innerHTML = hr + ":" + min ;

        //clockDiv.innerHTML = hr + ":" + min + ":" + sec;

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
            clockDiv.style.fontFamily = 'Julius Sans One';
            clockDiv.setAttribute('object-font', "Julius Sans One");
        }

        if (objectWidth == "startWidth" && objectHeight == "startHeight") {
            // console.log("startWidthHeight: " + style.getPropertyValue('width') + " " + style.getPropertyValue('height'));
            clockDiv.style.width = "100px";
            clockDiv.style.height = "50px";
            clockDiv.setAttribute('object-width', '100px');
            clockDiv.setAttribute('object-height', '50px');
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

      //  weatherStyleToCss(divId, topPosition, leftPosition, clockDiv.getAttribute('object-style'), "no-time", clockDiv.getAttribute('object-width'), clockDiv.getAttribute('object-height'),clockDiv.getAttribute('object-font'));

    }

    clockTimer = setTimeout(function() {createTimeObject(clockDiv.getAttribute('top'),clockDiv.getAttribute('left'),clockDiv.id,clockDiv.getAttribute('object-style'),"no-time",clockDiv.getAttribute('object-width'),clockDiv.getAttribute('object-height'),clockDiv.getAttribute('object-font'),clockDiv.getAttribute('seconds')) }, 1000);

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

/*
This function checks if the checkbox is checked and shows/hides the seconds on the clock accordingly.
 */
function changeSeconds() {
    var isChecked = currentHighlightedObject.getAttribute('seconds');

    var today = new Date();
    var hr = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    //Add a zero in front of numbers<10
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);

    if (isChecked == 'true') {
        currentHighlightedObject.innerHTML = hr + ":" + min + ":" + sec;
    }
    else {
        currentHighlightedObject.innerHTML = hr + ":" + min;
    }
}

/*
Creates and displays a checkbox where the user can choose the show or hide the seconds counter
 */
function showSecondsChooser() {
    var secondChooserDiv = document.createElement('div');
    secondChooserDiv.style.color = 'black';
    secondChooserDiv.className = 'checkboxTwo';
    var secondChooserDivText = document.createElement('div');
    secondChooserDivText.style.color = 'black';
    secondChooserDivText.className = 'second-chooser-div-text';

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.value = "1";
    checkbox.className = 'second-chooser';
    checkbox.id = "checkboxTwoInput";
    var label = document.createElement('label');
    label.setAttribute('for', 'checkboxTwoInput');

    var isChecked = currentHighlightedObject.getAttribute('seconds');
    if (isChecked == 'true') { //make the checkbox checked depending on the objects property.
        checkbox.setAttribute('checked', 'checked');
    }
    secondChooserDivText.innerHTML = getText('show-seconds');
    secondChooserDiv.appendChild(checkbox);
    secondChooserDiv.appendChild(label);
    document.getElementsByClassName('text-bubble')[0].appendChild(secondChooserDivText);
    document.getElementsByClassName('text-bubble')[0].appendChild(secondChooserDiv);
    secondChooserDiv.style.display = 'inline-block';
}

var lang = getParameterByName("lang"); //initiate a language parameter

/*
This function creates a date-object. It uses the same attributes as the temperature object.
 */
/*
The creation of the date object is taken from http://www.elated.com/articles/creating-a-javascript-clock/
 */
function createDateObject (topPosition, leftPosition, divId, objectStyle, objectTime, objectWidth, objectHeight, objectFont) {
    var today = new Date();
    /*
    Create arrays for both swedish and english months and days so that depending on the chosen language display different names.
     */
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var sweMonths = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
    var sweDays = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
    var curDay = today.getDate();
    var curYear = today.getFullYear();


    if(lang == "se") {
        var curWeekDay = sweDays[today.getDay()];
        var curMonth = sweMonths[today.getMonth()];
    }
    else {
        var curWeekDay = days[today.getDay()];
        var curMonth = months[today.getMonth()];
    }

    //do not create the whole object again if it is already created.
    if(document.getElementsByClassName('date')[0]) {
        var dateDiv = document.getElementsByClassName('date')[0];
        dateDiv.innerHTML = curWeekDay+", "+curDay+" "+curMonth+" "+curYear;
        // console.log("updated");

    }
    else {
        var dateDiv = document.createElement('div');
        dateDiv.style.color = 'white';
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
            dateDiv.style.fontFamily = 'Julius Sans One';
            dateDiv.setAttribute('object-font', "Julius Sans One");
        }

        if (objectWidth == "startWidth" && objectHeight == "startHeight") {
            // console.log("startWidthHeight: " + style.getPropertyValue('width') + " " + style.getPropertyValue('height'));
            dateDiv.style.width = "100px";
            dateDiv.style.height = "50px";
            dateDiv.setAttribute('object-width', '100px');
            dateDiv.setAttribute('object-height', '50px');
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

        //Add the action to the undo array if it was added from the left side
        if (functionCaller == "drop") {
            addToUndoArray(dateDiv.id, "addObject", topPosition, leftPosition, dateDiv.getAttribute('object-style'), objectTime, dateDiv.getAttribute('object-width'), dateDiv.getAttribute('object-height'),dateDiv.getAttribute('object-font'), "noMessage");
        }

    }

    //create a timer that updates the date every minute.
    dateTimer = setTimeout(function() {createDateObject(dateDiv.getAttribute('top'),dateDiv.getAttribute('left'),dateDiv.id,dateDiv.getAttribute('object-style'),"no-time",dateDiv.getAttribute('object-width'),dateDiv.getAttribute('object-height'),dateDiv.getAttribute('object-font')) }, 60000);

}

