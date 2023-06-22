$(function() {
    const menuItems = $("#container .navis_wrap .sorts li a");
    const scrollOffsets = {};
  
    // 각 메뉴 아이템에 대해 스크롤 위치 계산
    menuItems.each(function() {
      const target = $(this).attr("href");
      const offset = $(target).offset().top - 76;
      scrollOffsets[target] = offset;
    });
  
    // 메뉴 아이템 클릭 이벤트 처리
    menuItems.on("click", function(e) {
      e.preventDefault();
      const target = $(this).attr("href");
      const scrollPosition = scrollOffsets[target];
  
      $("html, body").animate({ scrollTop: scrollPosition }, 1000);
    });
});