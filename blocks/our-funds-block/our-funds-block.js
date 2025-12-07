// import dataMapMoObj.getlisting from '../../scripts/dataMapMoObj.getlisting.js';
import {
  div,
  input,
  label,
  span,
  p,
  button,
  ul,
  li,
  img,
} from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';
import fundcardblock from '../fund-card/fund-card.js';
import listviewblock from '../list-view-card/list-view-card.js';

function dataFilterfun(param) {
  const dataMapObj = {
    schemeName: [],
    fundCategory: [{
      'indian-equity': [],
    },
    {
      'international-equity': [],
    },
    {
      'hybrid-&-balanced': [],
    },
    {
      'multi-asset': [],
    },
    {
      commodity: [],
    },
    {
      'debt-&-liquid': [],
    },
    {
      indianEquitySub: [{
        'large-and-mid-cap': [],
      },
      {
        'large-cap': [],
      },
      {
        'mid-cap': [],
      },
      {
        'small-cap': [],
      },
      {
        sector: [],
      },
      {
        factor: [],
      },
      {
        'tax-saver-(elss)': [],
      },
      {
        'multi-cap-fund': [],
      },
      {
        'flexi-cap': [],
      },
      ],
    },
    ],
    fundType: [{
      active: [],
    },
    {
      'index-funds': [],
    },
    {
      etf: [],
    },
    ],
    sort: [{
      ListDropdown: [{
        text: 'Popular',
        value: 'inception_Ret',
      },
      {
        text: '1 Year Returns',
        value: 'oneYear_Ret',
      },
      {
        text: '3 Year Returns',
        value: 'threeYear_Ret',
      },
      {
        text: '5 Year Returns',
        value: 'fiveYear_Ret',
      },
      {
        text: '7 Year Returns',
        value: 'sevenYear_Ret',
      },
      {
        text: '10 Year Returns',
        value: 'tenYear_Ret',
      },
      ],
      inception_Ret: [],
      oneYear_Ret: [],
      threeYear_Ret: [],
      fiveYear_Ret: [],
      sevenYear_Ret: [],
      tenYear_Ret: [],
    }],
  };

  const {
    fundCategory,
  } = dataMapObj;
  const {
    fundType,
  } = dataMapObj;
  const fundSort = dataMapObj.sort[0];
  const equitySub = fundCategory[fundCategory.length - 1].indianEquitySub;

  const categoryMapKeys = [
    'motilal-oswal:indian-equity-',
    'motilal-oswal:international-equity',
    'motilal-oswal:hybrid-&-balanced',
    'motilal-oswal:multi-asset',
    'motilal-oswal:commodity',
    'motilal-oswal:debt-&-liquid',
  ];
  const categoryValues = [
    'indian-equity',
    'international-equity',
    'hybrid-&-balanced',
    'multi-asset',
    'commodity',
    'debt-&-liquid',
  ];

  const typeMapKeys = [
    'motilal-oswal:active',
    'motilal-oswal:index-funds',
    'motilal-oswal:etf',
  ];
  const typeValues = ['active', 'index-funds', 'etf'];

  const subcategoryMapKeys = [
    'motilal-oswal:large-and-mid-cap',
    'motilal-oswal:large-cap',
    'motilal-oswal:mid-cap',
    'motilal-oswal:small-cap',
    'motilal-oswal:sector',
    'motilal-oswal:factor',
    'motilal-oswal:tax-saver-(elss)',
    'motilal-oswal:multi-cap-fund',
    'motilal-oswal:flexi-cap',
  ];
  const subcategoryValues = [
    'large-and-mid-cap',
    'large-cap',
    'mid-cap',
    'small-cap',
    'sector',
    'factor',
    'tax-saver-(elss)',
    'multi-cap-fund',
    'flexi-cap',
  ];

  for (let i = 0; i < param.length; i += 1) {
    const name = param[i];
    const tags = name.fundsTaggingSection;
    const {
      schcode,
    } = name;

    // Category matching
    for (let k = 0; k < categoryMapKeys.length; k += 1) {
      if (tags.indexOf(categoryMapKeys[k]) !== -1) {
        const category = categoryValues[k];
        for (let j = 0; j < fundCategory.length; j += 1) {
          if (fundCategory[j][category]) {
            fundCategory[j][category].push(schcode);
            break;
          }
        }
      }
    }

    // Type matching
    for (let k = 0; k < typeMapKeys.length; k += 1) {
      if (tags.indexOf(typeMapKeys[k]) !== -1) {
        const type = typeValues[k];
        for (let j = 0; j < fundType.length; j += 1) {
          if (fundType[j][type]) {
            fundType[j][type].push(schcode);
            break;
          }
        }
      }
    }

    // subCate matching
    for (let k = 0; k < subcategoryMapKeys.length; k += 1) {
      if (tags.indexOf(subcategoryMapKeys[k]) !== -1) {
        const type = subcategoryValues[k];
        for (let j = 0; j < equitySub.length; j += 1) {
          if (equitySub[j][type]) {
            equitySub[j][type].push(schcode);
            break;
          }
        }
      }
    }

    // Returns sorting
    const {
      returns,
    } = name;
    if (returns && returns.length) {
      for (let r = 0; r < returns.length; r += 1) {
        const ret = returns[r];
        if (ret.inception_Ret && fundSort.inception_Ret.indexOf(schcode) === -1) {
          fundSort.inception_Ret.push(schcode);
        }
        if (ret.oneYear_Ret && fundSort.oneYear_Ret.indexOf(schcode) === -1) {
          fundSort.oneYear_Ret.push(schcode);
        }
        if (ret.threeYear_Ret && fundSort.threeYear_Ret.indexOf(schcode) === -1) {
          fundSort.threeYear_Ret.push(schcode);
        }
        if (ret.fiveYear_Ret && fundSort.fiveYear_Ret.indexOf(schcode) === -1) {
          fundSort.fiveYear_Ret.push(schcode);
        }
        if (ret.sevenYear_Ret && fundSort.sevenYear_Ret.indexOf(schcode) === -1) {
          fundSort.sevenYear_Ret.push(schcode);
        }
        if (ret.tenYear_Ret && fundSort.tenYear_Ret.indexOf(schcode) === -1) {
          fundSort.tenYear_Ret.push(schcode);
        }
      }
    }

    const sh = schcode;
    // Scheme Name
    dataMapObj.schemeName.push({
      schemeName: name.schemeName,
      schcode: sh,
    });
  }

  return dataMapObj;
}

function capitalizeEachWord(sentence) {
  if (sentence.includes('etf')) {
    return `${sentence.toUpperCase()}'s`;
  }
  return sentence.replace(/\b\w/g, (char) => char.toUpperCase());
}

function viewFunction(param) {
  param.querySelector('.list-container').innerHTML = '';
  param.querySelector('.cards-container').innerHTML = '';
  if (Array.from(param.querySelector('.listby-container').classList).includes('list-view-active')) {
    dataMapMoObj.funddata.forEach((el) => {
      param.querySelector('.list-container').append(listviewblock(el));
    });
    if (dataMapMoObj.deskrightdrp === '') {
      param.querySelector('.return-select-container p').textContent = '3 Years';
      dataMapMoObj.deskrightdrp = '3 Years';
    } else {
      param.querySelector('.return-select-container p').textContent = dataMapMoObj.deskrightdrp;
    }
  } else {
    dataMapMoObj.funddata.forEach((el) => {
      param.querySelector('.cards-container').append(fundcardblock(el));
    });
    if (dataMapMoObj.deskrightdrp === '') {
      param.querySelector('.return-select-container p').textContent = '3 Years';
      dataMapMoObj.deskrightdrp = '3 Years';
    } else {
      param.querySelector('.return-select-container p').textContent = dataMapMoObj.deskrightdrp;
    }
  }

  // dataMapMoObj.parseFunction(param, 'viewfunc');
}

