import Swiper from '../swiper/swiper-bundle.min.js';
import dataMapMoObj from '../../scripts/constant.js';
import {
  div,
  label,
  input,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  // 0. Exit early if author page
  if (window.location.href.includes('author')) {
    return 1;
  }

  // --- Helper Function: Date Conversion ---
  function convertDate(dateStr) {
    const date = new Date(dateStr);
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  // =================================================================
  // 1. CORE LOGIC: Swiper & Search Initialization Function
  // =================================================================
  const initSwiperAndSearch = () => {
    block.classList.add('swiper');

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');

    // Get content rows. If block was cleared for dynamic content, these are the new rows.
    const sourceRows = Array.from(block.children);

    // Clear block to rebuild it with Swiper structure
    block.innerHTML = '';

    // --- Build Slides ---
    sourceRows.forEach((row) => {
      const picture = row.querySelector('picture');
      const anchor = row.querySelector('a');
      // Safety check: sometimes text is in children[2], sometimes typically last div
      const textContent = row.children[2] ? row.children[2] : row.querySelector('div:last-child');

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

      // Add indexing classes
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

    // --- Accessibility Fixes (Alt Text) ---
    const altTextMap = {
      Article: 'Article icon',
      'youtube-1': 'Video icon',
      'mic-1': 'Podcast icon',
      Subtract: 'Save for later',
      'calendar-01': '',
    };
    const imagesToFix = swiperWrapper.querySelectorAll('img[alt=""]');
    imagesToFix.forEach((imgelem) => {
      const { iconName } = imgelem.dataset;
      const altText = altTextMap[iconName];
      if (altText !== undefined) {
        imgelem.setAttribute('alt', altText);
      }
    });

    // Append Wrapper to Block
    block.appendChild(swiperWrapper);

    // Apply specific classes to card lists
    const cardListContainer = block.querySelector('.swiper-slide-cards-2 .cards-listcards1');
    if (cardListContainer) {
      Array.from(cardListContainer.children).forEach((ele) => {
        ele.classList.add('card-list');
      });
    }

    // --- Add Navigation Buttons (if needed) ---
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

    dataMapMoObj.CLASS_PREFIXES = ['library-btn'];
    const futureBuildingContainer = block.closest('.future-building-container');
    if (futureBuildingContainer) {
      dataMapMoObj.addIndexed(futureBuildingContainer);
    }

    // --- Swiper Configuration ---
    let config = {};
    if (!block.closest('.key-investing')) {
      if (futureBuildingContainer) {
        const btnP = futureBuildingContainer.querySelector('.library-btn3 p');
        const btnA = futureBuildingContainer.querySelector('.library-btn3 a');
        if (btnP) btnP.classList.add('libr-btn-p');
        if (btnA) btnA.classList.add('libr-btn-a');
      }
      config = {
        slidesPerView: 'auto',
        spaceBetween: 12,
        loop: true,
        navigation,
        breakpoints: {
          769: { spaceBetween: 16 },
        },
      };
    } else {
      // Logic for Key Investing Section (Search Input Creation)
      const keyInvestSection = block.closest('.section');
      const keyInvestSearchWrap = keyInvestSection.querySelector('.default-content-wrapper');

      // Prevent duplicate creation if function runs multiple times
      if (keyInvestSection.classList.contains('key-investing') && !keyInvestSection.querySelector('.keyinvest-wrap')) {
        const keyInvestSearch = div(
          { class: 'keyinvest-wrap' },
          div(
            { class: 'keyinvest-search' },
            input({ class: 'keyinvest-inp', id: 'keyinvest', placeholder: ' ' }),
            label({ class: 'keyinvest-label', for: 'keyinvest' }, 'Search here'),
          ),
        );
        keyInvestSearchWrap.append(keyInvestSearch);
      }
      // Config for Key Investing (if different)
      config = {
        slidesPerView: 'auto',
        spaceBetween: 12,
        loop: true,
        // Add navigation/pagination here if needed for this section specifically
      };
    }

    // Initialize Swiper
    Swiper(block, config);

    // --- Search Functionality (Event Listeners) ---
    // We only attach these listeners if the search box exists and hasn't been set up
    const searchFldkey = document.querySelector('#keyinvest');
    const keySearchSection = document.querySelector('.key-investing .keyinvest-search');

    if (keySearchSection && searchFldkey && !document.querySelector('.key-search-results')) {
      const keySearchNewEle = document.createElement('div');
      keySearchNewEle.classList.add('key-search-results', 'dsp-none');
      keySearchSection.appendChild(keySearchNewEle);

      const crossIconWrap = document.createElement('span');
      crossIconWrap.classList.add('cross-icon-wrap');
      crossIconWrap.style.display = 'none';
      keySearchSection.appendChild(crossIconWrap);

      const crossIcon = document.createElement('img');
      crossIcon.classList.add('cancel-btn');
      crossIcon.setAttribute('src', '/icons/input-cancel.svg');
      crossIcon.setAttribute('alt', 'cancel button');
      crossIcon.style.display = 'flex';
      crossIcon.style.cursor = 'pointer';
      crossIconWrap.appendChild(crossIcon);

      const closeBtn = crossIconWrap;
      const listContainer = keySearchNewEle;
      const currentFocusIndex = -1;

      // Input Focus Logic
      searchFldkey.addEventListener('click', () => {
        searchFldkey.focus();
        searchFldkey.classList.add('focus-visible');
      });

      searchFldkey.addEventListener('blur', () => {
        if (searchFldkey.value && searchFldkey.value.trim() !== '') {
          searchFldkey.classList.add('focus-visible', 'active');
        } else {
          searchFldkey.classList.remove('focus-visible', 'active');
        }
      });

      // Filter Logic
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
          if (txt.includes(term.toLowerCase())) {
            matchesFound = true;
            item.querySelector('.list').innerHTML = item.dataset.originalText
              .replace(new RegExp(`(${term})`, 'gi'), '<strong>$1</strong>');
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

      // Focus & Load Data
      searchFldkey.addEventListener('focus', () => {
        keySearchNewEle.classList.remove('dsp-none');
        if (searchFldkey.value.trim()) {
          filterListItems(searchFldkey.value);
          return;
        }

        // Populate list if empty
        keySearchNewEle.innerHTML = '';
        const titles = document.querySelectorAll('.cards-listcards1');
        const titleAry = [];
        titles.forEach((title) => {
          const txt = title.textContent.trim();
          if (txt) titleAry.push(txt);
        });
        const uniqueTitles = [...new Set(titleAry)];

        uniqueTitles.forEach((value) => {
          const newItem = document.createElement('p');
          newItem.classList.add('result-item');
          newItem.setAttribute('data-original-text', value);

          const aTag = document.createElement('a');
          aTag.classList.add('list');
          aTag.href = 'https://mosl-dev-upd--mosl-eds--motilal-oswal-amc.aem.live/mutual-fund/in/en/motilal-oswal-edge/article-details-list';
          aTag.textContent = value;

          newItem.appendChild(aTag);
          keySearchNewEle.appendChild(newItem);
        });
      });

      // Input Event
      searchFldkey.addEventListener('input', (e) => {
        filterListItems(e.target.value);
        closeBtn.style.display = e.target.value.length > 0 ? 'flex' : 'none';
        if (e.target.value.trim() !== '') {
          searchFldkey.classList.add('active');
        } else {
          searchFldkey.classList.remove('active');
        }
      });

      // Clear Button
      closeBtn.addEventListener('click', () => {
        searchFldkey.value = '';
        filterListItems('');
        closeBtn.style.display = 'none';
        searchFldkey.classList.remove('focus-visible', 'active');
      });

      // Selection Event
      listContainer.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target.closest('.result-item') || e.target;
        if (!target) return;

        searchFldkey.value = target.textContent.trim();
        closeBtn.style.display = 'flex';
        listContainer.classList.add('dsp-none');

        // Redirect
        const link = target.querySelector('a') || target;
        const href = link.getAttribute('href');
        if (href) window.location.href = href;
      });

      // Prevent Blur on Click
      listContainer.addEventListener('pointerdown', (e) => e.preventDefault());
    }
  };

  // =================================================================
  // 2. MAIN EXECUTION FLOW
  // =================================================================

  // Scenario A: Dynamic Investor Education Blog Page
  if (window.location.href.includes('/investor-education/blogs/')) {
    // 1. Clear initial content
    block.innerHTML = '';

    // 1. Get the current page ID/Slug (handles potential trailing slash)
    const currentUrl = window.location.href.replace(/\/$/, '');
    const linktext = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);

    let datalink;
    let icons;
    let texticon;
    if (window.location.href.includes('/videos/')) {
      datalink = '/videos/';
      icons = '/icons/youtube-1.svg';
      texticon = 'Video';
    } else if (window.location.href.includes('/images/')) {
      datalink = '/images/';
      icons = '/icons/Article.svg';
      texticon = 'Article';
    }
    // 2. Filter and Randomize the data
    let dataincl;
    if (window.location.href.includes('/videos/')) {
      dataincl = '/videos/';
    } else {
      dataincl = '/images/';
    }
    const data = dataMapMoObj.getinvestorblog.data
      .filter((el) => linktext !== el.title && el.path.includes(dataincl))
    // 1. Assign a random value to each item
      .map((value) => ({ value, sort: Math.random() }))
    // 2. Sort based on that random value
      .sort((a, b) => a.sort - b.sort)
    // 3. Extract the original object back
      .map(({ value }) => value);

    // console.log(data);
    const datafin = data.slice(0, 3);

    // 3. Map Data to Promises
    const htmlPromises = datafin.map(async (elem) => {
      const readtime = await dataMapMoObj.getReadingTime(elem.path);
      // const imagePAth = `./${elem.image.split('/')[elem.image.split('/').length - 1]}`;
      const titleText = dataMapMoObj.toTitleCase(elem.title.replaceAll('-', ' '));
      const dateText = convertDate(elem.date.split('T')[0]);

      return `<div>
          <div>
            <picture>
              <source type="image/webp" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" media="(min-width: 600px)">
              <source type="image/webp" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium">
              <source type="image/png" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" media="(min-width: 600px)">
              <img loading="lazy" alt="planning for the future" src="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" width="400" height="225">
            </picture>
          </div>
          <div class="button-container"><p><a href="${elem.path}" title="${elem.path}" class="button">${elem.path}</a></p></div>
          <div>
            <ul>
              <li>
                <p><span class="icon icon-Article"><img data-icon-name="${texticon}" src="${icons}" alt="${texticon}" loading="lazy" width="16" height="16"></span>${texticon}</p>
                <ul>
                  <li>${readtime.minutes} min read</li>
                  <li><span class="icon icon-calendar-01"><img data-icon-name="calendar-01" src="/icons/calendar-01.svg" alt="" loading="lazy" width="16" height="16"></span>${dateText}</li>
                </ul>
              </li>
              <li>
                <p class="button-container"><a href="${elem.path}" title="${titleText}" class="button">${titleText}</a></p>
              </li>
              <li>
                <p>${elem.description}</p>
              </li>
              <li>
                <p class="button-container"><a href="${elem.path}" title="Read Now" class="button">Read Now</a></p>
              </li>
              <li>
                <p class="button-container"><a href="${elem.path}" title="" class="button"><span class="icon icon-Subtract"><img data-icon-name="Subtract" src="/icons/Subtract.svg" alt="" loading="lazy" width="16" height="16"></span></a></p>
              </li>
            </ul>
          </div>
        </div>`;
    });

    // 4. Wait for all data, inject HTML, THEN initialize Swiper
    Promise.all(htmlPromises).then((results) => {
      block.innerHTML += results.join('');
      initSwiperAndSearch(); // <--- CRITICAL: Runs only after HTML is in the DOM
      block.closest('.section')
        .querySelector('.library-btn3 a').setAttribute('href', '/mutual-fund/in/en/investor-education');
    });
  } else {
    // Scenario B: Standard Page (Static Content)
    initSwiperAndSearch(); // <--- Runs immediately
  }

  // =================================================================
  // 3. GLOBAL LISTENERS (Document Level)
  // =================================================================
  document.addEventListener('click', (event) => {
    const inputKey = document.querySelector('#keyinvest');
    const listBox = document.querySelector('.key-search-results');

    if (inputKey && listBox
      && !inputKey.contains(event.target)
      && !listBox.contains(event.target)) {
      listBox.classList.add('dsp-none');

      // Handle floating label state
      if (inputKey.value && inputKey.value.trim() !== '') {
        inputKey.classList.add('focus-visible', 'active');
      } else {
        inputKey.classList.remove('focus-visible', 'active');
      }
    }
  });

  return block;
}
// import Swiper from '../swiper/swiper-bundle.min.js';
// import dataMapMoObj from '../../scripts/constant.js';
// import {
//   div,
//   label,
//   input,
// } from '../../scripts/dom-helpers.js';

// export default function decorate(block) {
//   if (window.location.href.includes('author')) {
//     return 1;
//   }
//   // 1. Setup main Swiper container
//   function convertDate(dateStr) {
//     const date = new Date(dateStr);

//     // Formatting options
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     };

