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




    // var overlay2=document.getElementById("o2");
    // overlay2.style.display = "block";
    //
    // var overlay3=document.getElementById("o3");
    // overlay3.style.display = "block";
    //
    // var overlay4=document.getElementById("o4");
    // overlay4.style.display = "block";
    //
    // var overlay5=document.getElementById("o5");
    // overlay5.style.display = "block";
    //
    // var overlay6=document.getElementById("o6");
    // overlay6.style.display = "block";
    //
    // var overlay7=document.getElementById("o7");
    // overlay7.style.display = "block";



    var bla = setTimeout(addWelcomingMessage, 1000);
}

function addWelcomingMessage() {
    var textbubble = document.createElement('div');
    textbubble.className ='text-bubble right';
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

    setTimeout(psstMessage, 5000)

}

function psstMessage() {
    var welcomingPar = document.getElementsByClassName("welcoming-par")[0];
    welcomingPar.style.opacity= "0";
    var psstText = "Psst... Click anywhere to continue";

    var textbubble = document.getElementsByClassName('text-bubble')[0];

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
}


function showFirstMessage() {
    var textbubble = document.getElementsByClassName('text-bubble')[0];
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



    // var timeOut = setTimeout(addWeather, 200)
}

function showFirstMessageSecond() {
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];
    var dragNDropMessage2 = "You can do this by selecting 'weather' from the left side of the screen," +
        " dragging it to the frame in the middle and then dropping it.";

    // textPar.innerHTML = dragNDropMessage2;
    textPar.style.opacity = "0";

    var animateBubble = anime({
       targets: textbubble,
        height: '120px',
        easing: 'easeInOutCubic'
    });

    var animateText = anime ({
        targets:textPar,
        innerHTML: {
            value: dragNDropMessage2

            // delay: 1000
        },
        opacity: 1,
        delay: 1000
    });
}

function tryItOutNow() {
    tryItCalls++;
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];
    var dragNDropMessage3 = "Try it out now!";

    // textPar.innerHTML = dragNDropMessage2;
    textPar.style.opacity = "0";

    var animateBubble = anime({
        targets: textbubble,
        height: '60px',
        width: '100px',
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
        var timeOut = setTimeout(addWeather, 2000);
    }

    else if (tryItCalls == 3) {
        var timeOut = setTimeout(showRightSide, 2000);
    }


}


function addWeather() {
    console.log('addweather');
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    textbubble.remove();
    var overlay = document.getElementById('o0');
    overlay.style.display = "none";

    var upperDivLeft = document.getElementById('o2');
    var lowerDivLeft = document.getElementById('o3');

    var animateUpperDiv = anime({
       targets: upperDivLeft,
        height: '12.5%'
    });

    var animateLowerDiv = anime({
       targets: lowerDivLeft,
        top: '18%',
        height: '82%'
    });

    var middleDiv = document.getElementById('o4');

    var animateMiddleDiv = anime({
       targets: middleDiv,
        height: '9.9%'
    });
}

function afterDrop() {
    var textbubble = document.createElement('div');
    textbubble.className ='text-bubble right';
    textbubble.style.opacity = "1  ";
    // textbubble.style.display = "none";
    document.getElementsByClassName("middle-side")[0].appendChild(textbubble);

    var animateBubble = anime({
        targets:textbubble,
        translateX: 400,
        translateY: 40,
        opacity: 1,
        width: '300px',
        height: '90px',
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

function showSecondMessage() {
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];
    var dragNDropMessage4 = "You can highlight a weather icon by clicking on it. By" +
        " doing so more options comes up on the right side of the screen.";

    textPar.style.opacity = "0";

    anime({
        targets: textbubble,
        height: '120px',
        easing: 'easeInOutQuart'
    })

    anime({
       targets: textPar,
        innerHTML: dragNDropMessage4,
        opacity: 1,
        delay:1000
    });
}

function firstHighlight() {
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];

    var dragNDropMessage4 = "Did you see how more options came up on the right side?";

    textPar.style.opacity = "0";

    anime({
        targets: textbubble,
        height: '110px',
        width: '150px',
        easing: 'easeInOutQuart'
    });

    anime({
        targets: textPar,
        innerHTML: dragNDropMessage4,
        opacity: 1,
        delay:1000
    });
}

function showSecondMessageSecond() {
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];

    var dragNDropMessage4 = "With the options you can change for which time of the day you want to" +
        " show the weather.";

    textPar.style.opacity = "0";

    anime({
        targets: textbubble,
        height: '110px',
        width: '220px',
        easing: 'easeInOutQuart'
    });

    anime({
        targets: textPar,
        innerHTML: dragNDropMessage4,
        opacity: 1,
        delay:1000
    });

}

