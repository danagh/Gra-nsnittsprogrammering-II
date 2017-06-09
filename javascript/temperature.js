/*
This file handles the creation of the temperature and text message objects. It also handles all the
different options that a user can do with these objects.
 */

/*
This function loads all the Google fonts so that they can be shown when you choose a different font
and then reload the page.
 */
function loadGoogleFonts() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}

/*
Create the temperature object and add all the different attributes to it. The difference between the temperature and weather object is that we also have to save the chosen font
for the temperature.
 */
function createTemperatureStyle(apiResponse, topPosition, leftPosition, divId, temperatureTime, objectWidth, objectHeight, objectFont, functionCaller) {
    var temperatureStyleDiv = document.createElement('div');
    temperatureStyleDiv.setAttribute('id', divId);

    if (temperatureTime !== "notExist") {
        temperatureStyleDiv.setAttribute('weather-time', temperatureTime);
        var timeDifference = calculateDateAndTimeDifference(apiResponse, temperatureTime);
    }
    else {
        temperatureStyleDiv.setAttribute('weather-time', "current-time");
        var timeDifference = calculateDateAndTimeDifference(apiResponse, "current-time");
    }

    var currentTemp = apiResponse.timeSeries[timeDifference].parameters[1].values[0];
    // console.log("current temp: " + currentTemp);
    temperatureStyleDiv.innerHTML = currentTemp +'\u00B0C'; //last string is the degree-sign + a C for Celsius

    temperatureStyleDiv.setAttribute('class','icon-middle sunny resize-drag');
    // temperatureStyleDiv.setAttribute('draggable','true'); //the object has to be able to be moved later on by the user.
    // temperatureStyleDiv.setAttribute('fromleft','true');
    // temperatureStyleDiv.addEventListener('dragstart', drag2, false);

    document.getElementsByClassName('middle-side')[0].appendChild(temperatureStyleDiv);

    temperatureStyleDiv.style.left = leftPosition ; //create an offset so that it is placed correctly
    temperatureStyleDiv.style.top = topPosition ;

    var style = window.getComputedStyle(temperatureStyleDiv);
    var top = style.getPropertyValue('top');
    temperatureStyleDiv.setAttribute('top',top);
    var left = style.getPropertyValue('left');
    temperatureStyleDiv.setAttribute('left',left);
    temperatureStyleDiv.setAttribute('object-style', 'temperature');
    // temperatureStyleDiv.style.display = "inline-block";

    if (objectWidth == "startWidth" && objectHeight=="startHeight") {
        // console.log("startWidthHeight: " + style.getPropertyValue('width') + " " + style.getPropertyValue('height'));
        // temperatureStyleDiv.style.width = "100px";
        // temperatureStyleDiv.style.height = "50px";
        temperatureStyleDiv.setAttribute('object-width',style.getPropertyValue('width'));
        temperatureStyleDiv.setAttribute('object-height',style.getPropertyValue('height'));
    }
    else {
        temperatureStyleDiv.style.width = objectWidth;
        temperatureStyleDiv.style.height = objectHeight;
        // console.log("objectWidthHeight " + objectWidth + " " + objectHeight);
        temperatureStyleDiv.setAttribute('object-width',objectWidth);
        temperatureStyleDiv.setAttribute('object-height',objectHeight);
    }
    var font = parseFloat(temperatureStyleDiv.getAttribute('object-height'));
    temperatureStyleDiv.style.fontSize = font/3 + 'px' ;
    // temperatureStyleDiv.style.fontSize = temperatureStyleDiv.getAttribute('object-height')/1.5 ;
    console.log(objectFont);

    if(objectFont !== "noFont") {
        fontFamilies2.push(objectFont); //add the font if there is a selected font
        temperatureStyleDiv.setAttribute('object-font',objectFont);

        temperatureStyleDiv.style.fontFamily = objectFont;
    }
    else {
        temperatureStyleDiv.style.fontFamily = 'Julius Sans One';
        temperatureStyleDiv.setAttribute('object-font', "Julius Sans One");
    }

    console.log(functionCaller);
    if (functionCaller == "drop") {
        addToUndoArray(temperatureStyleDiv.id, "addObject", top, left, temperatureStyleDiv.getAttribute('object-style'), temperatureStyleDiv.getAttribute('weather-time'), temperatureStyleDiv.getAttribute('object-width'), temperatureStyleDiv.getAttribute('object-height'),temperatureStyleDiv.getAttribute('object-font'), "noMessage");
    }



    if (temperatureTime !== "notExist") {
      //  weatherStyleToCss(divId, top, left, temperatureStyleDiv.getAttribute('object-style'), temperatureTime, temperatureStyleDiv.getAttribute('object-width'), temperatureStyleDiv.getAttribute('object-height'),temperatureStyleDiv.getAttribute('object-font'));
    }
    temperatureStyleDiv.style.color = 'white';
  //  else weatherStyleToCss(divId, top, left, temperatureStyleDiv.getAttribute('object-style'), "current time", temperatureStyleDiv.getAttribute('object-width'), temperatureStyleDiv.getAttribute('object-height'),temperatureStyleDiv.getAttribute('object-font'));
}