//     return date.toLocaleDateString('en-US', options);
//   }

//   if (window.location.href.includes('/investor-education/blogs/')) {
//     block.innerHTML = '';
//     const data = dataMapMoObj.getinvestorblog.data.filter((el) => el.path.includes('/videos'));
//     const datafin = data.slice(0, 3);
//     const htmlPromises = datafin.map(async (elem) => {
//       const readtime = await dataMapMoObj.getReadingTime(elem.path);

//       const imagePAth = `./${elem.image.split('/')[elem.image.split('/').length - 1]}`;
//       const titleText = dataMapMoObj.toTitleCase(elem.title.replaceAll('-', ' '));
//       const dateText = convertDate(elem.date.split('T')[0]);
//       return `<div>
//             <div>
//               <picture>
//                 <source type="image/webp" srcset="${imagePAth}" media="(min-width: 600px)">
//                 <source type="image/webp" srcset="${imagePAth}">
//                 <source type="image/png" srcset="${imagePAth}" media="(min-width: 600px)">
//                 <img loading="lazy" alt="planning for the future" s
// rc="${imagePAth}" width="400" height="225">
//               </picture>
//             </div>
//             <div class="button-container"><p><a href="${elem.path}" title="${ele
// m.path}" class="button">${elem.path}</a></p></div>
//             <div>
//               <ul>
//                 <li>
//                   <p><span class="icon icon-Article"><img data-icon
// -name="Article" src="/icons/Article.svg" alt="" loading="lazy" width=
// "16" height="16"></span>Video</p>
//                   <ul>
//                     <li>${readtime.minutes} min read</li>
//                     <li><span class="icon icon-calendar-01"><img data-icon-na
// me="calendar-01" src="/
// icons/calendar-01.svg" alt="" loading="lazy" width="16" height="16"></span>${dateText}</li>
//                   </ul>
//                 </li>
//                 <li>
//                   <p class="button-container"><a href="${elem.path}" title="${titleText}" cl
// ass="button">${titleText}</a></p>
//                 </li>
//                 <li>
//                   <p>${elem.description}</p>
//                 </li>
//                 <li>
//                   <p class="button-container"><a href="${elem.path}" t
// itle="Read Now" class="button">Read Now</a></p>
//                 </li>
//                 <li>
//                   <p class="button-container"><a href="${elem.path}" title="" cl
// ass="button"><span class="icon icon-Subtract"><img data-icon-name="Subtract" src="/icons/Subtrac
// t.svg" alt="" loading="lazy" width="16" height="16"></span></a></p>
//                 </li>
//               </ul>
//             </div>
//           </div>`;
//     });

