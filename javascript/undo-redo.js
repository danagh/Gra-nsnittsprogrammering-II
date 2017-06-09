/*
This file handles all the undo-redo actions that a user can perform and that the arrays are constantly updated depending on a user's actions.
 */

//initialize all the different arrays that will be used by the file
var undoIdArray = [];
var undoActionArray = [];
var undoTopArray = [];
var undoLeftArray = [];
var undoStyleArray = [];
var undoTimeArray = [];
var undoWidthArray = [];
var undoHeightArray = [];
var undoFontArray = [];
var undoMessageArray = [];
var undoSecondsArray = [];
var redoIdArray = [];
var redoActionArray = [];
var redoTopArray = [];
var redoLeftArray = [];
var redoStyleArray = [];
var redoTimeArray = [];
var redoWidthArray = [];
var redoHeightArray = [];
var redoFontArray = [];
var redoMessageArray = [];
var redoSecondsArray = [];

//This function is called to add the latest action to the different arrays so that we thereafter update the whole undoarray.
function addToUndoArray(objectId, objectAction, topPosition, leftPosition, objectStyle, objectTime, objectWidth, objectHeight, objectFont, objectMessage, objectSeconds) {
    undoIdArray.push(objectId);
    undoActionArray.push(objectAction);
    undoTopArray.push(topPosition);
    undoLeftArray.push(leftPosition);
    undoStyleArray.push(objectStyle);
    undoTimeArray.push(objectTime);
    undoWidthArray.push(objectWidth);
    undoHeightArray.push(objectHeight);
    undoFontArray.push(objectFont);
    undoMessageArray.push(objectMessage);
    undoSecondsArray.push(objectSeconds);
    updateUndoArray();
    //console.log(undoArray);
}

//This function is called when the undo-button is pressed and it gets the last index of the undo array and its action so that they can be used to undo the latest action
function checkLatestUndoAction() {
    if (undoArray.length == 0 || undoArray[0].length == 0) { //if the undo array is empty then animate an error message to the user
        var userMessageDiv = document.getElementsByClassName('user-message-div')[0];
        userMessageDiv.innerHTML = getText('empty-undo');

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
    }
    else {
        var lastIndex = undoActionArray.length - 1; //get the index of the last item in the array
        var latestAction = undoArray[1][lastIndex]; //get the last item of the array
        completeUndo(lastIndex, latestAction);
    }

}

/*
 This function checks the latest user action and then generates and performs the correct undo action.
 */
function completeUndo(lastIndex, latestAction) {
    if (latestAction == "addObject") { //if the latest action was to add an object remove the same object.
        //var currentIndex = getIndexOfCurrentObject(undoArray[0][latestItem]); //get the index of the specific id.

        addToRedoArray(undoArray[0][lastIndex], undoArray[1][lastIndex], undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[4][lastIndex], undoArray[5][lastIndex], undoArray[6][lastIndex], undoArray[7][lastIndex], undoArray[8][lastIndex], undoArray[9][lastIndex]); //add the latest action to the redo array

        deleteObject(undoArray[0][lastIndex]);
    }

    else if (latestAction == "deleteObject") { //if the latest action was to delete an object add the object.
        addToRedoArray(undoArray[0][lastIndex], undoArray[1][lastIndex], undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[4][lastIndex], undoArray[5][lastIndex], undoArray[6][lastIndex], undoArray[7][lastIndex], undoArray[8][lastIndex], undoArray[9][lastIndex]);

        var currentObjectStyle = undoArray[4][lastIndex]; //have to know what kind of object it is so that the correct function is called.

        if(currentObjectStyle == "weather" || currentObjectStyle == "temperature" || currentObjectStyle == "temp-graph") {
            SMHICall(undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[0][lastIndex], undoArray[5][lastIndex], undoArray[6][lastIndex], undoArray[7][lastIndex], undoArray[4][lastIndex], undoArray[8][lastIndex]);
        }

        else if (currentObjectStyle == "text-message") {
            createTextMessage(undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[0][lastIndex],undoArray[5][lastIndex], undoArray[6][lastIndex], undoArray[7][lastIndex], undoArray[4][lastIndex], undoArray[8][lastIndex], undoArray[9][lastIndex]);
        }

        else if (currentObjectStyle == "clock") {
            createTimeObject(undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[0][lastIndex], undoArray[4][lastIndex], undoArray[5][lastIndex], undoArray[6][lastIndex],undoArray[7][lastIndex],  undoArray[8][lastIndex]);
        }

        else if (currentObjectStyle == "date") {
            createDateObject(undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[0][lastIndex], undoArray[4][lastIndex], undoArray[5][lastIndex], undoArray[6][lastIndex],undoArray[7][lastIndex],  undoArray[8][lastIndex]);
        }
    }

    else if (latestAction == "movedObject") { //move back the object to the previous position
        moveBackObject(undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[0][lastIndex]);
    }

    else if (latestAction == "resizedObject") { //resize object to the previous size
        resizeObject(undoArray[0][lastIndex], undoArray[6][lastIndex], undoArray[7][lastIndex]);
    }

    else if (latestAction == "changedFont") { //change the font
        changeBackFont(undoArray[0][lastIndex], undoArray[8][lastIndex])
    }

    else if (latestAction == "changeTime" ) { //change the time period for the specific object
        changeBackTime(undoArray[0][lastIndex], undoArray[5][lastIndex])
    }

    else if (latestAction == "changeText") { //change the written text in a text message
        changeTextBack(undoArray[0][lastIndex], undoArray[9][lastIndex])
    }

    else if (latestAction == "changeSeconds") { //remove or add the seconds to a time object.
        changeSecondsBack(undoArray[0][lastIndex], undoArray[10][lastIndex]);
    }

    undoActionArray.splice(lastIndex,1); //remove the latest undo-action from the undo arrays.
    undoIdArray.splice(lastIndex,1);
    undoTopArray.splice(lastIndex,1);
    undoLeftArray.splice(lastIndex,1);
    undoStyleArray.splice(lastIndex,1);
    undoTimeArray.splice(lastIndex,1);
    undoWidthArray.splice(lastIndex,1);
    undoHeightArray.splice(lastIndex,1);
    undoFontArray.splice(lastIndex,1);
    undoMessageArray.splice(lastIndex,1);
    undoSecondsArray.splice(lastIndex,1);
    updateUndoArray();
}

