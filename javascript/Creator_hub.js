var dropCalls = 0;
var userWidth = window.screen.width;
var userHeight = window.screen.height;
var topPositionArray = [];
var leftPositionArray = [];
var objectStyleArray = [];
var objectIdArray = [];
var weatherTimeArray = [];
var userLatitude;
var userLongitude;



$(document).ready(function() {
    // localStorage.clear();
    // for (var k = 0; k < objectIdArray.length; k++) {
    //     delete topPositionArray[k];
    //     delete leftPositionArray[k];
    //     delete  objectStyleArray[k];
    //     delete  objectIdArray[k];
    //
    // }

    getLocation();
    setTimeout(checkIfLocalStorageExists(), 5000); //The timeouts are not working correctly and this has to be fixed later on in the project.
    setTimeout(addAttributesToWeatherOptionDiv(), 5000);
    setTimeout(createEventHandlers(), 5000);
});

function createEventHandlers() {
    $(document).on('click', '.dropbtn', function() {
        if ($('.dropdown-content').hasClass('show')) {
            $('.dropdown-content').removeClass('show');
        }
        else {
            $('.dropdown-content').addClass('show');
        }
    });
    window.onclick = function(e) {
        if (!e.target.matches('.dropbtn')) {
            var myDropdown = $(".dropdown-content");
            if (myDropdown.hasClass('show')) {
                myDropdown.removeClass('show');
            }
        }
    };

    $(document).on('click','.weather-option', function() {
        if ($(this).hasClass('clicked')) {
            $(this).removeClass('clicked');
            $(this).find('.hidden-options').css("display", "none");
        }
        else {
            // $(this).animate({'width': '388px', 'height': '350px'}, 200);
            $(this).addClass('clicked');
            $(this).find('.hidden-options').css("display", "block");
            // $('this .hidden-options').css("display", "block");
        }
    });

    $(document).click(function(e){
        var clickedObject = e.target.parentNode;
        // console.log("clicked object: " + clickedObject);
        // console.log("real clicked object " + e.target);
        if (clickedObject.classList.contains("icon-middle")) { //if it is a highlightable object
            // console.log("contains");
            $('.weather-choose-time option').remove();
            highLightObject(clickedObject);
        }
        //The icon should not be unhighlighted if you press specific objects on the screen.
        else if (e.target.classList.contains('hidden-options') || e.target instanceof HTMLButtonElement || e.target instanceof HTMLSelectElement) {
            // console.log("else if");
        }

        else { //if anywhere else was pressed on the screen then unhighlight an object if it already is highlighted.
            $('.icon-middle').each(function() {
                if ($(this).hasClass('highlighted')) { //remove the previous highlighted object
                    $(this).removeClass('highlighted');
                    hideDropDown();
                    hideDeleteButton();
                }
            });
        }
    });
}

/*
A function that gives an icon a highlighted effect.
 */
function highLightObject(clickedObject) {
    $('.icon-middle').each(function() {
        if ($(this).hasClass('highlighted')) { //remove the previous highlighted object
            $(this).removeClass('highlighted');
        }
    });
    clickedObject.classList.add('highlighted');
    showDropDown(clickedObject);
    showDeleteButton(clickedObject);

}

