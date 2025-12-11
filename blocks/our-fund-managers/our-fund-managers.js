import Swiper from '../swiper/swiper-bundle.min.js';
import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  //   if (window.location.href.includes('author')) {
  //     return 1;
  //   }
  // 1. Setup main Swiper container
  block.classList.add('swiper');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  // 2. Get all the original content rows before clearing the block
  const sourceRows = Array.from(block.children);
  block.innerHTML = '';

  // 3. Process each source row to create a slide
  sourceRows.forEach((row) => {
    const picture = row.querySelector('picture');
    const anchor = row.querySelector('a');
    const textContent = row.children[2]; // Assumes text content is in the third div

    if (!picture || !anchor || !textContent) return;
    // const count = 1;
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');
    // Array.from(slide.classList).forEach((cls) => {
    //   if (cls.startsWith('swiper-slide-')) {
    //     slide.classList.remove(cls);
    //   }
    // });
    // slide.classList.add(`swiper-slide-${count}`);

    const card1 = document.createElement('div');
    card1.classList.add('swiper-slide-cards-1');

    anchor.textContent = '';
    anchor.classList.add('button');
    anchor.appendChild(picture);
    card1.appendChild(anchor);

    const card2 = document.createElement('div');
    card2.classList.add('swiper-slide-cards-2');
    card2.innerHTML = textContent.innerHTML;

    dataMapMoObj.CLASS_PREFIXES = [
      'cards-list',
      'cards-list-1-',
      'list-child-',
      'list-grandch-',
    ];
    dataMapMoObj.addIndexedTwo(card2);
    slide.appendChild(card1);
    slide.appendChild(card2);

    swiperWrapper.appendChild(slide);
  });

  // =================================================================
  // START: Accessibility Fix for Missing Alt Text
  // This new section adds alternative text to all icons in the swiper.
  // =================================================================
  //   const altTextMap = {
  //     Article: 'Article icon',
  //     'youtube-1': 'Video icon',
  //     'mic-1': 'Podcast icon',
  //     Subtract: 'Save for later', // Icon inside an empty link, describes its function
  //     'calendar-01': '', // Decorative icon, alt text should be empty
  //   };

  //   const imagesToFix = swiperWrapper.querySelectorAll('img[alt=""]');
  //   imagesToFix.forEach((img) => {
  //     const { iconName } = img.dataset;
  //     const altText = altTextMap[iconName];

  //     if (altText !== undefined) {
  //       img.setAttribute('alt', altText);
  //     }
  //   });
  // =================================================================
  // END: Accessibility Fix
  // =================================================================

  // 4. Final assembly of the Swiper block
  block.appendChild(swiperWrapper);

  Array.from(block.querySelector('.swiper-slide-cards-2 .cards-listcards1').children).forEach((ele) => {
    ele.classList.add('card-list');
  });

  // 5. Check if .learning-fdp class exists in the parent
  const learningFdp = block.closest('.learning-fdp') !== null;

  let navigation = false;

  // 6. Add prev/next buttons if learningFdp is true
  if (learningFdp) {
    const swiperBtn = document.createElement('div');
    swiperBtn.classList.add('btn-wrapper');

    const prevButton = document.createElement('div');
    prevButton.classList.add('swiper-button-prev');

    const nextButton = document.createElement('div');
    nextButton.classList.add('swiper-button-next');

    swiperBtn.appendChild(prevButton);
    swiperBtn.appendChild(nextButton);

    block.appendChild(swiperBtn);
    navigation = {
      nextEl: nextButton,
      prevEl: prevButton,
    };
  }

  // 7. Initialize Swiper with navigation if available
  Swiper(block, {
    slidesPerView: 'auto',
    spaceBetween: 16,
    loop: true,
    navigation, // will be false if no buttons
    breakpoints: {
      769: {
        spaceBetween: 40,
      },
    },
  });
  return block;
}
