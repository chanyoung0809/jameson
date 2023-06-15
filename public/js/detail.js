$(function(){
    $(".attention_wrap .title").on("click",()=>{
        $(".attention_wrap .title").toggleClass("on");
    })
});

let count = 1;
const minusBtn = document.querySelector(".minus");
const plusBtn = document.querySelector(".plus");
const countarea = document.querySelector(".count");
const prdPriceArea = document.querySelector(".price");

const prdPrice = Number(prdPriceArea.innerText.replaceAll(",", ""));


plusBtn.addEventListener("click",()=>{
    (count === 12) ? count = 12 : count+=1;
    countarea.value = count;
    let totalPrice = prdPrice * count;
    prdPriceArea.innerText = totalPrice.toLocaleString();
});

minusBtn.addEventListener("click",()=>{
    (count === 1) ? count = 1 : count-=1;
    countarea.value = count;
    let totalPrice = prdPrice * count;
    prdPriceArea.innerText = totalPrice.toLocaleString();
});