/*
depending on if the latest action by the user was to check or uncheck the "show seconds" checkbox this function does the reverse action.
 */
function changeSecondsBack(objectId, objectSeconds) {
    var objectToBeChanged = document.getElementById(objectId);
    var currentSeconds = objectToBeChanged.getAttribute('seconds');

    if (arguments.callee.caller.name == "completeUndo") { //add the current position to the redo array before undoing the movement.
        addToRedoArray(objectId, "changeSeconds", objectToBeChanged.getAttribute('top'), objectToBeChanged.getAttribute('left'), objectToBeChanged.getAttribute('object-style'), objectToBeChanged.getAttribute('weather-time'), objectToBeChanged.getAttribute('object-width'), objectToBeChanged.getAttribute('object-height'), objectToBeChanged.getAttribute('object-font'), objectToBeChanged.getAttribute('text-message'), currentSeconds);
    }
    else { //if it was a redo-function that called this function add the information instead in the undo array.
        addToUndoArray(objectId, "changeSeconds", objectToBeChanged.getAttribute('top'), objectToBeChanged.getAttribute('left'), objectToBeChanged.getAttribute('object-style'), objectToBeChanged.getAttribute('weather-time'), objectToBeChanged.getAttribute('object-width'), objectToBeChanged.getAttribute('object-height'), objectToBeChanged.getAttribute('object-font'), objectToBeChanged.getAttribute('text-message'), currentSeconds);
    }

    objectToBeChanged.setAttribute('seconds', objectSeconds);
}

//Change the text back to the one that was previous to the new one
function changeTextBack(objectId, textMessage) {
    console.log(textMessage);
    var objectToBeChanged = document.getElementById(objectId);
    var currentTextMessage = objectToBeChanged.getAttribute('text-message');

    if (arguments.callee.caller.name == "completeUndo") { //add the current position to the redo array before undoing the movement.
        addToRedoArray(objectId, "changeText", objectToBeChanged.getAttribute('top'), objectToBeChanged.getAttribute('left'), objectToBeChanged.getAttribute('object-style'), objectToBeChanged.getAttribute('weather-time'), objectToBeChanged.getAttribute('object-width'), objectToBeChanged.getAttribute('object-height'), objectToBeChanged.getAttribute('object-font'), currentTextMessage);
    }
    else { //if it was a redo-function that called this function add the information instead in the undo array.
        addToUndoArray(objectId, "changeText", objectToBeChanged.getAttribute('top'), objectToBeChanged.getAttribute('left'), objectToBeChanged.getAttribute('object-style'), objectToBeChanged.getAttribute('weather-time'), objectToBeChanged.getAttribute('object-width'), objectToBeChanged.getAttribute('object-height'), objectToBeChanged.getAttribute('object-font'), currentTextMessage);
    }

    objectToBeChanged.innerHTML = textMessage;
}

