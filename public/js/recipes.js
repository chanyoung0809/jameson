const recipes =  Array.from(document.querySelectorAll(".recipes_wrap .recipes")); // 레시피들
let startidx = 3; // 시작 갯수
let recipeidx = 3; // 출력할 레시피 갯수
let maxidx = recipes.length // 최대 갯수

// 레시피 전체 페이지 더보기 버튼 구현
if (recipes.length > 3){ // 레시피가 3개 이상일 때만 함수 실행
    const moreBtn = document.querySelector(".more_wrap > button"); //더보기 버튼
    const toggletext = document.querySelector(".more_wrap > button > span"); //더보기 버튼의 텍스트 구역

    moreBtn.addEventListener("click",()=>{
        if (recipeidx < maxidx) { // 전체 레시피보다 적게 보이고 있을 때
            recipeidx += 3; //레시피 갯수 3씩 증가
            toggletext.textContent = "더보기";
            // 출력된 레시피 갯수가 전체 레시피 갯수만큼 보이게 되면
            if (recipeidx >= maxidx){ 
                toggletext.textContent = "숨기기";
            }
        } 
        else{ // 숨기기 기능 눌렀을 때 
            recipeidx = 3; //출력할 레시피 갯수 3으로 고정
            toggletext.textContent = "더보기"; // 더보기 기능으로 변경
            recipes.forEach((recipe)=>{
                recipe.style.display='none'; //모든 레시피 보이지 않게 함
            })
            
        }  
        // 증감할 레시피 갯수만큼 보이게 처리
        for(let i = 0; i < recipeidx; i++){
            recipes[i].style.display="block";
        }
    });
}


window.onload = () => {
    const sorts = document.querySelector(".sorts");
    const sort1depth = document.querySelector(".sort1depth");
  
    sort1depth.addEventListener('click', (e) => {
      e.preventDefault();
      sorts.classList.toggle("on");
    });
  
    window.onbeforeunload = () => {
      sorts.classList.remove("on");
    };
};
  