function showDropDown(highlightedObject) {
    console.log(highlightedObject);
    $('.weather-choose-time').css('display','block');
    var currentTimeOption = document.createElement('option');
    currentTimeOption.value ="current time";
    currentTimeOption.innerHTML = getText("current-time-option");
    var morningOption =  document.createElement('option');
    morningOption.value= "morning";
    morningOption.innerHTML = getText("morning-option");
    var middayOption = document.createElement('option');
    middayOption.value = "midday";
    middayOption.innerHTML = getText("midday-option");
    var afternoonOption = document.createElement('option');
    afternoonOption.value = "afternoon";
    afternoonOption.innerHTML = getText("afternoon-option");
    var eveningOption = document.createElement('option');
    eveningOption.value = "evening";
    eveningOption.innerHTML = getText('evening-option');
    // $('.weather-choose-time').append(currentTimeOption);
    var dropdown = document.getElementsByClassName('weather-choose-time')[0];
    dropdown.appendChild(currentTimeOption);
    dropdown.appendChild(morningOption);
    dropdown.appendChild(middayOption);
    dropdown.appendChild(afternoonOption);
    dropdown.appendChild(eveningOption);

    /*
    check the weatherTime attribute appeneded to the div. Depending on its' value change the selection in the dropdown.
     */
    for (var i = 0; i < dropdown.options.length; i++ ) {
        if (highlightedObject.getAttribute('weather-time') == dropdown.options[i].value) {
            dropdown.options[i].selected = true;
            break;
        }
    }

    //THIS IS NOT WORKING CORRECTLY.
    $( ".weather-choose-time" ).change(function() { //when an option is clicked in the dropdown menu
        // var newWeatherTime = $('.weather-choose-time option:selected').text();
        var newWeatherTime = (this.value);
        // console.log("event " + event);
        console.log(newWeatherTime);
        console.log(highlightedObject);
        highlightedObject.setAttribute('weather-time', newWeatherTime);

        updateWeatherTimeInformation(highlightedObject);
        // console.log (highlightedObject.style.top + " " + highlightedObject.style.left + " " + highlightedObject.id);

        //BECAUSE THE CHANGE FUNCTION IS NOT WORKING PROPERLY WE CANNOT CHANGE THE WEATHER ICON INSTANTLY.

        // highlightedObject.remove();
        // SMHICall(highlightedObject.style.top, highlightedObject.style.left, highlightedObject.id, highlightedObject.getAttribute('weather-time'));

    });

}

function updateWeatherTimeInformation(highlightedObject) {
    for (var i = 0; i < objectIdArray.length; i++) {
        if (objectIdArray[i] == highlightedObject.id) {
            weatherTimeArray[i] = highlightedObject.getAttribute('weather-time');
            updateLocalStorage();
        }
    }
}

function hideDropDown() {
    $('.weather-choose-time').css('display','none');
    $('.weather-choose-time option').remove(); //remove all options from the dropdown, otherwise the function above will add all options again.
}

function hideDeleteButton() {
    var deleteButton = document.getElementsByClassName('delete-button')[0];
    deleteButton.style.display = 'none';
}

function showDeleteButton(highlightedObject) {
    // if ($('.delete-button').css('display')=='none') {
    //     console.log("if");
    //     $('.delete-button').css('display','block');
    // }
    // else {
    //     $('.delete-button').css('display','none');
    // }

    var deleteButton = document.getElementsByClassName('delete-button')[0];
    deleteButton.style.display = 'block';

    deleteButton.addEventListener('click', function() {
        // console.log(highlightedObject.id);
        // console.log(objectIdArray);
        for (var i = 0; i < objectIdArray.length; i++ ) {
            if (objectIdArray[i] == highlightedObject.id) {
                // console.log("if " + i);
                objectIdArray.splice(i,1);
                objectStyleArray.splice(i,1);
                topPositionArray.splice(i,1);
                leftPositionArray.splice(i,1);
                weatherTimeArray.splice(i,1);

                updateLocalStorage();
                console.log(objectIdArray);
            }
        }
        hideDeleteButton();
        highlightedObject.remove();
    });

}


function addAttributesToWeatherOptionDiv() {
    var numberOfDivs = document.querySelectorAll('.weather-option').length;
    for (var i=0;i<numberOfDivs;i++) {
        // console.log('loop number: ' + i);
        var selectedDiv = document.getElementsByClassName('weather-option')[i];
        var iInt = i.toString();
        selectedDiv.setAttribute('weatherId', iInt);
        selectedDiv.setAttribute('draggable','true'); //add the eventlisteners here instead of in the html.
        selectedDiv.addEventListener('dragstart', drag, false);
        selectedDiv.addEventListener('dragenter', drag_enter, false);
        selectedDiv.addEventListener('dragleave',drag_leave,false);
    }

}