function searchFunctionality(block) {
  // 1. Cache all necessary DOM element references
  const data = [];
  if (Array.from(block.querySelector('.cards-container').children).length !== 0) {
    Array.from(block.querySelector('.cards-container').children).forEach((cardel) => {
      data.push(cardel.querySelector('.star').getAttribute('schcode'));
    });
    const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
      if (!el.fundsTaggingSection || !el.planList) {
        return false;
      }
      return el;
    });
    dataMapMoObj.funddata = tempDfilt.filter((elobj) => data.includes(elobj.schcode));
  }
  if (Array.from(block.querySelector('.list-container').children).length !== 0) {
    Array.from(block.querySelector('.list-container').children).forEach((cardel) => {
      data.push(cardel.querySelector('.star').getAttribute('schcode'));
    });
    const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
      if (!el.fundsTaggingSection || !el.planList) {
        return false;
      }
      return el;
    });
    dataMapMoObj.funddata = tempDfilt.filter((elobj) => data.includes(elobj.schcode));
  }
  const searchContainer = document.querySelector('.search-input');
  const searchInput = searchContainer.querySelector('.search');
  const listContainer = searchContainer.querySelector('.list-search');
  // const listItems = searchContainer.querySelectorAll('.list-fund-name');
  const cancelButton = searchContainer.querySelector('.cancel-search');

  const flpboolean = document.querySelector('.fund-toggle-wrap input').checked;
  const planflow = flpboolean ? 'Regular' : 'Direct';
  const mop = document.querySelector('.fund-toggle-wrap input');
  if (flpboolean) {
    mop.closest('.togglebtn').classList.add('toggle-checked');
  } else {
    mop.closest('.togglebtn').classList.remove('toggle-checked');
  }
  let datacd = [];
  const dataouter = [];
  const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
    if (!el.fundsTaggingSection || !el.planList) {
      return false;
    }
    return el;
  });
  tempDfilt.forEach((elde, indexde) => {
    elde?.planList.forEach((elplan) => {
      if (elplan.planName === planflow) {
        if (!datacd.includes(elplan.planName)) {
          datacd.push(elplan.planName);
        }
      }
    });
    if (datacd.length > 0) {
      dataouter.push({
        [indexde]: datacd,
        schemeName: elde.schemeName,
      });
      datacd = [];
    }
  });
  // console.log(dataouter);
  const FUND_DATA = dataouter.map((fund) => fund.schemeName);

  const populateList = () => {
    listContainer.innerHTML = ''; // Clear list before populating
    FUND_DATA.forEach((fundName) => {
      const item = document.createElement('li');
      item.className = 'list-fund-name';
      item.textContent = fundName;
      listContainer.appendChild(item);
    });
  };

  // --- SCRIPT INITIALIZATION ---
  populateList(); // Create the list on page load

  // --- IMPORTANT: Select listItems AFTER they have been created ---
  const listItems = searchContainer.querySelectorAll('.list-fund-name');
  listItems.forEach((item) => {
    item.dataset.originalText = item.textContent;
  });
  // --- End of Initialization ---

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // The filter function remains the same
  const filterListItems = (searchTerm) => {
    const term = searchTerm.trim();
    const existingNoResultsMessage = listContainer.querySelector('.no-results-message');
    if (existingNoResultsMessage) existingNoResultsMessage.remove();
    listContainer.classList.remove('no-search-list');

    if (!term) {
      listItems.forEach((item) => {
        item.innerHTML = item.dataset.originalText;
        item.style.display = 'list-item';
      });
      return;
    }

    const searchRegex = new RegExp(escapeRegExp(term), 'gi');
    let matchesFound = false;

    listItems.forEach((item) => {
      const {
        originalText,
      } = item.dataset;
      const match = originalText.match(searchRegex);
      if (match) {
        matchesFound = true;
        // const highlightedText =
        // originalText.replace(searchRegex, (mat) => `<strong>${mat}</strong>`);
        const highlightedText = originalText;
        item.innerHTML = highlightedText;
        item.style.display = 'list-item';
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

  searchInput.addEventListener('focus', () => {
    searchContainer.classList.add('search-active');
    if (window.visualViewport) {
      // This event fires whenever the viewport is resized or zoomed
      window.visualViewport.addEventListener('resize', () => {
        window.visualViewport.scale = 1;
      });
    }
  });
  searchContainer.classList.remove('search-active');
  searchInput.addEventListener('input', (event) => {
    searchContainer.classList.add('search-active');
    filterListItems(event.target.value);
    cancelButton.style.display = event.target.value.length > 0 ? 'flex' : 'none';
  });

  let currentFocusIndex = -1;

  function updateActiveItem(items) {
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
  }
  searchInput.addEventListener('keydown', (event) => {
    const visibleItems = Array.from(listContainer.querySelectorAll('.list-fund-name'))
      .filter((item) => item.style.display !== 'none' && !item.classList.contains('no-results-message'));

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      currentFocusIndex = (currentFocusIndex + 1) % visibleItems.length;
      updateActiveItem(visibleItems);
      // return false;
    } if (event.key === 'ArrowUp') {
      event.preventDefault();
      currentFocusIndex = (currentFocusIndex - 1 + visibleItems.length) % visibleItems.length;
      updateActiveItem(visibleItems);
      // return false;
    } if (event.key === 'Enter') {
      if (visibleItems[currentFocusIndex]) {
        // visibleItems[currentFocusIndex].click();
        searchInput.value = visibleItems[currentFocusIndex].textContent;
      } else if (visibleItems.length > 0) {
        // visibleItems[0].click();
        searchInput.value = visibleItems[currentFocusIndex].textContent;
      }
      searchContainer.classList.remove('search-active');
      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
        if (!el.fundsTaggingSection || !el.planList) {
          return false;
        }
        return el;
      });
      dataMapMoObj.funddata = tempDfilt.filter((ellim) => ellim.schemeName === searchInput.value);
      // viewFunction(block);
      // CARD HIDE LOGIC ON SEARCH
      const cardsContainercd = block.querySelector('.filter-cards');
      const cardsContainer = cardsContainercd.querySelector('.cards-container');
      const squarecard = block.querySelector('.squareby-container');
      if (Array.from(squarecard.classList).includes('grid-view-active')) {
        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
          if (!el.fundsTaggingSection || !el.planList) {
            return false;
          }
          return el;
        });
        const datatem = tempDfilt.filter(
          (elsch) => elsch.schemeName === searchInput.value,
        );
        cardsContainer.innerHTML = '';
        cardsContainer.append(fundcardblock(datatem[0]));
      }

      const listHeadercd = block.querySelector('.filter-cards');
      const listHeader = listHeadercd.querySelector('.list-container');
      const listcard = block.querySelector('.listby-container');
      if (Array.from(listcard).includes('list-view-active')) {
        if (cardsContainer && cardsContainer.checkVisibility()) {
          const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
            if (!el.fundsTaggingSection || !el.planList) {
              return false;
            }
            return el;
          });
          const datatem = tempDfilt.filter(
            (elsch) => (elsch.schemeName === searchInput.value),
          );
          listHeader.innerHTML = '';
          listHeader.append(listviewblock(datatem[0]));
        }
      }
      cancelButton.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
      const flitwrap = block.querySelector('.applied-filter-wrap');
      if (Array.from(flitwrap.classList).includes('filter-active')) {
        flitwrap.classList.remove('filter-active');
      }
      Array.from(block.querySelector('.filter-list-wrapper').children).forEach((el) => {
        if (el.closest('.checkbox-label-container').querySelector('.innerindianequity')) {
          el.closest('.checkbox-label-container').querySelectorAll('.innerindianequity input').forEach((elemsub) => {
            if (elemsub.checked) {
              elemsub.checked = false;
            }
          });
        }
        if (el.querySelector('input').checked) {
          // const moplabel = el.querySelector('input').nextElementSibling;
          if (el.querySelector('input').getAttribute('id') !== 'index1') {
            if (el.querySelector('input').checked) {
              el.querySelector('input').checked = false;
            }
          }
        }
      });
      return false;
    } if (event.key === 'Backspace' || event.key === 'Delete') {
      currentFocusIndex = -1; // Reset selection on backspace/delete
      const cardsContainer = block.querySelector('.filter-cards .cards-container');

      if (cardsContainer && cardsContainer.checkVisibility()) {
        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
          if (!el.fundsTaggingSection || !el.planList) {
            return false;
          }
          return el;
        });
        const datatem = tempDfilt.slice(0, 10);
        cardsContainer.innerHTML = '';
        datatem.forEach((elcard) => cardsContainer.append(fundcardblock(elcard)));
      }
      const listHeader = block.querySelector('.filter-cards .list-container');
      if (listHeader && listHeader.checkVisibility()) {
        if (cardsContainer && cardsContainer.checkVisibility()) {
          const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
            if (!el.fundsTaggingSection || !el.planList) {
              return false;
            }
            return el;
          });
          const datatem = tempDfilt.slice(0, 10);
          listHeader.innerHTML = '';
          datatem.forEach((elist) => cardsContainer.append(listviewblock(elist)));
        }
      }
      return false;
    }
    return event;
  });

  listContainer.addEventListener('click', (event) => {
    if (event.target.matches('.list-fund-name:not(.no-results-message)')) {
      searchInput.value = event.target.dataset.originalText;
      searchContainer.classList.remove('search-active');
      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
        if (!el.fundsTaggingSection || !el.planList) {
          return false;
        }
        return el;
      });
      dataMapMoObj.funddata = tempDfilt.filter((ellim) => ellim.schemeName === searchInput.value);
      viewFunction(block);
      // CARD HIDE LOGIC ON SEARCH
      const cardsContainercd = block.querySelector('.filter-cards');
      const cardsContainer = cardsContainercd.querySelector('.cards-container');
      const squarecard = block.querySelector('.squareby-container');
      if (Array.from(squarecard.classList).includes('grid-view-active')) {
        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
          if (!el.fundsTaggingSection) {
            return false;
          }
          return el;
        });
        const datatem = tempDfilt.filter(
          (elsch) => elsch.schemeName === searchInput.value,
        );
        cardsContainer.innerHTML = '';
        cardsContainer.append(fundcardblock(datatem[0]));
      }

      const listHeadercd = block.querySelector('.filter-cards');
      const listHeader = listHeadercd.querySelector('.list-container');
      const listcard = block.querySelector('.listby-container');
      if (Array.from(listcard).includes('list-view-active')) {
        if (cardsContainer && cardsContainer.checkVisibility()) {
          const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
            if (!el.fundsTaggingSection) {
              return false;
            }
            return el;
          });
          const datatem = tempDfilt.filter(
            (elsch) => (elsch.schemeName === searchInput.value),
          );
          listHeader.innerHTML = '';
          listHeader.append(listviewblock(datatem[0]));
        }
      }
      cancelButton.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
      const flitwrap = block.querySelector('.applied-filter-wrap');
      if (Array.from(flitwrap.classList).includes('filter-active')) {
        flitwrap.classList.remove('filter-active');
      }
      Array.from(block.querySelector('.filter-list-wrapper').children).forEach((el) => {
        if (el.closest('.checkbox-label-container').querySelector('.innerindianequity')) {
          el.closest('.checkbox-label-container').querySelectorAll('.innerindianequity input').forEach((elemsub) => {
            if (elemsub.checked) {
              elemsub.checked = false;
            }
          });
        }
        if (el.querySelector('input').checked) {
          // const moplabel = el.querySelector('input').nextElementSibling;
          if (el.querySelector('input').getAttribute('id') !== 'index1') {
            if (el.querySelector('input').checked) {
              el.querySelector('input').checked = false;
            }
          }
        }
      });
    }
  });

  cancelButton.addEventListener('click', () => {
    searchInput.value = '';
    filterListItems('');
    cancelButton.style.display = 'none';
    searchContainer.classList.remove('search-active');
    const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
      if (!el.fundsTaggingSection || !el.planList) {
        return false;
      }
      return el;
    });
    dataMapMoObj.funddata = tempDfilt.slice(0, 10);
    viewFunction(block);
  });

  document.addEventListener('click', (event) => {
    try {
      if (!searchContainer.contains(event.target)) {
        searchContainer.classList.remove('search-active');
        // searchInput.value = ""
      }
      document.querySelectorAll('.cagr-container').forEach((el) => {
        if (!el.contains(event.target)) {
          el.querySelector('.dropdown-list').classList.remove('dropdown-active');
        }
      });
      document.querySelectorAll('.card-category').forEach((el) => {
        if (!el.contains(event.target)) {
          el.querySelector('.dropdown-list').classList.remove('dropdown-active');
        }
      });
    } catch (error) {
      // console.log(error);
    }
  });

  if (searchInput.value.length === 0) {
    cancelButton.style.display = 'none';
  }
  return false;
}

