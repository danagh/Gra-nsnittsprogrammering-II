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
    temperatureStyleDiv.innerHTML = currentTemp +'\u00B0C'; //last string is the degree-sign

    temperatureStyleDiv.setAttribute('class','icon-middle sunny');
    temperatureStyleDiv.setAttribute('draggable','true'); //the object has to be able to be moved later on by the user.
    temperatureStyleDiv.setAttribute('fromleft','true');
    temperatureStyleDiv.addEventListener('dragstart', drag2, false);

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
    temperatureStyleDiv.style.fontSize = temperatureStyleDiv.getAttribute('object-height') ;
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
