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

  function renterBlock(param) {
    dataMapMoObj.getinsights().then((respText) => {
      block.innerHTML = '';
      if (param === undefined) {
        param = 'Newest to Oldest';
      }
      let resp = respText;
      if (param === 'Oldest to Newest') {
        resp = respText.data.slice(1).sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      if (param === 'Newest to Oldest') {
        resp = respText.data.slice(1).sort((a, b) => new Date(b.date) - new Date(a.date));
      }
      resp.forEach(async (elem, index) => {
        const readtime = await dataMapMoObj.getReadingTime(elem.path);
        const imagePAth = `./${elem.image.split('/')[elem.image.split('/').length - 1]}`;
        const temphtml = `<div class="comlist moedge-build-cont${index}">
  <div class="secs-wrapper">
    <div class="comlist moedge-build-sec1">
      <picture class="comlist moedge-build-sub1">
        <source type="image/webp"
          srcset="${imagePAth}"
          media="(min-width: 600px)" class="comlist moedge-build-inner-text1">
        <source type="image/webp"
          srcset="${imagePAth}"
          class="comlist moedge-build-inner-text2">
        <source type="image/jpeg"
          srcset="${imagePAth}"
          media="(min-width: 600px)" class="comlist moedge-build-inner-text3">
        <img loading="lazy" alt="img"
          src="${imagePAth}">
      </picture>
    </div>
    <div class="comlist moedge-build-sec2"></div>
  </div>

  <div class="comlist moedge-build-sec3">
    <ul class="comlist moedge-build-sub1">
      <li class="comlist moedge-build-inner-text1">
        <p class="comlist moedge-build-list1"><span class="icon icon-Article comlist moedge-build-list-content1"><img
              data-icon-name="Article" src="/icons/Article.svg" alt="" loading="lazy" width="16"
              height="16"></span>Article</p>
        <ul class="comlist moedge-build-list2">
          <li class="comlist moedge-build-list-content1">${readtime.minutes} min read</li>
          <li class="comlist moedge-build-list-content2"><span class="icon icon-calendar-01"><img
                data-icon-name="calendar-01" src="/icons/calendar-01.svg" alt="" loading="lazy" width="16"
                height="16"></span>${convertDate(elem.date.split('T')[0])}</li>
        </ul>
      </li>
      <li class="comlist moedge-build-inner-text2">
        <p class="button-container comlist moedge-build-list1"><a
            href="${elem.path}" target="_blank" title="${dataMapMoObj.toTitleCase(elem.title.replaceAll('-', ' '))}"
            class="button comlist moedge-build-list-content1">${dataMapMoObj.toTitleCase(elem.title.replaceAll('-', ' '))}</a></p>
      </li>
      <li class="comlist moedge-build-inner-text3">
        <p class="comlist moedge-build-list1">${elem.description}</p>
      </li>
      <li class="comlist moedge-build-inner-text4">
        <p class="button-container comlist moedge-build-list1"><a
            href="${elem.path}" target="_blank" title="Read Now"
            class="button comlist moedge-build-list-content1">Read Now</a></p>
      </li>
      <li class="comlist moedge-build-inner-text5">
        <p class="button-container comlist moedge-build-list1"><a
            href="${elem.path}" target="_blank" title=""
            class="button comlist moedge-build-list-content1"><span class="icon icon-Subtract"><img
                data-icon-name="Subtract" src="/icons/Subtract.svg" alt="" loading="lazy" width="16"
                height="16"></span></a></p>
      </li>
    </ul>
  </div>
  <div class="comlist moedge-build-sec4"></div>
</div>`;
        block.innerHTML += temphtml;
      });
    }).catch((error) => error);
  }

  if (window.location.href.includes('/our-authors/prateek-agrawal')) {
    const edgemain = block.closest('main');
    if (edgemain.querySelectorAll('.edge-filter-container .edge-filter-sub1 ul li')) {
      edgemain.querySelectorAll('.edge-filter-container .edge-filter-sub1 ul li').forEach((elemfilter) => {
        elemfilter.addEventListener('click', (event) => {
          event.preventDefault();
          const textSelect = elemfilter.textContent;
          const spanul = event.target.closest('ul').parentElement
            .querySelector('p span');
          event.target.closest('ul').parentElement
            .querySelector('p').textContent = '';
          event.target.closest('ul').parentElement
            .querySelector('p').textContent = textSelect;
          event.target.closest('ul').parentElement
            .querySelector('p').append(spanul);
          if (textSelect === 'Oldest to Newest') {
            renterBlock('Oldest to Newest');
          }

          if (textSelect === 'Newest to Oldest') {
            renterBlock('Newest to Oldest');
          }
        });
      });
    }
    renterBlock();
  }

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