//     Promise.all(htmlPromises).then((results) => {
//       block.innerHTML += results.join('');
//     });
//   }

//   block.classList.add('swiper');

//   const swiperWrapper = document.createElement('div');
//   swiperWrapper.classList.add('swiper-wrapper');

//   // 2. Get all the original content rows before clearing the block
//   const sourceRows = Array.from(block.children);
//   block.innerHTML = '';

//   // 3. Process each source row to create a slide
//   sourceRows.forEach((row) => {
//     const picture = row.querySelector('picture');
//     const anchor = row.querySelector('a');
//     const textContent = row.children[2]; // Assumes text content is in the third div

//     if (!picture || !anchor || !textContent) return;

//     const slide = document.createElement('div');
//     slide.classList.add('swiper-slide');

//     const card1 = document.createElement('div');
//     card1.classList.add('swiper-slide-cards-1');

//     if (!block.closest('.key-investing')) {
//       anchor.textContent = '';
//       anchor.classList.add('button');
//       anchor.appendChild(picture);
//       card1.appendChild(anchor);
//     } else {
//       card1.appendChild(picture);
//     }

//     const card2 = document.createElement('div');
//     card2.classList.add('swiper-slide-cards-2');
//     card2.innerHTML = textContent.innerHTML;
//     dataMapMoObj.CLASS_PREFIXES = [
//       'cards-list',
//       'cards-list-1-',
//       'list-child-',
//       'list-grandch-',
//     ];
//     dataMapMoObj.addIndexedTwo(card2);
//     slide.appendChild(card1);
//     slide.appendChild(card2);

