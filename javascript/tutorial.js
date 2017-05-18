var tryItCalls = 0;
/*
Add and animate an overlay that sweeps through the whole screen. Then remove it and instead add 8
smaller overlays that takes up different places of the screen so that they can be moved and animated
differently.
 */

function createWholeOverlay() {
    for (var i=1; i < 7; i++) {
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

    var bla = setTimeout(addWelcomingMessage, 1000);
}

function addWelcomingMessage() {
    var textbubble = document.createElement('div');
    textbubble.className ='text-bubble-tutorial right';
    textbubble.style.opacity = "0";
    // textbubble.style.display = "none";
    document.getElementById("o0").appendChild(textbubble);

    var animateBubble = anime({
        targets:textbubble,
        translateX: 120,
        translateY: 50,
        opacity: 1,
        // display: 'block',
        easing: 'easeInOutQuart'

    });
    var welcomingPar = document.createElement('p');
    welcomingPar.className = "welcoming-par";
    var welcomingText = "Hi and welcome to Lifeganizer! " +
        "This tutorial will take you through the website and show you " +
        "how easy it is to use.";

    welcomingPar.innerHTML = welcomingText;
    welcomingPar.style.opacity ="0";
    textbubble.appendChild(welcomingPar);

    var animateText = anime({
        targets:welcomingPar,
        opacity: 1,
        delay: 1000
    });

    // setTimeout(psstMessage, 5000)

}

function psstMessage() {
    var welcomingPar = document.getElementsByClassName("welcoming-par")[0];
    welcomingPar.style.opacity= "0";
    var psstText = "Psst... Click anywhere to continue";

    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];

    var animateBubble = anime({
       targets: textbubble,
        width: '238px',
        height: '66px',
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
    showFontSelector();
}

/*
This function takes a message as a input, together with the bubble's size and animates
it accordingly.
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
    var dragNDropMessage = "First of, let's try to add a weather icon to your design. ";
    textPar.innerHTML = dragNDropMessage;
    textPar.style.opacity = "0";

    var firstMovement = anime({
       targets: textbubble,
        translateY: 50,
        translateX: 400,
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
    var dragNDropMessage3 = "Try it out now!";

    // textPar.innerHTML = dragNDropMessage2;
    textPar.style.opacity = "0";

    var animateBubble = anime({
        targets: textbubble,
        height: '80px',
        width: '150px',
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
        height: '145px',
        // display: 'block',
        easing: 'easeInOutQuart'

    });
    var welcomingPar = document.createElement('p');
    welcomingPar.className = "welcoming-par";
    var welcomingText = "Good job! To add more icons you just drag them from the left side" +
        " and drop them down where you want them!";

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

    console.log("first highlight");

    // var textbubble = document.createElement('div');
    // textbubble.className = 'text-bubble-tutorial right';
    // document.getElementsByClassName('middle-side')[0].appendChild(textbubble);

    var textbubble = document.getElementsByClassName('text-bubble-tutorial')[0];
    // var timeout = setTimeout(function () {
    //     textbubble.style.opacity = "1";
    // }, 3000);

    anime({
        targets: textbubble,
         translateX: 350,
         translateY: 500,
        opacity: 1,
        height: '130px',
        width: '200px',
        easing: 'easeInOutQuart'
    });

    // var textPar = document.createElement('p');
    // textPar.className = "welcoming-par";
    // textPar.appendChild(textbubble);
    var textPar = document.getElementsByClassName('welcoming-par')[0];

    var dragNDropMessage4 = "Did you see how more options came up next to the object?";

    textPar.style.opacity = "0";

    anime({
        targets: textPar,
        innerHTML: dragNDropMessage4,
        opacity: 1,
        delay:1000
    });
}


/*
This function is called so that the option-side of the screen on the right side is
"openeed up" and the grey out boxes are removed.
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
        height: '120px',
        // display: 'block',
        easing: 'easeInOutQuart'

    });
    var welcomingPar = document.createElement('p');
    welcomingPar.className = "welcoming-par";
    var welcomingText = "Good job! You can also change the size of the weather icon by dragging its' top or left side";

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

    $(document).on('click', '.overlay, .middle-side', function(e) {
        // console.log(currentHighlightedObject);
        // if (e.target.classList.contains('middle-side') || e.target.classList.contains('overlay')) {

        if (e.target.classList.contains('eventClickable')) {
            tutorialClicks++;
            console.log(tutorialClicks);

            if(tutorialClicks == 1) {
                showFirstMessage();

            }
            else if(tutorialClicks == 2) {
                // showFirstMessageSecond();
                showNewMessageAndAnimateBubble("You can do this by selecting 'weather' from the left side of the screen," +
                    " dragging it to the frame in the middle and then dropping it.", '165', null);
            }

            else if (tutorialClicks == 3) {
                tryItOutNow();
            }
            else if (tutorialClicks == 4) {
                // showSecondMessage();
                //console.log("fourth tutorial click");
                //createAnotherMessage();
                showNewMessageAndAnimateBubble("You can highlight a weather icon by clicking on it. By" +
                    " doing so more options comes up on the right side of the screen.", '150', null);
            }
            else if (tutorialClicks ==5) {
                tryItOutNow();
            }
            else if (tutorialClicks ==6) {
                // showSecondMessageSecond();
                showNewMessageAndAnimateBubble("With the options you can change for which time of the day you want to" +
                    " show the weather.", '150', '220');
            }
            else if (tutorialClicks == 7) {
                tryItOutNow();
            }
            else if (tutorialClicks == 8) {
                // showThirdMessage();
                showNewMessageAndAnimateBubble("Finally, you can delete the weather icon by pressing" +
                    " the delete-button in the options that popped up.", '150', '240');
            }

            else if (tutorialClicks == 9) {
                // showFinalMessage();
                showNewMessageAndAnimateBubble("That's pretty much it. Now we'll let you explore the endless possibilites" +
                    " with Lifeganizer!", '160', '240');
            }
            else if (tutorialClicks == 10) {
                window.location.href = "Creator_hub2.html?lang=en";
            }
        }

        // }

    });

}

function cancelTutorial() {
    /*
    ADD CODE HERE LATER
     */
}