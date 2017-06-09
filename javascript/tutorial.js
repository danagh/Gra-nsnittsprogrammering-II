/*
This file handles everything with the tutorial.
 */


var tryItCalls = 0; //a counter is initialized which stores how many times a user has clicked during the tutorial
/*
Add and animate an overlay that sweeps through the whole screen. Then remove it and instead add 8
smaller overlays that takes up different places of the screen so that they can be moved and animated
differently.
 */

function createWholeOverlay() {
    for (var i=1; i < 7; i++) { //display each overlay. We use more than one overlay since they should be able to be opened and closed independently
        var overlayi = document.getElementById("o" + i);
        overlayi.style.display = "block";
    }
    var overlay=document.getElementById("o0");
    overlay.style.display = "block";
    var animateOverlay = anime({
        targets:overlay,
        width: '100%',
        height: '100%',
        easing: 'easeInOutQuart'
    });

    var timeoutCounter = setTimeout(addWelcomingMessage, 1000); //wait for one second before showing the first message
}

function addWelcomingMessage() {
    var textbubble = document.createElement('div');
    textbubble.className ='text-bubble-tutorial right';
    textbubble.style.opacity = "0";
    // textbubble.style.display = "none";
    document.getElementById("o0").appendChild(textbubble);

    var animateBubble = anime({ //animate first text bubble
        targets:textbubble,
        translateX: 120,
        translateY: 50,
        opacity: 1,
        // display: 'block',
        easing: 'easeInOutQuart'

    });
    var welcomingPar = document.createElement('p');
    welcomingPar.className = "welcoming-par";
    var welcomingText = getText("tut-welcome");

    welcomingPar.innerHTML = welcomingText;
    welcomingPar.style.opacity ="0";
    textbubble.appendChild(welcomingPar);

    var animateText = anime({ //add text to the bubble
        targets:welcomingPar,
        opacity: 1,
        delay: 1000
    });

    setTimeout(psstMessage, 4000) //wait for 4 seconds then tell the user to click anywhere to continue.

}

/*
Resizes the text bubble and gives a hint to the user.
 */
function psstMessage() {
    var welcomingPar = document.getElementsByClassName("welcoming-par")[0];
    welcomingPar.style.opacity= "0";
    var psstText = getText("tut-psst");

    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];

    var animateBubble = anime({
       targets: textbubble,
        width: '238px',
        height: '100px',
        easing: 'easeInOutCubic'
    });

    var animateText2 = anime ({
        targets:welcomingPar,
        innerHTML: {
            value: psstText

            // delay: 1000
        },
        opacity: 1,
        delay: 1000
    });
    // showFontSelector();
}

/*
This function takes a message as a input, together with the bubble's size and animates
it accordingly. It is called through out the tutorial.
 */
function showNewMessageAndAnimateBubble(message, bubbleHeight, bubbleWidth) {
    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];

    var textPar = document.getElementsByClassName("welcoming-par")[0];
    textPar.style.opacity = "0";

    if (bubbleHeight == null) {
        anime({
            targets: textbubble,
            width: bubbleWidth + 'px',
            easing: 'easeInOutCubic'
        });
    }

    else if (bubbleWidth == null) {
        anime({
            targets: textbubble,
            height: bubbleHeight + 'px',
            easing: 'easeInOutCubic'
        });
    }
    else {
        anime({
            targets: textbubble,
            height: bubbleHeight + 'px',
            width: bubbleWidth + 'px',
            easing: 'easeInOutCubic'
        });
    }


    anime({
        targets:textPar,
        innerHTML: {
            value: message

            // delay: 1000
        },
        opacity: 1,
        delay: 1000
    });
}

/*
This animation needs its own function since it moves the text bubble as well
as changes its' size.
 */
function showFirstMessage() {
    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];
    var dragNDropMessage = getText("tut-firstof");
    textPar.innerHTML = dragNDropMessage;
    textPar.style.opacity = "0";

    var firstMovement = anime({
       targets: textbubble,
        translateY: 50,
        translateX: 400,
        width: '250px',
        height: '120px',
        easing: 'easeInOutQuart'
    });

    var firstText = anime({
       targets: textPar,
        opacity: 1,
        delay: 1000
    });

}