//     swiperWrapper.appendChild(slide);
//   });

//   // =================================================================
//   // START: Accessibility Fix for Missing Alt Text
//   // This new section adds alternative text to all icons in the swiper.
//   // =================================================================
//   const altTextMap = {
//     Article: 'Article icon',
//     'youtube-1': 'Video icon',
//     'mic-1': 'Podcast icon',
//     Subtract: 'Save for later', // Icon inside an empty link, describes its function
//     'calendar-01': '', // Decorative icon, alt text should be empty
//   };

//   const imagesToFix = swiperWrapper.querySelectorAll('img[alt=""]');
//   imagesToFix.forEach((imgelem) => {
//     const { iconName } = imgelem.dataset;
//     const altText = altTextMap[iconName];

//     if (altText !== undefined) {
//       imgelem.setAttribute('alt', altText);
//     }
//   });
//   // =================================================================
//   // END: Accessibility Fix
//   // =================================================================

//   // 4. Final assembly of the Swiper block
//   block.appendChild(swiperWrapper);

//   Array.from(block.querySelector('.swiper-slide-cards-2 .cards-listca
// rds1').children).forEach((ele) => {
//     ele.classList.add('card-list');
//   });

//   // 5. Check if .learning-fdp class exists in the parent
//   const learningFdp = block.closest('.learning-fdp') !== null;

//   let navigation = false;

//   // 6. Add prev/next buttons if learningFdp is true
//   if (learningFdp) {
//     const swiperBtn = document.createElement('div');
//     swiperBtn.classList.add('btn-wrapper');

//     const prevButton = document.createElement('div');
//     prevButton.classList.add('swiper-button-prev');

//     const nextButton = document.createElement('div');
//     nextButton.classList.add('swiper-button-next');

