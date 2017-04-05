$(document).ready(function() {
    changeHeaderSize();
    createEventHandlers();
});

function createEventHandlers() {
    $(document).on('click', '.about', function(){
        document.querySelector('#about-id').scrollIntoView({
                behavior: 'smooth'
            });
    });

    $(document).on('click', '.login', function() {
        document.querySelector('#login-div-id').scrollIntoView({
            behavior: 'smooth'
        });
    });

    $(document).on('click', '.header-text', function() {
        document.querySelector('#top').scrollIntoView({
            behavior: 'smooth'
        });
    });

    $(document).on('click', '.pop-up-button', function () {
       $('.pop-up-button').animate({'width':'388px','height':'350px'}, 200);
       $('.pop-up-button').addClass('clicked');
       // $('.pop-up-button-text').animate({'height':'300px'}, 500);
       var hiddenDiv = document.getElementsByClassName('pop-up-register')[0];
       hiddenDiv.style.display = 'inline-block';
    });

    $(document).on('click', '.main-picture', function() {
        if($('.pop-up-button').hasClass('clicked')) {
            $('.pop-up-button').animate({'width':'316.8px','height':'21.9px'}, 200);
            var hiddenDiv = document.getElementsByClassName('pop-up-register')[0];
            hiddenDiv.style.display = 'none';
            $('.pop-up-button').removeClass('clicked');
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

function changeHeaderSize() {
    window.addEventListener('scroll', function(e){
        //If an user scrolls more than 300 pixels then add another class to the header-elements that shrinks them
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 300,
            header = document.querySelector(".header");
        if (distanceY > shrinkOn) {
            $('.header').addClass('smaller');
            $('.header-text').addClass('smaller');
            $('.about').addClass('smaller');
            $('.login').addClass('smaller');
            //Remove the shrink-class from the header elements when an user scrolls upwards again.
        } else {
            if ($('.header').hasClass('smaller') && $('.header-text').hasClass('smaller') && $('.about').hasClass('smaller') && $('.login').hasClass('smaller')  ) {
                $('.header').removeClass('smaller');
                $('.header-text').removeClass('smaller');
                $('.about').removeClass('smaller');
                $('.login').removeClass('smaller');
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


