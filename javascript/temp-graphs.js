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
        canvasContainer.style.width = 600;
        canvasContainer.style.height = 600;
        canvasContainer.setAttribute('object-width', window.getComputedStyle(canvasContainer).getPropertyValue('width'));
        canvasContainer.setAttribute('object-height', window.getComputedStyle(canvasContainer).getPropertyValue('height'));
    }
    canvasContainer.appendChild(graphCanvas);
    document.getElementsByClassName('middle-side')[0].appendChild(canvasContainer);

    createLineGraph(apiResponse, graphCanvas, canvasContainer);



}

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
                        labelString: 'Time',
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
                        labelString: 'Temperature (\u00B0C)',
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

        var endHour = startHour + 20;
    }

    //create an array with all the time indexes that is returned to the draw function
    var indexArray = [];
    for (var i = startHour; i < endHour+1; i++) {
        indexArray[i] = i;
    }

    return indexArray;
}