//     swiperBtn.appendChild(prevButton);
//     swiperBtn.appendChild(nextButton);

//     block.appendChild(swiperBtn);
//     navigation = {
//       nextEl: nextButton,
//       prevEl: prevButton,
//     };
//   }

//   dataMapMoObj.CLASS_PREFIXES = [];
//   dataMapMoObj.CLASS_PREFIXES.push('library-btn');

//   dataMapMoObj.addIndexed(block.closest('.future-building-container'));
//   const maindiv = block.closest('.future-building-container');

//   // 7. Initialize Swiper with navigation if available
//   let config = {};
//   if (!block.closest('.key-investing')) {
//     maindiv.querySelector('.library-btn3 p').classList.add('libr-btn-p');
//     maindiv.querySelector('.library-btn3 a').classList.add('libr-btn-a');
//     config = {
//       slidesPerView: 'auto',
//       spaceBetween: 12,
//       loop: true,
//       navigation, // will be false if no buttons
//       breakpoints: {
//         769: {
//           spaceBetween: 16,
//         },
//       },
//     };
//   } else {
//     // const leftarrow = document.createElement('div');
//     // leftarrow.classList.add('swiper-button-prev');
//     // block.appendChild(leftarrow);
//     // const rightarrow = document.createElement('div');
//     // rightarrow.classList.add('swiper-button-next');
//     // block.appendChild(rightarrow);
//     // const pagination = document.createElement('div');
//     // pagination.classList.add('swiper-pagination');
//     // const navigationWrap = document.createElement('div');
//     // navigationWrap.classList.add('navigate-wrap');
//     // navigationWrap.append(leftarrow, pagination, rightarrow);
//     // // block.appendChild(pagination);
//     // block.appendChild(navigationWrap);
//     // config = {
//     //   slidesPerView: 'auto',
//     //   // spaceBetween: 12,
//     //   loop: true,
//     //   navigation: {
//     //     nextEl: block.querySelector('.swiper-button-next'),
//     //     prevEl: block.querySelector('.swiper-button-prev'),
//     //   }, // will be false if no buttons
//     //   pagination: {
//     //     el: block.querySelector('.swiper-pagination'), // Sele
// ctor for your pagination container
//     //     clickable: true, // Makes pagination bullets clickable
//     //     renderBullet(index, className) {
//     //       // Customize the bullet content to display numbers
//     //       return `<span class="${className}">${index + 1}</span>`;
//     //     },
//     //   },
//     //   // breakpoints: {
//     //   //   769: {
//     //   //     spaceBetween: 16,
//     //   //   },
//     //   // },
//     // };

//     // creating Sear Box for Key Investing
//     const keyInvestSection = block.closest('.section');
//     const keyInvestSearchWrap = keyInvestSection.querySelector('.default-content-wrapper');
//     if (keyInvestSection.classList.contains('key-investing')) {
//       const keyInvestSearch = div(
//         { class: 'keyinvest-wrap' },
//         div(
//           { class: 'keyinvest-search' },
//           input({ class: 'keyinvest-inp', id: 'keyinvest', placeholder: ' ' }),
//           label({ class: 'keyinvest-label', for: 'keyinvest' }, 'Search here'),
//         ),
//       );
//       keyInvestSearchWrap.append(keyInvestSearch);
//     }
//   }
//   Swiper(block, config);

//   // window.addEventListener('resize', () => {
//   //   if (window.innerWidth <= 767) {
//   //     const futureBuildingSection = document.querySelector('.future-building-container');
//   //     const stayUpdatedSection = document
//   //       .querySelector('.article-sub-right.stay-updated.comlist.articlesub2');

//   //     if (futureBuildingSection && stayUpdatedSection) {
//   //       // Move future-building-container above stay-updated
//   //       // Move future-building-container above stay-updated
//   //       stayUpdatedSection.parentNode.insertBefore(futureBuildingSection, stayUpdatedSection);
//   //       console.log('✅ future-building-container moved above stay-updated');
//   //     } else {
//   //       console.warn('⚠️ Required sections not found in DOM');
//   //     }
//   //   }
//   // });

//   //  START SEARCH FUNCTIONALITY

//   const keySearchSection = document.querySelector('.key-investing .keyinvest-search');
//   const keySearchNewEle = document.createElement('div');
//   keySearchNewEle.classList.add('key-search-results', 'dsp-none');
//   keySearchSection.appendChild(keySearchNewEle);
//   const wrapper = document.querySelector('.key-investing .keyinvest-search');

