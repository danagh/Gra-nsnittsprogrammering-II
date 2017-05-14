// var dropCalls = 0;
// var userWidth = window.screen.width;
// var userHeight = window.screen.height;
// var topPositionArray = [];
// var leftPositionArray = [];
// var objectStyleArray = [];
// var objectIdArray = [];
// var weatherTimeArray = [];
// var userLatitude;
// var userLongitude;
// var currentHighlightedObject;
// var objectWidthArray = [];
// var objectHeightArray = [];



$(document).ready(function() {

    //console.log("creator: " + fontFamilies2);


     localStorage.clear();
     for (var k = 0; k < objectIdArray.length; k++) {
        delete topPositionArray[k];
         delete leftPositionArray[k];
         delete  objectStyleArray[k];
         delete  objectIdArray[k];
     }


    // tutorialEventHandlers();
    // createWholeOverlay();

    getLocation();
    setTimeout(checkIfLocalStorageExists(), 5000); //The timeouts are not working correctly and this has to be fixed later on in the project.
    setTimeout(addAttributesToWeatherOptionDiv(), 5000);
    setTimeout(createEventHandlers(), 5000);
});

function createEventHandlers() {

    window.addEventListener("beforeunload", function(e){ //eventlistener that saves all changes before the user leaves the page.
        //console.log("leaving page");
        saveAllChanges();
    });

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
    //This eventhandler highlight objects so that more options pops up on the side for the user.
    $('.middle-side').click(function(e){
        hideInputField();
        hideSecondChooser();

        //if a highlighted object exists and it was a temperature graph we have to check the users changes and adapt accordingly.
        if (currentHighlightedObject) {
            if(currentHighlightedObject.getAttribute('object-style') == "temp-graph") {
                console.log("unhighlighted graph object");
                checkInputFields();
            }
        }

        hideLineGraphTimeChooser();
        if (e.target.classList.contains('icon-middle')) { //If an object div is pressed
            currentHighlightedObject = e.target;
        }
        else if (e.target.parentNode.classList.contains('icon-middle')) { //If an child of an object div is pressed still highlight the parent.
                currentHighlightedObject = e.target.parentNode;
        }
        else { //still highlight an object even if an object wasn't pressed
            currentHighlightedObject = e.target;
        }

        if (currentHighlightedObject.classList.contains("icon-middle")) { //if it is a highlightable object
            // console.log("contains");
            $('.weather-choose-time option').remove();
            hideInputField();
            hideFontSelector();
            highLightObject();

        }
        //The icon should not be unhighlighted if you press specific objects on the screen.
        else if (e.target.classList.contains('hidden-options') || e.target instanceof HTMLButtonElement || e.target instanceof HTMLSelectElement || e.target.classList.contains('resizer') ) {
            // console.log("else if");
        }

        else { //if anywhere else was pressed on the screen then unhighlight an object if it already is highlighted.
            $('.icon-middle').each(function() {
                if ($(this).hasClass('highlighted')) { //remove the previous highlighted object
                    $(this).removeClass('highlighted');
                    currentHighlightedObject = null;
                    hideDropDown();
                    hideDeleteButton();
                    // hideResizer();
                    hideFontSelector();


                }
            });
        }
    });

    $( ".weather-choose-time" ).change(function() { //when an option is clicked in the dropdown menu
        // var newWeatherTime = $('.weather-choose-time option:selected').text();
        switchWeatherTime(this);
    });
    $(document).on('click', '.undo-button', function() { //undo-button click listener
       checkLatestUndoAction();
    });

    $(document).on('click', '.redo-button', function() { //redo-button click listener
        checkLatestRedoAction();
    });

    //eventhandler when the second-chooser checkbox is pressed when a time-object is highlighted
    $(document).on('click', '.second-chooser', function(){ //show seconds checkbox click listener
        addToUndoArray(currentHighlightedObject.id, "changeSeconds",currentHighlightedObject.getAttribute('top'), currentHighlightedObject.getAttribute('left'), currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'), currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-font'), currentHighlightedObject.getAttribute('text-message'), currentHighlightedObject.getAttribute('seconds'));
        if ($(this).is(':checked')) { //if checkbox is clicked and checked show the seconds
            currentHighlightedObject.setAttribute('seconds', 'true');
        }
        else { //if checkbox is clicked and unchecked hide the seconds
            currentHighlightedObject.setAttribute('seconds', 'false');

        }

        changeSeconds();
    });

    //eventhandler for the whole day checkbox that is shown when a temperature graph is highlighted
    $(document).on('click', '.line-checkbox', function() {
        if ($(this).is(':checked')) { //if checkbox is clicked and checked hide the input fields
            currentHighlightedObject.setAttribute('weather-time','whole-day');
            SMHICall(currentHighlightedObject.style.top, currentHighlightedObject.style.left, currentHighlightedObject.id, currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'),currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('object-font'));
            currentHighlightedObject.remove();
            hideLineGraphTimeChooser();
            showOrHideInputOverlay();
        }
        else { //if checkbox is clicked and unchecked show the input fields
            console.log("unchecked");
            currentHighlightedObject.setAttribute('weather-time','placeholder');
            showOrHideInputOverlay();
        }
    });

    //eventhandler that chekcs each time the user writes something in one of the two input fields in the temperature graph
    $(document).on('keypress', '.from-time-input', function() {
        console.log($(this).val().length);
        checkInputFieldLength(document.getElementsByClassName('from-time-input')[0]);
    });

    $(document).on('keypress', '.end-time-input', function() {
        console.log($(this).val().length);
        checkInputFieldLength(document.getElementsByClassName('end-time-input')[0]);
    });

    // $('.resizer').mousedown(function() {
    //     console.log(currentHighlightedObject);
    //    initResize();
    // });

}