function checkfilter(block) {
  const searInp = block.querySelector('.search-input input');
  searInp.value = '';
  const cancelBtn = block.querySelector('.cancel-search');
  cancelBtn.style.display = 'none';
  const filterTag = []; // 5-8-25
  const tempData = [];
  Array.from(block.querySelector('.filter-list-wrapper').children).forEach((el) => {
    if (el.closest('.checkbox-label-container').querySelector('.innerindianequity')) {
      el.closest('.checkbox-label-container').querySelectorAll('.innerindianequity input').forEach((elemsub) => {
        if (elemsub.checked && !tempData.includes(elemsub.getAttribute('dataattr'))) {
          filterTag.push(elemsub.nextElementSibling.textContent.trim().split('(')[0]); // 5-8-25
          elemsub.getAttribute('dataattr').split('-').forEach((eldata) => {
            if (!tempData.includes(eldata)) {
              tempData.push(eldata);
            }
          });
        }
      });
    }
    if (el.querySelector('input').checked) {
      const moplabel = el.querySelector('input').nextElementSibling;
      const finlabel = moplabel.querySelector('label').textContent.split('(')[0];
      filterTag.push(finlabel); // 5-8-25
      if (el.querySelector('input').getAttribute('id') !== 'index1') {
        el.querySelector('input').getAttribute('dataattr').split('-').forEach((eldata) => {
          if (!tempData.includes(eldata)) {
            tempData.push(eldata);
          }
        });
      }
    }
  });

  dataMapMoObj.funddata = [];
  const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
    if (!el.fundsTaggingSection || !el.planList) {
      return false;
    }
    return el;
  });
  dataMapMoObj.funddata = tempData.length > 0
    ? tempDfilt.filter((el) => tempData.includes(el.schcode)) : [];
  if (dataMapMoObj.funddata.length === 0) {
    const sorttextcont = block.querySelector('.sort-select-container .selectedtext');
    const sorttext = sorttextcont.textContent.trim();
    if (sorttext === 'Popular') {
      dataMapMoObj.funddata = '';
      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
        if (!el.fundsTaggingSection || !el.planList) {
          return false;
        }
        return el;
      });
      dataMapMoObj.funddata = tempDfilt.slice(0, 10);
    }
    if (sorttext === 'Oldest to Newest') {
      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
        if (!el.fundsTaggingSection || !el.planList) {
          return false;
        }
        return el;
      });
      const tempDataad = JSON.parse(JSON.stringify(tempDfilt));
      const tempa = tempDataad.sort(
        (a, b) => new Date(a.dateOfAllotment) - new Date(b.dateOfAllotment),
      );
      dataMapMoObj.funddata = '';
      dataMapMoObj.funddata = tempa;
    }
    if (sorttext === 'Newest to Oldest') {
      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
        if (!el.fundsTaggingSection || !el.planList) {
          return false;
        }
        return el;
      });
      const tempDataad = JSON.parse(JSON.stringify(tempDfilt));
      const tempa = tempDataad.sort(
        (a, b) => new Date(b.dateOfAllotment) - new Date(a.dateOfAllotment),
      );
      dataMapMoObj.funddata = '';
      dataMapMoObj.funddata = tempa;
    }
  }

  viewFunction(block);

  function filterGroup(Filterparam) {
    const appliedList = block.querySelector('.applied-filter-list');
    appliedList.innerHTML = '';

    // Render applied filters
    for (let i = 0; i < Filterparam.length; i += 1) {
      const dspclose = Filterparam[i] === 'Indian Equity' ? 'none' : 'flex';
      appliedList.innerHTML += `<li class="applied-filter-name" style="display:${dspclose}"><span>${Filterparam[i]}</span><img src="/icons/cross-icon.svg" alt="cross icon" class="filter-cross-icon"></li>`;
    }
    if (Filterparam.length !== 0) {
      if (Filterparam.length === 1 && Filterparam[0] === 'Indian Equity') {
        document.querySelector('.filter-list-wrapper #index1').checked = false;
        appliedList.closest('.applied-filter-wrap').classList.remove('filter-active');
        return false;
      }
      appliedList.closest('.applied-filter-wrap').classList.add('filter-active');
    } else {
      appliedList.closest('.applied-filter-wrap').classList.remove('filter-active');
      return false;
    }
    // Add remove logic for each tag
    const appliedItems = Array.from(appliedList.children);
    for (let i = 0; i < appliedItems.length; i += 1) {
      const removeIcon = appliedItems[i].querySelector('img');
      removeIcon.addEventListener('click', (event) => {
        const updatedFilterTag = [];
        const clickedText = event.target.closest('.applied-filter-name').querySelector('span').textContent;

        const currentItems = Array.from(appliedList.children);
        for (let j = 0; j < currentItems.length; j += 1) {
          const spanText = currentItems[j].querySelector('span').textContent;
          if (spanText !== clickedText) {
            updatedFilterTag.push(spanText);
          }
        }

        // Re-render after removal
        filterGroup(updatedFilterTag);

        // Uncheck logic
        const filterItems = Array.from(block.querySelector('.filter-list-wrapper').children);
        for (let k = 0; k < filterItems.length; k += 1) {
          const item = filterItems[k];
          const checkboxContainer = item.closest('.checkbox-label-container');
          if (checkboxContainer) {
            const innerEquity = checkboxContainer.querySelector('.innerindianequity');
            if (innerEquity) {
              const subInputs = innerEquity.querySelectorAll('input');
              for (let l = 0; l < subInputs.length; l += 1) {
                const innerFundFilter = subInputs[l].nextElementSibling.textContent.trim().split('(')[0];
                if (updatedFilterTag.indexOf(innerFundFilter) === -1) {
                  subInputs[l].checked = false;
                  const labelnum = subInputs[l].nextElementSibling;
                  if (labelnum.querySelector('.tempcount') !== null) {
                    labelnum.querySelector('.tempcount').textContent = '';
                  }
                  if (updatedFilterTag.length === 0) {
                    appliedList.closest('.applied-filter-wrap').classList.remove('filter-active');
                  }
                }
              }
            }

            const inp = item.querySelector('input');
            if (inp) {
              const idAttr = inp.getAttribute('id');
              const outerLabel = checkboxContainer.querySelector('label')?.textContent.replace(/\d+/g, '').replaceAll('()', '').trim();

              if (idAttr.includes('index') && outerLabel && updatedFilterTag.indexOf(outerLabel) === -1) {
                inp.checked = false;
              } else if (idAttr.includes('fundtype') && outerLabel && updatedFilterTag.indexOf(outerLabel) === -1) {
                inp.checked = false;
              } else if (updatedFilterTag.length === 1 && updatedFilterTag[0] === 'Indian Equity') {
                appliedList.closest('.applied-filter-wrap').classList.remove('filter-active');
                inp.checked = false;
              }

              checkfilter(block);
            }
          }
        }
      });
    }

    return block;
  }

  return filterGroup(filterTag);
}

