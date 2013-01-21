jQuery(document).ready(function($) {

    $('.project').fancybox({
        width: 760,

        transitionIn  : 'none',
        transitionOut : 'none',
        nextEffect    : 'none',
        prevEffect    : 'none',
        arrows		  : false
    });

    $('.nivoSlider').nivoSlider({
        effect: 'sliceDown',
        slices: 1,
        boxCols: 1,
        boxRows: 1,
        animSpeed: 100,
        pauseTime: 300000,
        startSlide: 0,
        directionNav: true,
        controlNav: false,
        controlNavThumbs: false,
        pauseOnHover: true,
        manualAdvance: false,
        randomStart: false
    });

    jQuery('.prev').click(function(){
        $.fancybox.prev();
    });

    jQuery('.next').click(function(){
        $.fancybox.next();
    });
});