function showRightSide() {
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    textbubble.remove();
    var rightUpper = document.getElementById('o5');

    var animateUpperDiv = anime({
        targets: rightUpper,
        height: '9.9%'
    });
}

function afterChangeWeatherTime() {
    var textbubble = document.createElement('div');
    textbubble.className ='text-bubble right';
    textbubble.style.opacity = "1  ";
    // textbubble.style.display = "none";
    document.getElementsByClassName("middle-side")[0].appendChild(textbubble);

    var animateBubble = anime({
        targets:textbubble,
        translateX: 400,
        translateY: 40,
        opacity: 1,
        width: '300px',
        height: '90px',
        // display: 'block',
        easing: 'easeInOutQuart'

    });
    var welcomingPar = document.createElement('p');
    welcomingPar.className = "welcoming-par";
    var welcomingText = "Good job! You can also change the size of the weather icon by dragging its' corner.";

    welcomingPar.innerHTML = welcomingText;
    welcomingPar.style.opacity ="0";
    textbubble.appendChild(welcomingPar);

    var animateText = anime({
        targets:welcomingPar,
        opacity: 1,
        delay: 1000
    });
}

function showThirdMessage() {
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];

    var dragNDropMessage4 = "Finally, you can delete the weather icon by pressing" +
        " the delete-button on the right side of the screen.";

    textPar.style.opacity = "0";

    anime({
        targets: textbubble,
        height: '110px',
        width: '240px',
        easing: 'easeInOutQuart'
    });

    anime({
        targets: textPar,
        innerHTML: dragNDropMessage4,
        opacity: 1,
        delay:1000
    });
}

function showFinalMessage() {
    var textbubble = document.getElementsByClassName('text-bubble')[0];
    var textPar = document.getElementsByClassName("welcoming-par")[0];

    var dragNDropMessage4 = "That's pretty much it. Now we'll let you explore the endless possibilites" +
        " with Lifeganizer! ";

    textPar.style.opacity = "0";

    anime({
        targets: textbubble,
        height: '110px',
        width: '240px',
        easing: 'easeInOutQuart'
    });

    anime({
        targets: textPar,
        innerHTML: dragNDropMessage4,
        opacity: 1,
        delay:500
    });
}

function tutorialEventHandlers() {
    $(document).on('click', '.cancel-tutorial', function() {
        cancelTutorial();
    });

    $(document).on('click', '.overlay, .middle-side', function(e) {
        // console.log(currentHighlightedObject);
        // if (e.target.classList.contains('middle-side') || e.target.classList.contains('overlay')) {
            tutorialClicks++;
            // console.log(tutorialClicks);
        // }
        if(tutorialClicks == 1) {
            showFirstMessage();
        }
        else if(tutorialClicks == 2) {
            showFirstMessageSecond();
        }

        else if (tutorialClicks == 3) {
            tryItOutNow();
        }
        else if (tutorialClicks == 4) {
            showSecondMessage();
        }
        else if (tutorialClicks ==5) {
            tryItOutNow();
        }
        else if (tutorialClicks ==7) {
            showSecondMessageSecond();
        }
        else if (tutorialClicks == 8) {
            tryItOutNow();
        }
        else if (tutorialClicks == 9) {
            showThirdMessage();
        }

        else if (tutorialClicks == 10) {
            showFinalMessage();
        }
        else if (tutorialClicks == 11) {
            window.location.href = "Creator_hub2.html?lang=en";
        }
    });

}

function cancelTutorial() {
    /*
    ADD CODE HERE LATER
     */
}