/*
These functions are used to add a border to the droppable area. They are not working correctly right now
since the draggable divs are smaller than the area they are located in.
 */
function drag_enter(ev) {
    document.getElementsByClassName('middle-side')[0].style.border = '3px dotted black';

}

function drag_leave(ev) {
    document.getElementsByClassName('middle-side')[0].style.border = "";

}
/*
We use two different drag events - one when you drag something from the left side of the screen and one when
you drag an already dragged object. The difference is that when you drag an already dragged object it has an attribute called
fromleft, which equals true. This makes it so that it doesn't create a new element when dropped. In the second drag function we also
give another attribute with the id of the selected element, so that the correct element is moved.
 */

function drag(ev) {
    var dropDiv = document.getElementsByClassName('middle-side')[0];
    dropDiv.style.border = "3px dotted black";

    var style = window.getComputedStyle(ev.target, null);
    ev.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) +
        ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY) + ',' + ev.target.getAttribute('weatherId'));
}

function drag2(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY) + ',' + event.target.getAttribute('fromleft') + ',' + event.target.getAttribute('id'));
}

/*
 Allows an option to be dropped into the middle side of the page. If this
 function is not called it won't be droppable.
 */
function dragOver(e) {
    e.preventDefault();

}

/*
When an option is dropped the function first checks if it has been already dragged from the left side or not.
If it has been dragged from the left side we do not have to create a new element and instead just move the element that is dropped.
If the element is dragged from the left we first check which option it is and then create the correct icon.
 */
function drop(ev, target) {
    // console.log('rör på samma objekt');
    target.style.border = 'none';
    dropCalls++; //enumerate the dropcalls so that when a new object is created it gets an unique id.

    var dropCallsString = dropCalls.toString(); //change the id into a string so that it can be parsed.
    var offset = ev.dataTransfer.getData("text/plain").split(','); //put the data into an array and split at a comma-sign.

    if (offset[2] == 'true') {
        var draggedId = offset[3];
        console.log("dragged more than once: " + draggedId);
        var draggedDiv = document.getElementById(draggedId);
        draggedDiv.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
        draggedDiv.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';

        var style = window.getComputedStyle(draggedDiv);
        var top = style.getPropertyValue('top');
        draggedDiv.setAttribute('top',top);
        var left = style.getPropertyValue('left');
        draggedDiv.setAttribute('left',left);


        weatherStyleToCss(draggedId, top, left, draggedDiv.getAttribute('object-style'), draggedDiv.getAttribute("weather-time"));

        // weatherStyleToCss(top, left, draggedId);

    }
    else if (offset[2] == 0) {
        var locationLeft = ev.pageX - '367' + 'px' ;
        var locationTop = ev.pageY - '53'+ 'px' ;
        SMHICall(locationTop, locationLeft, dropCallsString, "notExist");
    }

    else if (offset[2] == 1) {
        var cloudy = document.createElement('div');
        cloudy.setAttribute('id', dropCallsString);
        cloudy.setAttribute('class', 'icon-middle cloudy');
        cloudy.setAttribute('draggable','true');
        cloudy.setAttribute('fromleft','true');
        cloudy.addEventListener('dragstart', drag2, false);


        document.getElementsByClassName('middle-side')[0].appendChild(cloudy);

        // sunny.style.left = (ev.clientX + parseInt(offset[0],10)) + 'px';
        cloudy.style.left = ev.pageX - '367' + 'px' ;
        // sunny.style.top = (ev.clientY + parseInt(offset[1], 10)) + 'px';
        cloudy.style.top = ev.pageY - '53'+ 'px' ;
    }


    ev.preventDefault();

}

