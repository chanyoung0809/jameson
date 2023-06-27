const q_submit = document.querySelector("#q_submit"); // 폼태그
const Q_title = document.querySelector("#Q_title"); // 제목
const Q_date = document.querySelector("#Q_date"); // 작성날짜
const Q_file = document.querySelector("#Q_file"); // 첨부파일
const Q_context = document.querySelector("#Q_context"); // 질문내용
const Q_submit_btn = document.querySelector("#Q_submit_btn"); // 전송버튼
const extCheck = [".jpg", ".jpeg", ".png", ".gif", ".webp"]; // 체크할 확장자명

// 첨부파일이 n개 -> 첨부한 파일 중 하나라도 체크할 확장자명이 아니라면 업로드 막아야 함
let validRequest = false; // 파일의 확장자명이 이미지인지 유효성검사용 변수
// true일 때 데이터 전송 처리할 역할
let validCount = 0; //체크 시 이미지 파일인 경우에만 카운트가 1씩 증가

Q_submit_btn.addEventListener("click", (e)=>{
    e.preventDefault(); // 업로드 기능막고
    // 첨부파일이 있는 경우에만, 첨부파일 갯수만큼 반복문 처리
    if(Q_file.files && Q_file.files.length > 0){ 
        for(let i=0; i< Q_file.files.length; i++){

            let fileName = Q_file.files[i].name; // i번째 파일명 가져오기
            
            let fileLength = fileName.length; // 파일명 길이값(나중에 확장자명 식별할 때 사용)
    
            let fileDots = fileName.lastIndexOf("."); // .기호가 시작하는 순번
    
            let fileExts = fileName.substring(fileDots, fileLength); // 추출한 확장자
            
            let fileChange = fileExts.toLowerCase(); // 확장자 소문자로 변경
    
            let result = extCheck.includes(fileChange); //해당 확장명이 위 배열안에 있는지?
    
            if(result){ // 파일이 올바른 이미지 확장명인지를 확인
                validCount++;
                if(validCount === Q_file.files.length){
                    validRequest = true;
                }
            }
        }
        if(validRequest){
            // validRequest 값이 true 라면
            submitDate(); // 작성날짜 input 태그에 삽입
            q_submit.submit(); //업로드 기능 수행
        }
        else{
            // validRequest 값이 false 라면
            e.preventDefault(); // 업로드 기능막고
            validCount = 0; //카운트 숫자 초기화
            alert("이미지 파일만 업로드 가능합니다."); // 경고창
        }
    }
    else { //파일을 첨부하지 않은 경우
        submitDate(); // 작성날짜 input 태그에 삽입
        q_submit.submit(); //업로드 기능 수행
    }
});


let submitDate = ()=>{ // 글 작성 날짜 삽입 위한 함수
    let date = new Date(); // Date 생성
    let year = date.getFullYear(); // 작성연도
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // 작성월(1~9 : 01~09 / 10~12 : 010~012, slice로 뒤부터 2글자 잘라냄)
    let day = ("0" + date.getDate()).slice(-2); // 작성일(1~9 : 01~09 / 10~31 : 010~031, slice로 뒤부터 2글자 잘라냄)
    let writeDate = year + "-" + month + "-" + day; // 최종 삽입할 작성연월일 (yyyy-mm-dd 형식)
    
    Q_date.value = writeDate; //작성일자 인풋 태그 값으로 작성일자 값 저장.
}
