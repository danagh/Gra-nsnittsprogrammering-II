$(document).ready(function() {
    changeHeaderSize();
    createEventHandlers();
});

function createEventHandlers() {
   // taken from http://stackoverflow.com/questions/18071046/smooth-scroll-to-specific-div-on-click
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

    $(document).on('click', '.pop-up-button', function (e) {
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) {
            return true;
        }

        if ($('.pop-up-button').hasClass('clicked')) {
            closePopUpButton();
        }
        else {
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

    $(document).on('click', '.main-picture', function() {
        if($('.pop-up-button').hasClass('clicked')) {
            closePopUpButton();
        }
    });

    $(document).on('click', '.login-button', function () {
        var enteredEmail = document.getElementsByClassName('username-field')[0].value;
        var enteredPassword = document.getElementsByClassName('password-field')[0].value;
        verifyEmailAndPassword(enteredEmail, enteredPassword);
    });

    $(document).keydown(function(event) { //if the return-button is pressed instead
        if(event.keyCode == 13) {
            $('.login-button').click();
        }
    });
}

function closePopUpButton() {
    $('.pop-up-button').animate({'width':'316.8px','height':'21.9px'}, 200);
    var hiddenDiv = document.getElementsByClassName('pop-up-register')[0];
    setTimeout(function () {
        hiddenDiv.style.display = 'none';
    }, 500);
    $('.pop-up-button').removeClass('clicked');
}

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


