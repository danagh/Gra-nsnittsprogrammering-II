$(document).ready(function() {
    createEventHandlers();
});

function createEventHandlers() {
    $(document).on('click', '.about', function(){
        document.querySelector('#about-id').scrollIntoView({
            behavior: 'smooth'
        });
    });
}