function applyFunction(block) {
  let temp = dataMapMoObj.tempMobReturn === undefined ? [] : dataMapMoObj.tempMobReturn;
  const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
    if (!el.fundsTaggingSection || !el.planList) {
      return false;
    }
    return el;
  });
  temp = dataMapMoObj.tempMobReturn.length !== 0 ? temp : tempDfilt.slice(0, 11);
  dataMapMoObj.tempMobReturn = temp;
  if (Array.from(block.querySelector('.filter-overlay').classList).includes('active')) {
    dataMapMoObj.funddata = dataMapMoObj.tempMobReturn;
    dataMapMoObj.tempMobReturn = [];
    block.querySelector('.filter-overlay').classList.remove('active');
    checkfilter(block);
  } else if (Array.from(block.querySelector('.sort-overlay').classList).includes('active')) {
    dataMapMoObj.funddata = dataMapMoObj.tempMobReturn;
    dataMapMoObj.tempMobReturn = [];
    block.querySelector('.sort-overlay').classList.remove('active');
    dataMapMoObj.selectreturns = dataMapMoObj.objtempdrop[dataMapMoObj.selectreturnstemp];
    block.querySelector('.sort-select-container .selectedtext').textContent = '';
    block.querySelector('.sort-select-container .selectedtext').textContent = dataMapMoObj.schmenmob;
    block.querySelector('.return-select-container .selectedtext').textContent = '';
    block.querySelector('.return-select-container .selectedtext').textContent = dataMapMoObj.selectreturns;

    const searInp = block.querySelector('.search-input input');
    searInp.value = '';
    const cancelBtn = block.querySelector('.cancel-search');
    cancelBtn.style.display = 'none';

    viewFunction(block);
  }
  block.closest('body').classList.remove('scroll-lock');
  if (window.innerWidth < 786) {
    block.scrollIntoView({
      behavior: 'smooth',
    });
  }
}

