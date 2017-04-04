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

    $(document).on('click', '.pop-up-button', function () {
       $('.pop-up-button').animate({'width':'388px','height':'315px'}, 200);
       $('.pop-up-button-text').animate({'height':'200px'}, 500);
       var hiddenDiv = document.getElementsByClassName('pop-up-register')[0];
       hiddenDiv.style.display = 'inline-block';

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

function showLoginOverlay() {
    //show the overlay that greys everything out
    var overlay = document.getElementsByClassName("overlay")[0];
    overlay.style.display = "block";



}