/*
This function is used to go back to the objecttime before the change.
 */
function changeBackTime(objectId, objectTime) {
    var objectToBeChanged = document.getElementById(objectId);
    var currentTime = objectToBeChanged.getAttribute('weather-time');

    if (arguments.callee.caller.name == "completeUndo") { //add the current position to the redo array before undoing the movement.
        addToRedoArray(objectId, "changeTime", objectToBeChanged.getAttribute('top'), objectToBeChanged.getAttribute('left'), objectToBeChanged.getAttribute('object-style'), currentTime, objectToBeChanged.getAttribute('object-width'), objectToBeChanged.getAttribute('object-height'), objectToBeChanged.getAttribute('object-font'), objectToBeChanged.getAttribute('text-message'));
    }
    else { //if it was a redo-function that called this function add the information instead in the undo array.
        addToUndoArray(objectId, "changeTime", objectToBeChanged.getAttribute('top'), objectToBeChanged.getAttribute('left'), objectToBeChanged.getAttribute('object-style'), currentTime, objectToBeChanged.getAttribute('object-width'), objectToBeChanged.getAttribute('object-height'), objectToBeChanged.getAttribute('object-font'), objectToBeChanged.getAttribute('text-message'));
    }

    objectToBeChanged.remove();
    SMHICall(objectToBeChanged.getAttribute('top'), objectToBeChanged.getAttribute('left'), objectId, objectTime, objectToBeChanged.getAttribute('object-width'), objectToBeChanged.getAttribute('object-height'), objectToBeChanged.getAttribute('object-style'), objectToBeChanged.getAttribute('object-font'));
}

/*
This function changes the fontfamily back to the one that was seen before the undo/redo button was pressed.
 */
function changeBackFont(objectId, objectFont) {
    var objectFontToBeChanged = document.getElementById(objectId);
    var currentFont = window.getComputedStyle(objectFontToBeChanged).getPropertyValue('font-family');

    if (arguments.callee.caller.name == "completeUndo") { //add the current position to the redo array before undoing the movement.
        addToRedoArray(objectId, "changedFont", objectFontToBeChanged.getAttribute('top'), objectFontToBeChanged.getAttribute('left'), objectFontToBeChanged.getAttribute('object-style'), objectFontToBeChanged.getAttribute('weather-time'), objectFontToBeChanged.getAttribute('object-width'), objectFontToBeChanged.getAttribute('object-height'), currentFont, objectFontToBeChanged.getAttribute('text-message'));
    }
    else { //if it was a redo-function that called this function add the information instead in the undo array.
        addToUndoArray(objectId, "changedFont", objectFontToBeChanged.getAttribute('top'), objectFontToBeChanged.getAttribute('left'), objectFontToBeChanged.getAttribute('object-style'), objectFontToBeChanged.getAttribute('weather-time'), objectFontToBeChanged.getAttribute('object-width'), objectFontToBeChanged.getAttribute('object-height'), currentFont, objectFontToBeChanged.getAttribute('text-message'));
    }

    objectFontToBeChanged.style.fontFamily = objectFont;
}

/*
This function resizes the size of the object to the size that was before the undo/redo-button was pressed
 */
function resizeObject(objectId, widthValue, heightValue) {
    var objectToBeResized = document.getElementById(objectId);

    var objectStyle = window.getComputedStyle(objectToBeResized);
    var currentWidth = objectStyle.getPropertyValue('width');
    var currentHeight = objectStyle.getPropertyValue('height');

    if (arguments.callee.caller.name == "completeUndo") { //add the current position to the redo array before undoing the movement.
        addToRedoArray(objectId, "resizedObject", objectToBeResized.getAttribute('top'), objectToBeResized.getAttribute('left'), objectToBeResized.getAttribute('object-style'), objectToBeResized.getAttribute('weather-time'), currentWidth, currentHeight, objectToBeResized.getAttribute('object-font'), objectToBeResized.getAttribute('text-message'));
    }
    else { //if it was a redo-function that called this function add the information instead in the undo array.
        addToUndoArray(objectId, "resizedObject", objectToBeResized.getAttribute('top'), objectToBeResized.getAttribute('left'), objectToBeResized.getAttribute('object-style'), objectToBeResized.getAttribute('weather-time'), currentWidth, currentHeight, objectToBeResized.getAttribute('object-font'), objectToBeResized.getAttribute('text-message'));
    }

    objectToBeResized.style.width = widthValue;
    objectToBeResized.style.height = heightValue;
    var heightValueFloat = parseFloat(heightValue); //make the height value into a value so that we can do calculations on it.
    var newFontSize = heightValueFloat/3;
    objectToBeResized.style.fontSize = newFontSize + 'px';
}

