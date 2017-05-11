//initialize all the different arrays that will be used
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

//This function is called to add the latest action to the undo array
function addToUndoArray(objectId, objectAction, topPosition, leftPosition, objectStyle, objectTime, objectWidth, objectHeight, objectFont, objectMessage) {
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

    console.log(undoMessageArray);
    updateUndoArray();
}

//This function is called when the undo-button is pressed and it gets the last index of the undo array and its action so that they can be used to undo the latest action
function checkLatestUndoAction() {
    console.log("undo array "  + ' ' + undoActionArray);
    console.log("redo array" + ' ' + redoActionArray);
    var lastIndex = undoActionArray.length - 1; //get the index of the last item in the array
    var latestAction = undoArray[1][lastIndex]; //get the last item of the array

    completeUndo(lastIndex, latestAction);

}

function completeUndo(lastIndex, latestAction) {
    console.log(undoArray[0][lastIndex]);
    if (latestAction == "addObject") { //if the latest action was to add an object remove the same object.
        //var currentIndex = getIndexOfCurrentObject(undoArray[0][latestItem]); //get the index of the specific id.

        addToRedoArray(undoArray[0][lastIndex], undoArray[1][lastIndex], undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[4][lastIndex], undoArray[5][lastIndex], undoArray[6][lastIndex], undoArray[7][lastIndex], undoArray[8][lastIndex], undoArray[9][lastIndex]); //add the latest action to the redo array

        deleteObject(undoArray[0][lastIndex]);
    }

    else if (latestAction == "deleteObject") {
        addToRedoArray(undoArray[0][lastIndex], undoArray[1][lastIndex], undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[4][lastIndex], undoArray[5][lastIndex], undoArray[6][lastIndex], undoArray[7][lastIndex], undoArray[8][lastIndex], undoArray[9][lastIndex]);

        var currentObjectStyle = undoArray[4][lastIndex]; //have to know what kind of object it is so that the correct function is called.

        if(currentObjectStyle == "weather" || currentObjectStyle == "temperature") {
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

    else if (latestAction == "movedObject") {
        moveBackObject(undoArray[2][lastIndex], undoArray[3][lastIndex], undoArray[0][lastIndex]);
    }

    else if (latestAction == "resizedObject") {
        resizeObject(undoArray[0][lastIndex], undoArray[6][lastIndex], undoArray[7][lastIndex]);
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

    console.log("undo array " + ' ' + undoActionArray);
    console.log("redo array" + ' ' + redoActionArray);
    updateUndoArray();
}

function resizeObject(objectId, widthValue, heightValue) {
    console.log("resize object");
    console.log(widthValue + ' ' + heightValue);

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

function moveBackObject(topPosition, leftPosition, objectId) {
    console.log("move back object");
    console.log("object id " + objectId);
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
    console.log("undo array");
    console.log(undoArray);
}

function addToRedoArray(objectId, objectAction, topPosition, leftPosition, objectStyle, objectTime, objectWidth, objectHeight, objectFont, objectMessage) {
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

    updateRedoArray();
}

//This function is called when the redo button is pressed and it gets the latest action from the redo list.
function checkLatestRedoAction() {
    var lastIndex = redoActionArray.length - 1; //get the index of the last item in the array
    var latestAction = redoArray[1][lastIndex]; //get the last item of the array
    console.log("undo array" + ' ' + undoActionArray);
    console.log("redo array " + ' ' + redoActionArray);
    completeRedoAction(lastIndex, latestAction);

}

function completeRedoAction(lastIndex, latestAction) {
    console.log(redoArray[0][lastIndex]);
    if(latestAction == "addObject") { //if the latest undo action was to remove an object we have to add the object again.

        addToUndoArray(redoArray[0][lastIndex], redoArray[1][lastIndex], redoArray[2][lastIndex], redoArray[3][lastIndex], redoArray[4][lastIndex], redoArray[5][lastIndex], redoArray[6][lastIndex], redoArray[7][lastIndex], redoArray[8][lastIndex], redoArray[9][lastIndex]);

        var currentObjectStyle = redoArray[4][lastIndex]; //have to know what kind of object it is so that the correct function is called.

        if(currentObjectStyle == "weather" || currentObjectStyle == "temperature") {
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
    console.log("undo array" + ' ' + undoActionArray);
    console.log("redo array " + ' ' + redoActionArray);
    updateRedoArray();
}

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
    console.log(redoArray);
}

/*
Because we will have to find the index of a specific object many times in our code it is easier
to just call a function that returns the sought after index.
 */
function getIndexOfCurrentObject(objectId) {
    for (var i = 0; i < objectIdArray.length; i++) {
        if (objectIdArray[i] == objectId) {
            return i;
        }
    }
}