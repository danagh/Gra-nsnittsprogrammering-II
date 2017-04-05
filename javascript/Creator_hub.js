$(document).ready(function() {
    addAttributesToWeatherOptionDiv();
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




function addAttributesToWeatherOptionDiv() {
    var numberOfDivs = document.querySelectorAll('.weather-option').length;
    for (var i=0;i<numberOfDivs;i++) {
        console.log('loop number: ' + i);
        var selectedDiv = document.getElementsByClassName('weather-option')[i];
        var iInt = i.toString();
        selectedDiv.setAttribute('weatherId', iInt);
    }


}

function drag(ev) {
    var weatherId = ev.target.getAttribute("weatherId"); //get the drinkId
    ev.dataTransfer.setData("weather-id", weatherId);


}

/*
 Allows a drink-div to be dropped into the order-summary side of the page. If this
 function is not called it won't be droppable. Go
 */
function allowDrop(ev) {
    ev.preventDefault();

}

/*
 When a drink is dropped it has to give the drinkId. We then call the findDrinkById-function
 to get the drinkPrice and drinkName so thatwe can show the correct information in
 the order summary. To show the added drinks we call the order.addItem-function that we created.
 */
function drop(ev) {
    ev.preventDefault();
    var draggedWeatherId = ev.dataTransfer.getData("weather-id");
    console.log(draggedWeatherId);
    


}

