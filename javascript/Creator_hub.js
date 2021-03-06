/*
This function handles the creation of the weather objects, all the event listeners and the drag and drop actions from the left side to the middle.
 */




$(document).ready(function() {

     // delStorage();

   createLoadingCanvas();
    getLocation();

    // checkIfLocalStorageExists();
    // addAttributesToWeatherOptionDiv();
    // createEventHandlers();


});

//Function used by us to delete the local storage.
function delStorage() {
    localStorage.clear();
    for (var k = 0; k < objectIdArray.length; k++) {
        delete topPositionArray[k];
        delete leftPositionArray[k];
        delete  objectStyleArray[k];
        delete  objectIdArray[k];
    }
}

function createEventHandlers() {

    window.addEventListener("beforeunload", function(e){ //eventlistener that saves all changes before the user leaves the page.
        //console.log("leaving page");
        saveAllChanges();
    });
    /*
    $(document).on('click', '.dropbtn', function() { /
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
    */

    $(document).on('click', '.magic', function() { //easter egg when clicking on our name in the top left corner
        createPremadeMirror();
        updateLocalStorage();
        checkIfLocalStorageExists();
    });

    /*
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
    */

    //This eventhandler highlight objects so that more options pops up on the side for the user.
    $('.middle-side').click(function(e){
        hideInputField();

        //The icon should not be unhighlighted if you press specific objects on the screen.
        if (e.target.classList.contains('text-bubble') || e.target.classList.contains('checkboxTwo') || e.target.classList.contains('line-input-container') || e.target instanceof HTMLLabelElement || e.target instanceof HTMLButtonElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLSpanElement || e.target instanceof HTMLInputElement || e.target instanceof String) {
            return true;
        }

        //if a highlighted object exists and it was a temperature graph we have to check the users changes and adapt accordingly.
        if(currentHighlightedObject) {
            if (currentHighlightedObject.getAttribute('object-style') == "temp-graph") {
                checkInputFields();
            }
        }

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
            $('.weather-choose-time option').remove();
            highLightObject();

        }

        else { //if anywhere else was pressed on the screen then unhighlight an object if it already is highlighted.
            removeOptionsDiv();
            $('.icon-middle').each(function() {
                if ($(this).hasClass('highlighted')) { //remove the previous highlighted object
                    $(this).removeClass('highlighted');
                    currentHighlightedObject = null;
                }
            });
        }
    });



    //undo and redo event-listeners
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
            removeOptionsDiv();
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
        checkInputFieldLength(document.getElementsByClassName('from-time-input')[0]);
    });

    $(document).on('keypress', '.end-time-input', function() {
        checkInputFieldLength(document.getElementsByClassName('end-time-input')[0]);
    });
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

    createOptionsDiv(); //show the highlighted object's options
}

/*
Create a div where all the options for the object will be displayed. Depending on the highlighted
objects position the div will appear on the left or right side of the highlighted object.
 */