/*
A function that gives an icon a highlighted effect.
 */
function highLightObject() {

    $('.icon-middle').each(function() {
        if ($(this).hasClass('highlighted')) { //remove the previous highlighted object
            $(this).removeClass('highlighted');
        }
    });
    currentHighlightedObject.classList.add('highlighted');

    //A different kind of time-chooser will be shown if the user highlights a temperature graph
    //since the way of choosing time will be different.
    if (currentHighlightedObject.getAttribute('object-style') == "temp-graph") {
        showLineGraphTimeChooser();
    }
    else showDropDown();

    showDeleteButton();
    // showResizer();
    console.log(currentHighlightedObject);

    if(currentHighlightedObject.getAttribute('object-style') == "temperature" || currentHighlightedObject.getAttribute('object-style') == "text-message" || currentHighlightedObject.getAttribute('object-style') == "clock" || currentHighlightedObject.getAttribute('object-style') == "date") {
        showFontSelector();
    }
    if (currentHighlightedObject.getAttribute('object-style') == "text-message") {
        showInputField(currentHighlightedObject);
    }

    if (currentHighlightedObject.getAttribute('object-style') == "clock") {
        showSecondsChooser();
    }

}
//
//
//
// function hideResizer() {
//     var resizer = document.getElementsByClassName('resizer')[0];
//     // resizer.style.display='none';
//     resizer.remove();
// }
//
// function showResizer() {
//     // console.log(currentHighlightedObject);
//     var oldResizer = document.getElementsByClassName('resizer')[0];
//     if (oldResizer) {
//         oldResizer.style.display = "none";
//         oldResizer.remove();
//     }
//
//     var resizer = document.createElement('div');
//     resizer.className = 'resizer';
//     var bottom = window.getComputedStyle(currentHighlightedObject).getPropertyValue('bottom');
//     // var bottom = style.getPropertyValue('bottom');
//     var right = window.getComputedStyle(currentHighlightedObject).getPropertyValue('right');
//     resizer.style.bottom = bottom;
//     resizer.style.right = right;
//     document.getElementsByClassName("middle-side")[0].appendChild(resizer);
//
//
//     // currentHighlightedObject.appendChild(resizer);
//     resizer.addEventListener('mousedown', initResize, false);
// }
//
// function initResize(e) {
//     // console.log(currentHighlightedObject);
//     startX = e.clientX;
//     startY = e.clientY;
//     startWidth = parseInt(document.defaultView.getComputedStyle(currentHighlightedObject,null).width, 10);
//     startHeight = parseInt(document.defaultView.getComputedStyle(currentHighlightedObject,null).height, 10);
//     window.addEventListener('mousemove', resize, false);
//     window.addEventListener('mouseup', stopResize, false);
// }
//
// function resize(e) {
//     currentHighlightedObject.style.width = (startWidth + e.clientX - startX) + 'px';
//     currentHighlightedObject.style.height = (startHeight + e.clientY - startY) + 'px';
//     currentHighlightedObject.style.fontSize = currentHighlightedObject.style.height;
//     // currentHighlightedObject.style.width = (e.clientX - currentHighlightedObject.offsetLeft) + 'px';
//     // currentHighlightedObject.style.height = (e.clientY - currentHighlightedObject.offsetTop) + 'px';
// }
//
// function stopResize() {
//     // console.log(currentHighlightedObject);
//     window.removeEventListener('mousemove', resize, false);
//     window.removeEventListener('mouseup', stopResize, false);
//     updateObjectSize(document.defaultView.getComputedStyle(currentHighlightedObject,null).width, document.defaultView.getComputedStyle(currentHighlightedObject,null).height);
// }


