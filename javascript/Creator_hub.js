var dropCalls = 0;
var userWidth = window.screen.width;
var userHeight = window.screen.height;
var topPositionArray = [];
var leftPositionArray = [];
var objectStyleArray = [];
var objectIdArray = [];

$(document).ready(function() {
    console.log(JSON.parse(localStorage.getItem('top')));
    checkIfLocalStorageExists();
    createSessionStyle();
    addAttributesToWeatherOptionDiv();
    createEventHandlers();
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
        highLightObject(clickedObject);
        // console.log(clickedObject);

    });
}

/*
A function that gives an icon a highlighted effect.
 */
function highLightObject(clickedObject) {

    $('.icon-middle').each(function() {
        // console.log($(this));
        if ($(this).hasClass('highlighted')) { //remove the previous highlighted object
            $(this).removeClass('highlighted');
        }
        if(clickedObject.classList.contains('icon-middle')) { //only highlight an object if it is a dragged element. This also removes highlight from an object if you press anywhere else on the screen.
            clickedObject.classList.add('highlighted');
            showDeleteButton(clickedObject);
        }

        else if (clickedObject.classList.contains('hidden-options') || clickedObject instanceof HTMLButtonElement || clickedObject.classList.contains('clickable')) {
            console.log("elseif");
            return;
        }

        else {
            hideDeleteButton();
        }
    });

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

                updateLocalStorage();
            }
        }
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



        weatherStyleToCss(draggedId, top, left, draggedDiv.getAttribute('object-style'));

        // weatherStyleToCss(top, left, draggedId);

    }
    else if (offset[2] == 0) {
            var sunny = document.createElement('div');
            sunny.setAttribute('id', dropCallsString); //give an id so that we can choose the correct object to be dragged.
            // objectIdArray.push(dropCallsString);
            console.log("dragged first time: " + dropCallsString);

            sunny.setAttribute('class','icon-middle sunny');
            sunny.setAttribute('draggable','true'); //the object has to be able to be moved later on by the user.
            sunny.setAttribute('fromleft','true');
            sunny.addEventListener('dragstart', drag2, false);

            var sun = document.createElement('div');
            sun.className ='sun';

            var rays = document.createElement('div');
            rays.className = 'rays';

            sunny.appendChild(sun);
            sun.appendChild(rays);
            // placementDiv.appendChild(sunny);
            document.getElementsByClassName('middle-side')[0].appendChild(sunny);

            sunny.style.left = ev.pageX - '367' + 'px' ; //create an offset so that it is placed correctly
            sunny.style.top = ev.pageY - '53'+ 'px' ;

            var style = window.getComputedStyle(sunny);
            var top = style.getPropertyValue('top');
            sunny.setAttribute('top',top);
            var left = style.getPropertyValue('left');
            sunny.setAttribute('left',left);
            sunny.setAttribute('object-style', 'weather');



            weatherStyleToCss(dropCallsString, top, left, sunny.getAttribute('object-style'));
            // weatherStyleToCss(top, left, sunny.id);
    }

    else if (offset[2] == 1) {
        var cloudy = document.createElement('div');
        cloudy.setAttribute('id', dropCallsString);
        cloudy.setAttribute('class', 'icon-middle cloudy');
        cloudy.setAttribute('draggable','true');
        cloudy.setAttribute('fromleft','true');
        cloudy.addEventListener('dragstart', drag2, false);

        var cloud = document.createElement('div');
        cloud.className ='cloud';

        var cloud2 = document.createElement('div');
        cloud2.className = 'cloud';

        cloudy.appendChild(cloud);
        cloudy.appendChild(cloud2);
        document.getElementsByClassName('middle-side')[0].appendChild(cloudy);

        // sunny.style.left = (ev.clientX + parseInt(offset[0],10)) + 'px';
        cloudy.style.left = ev.pageX - '367' + 'px' ;
        // sunny.style.top = (ev.clientY + parseInt(offset[1], 10)) + 'px';
        cloudy.style.top = ev.pageY - '53'+ 'px' ;
    }


    ev.preventDefault();

}

/*
This function is called each time something is dropped. It takes the id of the dropped div together with its' position and style and
saves it into local storage. This way when the user is logged in again we can take the values from local storage and create a session
that was equal to the one the person exited from.
 */

function weatherStyleToCss(draggedId, topPosition, leftPosition, objectStyle) {
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
    }

    updateLocalStorage()

}