/*
Try it out now is a message that is shown several times through out the
tutorial and therefore it is easier to have it as its own funciton. During the
try it out now period we also disable the click event so that the user doesn't go
further on in the tutorial without completing the task. We also use a counter to
know which animation should be called depending on how many times the try it out now
function has been called.
 */
function tryItOutNow() {
    tryItCalls++;

    //Make the clickable divs not clickable while the animation is running.
    $('.overlay').each(function() {
       $(this).removeClass('eventClickable');
    });
    $('.middle-side').removeClass('eventClickable');


    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];
    var dragNDropMessage3 = getText("tut-try");

    // textPar.innerHTML = dragNDropMessage2;
    textPar.style.opacity = "0";

    var animateBubble = anime({
        targets: textbubble,
        height: '80px',
        width: '200px',
        easing: 'easeInOutCubic'
    });

    var animateText = anime ({
        targets:textPar,
        innerHTML: {
            value: dragNDropMessage3

            // delay: 1000
        },
        opacity: 1,
        delay: 1000
    });

    if(tryItCalls == 1) {
        var timeOut = setTimeout(addWeatherAndOpenUpDivs, 2000);
    }


    else if(tryItCalls == 2) {
        var timeOut = setTimeout(function() {
            anime({
               targets:textbubble,
                opacity: 0,
                easing: 'easeInOutQuart'
            });
        }, 2500)
    }


    else if (tryItCalls == 3) {
        var timeOut = setTimeout(openUpOptionsDiv, 2000);
    }


}

/*
This function opens up some of the greyed out divs so that the user can
try out a specific action.
 */
function addWeatherAndOpenUpDivs() {
    console.log('addweather');
    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];
    textbubble.remove();
    var overlay = document.getElementById('o0');
    overlay.style.display = "none";

    var upperDivLeft = document.getElementById('o2');
    var lowerDivLeft = document.getElementById('o3');

    var animateUpperDiv = anime({
       targets: upperDivLeft,
        height: '6px',
        easing: 'easeInOutCubic'
    });

    var animateLowerDiv = anime({
       targets: lowerDivLeft,
        top: '82px',
        height: '100%',
        easing: 'easeInOutCubic'
    });

    var middleDiv = document.getElementById('o4');

    var animateMiddleDiv = anime({
       targets: middleDiv,
        height: '0',
        easing: 'easeInOutCubic'
    });
}

/*
After the first tutorial action is completed everything is clickable again
and the text bubble with the next instructions comes up.
 */
function afterDroppingWeatherObject() {
    //Make everything clickable again.
    $('.overlay').each(function() {
        $(this).addClass('eventClickable');
    });
    $('.middle-side').addClass('eventClickable');

    var textbubble = document.createElement('div');
    textbubble.className ='text-bubble-tutorial right';
    textbubble.style.opacity = "1  ";
    // textbubble.style.display = "none";
    document.getElementsByClassName("middle-side")[0].appendChild(textbubble);

    var animateBubble = anime({
        targets:textbubble,
        translateX: 300,
        translateY: 40,
        opacity: 1,
        width: '300px',
        height: '180px',
        // display: 'block',
        easing: 'easeInOutQuart'

    });
    var welcomingPar = document.createElement('p');
    welcomingPar.className = "welcoming-par";
    var welcomingText = getText("tut-addmore");

    welcomingPar.innerHTML = welcomingText;
    welcomingPar.style.opacity ="0";
    textbubble.appendChild(welcomingPar);

    var animateText = anime({
        targets:welcomingPar,
        opacity: 1,
        delay: 1000
    });
}

/*
This function is called when the user highlights an object for the first time.
 */
