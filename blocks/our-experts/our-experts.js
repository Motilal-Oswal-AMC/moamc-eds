// import dataMapMoObj from '../../scripts/constant.js';
// // import {
// //   input
// // } from '../../scripts/dom-helpers.js';

// export default function decorate(block) {
//   dataMapMoObj.CLASS_PREFIXES = [
//     'our-experts-cont',
//     'our-expert-section',
//     'our-expert-sub',
//     'expert-lists',
//     'expert-lists-wrap',
//     'expert-titles',
//     'expert-dropdown',
//   ];
//   dataMapMoObj.addIndexed(block);

//   const placeholder = block.querySelector('.our-experts-cont2
//  .our-expert-sub1')?.textContent || 'Search here...';

//   const inputEl = document.createElement('input');
//   inputEl.type = 'text';
//   inputEl.placeholder = placeholder;

//   const section1 = block.querySelector('.our-experts-cont2 .our-expert-sub1');
//   const iconSpan = section1?.querySelector('span.icon');

//   if (section1 && iconSpan) {
//     iconSpan.insertAdjacentElement('afterend', inputEl);
//   }

//   const listHeaders = document.querySelectorAll('.our-expert-sub3 .expert-lists-wrap1');

//   listHeaders.forEach((header) => {
//     header.addEventListener('click', () => {
//       const parentLi = header.closest('li'); // expert-lists1 / expert-lists2 / expert-lists3
//       const dropdown = parentLi.querySelector('.expert-dropdown2');

//       // Close other dropdowns
//       document.querySelectorAll('.our-expert-sub3 .expert-dropdown2').forEach((menu) => {
//         if (menu !== dropdown) {
//           menu.style.display = 'none';
//           menu.closest('li').classList.remove('open');
//         }
//       });

//       // Toggle current dropdown
//       if (dropdown) {
//         const isOpen = parentLi.classList.contains('open');
//         if (isOpen) {
//           dropdown.style.display = 'none';
//           parentLi.classList.remove('open');
//         } else {
//           dropdown.style.display = 'block';
//           parentLi.classList.add('open');
//         }
//       }
//     });
//   });
// }

