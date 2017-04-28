// var fontFamilies =[];

$(document).ready(function() {
    // console.log("temperature " + fontFamilies);
    YOURFUNCTION();
});

/*
This function loads all the Google fonts so that they can be shown when you choose a different font
and then reload the page.
 */
function YOURFUNCTION() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}

function createTemperatureStyle(apiResponse, topPosition, leftPosition, divId, temperatureTime, objectWidth, objectHeight, objectFont) {
    var temperatureStyleDiv = document.createElement('div');
    temperatureStyleDiv.setAttribute('id', divId);

    if (temperatureTime !== "notExist") {
        temperatureStyleDiv.setAttribute('weather-time', temperatureTime);
        var timeDifference = calculateDateAndTimeDifference(apiResponse, temperatureTime);
    }
    else {
        temperatureStyleDiv.setAttribute('weather-time', "current-time");
        var timeDifference = calculateDateAndTimeDifference(apiResponse, "current time");
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
        console.log("ifFont");
        temperatureStyleDiv.setAttribute('object-font',objectFont);

        temperatureStyleDiv.style.fontFamily = objectFont;
    }
    else {
        temperatureStyleDiv.setAttribute('object-font',"noFont");
    }

    if (temperatureTime !== "notExist") {
        weatherStyleToCss(divId, top, left, temperatureStyleDiv.getAttribute('object-style'), temperatureTime, temperatureStyleDiv.getAttribute('object-width'), temperatureStyleDiv.getAttribute('object-height'),temperatureStyleDiv.getAttribute('object-font'));
    }
    else weatherStyleToCss(divId, top, left, temperatureStyleDiv.getAttribute('object-style'), "current time", temperatureStyleDiv.getAttribute('object-width'), temperatureStyleDiv.getAttribute('object-height'),temperatureStyleDiv.getAttribute('object-font'));
}

function showFontSelector() {
    var selector = document.createElement('select');
    selector.id = "select_fontfamily";
    document.getElementsByClassName('right-side')[0].appendChild(selector);
    $("#select_fontfamily").higooglefonts({

        loadedCallback:function(e){ //another function that adds the selected font
            // console.log(e);
            currentHighlightedObject.style.fontFamily = e;
            currentHighlightedObject.setAttribute('object-font',e);
            console.log("blabla: " + currentHighlightedObject.getAttribute('object-font'));
            updateObjectFont();

        }
    });

}

