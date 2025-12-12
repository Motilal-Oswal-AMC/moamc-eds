import Swiper from '../swiper/swiper-bundle.min.js';
import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  block.classList.add('swiper');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  const sourceRows = Array.from(block.children);
  block.innerHTML = '';

  sourceRows.forEach((row) => {
    const picture = row.querySelector('picture');
    const anchor = row.querySelector('a');
    const textContent = row.children[2];

    if (!picture || !anchor || !textContent) return;

    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

    const card1 = document.createElement('div');
    card1.classList.add('swiper-slide-cards-1');

    const imageLink = anchor.cloneNode(true);
    imageLink.textContent = '';
    imageLink.classList.add('button');
    imageLink.appendChild(picture);
    card1.appendChild(imageLink);

    const card2 = document.createElement('div');
    card2.classList.add('swiper-slide-cards-2');

    card2.innerHTML = textContent.innerHTML;
    if (typeof dataMapMoObj !== 'undefined') {
      dataMapMoObj.CLASS_PREFIXES = [
        'cards-list',
        'cards-list-1-',
        'list-child-',
        'list-grandch-',
      ];
      dataMapMoObj.addIndexedTwo(card2);
    }

    slide.appendChild(card1);
    slide.appendChild(card2);

    swiperWrapper.appendChild(slide);
  });

  block.appendChild(swiperWrapper);

  const cardListContainer = block.querySelector('.swiper-slide-cards-2 .cards-listcards1');
  if (cardListContainer) {
    Array.from(cardListContainer.children).forEach((ele) => {
      ele.classList.add('card-list');
    });
  }

  const learningFdp = block.closest('.learning-fdp') !== null;

  let navigation = false;
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

  if (typeof Swiper !== 'undefined') {
    Swiper(block, {
      slidesPerView: 'auto',
      spaceBetween: 12,
      loop: true,
      navigation,
      breakpoints: {
        769: {
          spaceBetween: 40,
        },
      },
    });
  }

  return block;
}
