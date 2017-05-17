/*
First of all we have to create a canvas to draw the graph on. The only difference between this and the
other create functions is that a canvas is appended to the div. The canvas is needed to draw the graph on..
 */
function createGraphCanvas(apiResponse, topPosition, leftPosition, divId, objectStyle, objectTime, objectWidth, objectHeight, objectFont) {
    var canvasContainer = document.createElement('div');
    canvasContainer.id = divId;
    canvasContainer.className = 'icon-middle resize-drag';

    var graphCanvas = document.createElement('canvas');
    graphCanvas.className = "my-canvas";
    graphCanvas.style.width = '100%';
    graphCanvas.style.height = '100%';


    canvasContainer.style.top = topPosition;
    canvasContainer.style.left = leftPosition;
    canvasContainer.setAttribute('top', topPosition);
    canvasContainer.setAttribute('left', leftPosition);

    canvasContainer.setAttribute('object-style', objectStyle);
    canvasContainer.setAttribute('weather-time', objectTime);

    if (objectFont !== "noFont") {
        fontFamilies2.push(objectFont); //add the font if there is a selected font

        canvasContainer.setAttribute('object-font', objectFont);

        //dateDiv.style.fontFamily = objectFont;
    }
    else canvasContainer.setAttribute('object-font', objectFont);

    if (objectWidth !== "startWidth" && objectHeight !== "startHeight") {
        console.log ("not start width & height");
        canvasContainer.style.width = objectWidth;
        canvasContainer.style.height = objectHeight;
        canvasContainer.setAttribute('object-width', objectWidth);
        canvasContainer.setAttribute('object-height', objectHeight);
    }
    else {
        canvasContainer.style.width = '300px';
        canvasContainer.style.height = '300px';
        canvasContainer.setAttribute('object-width', '300px');
        canvasContainer.setAttribute('object-height', '300px');
    }
    canvasContainer.appendChild(graphCanvas);
    document.getElementsByClassName('middle-side')[0].appendChild(canvasContainer);

    createLineGraph(apiResponse, graphCanvas, canvasContainer);



}

/*
THis function creates the whole line graph by getting the time span that the user has chosen and then calls another function to draw the graph.
 */
function createLineGraph(apiResponse, graphCanvas, canvasContainer) {
    //get the time span for which we want to show the graph
    var timeSpanIndexes = calculateIndexesForTimeSpan(apiResponse, canvasContainer.getAttribute('weather-time'));

    //for each index get the correct temperature and time for that temperature and store it so that they can be used to draw the graph
    var temperatureArray = [];
    var temperatureTimeArray = [];
    for (var i = 0; i < timeSpanIndexes.length; i++) {
        var temperatureIndex = timeSpanIndexes[i];
        temperatureArray[i] = apiResponse.timeSeries[temperatureIndex].parameters[1].values[0];
        temperatureTimeArray[i] = apiResponse.timeSeries[temperatureIndex].validTime[11] + apiResponse.timeSeries[temperatureIndex].validTime[12] + ":00";
    }

    console.log(temperatureArray);
    console.log(temperatureTimeArray);

    //initiate all the data for the line graph
    var data = {
        labels: temperatureTimeArray,
        datasets: [
            {
                label: "My First dataset",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(255,255,255,1)",
                borderColor: "rgba(255,255,255,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(255,255,255,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(255,255,255,1)",
                pointHoverBorderColor: "rgba(255,255,255,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: temperatureArray,
                spanGaps: false
            }
        ]
    };

    //create the line chart
    var myLineChart = new Chart(graphCanvas, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false,
                labels: {
                  fontColor: "rgba(255,255,255,1)"
              }
            },
            title: {
              fontColor: "rgba(255,255,255,1)"
            },
            scales: {
                xAxes: [{
                    gridLines: {
                      color: "rgba(255,255,255,0.4)",
                        zeroLineColor: "rgba(255,255,255,0.4)"
                    },
                    scaleLabel: { //add label to x-axis
                        display: true,
                        labelString: getText("time"),
                        fontColor: "rgba(255,255,255,1)"
                    },
                    display:true,
                    ticks: {
                        fontColor: "rgba(255,255,255,1)"
                    }

                }],
                yAxes: [{ //add label to y-axis
                    gridLines: {
                        color: "rgba(255,255,255,0.4)",
                        zeroLineColor: "rgba(255,255,255,0.4)"
                    },
                    scaleLabel: {
                        display: true,
                        labelString: getText("temperature") + '( \u00B0C)',
                        fontColor: "rgba(255,255,255,1)"
                    },
                    display:true,
                    ticks: {
                        fontColor: "rgba(255,255,255,1)"
                    }
                }]
            }
        }
    });
}

