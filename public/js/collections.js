$(function(){
    let tradMenu = $("#container > div.navis_wrap > ul > li:nth-child(1)");
    let flavMenu = $("#container > div.navis_wrap > ul > li:nth-child(2)");
    let top1 = $("#Traditional").offset().top - 76;
    let top2 = $("#Flavorful").offset().top - 76;
    console.log(top1);
    console.log(top2);

    tradMenu.on("click",()=>{
        $("html, body").animate({scrollTop:top1}, 1000);	// 해시(#eu, #us, ...)가 있는 위치로 스크롤
    });
    flavMenu.on("click",()=>{
        $("html, body").animate({scrollTop:top2}, 1000);	
    });
});