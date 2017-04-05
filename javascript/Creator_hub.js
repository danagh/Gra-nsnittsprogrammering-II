$(document).ready(function() {
    createEventHandlers();
});

function createEventHandlers() {
    $(document).on('click', '.dropbtn', function() {
        if ($('.dropdown-content').hasClass('show')) {
            $('.dropdown-content').removeClass('show');
        }
        else {
            $('.dropdown-content').addClass('show');
        }
    });
    window.onclick = function(e) {
        if (!e.target.matches('.dropbtn')) {
            var myDropdown = $(".dropdown-content");
            if (myDropdown.hasClass('show')) {
                myDropdown.removeClass('show');
            }
        }
    }

}

/*$(function(){
    // Find selected div
    var selected = $('#scroll .selected');
    // Scroll container to offset of the selected div
    selected.parent().parent().scrollTop(selected[0].offsetTop);
});*/