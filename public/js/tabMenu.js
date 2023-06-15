$(()=>{
    $(".menu_wrap").on("click",(e)=>{
        e.preventDefault();
        $(".hbg_menu").stop().toggleClass("show");
        $(".slide_gnb").stop().toggleClass("show");
        $("body").stop().toggleClass("show");
    })
});