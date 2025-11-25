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
    // const leftarrow = document.createElement('div');
    // leftarrow.classList.add('swiper-button-prev');
    // block.appendChild(leftarrow);
    // const rightarrow = document.createElement('div');
    // rightarrow.classList.add('swiper-button-next');
    // block.appendChild(rightarrow);
    // const pagination = document.createElement('div');
    // pagination.classList.add('swiper-pagination');
    // const navigationWrap = document.createElement('div');
    // navigationWrap.classList.add('navigate-wrap');
    // navigationWrap.append(leftarrow, pagination, rightarrow);
    // // block.appendChild(pagination);
    // block.appendChild(navigationWrap);
    // config = {
    //   slidesPerView: 'auto',
    //   // spaceBetween: 12,
    //   loop: true,
    //   navigation: {
    //     nextEl: block.querySelector('.swiper-button-next'),
    //     prevEl: block.querySelector('.swiper-button-prev'),
    //   }, // will be false if no buttons
    //   pagination: {
    //     el: block.querySelector('.swiper-pagination'), // Selector for your pagination container
    //     clickable: true, // Makes pagination bullets clickable
    //     renderBullet(index, className) {
    //       // Customize the bullet content to display numbers
    //       return `<span class="${className}">${index + 1}</span>`;
    //     },
    //   },
    //   // breakpoints: {
    //   //   769: {
    //   //     spaceBetween: 16,
    //   //   },
    //   // },
    // };

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

    // Key Investing Pagination
    if (block.closest('main').querySelector('.key-investing')) {
    // Find the container that has your special classes
      const mainContainer = block.closest('main')
        .querySelector('.key-investing .future-building');
      // Only run this pagination logic if we are in the correct block
      if (mainContainer) {
        // Select all the card items
        const items = Array.from(mainContainer.querySelectorAll('.swiper-slide'));
        const itemsPerPage = items.slice(0, 9).length;
        if (items.length >= itemsPerPage) {
          dataMapMoObj.setupPagination(mainContainer, items, itemsPerPage);
        }
      }
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

  //  START SEARCH FUNCTIONALITY

  const keySearchSection = document.querySelector('.key-investing .keyinvest-search');
  const keySearchNewEle = document.createElement('div');
  keySearchNewEle.classList.add('key-search-results', 'dsp-none');
  keySearchSection.appendChild(keySearchNewEle);
  const wrapper = document.querySelector('.key-investing .keyinvest-search');

  const crossIconWrap = document.createElement('span');
  crossIconWrap.classList.add('cross-icon-wrap');
  wrapper.appendChild(crossIconWrap);
  crossIconWrap.style.display = 'none';
  const crossIcon = document.createElement('img');
  crossIcon.classList.add('cancel-btn');
  crossIcon.setAttribute('src', '/icons/input-cancel.svg');
  crossIcon.setAttribute('alt', 'cancel button');
  crossIcon.setAttribute('loading', 'eager');
  crossIcon.style.display = 'flex';
  crossIcon.style.cursor = 'pointer';
  crossIconWrap.appendChild(crossIcon);

  const searchFld = document.querySelector('#keyinvest');
  const closeBtn = document.querySelector('.cross-icon-wrap');
  let currentFocusIndex = -1;

  if (searchFld) {
    const listContainer = keySearchNewEle;

    const updateActiveItem = (items) => {
      items.forEach((item, idx) => {
        if (idx === currentFocusIndex) {
          item.classList.add('active-search-item');
          item.scrollIntoView({ block: 'nearest' });
        } else {
          item.classList.remove('active-search-item');
        }
      });
    };

    // 👉 On Focus – Load Titles
    searchFld.addEventListener('focus', () => {
      keySearchNewEle.classList.remove('dsp-none');
      keySearchNewEle.innerHTML = '';
      const titles = document.querySelectorAll('.cards-listcards1');
      const titleAry = [];

      titles.forEach((title) => {
        const titleText = title.textContent.trim();
        if (titleText) {
          titleAry.push(titleText);
        }
      });

      const uniqueTitleAry = [...new Set(titleAry)];
      console.log('Titles Array:', uniqueTitleAry);

      uniqueTitleAry.forEach((value) => {
        const newItem = document.createElement('p');
        newItem.classList.add('result-item');
        newItem.setAttribute('data-original-text', value);

        const anchorTag = document.createElement('a');
        anchorTag.classList.add('list');
        anchorTag.setAttribute(
          'href',
          'https://mosl-dev-upd--mosl-eds--motilal-oswal-amc.aem.live/mutual-fund/in/en/motilal-oswal-edge/article-details-list',
        );

        anchorTag.textContent = value;

        newItem.appendChild(anchorTag);
        keySearchNewEle.appendChild(newItem);
      });

      console.log('Titles Array:', titleAry);
    });

    searchFld.addEventListener('focusout', () => {
      if (searchFld.value.length !== 0) {
        searchFld.classList.add('active');
      } else {
        searchFld.classList.remove('active');
      }
    });

    // 👉 Click Selection
    listContainer.addEventListener('click', (event) => {
      closeBtn.style.display = 'block';
      searchFld.value = event.target.textContent;
      let dataref = '';
      if ([...event.target.classList].includes('result-item')) {
        dataref = event.target.querySelector('a').getAttribute('href');
      } else {
        dataref = event.target.getAttribute('href');
      }
      window.location.href = dataref;
      listContainer.classList.add('dsp-none');
    });

    // 👉 Filter Function
    const filterListItems = (searchTerm) => {
      const listItems = document.querySelectorAll('.result-item');
      const term = searchTerm.trim();

      const noMsg = listContainer.querySelector('.no-results-message');
      if (noMsg) noMsg.remove();

      if (!term) {
        listItems.forEach((item) => {
          item.querySelector('.list').innerHTML = item.dataset.originalText;
          item.style.display = 'block';
        });
        return;
      }

      let matchesFound = false;

      listItems.forEach((item) => {
        const txt = item.dataset.originalText.toLowerCase();
        const match = txt.includes(term.toLowerCase());

        if (match) {
          matchesFound = true;
          item.querySelector('.list').innerHTML = item.dataset.originalText;
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });

      if (!matchesFound) {
        const msg = document.createElement('li');
        msg.className = 'list-fund-name no-results-message';
        msg.textContent = 'No matching results';
        listContainer.appendChild(msg);
      }
    };

    // 👉 On Input

    searchFld.addEventListener('input', (event) => {
      filterListItems(event.target.value);
      Array.from(listContainer.querySelectorAll('.list')).forEach((list) => {
        if (list.textContent.toLocaleLowerCase().includes(searchFld.value.toLocaleLowerCase())) {
          list.parentElement.style.display = 'block';
        } else {
          list.parentElement.style.display = 'none';
        }
      });
      closeBtn.style.display = event.target.value.length > 0 ? 'flex' : 'none';
    });
    closeBtn.addEventListener('click', () => {
      searchFld.value = '';
      filterListItems('');
      closeBtn.style.display = 'none';
    });
    searchFld.addEventListener('keydown', (event) => {
      closeBtn.style.display = 'block';
      const visibleItems = (param) => {
        if (param === undefined) {
          return Array.from(listContainer.querySelectorAll('.list'))
            .filter((item) => item.parentElement.style.display !== 'none' && !item.classList.contains('no-results-message'));
        }
        const items = Array.from(listContainer.querySelectorAll('.list'));
        const searchTerm = param.toLocaleLowerCase();
        items.forEach((item) => {
          const itemText = item.textContent.toLocaleLowerCase();
          const isVisible = itemText.includes(searchTerm);

          // Apply the style based on the match
          item.parentElement.style.display = isVisible ? 'block' : 'none';
        });
        return param;
      };

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          currentFocusIndex = (currentFocusIndex + 1) % visibleItems().length;
          updateActiveItem(visibleItems());
          break;
        case 'ArrowUp':
          event.preventDefault();
          currentFocusIndex = ((currentFocusIndex - 1 + visibleItems().length)
            % visibleItems().length);
          updateActiveItem(visibleItems());
          break;
        case 'Enter':
          if (visibleItems().length === 0) return false;

          if (currentFocusIndex < 0 || currentFocusIndex >= visibleItems().length) {
            searchFld.value = visibleItems()[0].textContent.trim();
            window.location.href = visibleItems()[0].getAttribute('href');
          } else {
            searchFld.value = visibleItems()[currentFocusIndex].textContent.trim();
            window.location.href = visibleItems()[currentFocusIndex].getAttribute('href');
          }

          listContainer.classList.add('dsp-none');
          break;
        default:
          break;
      }
      return event;
    });

    // 👉 Clear Button
    closeBtn.addEventListener('click', () => {
      searchFld.value = '';
      filterListItems('');
      closeBtn.style.display = 'none';
    });

    // 👉 Keyboard Navigation
    searchFld.addEventListener('keydown', (event) => {
      const visibleItems = () => Array.from(listContainer.querySelectorAll('.list'))
        .filter((item) => item.parentElement.style.display !== 'none');

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          currentFocusIndex = (currentFocusIndex + 1) % visibleItems().length;
          updateActiveItem(visibleItems());
          break;

        case 'ArrowUp':
          event.preventDefault();
          currentFocusIndex = (currentFocusIndex - 1 + visibleItems().length) % visibleItems().length;
          updateActiveItem(visibleItems());
          break;

        case 'Enter':
          if (visibleItems().length === 0) return false;
          const selected = visibleItems()[currentFocusIndex] || visibleItems()[0];
          searchFld.value = selected.textContent.trim();
          keySearchNewEle.classList.add('dsp-none');
          break;
      }
    });
  }

  // 👉 Hide on document click
  document.addEventListener('click', (event) => {
    const input = document.querySelector('#keyinvest');
    const listBox = document.querySelector('.key-search-results');

    if (!input.contains(event.target) && !listBox.contains(event.target)) {
      listBox.classList.add('dsp-none');
      if (searchFld.value === '') closeBtn.style.display = 'none';
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
