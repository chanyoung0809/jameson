const moreBtn = document.querySelector(".more_wrap > button");
const toggletext = document.querySelector(".more_wrap > button > span");
const recipes = document.querySelectorAll(".recipes_wrap .recipes");
let startidx = 3;

// 레시피 전체 페이지 더보기 버튼 구현
moreBtn.addEventListener("click",()=>{
    recipes.forEach((recipe, idx)=>{
        if (idx >= startidx && idx < startidx + 3) {
            recipe.style.display = "block";
        }
    });
    startidx += 3;
    if (startidx >= recipes.length) {
        toggletext.textContent = "숨기기";
    } else if (startidx > 3 && startidx < recipes.length) {
        toggletext.textContent = "더보기";
    } else {
        toggletext.textContent = "더보기";
        recipes.forEach((recipe, index)=>{
        if (index >= 3) {
            recipe.style.display = "none";
        }
    });
    startidx = 3;
  }
});

$(function(){

    const sortsBtn = $(".sorting_wrap > .sorts > li:nth-child(1) > span");
    const nameArea = $(".sorting_wrap > .whiskey");
    const sortArea = $(".sorting_wrap > .sorts");
    const sorts = $(".sorting_wrap > .sorts > li");
    sortsBtn.on("click",function(){
        sortArea.toggleClass("on");
    });
});
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
