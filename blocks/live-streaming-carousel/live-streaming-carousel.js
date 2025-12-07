import Swiper from '../swiper/swiper-bundle.min.js';
import { div, p } from '../../scripts/dom-helpers.js';

function replaceTag(oldEl, newTag) {
  const newEl = document.createElement(newTag);

  // Copy ALL attributes
  for (const attr of oldEl.attributes) {
    newEl.setAttribute(attr.name, attr.value);
  }

  // Move child nodes (safer than innerHTML, preserves events inside)
  while (oldEl.firstChild) {
    newEl.appendChild(oldEl.firstChild);
  }

  oldEl.replaceWith(newEl);
  return newEl;
}

export default function decorate(block) {
  
  block.classList.add('swiper');
  const swiperWrapper = div({ class: 'swiper-wrapper' });

  // Accessibility attributes for screen readers
  block.setAttribute("role", "region");
  block.setAttribute("aria-label", "Live Streaming Carousel");
  block.setAttribute("aria-live", "polite");

  Array.from(block.children).forEach((ele) => {
    ele.classList.add('swiper-slide');
    ele.querySelectorAll('li').forEach(li => replaceTag(li, 'span'));
    ele.querySelectorAll('ul').forEach(li => replaceTag(li, 'span'));
    swiperWrapper.append(ele);
  });
  const firstImage = swiperWrapper.querySelector('.swiper-slide:first-child img');
  if (firstImage) {
    firstImage.setAttribute('loading', 'eager');
    firstImage.setAttribute('fetchpriority', 'high');
  }

  const pagination = div({ class: 'swiper-pagination' });
  const nextBtn = div({ clasS: 'swiper-button-next' });
  const prevBtn = div({ clasS: 'swiper-button-prev' });
  const customPagination = div(
    { class: 'custom-pagination' },
    p({ class: 'current-slide' }),
    p({ class: 'total-slide' }),
  );
  const wrapper = block.closest('.live-streaming-carousel-wrapper');

  block.append(swiperWrapper);
  wrapper.append(pagination, nextBtn, prevBtn, customPagination);
  // all, Current and total Slides
  const allSlides = block.querySelectorAll('.swiper-slide');
  const currentSlide = wrapper.querySelector('.custom-pagination .current-slide');
  const totalSlide = wrapper.querySelector('.custom-pagination .total-slide');
  // on load current and total must be some value
  currentSlide.textContent = '01 /';
  if (allSlides.length < 10) {
    totalSlide.textContent = `0${allSlides.length}`;
  } else {
    totalSlide.textContent = allSlides.length;
  }

  // const wrapper = document.querySelector('.live-streaming-carousel-wrapper');
  const swiperEl = wrapper.querySelector('.swiper');
  const lis = swiperEl.querySelectorAll('.swiper-slide ul li , .swiper-slide ul span');
  lis.forEach((lielem) => {
    const link = lielem.querySelector('a');
    const text = lielem.textContent.trim();
    if (link && link.hasAttribute('href')) {
      // console.log('Has href:', link.getAttribute('href'));
    } else if (text === 'Watch Live Streaming') {
      lielem.style.display = 'none';
    }
  });


  const swiperInstance = Swiper(block, {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: wrapper.querySelector('.swiper-pagination'),
      clickable: true,
    },
    navigation: {
      nextEl: wrapper.querySelector('.swiper-button-next'),
      prevEl: wrapper.querySelector('.swiper-button-prev'),
    },

    on: {
      slideChange(customSlide) {
        const current = customSlide.realIndex + 1;
        const total = customSlide.slides.length;

        customSlide.slides.forEach((slide) => {
          slide.removeAttribute('role');
        });

        if (current < 10) {
          currentSlide.textContent = `0${current} /`;
        } else {
          currentSlide.textContent = current;
        }
        if (customSlide.slides.length < 10) {
          totalSlide.textContent = `0${total}`;
        } else {
          totalSlide.textContent = total;
        }
      },
    },
  });

  // ⏳ STOP AUTOPLAY AFTER 20 SECONDS
  setTimeout(() => {
    swiperInstance.autoplay.stop();
    console.log("Autoplay stopped after 5 seconds");
  }, 20000);

  wrapper.addEventListener("mouseenter", () => {
    swiperInstance.autoplay.stop();
  });

  wrapper.addEventListener("mouseleave", () => {
    swiperInstance.autoplay.start();
  });
}