// target elements with the "draggable" class

/*
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            console.log("end call");
        }
    });

<<<<<<< Updated upstream
// Martin lek igen
var mirror = undefined;

=======
*/

function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        // x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        // y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        x = (parseFloat(target.getAttribute('left')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('top')) || 0) + event.dy;

    var previousXPosition ;
    var previousYPosition;
    // translate the element
    // target.style.webkitTransform =
    //     target.style.transform =
    //         'translate(' + x + 'px, ' + y + 'px)';


    // Martins lekkod


     target.style.left = ((x / mirror.offsetWidth) * 100) + '%';
     target.style.top = ((y / mirror.offsetHeight) * 100) + '%';
    // Martin liker här nu, Danas kod finns under
    // target.style.left = x + 'px';
    // target.style.top = y + 'px';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
    target.setAttribute('top', y + 'px');
    target.setAttribute('left', x + 'px');
}

// this is used later in the resizing and gesture demos
// window.dragMoveListener = dragMoveListener;

//this function is used to save the previous position of the object before it is moved so that an undo action can move it back.
function getPreviousPosition(event) {
    var target = event.target;
    var previousTopPosition = target.getAttribute('top');
    var previousLeftPosition = target.getAttribute('left');
    return [previousTopPosition, previousLeftPosition];
}

