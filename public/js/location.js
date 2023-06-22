const spans = document.querySelectorAll(".left_map > span"); 
// 지역으로 표시될 각각의 span 태그
const links = document.querySelectorAll(".left_map > span > a");
// span 태그 안의 a 태그
links.forEach((link) => {
    // 반복문 실행
    link.addEventListener("click", () => {
        spans.forEach((span) => span.classList.remove("on"));
        link.parentNode.classList.add("on");
    });
});

//지역명 검색
const locationForm = document.querySelector("#locationForm");
const submitBtn1 = document.querySelector("#locationForm > .submitBtn");
const locationSelect = document.querySelector("#locationForm > .location");
   
submitBtn1.onclick = function(e){
    if(locationSelect.value === "noselect"){
        e.preventDefault();
        alert("지역을 선택해주세요");
    }
    else{
        locationForm.submit();
    }
    
}

// 매장명. 도로명주소, 지번주소 검색
const searchForm = document.querySelector("#searchForm");
const inputText = document.querySelector("#searchWord");
const searchBtn = document.querySelector("#searchForm > .submitBtn");
searchBtn.addEventListener("click", (event)=>{

    let data = inputText.value; // 검색어 입력값 변수에 저장
    // 지역변수이기 때문에 서버 쪽 변수랑 이름 겹쳐도 됨 
    let result = data.trim();
   
    // trim() <- 입력값 앞 뒤 빈 공백문자 제거 
    if(result === ""){
        // 입력값 없으면 넘어가지 못하게 하고
        event.preventDefault();
        alert("검색어를 입력하세요");
    }
    // 입력값 있어야 넘어가게 함
    else{
        searchForm.submit();
    }

});