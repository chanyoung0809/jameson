// 비밀번호 입력 구간
const passwordInput1 = document.querySelector('#memberpass');
// 비밀번호 입력내용 토글 버튼
const passwordToggle1 = document.querySelector('.memberpass .password-toggle-icon');
console.log(passwordInput1, passwordToggle1);
// 비밀번호 확인 구간
const passwordInput2 = document.querySelector('#memberpass_check');
// 비밀번호 확인 입력내용 토글 버튼
const passwordToggle2 = document.querySelector('.memberpass_check .password-toggle-icon');

/* 비밀번호 입력내용 보이게/안보이게 해주는 함수 */
let pwTypeToggle = (passwordInput, passwordToggle)=>{  
    //입력내용 확인 눈모양 아이콘 클릭하면
    passwordToggle.addEventListener('mousedown', ()=> {
        // 패스워드가 보임
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        }
    });
    // 해당 영역에서 마우스가 벗어나거나, 클릭을 해제하면
    // 패스워드가 보이지 않게 함
    passwordToggle.addEventListener('mouseleave', ()=> {
        passwordInput.type = 'password';
    });
    passwordToggle.addEventListener('mouseup', ()=> {
        passwordInput.type = 'password';
    });
}
//비밀번호, 비밀번호확인창에 기능 부여
pwTypeToggle(passwordInput1, passwordToggle1);
pwTypeToggle(passwordInput2, passwordToggle2);

//이메일 부분 도메인 선택
const domainSelect = document.querySelector('#domain_select');
const domainInput = document.querySelector('#email_domain');
const nextInput = document.querySelector('#memberphone1');
// 이메일 도메인 부분 선택/입력하는 함수
domainSelect.addEventListener("change", ()=>{
    const selectedOption = domainSelect.options[domainSelect.selectedIndex];
    // 셀렉트 태그의 옵션들 중 선택된 옵션값을 지정
    if (selectedOption.value === '직접입력') {
        //직접입력창 눌렀을 때
        domainInput.removeAttribute('readonly');
        domainInput.value = ''; //읽기전용 속성 지우고 입력가능하게 변경
        domainInput.focus(); // 직접입력 창으로 포커싱
    } 
    else {
        // 도메인 선택했을 때
        domainInput.value = selectedOption.value;
        domainInput.setAttribute('readonly', 'readonly');
        // 선택한 옵션으로 인풋값 변경하고 입력불가하게 변경
        nextInput.focus(); //다음 입력창으로 포커싱
    }
});

// 휴대폰번호 입력 구간
const memberphone1 = document.querySelector('#memberphone1');
const memberphone2 = document.querySelector('#memberphone2');
const memberphone3 = document.querySelector('#memberphone3');
// 인풋태그 3개 배열 변수
const memberphones = document.querySelectorAll(".memberphone_wrap > input");
// 각 인풋태그의 최대길이를 담고있는 배열
const maxLengthArray = [3, 4, 4];

// 입력값 통제하는 함수 
let handleInput = (event) => {
    const inputValue = event.target.value; // 현재 입력한 값
    const numValue = inputValue.replace(/\D/g, ''); // 입력값을 정규식으로 검사해서, 숫자가 아닌 문자를 제거

    // 실제 입력값과 정규식 통과한 입력값이 다르면 입력값을 정규식 통과한 입력값으로 변경(숫자가 아닌 문자 없앰)
    if (numValue !== inputValue) {
        event.target.value = numValue;
    }
    // 현재 입력하고있는 핸드폰번호 인풋값의 순번과 다음 순번
    const currentIndex = Array.from(memberphones).indexOf(event.target);
    const nextIndex = currentIndex + 1;

    // 칸마다 최대값 작성하면
    if (numValue.length === maxLengthArray[currentIndex]) {
        // 다음 인덱스가 존재하는 경우에만 다음 인덱스의 인풋 태그로 포커싱
        if (nextIndex < memberphones.length) {
            memberphones[nextIndex].focus();
        }
    }
}

//
let handleKeydown = (event) => {
    // 현재 인풋태그의 순번값과 이전 순번값 체크
    const currentIndex = Array.from(memberphones).indexOf(event.target);
    const prevIndex = currentIndex - 1;
    //현재 입력값이 없는 상태에서 백스페이스를 누르면
    if (event.target.value === '' && event.key === 'Backspace') {
        // 이전 인덱스가 있는 경우에만 이전 인덱스의 인풋태그로 포커싱
        if (prevIndex >= 0) {
            memberphones[prevIndex].focus();
        }
    }

    // 현재 인덱스가 0보다 큰 경우에만
    if (currentIndex > 0) {
        // 이전 입력값 검사해서 입력값 다 채우지 않았을 경우(공백포함)
        if (memberphones[prevIndex].value.length !== maxLengthArray[prevIndex]) {
            // 입력값 없는 이전 인풋태그로 포커싱
            event.target.value = '';
            memberphones[prevIndex].focus();
        }
    }
}
// 각 인풋태그에 입력시, 키다운시 이벤트 함수 담아줌
memberphones.forEach((input) => {
  input.addEventListener('input', handleInput);
  input.addEventListener('keydown', handleKeydown);
});

