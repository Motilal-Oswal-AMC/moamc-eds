import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  // --- 1. Add Indexed Classes ---
  dataMapMoObj.CLASS_PREFIXES = [
    'moedge-build-cont',
    'moedge-build-sec',
    'moedge-build-sub',
    'moedge-build-inner-text',
    'moedge-build-list',
    'moedge-build-list-content',
  ];
  dataMapMoObj.addIndexed(block);

  Array.from(block.children).forEach((container) => {
    if (container.querySelector('.moedge-build-sec4 .moedge-build-sub1')) {
      const txtletter = container
        .querySelector('.moedge-build-sec4');
      const txtdup = txtletter.textContent.trim();
      container.classList.add(txtdup);
      txtletter.remove();
    }
  });
  // --- 2. Wrap Sections ---
  // allCards is a NodeList of all card containers in this block
  const allCards = block.querySelectorAll(':scope > div[class*="moedge-build-cont"]');

  allCards.forEach((container) => {
    const sec1 = container.querySelector('.moedge-build-sec1');
    const sec2 = container.querySelector('.moedge-build-sec2');

    if (sec1 && sec2 && sec1.parentNode === sec2.parentNode) {
      const parent = sec1.parentNode;
      const wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('secs-wrapper');
      parent.insertBefore(wrapperDiv, sec1);
      wrapperDiv.appendChild(sec1);
      wrapperDiv.appendChild(sec2);
    }
  });

  // // --- 3. NEW "View All / View Less" Toggle Logic ---
  // const cardsToShowInitially = 9;
  // // -> Convert NodeList to Array to use array methods like .slice()
  // const allCardsArray = Array.from(allCards);

  // const buttonWrapper = block.parentElement.nextElementSibling;
  // const viewAllButton = buttonWrapper?.querySelector('a[title="View All"]');

  // // Check if a button exists and if toggling is needed
  // if (viewAllButton && allCardsArray.length > cardsToShowInitially) {
  //   // -> Store only the cards that need to be toggled
  //   const hiddenCards = allCardsArray.slice(cardsToShowInitially);

  //   // 1. Initially hide the extra cards
  //   hiddenCards.forEach((card) => {
  //     card.classList.add('hidden');
  //   });

  //   // 2. Accessibility: Control the list and set initial state
  //   const listId = block.id || `cards-list-${Math.random().toString(36).slice(2, 8)}`;
  //   block.id = listId; // Ensure the list has an ID
  //   viewAllButton.setAttribute('aria-controls', listId);
  //   viewAllButton.setAttribute('aria-expanded', 'false');
  //   viewAllButton.setAttribute('role', 'button');

  //   // 3. Add a state variable to track if cards are expanded
  //   let isExpanded = false;

  //   // 4. Add the toggle click listener
  //   viewAllButton.addEventListener('click', (e) => {
  //     e.preventDefault();

  //     if (!isExpanded) {
  //       // --- If it's collapsed, EXPAND it ---
  //       hiddenCards.forEach((hiddenCard) => {
  //         hiddenCard.classList.remove('hidden');
  //       });

  //       // Change button text to "View Less"
  //       viewAllButton.textContent = 'View Less';
  //       viewAllButton.setAttribute('title', 'View Less');
  //       viewAllButton.setAttribute('aria-expanded', 'true');
  //       isExpanded = true;
  //     } else {
  //       // --- If it's expanded, COLLAPSE it ---
  //       hiddenCards.forEach((hiddenCard) => {
  //         hiddenCard.classList.add('hidden');
  //       });

  //       // Change button text back to "View All"
  //       viewAllButton.textContent = 'View All';
  //       viewAllButton.setAttribute('title', 'View All');
  //       viewAllButton.setAttribute('aria-expanded', 'false');
  //       isExpanded = false;

  //       // -> Optional: Scroll user back to the top of the card block
  //       block.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //     }
  //   });

  //   // 5. -> Bonus: Add keyboard support for accessibility
  //   viewAllButton.addEventListener('keydown', (e) => {
  //     if (e.key === 'Enter' || e.key === ' ') {
  //       e.preventDefault();
  //       viewAllButton.click(); // Trigger the click event
  //     }
  //   });
  // }

  /**
   * Helper function to create pagination buttons and logic.
   * @param {Element} block The main block element.
   * @param {Array<Element>} items An array of all card items.
   * @param {number} itemsPerPage The number of items to show per page.
   */

  /**
   * Decorates the moedge-building block.
   * @param {Element} block The block element
   */

  // Find the container that has your special classes
  const mainContainer = block.closest('.pr-news-list.moedge-building-container');

  // Only run this pagination logic if we are in the correct block
  if (mainContainer) {
    // Select all the card items
    const items = Array.from(block.querySelectorAll(':scope > [class*="moedge-build-cont"]'));
    const itemsPerPage = items.slice(0, 12).length;

    if (items.length > itemsPerPage) {
      dataMapMoObj.setupPagination(block, items, itemsPerPage);
    }
  }

  // ... any other decoration code you have ...

  // Find the container that has your special classes
  const mainbuilding = block.closest('.our-author-detail.moedge-building-container');

  // Only run this pagination logic if we are in the correct block
  if (mainbuilding) {
    // Select all the card items
    const items = Array.from(block.querySelectorAll(':scope > [class*="moedge-build-cont"]'));
    const itemsPerPage = items.slice(0, 12).length;

    if (items.length > itemsPerPage) {
      dataMapMoObj.setupPagination(block, items, itemsPerPage);
    }
  }

  // Find the container that has your special classes
  const mainlisting = block.closest('.moedge-list.moedge-building-container');

  // Only run this pagination logic if we are in the correct block
  if (mainlisting) {
    // Select all the card items
    const items = Array.from(block.querySelectorAll(':scope > [class*="moedge-build-cont"]'));
    const itemsPerPage = items.slice(0, 12).length;

    if (items.length > itemsPerPage) {
      dataMapMoObj.setupPagination(block, items, itemsPerPage);
    }
  }

  // Find the container that has your special classes
  const mainblklist = block.closest('.section');// ('[data-id="listing-article-cards"]');

  // Only run this pagination logic if we are in the correct block
  function convertDate(dateStr) {
    const date = new Date(dateStr);

    // Formatting options
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
  }

  if (mainblklist.getAttribute('data-id') === 'listing-article-cards') {
    // Select all the card items
    // 1. Create an array of Promises using .map() instead of .forEach()
    const htmlPromises = dataMapMoObj.getinvestorblog.data.map(async (elem, index) => {
      // Check condition
      if (!elem.path.includes('/images/')) {
        return null; // Return null if condition isn't met
      }

      // Perform async operation
      const readtime = await dataMapMoObj.getReadingTime(elem.path);

      // Prepare variables
      // const imagePAth = `./${elem.image.split('/')[elem.image.split('/').length - 1]}`;
      const titleText = dataMapMoObj.toTitleCase(elem.title.replaceAll('-', ' '));
      const dateText = convertDate(elem.date.split('T')[0]);

      // Return the HTML string
      return `<div class="comlist moedge-build-cont${index + 1}">
      <div class="secs-wrapper"><div class="comlist moedge-build-sec1">
        <picture class="comlist moedge-build-sub1">
          <source type="image/webp" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" media="(min-width: 600px)" class="comlist moedge-build-inner-text1">
          <source type="image/webp" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" class="comlist moedge-build-inner-text2">
          <source type="image/jpeg" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" media="(min-width: 600px)" class="comlist moedge-build-inner-text3">
          <img loading="lazy" alt="edge-img" src="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" width="800" height="440" class="comlist moedge-build-inner-text4">
        </picture>
      </div><div class="button-container comlist moedge-build-sec2"><p class="comlist moedge-build-sub1"><a href="${elem.path}" title="/mutual-fund/in/en/modals/youtube-video" class="button comlist moedge-build-inner-text1">/mutual-fund/in/en/modals/youtube-video</a></p></div></div>
      
      <div class="comlist moedge-build-sec3">
        <ul class="comlist moedge-build-sub1">
          <li class="comlist moedge-build-inner-text1">
            <p class="comlist moedge-build-list1"><span class="icon icon-Article comlist moedge-build-list-content1"><img data-icon-name="Article" src="/icons/Article.svg" alt="" loading="lazy" width="16" height="16"></span>Article</p>
            <ul class="comlist moedge-build-list2">
              <li class="comlist moedge-build-list-content1"> ${readtime.minutes} min read</li>
              <li class="comlist moedge-build-list-content2"><span class="icon icon-calendar-01"><img data-icon-name="calendar-01" src="/icons/calendar-01.svg" alt="" loading="lazy" width="16" height="16"></span>${dateText}</li>
            </ul>
          </li>
          <li class="comlist moedge-build-inner-text2">
            <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title="${titleText}" class="button comlist moedge-build-list-content1">${titleText}</a></p>
          </li>
          <li class="comlist moedge-build-inner-text3">
            <p class="comlist moedge-build-list1">${elem.description}</p>
          </li>
          <li class="comlist moedge-build-inner-text4">
            <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title="Read Now" class="button comlist moedge-build-list-content1">Read Now</a></p>
          </li>
          <li class="comlist moedge-build-inner-text5">
            <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title="" class="button comlist moedge-build-list-content1"><span class="icon icon-Subtract"><img data-icon-name="Subtract" src="/icons/Subtract.svg" alt="" loading="lazy" width="16" height="16"></span></a></p>
          </li>
        </ul>
      </div>
    </div>`;
    });

    // 2. Wait for ALL promises to resolve
    Promise.all(htmlPromises).then((htmlArray) => {
      // Filter out nulls (from the if check) and join into one big string
      const validHtml = htmlArray.filter(Boolean).join('');

      // 3. Update DOM ONCE (Much faster than innerHTML += in a loop)
      block.innerHTML = '';
      block.innerHTML = validHtml;

      // 4. NOW it is safe to query the DOM
      const items = Array.from(block.querySelectorAll(':scope > [class*="moedge-build-cont"]'));
      const itemsPerPage = items.slice(0, 9).length;

      if (items.length > itemsPerPage) {
        dataMapMoObj.setupPagination(block, items, itemsPerPage);
      }

      // Banner Logic
      const blockdo = block.closest('body');
      const blkcamp = blockdo?.querySelector('.listing-investor-banner');

      // Only proceed if blkcamp exists
      if (blkcamp) {
        const level = blkcamp.getAttribute('data-id');
        const leveliteration = (Number(level) * 3);

        if (leveliteration && items.length > 0) {
          // block.innerHTML = ''; // Clear to re-order
          items.forEach((el, index) => {
            block.appendChild(el);
            // Insert banner at specific index
            if (index === (leveliteration - 1)) {
              block.appendChild(blkcamp);
            }
          });
        }
      }
    });
  }
  if (mainblklist.getAttribute('data-id') === 'listing-video-cards') {
    // Select all the card items
    // 1. Create an array of Promises using .map() instead of .forEach()
    const htmlPromises = dataMapMoObj.getinvestorblog.data.map(async (elem, index) => {
      // Check condition
      if (!elem.path.includes('/videos/')) {
        return null; // Return null if condition isn't met
      }

      // Perform async operation
      const readtime = await dataMapMoObj.getReadingTime(elem.path);

      // Prepare variables
      // const imagePAth = `./${elem.image.split('/')[elem.image.split('/').length - 1]}`;
      const titleText = dataMapMoObj.toTitleCase(elem.title.replaceAll('-', ' '));
      const dateText = convertDate(elem.date.split('T')[0]);

      // Return the HTML string
      return `<div class="comlist moedge-build-cont${index + 1}">
  <div class="secs-wrapper">
    <a class="redirection " href="${elem.path}">
    <div class="comlist moedge-build-sec1">
        <picture class="comlist moedge-build-sub1">
          <source type="image/webp" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" media="(min-width: 600px)"
            class="comlist moedge-build-inner-text1">
          <source type="image/webp" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" class="comlist moedge-build-inner-text2">
          <source type="image/jpeg" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" media="(min-width: 600px)"
            class="comlist moedge-build-inner-text3">
          <img loading="lazy" alt="edge-img" src="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" width="800" height="440"
            class="comlist moedge-build-inner-text4">
        </picture>
    </div>
    <div class="button-container comlist moedge-build-sec2">
      <p class="comlist moedge-build-sub1"><a href="${elem.path}" title="/mutual-fund/in/en/modals/youtube-video"
          class="button comlist moedge-build-inner-text1">/mutual-fund/in/en/modals/youtube-video</a></p>
    </div>
    </a>
  </div>
  <div class="comlist moedge-build-sec3">
    <ul class="comlist moedge-build-sub1">
      <li class="comlist moedge-build-inner-text1" style="display: none;">
        <p class="comlist moedge-build-list1"><span class="icon icon-Vedio comlist moedge-build-list-content1"><img
              data-icon-name="Vedio" src="/icons/youtube-1.svg" alt="" loading="lazy" width="16"
              height="16"></span>Vedio</p>
        <ul class="comlist moedge-build-list2">
          <li class="comlist moedge-build-list-content1"> ${readtime.minutes} min read</li>
          <li class="comlist moedge-build-list-content2"><span class="icon icon-calendar-01"><img
                data-icon-name="calendar-01" src="/icons/calendar-01.svg" alt="" loading="lazy" width="16"
                height="16"></span>${dateText}</li>
        </ul>
      </li>
      <li class="comlist moedge-build-inner-text2">
        <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title="${titleText}"
            class="button comlist moedge-build-list-content1">${titleText}</a></p>
      </li>
      <li class="comlist moedge-build-inner-text3">
        <p class="comlist moedge-build-list1">${elem.description}</p>
      </li>
      <li class="comlist moedge-build-inner-text4">
        <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title="Read Now"
            class="button comlist moedge-build-list-content1">Read Now</a></p>
      </li>
      <li class="comlist moedge-build-inner-text5">
        <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title=""
            class="button comlist moedge-build-list-content1"><span class="icon icon-Subtract"><img
                data-icon-name="Subtract" src="/icons/Subtract.svg" alt="" loading="lazy" width="16"
                height="16"></span></a></p>
      </li>
    </ul>
  </div>
</div>`;
    });

    // 2. Wait for ALL promises to
    // const blockHTML = block;
    block.innerHTML = '';
    Promise.all(htmlPromises).then((htmlArray) => {
      // 1. Join the HTML string
      const validHtml = htmlArray.filter(Boolean).join('');

      // 2. Create a temporary container to turn the String into DOM Nodes
      // We do not add this to the actual document yet.
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = validHtml;

      // Get the items from the temp container
      const items = Array.from(tempDiv.querySelectorAll('[class*="moedge-build-cont"]'));

      // 3. Prepare a DocumentFragment (a lightweight container for the final DOM)
      const finalFragment = document.createDocumentFragment();

      // 4. Banner Logic setup
      const blockdo = block.closest('body');
      const blkcamp = blockdo?.querySelector('.listing-investor-banner');
      let bannerInsertionIndex = -1;

      if (blkcamp) {
        const level = blkcamp.getAttribute('data-id');
        const leveliteration = (Number(level) * 3);
        if (leveliteration && items.length > 0) {
          bannerInsertionIndex = leveliteration - 1;
        }
      }

      // 5. Build the final structure in the Fragment (In Memory)
      items.forEach((el, index) => {
        // Add the video item
        finalFragment.appendChild(el);

        // Check if we need to insert the banner here
        if (blkcamp && index === bannerInsertionIndex) {
          finalFragment.appendChild(blkcamp);
        }
      });

      // 6. UPDATE DOM ONCE (Clean and Direct)
      block.innerHTML = ''; // Ensure block is empty
      block.classList.add('video-listing');
      block.appendChild(finalFragment); // Single paint operation

      // 7. Pagination Logic
      // The items are now actually in the DOM, so pagination will work correctly
      const itemsPerPage = 9; // Simplified based on your slice(0,9) logic

      if (items.length > itemsPerPage) {
        dataMapMoObj.setupPagination(block, items, itemsPerPage);
      }
    });
  }
  if (mainblklist.getAttribute('data-id') === 'listing-podcast-cards') {
    // Select all the card items
    // 1. Create an array of Promises using .map() instead of .forEach()
    const htmlPromises = dataMapMoObj.getinvestorblog.data.map(async (elem, index) => {
      // Check condition
      if (!elem.path.includes('/podcast/')) {
        return null; // Return null if condition isn't met
      }

      // Perform async operation
      const readtime = await dataMapMoObj.getReadingTime(elem.path);

      // Prepare variables
      // const imagePAth = `./${elem.image.split('/')[elem.image.split('/').length - 1]}`;
      const titleText = dataMapMoObj.toTitleCase(elem.title.replaceAll('-', ' '));
      const dateText = convertDate(elem.date.split('T')[0]);

      // Return the HTML string
      return `<div class="comlist moedge-build-cont${index + 1}">
      <div class="secs-wrapper"><div class="comlist moedge-build-sec1">
        <picture class="comlist moedge-build-sub1">
          <source type="image/webp" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" media="(min-width: 600px)" class="comlist moedge-build-inner-text1">
          <source type="image/webp" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" class="comlist moedge-build-inner-text2">
          <source type="image/jpeg" srcset="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" media="(min-width: 600px)" class="comlist moedge-build-inner-text3">
          <img loading="lazy" alt="edge-img" src="./media_198d0bd7effd4422c99c4935db941ebcd8230abb8.png?width=2000&format=webply&optimize=medium" width="800" height="440" class="comlist moedge-build-inner-text4">
        </picture>
      </div><div class="button-container comlist moedge-build-sec2"><p class="comlist moedge-build-sub1"><a href="${elem.path}" title="/mutual-fund/in/en/modals/youtube-video" class="button comlist moedge-build-inner-text1">/mutual-fund/in/en/modals/youtube-video</a></p></div></div>
      
      <div class="comlist moedge-build-sec3">
        <ul class="comlist moedge-build-sub1">
          <li class="comlist moedge-build-inner-text1" style="display: none;">
            <p class="comlist moedge-build-list1"><span class="icon icon-Article comlist moedge-build-list-content1"><img data-icon-name="Article" src="/icons/Article.svg" alt="" loading="lazy" width="16" height="16"></span>Article</p>
            <ul class="comlist moedge-build-list2">
              <li class="comlist moedge-build-list-content1"> ${readtime.minutes} min read</li>
              <li class="comlist moedge-build-list-content2"><span class="icon icon-calendar-01"><img data-icon-name="calendar-01" src="/icons/calendar-01.svg" alt="" loading="lazy" width="16" height="16"></span>${dateText}</li>
            </ul>
          </li>
          <li class="comlist moedge-build-inner-text2">
            <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title="${titleText}" class="button comlist moedge-build-list-content1">${titleText}</a></p>
          </li>
          <li class="comlist moedge-build-inner-text3">
            <p class="comlist moedge-build-list1">${elem.description}</p>
          </li>
          <li class="comlist moedge-build-inner-text4">
            <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title="Read Now" class="button comlist moedge-build-list-content1">Read Now</a></p>
          </li>
          <li class="comlist moedge-build-inner-text5">
            <p class="button-container comlist moedge-build-list1"><a href="${elem.path}" title="" class="button comlist moedge-build-list-content1"><span class="icon icon-Subtract"><img data-icon-name="Subtract" src="/icons/Subtract.svg" alt="" loading="lazy" width="16" height="16"></span></a></p>
          </li>
        </ul>
      </div>
    </div>`;
    });

    // 2. Wait for ALL promises to resolve
    Promise.all(htmlPromises).then((htmlArray) => {
      // Filter out nulls (from the if check) and join into one big string
      const validHtml = htmlArray.filter(Boolean).join('');

      // 3. Update DOM ONCE (Much faster than innerHTML += in a loop)
      block.innerHTML = validHtml;

      // 4. NOW it is safe to query the DOM
      const items = Array.from(block.querySelectorAll(':scope > [class*="moedge-build-cont"]'));
      const itemsPerPage = items.slice(0, 9).length;

      if (items.length > itemsPerPage) {
        dataMapMoObj.setupPagination(block, items, itemsPerPage);
      }

      // Banner Logic
      const blockdo = block.closest('body');
      const blkcamp = blockdo?.querySelector('.listing-investor-banner');

      // Only proceed if blkcamp exists
      if (blkcamp) {
        const level = blkcamp.getAttribute('data-id');
        const leveliteration = (Number(level) * 3);

        if (leveliteration && items.length > 0) {
          block.innerHTML = ''; // Clear to re-order
          items.forEach((el, index) => {
            block.appendChild(el);
            // Insert banner at specific index
            if (index === (leveliteration - 1)) {
              block.appendChild(blkcamp);
            }
          });
        }
      }
    });
  }
}