function updateLocalStorage() {
    window.localStorage.clear();

    localStorage.setItem("top", JSON.stringify(topPositionArray));
    localStorage.setItem("left", JSON.stringify(leftPositionArray));
    localStorage.setItem("object-style", JSON.stringify(objectStyleArray));
    localStorage.setItem("object-id",JSON.stringify(objectIdArray));
}

function checkIfLocalStorageExists() {
    var objectIds = JSON.parse(localStorage.getItem('object-id'));
    var objectStyles = JSON.parse(localStorage.getItem('object-style'));
    var objectTopPositions = JSON.parse(localStorage.getItem('top'));
    var objectLeftPositions = JSON.parse(localStorage.getItem('left'));

    if (objectIds !== null) { //if there is something in the local storage

        for (var i = 0; i < objectIds.length; i++) { //go through the whole local storage
            if (objectStyles[i] == "weather") { //if there is an object-style named weather, create a weather icon.
                dropCalls++;
                var dropCallsString = dropCalls.toString();

                var sunny = document.createElement('div');
                sunny.setAttribute('id', dropCallsString);
                sunny.setAttribute('class','icon-middle sunny');
                sunny.setAttribute('draggable','true');
                sunny.setAttribute('fromleft','true');
                sunny.addEventListener('dragstart', drag2, false);

                var sun = document.createElement('div');
                sun.className ='sun';

                var rays = document.createElement('div');
                rays.className = 'rays';

                sunny.appendChild(sun);
                sun.appendChild(rays);

                document.getElementsByClassName('middle-side')[0].appendChild(sunny);

                sunny.style.left = objectLeftPositions[i];
                sunny.style.top = objectTopPositions[i];

                var style = window.getComputedStyle(sunny);
                var top = style.getPropertyValue('top');
                sunny.setAttribute('top',top);
                var left = style.getPropertyValue('left');
                sunny.setAttribute('left',left);
                sunny.setAttribute('object-style', 'weather');


                weatherStyleToCss(dropCallsString, top, left, sunny.getAttribute('object-style'));
            }
        }
    }
    else console.log("else");
}

// function weatherStyleToCss() {
//     var style = document.getElementsByClassName('session-style')[0];
//     style.innerHTML ="";
//     $('.icon-middle').each(function() { //Go through each created element and for each of them save their top and left value into a style in the header.
//         var objectId = $(this).attr('id');
//
//         var objectStyle = $(this).attr('object-style');
//         var top = $(this).attr('top');
//         var topInt = top.replace(/\D/g,''); //Make the pixel value int  o an integer
//         var left = $(this).attr('left');
//         var leftInt = left.replace(/\D/g,'');
//         var topPercent = Math.abs(100*(topInt - userHeight)/userHeight);
//         topPercent.toString(); //Change it back to a string and add a percent-sign.
//         topPercent += '%';
//         var leftPercent = Math.abs(100*(leftInt - userWidth)/userWidth);
//         leftPercent.toString();
//         leftPercent += '%';
//
//         if (weatherStyleToCssCounter < 2) {
//             objectIdArray.push(objectId);
//         }
//
//         console.log(objectIdArray + ' ' + objectId);
//
//         var fromLeft = $(this).attr('fromleft');
//
//         if (fromLeft) {
//             for (var i = 0; i < objectIdArray.length; i++) {
//                 console.log("loop number: " + i);
//                 if (objectId == objectIdArray[i]) {
//                     console.log("moved same object");
//                     leftPositionArray[i] = leftPercent;
//                     topPositionArray[i] = topPercent;
//                 }
//             }
//         }
//
//
//             // else {
//             //     console.log("moved new object");
//             //     leftPositionArray.push(leftPercent);
//             //     topPositionArray.push(topPercent);
//             //     objectStyleArray.push(objectStyle);
//             //     objectIdArray.push(objectId);
//             //     break loop;
//             //
//             // }
//
//         console.log("after for loop");
//         weatherStyleToCssCounter++;
//
//
//
//         // style.innerHTML += " ." + objectStyle + ': {top: ' + topPercent + "; \n" + " left: " + leftPercent + ";} \n ";
//
//
//     });
//     localStorage.clear();
//
//     localStorage.setItem("top", JSON.stringify(topPositionArray));
//     localStorage.setItem("left", JSON.stringify(leftPositionArray));
//     localStorage.setItem("object-style", JSON.stringify(objectStyleArray));
//     console.log(JSON.parse(localStorage.getItem('top')));
// }

function createSessionStyle(){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.className = 'session-style';
    document.getElementsByTagName('head')[0].appendChild(style);
}


