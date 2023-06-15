let c2swiper = new Swiper(".c2swiper", {
    speed: 1000,
    spaceBetween: 100,
    simulateTouch: false,
    direction: 'horizontal',
    loop: true, //무한반복 T/F
    preventClicks:true,
    preventClicksPropagation:true, 
    preventInteractionOnTransition:true,
    resizeObserver:true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    // 자동실행 관련 옵션들
    autoplay: {
        delay: 5000,
        pauseOnMouseEnter : true
    },
    effect: 'fade',
});
let c2textswiper = new Swiper(".c2textswiper", {
    direction: 'horizontal',
    loop: true, //무한반복 T/F
    simulateTouch: false,
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    },
});

//스와이퍼 1, 2를 연동
c2swiper.controller.control = c2textswiper;
c2textswiper.controller.control = c2swiper;