/*
This function moves back the object to its previous position
 */
function moveBackObject(topPosition, leftPosition, objectId) {
    var objectToBeMoved = document.getElementById(objectId);

    //we have to get the current position so that it can be added to the redo array.
    var objectStyle = window.getComputedStyle(objectToBeMoved);
    var currentTopPosition = objectStyle.getPropertyValue('top');
    var currentLeftPosition = objectStyle.getPropertyValue('left');

    if (arguments.callee.caller.name == "completeUndo") { //add the current position to the redo array before undoing the movement.
        addToRedoArray(objectId, "movedObject", currentTopPosition, currentLeftPosition, objectToBeMoved.getAttribute('object-style'), objectToBeMoved.getAttribute('weather-time'), objectToBeMoved.getAttribute('object-width'), objectToBeMoved.getAttribute('object-height'), objectToBeMoved.getAttribute('object-font'), objectToBeMoved.getAttribute('text-message'));
    }
    else { //if it was a redo-function that called this function add the information instead in the undo array.
        addToUndoArray(objectId, "movedObject", currentTopPosition, currentLeftPosition, objectToBeMoved.getAttribute('object-style'), objectToBeMoved.getAttribute('weather-time'), objectToBeMoved.getAttribute('object-width'), objectToBeMoved.getAttribute('object-height'), objectToBeMoved.getAttribute('object-font'), objectToBeMoved.getAttribute('text-message'));
    }
    objectToBeMoved.style.top = topPosition;
    objectToBeMoved.style.left = leftPosition;
}

//This function just updates the whole undo array so that it is always up to date.
function updateUndoArray() {
    undoArray[0] = undoIdArray;
    undoArray[1] = undoActionArray;
    undoArray[2] = undoTopArray;
    undoArray[3] = undoLeftArray;
    undoArray[4] = undoStyleArray;
    undoArray[5] = undoTimeArray;
    undoArray[6] = undoWidthArray;
    undoArray[7] = undoHeightArray;
    undoArray[8] = undoFontArray;
    undoArray[9] = undoMessageArray;
    undoArray[10] = undoSecondsArray;
}

/*
This function is called from the different undo actions so that the reverse action is stored in a redo array.
 */
function addToRedoArray(objectId, objectAction, topPosition, leftPosition, objectStyle, objectTime, objectWidth, objectHeight, objectFont, objectMessage, objectSeconds) {
    redoIdArray.push(objectId);
    redoActionArray.push(objectAction);
    redoTopArray.push(topPosition);
    redoLeftArray.push(leftPosition);
    redoStyleArray.push(objectStyle);
    redoTimeArray.push(objectTime);
    redoWidthArray.push(objectWidth);
    redoHeightArray.push(objectHeight);
    redoFontArray.push(objectFont);
    redoMessageArray.push(objectMessage);
    redoSecondsArray.push(objectSeconds);

    updateRedoArray();
}