//   const crossIconWrap = document.createElement('span');
//   crossIconWrap.classList.add('cross-icon-wrap');
//   wrapper.appendChild(crossIconWrap);
//   crossIconWrap.style.display = 'none';
//   const crossIcon = document.createElement('img');
//   crossIcon.classList.add('cancel-btn');
//   crossIcon.setAttribute('src', '/icons/input-cancel.svg');
//   crossIcon.setAttribute('alt', 'cancel button');
//   crossIcon.setAttribute('loading', 'eager');
//   crossIcon.style.display = 'flex';
//   crossIcon.style.cursor = 'pointer';
//   crossIconWrap.appendChild(crossIcon);

//   const searchFldkey = document.querySelector('#keyinvest');
//   const closeBtn = document.querySelector('.cross-icon-wrap');
//   let currentFocusIndex = -1;
//   const inputField = document.querySelector('.keyinvest-search input');
//   inputField.addEventListener('click', () => {
//     inputField.focus();
//     inputField.classList.add('focus-visible');
//   });
//   // Keep label floated when input has a value even after blur
//   if (searchFldkey) {
//     searchFldkey.addEventListener('blur', () => {
//       if (searchFldkey.value && searchFldkey.value.trim() !== '') {
//         searchFldkey.classList.add('focus-visible');
//         // CSS uses .active + label to float label when input has value
//         searchFldkey.classList.add('active');
//       } else {
//         try {
//           searchFldkey.classList.remove('focus-visible');
//           searchFldkey.classList.remove('active');
//         } catch (e) {
//           // ignore
//         }
//       }
//     });
//   }
//   if (searchFldkey) {
//     const listContainer = keySearchNewEle;

//     const updateActiveItem = (items) => {
//       items.forEach((item, idx) => {
//         if (idx === currentFocusIndex) {
//           item.classList.add('active-search-item');
//           item.scrollIntoView({ block: 'nearest' });
//         } else {
//           item.classList.remove('active-search-item');
//         }
//       });
//     };

//     // 👉 Filter Function
//     const filterListItems = (searchTerm) => {
//       const listItems = document.querySelectorAll('.result-item');
//       const term = searchTerm.trim();

//       const noMsg = listContainer.querySelector('.no-results-message');
//       if (noMsg) noMsg.remove();

//       if (!term) {
//         listItems.forEach((item) => {
//           item.querySelector('.list').innerHTML = item.dataset.originalText;
//           item.style.display = 'block';
//         });
//         return;
//       }

//       let matchesFound = false;

//       listItems.forEach((item) => {
//         const txt = item.dataset.originalText.toLowerCase();
//         const match = txt.includes(term.toLowerCase());

//         if (match) {
//           matchesFound = true;
//           item.querySelector('.list').innerHTML = item.dataset.originalText.replace(
// new RegExp(`(${term?.toLocaleLowerCase()})`, 'gi'), '<strong>$1</strong>');
//           item.style.display = 'block';
//         } else {
//           item.style.display = 'none';
//         }
//       });

//       if (!matchesFound) {
//         const msg = document.createElement('li');
//         msg.className = 'list-fund-name no-results-message';
//         msg.textContent = 'No matching results';
//         listContainer.appendChild(msg);
//       }
//     };

//     // 👉 On Focus – Load Titles or Re-apply Filter
//     searchFldkey.addEventListener('focus', () => {
//       keySearchNewEle.classList.remove('dsp-none');

//       // If there's a search term, re-apply the filter to preserve no-results-message
//       if (searchFldkey.value.trim()) {
//         filterListItems(searchFldkey.value);
//         return;
//       }

//       // Otherwise, show the full list
//       keySearchNewEle.innerHTML = '';
//       const titles = document.querySelectorAll('.cards-listcards1');
//       const titleAry = [];

//       titles.forEach((title) => {
//         const titleText = title.textContent.trim();
//         if (titleText) {
//           titleAry.push(titleText);
//         }
//       });

//       const uniqueTitleAry = [...new Set(titleAry)];
//       // console.log('Titles Array:', uniqueTitleAry);

//       uniqueTitleAry.forEach((value) => {
//         const newItem = document.createElement('p');
//         newItem.classList.add('result-item');
//         newItem.setAttribute('data-original-text', value);

//         const anchorTag = document.createElement('a');
//         anchorTag.classList.add('list');
//         anchorTag.setAttribute(
//           'href',
//           'https://mosl-dev-upd--mosl-eds--motilal-oswal-amc.aem.live/mutual-fund/in/en/motilal-oswal-edge/article-details-list',
//         );

//         anchorTag.textContent = value;

//         newItem.appendChild(anchorTag);
//         keySearchNewEle.appendChild(newItem);
//       });

//       // console.log("Titles Array:", titleAry);
//     });

//     // Prevent pointerdown on the list from blurring the input so the label stays in position
//     listContainer.addEventListener('pointerdown', (e) => {
//       // Prevent default on pointerdown avoids the input losing focus on option click
//       e.preventDefault();
//     });

//     // 👉 Click Selection
//     listContainer.addEventListener('click', (event) => {
//       event.preventDefault(); // keep default navigation off
//       closeBtn.style.display = 'flex';

