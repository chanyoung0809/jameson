$(function(){
    const moreBtn  =  $(".more_wrap > button");
    const toggletext =  $(".more_wrap > button > span");
    const recipes = $(".recipes_wrap .recipes");
    let startidx = 3;

    moreBtn.on("click",function(){
        recipes.slice(startidx, startidx+3).show();
        startidx += 3;
        if(startidx == recipes.length){
            toggletext.html("숨기기");
        }
        else if(startidx > recipes.length){
            recipes.hide();
            startidx = 3;
            recipes.slice(0, startidx).show();
            toggletext.html("더보기");
        }
    });
});