function calculateIndexesForTimeSpan(apiResponse, givenTimeSpan) {
    var approvedDay = apiResponse.approvedTime[8] + apiResponse.approvedTime[9];

    var approvedHour = apiResponse.approvedTime[11] + apiResponse.approvedTime[12];

    var hoursToNextDay = 24 - approvedHour;

    var currentDateAndTime = getDateAndTime();
    var currentHour = currentDateAndTime[0];
    var currentDay = currentDateAndTime[1];

    // if the graph should show the whole day we have to get the indexes for the whole day
    if (givenTimeSpan == "whole-day") {
        if (currentDay == approvedDay) {
            var startHour = 0;
        }
        else var startHour = hoursToNextDay;

        var endHour = 24 - approvedHour;
    }

    else {
        //split the given times into a start- and end time
        var indexOfSplit = givenTimeSpan.indexOf("-");
        var startTime = givenTimeSpan.substr(0,indexOfSplit);
        var endTime = givenTimeSpan.substr(indexOfSplit + 1, givenTimeSpan.length);
        var timeSpan = endTime - startTime;
        var approvedHourInt = Number(approvedHour);

        if (currentDay == approvedDay) {
            if (startTime < approvedHourInt){
                var difference = approvedHourInt - startTime;
                var startHour = approvedHourInt - startTime - difference;
            }
            else {
                var startHour = startTime - approvedHourInt + 1;
            }
        }

        else {
            var startHour = hoursToNextDay + startTime;
        }
        var endHour = startHour + timeSpan;
    }

    //create an array with all the time indexes that is returned to the draw function
    var indexArray = [];
    for (var i = 0; i < endHour - startHour + 1; i++) {
        indexArray[i] = startHour + i;
    }
    return indexArray;
}

/*
This function creates all the options that an user can do with a temperature graph. The options
are displayed in the options div.
 */
function showLineGraphTimeChooser() {
    var wholeTimeChooserContainer = document.createElement('div');
    wholeTimeChooserContainer.className = 'line-time-container';
    var checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'line-check-container';

    var wholeDayCheckbox = document.createElement('input');
    wholeDayCheckbox.type = "checkbox";
    wholeDayCheckbox.className = "line-checkbox";

    //append everything to the different divs and then to the right side of the page.
    checkboxContainer.innerHTML = getText('graph-checkbox');
    checkboxContainer.appendChild(wholeDayCheckbox);
    wholeTimeChooserContainer.appendChild(checkboxContainer);
    // inputContainer.appendChild(fromTimeDiv);
    // inputContainer.appendChild(fromTimeInput);
    // inputContainer.appendChild(endTimeDiv);
    // inputContainer.appendChild(endTimeInput);
    // wholeTimeChooserContainer.appendChild(inputContainer);
    document.getElementsByClassName('text-bubble')[0].appendChild(wholeTimeChooserContainer);
    wholeTimeChooserContainer.style.display = "inline-block";

    //automatically fill the checkbox if the user has chosen to show the graph for the whole day.
   //also add an overlay to the input fields so that they cannot be pressed.
    if (currentHighlightedObject.getAttribute('weather-time') == "whole-day") {
        wholeDayCheckbox.setAttribute('checked', 'checked');
        //showOrHideInputOverlay();
        //disable the input fields
        //fromTimeInput.setAttribute('disabled', 'true');
        //endTimeInput.setAttribute('disabled', 'true');
    }
    //if the user has specified a time span
    else {
        showOrHideInputOverlay();
        //get the time span from the weather-time attribute and split them up into two variables
        var givenTimeSpan = currentHighlightedObject.getAttribute('weather-time');
        var indexOfSplit = givenTimeSpan.indexOf("-");
        var startTime = givenTimeSpan.substr(0,indexOfSplit);
        var endTime = givenTimeSpan.substr(indexOfSplit + 1, givenTimeSpan.length);
        document.getElementsByClassName('from-time-input')[0].value = startTime;
        document.getElementsByClassName('end-time-input')[0].value = endTime;
    }
}

/*
Depending on the weather-time attribute and the "show whole day"-checkbox this function will
grey out the input field or make them clickable
 */