// 모든 인풋 태그에 입력값 컨트롤하는 함수, 백스페이스 입력 시 이전 입력창으로 가는 태그를 심어줌
memberphones.forEach((input) => {
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeydown);
});

/* 정규식 체크 구간 */
// 이름 정규식
const nameRgx = /^[가-힣]{2,6}$/;
// 아이디 정규식
const idRgx = /^[\w\-]{6,12}$/;
// 비밀번호 정규식
const pwRgx = /^(?=.*\d)(?=.*\w)[\w\d!@#$%^&*()-]{8,20}$/;
// 이메일 정규식
const emailRgx = /^[\w]+@[a-z]+\.[a-z\.]{2,5}$/;
// 휴대폰번호 정규식
const phoneRgx = /^010-\d{4}-\d{4}$/;

// 이용약관 체크박스
const memberterms = document.querySelector("#memberterms");

// DB 전달할 form 태그
const join_form = document.querySelector("#join_form");

// 가입 버튼
const joinBtn = document.querySelector("#joinBtn");

// 정규식에 어긋났을 때 띄울 메세지 에러메세지 텍스트 객체
const ErrorArea = { terms:"개인정보 처리 약관", username: "이름", id: "아이디", pw: "비밀번호", pwChk: "비밀번호 확인", email: "이메일 주소", phone: "핸드폰번호" };
// 서버 전송시 논리값 처리해줄 객체
const validObj = { terms:false, username: false, id: false, pw: false, pwChk: false, email: false, phone: false };

// 정규식 체크할 함수(인풋태그가 하나로 이루어진 경우)
const ValidChkFun = (inputRgx, inputArea, keyname) => {
    if (inputRgx.test(inputArea.value)) { // 정규식 통과하면
        validObj[keyname] = true; // 해당
        inputArea.parentNode.parentNode.classList.add("ok");
    } else {
        inputArea.parentNode.parentNode.classList.add("error");
        inputArea.focus();
        return;
    }
};

// 정규식 체크할 함수2(인풋태그가 여러개인 경우 - 휴대폰번호, 이메일)
const ValidChkFun2 = (inputRgx, inputAreas, inputValue, keyname) => {
    if (inputRgx.test(inputValue)) {
        validObj[keyname] = true;
        inputAreas[0].parentNode.parentNode.classList.add("ok");
    } else {
        inputAreas[0].parentNode.parentNode.classList.add("error");
        for (const key in validObj) {
            validObj[key] = false;
        }
        inputAreas[0].focus();
        return;
    }
};

// 가입 버튼 눌렀을 때
joinBtn.addEventListener("click", (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 막음
    // 개인정보처리약관 확인
    if(memberterms.checked){
        validObj["terms"] = true;
    }
    else {
        alert(`${ErrorArea["terms"]}에 동의하셔야 회원가입이 가능합니다.`);
        return;
    }
    if (!validObj["terms"]) return;
    // 이름 입력태그
    const nameArea = document.querySelector("#memberName");
    // 아이디 입력태그
    const idArea = document.querySelector("#memberid");
    // 비밀번호 입력태그
    const pwArea = document.querySelector("#memberpass");
    // 비밀번호확인 입력태그
    const pwChkArea = document.querySelector("#memberpass_check");

    // 이메일 입력값, 휴대폰 입력값(인풋태그 여러개라서 합쳐줘야 함.)
    const emailIdValue = document.querySelector("#memberemail").value;
    const emailDomainValue = document.querySelector("#email_domain").value;
    const emailValue = `${emailIdValue}@${emailDomainValue}`;
    const emailAreas = document.querySelectorAll(".memberemail_wrap > input");
    const phoneAreas = document.querySelectorAll(".memberphone_wrap > input");
    const phoneValue = `${memberphone1.value}-${memberphone2.value}-${memberphone3.value}`;

    ValidChkFun(nameRgx, nameArea, "username"); // 이름
    if (!validObj["username"]) return;
    ValidChkFun(idRgx, idArea, "id"); // 아이디
    if (!validObj["id"]) return;
    ValidChkFun(pwRgx, pwArea, "pw"); // 비밀번호
    if (!validObj["pw"]) return;

    if (pwChkArea.value === pwArea.value) { // 비밀번호 확인값
        validObj["pwChk"] = true;
        pwChkArea.parentNode.parentNode.classList.add("ok");
    } else {
        pwChkArea.parentNode.parentNode.classList.add("error");
        pwChkArea.focus();
        for (const key in validObj) {
            validObj[key] = false;
        }
        return;
    }

    if (!validObj["pwChk"]) return;
    ValidChkFun2(emailRgx, emailAreas, emailValue, "email"); // 이메일
    if (!validObj["email"]) return;
    ValidChkFun2(phoneRgx, phoneAreas, phoneValue, "phone"); // 핸드폰번호
    if (!validObj["phone"]) return;

    // 모든 키의 값이 true인지 확인
    const isFormValid = Object.values(validObj).every((value) => value === true);
    if (isFormValid) {
        join_form.submit();
    } 
    else {
        e.preventDefault();
        alert("개인정보 입력값을 확인해주세요.");
    }
});