interact('.resize-drag')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of it's parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,
        onstart: function(event) {
            previousPosition = getPreviousPosition(event);
        },
        // call this function on every dragmove event
        onmove: function(event) {
            dragMoveListener(event);
        } ,
        // call this function on every dragend event
        onend: function (event) {
            var previousTop = previousPosition[0];
            var previousLeft = previousPosition[1];
            var target = event.target;

            //add the action to the undo array
            addToUndoArray(target.id, "movedObject", previousTop, previousLeft, target.getAttribute('object-style'), target.getAttribute('weather-time'), target.getAttribute('object-width'), target.getAttribute('object-height'), target.getAttribute('object-font'), "noMessage");

           // weatherStyleToCss(target.id, target.getAttribute('top'), target.getAttribute('left'), target.getAttribute('object-style'), target.getAttribute("weather-time"));


        }
    })
    .resizable({
        preserveAspectRatio: true,
        edges: { left: false, right: true, bottom: true, top: false },

        onstart: function(event) {
          previousSize = getPreviousSize(event);
        },

        onmove: function(event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-xx')) || 0),
                 y = (parseFloat(target.getAttribute('data-yy')) || 0);

            // update the element's style
            target.style.width  = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';
            target.style.fontSize = event.rect.height/3 + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-xx', x);
            target.setAttribute('data-yy', y);
            //updateObjectSize(target, event.rect.width + 'px', event.rect.height + 'px');
            // target.setAttribute('object-width', event.rect.width + 'px');
            // target.setAttribute('object-height', event.rect.height + 'px');
            // weatherStyleToCss(target.id, target.getAttribute('top'), target.getAttribute('left'), target.getAttribute('object-style'), target.getAttribute('weather-time'), target.getAttribute('object-width'), target.getAttribute('object-height'),target.getAttribute('object-font'));
        },
        onend: function(event) {
            console.log("resize end");
            var target = event.target;
            var currentWidth = window.getComputedStyle(target).getPropertyValue('width');
            var currentHeight = window.getComputedStyle(target).getPropertyValue('height');

            var previousWidth = previousSize[0];
            var previousHeight = previousSize[1];

            addToUndoArray(target.id, "resizedObject", target.getAttribute('top'), target.getAttribute('left'), target.getAttribute('object-style'), target.getAttribute('weather-time'), previousWidth, previousHeight, target.getAttribute('object-font'), "noMessage");

            updateObjectSize(target, currentWidth, currentHeight);
        }
    /*
    .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-xx')) || 0),
            y = (parseFloat(target.getAttribute('data-yy')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';
        target.style.fontSize = event.rect.height/3 + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-xx', x);
        target.setAttribute('data-yy', y);
        updateObjectSize(target, event.rect.width + 'px', event.rect.height + 'px');
        // target.setAttribute('object-width', event.rect.width + 'px');
        // target.setAttribute('object-height', event.rect.height + 'px');
        // weatherStyleToCss(target.id, target.getAttribute('top'), target.getAttribute('left'), target.getAttribute('object-style'), target.getAttribute('weather-time'), target.getAttribute('object-width'), target.getAttribute('object-height'),target.getAttribute('object-font'));

    })
    */
    });


function updateObjectSize(target, newWidth, newHeight) {
    console.log(target);
    console.log(newWidth + newHeight);
    target.setAttribute('object-width',newWidth);
    target.setAttribute('object-height',newHeight);

    for (var i = 0; i < objectIdArray.length; i++) {
        if (objectIdArray[i] == target.id) {
            objectWidthArray[i] = newWidth;
            objectHeightArray[i] = newHeight;

            updateLocalStorage();
            break;
        }
    }
}

function getPreviousSize(event) {
    var target = event.target;
    var previousWidth = target.getAttribute('object-width');
    var previousHeight = target.getAttribute('object-height');

    return [previousWidth, previousHeight];
}

function showDropDown() {
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
        if (currentHighlightedObject.getAttribute('weather-time') == dropdown.options[i].value) {
            dropdown.options[i].selected = true;
            break;
        }
    }

}

/*
When an option is changed in the dropdown menu we need to change the weather time in the selected div and then
change the icon of the whole div itself.
 */