/*
function taken from http://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
this function waits for a specific DOM-element to pop up before changing the font of the speicifc element
 */
function waitForElementToDisplay(selector, time) {
    if(document.getElementById(selector)!=null) {
        if(currentHighlightedObject.getAttribute('object-font') != "noFont") {
            document.getElementById(selector).innerHTML = currentHighlightedObject.getAttribute('object-font');
            document.getElementById(selector).style.fontFamily = currentHighlightedObject.getAttribute('object-font');
        }
        return;
    }
    else {
        setTimeout(function() {
            waitForElementToDisplay(selector, time);
        }, time);
    }
}

/*
THis function shows the font selector that https://github.com/saadqbal/HiGoogleFonts has created
 */
function showFontSelector() {
    var selector = document.createElement('select');
    selector.id = "select_fontfamily";

    document.getElementsByClassName('text-bubble')[0].appendChild(selector);

    waitForElementToDisplay('select2-select_fontfamily-container', 5000); //wait for the element to appear.


    $("#select_fontfamily").higooglefonts({ //This part is taken from the tutorial in the github link above.

        loadedCallback:function(e){ //another function that adds the selected font to the object and stores the old font in the undo-array
            // console.log(e);

            var currentFontFamily = window.getComputedStyle(currentHighlightedObject).getPropertyValue('font-family');

            //save the previous font to the undo array
            addToUndoArray(currentHighlightedObject.id, "changedFont", currentHighlightedObject.getAttribute('top'), currentHighlightedObject.getAttribute('left'),currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'), currentHighlightedObject.getAttribute('object-height'), currentFontFamily, currentHighlightedObject.getAttribute('text-message'));
            currentHighlightedObject.style.fontFamily = e;
            currentHighlightedObject.setAttribute('object-font',e);
            updateObjectFont();

        }
    });

}

/*
When the font change has happened we have to save the new font in the object and display the new font at the same time.
 */
function updateObjectFont() {
    console.log("update object font:");
    console.log(fontFamilies2);
    // console.log(topPositionArray);
    fontFamilies2.push(currentHighlightedObject.getAttribute('object-font')); //add the font to a global variable

    for (var i = 0; i < objectIdArray.length; i++) {
        if (objectIdArray[i] == currentHighlightedObject.id) {
            objectFontArray[i] = currentHighlightedObject.getAttribute('object-font'); //add the selected font to the highlighted object
            updateLocalStorage();
        }
    }


}

function hideFontSelector() { //hide the font selector
    var selector = document.getElementsByClassName("select2")[0];
    var selector2 = document.getElementById("select_fontfamily");
    if (selector && selector2) {
        selector.style.display = "none";
        selector.remove();
        selector2.style.display = "none";
        selector2.remove();
    }
}

/*
Create the text message object and all the attributes that it needs. The difference between this and the other objects is
that we also need to store the entered message when creating and updating this object.
 */
function createTextMessage(locationTop, locationLeft, divId, messageTime, objectWidth, objectHeight, objectStyle, objectFont, textMessage) {
    console.log("object font given");
    console.log(objectFont);
    var textMessageDiv = document.createElement('div');
    textMessageDiv.setAttribute('id',divId);
    textMessageDiv.setAttribute('class','icon-middle sunny resize-drag');
    textMessageDiv.style.color = 'white';

    if (textMessage == "noMessage") { //if the user has not written a message in it display a placeholder.
        var placeholder = getText('text-message-placeholder');
        textMessageDiv.innerHTML = placeholder;
        textMessageDiv.setAttribute('text-message', placeholder);
    }
    else { //otherwise show the message.
        textMessageDiv.innerHTML = textMessage;
        textMessageDiv.setAttribute('text-message',textMessage);
    }

    document.getElementsByClassName('middle-side')[0].appendChild(textMessageDiv);

    var style = window.getComputedStyle(textMessageDiv);
    textMessageDiv.style.top =locationTop;
    textMessageDiv.style.left = locationLeft;
    textMessageDiv.setAttribute('top', locationTop);
    textMessageDiv.setAttribute('left',locationLeft);

    textMessageDiv.setAttribute('object-style', objectStyle);

    if(objectFont !== "noFont") {
        fontFamilies2.push(objectFont); //add the font if there is a selected font
        textMessageDiv.setAttribute('object-font',objectFont);

        textMessageDiv.style.fontFamily = objectFont;
    }
    else {
        textMessageDiv.style.fontFamily = 'Julius Sans One';
        textMessageDiv.setAttribute('object-font', "Julius Sans One");
    }


    if (objectWidth == "startWidth" && objectHeight=="startHeight") {
        textMessageDiv.setAttribute('object-width', style.getPropertyValue('width'));
        textMessageDiv.setAttribute('object-height',style.getPropertyValue('height'));
    }
    else {
        textMessageDiv.style.width = objectWidth;
        textMessageDiv.style.height = objectHeight;
        textMessageDiv.setAttribute('object-width',objectWidth);
        textMessageDiv.setAttribute('object-height',objectHeight);
    }

    var font = parseFloat(textMessageDiv.getAttribute('object-height'));
    textMessageDiv.style.fontSize = font/3 + 'px';

    var functionCaller = arguments.callee.caller.name;

    if (functionCaller == "drop") { //add it to the undo array if it was not called from localstorage.
        addToUndoArray(textMessageDiv.id, "addObject", locationTop, locationLeft, textMessageDiv.getAttribute('object-style'), messageTime, textMessageDiv.getAttribute('object-width'), textMessageDiv.getAttribute('object-height'),textMessageDiv.getAttribute('object-font'), textMessageDiv.getAttribute('text-message'));
    }

}

/*
Show the input field if the user clicks on a text message.
 */
function showInputField() {
    currentHighlightedObject.innerHTML =""; //remove the current text when it is highlighted

    var inputField = document.createElement('input'); //create an input field
    inputField.className = 'text-message-field';
    inputField.setAttribute('type','text');

    inputField.value = currentHighlightedObject.getAttribute('text-message'); //add the current text message as the input value
    inputField.style.fontFamily = currentHighlightedObject.getAttribute('object-font'); //change the font to the correct one.

    var font = parseFloat(currentHighlightedObject.getAttribute('object-height'));
    inputField.style.fontSize = font/3 + 'px';

    inputField.style.width = currentHighlightedObject.getAttribute('object-width');
    inputField.style.height = currentHighlightedObject.getAttribute('object-height');
    inputField.style.paddingBottom = '22px';

    currentHighlightedObject.appendChild(inputField);
    inputField.focus(); //focus and select the input field for the user.
    inputField.select();
}

/*
Hide the input field if the user clicks anywhere else on the screen.
 */
function hideInputField() {

    var inputField = document.getElementsByClassName('text-message-field')[0];
    if (inputField) { //if the inputfield exists
        var enteredText =  inputField.value;
        if (enteredText == "") { //if the user did not enter anything keep the previous message
            currentHighlightedObject.innerHTML = currentHighlightedObject.getAttribute('text-message');
        }
        else { // if the user entered any text
            //send the last text message string to the undo array
            addToUndoArray(currentHighlightedObject.id, "changeText", currentHighlightedObject.getAttribute('top'), currentHighlightedObject.getAttribute('left'), currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'), currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-font'), currentHighlightedObject.getAttribute('text-message'));

            //update the object with the new text message
            currentHighlightedObject.innerHTML = enteredText;
            currentHighlightedObject.setAttribute('text-message',enteredText);
            //updateTextMessageArray(enteredText);
        }
        inputField.style.dipslay = "none";
        inputField.remove();
    }

}
