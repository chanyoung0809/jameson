const historyBtns = document.querySelectorAll('.titles.history > li');
historyBtns.forEach((el, idx) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const target = el.dataset.target;
    const headerHeight = 76; // 헤더의 높이 (단위: 픽셀)

    // 선택된 버튼의 대상 엘리먼트의 위치를 구합니다.
    const targetElement = document.querySelector(target);
    const targetOffset = targetElement.offsetTop;

    // 헤더의 높이를 고려한 스크롤 위치 계산
    const scrollPosition = targetOffset - headerHeight;

    // 스크롤을 해당 위치로 이동시킵니다.
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  });
});

const craftBtns = document.querySelectorAll('.titles.craft > li');
craftBtns.forEach((el, idx) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const target = el.dataset.target;
    const headerHeight = 76; // 헤더의 높이 (단위: 픽셀)

    // 선택된 버튼의 대상 엘리먼트의 위치를 구합니다.
    const targetElement = document.querySelector(target);
    const targetOffset = targetElement.offsetTop;

    // 헤더의 높이를 고려한 스크롤 위치 계산
    const scrollPosition = targetOffset - headerHeight;

    // 스크롤을 해당 위치로 이동시킵니다.
    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
  });
});
    