function createWeatherStyle(apiResponse, locationTop, locationLeft, divId, weatherTime) {
    var weatherStyleDiv = document.createElement('div');
    weatherStyleDiv.setAttribute('id', divId); //give an id so that we can choose the correct object to be dragged.

    var dropdown = document.getElementsByClassName('weather-choose-time')[0];
    // var weatherTime ="notExist";
    if(weatherTime !== "notExist") {
        weatherStyleDiv.setAttribute('weather-time',weatherTime);
        var timeDifference = calculateDateAndTimeDifference(apiResponse, weatherTime);
    }
    else {
        console.log("weathertimenotexist");
        weatherStyleDiv.setAttribute('weather-time', "current-time");
        var timeDifference = calculateDateAndTimeDifference(apiResponse, "current time");
    }
    console.log("timedifference " + timeDifference);
    var currentWeather = apiResponse.timeSeries[timeDifference].parameters[18].values[0];



    weatherStyleDiv.setAttribute('class','icon-middle sunny');
    weatherStyleDiv.setAttribute('draggable','true'); //the object has to be able to be moved later on by the user.
    weatherStyleDiv.setAttribute('fromleft','true');
    weatherStyleDiv.addEventListener('dragstart', drag2, false);

    //currentWeather = 4; //test another else if-statement
    if (currentWeather == 1 || currentWeather == 2) { //sunny
        console.log("is correct");
        var sun = document.createElement('div');
        sun.className ='sun';

        var rays = document.createElement('div');
        rays.className = 'rays';

        weatherStyleDiv.appendChild(sun);
        sun.appendChild(rays);
    }

    else if (currentWeather == 3 || currentWeather == 4 || currentWeather == 5 || currentWeather == 6 || currentWeather == 7) { //cloudy
        var cloud = document.createElement('div');
        cloud.className ='cloud';

        var cloud2 = document.createElement('div');
        cloud2.className = 'cloud';

        weatherStyleDiv.appendChild(cloud);
        weatherStyleDiv.appendChild(cloud2);
    }

    else if (currentWeather == 8) { //rain showers
        var cloud = document.createElement('div');
        cloud.className ='cloud';

        var sun = document.createElement('div');
        sun.className ='sun';

        var rays = document.createElement('div');
        rays.className = 'rays';

        var rain = document.createElement('div');
        rain.className = 'rain';

        weatherStyleDiv.appendChild(cloud);
        weatherStyleDiv.appendChild(sun);
        sun.appendChild(rays);
        weatherStyleDiv.append(rain);
    }

    else if (currentWeather == 12) { //rain
        var cloud = document.createElement('div');
        cloud.className ='cloud';

        var rain = document.createElement('div');
        rain.className = 'rain';

        weatherStyleDiv.appendChild(cloud);
        weatherStyleDiv.appendChild(rain);
    }

    else if (currentWeather == 9 || currentWeather == 13) { //lightning
        var cloud = document.createElement('div');
        cloud.className ='cloud';

        var lighting = document.createElement('div');
        lighting.className = 'lightning';

        var bolt1 = document.createElement('div');
        bolt1.className ='bolt';

        var bolt2 = document.createElement('div');
        bolt2.className = 'bolt';

        weatherStyleDiv.appendChild(cloud);
        weatherStyleDiv.appendChild(lighting);
        lighting.appendChild(bolt1);
        lighting.appendChild(bolt2);
    }

    else if (currentWeather == 10 || currentWeather == 11 || currentWeather == 14 || currentWeather == 15) { //snow
        var cloud = document.createElement('div');
        cloud.className = 'cloud';

        var snow = document.createElement('div');
        snow.className = 'snow';

        var flake1 = document.createElement('div');
        flake1.className = 'flake';

        var flake2 = document.createElement('div');
        flake2.className = 'flake';

        weatherStyleDiv.appendChild(cloud);
        weatherStyleDiv.appendChild(snow);
        snow.appendChild(flake1);
        snow.appendChild(flake2);
    }

    document.getElementsByClassName('middle-side')[0].appendChild(weatherStyleDiv);

    weatherStyleDiv.style.left = locationLeft ; //create an offset so that it is placed correctly
    weatherStyleDiv.style.top = locationTop ;

    var style = window.getComputedStyle(weatherStyleDiv);
    var top = style.getPropertyValue('top');
    weatherStyleDiv.setAttribute('top',top);
    var left = style.getPropertyValue('left');
    weatherStyleDiv.setAttribute('left',left);
    weatherStyleDiv.setAttribute('object-style', 'weather');





    if (weatherTime !== "notExist") {
        weatherStyleToCss(divId, top, left, weatherStyleDiv.getAttribute('object-style'), weatherTime);
    }
    else weatherStyleToCss(divId, top, left, weatherStyleDiv.getAttribute('object-style'), "current time");

}