function showOrHideInputOverlay() {

    var inputContainer = document.getElementsByClassName('line-input-container')[0];

    if (inputContainer) {
        //animate the removal of the overlay
        anime({
            targets: inputContainer,
            opacity: 0,
            easing: 'easeInOutQuart'
        });
        var waitForAnimationToComplete = setTimeout(function() {
            inputContainer.style.display = 'none';
            inputContainer.remove()
        }, 500);

    }
    else {
        var inputContainer = document.createElement('div');
        inputContainer.className = 'line-input-container';
        inputContainer.style.opacity = "0";

        var fromTimeDiv = document.createElement('div');
        fromTimeDiv.className = 'from-time-div';
        fromTimeDiv.innerHTML = getText('from-time-explain');
        fromTimeDiv.innerHTML += "<br>" + getText('from-time');

        var endTimeDiv = document.createElement('div');
        endTimeDiv.className = 'end-time-div';
        endTimeDiv.innerHTML = getText('end-time');

        var fromTimeInput = document.createElement('input');
        fromTimeInput.type = "number";
        fromTimeInput.className = "from-time-input";
        var fromTimePlaceholder = getText('from-time-place');
        fromTimeInput.setAttribute('placeholder', fromTimePlaceholder);

        var endTimeInput = document.createElement('input');
        endTimeInput.type = "number";
        endTimeInput.className = "end-time-input";
        var endTimePlaceholder = getText('end-time-place');
        endTimeInput.setAttribute('placeholder', endTimePlaceholder);

        inputContainer.appendChild(fromTimeDiv);
        inputContainer.appendChild(fromTimeInput);
        inputContainer.appendChild(endTimeDiv);
        inputContainer.appendChild(endTimeInput);
        document.getElementsByClassName('line-time-container')[0].appendChild(inputContainer);
        //animate the adding of the overlay.
        anime({
            targets: inputContainer,
            opacity: 1,
            easing: 'easeInOutQuart'
        });
    }



}

/*
Function that checks the input length when specifying for which time period they want the graph.
The function will not let the user write more than two characters since it only takes whole hours as input.
 */
function checkInputFieldLength(inputField) {
    var inputFieldLength = inputField.value.length;

    if(inputFieldLength <= 1) { //less or equal to two characters
        return true
    }
    else { //more than two characters then change the last characters value to the new value
        var inputFieldValue = inputField.value;
        inputFieldValue = inputFieldValue.substring(0, inputFieldValue.length - 1);
        inputField.value = inputFieldValue;
    }
}

//this function hides everything on the right side screen.
function hideLineGraphTimeChooser() {
    var wholeTimeChooserContainer = document.getElementsByClassName('line-time-container')[0];
    if (wholeTimeChooserContainer) {
        wholeTimeChooserContainer.style.display = 'none';
        wholeTimeChooserContainer.remove();
    }
}

//this function checks if values have been entered into the input fields and if so creates a new graph.
function checkInputFields() {
    //if the show whole day checkbox is filled don't do anything
    if(currentHighlightedObject.getAttribute('weather-time') == "whole-day") {
        return true
    }

    else {
        var inputValues = getInputValues(document.getElementsByClassName('from-time-input')[0], document.getElementsByClassName('end-time-input')[0]);
        var fromTimeInputValue = inputValues[0];
        var endTimeInputValue = inputValues[1];

        //if the user enters values that are outside a clocks hours or if the start value is higher than the end value display an error message. Also display error if the input fields are empty.
        if (fromTimeInputValue > 23 || endTimeInputValue > 23 || fromTimeInputValue > endTimeInputValue ||fromTimeInputValue.length == 0 || endTimeInputValue == 0) {
            currentHighlightedObject.setAttribute('weather-time', 'whole-day');
            console.log("values entered was outside of time range")
        }

        //otherwise create a new weather-time attribute value and store it.
        else {
            var attributeValue = fromTimeInputValue + "-" + endTimeInputValue;
            currentHighlightedObject.setAttribute('weather-time', attributeValue);
            currentHighlightedObject.remove();
            SMHICall(currentHighlightedObject.style.top, currentHighlightedObject.style.left, currentHighlightedObject.id, currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'),currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('object-font'));
        }
    }
}

/*
function that gets the input values from the choose start and end time input fields when a temperature graph is highlighted.
 */
function getInputValues(fromTimeInput, endTimeInput) {
    var fromTimeInputValue = fromTimeInput.value;
    var endTImeInputValue = endTimeInput.value;
    var fromTimeInputValueInt = Number(fromTimeInputValue);
    var endTimeInputValueInt = Number(endTImeInputValue);

    return [fromTimeInputValueInt, endTimeInputValueInt];
}