import dataMapMoObj from '../../scripts/constant.js';
// import {
// } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = [
    'our-experts-cont',
    'our-expert-section',
    'our-expert-sub',
    'expert-lists',
    'expert-lists-wrap',
    'expert-titles',
    'expert-dropdown',
  ];
  dataMapMoObj.addIndexed(block);

  // --- START: MODIFIED CODE ---

  const labelText = block.querySelector('.our-experts-cont2 .our-expert-sub1')?.textContent || 'Search here';
  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('floating-label-wrapper');

  const inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.id = 'our-experts-search';
  inputEl.placeholder = 'Search here';
  inputEl.autocomplete = 'off';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = inputEl.id;
  labelEl.textContent = labelText;

  inputWrapper.appendChild(inputEl);
  inputWrapper.appendChild(labelEl);

  const section1 = block.querySelector('.our-experts-cont2 .our-expert-sub1');
  const iconSpan = section1?.querySelector('span.icon');

  const wrapper = document.querySelector('.our-experts-cont2 .our-expert-sub1');
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

  if (section1 && iconSpan) {
    iconSpan.insertAdjacentElement('afterend', inputWrapper);
  }

  // --- NEW: Add event listeners for focus/blur ---
  if (section1) {
    // Add class on input click (focus)
    inputEl.addEventListener('focus', () => {
      if (inputEl.value !== '') {
        section1.classList.add('input-focused');
      } else {
        section1.classList.remove('input-focused');
      }
    });

    // Remove class when clicking away (blur)
    inputEl.addEventListener('blur', () => {
      section1.classList.remove('input-focused');
    });
    inputEl.focus();
  }
  // --- END: NEW CODE ---

  // --- END: MODIFIED CODE ---

  // --- UNCHANGED CODE ---
  const listHeaders = document.querySelectorAll('.our-expert-sub3 .expert-lists-wrap1');

  listHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const parentLi = header.closest('li'); // expert-lists1 / expert-lists2 / expert-lists3
      const dropdown = parentLi.querySelector('.expert-dropdown2');

      // Close other dropdowns
      document.querySelectorAll('.our-expert-sub3 .expert-dropdown2').forEach((menu) => {
        if (menu !== dropdown) {
          menu.style.display = 'none';
          menu.closest('li').classList.remove('open');
        }
      });

      // Toggle current dropdown
      if (dropdown) {
        const isOpen = parentLi.classList.contains('open');
        if (isOpen) {
          dropdown.style.display = 'none';
          parentLi.classList.remove('open');
        } else {
          dropdown.style.display = 'block';
          parentLi.classList.add('open');
        }
      }
    });
  });

  // --- START SEARCH FUNCTIONALITY ---
  const seachSection = document.querySelector('.our-experts .our-experts-cont2 .our-expert-section1');
  const searchNewEle = document.createElement('div');
  searchNewEle.classList.add('search-results', 'dsp-none');
  seachSection.appendChild(searchNewEle);
  const searchFld = document.querySelector('#our-experts-search');
  let currentFocusIndex = -1;
  // const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const closeBtn = document.querySelector('.cross-icon-wrap');

  if (searchFld) {
    const listContainer = document.querySelector('.search-results');

    const updateActiveItem = (items) => {
      items.forEach((item, idx) => {
        if (idx === currentFocusIndex) {
          item.classList.add('active-search-item');
          item.scrollIntoView({
            block: 'nearest',
          });
        } else {
          item.classList.remove('active-search-item');
        }
      });
    };

    searchFld.addEventListener('focus', () => {
      searchNewEle.classList.remove('dsp-none');
      const titles = document.querySelectorAll('.moedge-building-container .moedge-build-sec3 .button');
      const profileName = document.querySelectorAll('.behind-the-content .cards-wrapper .cards-card-body .button');
      const titleAry = [];

      titles.forEach((title) => {
        const storeTitle = title.textContent.trim();
        if (storeTitle && storeTitle.toLowerCase() !== 'read now') {
          titleAry.push(storeTitle);
        }
      });

      const profileNameAry = [];
      profileName.forEach((subprofileName) => {
        const storePflName = subprofileName.textContent.trim();
        if (storePflName && storePflName.toLowerCase() !== 'card_link') {
          profileNameAry.push(storePflName);
        }
      });

      const mergedArray = [...new Set([...titleAry, ...profileNameAry])];
      if (searchNewEle && searchFld.value.length === 0 && mergedArray.length > 0) {
        searchNewEle.innerHTML = '';

        mergedArray.forEach((value) => {
          const newItem = document.createElement('p');
          const anchotTag = document.createElement('a');
          anchotTag.classList.add('list');
          anchotTag.setAttribute(
            'href',
            'https://mosl-dev-upd--mosl-eds--motilal-oswal-amc.aem.live/mutual-fund/in/en/motilal-oswal-edge/article-details-list',
          );
          newItem.classList.add('result-item');
          newItem.setAttribute('data-original-text', value);
          searchNewEle.appendChild(newItem);
          newItem.appendChild(anchotTag);
          anchotTag.textContent = value;
        });
      } else {
        listContainer.querySelectorAll('.list').forEach((item) => {
        // Check if the item's text includes the search parameter
          const isVisible = item.textContent.toLocaleLowerCase()
            .includes(searchFld.value.toLocaleLowerCase());
          // 2. Perform the "side effect": Show or hide the parent
          item.parentElement.style.display = isVisible ? 'block' : 'none';
        });
      }
    });

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

    const filterListItems = (searchTerm) => {
      const listItems = document.querySelectorAll('.result-item');
      const term = searchTerm.trim();
      const existingNoResultsMessage = listContainer.querySelector('.no-results-message');
      if (existingNoResultsMessage) existingNoResultsMessage.remove();
      listContainer.classList.remove('no-search-list');

      if (!term) {
        listItems.forEach((item) => {
          item.querySelector('.list').innerHTML = item.dataset.originalText;
          item.style.display = 'list-item';
        });
        return;
      }

      // const searchRegex = new RegExp(escapeRegExp(term), 'gi');
      let matchesFound = false;

      listItems.forEach((item) => {
        const {
          originalText,
        } = item.dataset;
        const match = originalText.toLowerCase().includes(term.toLowerCase());
        if (match) {
          matchesFound = true;
          const highlightedText = originalText;
          item.querySelector('.list').innerHTML = highlightedText;
        } else {
          item.style.display = 'none';
        }
      });

      if (!matchesFound) {
        listContainer.classList.add('no-search-list');
        const messageItem = document.createElement('li');
        messageItem.className = 'list-fund-name no-results-message';
        messageItem.textContent = 'No matching results';
        listContainer.appendChild(messageItem);
      }
    };

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
  }
  document.addEventListener('click', (event) => {
    const inputbox = block.querySelector('.our-experts-cont2 .our-expert-sub1 input');
    const searchbox = block.querySelector('.our-experts-cont2 .search-results');
    if (!inputbox.contains(event.target) && !searchbox.contains(event.target)) {
      searchbox.classList.add('dsp-none');
      if (searchFld.value === '') {
        closeBtn.style.display = 'none';
      }
    }
  });
  // --- END SEARCH FUNCTIONALITY ---
}