function createOptionsDiv() {
    //if the user highlights another object the optionsdiv for the current highlighted object has to be removed.
    var optionsDivAlreadyExists = document.getElementsByClassName('text-bubble')[0];
    if (optionsDivAlreadyExists) {
        optionsDivAlreadyExists.style.display = "none";
        optionsDivAlreadyExists.remove();
    }

    //get the position of the parent element so that we know where the optionsdiv should be placed.
    var leftString = currentHighlightedObject.getAttribute('left');
    var leftInt = parseFloat(leftString);
    var topString = currentHighlightedObject.getAttribute('top');
    var topInt = parseFloat(topString);
    var rightString = currentHighlightedObject.getAttribute('object-width');
    var rightInt = parseFloat(rightString);
    rightInt = rightInt + leftInt;

    //if the left position of the highlighted object is in pixels convert it into percent so that it's adaptable to the screen size.
    if (leftString.indexOf('px') != -1 && topString.indexOf('px') != -1) { //if the string "px" exists
        leftString = ((leftInt / mirror.offsetWidth) * 100) + '%';
        leftInt = parseFloat(leftString);
        rightString = ((rightInt / mirror.offsetWidth) * 100) + '%';
        rightInt = parseFloat(rightString);
        topString = ((topInt / mirror.offsetHeight) * 100) + '%';
        topInt = parseFloat(topString);
    }

    var optionsDiv = document.createElement('div');

    //depending on the position of the object the optionsbubble should appear on the left or right side of the object
    if(leftInt < 45) {
        var optionsRight = rightInt + 4.5;
        optionsDiv.style.left = optionsRight + '%';

        //depending on the top-position of the object the text bubble should appear from the top or bottom.
        if(topInt > 43) {
            var optionsTop = topInt - 34.5;
            optionsDiv.className = 'text-bubble right';
        }
        else {
            var optionsTop = topInt - 0.5;
            optionsDiv.className = 'text-bubble right-top'
        }
    }
    else  {
        var optionsLeft = leftInt - 40.7;
        optionsDiv.style.left = optionsLeft + '%';

        if(topInt > 43) {
            var optionsTop = topInt - 34.5;
            optionsDiv.className = 'text-bubble left';
        }
        else {
            var optionsTop = topInt - 0.5;
            optionsDiv.className = 'text-bubble left-top'
        }
    }

    optionsDiv.style.top = optionsTop + '%';
    optionsDiv.style.height = "0px";
    document.getElementsByClassName('middle-side')[0].appendChild(optionsDiv);

    //animate the "opening" of the optionsdiv.
    anime({
        targets:optionsDiv,
        width: '300px',
        height: '250px',
        // display: 'block',
        easing: 'easeInOutQuart',
        duration: 300
        /*
        opacity:{
            value: 1,
            delay: 1000
        }
        */
    });

    var optionsDivTimer = setTimeout(function() { //wait for the animation to complete before adding the options
        addOptionsToOptionsDiv();
    }, 300);
}

/*
This function is used to check what kind of object the highlighted object is. Depending on the object different
options should be displayed for the user.
 */
function addOptionsToOptionsDiv() {
    //depending on the object show the font-selector
    if(currentHighlightedObject.getAttribute('object-style') == "temperature" || currentHighlightedObject.getAttribute('object-style') == "text-message" || currentHighlightedObject.getAttribute('object-style') == "clock" || currentHighlightedObject.getAttribute('object-style') == "date") {
        showFontSelector();
    }
    //depending on the object show the temeprature graph options
    if (currentHighlightedObject.getAttribute('object-style') == "temp-graph") {
        showLineGraphTimeChooser();
    }
    //show a time dropdown if it's a temperature or weather object
    else if (currentHighlightedObject.getAttribute('object-style') == "weather" || currentHighlightedObject.getAttribute('object-style') == "temperature" ) {
        showDropDown();
    }

    //always show the delete button
    showDeleteButton();

    //create an input field if it's a text-message object
    if (currentHighlightedObject.getAttribute('object-style') == "text-message") {
        showInputField(currentHighlightedObject);
    }

    //the user should be able to hide or show the seconds if he/she highlights the clock
    if (currentHighlightedObject.getAttribute('object-style') == "clock") {
        showSecondsChooser();
    }
}

/*
This function is called to remove the options bubble.
 */
function removeOptionsDiv() {
    var optionsDiv = document.getElementsByClassName('text-bubble')[0];
    if (optionsDiv) {
         anime({
            targets:optionsDiv,
            width: '300px',
            height: '0px',
             opacity: 0,
            // display: 'block',
            easing: 'easeInOutQuart',
             duration: 300
            /*
             opacity:{
             value: 1,
             delay: 1000
             }
             */
        });
        var optionsDivTimer = setTimeout(function() { //wait for the animation to complete before removing the div
            optionsDiv.style.display = "none";
            optionsDiv.remove();
        }, 200);

    }
}
/*
These functions are our old own made resizers before we chose to use another person's creation.
 */
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


// definierar en variabel för fönstret för spegeln
var mirror = undefined;

