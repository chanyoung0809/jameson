const faqs = document.querySelectorAll(".faq");
const faqTops = document.querySelectorAll(".faq > .faq_top");

faqTops.forEach((faqTop, idx) => {
  faqTop.addEventListener("click", (e) => {
    e.preventDefault();
    const currentFaq = faqTop.parentNode;

    if (currentFaq.classList.contains("on")) {
      currentFaq.classList.remove("on");
    } else {
      faqs.forEach((allfaqs) => {
        allfaqs.classList.remove("on");
      });
      currentFaq.classList.add("on");
    }
  });
});