//       // set the input value from clicked item
//       searchFldkey.value = event.target.textContent;

//       // Keep input focused and the visual focus state so the label doesn't move
//       try {
//         searchFldkey.focus();
//         searchFldkey.classList.add('focus-visible');
//         searchFldkey.classList.add('active');
//       } catch (err) {
//         // ignore if focus fails in some environments
//       }
//       let dataref = '';
//       if ([...event.target.classList].includes('result-item')) {
//         dataref = event.target.querySelector('a').getAttribute('href');
//       } else {
//         dataref = event.target.getAttribute('href');
//       }
//       window.location.href = dataref;
//       listContainer.classList.add('dsp-none');
//     });

//     // 👉 On Input

//     searchFldkey.addEventListener('input', (event) => {
//       filterListItems(event.target.value);
//       Array.from(listContainer.querySelectorAll('.list')).forEach((list) => {
//         if (list.textContent.toLocaleLowerCase().incl
// udes(searchFldkey.value.toLocaleLowerCase())) {
//           list.parentElement.style.display = 'block';
//         } else {
//           list.parentElement.style.display = 'none';
//         }
//       });
//       closeBtn.style.display = event.target.value.length > 0 ? 'flex' : 'none';
//       // toggle .active used by CSS to keep the label floated when value exists
//       if (event.target.value && event.target.value.trim() !== '') {
//         searchFldkey.classList.add('active');
//       } else {
//         searchFldkey.classList.remove('active');
//       }
//       // persist state so label stays floated even when input loses focus
//     });
//     closeBtn.addEventListener('click', () => {
//       searchFldkey.value = '';
//       filterListItems('');
//       closeBtn.style.display = 'none';
//       // remove visual float when cleared
//       try {
//         searchFldkey.classList.remove('focus-visible');
//         // placeholder-driven CSS will handle the float state; no JS class needed
//         searchFldkey.classList.remove('active');
//       } catch (e) {
//         // ignore
//       }
//     });
//     searchFldkey.addEventListener('keydown', (event) => {
//       const visibleItems = (param) => {
//         if (param === undefined) {
//           return Array.from(listContainer.querySelectorAll('.list'))
//             .filter((item) => item.parentElement.style.display !== 'none'
// && !item.classList.contains('no-results-message'));
//         }
//         const items = Array.from(listContainer.querySelectorAll('.list'));
//         const searchTerm = param.toLocaleLowerCase();
//         items.forEach((item) => {
//           const itemText = item.textContent.toLocaleLowerCase();
//           const isVisible = itemText.includes(searchTerm);

//           // Apply the style based on the match
//           item.parentElement.style.display = isVisible ? 'block' : 'none';
//         });
//         return param;
//       };

//       switch (event.key) {
//         case 'ArrowDown': {
//           event.preventDefault();
//           const v = visibleItems();
//           if (v.length === 0) break;
//           currentFocusIndex = (currentFocusIndex + 1) % v.length;
//           updateActiveItem(v);
//           break;
//         }
//         case 'ArrowUp': {
//           event.preventDefault();
//           const vUp = visibleItems();
//           if (vUp.length === 0) break;
//           currentFocusIndex = ((currentFocusIndex - 1 + vUp.length) % vUp.length);
//           updateActiveItem(vUp);
//           break;
//         }
//         // case 'Enter': {
//         //   // Prevent form submission/navigation — populate input and close dropdown
//         //   event.preventDefault();
//         //   const vEnt = visibleItems();
//         //   if (vEnt.length === 0) return false;
//         //   const sel = vEnt[(currentFocusIndex <
//         //  0 || currentFocusIndex >= vEnt.length) ? 0 : currentFocusIndex];
//         //   if (sel) {
//         //     searchFldkey.value = sel.textContent.trim();

//         //     closeBtn.style.display = 'flex';
//         //     listContainer.classList.add('dsp-none');
//         //   }
//         //   break;
//         // }

//         case 'Enter': {
//           event.preventDefault();

//           const vEnt = visibleItems();
//           if (vEnt.length === 0) return false;

//           const selIndex = (currentFocusIndex < 0 || currentFocusIndex >= vEnt.length)
//             ? 0
//             : currentFocusIndex;

//           const sel = vEnt[selIndex];
//           if (sel) {
//             // Set text in input
//             searchFldkey.value = sel.textContent.trim();

//             // Show close button
//             closeBtn.style.display = 'flex';

//             // Hide dropdown
//             listContainer.classList.add('dsp-none');

//             // 👉 Get the href from the selected item
//             const redUrl = sel.getAttribute('href');

//             // 👉 Redirect if href exists
//             if (redUrl && redUrl !== '#') {
//               window.location.href = redUrl;
//             }
//           }
//           break;
//         }

