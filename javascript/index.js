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
}

function changeHeaderSize() {
    window.addEventListener('scroll', function(e){
        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
            shrinkOn = 300,
            header = document.querySelector(".header");
        if (distanceY > shrinkOn) {
            $('.header').addClass('smaller');
            $('.header-text').addClass('smaller');
            $('.about').addClass('smaller');
            $('.login').addClass('smaller');
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



