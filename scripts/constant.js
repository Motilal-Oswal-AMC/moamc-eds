const dataMapMoObj = {
  ObjTemp: {
    inception_Ret: 'Since Inception',
    oneYear_Ret: '1 Year',
    threeYear_Ret: '3 Years',
    fiveYear_Ret: '5 Years',
    sevenYear_Ret: '7 Years',
    tenYear_Ret: '10 Years',
    'Since Inception': 'inception_Ret',
    '1 Year': 'oneYear_Ret',
    '3 Years': 'threeYear_Ret',
    '5 Years': 'fiveYear_Ret',
    '7 Years': 'sevenYear_Ret',
    '10 Years': 'tenYear_Ret',
  },
  ObjTempfdp: {
    inception_Ret: 'Since Inception',
    oneYear_Ret: 'Since 1 year',
    threeYear_Ret: 'Since 3 years',
    fiveYear_Ret: 'Since 5 years',
    sevenYear_Ret: 'Since 7 years',
    tenYear_Ret: 'Since 10 years',
    'Since Inception': 'inception_Ret',
    'Since 1 year': 'oneYear_Ret',
    'Since 3 years': 'threeYear_Ret',
    'Since 5 years': 'fiveYear_Ret',
    'Since 7 years': 'sevenYear_Ret',
    'Since 10 years': 'tenYear_Ret',
  },
  objtempdrop: {
    'Since Inception': 'Since Inception',
    '1 year': '1 Year',
    '3 years': '3 Years',
    '5 years': '5 Years',
    '7 years': '7 Years',
    '10 years': '10 Years',
  },
  icons: {
    'very-high': 'very-high-risk',
    'low-to-moderate': 'moderately-low-risk',
    high: 'high-risk',
    moderate: 'moderate-risk',
    low: 'low-risk',
  },
  iconsNfo: {
    'very-high': 'very-high-risk',
    'low-to-moderate': 'moderately-low-risk',
    high: 'high-risk',
    moderate: 'moderate-risk',
    low: 'low-risk',
  },
  selectreturns: '3 Years',
  schmenmob: 'Popular',
  schstar: [],
  tempMobReturn: [],
  selectreturnstemp: '',
  gropcodevalue: '',
  fundManagerDetails: '',
  selectviewFunds: '',
  deskrightdrp: '',
  CLASS_PREFIXES: ['block-item', 'block-subitem', 'block-subitem-finelsub'],
  addIndexed(parentElement, level = 0) {
    if (level >= this.CLASS_PREFIXES.length || !parentElement.children.length) {
      return;
    }
    const prefix = this.CLASS_PREFIXES[level];
    const { children } = parentElement; // Cache children for clarity.
    for (let i = 0; i < children.length; i += 1) {
      const child = children[i];
      const index = i + 1; // Class names are typically 1-based.
      child.classList.add('comlist');
      child.classList.add(`${prefix}${index}`);
      this.addIndexed(child, level + 1);
    }
  },
  addIndexedTwo(parentElement, level = 0) {
    if (level >= this.CLASS_PREFIXES.length || !parentElement.children.length) {
      return;
    }
    const prefix = this.CLASS_PREFIXES[level];
    const { children } = parentElement; // Cache children for clarity.
    for (let i = 0; i < children.length; i += 1) {
      let parClass = Array.from(children[0].parentElement.classList)[0].split('-').at(-2);
      const child = children[i];
      const index = i + 1; // Class names are typically 1-based.
      child.classList.add(`${prefix}${parClass}${index}`);
      parClass = '';
      this.addIndexedTwo(child, level + 1);
    }
  },
  altFunction: (element, altTextr) => {
    element.setAttribute('alt', altTextr);
  },
  myAPI: async (method, url, body = null) => {
    const options = { method };
    if (body) {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  },
  formatDate: (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    // Array of month abbreviations
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Function to get the correct ordinal suffix (st, nd, rd, th)
    // function getOrdinalSuffix(days) {
    //   if (days > 3 && days < 21) return 'th'; // for teens
    //   switch (days % 10) {
    //     case 1: return 'st';
    //     case 2: return 'nd';
    //     case 3: return 'rd';
    //     default: return 'th';
    //   }
    // }

    const dayWithSuffix = day; // + getOrdinalSuffix(day);

    // Combine parts into the final format
    return `${dayWithSuffix} ${month} ${year}`;
  },
  toTitleCase: (str) => {
    if (!str) {
      return '';
    }

    return str
      .toLowerCase()
      .split(' ')
      .map((word) => {
        if (word.length === 0) {
          return '';
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  },
  setupPagination: (blockdiv, items, itemsPerPage) => {
    const funcObj = {};
    const totalPages = Math.ceil(items.length / itemsPerPage);

    // 1. If 1 or 0 pages, do nothing
    if (totalPages <= 1) return;

    let currentPage = 1;

    const mainContainer = blockdiv.closest('.section');
    if (!mainContainer) return;

    // const defaultPagination = mainContainer.querySelector('.section > div');
    // if (defaultPagination) defaultPagination.remove();

    const paginationWrapper = document.createElement('div');
    paginationWrapper.className = 'pagination-wrapper';

    // --- CORE LOGIC: Adjustable Dots ---
    function generatePaginationList(current, total) {
    // A. IF 5 OR FEWER PAGES: Show everything, no dots
      if (total <= 5) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }

      // B. IF MORE THAN 5 PAGES: Adjustable Logic

      // 1. Near the START (Pages 1, 2, 3, 4)
      // Show: 1 2 3 4 5 ... [Last]
      if (current < 5) {
        return [1, 2, 3, 4, 5, '...', total];
      }

      // 2. Near the END (Within the last 4 pages)
      // Show: 1 ... 16 17 18 19 20
      if (current >= total - 3) {
        return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
      }

      // 3. Somewhere in the MIDDLE
      // Show: 1 ... [prev] [current] [next] ... [Last]
      return [1, '...', current - 1, current, current + 1, '...', total];
    }

    // --- CONTROLLER ---
    function goToPage(page) {
      currentPage = page;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      // Toggle Visibility
      items.forEach((item, index) => {
        if (item.closest('.section').querySelector('.listing-investor-banner')) {
          if (page === 1) {
            item.closest('.section').querySelector('.listing-investor-banner').classList.remove('hidden-item');
          } else {
            item.closest('.section').querySelector('.listing-investor-banner').classList.add('hidden-item');
          }
        }
        item.classList.toggle('hidden-item', index < start || index >= end);
      });

      funcObj.renderControls();

      // Scroll Up Logic
      if (mainContainer) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    // --- RENDERER ---
    const renderControls = () => {
      paginationWrapper.innerHTML = '';

      // Previous Arrow
      const prevBtn = document.createElement('button');
      prevBtn.innerHTML = '&lsaquo;';
      prevBtn.className = 'pagination-arrow prev-btn';
      prevBtn.ariaLabel = 'Previous Page';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) goToPage(currentPage - 1);
      });
      paginationWrapper.appendChild(prevBtn);

      // Number Buttons
      const pageList = generatePaginationList(currentPage, totalPages);

      pageList.forEach((item) => {
        if (item === '...') {
          const ellipsis = document.createElement('span');
          ellipsis.textContent = '...';
          ellipsis.className = 'pagination-ellipsis';
          paginationWrapper.appendChild(ellipsis);
        } else {
          const btn = document.createElement('button');
          btn.textContent = item;
          btn.className = 'pagination-btn';
          if (item === currentPage) btn.classList.add('active');
          btn.addEventListener('click', () => goToPage(item));
          paginationWrapper.appendChild(btn);
        }
      });

      // Next Arrow
      const nextBtn = document.createElement('button');
      nextBtn.innerHTML = '&rsaquo;';
      nextBtn.className = 'pagination-arrow next-btn';
      nextBtn.ariaLabel = 'Next Page';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) goToPage(currentPage + 1);
      });
      paginationWrapper.appendChild(nextBtn);
    };
    funcObj.renderControls = renderControls;
    // Initialize
    mainContainer.appendChild(paginationWrapper);
    goToPage(1);
  },
  getOrdinalSuperscript: (n) => {
  // Ensure the input is a number
    if (typeof n !== 'number' || Number.isNaN(n)) {
      return String(n); // Return the input as is if it's not a valid number
    }

    // Handle the special cases for 11, 12, and 13 (which always use 'th')
    const s = n % 100;
    if (s >= 11 && s <= 13) {
      return `${n}<sup>th</sup>`;
    }

    // Handle the common cases using the last digit
    const lastDigit = n % 10;
    let suffix = '';

    switch (lastDigit) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
        break;
    }

    // Return the number concatenated with the superscript suffix
    return `${n}<sup>${suffix}</sup>`;
  },
};
export default dataMapMoObj;
