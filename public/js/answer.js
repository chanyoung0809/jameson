const A_submit = document.querySelector("#Aupdate"); // 폼태그
const A_context = document.querySelector("#A_text"); // 답변내용
const A_submit_Btn = document.querySelector("#A_submit_Btn"); // 전송버튼
const A_date = document.querySelector("#A_date"); //전송일자
let A_valid = false; // 답변내용 유무 체크

A_submit_Btn.addEventListener("click", (e) => {
  e.preventDefault(); // 전송기능 막아놓고
  let choose = confirm("답변 내용은 수정이나 삭제가 어렵습니다. 답변을 잘 작성하셨나요?");
  if (choose) {
    if (A_context.value.length <= 0) {
      alert("답변 내용을 다시 작성해주세요");
    } else {
      A_valid = true;
      submitDate();
      A_submit.submit();
    }
  }
});

let submitDate = () => {
  let date = new Date();
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let writeDate = year + "-" + month + "-" + day;
  A_date.value = writeDate;
};
