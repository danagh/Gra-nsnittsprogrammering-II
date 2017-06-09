/*
This file us used for everything in the first page of our website. Mostly it just consists of different eventhandlers
to be able to adapt appropriately to the users actions.
 */

/*
All the animations that are used can be founc with the anime-tag. These are made by a third party framework which can be found here:
 http://animejs.com/
 */

$(document).ready(function() {
    changeHeaderSize();
    createEventHandlers();
});

function createEventHandlers() {
   // taken from http://stackoverflow.com/questions/18071046/smooth-scroll-to-specific-div-on-click
   //Used to scroll down to the appropriate location on the page when the different buttons on the header is clicked.
    $('.about').click(function () {
       $('html,body').animate({
               scrollTop: $(".about-text").offset().top},
           'slow');
   });

    $('.login').click(function () {
        $('html,body').animate({
                scrollTop: $(".login-div-body").offset().top},
            'slow');
        $('.username-field').focus();
    });

    $('.header-text').click(function () {
        console.log("click");
        $('html,body').animate({
                scrollTop: $(".first-main-div").offset().top},
            'slow');
    });

    //When the "Start-here" button is pressed it should open to give more fields for the user to register an user.
    $(document).on('click', '.pop-up-button', function (e) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) {
            return true; //don't close the button if different elements on the button is pressed
        }

        if ($('.pop-up-button').hasClass('clicked')) {
            closePopUpButton();
        }
        else { //the animation of the button
            $('.pop-up-button').animate({'width': '388px', 'height': '350px'}, 200);
            $('.pop-up-button').addClass('clicked');
            // $('.pop-up-button-text').animate({'height':'300px'}, 500);
            var hiddenDiv = document.getElementsByClassName('pop-up-register')[0];
            hiddenDiv.style.display = 'inline-block';

            setTimeout(function () {
                $('.create-email-field').focus();
            }, 300);
        }
    });

    //if the main picture is pressed close down the registration button
    $(document).on('click', '.main-picture', function() {
        if($('.pop-up-button').hasClass('clicked')) {
            closePopUpButton();
        }
    });

    //eventhandler for handling the login-event.
    $(document).on('click', '.login-button', function () {
        var enteredEmail = document.getElementsByClassName('username-field')[0].value;
        var enteredPassword = document.getElementsByClassName('password-field')[0].value;
        verifyEmailAndPassword(enteredEmail, enteredPassword);
    });

    //if the return button is pressed the login-button should be clicked automatically.
    $(document).keydown(function(event) { //if the return-button is pressed instead
        if(event.keyCode == 13) {
            $('.login-button').click();
        }
    });
}

//handling the closing of the button. we use a function since more than one event calls it.
function closePopUpButton() {
    $('.pop-up-button').animate({'width':'316.8px','height':'21.9px'}, 200);
    var hiddenDiv = document.getElementsByClassName('pop-up-register')[0];
    setTimeout(function () {
        hiddenDiv.style.display = 'none';
    }, 500);
    $('.pop-up-button').removeClass('clicked');
}

/*
The header of our page should become smaller or larger depending on if the user scrolls down or up.
 */
function changeHeaderSize() {
    window.addEventListener('scroll', function(e){
        //If an user scrolls more than 300 pixels then add another class to the header-elements that shrinks them
        var language = document.getElementsByClassName('language')[0];
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 300,
            header = document.querySelector(".header");
        if (distanceY > shrinkOn) {
            $('.header').addClass('smaller');
            $('.header-text').addClass('smaller');
            $('.about').addClass('smaller');
            $('.login').addClass('smaller');
            // $('.language').addClass('smaller');
            anime({
                targets: language,
                translateY: -25,
                easing: 'easeInOutQuart',
                duration: 1
            });

            //Remove the shrink-class from the header elements when an user scrolls upwards again.
        } else {
            if ($('.header').hasClass('smaller') && $('.header-text').hasClass('smaller') && $('.about').hasClass('smaller') && $('.login').hasClass('smaller')  ) {
                $('.header').removeClass('smaller');
                $('.header-text').removeClass('smaller');
                $('.about').removeClass('smaller');
                $('.login').removeClass('smaller');
                anime({
                    targets: language,
                    translateY: 2,
                    easing: 'easeInOutQuart',
                    duration: 100
                });
            }
        }
    });
}

//depending on if the login infroamtion is entered correctly login to the next page.
//note that this is not a good implementation and would be completely changed for the "real life version" of the website.
function verifyEmailAndPassword(enteredEmail, enteredPassword) {
    $.getJSON("./accounts.json", function(data) {
       var accounts = data;
       if (enteredEmail == accounts.account1.email && enteredPassword == accounts.account1.password) {
           window.location.href = 'Creator_hub.html';
       }
       else if (enteredEmail == accounts.account2.email && enteredPassword == accounts.account2.password) {
           window.location.href = 'Creator_hub.html';
       }
       else {
           document.getElementsByClassName("username-field")[0].value= ""; //update username and password fields
           document.getElementsByClassName("password-field")[0].value= "";
           var errorMsg = getText("error-login");
           console.log(errorMsg);
           document.getElementsByClassName("error-login")[0].innerHTML =errorMsg;

       }
    });
}