/*
This function handles the dragging and dropping when a user moves an already created object in the middle of the screen.
Function taken from http://interactjs.io.
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


    // Ger object en absolut position i förhållande till sidorna. 

     target.style.left = ((x / mirror.offsetWidth) * 100) + '%';
     target.style.top = ((y / mirror.offsetHeight) * 100) + '%';

    // update the position attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);


    // target.setAttribute('top', ((y / mirror.offsetWidth) * 100) + '%');
    // target.setAttribute('left', ((x / mirror.offsetWidth) * 100) + '%');
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

/*
The dragging, dropping and resizing of objects in the middle of the screen is used by a third-pary framework found here http://interactjs.io.
 */
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
        onstart: function(event) { //save previous position
            previousPosition = getPreviousPosition(event);
            removeOptionsDiv();
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
        restrict: {
            resize: 'parent',
            elementRect: { top: 1, left: 1, bottom: 1, right: 1 }
        },
        restrictSize: {
            min: { width: -600, height: -600 },
            max: { width:  300, height:  300 }
        },
        onstart: function(event) { //save previous size
          previousSize = getPreviousSize(event);
          removeOptionsDiv();
        },

        onmove: function(event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-xx')) || 0),
                 y = (parseFloat(target.getAttribute('data-yy')) || 0);

            // update the element's style
            console.log(event.rect.width);
            if(event.rect.width > 600) {
                target.style.width = '600px';
            }
            else target.style.width  = event.rect.width + 'px';

            if (event.rect.height > 300) {
                target.style.height = '300px';
            }
            else target.style.height = event.rect.height + 'px';

            target.style.fontSize = event.rect.height/3 + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            target.setAttribute('data-xx', x);
            target.setAttribute('data-yy', y);

        },
        onend: function(event) { //when the resizing has ended
            var target = event.target;
            var currentWidth = window.getComputedStyle(target).getPropertyValue('width');
            var currentHeight = window.getComputedStyle(target).getPropertyValue('height');

            var previousWidth = previousSize[0];
            var previousHeight = previousSize[1];

            addToUndoArray(target.id, "resizedObject", target.getAttribute('top'), target.getAttribute('left'), target.getAttribute('object-style'), target.getAttribute('weather-time'), previousWidth, previousHeight, target.getAttribute('object-font'), "noMessage");

            updateObjectSize(target, currentWidth, currentHeight);
        }
    });


function updateObjectSize(target, newWidth, newHeight) {
    target.setAttribute('object-width', newWidth);
    target.setAttribute('object-height', newHeight);

}

function getPreviousSize(event) {
    var target = event.target;
    var previousWidth = target.getAttribute('object-width');
    var previousHeight = target.getAttribute('object-height');

    return [previousWidth, previousHeight];
}

/*
Creates a dropdown menu together with its content. Here a user can choose for which time of the day he/she wants to show the weather/temperature.
 */
function showDropDown() {
    var dropdown = document.createElement('select');
    dropdown.className = 'weather-choose-time';
    var currentTimeOption = document.createElement('option');
    currentTimeOption.value ="current-time";
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

    //append all the dropdown options to the menu
    dropdown.appendChild(currentTimeOption);
    dropdown.appendChild(morningOption);
    dropdown.appendChild(middayOption);
    dropdown.appendChild(afternoonOption);
    dropdown.appendChild(eveningOption);
    document.getElementsByClassName('text-bubble')[0].appendChild(dropdown);

    /*
    check the weatherTime attribute appeneded to the div. Depending on its' value change the selection in the dropdown.
     */
    for (var i = 0; i < dropdown.options.length; i++ ) {
        if (currentHighlightedObject.getAttribute('weather-time') == dropdown.options[i].value) {
            dropdown.options[i].selected = true;
            break;
        }
    }
    //Add a change-eventlistener on the dropdown so that when an user changes the time the icon changes accordingly.
    dropdown.addEventListener("change", function(ev) {
        switchWeatherTime(ev.target);
    });

}

/*
When an option is changed in the dropdown menu we need to change the weather time in the selected div and then
change the icon of the whole div itself.
 */
