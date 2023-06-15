$(function(){
    $(".left_map > span > a").on("click", function(){
        $(this).parent("span").addClass("on");
        $(this).parent("span").siblings().removeClass("on");
    });
    $(".left_map > span > a").on("mouseover", function(){
        $(this).parent("span").addClass("on");
    });
    $(".left_map > span > a").on("mouseleave", function(){
        $(this).parent("span").removeClass("on");
    });

});