function switchWeatherTime(selectedValue) {
    var newWeatherTime = selectedValue.value;
    var currentWeatherTime = currentHighlightedObject.getAttribute('weather-time');
    //add the current weather time to the undo array so that it can be changed back.
    addToUndoArray(currentHighlightedObject.id, "changeTime", currentHighlightedObject.getAttribute('top'), currentHighlightedObject.getAttribute('left'), currentHighlightedObject.getAttribute('object-style'), currentWeatherTime, currentHighlightedObject.getAttribute('object-width'), currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-font'));

    currentHighlightedObject.setAttribute('weather-time', newWeatherTime);
    currentHighlightedObject.remove(); //remove the current object and create a new one in its place.
    SMHICall(currentHighlightedObject.style.top, currentHighlightedObject.style.left, currentHighlightedObject.id, currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'),currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('object-font'));
    hideDropDown();
    hideDeleteButton();
    // hideResizer();
    hideFontSelector();
    //updateWeatherTimeInformation();
}

/*
Update the global array for the weather time attribute and then update the local storage.
 */
function updateWeatherTimeInformation() {
    for (var i = 0; i < objectIdArray.length; i++) {
        if (objectIdArray[i] == currentHighlightedObject.id) {
            weatherTimeArray[i] = currentHighlightedObject.getAttribute('weather-time');
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

function showDeleteButton() {
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
        addToUndoArray(currentHighlightedObject.id, "deleteObject", currentHighlightedObject.getAttribute('top'), currentHighlightedObject.getAttribute('left'), currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'), currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-font'));
        deleteObject(currentHighlightedObject.id);

    });

}
/*
This function takes the specified object and deletes it, together with hiding the different right-side options.
 */
function deleteObject(objectId) {
    //if the deleted object is a time or date object the timer has to be removed or else they will keep on showing
    //up on the screen
    if (currentHighlightedObject.getAttribute('object-style') == "clock") {
        clearTimeout(clockTimer);
    }
    else if (currentHighlightedObject.getAttribute('object-style') == "date") {
        clearTimeout(dateTimer);
    }
    hideDeleteButton();
    hideDropDown();
    hideFontSelector();
    hideSecondChooser();
    // hideResizer();
    document.getElementById(objectId).remove();
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

// function drag2(event) {
//     // var oldResizer = document.getElementsByClassName('resizer')[0];
//     // if (oldResizer) {
//     //     oldResizer.style.display = "none";
//     //     oldResizer.remove();
//     // }
//     var style = window.getComputedStyle(event.target, null);
//     event.dataTransfer.setData("text/plain",
//         (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY) + ',' + event.target.getAttribute('fromleft') + ',' + event.target.getAttribute('id'));
// }

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
    if (mirror === undefined){
        mirror = document.getElementById("mirror");
    }
    // console.log('rör på samma objekt');
    target.style.border = 'none';
    dropCalls++; //enumerate the dropcalls so that when a new object is created it gets an unique id.

    var dropCallsString = dropCalls.toString(); //change the id into a string so that it can be parsed.
    var offset = ev.dataTransfer.getData("text/plain").split(','); //put the data into an array and split at a comma-sign.


    if (offset[2] == 'true') {
        var draggedId = offset[3];
        var draggedDiv = document.getElementById(draggedId);
        draggedDiv.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
        draggedDiv.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';

        var style = window.getComputedStyle(draggedDiv);
        var top = style.getPropertyValue('top');
        draggedDiv.setAttribute('top',top);
        var left = style.getPropertyValue('left');
        draggedDiv.setAttribute('left',left);


     //   weatherStyleToCss(draggedId, top, left, draggedDiv.getAttribute('object-style'), draggedDiv.getAttribute("weather-time"));

        // weatherStyleToCss(top, left, draggedId);

    }

    else if (offset[2] == 0) {
        console.log("drop else if");
        var locationLeft = ev.pageX - mirror.getBoundingClientRect().left - 50 + 'px';
        var locationTop = ev.pageY - mirror.getBoundingClientRect().top - 25 + 'px';
        SMHICall(locationTop, locationLeft, dropCallsString, "notExist", "startWidth", "startHeight", "weather", "noFont");
    }

    else if (offset[2] == 1) {
        var locationLeft = ev.pageX - mirror.getBoundingClientRect().left - 5 + 'px';
        var locationTop = ev.pageY - mirror.getBoundingClientRect().top - 3 + 'px';
        SMHICall(locationTop, locationLeft, dropCallsString, "notExist", "startWidth", "startHeight", "temperature", "noFont");
    }

    else if (offset[2] == 2) {
        var locationLeft = ev.pageX - mirror.getBoundingClientRect().left - 35 + 'px';
        var locationTop = ev.pageY - mirror.getBoundingClientRect().top - 3 + 'px';
        createTextMessage(locationTop, locationLeft, dropCallsString, "notExist", "startWidth", "startHeight", "text-message", "noFont", "noMessage");
    }

    else if (offset[2] == 3) {
        var locationLeft = ev.pageX - mirror.getBoundingClientRect().left - 25 + 'px';
        var locationTop = ev.pageY - mirror.getBoundingClientRect().top - 3 + 'px';
        createTimeObject(locationTop, locationLeft, dropCallsString, "clock", "no-time", "startWidth", "startHeight",  "noFont");
    }
    else if (offset[2] == 4) {
        var locationLeft = ev.pageX - mirror.getBoundingClientRect().left - 50 + 'px';
        var locationTop = ev.pageY - mirror.getBoundingClientRect().top - 3 + 'px';
        createDateObject(locationTop, locationLeft, dropCallsString, "date", "no-time", "startWidth", "startHeight",  "noFont");
    }

    else if (offset[2] == 5) { //if the dragged element is a graph
        var locationLeft = ev.pageX - mirror.getBoundingClientRect().left - 50 + 'px';
        var locationTop = ev.pageY - mirror.getBoundingClientRect().top - 3 + 'px';
        SMHICall(locationTop, locationLeft, dropCallsString, "whole-day", "startWidth", "startHeight", "temp-graph", "noFont");
    }
    ev.preventDefault();

}

function createWeatherStyle(apiResponse, locationTop, locationLeft, divId, weatherTime, objectWidth, objectHeight, functionCaller) {
    // var weatherStyleDiv = document.createElement('img');
    var weatherStyleDiv = document.createElement('div');
    weatherStyleDiv.setAttribute('id', divId); //give an id so that we can choose the correct object to be dragged.

    var dropdown = document.getElementsByClassName('weather-choose-time')[0];
    // var weatherTime ="notExist";
    if(weatherTime !== "notExist") {
        weatherStyleDiv.setAttribute('weather-time',weatherTime);
        var timeDifference = calculateDateAndTimeDifference(apiResponse, weatherTime);
    }
    else {
        weatherStyleDiv.setAttribute('weather-time', "current-time");
        var timeDifference = calculateDateAndTimeDifference(apiResponse, "current-time");
    }

    var currentWeather = apiResponse.timeSeries[timeDifference].parameters[18].values[0];



    weatherStyleDiv.setAttribute('class','icon-middle sunny resize-drag');
    // weatherStyleDiv.setAttribute('draggable','true'); //the object has to be able to be moved later on by the user.
    // weatherStyleDiv.setAttribute('fromleft','true');
    // weatherStyleDiv.addEventListener('dragstart', drag2, false);

    //currentWeather = 4; //test another else if-statement
    if (currentWeather == 1 || currentWeather == 2) { //sunny
        // console.log("is correct");
        var sun = document.createElement('div');
        sun.className ='sun';

        var rays = document.createElement('div');
        rays.className = 'rays';
        // var sun = document.createElement('img');
        // sun.addEventListener('dragstart', drag2, false);
        weatherStyleDiv.src="weathericons/simple_weather_icon_01.png";
        // weatherStyleDiv.style.content="url(weathericons/simple_weather_icon_01.png)";
        weatherStyleDiv.appendChild(sun);
        sun.appendChild(rays);
    }

    else if (currentWeather == 3 || currentWeather == 4 || currentWeather == 5 || currentWeather == 6 || currentWeather == 7) { //cloudy
        var cloud = document.createElement('div');
        var cloud2 = document.createElement('div');
        cloud.className = 'cloud';
        cloud2.className = 'cloud';
        // cloud.addEventListener('dragstart', drag2, false);
        // weatherStyleDiv.src= "weathericons/simple_weather_icon_04.png";
        // weatherStyleDiv.style.content= "url(weathericons/simple_weather_icon_04.png)";
        weatherStyleDiv.appendChild(cloud);
        cloud.appendChild(cloud2);
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
    weatherStyleDiv.setAttribute('object-font',"noFont");



    if (objectWidth == "startWidth" && objectHeight=="startHeight") {
        weatherStyleDiv.style.width = "100px";
        weatherStyleDiv.style.height = "50px";
        weatherStyleDiv.setAttribute('object-width',style.getPropertyValue('width'));
        weatherStyleDiv.setAttribute('object-height',style.getPropertyValue('height'));
    }
    else {
        weatherStyleDiv.style.width = objectWidth;
        weatherStyleDiv.style.height = objectHeight;
        weatherStyleDiv.setAttribute('object-width',objectWidth);
        weatherStyleDiv.setAttribute('object-height',objectHeight);
    }
    var fontSize = parseFloat(weatherStyleDiv.getAttribute('object-height'));
    weatherStyleDiv.style.fontSize = fontSize/3 + 'px';

    if (functionCaller == "drop") { //the object should only be added to the undo array if the user made the drop-action
        console.log("drop function caller");
        addToUndoArray(weatherStyleDiv.id, "addObject", top, left, weatherStyleDiv.getAttribute('object-style'), weatherTime, weatherStyleDiv.getAttribute('object-width'), weatherStyleDiv.getAttribute('object-height'),"noFont", "noMessage");
    }


    if (weatherTime !== "notExist") {
      //  weatherStyleToCss(divId, top, left, weatherStyleDiv.getAttribute('object-style'), weatherTime, weatherStyleDiv.getAttribute('object-width'), weatherStyleDiv.getAttribute('object-height'),"noFont");
    }
   // else weatherStyleToCss(divId, top, left, weatherStyleDiv.getAttribute('object-style'), "current-time", weatherStyleDiv.getAttribute('object-width'), weatherStyleDiv.getAttribute('object-height'),"noFont");

}

/*
This function is called each time something is dropped. It takes the id of the dropped div together with its' position and style and
saves it into local storage. This way when the user is logged in again we can take the values from local storage and create a session
that was equal to the one the person exited from.
 */

function weatherStyleToCss(draggedId, topPosition, leftPosition, objectStyle, selectedTime, objectWidth, objectHeight, objectFont) {
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
        objectWidthArray.push(objectWidth);
        objectHeightArray.push(objectHeight);
        objectFontArray.push(objectFont);
    }

    updateLocalStorage()

}

/*
This function saves all the user's changes. It is only done when the user leaves the website to
minimize the amount of calls to this function.
 */
function saveAllChanges() {
    $('.icon-middle').each(function(i, obj) {
        objectIdArray.push($(this).attr('id'));
        leftPositionArray.push($(this).attr('left'));
        topPositionArray.push($(this).attr('top'));
        objectStyleArray.push($(this).attr('object-style'));
        weatherTimeArray.push($(this).attr('weather-time'));
        objectWidthArray.push($(this).attr('object-width'));
        objectHeightArray.push($(this).attr('object-height'));
        objectFontArray.push($(this).attr('object-font'));
        objectTextMessages.push($(this).attr('text-message'));
        showSecondsArray.push($(this).attr('seconds'));
    });
    updateLocalStorage();
}

/*
After the changes has been saved in the different arrays localstorage has to be updated with the changes.
 */
function updateLocalStorage() {
    window.localStorage.clear();

    localStorage.setItem("top", JSON.stringify(topPositionArray));
    localStorage.setItem("left", JSON.stringify(leftPositionArray));
    localStorage.setItem("object-style", JSON.stringify(objectStyleArray));
    localStorage.setItem("object-id",JSON.stringify(objectIdArray));
    localStorage.setItem("weather-time", JSON.stringify(weatherTimeArray));
    localStorage.setItem("object-width", JSON.stringify(objectWidthArray));
    localStorage.setItem("object-height", JSON.stringify(objectHeightArray));
    localStorage.setItem("object-font", JSON.stringify(objectFontArray));
    localStorage.setItem("font-families",JSON.stringify(fontFamilies2));
    localStorage.setItem("object-message",JSON.stringify(objectTextMessages));
    localStorage.setItem("seconds",JSON.stringify(showSecondsArray));
}

function checkIfLocalStorageExists() {
    var objectIds = JSON.parse(localStorage.getItem('object-id'));
    var objectStyles = JSON.parse(localStorage.getItem('object-style'));
    var objectTopPositions = JSON.parse(localStorage.getItem('top'));
    var objectLeftPositions = JSON.parse(localStorage.getItem('left'));
    var weatherTime = JSON.parse(localStorage.getItem('weather-time'));
    var objectWidth = JSON.parse(localStorage.getItem('object-width'));
    var objectHeight = JSON.parse(localStorage.getItem('object-height'));
    var objectFont = JSON.parse(localStorage.getItem('object-font'));
    var textMessages = JSON.parse(localStorage.getItem('object-message'));
    var showSeconds = JSON.parse(localStorage.getItem('seconds'));


    if (objectIds !== null) { //if there is something in the local storage
        // console.log("localStorage exists");
        var fontFamilies = JSON.parse(localStorage.getItem('font-families')); //Do not create the fontfamilies if there is no local storage because it will mess with some other functions.
        console.log("checkif: " + fontFamilies);

        WebFontConfig = { //these rows adds the font families to a google call so that they can be shown to the user.
            google: {
                families: fontFamilies
            }
        };

        for (var i = 0; i < objectIds.length; i++) { //go through the whole local storage
            if (objectStyles[i] == "weather" || objectStyles[i] == "temperature") { //if there is an object-style named weather, create a weather icon.
                dropCalls++;
                var dropCallsString = dropCalls.toString();
                SMHICall(objectTopPositions[i], objectLeftPositions[i], dropCallsString, weatherTime[i], objectWidth[i], objectHeight[i], objectStyles[i], objectFont[i]);
            }
            else if (objectStyles[i] == "text-message") {
                dropCalls++;
                var dropCallsString = dropCalls.toString();

                createTextMessage(objectTopPositions[i], objectLeftPositions[i], dropCallsString, weatherTime[i], objectWidth[i], objectHeight[i], objectStyles[i], objectFont[i], textMessages[i]);
            }
            else if (objectStyles[i] == "clock") {
                dropCalls++;
                var dropCallsString = dropCalls.toString();
                createTimeObject(objectTopPositions[i], objectLeftPositions[i], dropCallsString, objectStyles[i], weatherTime[i], objectWidth[i], objectHeight[i], objectFont[i], showSeconds[i]);
            }
            else if (objectStyles[i] == "date") {
                dropCalls++;
                var dropCallsString = dropCalls.toString();
                createDateObject(objectTopPositions[i], objectLeftPositions[i], dropCallsString, objectStyles[i], weatherTime[i], objectWidth[i], objectHeight[i], objectFont[i]);
            }
            else if (objectStyles[i] == "temp-graph") {
                dropCalls++;
                var dropCallsString = dropCalls.toString();
                SMHICall(objectTopPositions[i], objectLeftPositions[i], dropCallsString, weatherTime[i], objectWidth[i], objectHeight[i], objectStyles[i], objectFont[i]);
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

    if(selectedWeatherTime =="current-time") {
        var currentDateAndTime = getDateAndTime();
        var currentHour = currentDateAndTime[0];
        var currentDay = currentDateAndTime[1];
        if (currentDay == approvedDay) {
            var differenceInHours = 1 + currentHour - approvedHour;
        }
        else {
            var hoursNeeded = approvedHour + hoursToNextDay;
        }
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

function SMHICall(topPosition, leftPosition, divId, objectTime, objectWidth, objectHeight, objectStyle, objectFont) {
    userLongitude = "17.6389";
    userLatitude = "59.8586";
    console.log(objectTime);
    var functionCaller = arguments.callee.caller.name;
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
        // if(arguments.callee.caller.name == "checkIfLocalStorageExi")

        if (objectStyle =="weather") {
            createWeatherStyle(data, topPosition, leftPosition, divId, objectTime, objectWidth, objectHeight, functionCaller);
        }
        else if(objectStyle=="temperature") {
            createTemperatureStyle(data, topPosition, leftPosition, divId, objectTime, objectWidth, objectHeight, objectFont, functionCaller);
        }

        else if (objectStyle=="temp-graph") {
            createGraphCanvas(data, topPosition, leftPosition, divId, objectStyle, objectTime, objectWidth, objectHeight, objectFont);
        }
    });

}



