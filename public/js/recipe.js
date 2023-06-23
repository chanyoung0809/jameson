// 레시피 상세페이지 url 복사하기, SNS 공유하기 버튼 기능
const facebook = document.querySelector('.facebook');
const twitter = document.querySelector('.twitter');
const pageUrl = window.location.href;

const copyUrl = async () => {
    await navigator.clipboard.writeText(pageUrl);
    alert("url이 복사되었습니다. 원하는 곳에 자유롭게 붙여넣으세요!")
};

twitter.addEventListener('click', () => {
    const sendText = document.querySelector('.share_msg').innerText;

    window.open(`https://twitter.com/intent/tweet?text=${sendText}&url=${pageUrl}`);
});

facebook.addEventListener('click', () => {
    window.open(`http://www.facebook.com/sharer/sharer.php?u=${pageUrl}`);
});

const slides = document.querySelectorAll("#container > div.recipe_wrap > div.recipes_slide_wrap > div > div > div");
const centerNum = Math.floor((slides.length)/2);

// 레시피 상세페이지 스와이퍼
let swiper = new Swiper(".recipesSwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    initialSlide: centerNum,
    slidesPerView: "auto",
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },
});
