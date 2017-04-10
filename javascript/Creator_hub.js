var dropCalls = 0;

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

    $(document).on('click','.weather-option', function() {
        if ($(this).hasClass('clicked')) {
            $(this).removeClass('clicked');
            $(this).find('.hidden-options').css("display", "none");
        }
        else {
            // $(this).animate({'width': '388px', 'height': '350px'}, 200);
            $(this).addClass('clicked');
            $(this).find('.hidden-options').css("display", "block");
            // $('this .hidden-options').css("display", "block");
        }


    });

}

function addAttributesToWeatherOptionDiv() {
    var numberOfDivs = document.querySelectorAll('.weather-option').length;
    for (var i=0;i<numberOfDivs;i++) {
        console.log('loop number: ' + i);
        var selectedDiv = document.getElementsByClassName('weather-option')[i];
        var iInt = i.toString();
        selectedDiv.setAttribute('weatherId', iInt);
        selectedDiv.setAttribute('draggable','true'); //add the eventlisteners here instead of in the html.
        selectedDiv.addEventListener('dragstart', drag, false);
        selectedDiv.addEventListener('dragenter', drag_enter, false);
        selectedDiv.addEventListener('dragleave',drag_leave,false);
    }

}


/*
These functions are used to add a border to the droppable area. They are not working correctly right now
since the draggable divs are smaller than the area they are located in.
 */
function drag_enter(ev) {
    document.getElementsByClassName('middle-side')[0].style.border = '3px dotted black';

}

function drag_leave(ev) {
    document.getElementsByClassName('middle-side')[0].style.border = "";

}
/*
We use two different drag events - one when you drag something from the left side of the screen and one when
you drag an already dragged object. The difference is that when you drag an already dragged object it has an attribute called
fromleft, which equals true. This makes it so that it doesn't create a new element when dropped. In the second drag function we also
give another attribute with the id of the selected element, so that the correct element is moved.
 */

function drag(ev) {
    var dropDiv = document.getElementsByClassName('middle-side')[0];
    dropDiv.style.border = "3px dotted black";

    var style = window.getComputedStyle(ev.target, null);
    ev.dataTransfer.setData("text/plain", (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) +
        ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY) + ',' + ev.target.getAttribute('weatherId'));
}

function drag2(event) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
        (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY) + ',' + event.target.getAttribute('fromleft') + ',' + event.target.getAttribute('id'));
}

/*
 Allows an option to be dropped into the middle side of the page. If this
 function is not called it won't be droppable.
 */
function dragOver(e) {
    e.preventDefault();

}

/*
When an option is dropped the function first checks if it has been already dragged from the left side or not.
If it has been dragged from the left side we do not have to create a new element and instead just move the element that is dropped.
If the element is dragged from the left we first check which option it is and then create the correct icon.
 */
function drop(ev, target) {
    target.style.border = 'none';
    dropCalls++; //enumerate the dropcalls so that when a new object is created it gets an unique id.
    var dropCallsString = dropCalls.toString(); //change the id into a string so that it can be parsed.
    var offset = ev.dataTransfer.getData("text/plain").split(','); //put the data into an array and split at a comma-sign.

    if (offset[2] == 'true') {
        var draggedId = offset[3];
        var draggedDiv = document.getElementById(draggedId);
        draggedDiv.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
        draggedDiv.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    }
    else if (offset[2] == 0) {
            // var placementDiv = document.createElement('div');
            // placementDiv.className = 'placement-div';
            // placementDiv.setAttribute('draggable','true');
            // placementDiv.addEventListener('dragstart', drag2, false);

            var sunny = document.createElement('div');
            sunny.setAttribute('id', dropCallsString); //give an id so that we can choose the correct object to be dragged.
            sunny.setAttribute('class','icon-middle sunny');
            sunny.setAttribute('draggable','true'); //the object has to be able to be moved later on by the user.
            sunny.setAttribute('fromleft','true');
            sunny.addEventListener('dragstart', drag2, false);

            var sun = document.createElement('div');
            sun.className ='sun';

            var rays = document.createElement('div');
            rays.className = 'rays';

            sunny.appendChild(sun);
            sun.appendChild(rays);
            // placementDiv.appendChild(sunny);
            document.getElementsByClassName('middle-side')[0].appendChild(sunny);

            sunny.style.left = ev.pageX - '367' + 'px' ; //create an offset so that it is placed correctly
            sunny.style.top = ev.pageY - '53'+ 'px' ;
    }

    else if (offset[2] == 1) {
        var cloudy = document.createElement('div');
        cloudy.setAttribute('id', dropCallsString);
        cloudy.setAttribute('class', 'icon-middle cloudy');
        cloudy.setAttribute('draggable','true');
        cloudy.setAttribute('fromleft','true');
        cloudy.addEventListener('dragstart', drag2, false);

        var cloud = document.createElement('div');
        cloud.className ='cloud';

        var cloud2 = document.createElement('div');
        cloud2.className = 'cloud';

        cloudy.appendChild(cloud);
        cloudy.appendChild(cloud2);
        document.getElementsByClassName('middle-side')[0].appendChild(cloudy);

        // sunny.style.left = (ev.clientX + parseInt(offset[0],10)) + 'px';
        cloudy.style.left = ev.pageX - '367' + 'px' ;
        // sunny.style.top = (ev.clientY + parseInt(offset[1], 10)) + 'px';
        cloudy.style.top = ev.pageY - '53'+ 'px' ;
    }


    ev.preventDefault();

}