function updateObjectFont() {

    console.log(fontFamilies2);
    // console.log(topPositionArray);
    fontFamilies2.push(currentHighlightedObject.getAttribute('object-font')); //add the font to a global variable

    for (var i = 0; i < objectIdArray.length; i++) {
        if (objectIdArray[i] == currentHighlightedObject.id) {
            objectFontArray[i] = currentHighlightedObject.getAttribute('object-font'); //add the selected font to the highlighted object
            // console.log(objectFontArray);
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

function createTextMessage(locationTop, locationLeft, divId, messageTime, objectWidth, objectHeight, objectStyle, objectFont, textMessage) {
    console.log("create text message");
    var textMessageDiv = document.createElement('div');
    textMessageDiv.setAttribute('id',divId);
    textMessageDiv.setAttribute('class','icon-middle sunny resize-drag');
    // textMessageDiv.setAttribute('draggable','true'); //the object has to be able to be moved later on by the user.
    // textMessageDiv.setAttribute('fromleft','true');
    // textMessageDiv.addEventListener('dragstart', drag2, false);



    if (textMessage == "noMessage") {
        console.log("if sats");
        var placeholder = getText('text-message-placeholder');
        textMessageDiv.innerHTML = placeholder;
        textMessageDiv.setAttribute('text-message', placeholder);
    }
    else {
        textMessageDiv.innerHTML = textMessage;
        textMessageDiv.setAttribute('text-message',textMessage);
    }
    document.getElementsByClassName('middle-side')[0].appendChild(textMessageDiv);
    // textMessageDiv.appendChild(inputField);

    var style = window.getComputedStyle(textMessageDiv);
    textMessageDiv.style.top =locationTop;
    textMessageDiv.style.left = locationLeft;
    textMessageDiv.setAttribute('top', locationTop);
    textMessageDiv.setAttribute('left',locationLeft);

    textMessageDiv.setAttribute('object-style', objectStyle);

    if(objectFont !== "noFont") {
        fontFamilies2.push(objectFont); //add the font if there is a selected font
        console.log("ifFont");
        textMessageDiv.setAttribute('object-font',objectFont);

        textMessageDiv.style.fontFamily = objectFont;
    }
    else {
        textMessageDiv.setAttribute('object-font',"noFont");
    }


    if (objectWidth == "startWidth" && objectHeight=="startHeight") {
        // console.log("startWidthHeight: " + style.getPropertyValue('width') + " " + style.getPropertyValue('height'));
        // temperatureStyleDiv.style.width = "100px";
        // temperatureStyleDiv.style.height = "50px";
        textMessageDiv.setAttribute('object-width', style.getPropertyValue('width'));
        textMessageDiv.setAttribute('object-height',style.getPropertyValue('height'));
    }
    else {
        textMessageDiv.style.width = objectWidth;
        textMessageDiv.style.height = objectHeight;
        // console.log("objectWidthHeight " + objectWidth + " " + objectHeight);
        textMessageDiv.setAttribute('object-width',objectWidth);
        textMessageDiv.setAttribute('object-height',objectHeight);
    }

    var font = parseFloat(textMessageDiv.getAttribute('object-height'));
    textMessageDiv.style.fontSize = font/3 + 'px';
    // textMessageDiv.style.fontSize = textMessageDiv.getAttribute('object-height') ;

    textMessageToCss(divId, locationTop, locationLeft, messageTime, objectWidth, objectHeight, textMessageDiv.getAttribute('object-font'), textMessageDiv.getAttribute('text-message'), objectStyle);
}

function showInputField() {
    currentHighlightedObject.innerHTML ="";
    var inputField = document.createElement('input');
    inputField.className = 'text-message-field';
    inputField.setAttribute('type','text');
    console.log(currentHighlightedObject.getAttribute('text-message'));
    inputField.value = currentHighlightedObject.getAttribute('text-message');
    inputField.style.fontFamily = currentHighlightedObject.getAttribute('object-font');

    var font = parseFloat(currentHighlightedObject.getAttribute('object-height'));
    inputField.style.fontsize = font/2 + 'px';

    // inputField.style.fontSize = currentHighlightedObject.getAttribute('object-height');
    inputField.style.width = currentHighlightedObject.getAttribute('object-width');
    currentHighlightedObject.appendChild(inputField);
    inputField.focus();
    inputField.select();
}
function hideInputField() {

    var inputField = document.getElementsByClassName('text-message-field')[0];
    if (inputField) {
        console.log("current highlight: " + currentHighlightedObject.className);
        var enteredText =  inputField.value;
        if (enteredText == "") {
            currentHighlightedObject.innerHTML = currentHighlightedObject.getAttribute('text-message');
        }
        else {
            currentHighlightedObject.innerHTML = enteredText;
            currentHighlightedObject.setAttribute('text-message',enteredText);
            updateTextMessageArray(enteredText);
        }
        inputField.style.dipslay = "none";
        inputField.remove();
    }

}

function updateTextMessageArray(enteredText) {
    for (var i = 0; i < objectIdArray.length; i++) {
        if (objectIdArray[i] == currentHighlightedObject.id) {
            objectTextMessages[i] = enteredText;
            console.log(objectTextMessages);
            updateLocalStorage();
        }
    }
}

function textMessageToCss(divId, topPosition, leftPosition, objectTime, objectWidth, objectHeight, objectFont, textMessage, objectStyle) {
    var index = objectIdArray.indexOf(divId);
    if (index !== -1) { //if the id is not found in the id-array
        leftPositionArray[index] = leftPosition;
        topPositionArray[index] = topPosition;
    }

    else {
        objectIdArray.push(divId);
        leftPositionArray.push(leftPosition);
        topPositionArray.push(topPosition);
        objectStyleArray.push(objectStyle);
        weatherTimeArray.push(objectTime);
        objectWidthArray.push(objectWidth);
        objectHeightArray.push(objectHeight);
        objectFontArray.push(objectFont);

        for (var i= 0; i < objectIdArray.length; i++) {
            if (objectIdArray[i] == divId) {
                objectTextMessages[i] = textMessage
            }
        }
    }

    updateLocalStorage();
}