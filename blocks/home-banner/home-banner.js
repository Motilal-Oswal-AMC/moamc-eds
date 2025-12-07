import Swiper from '../swiper/swiper-bundle.min.js';
import { div } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const swiperWrapper = div({ class: 'swiper-wrapper' });
  block.classList.add('swiper');
  Array.from(block.children).forEach((ele) => {
    ele.classList.add('sub-home-banner', 'swiper-slide');
    Array.from(ele.children).forEach((innerEle, i) => {
      innerEle.classList.add(`sub-banner-item-${i + 1}`);
      if (i + 1 !== 1) {
        Array.from(innerEle.children).forEach((elem) => {
          elem.classList.add('item-child');
        });
      }
    });
    swiperWrapper.append(ele);
  });
  swiperWrapper.querySelectorAll('img').forEach((el, ind) => {
    if (ind === 0) {
      el.classList.add('skip-lazy');
      el.setAttribute('loading', 'eager');
      el.setAttribute('fetchpriority', 'high');
    }
  });
  //   Create div for pagination and buttons
  const paginationDiv = div({ class: 'swiper-pagination' });
  const nextBtn = div({ class: 'swiper-button-next' });
  const prevBtn = div({ class: 'swiper-button-prev' });

  block.append(swiperWrapper, paginationDiv, nextBtn, prevBtn);
  const swiperInstance = Swiper(block, {
    loop: true,
    autoplay: {
      delay: 5000,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

    navigation: {
      nextEl: block.querySelector('.swiper-button-next'),
      prevEl: block.querySelector('.swiper-button-prev'),
    },
  });

  // ⏳ STOP AUTOPLAY AFTER 10 SECONDS
  setTimeout(() => {
    swiperInstance.autoplay.stop();
    console.log("Autoplay stopped after 5 seconds");
  }, 10000);

  swiperWrapper.addEventListener("mouseenter", () => {
    swiperInstance.autoplay.stop();
  });

  swiperWrapper.addEventListener("mouseleave", () => {
    swiperInstance.autoplay.start();
  });
}
