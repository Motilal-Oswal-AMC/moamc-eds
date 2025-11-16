import Swiper from '../swiper/swiper-bundle.min.js';
import dataMapMoObj from '../../scripts/constant.js';
import {
  div,
  label,
  input,
  img,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  if (window.location.href.includes('author')) {
    return 1;
  }
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

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

    const card1 = document.createElement('div');
    card1.classList.add('swiper-slide-cards-1');

    if (!block.closest('.key-investing')) {
      anchor.textContent = '';
      anchor.classList.add('button');
      anchor.appendChild(picture);
      card1.appendChild(anchor);
    } else {
      card1.appendChild(picture);
    }

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
  const altTextMap = {
    Article: 'Article icon',
    'youtube-1': 'Video icon',
    'mic-1': 'Podcast icon',
    Subtract: 'Save for later', // Icon inside an empty link, describes its function
    'calendar-01': '', // Decorative icon, alt text should be empty
  };

  const imagesToFix = swiperWrapper.querySelectorAll('img[alt=""]');
  imagesToFix.forEach((img) => {
    const { iconName } = img.dataset;
    const altText = altTextMap[iconName];

    if (altText !== undefined) {
      img.setAttribute('alt', altText);
    }
  });
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

  dataMapMoObj.CLASS_PREFIXES = [];
  dataMapMoObj.CLASS_PREFIXES.push('library-btn');

  dataMapMoObj.addIndexed(block.closest('.future-building-container'));
  const maindiv = block.closest('.future-building-container');

  // 7. Initialize Swiper with navigation if available
  let config = {};
  if (!block.closest('.key-investing')) {
    maindiv.querySelector('.library-btn3 p').classList.add('libr-btn-p');
    maindiv.querySelector('.library-btn3 a').classList.add('libr-btn-a');
    config = {
      slidesPerView: 'auto',
      spaceBetween: 12,
      loop: true,
      navigation, // will be false if no buttons
      breakpoints: {
        769: {
          spaceBetween: 16,
        },
      },
    };
  } else {
    const leftarrow = document.createElement('div');
    leftarrow.classList.add('swiper-button-prev');
    block.appendChild(leftarrow);
    const rightarrow = document.createElement('div');
    rightarrow.classList.add('swiper-button-next');
    block.appendChild(rightarrow);
    const pagination = document.createElement('div');
    pagination.classList.add('swiper-pagination');
    const navigationWrap = document.createElement('div');
    navigationWrap.classList.add('navigate-wrap');
    navigationWrap.append(leftarrow, pagination, rightarrow);
    // block.appendChild(pagination);
    block.appendChild(navigationWrap);
    config = {
      slidesPerView: 'auto',
      // spaceBetween: 12,
      loop: true,
      navigation: {
        nextEl: block.querySelector('.swiper-button-next'),
        prevEl: block.querySelector('.swiper-button-prev'),
      }, // will be false if no buttons
      pagination: {
        el: block.querySelector('.swiper-pagination'), // Selector for your pagination container
        clickable: true, // Makes pagination bullets clickable
        renderBullet(index, className) {
          // Customize the bullet content to display numbers
          return `<span class="${className}">${index + 1}</span>`;
        },
      },
      // breakpoints: {
      //   769: {
      //     spaceBetween: 16,
      //   },
      // },
    };

    // creating Sear Box for Key Investing
    const keyInvestSection = block.closest('.section');
    const keyInvestSearchWrap = keyInvestSection.querySelector('.default-content-wrapper');
    if (keyInvestSection.classList.contains('key-investing')) {
      const keyInvestSearch = div(
        { class: 'keyinvest-search' },
        input({ class: 'keyinvest-inp', id: 'keyinvest' }),
        label({ class: 'keyinvest-label', for: 'keyinvest' }, 'Search here'),
      );
      keyInvestSearchWrap.append(keyInvestSearch);
    }
  }
  Swiper(block, config);

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 767) {
      const futureBuildingSection = document.querySelector('.future-building-container');
      const stayUpdatedSection = document
        .querySelector('.article-sub-right.stay-updated.comlist.articlesub2');

      if (futureBuildingSection && stayUpdatedSection) {
      // Move future-building-container above stay-updated
        stayUpdatedSection.parentNode.insertBefore(futureBuildingSection, stayUpdatedSection);
        console.log('✅ future-building-container moved above stay-updated');
      } else {
        console.warn('⚠️ Required sections not found in DOM');
      }
    }
  });

  // if(window.innerWidth <= 767){
  // const futureBuildingSection = document.querySelector('.future-building-container');
  // const stayUpdatedSection = =
  //  document.querySelector('.article-sub-right.stay-updated.comlist.articlesub2');

  // if (futureBuildingSection && stayUpdatedSection) {
  // // Move future-building-container above stay-updated
  // stayUpdatedSection.parentNode.insertBefore(futureBuildingSection, stayUpdatedSection);
  // console.log('✅ future-building-container moved above stay-updated');
  // } else {
  // console.warn('⚠️ Required sections not found in DOM');
  // }
  // //
  // }

  return block;
  // let config;
  // if (block.closest('.moedge-article-main')) {
  //   config = {
  //     slidesPerView: '1.2',
  //     spaceBetween: 12,
  //     loop: true,
  //     navigation, // will be false if no buttons
  //     breakpoints: {
  //       769: {
  //         slidesPerView: '1.2',
  //         spaceBetween: 16,
  //       },
  //     },
  //   };
  // } else {
  //   config = {
  //     slidesPerView: 'auto',
  //     spaceBetween: 12,
  //     loop: true,
  //     navigation, // will be false if no buttons
  //     breakpoints: {
  //       769: {
  //         spaceBetween: 16,
  //       },
  //     },
  //   };
  // }
  // Swiper(block, config);
  // return block;
}