function switchWeatherTime(selectedValue) {
    var newWeatherTime = selectedValue.value;
    console.log(newWeatherTime);
    var currentWeatherTime = currentHighlightedObject.getAttribute('weather-time');
    //add the current weather time to the undo array so that it can be changed back.
    addToUndoArray(currentHighlightedObject.id, "changeTime", currentHighlightedObject.getAttribute('top'), currentHighlightedObject.getAttribute('left'), currentHighlightedObject.getAttribute('object-style'), currentWeatherTime, currentHighlightedObject.getAttribute('object-width'), currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-font'));

    currentHighlightedObject.setAttribute('weather-time', newWeatherTime);
    currentHighlightedObject.remove(); //remove the current object and create a new one in its place.
    //create a new version of the object but with the correct weather time that the user selected.
    SMHICall(currentHighlightedObject.style.top, currentHighlightedObject.style.left, currentHighlightedObject.id, currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'),currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('object-font'));
    removeOptionsDiv(); //remove the optionsDiv since the object has been unhighlighted.
}

//The delete button has to be added to each object's options.
function showDeleteButton() {
    var deleteDiv = document.createElement('div');
    deleteDiv.className = 'delete-div';
    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerHTML = getText('delete-button');

    document.getElementsByClassName('text-bubble')[0].appendChild(deleteDiv);
    deleteDiv.appendChild(deleteButton);

    deleteDiv.addEventListener('click', function() { //if the button is clicked remove the object and all the otpions.
        addToUndoArray(currentHighlightedObject.id, "deleteObject", currentHighlightedObject.getAttribute('top'), currentHighlightedObject.getAttribute('left'), currentHighlightedObject.getAttribute('object-style'), currentHighlightedObject.getAttribute('weather-time'), currentHighlightedObject.getAttribute('object-width'), currentHighlightedObject.getAttribute('object-height'), currentHighlightedObject.getAttribute('object-font'));
        deleteObject(currentHighlightedObject.id);
        removeOptionsDiv();
        currentHighlightedObject = null;

    });

}
/*
This function takes the specified object and deletes it, together with hiding the different options.
 */
function deleteObject(objectId) {
    //if the deleted object is a time or date object the timer has to be removed or else they will keep on being rendered.
    //up on the screen
    if (document.getElementById(objectId).getAttribute('object-style') == "clock") {
        clearTimeout(clockTimer);
    }
    else if (document.getElementById(objectId).getAttribute('object-style') == "date") {
        clearTimeout(dateTimer);
    }
    removeOptionsDiv();
    document.getElementById(objectId).remove();
}

/*
This function adds a specific ID to each object on the left side of the screen so that when a user
drops an object to the middle we can check which object exactly it was and render it accordingly.
 */
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
When a user drags an object from the left to the middle we have to send the information about where the element was dropped and what kind of element should be rendered.
 */

function drag(ev) {
    var dropDiv = document.getElementsByClassName('middle-side')[0];
    dropDiv.style.border = "3px dotted black";

    var style = window.getComputedStyle(ev.target, null);
    ev.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) +
        ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY) + ',' + ev.target.getAttribute('weatherId'));
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

    //Depending on the dropped object's ID create a different object.
   if (offset[2] == 0) {
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

//The creation of the weather object.
// It has to get the specific weather from the SMHI-API.
// It also needs the left and top position to be rendered on the correct position.
//It needs an ID so that it is unique.
//It needs to know for which time of the day it should display the weather.
//It needs to store its' height
//Some of these attributes might shift depending on the object created but the position, id, size and what kind of object it is will always be saved.
function createWeatherStyle(apiResponse, locationTop, locationLeft, divId, weatherTime, objectWidth, objectHeight, functionCaller) {
    // var weatherStyleDiv = document.createElement('img');
    var weatherStyleDiv = document.createElement('div');
    weatherStyleDiv.setAttribute('id', divId); //give an id so that we can choose the correct object to be dragged.

    // var dropdown = document.getElementsByClassName('weather-choose-time')[0];
    // var weatherTime ="notExist";
    if(weatherTime !== "notExist") { //create the object for the current time if it is dropped from the left side.
        weatherStyleDiv.setAttribute('weather-time',weatherTime);
        var timeDifference = calculateDateAndTimeDifference(apiResponse, weatherTime);
    }
    else {
        weatherStyleDiv.setAttribute('weather-time', "current-time");
        var timeDifference = calculateDateAndTimeDifference(apiResponse, "current-time");
    }
    var currentWeather = apiResponse.timeSeries[timeDifference].parameters[18].values[0];

    weatherStyleDiv.setAttribute('class','icon-middle sunny resize-drag');

    if (currentWeather == 1 || currentWeather == 2) { //sunny
        // console.log("is correct");
        var sun = document.createElement('div');
        sun.className ='sun';

        var rays = document.createElement('div');
        rays.className = 'rays';

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
        addToUndoArray(weatherStyleDiv.id, "addObject", top, left, weatherStyleDiv.getAttribute('object-style'), weatherTime, weatherStyleDiv.getAttribute('object-width'), weatherStyleDiv.getAttribute('object-height'),"noFont", "noMessage");
    }


    if (weatherTime !== "notExist") {
      //  weatherStyleToCss(divId, top, left, weatherStyleDiv.getAttribute('object-style'), weatherTime, weatherStyleDiv.getAttribute('object-width'), weatherStyleDiv.getAttribute('object-height'),"noFont");
    }
   // else weatherStyleToCss(divId, top, left, weatherStyleDiv.getAttribute('object-style'), "current-time", weatherStyleDiv.getAttribute('object-width'), weatherStyleDiv.getAttribute('object-height'),"noFont");

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

/*
This function checks if the local storage exists when we re-enter the webiste. If it exists it creates every object with its selected options so that the user
can start where he/she left off.
 */

function checkIfLocalStorageExists() {
    if (mirror === undefined){
        mirror = document.getElementById("mirror");
    }
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

        WebFontConfig= { //these rows adds the font families to a google call so that they can be shown to the user.
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
    else { console.log("else"); //nothing will happen otherwise.

    }
}

//function that is called to get the current date and time
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

    if(selectedWeatherTime == "current-time") {
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
        if( approvedHour > "08") { //depending on what time it is show the weather for today or tomorrow.
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

//This function creates a loading canvas so that we can get the geolocation data from the user before continuing.
function createLoadingCanvas() {
    var loadingCanvas = document.createElement('div');
    loadingCanvas.className = "loading-canvas";
    loadingCanvas.style.width = '100%';
    loadingCanvas.style.height = '100%';
    loadingCanvas.style.background = "black";
    loadingCanvas.style.zIndex = '1000';
    loadingCanvas.style.position = 'absolute';
    document.body.appendChild(loadingCanvas);

    var sun = document.createElement('div');
    sun.className = 'sun';
    var rays = document.createElement('div');
    rays.className = 'rays';
    sun.appendChild(rays);
    loadingCanvas.appendChild(sun);



}

//After 4-5 seconds remove the canvas.
function hideLoadingCanvas() {
    var loadingCanvas = document.getElementsByClassName('loading-canvas')[0];
    anime({
        targets: loadingCanvas,
        opacity: 0,
        easing: 'easeInOutQuart'
    });
    setTimeout(function() {
        loadingCanvas.style.display = "none";
        loadingCanvas.remove();
    }, 800);

}


/*
The getlocation and showposition functions are taken from http://stackoverflow.com/questions/2577305/get-gps-location-from-the-web-browser
They are used to get the user's position so that we can give them to the SMHI-API call so that the weather for the user's current position is shown
 */
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else {
        userLongitude = "17.6389";
        userLatitude = "59.8586";
    }
}
/*
The function works but it is very slow in getting the coordinates. That is why the loading canvas is needed.
 */
function showPosition(position) {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        userLatitude = userLatitude.toFixed(4); //take only the four first decimals.
        userLongitude = userLongitude.toFixed(4);


    hideLoadingCanvas();
    checkIfLocalStorageExists(); //Call all the other functions that the website is using.
    addAttributesToWeatherOptionDiv();
    loadGoogleFonts();
    createEventHandlers();


}

/*
Link to the smhi-api: http://opendata.smhi.se/apidocs/metfcst/index.html
The function gets the data from the api so that we can use it in different parts of the website.
 */
function SMHICall(topPosition, leftPosition, divId, objectTime, objectWidth, objectHeight, objectStyle, objectFont) {
    if (userLongitude == undefined && userLatitude == undefined) {
        userLongitude = "17.6389";
        userLatitude = "59.8586";
    }

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

        if (objectStyle =="weather") {
            createWeatherStyle(data, topPosition, leftPosition, divId, objectTime, objectWidth, objectHeight, functionCaller);
        }
        else if(objectStyle=="temperature") {
            createTemperatureStyle(data, topPosition, leftPosition, divId, objectTime, objectWidth, objectHeight, objectFont, functionCaller);
        }

        else if (objectStyle=="temp-graph") {
            createGraphCanvas(data, topPosition, leftPosition, divId, objectStyle, objectTime, objectWidth, objectHeight, objectFont, functionCaller);
        }
    })
        .fail(function () { //If the api-failed show an error message to the user.
            console.log("SMHI API FAIL");

            var userMessageDiv = document.getElementsByClassName('user-message-div')[0];
            userMessageDiv.innerHTML = getText('api-fail');

            anime({
                targets: userMessageDiv,
                opacity: 1,
                easing: 'easeInOutQuart',
                duration: 1000
            });
            setTimeout(function () {
                anime({
                    targets: userMessageDiv,
                    opacity: 0,
                    easing: 'easeInOutQuart',
                    duration: 1000
                });
            },5000);
        });

}



