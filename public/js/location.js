$(function(){
    $(".left_map > span > a").on("click", function(){
        $(this).parent("span").addClass("on");
        $(this).parent("span").siblings().removeClass("on");
    });
});