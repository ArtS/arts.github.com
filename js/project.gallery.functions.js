var projectID = 0;

$(document).on("click", ".project", function () {
    projectID = $(this).data('id');
});

jQuery(document).ready(function($) {

    $('.project').fancybox({
        width: 760,
        height: 700,
        'transitionIn'		: 'none',
        'transitionOut'		: 'none'
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
        Previous(projectID);
    });

    jQuery('.next').click(function(){
        Next(projectID);
    });
});
function Next(currentProjectID)
{
    var next_project_id = currentProjectID + 1;
    var num = parseInt(next_project_id);

    if (num!=5){
        projectID = next_project_id;
        $.fancybox.close();
        $("#link"+next_project_id).click();
    }else{
        projectID = 1;
        $.fancybox.close();
        $("#link"+projectID).click();
    }
}
function Previous(currentProjectID)
{
    var prev_project_id = currentProjectID - 1;
    var num = parseInt(prev_project_id);
    if (num!=0){
        projectID = prev_project_id;
        $.fancybox.close();
        $("#link"+prev_project_id).click();
    }else{
        projectID = 4;
        $.fancybox.close();
        $("#link"+projectID).click();
    }
}
