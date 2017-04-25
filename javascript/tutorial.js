function createWholeOverlay() {
    var overlay=document.getElementsByClassName('overlay')[0];
    overlay.style.display = "block";
    var animateOverlay = anime({
        targets:overlay,
        scale: 2,
        easing: 'easeInOutQuart'
    });
}