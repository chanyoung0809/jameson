let swiper = new Swiper(".c3Swiper", {
    direction: 'horizontal',
    loop: true, //무한반복 T/F
    grabCursor:true,
    // 동그라미 버튼 관련 옵션들
    pagination: {
        el: '.swiper-pagination', //동그라미 버튼의 class 이름
        clickable: true, //클릭가불가 (T/F)
    },
    // 자동실행 관련 옵션들
    autoplay: {
        delay: 4000,
        pauseOnMouseEnter : true
    },
    effect: 'flip',
    flipEffect: {
        slideShadows: false,
    },
});

let swiper2 = new Swiper(".textSwiper", {
    direction: 'horizontal',
    loop: true, //무한반복 T/F
    grabCursor:true,
});
//스와이퍼 1, 2를 연동
swiper.controller.control = swiper2;
swiper2.controller.control = swiper;