dataMapMoObj.parseFunction = (param, attrparam) => {
  if (attrparam === 'viewfunc') {
    searchFunctionality(param);
  }
};
export default function decorate(block) {
  const ultooltip = block.closest('.section');
  const ullisttoop = ultooltip.querySelector('.default-content-wrapper ul');
  // console.log(ullisttoop);
  Array.from(block.closest('.section').children).forEach((el, index) => {
    el.classList.add(`item${index + 1}`);
  });
  Array.from(block.children).forEach((el, index) => {
    el.classList.add(`block-item${index + 1}`);
    Array.from(el.children).forEach((elsub, indexsub) => {
      elsub.classList.add(`block-subitem${indexsub + 1}`);
      Array.from(elsub.children).forEach((finelsub, indexin) => {
        finelsub.classList.add(`block-subitem-finelsub${indexin + 1}`);
      });
    });
  });
  Array.from(block.closest('.section').querySelector('.item2').children).forEach((el) => {
    el.classList.add('list-header-text');
  });
  block.closest('.section')
    .querySelector('.item2 ul').remove();
  Array.from(block.querySelector('.block-item3 .block-subitem-finelsub4').children).forEach((el) => {
    el.classList.add('viewlist-btn');
  });
  Array.from(
    block.querySelector('.block-item3 .block-subitem-finelsub5').children,
  ).forEach((el) => {
    el.classList.add('viewlist-btn');
  });

  dataMapMoObj.selectreturns = '';
  const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
    if (!el.fundsTaggingSection || !el.planList) {
      return false;
    }
    return el;
  });
  dataMapMoObj.data = dataFilterfun(tempDfilt);
  dataMapMoObj.datatooltip = {};
  Array.from(ullisttoop.children).forEach((tooltip) => {
    const datakey = tooltip.textContent.trim().split(':-');
    const datkey = datakey[0];
    const datval = datakey[1];
    if (datkey === 'Active') {
      dataMapMoObj.datatooltip.active = datval;
    } else if (datkey === 'Commodity') {
      dataMapMoObj.datatooltip.commodity = datval;
    } else if (datkey === 'Debt & Liquid') {
      dataMapMoObj.datatooltip['debt-&-liquid'] = datval;
    } else if (datkey === 'ETFs') {
      dataMapMoObj.datatooltip.etf = datval;
    } else if (datkey === 'Factor') {
      dataMapMoObj.datatooltip['indian-equity'] = datval;
    } else if (datkey === 'Hybrid & Balanced') {
      dataMapMoObj.datatooltip['hybrid-&-balanced'] = datval;
    } else if (datkey === 'Index Funds') {
      dataMapMoObj.datatooltip['index-funds'] = datval;
    } else if (datkey === 'Indian Equity') {
      dataMapMoObj.datatooltip['indian-equity'] = datval;
    } else if (datkey === 'International Equity') {
      dataMapMoObj.datatooltip['international-equity'] = datval;
    } else if (datkey === 'Mid Cap') {
      dataMapMoObj.datatooltip['indian-equity'] = datval;
    } else if (datkey === 'Multi Asset') {
      dataMapMoObj.datatooltip['multi-asset'] = datval;
    } else if (datkey === 'Multi Cap Fund') {
      dataMapMoObj.datatooltip['indian-equity'] = datval;
    } else if (datkey === 'Sector') {
      dataMapMoObj.datatooltip['indian-equity'] = datval;
    } else if (datkey === 'Small Cap') {
      dataMapMoObj.datatooltip['indian-equity'] = datval;
    }
  });
  let checkboxSel = '';
  let funddata;
  if (localStorage.getItem('viewmark')) {
    const fundlast = dataMapMoObj.data.fundCategory;
    const indiansub = fundlast[fundlast.length - 1];
    checkboxSel = localStorage.getItem('viewmark');
    dataMapMoObj.data.fundCategory.forEach((el) => {
      if (el[checkboxSel]) {
        funddata = el[checkboxSel];
      }
    });
    dataMapMoObj.data.fundType.forEach((el) => {
      if (el[checkboxSel]) {
        funddata = el[checkboxSel];
      }
    });
    indiansub.indianEquitySub.forEach((el) => {
      if (el[checkboxSel]) {
        funddata = el[checkboxSel];
      }
    });
    if (funddata !== undefined) {
      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
        if (!el.fundsTaggingSection || !el.planList) {
          return false;
        }
        return el;
      });
      dataMapMoObj.funddata = tempDfilt.filter((el) => funddata.includes(el.schcode));
    }
  }
  if (funddata === undefined) {
    const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
      if (!el.fundsTaggingSection || !el.planList) {
        return false;
      }
      return el;
    });
    dataMapMoObj.funddata = tempDfilt.slice(0, 10); // .slice(0, 11);;
  }
  const subfourer = block.querySelector('.block-subitem2');
  const subun = subfourer.querySelector('.block-subitem-finelsub3 span');
  const subfour = subun.cloneNode(true);
  const divfund = div(
    {
      class: 'blockwrapper',
    },
    div(
      {
        class: 'upper-container',
      },
      div(
        {
          class: 'fundcontainer',
        },
        block.querySelector('.block-subitem1'),
        div(
          {
            class: 'search-trending-wrapper',
          },
          div(
            {
              class: 'search-input',
            },
            label(
              {
                for: 'search-field', // Use a valid ID
                class: 'search-label',
              },
              'Search here',
            ),
            input({
              class: 'search',
              id: 'search-field',
              placeholder: block
                .querySelector('.block-subitem2 .block-subitem-finelsub1')
                .textContent.trim(),
            }),
            div(
              {
                class: 'cancel-search',
              },
              img({
                class: 'cancel-btn',
                src: '/icons/input-cancel.svg',
                alt: 'cancel button',
              }),
            ),
            ul(
              {
                class: 'list-search',
              },
              ...dataMapMoObj.funddata.map((el) => li(
                {
                  class: 'list-fund-name',
                  schcode: el.schcode,
                },
                el.schemeName,
              )),
            ),
          ),
          div(
            {
              class: 'watchlist',
            },
            div(
              {
                class: 'staricon',
              },
              block.querySelector(
                '.block-subitem2 .block-subitem-finelsub2 span',
              ),
              // block.querySelector(
              //   '.block-subitem2 .block-subitem-finelsub3 span',
              // ),
            ),
            div(
              {
                class: 'watchlisttext',
              },
              span(
                block
                  .querySelector('.block-subitem2 .block-subitem-finelsub2')
                  .textContent.trim(),
              ),
            ),
          ),
          div(
            {
              class: 'trending-container',
            },
            div(
              {
                class: 'trendinglabel',
              },
              p(
                subfour,
              ),
              span(
                {
                  class: 'trending-text',
                },
                block
                  .querySelector('.block-subitem2 .block-subitem-finelsub4')
                  .textContent.trim(),
              ),
            ),
            div(
              {
                class: 'trendingmostlist',
              },
              block.querySelector('.block-subitem2 .block-subitem-finelsub5'),
            ),
          ),
        ),
      ),
    ),
    div(
      {
        class: 'filter-cards',
      },
      div(
        {
          class: 'left-container',
        },
        div(
          {
            class: 'fundcategory-container',
          },
          div(
            {
              class: 'filter-sort-container',
            },
            div(
              {
                class: 'filter-wrapper',
                onclick: () => {
                  block
                    .querySelector('.filter-overlay')
                    .classList.add('active');
                  if (window.innerWidth < 768) {
                    block.closest('body').classList.add('scroll-lock');
                  }
                  if (
                    Array.from(
                      block.querySelector('.sort-overlay').classList,
                    ).includes('active')
                  ) {
                    block
                      .querySelector('.sort-overlay')
                      .classList.remove('active');
                  }
                },
              },
              div(
                {
                  class: 'filter-text',
                },
                block.querySelector(
                  '.block-item2 .block-subitem-finelsub1 span',
                ),
                p(
                  block
                    .querySelector('.block-item2 .block-subitem-finelsub2')
                    .textContent.trim(),
                ),
              ),
              button(
                {
                  class: 'clearall-btn',
                  onclick: () => {
                    block.closest('body').classList.remove('scroll-lock');
                    Array.from(
                      block.querySelector('.filter-list-wrapper').children,
                    ).forEach((el) => {
                      if (
                        el
                          .closest('.checkbox-label-container')
                          .querySelector('.innerindianequity')
                      ) {
                        el.closest('.checkbox-label-container')
                          .querySelectorAll('.innerindianequity input')
                          .forEach((elemsub) => {
                            elemsub.checked = false;
                          });
                      }
                      el.querySelector('input').checked = false;
                    });
                    const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                      if (!el.fundsTaggingSection || !el.planList) {
                        return false;
                      }
                      return el;
                    });
                    dataMapMoObj.funddata = tempDfilt.slice(0, 11);
                    viewFunction(block);
                    block.querySelector('.applied-filter-list').innerHTML = '';
                    block.querySelector('.applied-filter-wrap').classList.remove('filter-active');
                  },
                },
                'Clear All',
              ),
            ),
            div(
              {
                class: 'sort-wrapper',
                onclick: () => {
                  block.querySelector('.sort-overlay').classList.add('active');
                  block.closest('body').classList.add('scroll-lock');
                  if (
                    Array.from(
                      block.querySelector('.filter-overlay').classList,
                    ).includes('active')
                  ) {
                    block
                      .querySelector('.filter-overlay')
                      .classList.remove('active');
                  }
                },
              },
              block.querySelector('.block-item2 .block-subitem-finelsub3 span'),
              p(
                block
                  .querySelector('.block-item2 .block-subitem-finelsub4')
                  .textContent.trim(),
              ),
            ),
          ),
          div(
            {
              class: 'filter-overlay',
            },
            div(
              {
                class: 'filter-container',
              },
              div(
                {
                  class: 'clearall-wrapper',
                },
                span('Filters'),
                button(
                  {
                    class: 'clearall-btn',
                    onclick: () => {
                      Array.from(
                        block.querySelector('.filter-list-wrapper').children,
                      ).forEach((el) => {
                        if (
                          el
                            .closest('.checkbox-label-container')
                            .querySelector('.innerindianequity')
                        ) {
                          el.closest('.checkbox-label-container')
                            .querySelectorAll('.innerindianequity input')
                            .forEach((elemsub) => {
                              elemsub.checked = false;
                            });
                        }
                        el.querySelector('input').checked = false;
                      });
                      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                        if (!el.fundsTaggingSection || !el.planList) {
                          return false;
                        }
                        return el;
                      });
                      dataMapMoObj.funddata = tempDfilt.slice(0, 11);
                    },
                  },
                  'Clear All',
                ),
              ),
              div(
                {
                  class: 'filter-list-wrapper',
                },
                ...dataMapMoObj.data.fundCategory.map((element, index) => {
                  const indexeq = index === 0 ? 'indaneqsub' : '';
                  if (capitalizeEachWord(Object.keys(element)[0].replaceAll('-', ' ')) === 'Indian Equity') {
                    dataMapMoObj[`${index}ArrayDoc`] = div(
                      {
                        class: 'indian-equity-container',
                      },
                      ...dataMapMoObj.data.fundCategory[
                        dataMapMoObj.data.fundCategory.length - 1
                      ].indianEquitySub.map((elme, ind) => {
                        const sublabel = Object.keys(elme)[0].replaceAll('-', ' ');
                        return div(
                          {
                            class: 'checkbox-label-container',
                          },
                          input({
                            class: 'category-direct',
                            type: 'checkbox',
                            id: `ind${ind + 1}`,
                            dataattr: elme[Object.keys(elme)].join('-'),
                            datakey: Object.keys(elme)[0],
                            onclick: () => {
                              if (window.innerWidth < 786) {
                                const temp = [];
                                const dup = [];
                                Array.from(block.querySelectorAll('.checkbox-label-container input')).forEach((el) => {
                                  if (el.checked) {
                                    const tempel = el.getAttribute('dataattr').split('-');
                                    temp.push(...tempel);
                                  }
                                });
                                if (temp.length > 0) {
                                  temp.forEach((scel) => {
                                    if (!dup.includes(scel)) {
                                      dup.push(scel);
                                    }
                                  });
                                }
                                // console.log(dup);
                                const tempdata = dataMapMoObj.getlisting.cfDataObjs
                                  .filter((el) => (dup.includes(el.schcode) ? el : ''));
                                dataMapMoObj.tempMobReturn = [];
                                dataMapMoObj.tempMobReturn = tempdata;
                              } else {
                                checkfilter(block);
                              }
                            },
                          }),
                          label(
                            {
                              for: `ind${ind + 1}`,
                            },
                            capitalizeEachWord(sublabel),
                            span({
                              class: 'fund-length',
                            }, `(${elme[Object.keys(elme)[0]].length})`),
                          ),
                        );
                      }),
                    );
                  }
                  const indetempcount = Object.keys(element)[0] === 'indian-equity' ? '43' : element[Object.keys(element)[0]].length;
                  return Object.keys(element)[0] !== 'indianEquitySub'
                    ? div(
                      {
                        class: `checkbox-label-container ${indexeq}`,
                      },
                      input({
                        class: 'category-direct',
                        type: 'checkbox',
                        id: `index${index + 1}`,
                        dataattr: element[Object.keys(element)[0]].join('-'),
                        datakey: Object.keys(element)[0],
                        onclick: (event) => {
                          // const fundScheme = event.target
                          //   .getAttribute('dataattr')
                          //   .split('-');
                          if (event.target.closest('.indaneqsub')) {
                            const el = event.target.closest('.indaneqsub');
                            if (el.querySelector('.innerindianequity')) {
                              el.querySelectorAll(
                                '.innerindianequity input',
                              ).forEach((elemsub) => {
                                elemsub.checked = el.querySelector('input').checked;
                              });
                            }
                          }
                          if (window.innerWidth < 786) {
                            const temp = [];
                            const dup = [];
                            Array.from(block.querySelectorAll('.checkbox-label-container input')).forEach((el) => {
                              if (el.checked) {
                                const tempel = el.getAttribute('dataattr').split('-');
                                temp.push(...tempel);
                              }
                            });
                            if (temp.length > 0) {
                              temp.forEach((scel) => {
                                if (!dup.includes(scel)) {
                                  dup.push(scel);
                                }
                              });
                            }
                            // console.log(dup);
                            const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                              if (!el.fundsTaggingSection || !el.planList) {
                                return false;
                              }
                              return el;
                            });
                            const tempdata = tempDfilt
                              .filter((el) => (dup.includes(el.schcode) ? el : ''));
                            dataMapMoObj.tempMobReturn = [];
                            dataMapMoObj.tempMobReturn = tempdata;
                          } else {
                            checkfilter(block);
                          }
                        },
                      }),
                      div(
                        {
                          class: 'label-tooltip-wrap',
                        },
                        label(
                          {
                            for: `index${index + 1}`,
                          },
                          capitalizeEachWord(
                            Object.keys(element)[0].replaceAll('-', ' '),
                          ),
                          span(
                            {
                              class: 'fund-length',
                            },
                            `(${indetempcount})`,
                          ),
                        ),
                        div(
                          {
                            class: 'tooltip-wrap',
                          },
                          img({
                            src: '/icons/filter-info.svg',
                            alt: 'Filter Info Icon',
                          }),
                          p(
                            {
                              class: 'tooltip-text',
                            },
                            dataMapMoObj.datatooltip[Object.keys(element)[0]],
                          ),
                        ),
                      ),
                      capitalizeEachWord(
                        Object.keys(element)[0].replaceAll('-', ' '),
                      ) === 'Indian Equity'
                        ? div(
                          {
                            class: 'innerindianequity',
                          },
                          dataMapMoObj[`${index}ArrayDoc`],
                        )
                        : '',
                    )
                    : '';
                }),
                ...dataMapMoObj.data.fundType.map((element, index) => div(
                  {
                    class: 'checkbox-label-container',
                  },
                  input({
                    class: 'category-direct',
                    type: 'checkbox',
                    id: `fundtype${index + 1}`,
                    dataattr: element[Object.keys(element)[0]].join('-'),
                    datakey: Object.keys(element)[0],
                    onclick: () => {
                      // checkfilter(block);
                      if (window.innerWidth < 786) {
                        const temp = [];
                        const dup = [];
                        Array.from(block.querySelectorAll('.checkbox-label-container input')).forEach((el) => {
                          if (el.checked) {
                            const tempel = el.getAttribute('dataattr').split('-');
                            temp.push(...tempel);
                          }
                        });
                        if (temp.length > 0) {
                          temp.forEach((scel) => {
                            if (!dup.includes(scel)) {
                              dup.push(scel);
                            }
                          });
                        }
                        // console.log(dup);
                        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                          if (!el.fundsTaggingSection || !el.planList) {
                            return false;
                          }
                          return el;
                        });
                        const tempdata = tempDfilt
                          .filter((el) => (dup.includes(el.schcode) ? el : ''));
                        dataMapMoObj.tempMobReturn = [];
                        dataMapMoObj.tempMobReturn = tempdata;
                      } else {
                        checkfilter(block);
                      }
                      // viewFunction(block);
                    },
                  }),
                  div(
                    {
                      class: 'label-tooltip-wrap',
                    },
                    label(
                      {
                        for: `fundtype${index + 1}`,
                      },
                      capitalizeEachWord(
                        Object.keys(element)[0].replaceAll('-', ' '),
                      ),
                      span(
                        `(${element[Object.keys(element)[0]].length})`,
                      ),
                    ),
                    div(
                      {
                        class: 'tooltip-wrap',
                      },
                      img({
                        src: '/icons/filter-info.svg',
                        alt: 'Filter Info Icon',
                      }),
                      p(
                        {
                          class: 'tooltip-text',
                        },
                        dataMapMoObj.datatooltip[Object.keys(element)[0]],
                      ),
                    ),
                  ),
                )),
              ),
              div(
                {
                  class: 'apply-wrapper',
                },
                button(
                  {
                    class: 'close-btn',
                    onclick: () => {
                      block
                        .querySelector('.filter-overlay')
                        .classList.remove('active');
                      block.closest('body').classList.remove('scroll-lock');
                      block
                        .querySelector('.sort-overlay')
                        .classList.remove('active');
                    },
                  },
                  'Close',
                ),
                button(
                  {
                    class: 'apply-btn',
                    onclick: () => {
                      applyFunction(block);
                    },
                  },
                  'Apply',
                ),
              ),
            ),
          ),
          div(
            {
              class: 'sort-overlay',
            },
            div(
              {
                class: 'sort-container',
              },
              div(
                {
                  class: 'sort-label',
                },
                // span(label(
                //   block.querySelector(".block-item3 .block-subitem-finelsub1").textContent.trim()
                // ))
                span(
                  block
                    .querySelector('.block-item3 .block-subitem-finelsub3')
                    .textContent.trim(),
                ),
              ),
              div(
                {
                  class: 'arrange-returns',
                },
                div(
                  {
                    class: 'arrange-container',
                  },
                  span('Arrange by'),
                  div(
                    {
                      class: 'radio-label-container',
                    },
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'popular',
                        name: 'arrange',
                      }),
                      label(
                        {
                          for: 'popular',
                        },
                        'Popular',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'lastnav',
                        name: 'arrange',
                      }),
                      label(
                        {
                          for: 'lastnav',
                        },
                        'Latest NAV',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'lastnavone',
                        name: 'arrange',
                      }),
                      label(
                        {
                          for: 'lastnavone',
                        },
                        'Latest by 1 day',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'oldnew',
                        name: 'arrange',
                      }),
                      label(
                        {
                          for: 'oldnew',
                        },
                        'Oldest to Newest',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'newold',
                        name: 'arrange',
                      }),
                      label(
                        {
                          for: 'newold',
                        },
                        'Newest to Oldest',
                      ),
                    ),
                  ),
                ),
                div(
                  {
                    class: 'return-container',
                  },
                  span('Returns Period'),
                  div(
                    {
                      class: 'radio-label-container',
                    },
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'sinceinp',
                        name: 'returns',
                        dataattr: dataMapMoObj.data.sort[0].inception_Ret.join('-'),
                      }),
                      label(
                        {
                          for: 'sinceinp',
                        },
                        'Since Inception',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'oneyear',
                        name: 'returns',
                        dataattr: dataMapMoObj.data.sort[0].oneYear_Ret.join('-'),
                      }),
                      label(
                        {
                          for: 'oneyear',
                        },
                        '1 year',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'threeyear',
                        name: 'returns',
                        dataattr: dataMapMoObj.data.sort[0].threeYear_Ret.join('-'),
                      }),
                      label(
                        {
                          for: 'threeyear',
                        },
                        '3 years',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'fiveyear',
                        name: 'returns',
                        dataattr: dataMapMoObj.data.sort[0].fiveYear_Ret.join('-'),
                      }),
                      label(
                        {
                          for: 'fiveyear',
                        },
                        '5 years',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'tenyear1',
                        name: 'returns',
                        dataattr: dataMapMoObj.data.sort[0].sevenYear_Ret.join('-'),
                      }),
                      label(
                        {
                          for: 'tenyear1',
                        },
                        '7 years',
                      ),
                    ),
                    div(
                      {
                        class: 'radio-label',
                      },
                      input({
                        type: 'radio',
                        id: 'tenyear2',
                        name: 'returns',
                        dataattr: dataMapMoObj.data.sort[0].tenYear_Ret.join('-'),
                      }),
                      label(
                        {
                          for: 'tenyear2',
                        },
                        '10 years',
                      ),
                    ),
                  ),
                ),
              ),
              div(
                {
                  class: 'close-apply-btn',
                },
                button(
                  {
                    class: 'closebtn',
                    onclick: () => {
                      block
                        .querySelector('.filter-overlay')
                        .classList.remove('active');
                      block.closest('body').classList.remove('scroll-lock');
                      block
                        .querySelector('.sort-overlay')
                        .classList.remove('active');
                    },
                  },
                  'Close',
                ),
                button(
                  {
                    class: 'applybtn',
                    onclick: () => {
                      applyFunction(block);
                    },
                  },
                  'Apply',
                ),
              ),
            ),
          ),
        ),
      ),
      div(
        {
          class: 'right-container',
        },
        div(
          {
            class: 'sort-pop-container',
          },
          div(
            {
              class: 'sort-popular',
            },
            div(
              {
                class: 'sort-container',
              },
              span(
                {
                  class: 'sort-pop-label',
                },
                block
                  .querySelector('.block-item3 .block-subitem-finelsub1')
                  .textContent.trim(),
              ),
              div(
                {
                  class: 'sort-select-container',
                },
                p(
                  {
                    class: 'selectedtext',
                    onclick: (event) => {
                      if (Array.from(event.target.nextElementSibling.classList).includes('dropdown-active')) {
                        event.target.nextElementSibling.classList.remove('dropdown-active');
                      } else {
                        event.target.nextElementSibling.classList.add('dropdown-active');
                      }
                    },
                  },
                  'Popular',
                ),
                ul(
                  {
                    class: 'dropdown-list',
                    onclick: (event) => {
                      event.target
                        .closest('.dropdown-list')
                        .classList.remove('dropdown-active');
                      const name = event.target.textContent.trim();
                      event.target
                        .closest('.sort-select-container')
                        .querySelector('p').innerText = '';
                      event.target
                        .closest('.sort-select-container')
                        .querySelector('p').innerText = name;
                      if (name === 'Popular') {
                        dataMapMoObj.funddata = '';
                        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                          if (!el.fundsTaggingSection || !el.planList) {
                            return false;
                          }
                          return el;
                        });
                        dataMapMoObj.funddata = tempDfilt.slice(0, 10);
                      }
                      if (event.target.textContent.trim() === 'Oldest to Newest') {
                        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                          if (!el.fundsTaggingSection || !el.planList) {
                            return false;
                          }
                          return el;
                        });
                        const tempData = JSON.parse(JSON.stringify(tempDfilt));
                        const tempa = tempData.sort(
                          (a, b) => new Date(a.dateOfAllotment) - new Date(b.dateOfAllotment),
                        );
                        dataMapMoObj.funddata = '';
                        dataMapMoObj.funddata = tempa;
                      }
                      if (event.target.textContent.trim() === 'Newest to Oldest') {
                        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                          if (!el.fundsTaggingSection || !el.planList) {
                            return false;
                          }
                          return el;
                        });
                        const tempData = JSON.parse(JSON.stringify(tempDfilt));
                        const tempa = tempData.sort(
                          (a, b) => new Date(b.dateOfAllotment) - new Date(a.dateOfAllotment),
                        );
                        dataMapMoObj.funddata = '';
                        dataMapMoObj.funddata = tempa;
                      }
                      const searInp = block.querySelector('.search-input input');
                      searInp.value = '';
                      const cancelBtn = block.querySelector('.cancel-search');
                      cancelBtn.style.display = 'none';
                      const flitwrap = block.querySelector('.applied-filter-wrap');
                      if (Array.from(flitwrap.classList).includes('filter-active')) {
                        flitwrap.classList.remove('filter-active');
                      }
                      Array.from(block.querySelector('.filter-list-wrapper').children).forEach((el) => {
                        if (el.closest('.checkbox-label-container').querySelector('.innerindianequity')) {
                          el.closest('.checkbox-label-container').querySelectorAll('.innerindianequity input').forEach((elemsub) => {
                            if (elemsub.checked) {
                              elemsub.checked = false;
                            }
                          });
                        }
                        if (el.querySelector('input').checked) {
                          // const moplabel = el.querySelector('input').nextElementSibling;
                          if (el.querySelector('input').getAttribute('id') !== 'index1') {
                            if (el.querySelector('input').checked) {
                              el.querySelector('input').checked = false;
                            }
                          }
                        }
                      });
                      block.querySelectorAll('.arrange-container input').forEach((el) => {
                        if (el.nextElementSibling.textContent === name) {
                          el.click();
                        }
                      });
                      viewFunction(block);
                      // planListEvent(event,block)
                    },
                  },
                  li('Popular'),
                  li('Latest NAV'),
                  li('Lastest by 1 day'),
                  li('Oldest to Newest'),
                  li('Newest to Oldest'),
                ),
              ),
            ),
            div(
              {
                class: 'popular-container',
              },
              span(
                {
                  class: 'sort-pop-label',
                },
                block
                  .querySelector('.block-item3 .block-subitem-finelsub2')
                  .textContent.trim(),
              ),
              div(
                {
                  class: 'return-select-container',
                },
                p(
                  {
                    class: 'selectedtext',
                    onclick: (event) => {
                      if (Array.from(event.target.nextElementSibling.classList).includes('dropdown-active')) {
                        event.target.nextElementSibling.classList.remove('dropdown-active');
                      } else {
                        event.target.nextElementSibling.classList.add('dropdown-active');
                      }
                    },
                  },
                  '3 years',
                ),
                ul(
                  {
                    class: 'dropdown-list',
                    onclick: (event) => {
                      event.target
                        .closest('.dropdown-list')
                        .classList.remove('dropdown-active');
                      const name = event.target.textContent.trim();
                      event.target
                        .closest('.return-select-container')
                        .querySelector('p').innerText = '';
                      event.target
                        .closest('.return-select-container')
                        .querySelector('p').innerText = name;
                      // const dataattr = event.target
                      //   .getAttribute('dataattr')
                      //   .split('-');
                      const sorttextcont = block.querySelector('.sort-select-container .selectedtext');
                      const sorttext = sorttextcont.textContent.trim();
                      if (sorttext === 'Popular') {
                        dataMapMoObj.funddata = '';
                        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                          if (!el.fundsTaggingSection || !el.planList) {
                            return false;
                          }
                          return el;
                        });
                        dataMapMoObj.funddata = tempDfilt.slice(0, 10);
                      }
                      if (sorttext === 'Oldest to Newest') {
                        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                          if (!el.fundsTaggingSection || !el.planList) {
                            return false;
                          }
                          return el;
                        });
                        const tempData = JSON.parse(JSON.stringify(tempDfilt));
                        const tempa = tempData.sort(
                          (a, b) => new Date(a.dateOfAllotment) - new Date(b.dateOfAllotment),
                        );
                        dataMapMoObj.funddata = '';
                        dataMapMoObj.funddata = tempa;
                      }
                      if (sorttext === 'Newest to Oldest') {
                        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                          if (!el.fundsTaggingSection || !el.planList) {
                            return false;
                          }
                          return el;
                        });
                        const tempData = JSON.parse(JSON.stringify(tempDfilt));
                        const tempa = tempData.sort(
                          (a, b) => new Date(b.dateOfAllotment) - new Date(a.dateOfAllotment),
                        );
                        dataMapMoObj.funddata = '';
                        dataMapMoObj.funddata = tempa;
                      }
                      dataMapMoObj.deskrightdrp = name;
                      dataMapMoObj.selectreturns = dataMapMoObj.toTitleCase(name);
                      const searInp = block.querySelector('.search-input input');
                      searInp.value = '';
                      const cancelBtn = block.querySelector('.cancel-search');
                      cancelBtn.style.display = 'none';
                      const flitwrap = block.querySelector('.applied-filter-wrap');
                      if (Array.from(flitwrap.classList).includes('filter-active')) {
                        flitwrap.classList.remove('filter-active');
                      }
                      Array.from(block.querySelector('.filter-list-wrapper').children).forEach((el) => {
                        if (el.closest('.checkbox-label-container').querySelector('.innerindianequity')) {
                          el.closest('.checkbox-label-container').querySelectorAll('.innerindianequity input').forEach((elemsub) => {
                            if (elemsub.checked) {
                              elemsub.checked = false;
                            }
                          });
                        }
                        if (el.querySelector('input').checked) {
                          // const moplabel = el.querySelector('input').nextElementSibling;
                          if (el.querySelector('input').getAttribute('id') !== 'index1') {
                            if (el.querySelector('input').checked) {
                              el.querySelector('input').checked = false;
                            }
                          }
                        }
                      });
                      block.querySelectorAll('.return-container input').forEach((elre) => {
                        const tempret = elre.nextElementSibling.textContent;
                        if (tempret.toLowerCase() === name.toLowerCase()) {
                          elre.click();
                        }
                      });
                      viewFunction(block);
                    },
                  },
                  li(
                    {
                      dataattr: dataMapMoObj.data.sort[0].inception_Ret.join('-'),
                    },
                    'Since Inception',
                  ),
                  li(
                    {
                      dataattr: dataMapMoObj.data.sort[0].oneYear_Ret.join('-'),
                    },
                    '1 year',
                  ),
                  li(
                    {
                      dataattr: dataMapMoObj.data.sort[0].threeYear_Ret.join('-'),
                    },
                    '3 years',
                  ),
                  li(
                    {
                      dataattr: dataMapMoObj.data.sort[0].fiveYear_Ret.join('-'),
                    },
                    '5 years',
                  ),
                  li(
                    {
                      dataattr: dataMapMoObj.data.sort[0].sevenYear_Ret.join('-'),
                    },
                    '7 years',
                  ),
                  li(
                    {
                      dataattr: dataMapMoObj.data.sort[0].tenYear_Ret.join('-'),
                    },
                    '10 years',
                  ),
                ),
              ),
            ),
          ),
          div(
            {
              class: 'group-view-container',
            },
            div(
              {
                class: 'view-container',
              },
              div(
                {
                  class: 'squareby-container grid-view-active',
                  onclick: (event) => {
                    event.currentTarget.classList.add('grid-view-active');
                    event.currentTarget
                      .closest('.view-container')
                      .querySelector('.listby-container')
                      .classList.remove('list-view-active');
                    event.currentTarget
                      .closest('.right-container')
                      .querySelector('.list-view-header').style.display = 'none';

                    if (block.querySelector('.search-input .search').value !== '') {
                      const searchval = block.querySelector('.search-input .search').value;
                      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                        if (!el.fundsTaggingSection || !el.planList) {
                          return false;
                        }
                        return el;
                      });
                      dataMapMoObj.funddata = tempDfilt
                        .filter((ellim) => ellim.schemeName === searchval);
                    }
                    viewFunction(block);
                  },
                },
                block.querySelector('.block-item3 .block-subitem-finelsub4'),
              ),
              div(
                {
                  class: 'listby-container',
                  onclick: (event) => {
                    event.currentTarget.classList.add('list-view-active');
                    event.currentTarget
                      .closest('.view-container')
                      .querySelector('.squareby-container')
                      .classList.remove('grid-view-active');
                    event.currentTarget
                      .closest('.right-container')
                      .querySelector('.list-view-header').style.display = 'block';
                    if (block.querySelector('.search-input .search').value !== '') {
                      const searchval = block.querySelector('.search-input .search').value;
                      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
                        if (!el.fundsTaggingSection || !el.planList) {
                          return false;
                        }
                        return el;
                      });
                      dataMapMoObj.funddata = tempDfilt
                        .filter((ellim) => ellim.schemeName === searchval);
                    }
                    viewFunction(block);
                  },
                },
                block.querySelector('.block-item3 .block-subitem-finelsub5'),
              ),
            ),
            div(
              {
                class: 'togglebtn',
              },
              p({
                class: 'toggle-text',
              }, 'Direct'),
              div(
                {
                  class: 'fund-toggle-wrap',
                },
                input({
                  type: 'checkbox',
                  id: 'toggle',
                  'aria-label': 'Switch between Direct and Regular mode',
                  onclick: () => {
                    // event.target.checked
                    // viewFunction(block);
                    checkfilter(block);
                  },
                }),
                label(
                  {
                    class: 'fund-toggle',
                    for: 'toggle',
                  },
                  // Add spans for the visible text inside the label
                  span({ class: 'label-text direct' }, 'Direct'),
                  span({ class: 'label-text regular' }, 'Regular'),
                ),
              ),
              p({
                class: 'toggle-text',
              }, 'Regular'),
            ),
            div(
              {
                class: 'compare-btn',
              },
              button('Compare'),
            ),
          ),
        ),
        div(
          {
            class: 'applied-filter-wrap',
          },
          ul(
            {
              class: 'applied-filter-list',
            },
            li(
              {
                class: 'applied-filter-name',
              },
              span('Large Cap'),
              img({
                class: 'filter-cross-icon',
                src: '/icons/cross-icon.svg',
                alt: 'cross icon',
              }),
            ),
            li(
              {
                class: 'applied-filter-name',
              },
              span('Tax saver (ELSS)'),
              img({
                src: '/icons/cross-icon.svg',
                alt: 'cross icon',
              }),
            ),
            li(
              {
                class: 'applied-filter-name',
              },
              span('Hybrid & Balanced'),
              img({
                src: '/icons/cross-icon.svg',
                alt: 'cross icon',
              }),
            ),
          ),
        ),
        div(
          {
            class: 'cards-container',
          },
          ...dataMapMoObj.funddata.map((el) => fundcardblock(el)),
        ),
        div(
          {
            class: 'list-view-header',
            style: 'display:none',
          },
          div(
            {
              class: 'list-header',
            },
            block.closest('.section').querySelector('.item2'),
          ),
          div({
            class: 'list-container',
          }),
        ),
      ),
    ),
  );
  block.innerHTML = '';
  block.append(divfund);
  block.querySelector('.applied-filter-list').innerHTML = '';
  [...block.querySelectorAll('.sort-container .dropdown-list')].forEach(
    (el) => {
      el.addEventListener('click', (event) => {
        if (event.target.textContent.trim() === 'Oldest to Newest') {
          const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
            if (!el.fundsTaggingSection || !el.planList) {
              return false;
            }
            return el;
          });
          const tempdata = JSON.parse(JSON.stringify(tempDfilt));
          const tempa = tempdata.sort(
            (a, b) => new Date(a.dateOfAllotment) - new Date(b.dateOfAllotment),
          );
          dataMapMoObj.funddata = tempa;
        }
        if (event.target.textContent.trim() === 'Newest to Oldest') {
          const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
            if (!el.fundsTaggingSection || !el.planList) {
              return false;
            }
            return el;
          });
          const tempdata = JSON.parse(JSON.stringify(tempDfilt));
          const tempa = tempdata.sort(
            (a, b) => new Date(b.dateOfAllotment) - new Date(a.dateOfAllotment),
          );
          dataMapMoObj.funddata = tempa;
        }
        viewFunction(block);
      });
    },
  );
  // Mobile Sorting
  [...block.querySelectorAll('.arrange-container .radio-label')].forEach((mobel) => {
    mobel.addEventListener('click', (event) => {
      const sortText = event.target
        .closest('.radio-label')
        .querySelector('label').textContent;
      if (sortText.trim() === 'Oldest to Newest') {
        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
          if (!el.fundsTaggingSection || !el.planList) {
            return false;
          }
          return el;
        });
        const tempdata = JSON.parse(JSON.stringify(tempDfilt));
        const tempa = tempdata.sort(
          (a, b) => new Date(a.dateOfAllotment) - new Date(b.dateOfAllotment),
        );
        dataMapMoObj.tempMobReturn = tempa;
      }
      if (sortText.trim() === 'Newest to Oldest') {
        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
          if (!el.fundsTaggingSection || !el.planList) {
            return false;
          }
          return el;
        });
        const tempdata = JSON.parse(JSON.stringify(tempDfilt));
        const tempa = tempdata.sort(
          (a, b) => new Date(b.dateOfAllotment) - new Date(a.dateOfAllotment),
        );
        dataMapMoObj.tempMobReturn = tempa;
      }
      if (sortText.trim() === 'Popular') {
        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
          if (!el.fundsTaggingSection || !el.planList) {
            return false;
          }
          return el;
        });
        dataMapMoObj.tempMobReturn = tempDfilt.slice(0, 10);
      }
      dataMapMoObj.schmenmob = sortText;
    });
  });

  // added wrapper
  const divmop = div(
    {
      class: 'indanequity-wrapper',
    },
    block.querySelector('.indaneqsub #index1'),
    div(
      {
        class: 'label-tooltip-wrap',
      },
      block.querySelector(".indaneqsub [for='index1']"),
      div(
        {
          class: 'tooltip-wrap',
        },
        img({
          class: 'filter-info-icon',
          src: '/icons/filter-info.svg',
          alt: 'Filter Info Icon',
        }),
        p(
          {
            class: 'tooltip-text',
          },
          'Shares of companies listed on Indian stock exchanges, representing ownership in businesses operating in India.',
        ),
      ),
    ),
  );
  const divinner = block.querySelector('.indaneqsub .innerindianequity');
  block.querySelector('.indaneqsub').innerHTML = '';
  block.querySelector('.indaneqsub').append(divmop, divinner);

  searchFunctionality(block);
  Array.from(block.querySelector('.return-container .radio-label-container').children).forEach((el) => {
    el.querySelector('input').addEventListener('click', (event) => {
      const dataattr = event.target.getAttribute('dataattr').split('-');
      const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
        if (!el.fundsTaggingSection) {
          return false;
        }
        return el;
      });
      const tempdata = tempDfilt.filter((elem) => dataattr.includes(elem.schcode));

      dataMapMoObj.tempMobReturn = [];
      dataMapMoObj.tempMobReturn = tempdata;
      dataMapMoObj.selectreturnstemp = event.target.nextSibling.textContent;
      // viewFunction(block);
    });
  });
  block.querySelectorAll('.arrange-container input')[0].click();
  block.querySelectorAll('.return-container input')[2].click();
  Array.from(block.querySelectorAll('.filter-list-wrapper input')).forEach((el) => {
    if (el.getAttribute('datakey') !== null && checkboxSel === el.getAttribute('datakey')) {
      if (checkboxSel === 'indian-equity') {
        el.checked = true;
        block.querySelectorAll('.indian-equity-container input').forEach((inner) => {
          inner.checked = true;
        });
      } else {
        el.checked = true;
      }
    }
  });

  document.addEventListener('click', (event) => {
    try {
      if (!block.querySelector('.sort-select-container').contains(event.target)) {
        const sortcont = block.querySelector('.sort-select-container .dropdown-list');
        sortcont.classList.remove('dropdown-active');
      }
      if (!block.querySelector('.return-select-container').contains(event.target)) {
        const sortcont = block.querySelector('.return-select-container .dropdown-list');
        sortcont.classList.remove('dropdown-active');
      }
      Array.from(block.querySelectorAll('.tooltip-wrap img')).forEach((elinner) => {
        if (!elinner.contains(event.target)) {
          elinner.nextElementSibling.style.display = 'none';
        }
      });
    } catch (error) {
      // console.log(error);
    }
  });

  if (window.innerWidth >= 1024) {
    document.addEventListener('mouseover', (event) => {
      try {
        Array.from(block.querySelectorAll('.tooltip-wrap img')).forEach((elinner) => {
          if (!elinner.contains(event.target)) {
            elinner.nextElementSibling.style.display = 'none';
          }
        });
      } catch (error) {
        // console.log(error);
      }
    });
  }
  Array.from(block.querySelectorAll('.tooltip-wrap img')).forEach((eltoo) => {
    if (window.innerWidth < 786) {
      eltoo.addEventListener('click', (event) => {
        if (event.target.nextElementSibling.style.display === 'block') {
          event.target.nextElementSibling.style.display = 'none';
          return false;
        }
        Array.from(block.querySelectorAll('.tooltip-wrap img')).forEach((elinner) => {
          elinner.nextElementSibling.style.display = 'none';
        });
        event.target.nextElementSibling.style.display = 'block';
        return true;
      });
    } else {
      eltoo.addEventListener('mouseover', (event) => {
        Array.from(block.querySelectorAll('.tooltip-wrap img')).forEach((elinner) => {
          elinner.nextElementSibling.style.display = 'none';
        });
        event.target.nextElementSibling.style.display = 'block';
      });
    }
  });
}