/*
This function is called each time something is dropped. It takes the id of the dropped div together with its' position and style and
saves it into local storage. This way when the user is logged in again we can take the values from local storage and create a session
that was equal to the one the person exited from.
 */

function weatherStyleToCss(draggedId, topPosition, leftPosition, objectStyle, selectedTime) {
    //
    // var topInt = topPosition.replace(/\D/g,''); //Make the pixel value into an integer
    // var leftInt = leftPosition.replace(/\D/g,'');
    // var topPercent = (topInt - userHeight)/userHeight;
    // topPercent.toString(); //Change it back to a string and add a percent-sign.
    // topPercent += '%';
    // var leftPercent = (leftInt - userWidth)/userWidth;
    // leftPercent.toString();
    // leftPercent += '%';

    var index = objectIdArray.indexOf(draggedId);
    if (index !== -1) { //if the id is not found in the id-array
        leftPositionArray[index] = leftPosition;
        topPositionArray[index] = topPosition;
    }

    else {
        objectIdArray.push(draggedId);
        leftPositionArray.push(leftPosition);
        topPositionArray.push(topPosition);
        objectStyleArray.push(objectStyle);
        weatherTimeArray.push(selectedTime);
    }

    updateLocalStorage()

}

function updateLocalStorage() {
    window.localStorage.clear();

    localStorage.setItem("top", JSON.stringify(topPositionArray));
    localStorage.setItem("left", JSON.stringify(leftPositionArray));
    localStorage.setItem("object-style", JSON.stringify(objectStyleArray));
    localStorage.setItem("object-id",JSON.stringify(objectIdArray));
    localStorage.setItem("weather-time", JSON.stringify(weatherTimeArray));

}

function checkIfLocalStorageExists() {
    var objectIds = JSON.parse(localStorage.getItem('object-id'));
    var objectStyles = JSON.parse(localStorage.getItem('object-style'));
    var objectTopPositions = JSON.parse(localStorage.getItem('top'));
    var objectLeftPositions = JSON.parse(localStorage.getItem('left'));
    var weatherTime = JSON.parse(localStorage.getItem('weather-time'));

    if (objectIds !== null) { //if there is something in the local storage

        for (var i = 0; i < objectIds.length; i++) { //go through the whole local storage
            if (objectStyles[i] == "weather") { //if there is an object-style named weather, create a weather icon.
                dropCalls++;
                var dropCallsString = dropCalls.toString();

                SMHICall(objectTopPositions[i], objectLeftPositions[i], dropCallsString, weatherTime[i]);
            }
        }
    }
    else console.log("else");
}

function getDateAndTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var day = currentTime.getDate();

    return [hours, day];

}