function firstHighlight() {
    //Make everything clickable again.
    $('.overlay').each(function() {
        $(this).addClass('eventClickable');
    });
    $('.middle-side').addClass('eventClickable');

    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];

    anime({
        targets: textbubble,
         translateX: 350,
         translateY: 500,
        opacity: 1,
        height: '150px',
        width: '200px',
        easing: 'easeInOutQuart'
    });

    var textPar = document.getElementsByClassName('welcoming-par')[0];

    var dragNDropMessage4 = getText("tut-high");

    textPar.style.opacity = "0";

    anime({
        targets: textPar,
        innerHTML: dragNDropMessage4,
        opacity: 1,
        delay:1000
    });
}


/*
This function is called so that the overlay over the options are removed.
 */
function openUpOptionsDiv() {
    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];
    textbubble.remove();
    var overlay = document.getElementsByClassName('text-bubble-overlay')[0];

    var animateUpperDiv = anime({
        targets: overlay,
        height: '0px',
        easing: 'easeInOutQuart'
    });
}

/*
After changing the weather time, which is the final task of the tutorial everything is clickable
again and the user gets to read the last messages.
 */
function afterChangeWeatherTime() {
    //make everything clickable again.
    $('.overlay').each(function() {
        $(this).addClass('eventClickable');
    });
    $('.middle-side').addClass('eventClickable');


    var textbubble = document.createElement('div');
    textbubble.className ='text-bubble-tutorial right';
    textbubble.style.opacity = "1  ";
    // textbubble.style.display = "none";
    document.getElementsByClassName("middle-side")[0].appendChild(textbubble);

    var animateBubble = anime({
        targets:textbubble,
        translateX: 300,
        translateY: 40,
        opacity: 1,
        width: '300px',
        height: '170px',
        // display: 'block',
        easing: 'easeInOutQuart'

    });
    var welcomingPar = document.createElement('p');
    welcomingPar.className = "welcoming-par";
    var welcomingText = getText("tut-time");

    welcomingPar.innerHTML = welcomingText;
    welcomingPar.style.opacity ="0";
    textbubble.appendChild(welcomingPar);

    var animateText = anime({
        targets:welcomingPar,
        opacity: 1,
        delay: 1000
    });
}


function tutorialEventHandlers() {
    $(document).on('click', '.cancel-tutorial', function() {
        cancelTutorial();
    });

    /*
    Depending on the amount of clicks the eventhandler calls different functions and the text bubble adapts accordingly.
     */
    $(document).on('click', '.overlay, .middle-side', function(e) {
        if (e.target.classList.contains('eventClickable')) {
            tutorialClicks++;

            if(tutorialClicks == 1) {
                showFirstMessage();

            }
            else if(tutorialClicks == 2) {
                showNewMessageAndAnimateBubble(getText("tut-selwe"), '200', '300');
            }

            else if (tutorialClicks == 3) {
                tryItOutNow();
            }
            else if (tutorialClicks == 4) {
                showNewMessageAndAnimateBubble(getText("tut-highlight"), '200', '300');
            }
            else if (tutorialClicks ==5) {
                tryItOutNow();
            }
            else if (tutorialClicks ==6) {
                // showSecondMessageSecond();
                showNewMessageAndAnimateBubble(getText('tut-options'), '170', '300');
            }
            else if (tutorialClicks == 7) {
                tryItOutNow();
            }
            else if (tutorialClicks == 8) {
                // showThirdMessage();
                showNewMessageAndAnimateBubble(getText("tut-finally"), '170', '240');
            }

            else if (tutorialClicks == 9) {
                // showFinalMessage();
                showNewMessageAndAnimateBubble(getText("tut-last"), '170', '240');
            }
            else if (tutorialClicks == 10) {
                if (lang=="se") {
                    window.location.href = "Creator_hub2.html?lang=se";
                }
                else window.location.href = "Creator_hub2.html?lang=en";

            }
        }

        // }

    });

}

/*
If the canceltutorial button is pressed redirect the user automatically to the main page
 */
function cancelTutorial() {
    if (lang=="se") {
        window.location.href = "Creator_hub2.html?lang=se";
    }
    else window.location.href = "Creator_hub2.html?lang=en";
}