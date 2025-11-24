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
  if (mainblklist.getAttribute('data-id') === 'listing-article-cards') {
    // Select all the card items
    const items = Array.from(block.querySelectorAll(':scope > [class*="moedge-build-cont"]'));
    const itemsPerPage = items.slice(0, 9).length;

    if (items.length > itemsPerPage) {
      dataMapMoObj.setupPagination(block, items, itemsPerPage);
    }

    const blockdo = block.closest('body');
    const blkcamp = blockdo.querySelector('.listing-investor-banner');
    const level = blkcamp.getAttribute('data-id');
    const leveliteration = (Number(level) * 3);
    if (leveliteration) {
      block.innerHTML = '';
      // let leveliteration = Number(level) * 3;
      items.forEach((el, index) => {
        block.appendChild(el);
        if (index === (leveliteration - 1)) {
          block.appendChild(blkcamp);
        }
      });
    }
  }
}