function calculateDateAndTimeDifference(apiResponse, selectedWeatherTime) {
    var approvedDay = apiResponse.approvedTime[8] + apiResponse.approvedTime[9];

    var approvedHour = apiResponse.approvedTime[11] + apiResponse.approvedTime[12];

    var hoursToNextDay = 24 - approvedHour;

    if(selectedWeatherTime =="current time") {
        var currentDateAndTime = getDateAndTime();
        var currentHour = currentDateAndTime[0];
        var currentDay = currentDateAndTime[1];
        if (currentDay == approvedDay) {
            var differenceInHours = 1 + currentHour - approvedHour;
        }
        else {
            var hoursNeeded = approvedHour + hoursToNextDay;
        }
        // getCurrentWeather(apiResponse, differenceInHours);
        return differenceInHours;
    }

    else if(selectedWeatherTime == "morning") {
        if( approvedHour > "08") {
            var morningHoursNeeded =  hoursToNextDay + 9;
            return morningHoursNeeded;
        }
        else {
            var morningHoursNeeded = 9 - approvedHour;
            return morningHoursNeeded
        }
    }

    else if(selectedWeatherTime == "midday") {
        if(approvedHour > "12") {
            var middayHoursNeeded = hoursToNextDay + 13;
            return middayHoursNeeded
        }
        else {
            var middayHoursNeeded = 13 - approvedHour;
            return middayHoursNeeded;
        }
    }

    else if(selectedWeatherTime == "afternoon") {
        if (approvedHour > "17") {
            var afternoonHoursNeeded = hoursToNextDay + 18;
            return afternoonHoursNeeded;
        }

        else {
            var afternoonHoursNeeded = 18 - approvedHour;
            return afternoonHoursNeeded;
        }
    }

    else if(selectedWeatherTime == "evening") {
        if (approvedHour > "21") {
            var eveningHoursNeeded = hoursToNextDay + 22;
            return eveningHoursNeeded;
        }
        else {
            var eveningHoursNeeded = 22 - approvedHour;
            return eveningHoursNeeded;
        }
    }
}

function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else {
        alert("geolocation not supported by this browser");
        // userLongitude = "17.6389";
        // userLatitude = "59.8586";
    }
}
/*
The function works but it is very slow in getting the coordinates and the API will therefore give an error message.
 */
function showPosition(position) {
    console.log(position.coords);
    // if (position.coords == null) {
    //     console.log("timeout");
    //     setTimeout(function(){
    //         showPosition(position); }, 500);
    //     return false;
    // }
    // else {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        userLatitude.toString();
        userLongitude.toString();
        // console.log(userLatitude);
        // console.log(userLongitude);
    // }
}

function SMHICall(topPosition, leftPosition, divId, weatherTime) {
    userLongitude = "17.6389";
    userLatitude = "59.8586";
    // var endPoint = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/17.6389/lat/59.8586/data.json";
    var endPoint = "http://opendata-download-metfcst.smhi.se/api/category/pmp2g/version/2/geotype/point/lon/" + userLongitude + "/lat/" + userLatitude +"/data.json";

    /*
     1	Clear sky
     2	Nearly clear sky
     3	Variable cloudiness
     4	Halfclear sky
     5	Cloudy sky
     6	Overcast
     7	Fog
     8	Rain showers
     9	Thunderstorm
     10	Light sleet
     11	Snow showers
     12	Rain
     13	Thunder
     14	Sleet
     15	Snowfall
     */
    $.getJSON(endPoint, function(data) {
        /*
        The forecast ID-code is hidden deep in the response from the API-call. It is the last attribute received.
        The API does give a timeseries as well so we have to go through it and find the correct time right now.
        The API does also always give an approvedTime to be used as an reference to find the weather forecast right now.
        The first information in the timeseries is always given two hours prior to the approved time so we have to calculate
        which index in the time series we have to grab. The approvedtime can always be grabbed with the index 11 and 12 from the approvedTime string.
        The approved time can also have happened a day before so we also have to check the approved day by checking index 8 and 9 of the response.
         */


        console.log(data);//.timeSeries[1].parameters[18].values);
        // var localTime = getDateAndTime(data);
        // var currentHour = localTime[0];
        // var currentDate = localTime[1];
        // var timeDifference = calculateDateAndTimeDifference(data, currentHour, currentDate);
        // console.log(timeDifference);

        // createWeatherStyle(data.timeSeries[timeDifference].parameters[18].values[0], topPosition, leftPosition, divId);

        createWeatherStyle(data, topPosition, leftPosition, divId, weatherTime);
    });

}



