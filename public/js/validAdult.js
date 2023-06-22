// 입력창 4개 선택
const inputFields = document.querySelectorAll('.input-field');

// 입력 필드에 자동 포커스 설정하는 함수
function setFocus(index) {
    inputFields[index].focus();
}

// 입력값 컨트롤하는 함수
function handleInput(event) {
    const inputValue = event.target.value; // 현재 입력한 값
    const numValue = inputValue.replace(/\D/g, ''); // 입력값을 정규식으로 검사해서, 숫자가 아닌 문자를 제거

    if (numValue !== inputValue) { // 입력받은 값과 숫자로 변환된 값이 같지 않다면
        event.target.value = numValue; //입력된 값을 숫자로 변환값으로 바꿈
    }

    const currentIndex = Array.from(inputFields).indexOf(event.target); // 현재 인덱스
    const nextIndex = currentIndex + 1; // 다음 인덱스

    if (numValue.length === 1) { // 1글자가 입력되면
        if (nextIndex < inputFields.length) { // 다음 인덱스가 인풋 태그의 총 갯수보다 작을 때 까지는
            setFocus(nextIndex);  // 입력 완료하면 다음 인덱스의 입력창으로 이동
        } 
        else {
            // 마지막 입력 필드까지 입력이 완료되면 성인 여부 확인 후 페이지 이동 처리
            const birthYear = parseInt(getInputValue(), 10); // 최종 입력값을 10진수 정수 데이터로 변환
            const currentYear = new Date().getFullYear(); // 현재 연도
            const legalAgeYear = currentYear - 20; // 만 19세 이상(20세)부터 입력 가능
            const maximumAgeYear = currentYear - 100; // 100세 이하까지 입력 가능    
            if (birthYear <= legalAgeYear && birthYear >= maximumAgeYear) {
            // 성인이므로 메인페이지 이동 처리
                window.location.href="/";
            } 
            else { // 미성년자이거나 유효하지 않은 값일 경우
                alert('입력하신 연도를 다시 확인해주세요.');
                inputFields.forEach((input) => {
                    input.value = ''; // 모든 인풋 태그의 값을 비움
                });
                inputFields[0].focus(); //첫번째 인풋 태그로 포커싱
            }
        }
    }
}

// 입력된 값을 숫자 4자리 형식으로 가져오는 함수
function getInputValue() {
    let value = '';
    inputFields.forEach((input) => {
        value += input.value;
    });
    return value;

}

// 백스페이스 눌렀을 때 이전 인풋 태그로 이동시킴
function handleKeydown(event) {
    const currentIndex = Array.from(inputFields).indexOf(event.target); // 현재 인덱스
    const prevIndex = currentIndex - 1; // 이전 인덱스
  
    if (event.target.value === '' && event.key === 'Backspace' ) {
        // 현재 입력값이 없고, 백스페이스를 눌렀을 때
        if (prevIndex >= 0) { // 이전 인덱스가 존재하는 경우에만(이전 인덱스가 0, 1, 2 일 때만)
            // 이전 입력 창으로 포커스 이동
            setFocus(prevIndex);
        }
    }
}

// 모든 인풋 태그에 입력값 컨트롤하는 함수, 백스페이스 입력 시 이전 입력창으로 가는 태그를 심어줌
inputFields.forEach((input) => {
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', handleKeydown);
});

// 창이 새로고침될 때 첫 번째 인풋 태그에 포커싱해줌
window.addEventListener('load', () => {
    inputFields[0].focus();
});