//This function is called when the redo button is pressed and it gets the latest action from the redo list.
function checkLatestRedoAction() {
    if (redoArray.length == 0 || redoArray[0].length == 0) {
        var userMessageDiv = document.getElementsByClassName('user-message-div')[0];
        userMessageDiv.innerHTML = getText('empty-redo');

        anime({ //animate an error message if the array is empty
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
    }
    else {
        var lastIndex = redoActionArray.length - 1; //get the index of the last item in the array
        var latestAction = redoArray[1][lastIndex]; //get the last item of the array
        completeRedoAction(lastIndex, latestAction);
    }

}

/*
This function checks the latest user action and then generates the correct redo action. It behaves the opposite with the actions than the undo-counterpart.
 */
function completeRedoAction(lastIndex, latestAction) {

    if(latestAction == "addObject") { //if the latest undo action was to remove an object we have to add the object again.

        addToUndoArray(redoArray[0][lastIndex], redoArray[1][lastIndex], redoArray[2][lastIndex], redoArray[3][lastIndex], redoArray[4][lastIndex], redoArray[5][lastIndex], redoArray[6][lastIndex], redoArray[7][lastIndex], redoArray[8][lastIndex], redoArray[9][lastIndex]);

        var currentObjectStyle = redoArray[4][lastIndex]; //have to know what kind of object it is so that the correct function is called.

        if(currentObjectStyle == "weather" || currentObjectStyle == "temperature" || currentObjectStyle == "temp-graph") {
            SMHICall(redoArray[2][lastIndex], redoArray[3][lastIndex], redoArray[0][lastIndex], redoArray[5][lastIndex], redoArray[6][lastIndex], redoArray[7][lastIndex], redoArray[4][lastIndex], redoArray[8][lastIndex]);
        }

        else if (currentObjectStyle == "text-message") {
            createTextMessage(redoArray[2][lastIndex], redoArray[3][lastIndex], redoArray[0][lastIndex],redoArray[5][lastIndex], redoArray[6][lastIndex], redoArray[7][lastIndex], redoArray[4][lastIndex], redoArray[8][lastIndex], redoArray[9][lastIndex]);
        }

        else if (currentObjectStyle == "clock") {
            createTimeObject(redoArray[2][lastIndex], redoArray[3][lastIndex], redoArray[0][lastIndex], redoArray[4][lastIndex], redoArray[5][lastIndex], redoArray[6][lastIndex],redoArray[7][lastIndex],  redoArray[8][lastIndex]);
        }

        else if (currentObjectStyle == "date") {
            createDateObject(redoArray[2][lastIndex], redoArray[3][lastIndex], redoArray[0][lastIndex], redoArray[4][lastIndex], redoArray[5][lastIndex], redoArray[6][lastIndex],redoArray[7][lastIndex],  redoArray[8][lastIndex]);
        }
    }

    else if (latestAction == "deleteObject") {
        addToUndoArray(redoArray[0][lastIndex], redoArray[1][lastIndex], redoArray[2][lastIndex], redoArray[3][lastIndex], redoArray[4][lastIndex], redoArray[5][lastIndex], redoArray[6][lastIndex], redoArray[7][lastIndex], redoArray[8][lastIndex], redoArray[9][lastIndex]);

        deleteObject(redoArray[0][lastIndex]);
    }

    else if (latestAction == "movedObject") {
        moveBackObject(redoArray[2][lastIndex], redoArray[3][lastIndex], redoArray[0][lastIndex]);
    }

    else if (latestAction == "resizedObject") {
        resizeObject(redoArray[0][lastIndex], redoArray[6][lastIndex], redoArray[7][lastIndex]);
    }
    else if (latestAction == "changedFont") {
        changeBackFont(redoArray[0][lastIndex], redoArray[8][lastIndex])
    }
    else if (latestAction == "changeTime" ) {
        changeBackTime(redoArray[0][lastIndex], redoArray[5][lastIndex])
    }
    else if (latestAction == "changeText") {
        changeTextBack(redoArray[0][lastIndex], redoArray[9][lastIndex])
    }
    else if (latestAction == "changeSeconds") {
        changeSecondsBack(redoArray[0][lastIndex], redoArray[10][lastIndex]);
    }

    redoActionArray.splice(lastIndex,1); //remove the latest undo-action from the undo arrays.
    redoIdArray.splice(lastIndex,1);
    redoTopArray.splice(lastIndex,1);
    redoLeftArray.splice(lastIndex,1);
    redoStyleArray.splice(lastIndex,1);
    redoTimeArray.splice(lastIndex,1);
    redoWidthArray.splice(lastIndex,1);
    redoHeightArray.splice(lastIndex,1);
    redoFontArray.splice(lastIndex,1);
    redoMessageArray.splice(lastIndex,1);
    redoSecondsArray.splice(lastIndex,1);
    updateRedoArray();
}

//apdate the redo array so that it's always up to date
function updateRedoArray() {
    redoArray[0] = redoIdArray;
    redoArray[1] = redoActionArray;
    redoArray[2] = redoTopArray;
    redoArray[3] = redoLeftArray;
    redoArray[4] = redoStyleArray;
    redoArray[5] = redoTimeArray;
    redoArray[6] = redoWidthArray;
    redoArray[7] = redoHeightArray;
    redoArray[8] = redoFontArray;
    redoArray[9] = redoMessageArray;
    redoArray[10] = redoSecondsArray;
    console.log(redoArray);
}