//         default:
//           break;
//       }
//       return event;
//     });

//     // 👉 Clear Button
//     closeBtn.addEventListener('click', () => {
//       searchFldkey.value = '';
//       filterListItems('');
//       closeBtn.style.display = 'none';
//       try {
//         searchFldkey.classList.remove('focus-visible');
//         searchFldkey.classList.remove('has-value');
//       } catch (e) {
//         // ignore
//       }
//     });

//     // 👉 Keyboard Navigation
//     // searchFldkey.addEventListener('keydown', (event) => {
//     //   const visibleItems = () =>
//     //     Array.from(listContainer.querySelectorAll('.list'))
//     //       .filter((item) => item.parentElement.style.display !== 'none');
//     //   switch (event.key) {
//     //     case 'ArrowDown':
//     //       event.preventDefault();
//     //       currentFocusIndex = (currentFocusIndex + 1) % visibleItems().length;
//     //       updateActiveItem(visibleItems());
//     //       break;
//     //     case 'ArrowUp':
//     //       event.preventDefault();
//     //       currentFocusIndex =
//     //         (currentFocusIndex - 1 + visibleItems().length) % visibleItems().length;
//     //       updateActiveItem(visibleItems());
//     //       break;
//     //     case 'Enter': {
//     //       if (visibleItems().length === 0) return false;
//     //       const selected = visibleItems()[currentFocusIndex] || visibleItems()[0];
//     //       searchFldkey.value = selected.textContent.trim();
//     //       keySearchNewEle.classList.add('dsp-none');
//     //       break;
//     //     }
//     //     default:
//     //       break;
//     //   }
//     // });
//   }

//   const url = window.location.href;
//   console.log('URL::::', url);

//   // 👉 Hide on document click
//   document.addEventListener('click', (event) => {
//     const inputKey = document.querySelector('#keyinvest');
//     const inputInvestEducate = document.querySelector('#our-experts-search');
//     const listBox = document.querySelector('.key-search-results');

//     if (!inputKey.contains(event.target) && !listBox.contains(event.target)) {
//       listBox.classList.add('dsp-none');
//       // If the input has a value, keep the label floated. Otherwise remove the float class.
//       if (searchFldkey.value && searchFldkey.value.trim() !== '') {
//         try {
//           inputKey.classList.add('focus-visible');
//           inputKey.classList.add('active');
//         } catch (e) {
//           // ignore
//         }
//       } else if (dataMapMoObj.searchFld === undefined || dataMapMoObj.searchFld === '') {
//         // check current page URL
//         const currentPath = window.location.pathname;

//         if (currentPath === '/mutual-fund/in/en/investor-education') {
//           if (inputInvestEducate.value !== '') {
//             closeBtn.style.display = 'block';
//           } else {
//             closeBtn.style.display = 'none';
//           }
//         } else {
//           try {
//             inputInvestEducate.classList.remove('focus-visible');
//             inputInvestEducate.classList.remove('active');
//           } catch (e) {
//             // ignore
//           }
//         }

//         // else if (dataMapMoObj.searchFld === undefined || dataMapMoObj.searchFld === '') {
//         //   closeBtn.style.display = 'none';
//         //   try {
//         //     input.classList.remove('focus-visible');
//         //     input.classList.remove('active');
//         //   } catch (e) {
//         //     // ignore
//         //   }
//         // }
//       }
//     }
//   });

//   // if(window.innerWidth <= 767){
//   // const futureBuildingSection = document.querySelector('.future-building-container');
//   // const stayUpdatedSection = =
//   //  document.querySelector('.article-sub-right.stay-updated.comlist.articlesub2');

//   // if (futureBuildingSection && stayUpdatedSection) {
//   // // Move future-building-container above stay-updated
//   // stayUpdatedSection.parentNode.insertBefore(futureBuildingSection, stayUpdatedSection);
//   // console.log('✅ future-building-container moved above stay-updated');
//   // } else {
//   // console.warn('⚠️ Required sections not found in DOM');
//   // }
//   // //
//   // }

//   return block;
//   // let config;
//   // if (block.closest('.moedge-article-main')) {
//   //   config = {
//   //     slidesPerView: '1.2',
//   //     spaceBetween: 12,
//   //     loop: true,
//   //     navigation, // will be false if no buttons
//   //     breakpoints: {
//   //       769: {
//   //         slidesPerView: '1.2',
//   //         spaceBetween: 16,
//   //       },
//   //     },
//   //   };
//   // } else {
//   //   config = {
//   //     slidesPerView: 'auto',
//   //     spaceBetween: 12,
//   //     loop: true,
//   //     navigation, // will be false if no buttons
//   //     breakpoints: {
//   //       769: {
//   //         spaceBetween: 16,
//   //       },
//   //     },
//   //   };
//   // }
//   // Swiper(block, config);
//   // return block;
// }
