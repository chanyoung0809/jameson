// 관리자 계정정보 자동완성
const adminAccountBtn = document.querySelector("#adminAccountBtn");
const memberid = document.querySelector("#memberid");
const memberpass = document.querySelector("#memberpass");
adminAccountBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    memberid.value = "test_1234";
    memberpass.value = "test_123456";
});