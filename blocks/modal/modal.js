// eslint-disable-next-line import/no-cycle
import { loadFragment } from '../fragment/fragment.js';
import {
  buildBlock, decorateBlock, loadBlock, loadCSS,
} from '../../scripts/aem.js';
import dataMapMoObj from '../../scripts/constant.js';
import dataCfObj from '../../scripts/dataCfObj.js';

export async function createModal(contentNodes) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const contentNodesClass = [...contentNodes].filter(
    (node) => node.classList && node.classList.contains('risk-o-meter-container'),
  );

  // if (contentNodesClass.length === 0) {
  //   contentNodesClass = [...contentNodes].filter(
  //     (node) => node.classList && node.classList.contains('live-streaming'),
  //   );
  // }
  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...contentNodes);
  if (dialogContent.querySelector('.maintab') && window.location.pathname.includes('/coverage')) {
    dialogContent.querySelector('.maintab').remove();
  }
  dialog.append(dialogContent);

  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button');
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  if (contentNodesClass.length !== 0) {
    dialogContent.prepend(closeButton);
    dialogContent.classList.add('risk-meter');
  } else {
    dialog.prepend(closeButton);
  }

  const block = buildBlock('modal', '');
  if (document.querySelector('main .modal') === null) {
    document.querySelector('main').append(block);
  }
  decorateBlock(block);
  await loadBlock(block);

  // close on click outside the dialog
  dialog.addEventListener('click', (e) => {
    const {
      left, right, top, bottom,
    } = dialog.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (clientX < left || clientX > right || clientY < top || clientY > bottom) {
      dialog.close();
    }
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (Array.from(document.body.classList).includes('scroll-lock')) {
      document.body.classList.remove('scroll-lock');
    }
    block.remove();
  });

  block.innerHTML = '';
  if (block.closest('main').querySelectorAll('.modal').length <= 1) {
    block.append(dialog);
  }

  return {
    block,
    showModal: () => {
      dialog.showModal();
      // reset scroll position
      setTimeout(() => { dialogContent.scrollTop = 0; }, 0);
      document.body.classList.add('modal-open');
    },
  };
}

// --- Original openModal function (unchanged) ---
export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  const { showModal } = await createModal(fragment.childNodes);
  showModal();
}

// --- Specialized function for On-Card Modals ---
// async function openModalOnElement(fragmentUrl, clickedElement) {
//   // **IMPORTANT**: Replace '.your-card-class' with the actual class of your fund card!
//   let schcodeactive;
//   if (
//     clickedElement.parentElement.parentElement.parentElement.querySelector(
//       '.star',
//     ) !== null
//   ) {
//     schcodeactive = clickedElement.parentElement.parentElement.parentElement.querySelector(
//       '.star',
//     ).attributes.schcode.value;
//   } else {
//     const carwrapp = clickedElement.closest('.card-wrapper');
//     schcodeactive = carwrapp
//       .querySelector('.fund-name-title')
//       .getAttribute('schcode');
//   }
//   localStorage.setItem('schcodeactive', schcodeactive);
//   // const card = clickedElement.closest('.our-popular-funds')
//   //   || clickedElement.closest('.known-our-funds')
//   //   || clickedElement.closest('.fdp-card-container');

//   const card = clickedElement.closest('.our-popular-funds')
//     || clickedElement.closest('.known-our-funds')
//     || document.querySelector('main');

//   // const card = document.querySelector('main');

//   if (!card) {
//     // console.error('On-card modal: Could not find parent card with class ".your-card-class".');
//     return;
//   }

//   card.scrollIntoView({ behavior: 'smooth', block: 'start' });

//   // card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

//   const path = fragmentUrl.startsWith('http')
//     ? new URL(fragmentUrl, window.location).pathname
//     : fragmentUrl;
//   const fragment = await loadFragment(path);
//   if (!fragment) return;

//   card.classList.add('modal-active-parent');

//   const overlay = document.createElement('div');
//   overlay.classList.add('card-modal-overlay');
//   overlay.style.visibility = 'hidden';
//   overlay.style.position = 'absolute';
//   overlay.style.left = '-9999px';

//   overlay.append(...fragment.childNodes);
//   card.append(overlay);

//   requestAnimationFrame(() => {
//     overlay.style.visibility = '';
//     overlay.style.position = '';
//     overlay.style.left = '';
//   });

//   const block = overlay.querySelector('.block');
//   if (block) {
//     await decorateBlock(block);
//     await loadBlock(block);
//   }
//   // Call the function
//   const closeButton = overlay.querySelector('.modal-btn');
//   if (closeButton) {
//     document.body.classList.add('noscroll');
//     closeButton.addEventListener('click', (e) => {
//       e.stopPropagation(); // Stop click from bubbling further
//       const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
//       async function removeClassAfterDelay() {
//         await delay(1200);
//         overlay.remove('.card-modal-overlay');
//       }
//       const classAdd = card.querySelector('.invest-now-homepage-container');
//       if (Array.from(classAdd.classList).includes('hide-modal')) {
//         classAdd.classList.remove('hide-modal');
//       }
//       classAdd.classList.add('hide-modal');
//       classAdd.classList.remove('modal-show');
//       // }
//       document.body.classList.remove('noscroll');
//       card.classList.remove('modal-active-parent');
//       overlay.classList.add('hide-overlay');
//       removeClassAfterDelay();
//       // classList.add('hide-overplay');
//     });
//   }
// }

// --- Specialized function for On-Card Modals (New) ---
async function openModalOnElement(fragmentUrl, clickedElement) {
  // This business logic for schcode can remain the same
  let schcodeactive;
  const cardWrapper = clickedElement.closest('.card-wrapper'); // More robust DOM traversal
  if (cardWrapper) {
    const starEl = cardWrapper.querySelector('.star');
    const titleEl = cardWrapper.querySelector('.fund-name-title');
    if (starEl && starEl.getAttribute('schcode')) {
      schcodeactive = starEl.getAttribute('schcode');
    } else if (titleEl && titleEl.getAttribute('schcode')) {
      schcodeactive = titleEl.getAttribute('schcode');
      dataMapMoObj.planText = cardWrapper.querySelector('.middlediv .selecttext')
        .textContent.trim();
    }
  } else if (window.location.href.includes('/our-funds/')
    && localStorage.getItem('planCode')
    && !cardWrapper) {
    const mainblk = clickedElement.closest('main');
    dataMapMoObj.planText = mainblk.querySelector('.fdp-card .middlediv .selecttext')
      .textContent.trim();
    const planData = localStorage.getItem('planCode');
    const data = planData.split(':');
    const datafirst = data[1];
    schcodeactive = datafirst;
  } else if (window.location.href.includes('/home-page')) {
    const homecal = clickedElement.closest('.section');
    dataMapMoObj.plantext = homecal
      .querySelector('#searchFundInput').value;
    const flow = homecal
      .querySelector('#planToggle').checked ? 'Regular' : 'Direct';
    // let plan;
    dataMapMoObj.planText = `${flow} | ${homecal
      .querySelector('.plan-option-select .select-selected-plan').textContent.trim()}`;
    dataCfObj.cfDataObjs.forEach((funddata) => {
      if (funddata.schDetail.schemeName === dataMapMoObj.plantext) {
        schcodeactive = funddata.schcode;
        dataMapMoObj.planlistArr = funddata.planList;
      }
    });
    // plan.forEach((elplan) => {
    //   if (elplan.planName === flow && elplan.planName typeplan) {
    //     console.log('easdf');
    //   }
    // });
    // dataMapMoObj.planlistArr = '';
  } else if (window.location.href.includes('/our-funds/funds-details-page')
    && !cardWrapper) {
    const clikmain = clickedElement.closest('main');
    const fdpsec = clikmain.querySelector('.fdp-card-container .card-container');
    const fdpcont = fdpsec.querySelector('.middlediv .selecttext');
    dataMapMoObj.plantext = fdpcont.textContent.trim();
    const stickplan = clickedElement.closest('.sticky-item1');
    const planName = stickplan.querySelector('.sticky-inner-item1').textContent;
    dataCfObj.cfDataObjs.forEach((funddata) => {
      if (funddata.schDetail.schemeName === planName) {
        schcodeactive = funddata.schcode;
        dataMapMoObj.planlistArr = funddata.planList;
      }
    });
  }
  localStorage.setItem('schcodeactive', schcodeactive);

  // --- START: NEW LOGIC BORROWED FROM createModal ---
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  if (!fragment) return;

  // 1. Create a proper <dialog> element
  const dialog = document.createElement('dialog');
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...fragment.childNodes);
  dialog.append(dialogContent);

  // 2. Add a close button (you can style it to appear where you need it)
  const closeButton = document.createElement('button');
  closeButton.classList.add('close-button'); // Use your existing modal CSS
  closeButton.setAttribute('aria-label', 'Close');
  closeButton.type = 'button';
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener('click', () => dialog.close());
  dialog.prepend(closeButton); // Prepend to the dialog itself

  // 3. Temporarily append to a new 'modal' block to load its content
  const block = buildBlock('modal', '');
  if (document.querySelector('main .modal') === null) {
    document.querySelector('main').append(block);
  }
  document.querySelector('.modal').classList.add('block');
  if (!document.querySelector('.modal .embed')) {
    document.querySelector('.modal').classList.add('modal-journey');
  }

  // Clean up the block and append the dialog
  block.innerHTML = '';
  if (Array.from(block.classList).includes('block')) {
    block.append(dialog);
  }

  // Decorate and load blocks *within* the fragment
  // for (const innerBlock of dialog.querySelectorAll('.block')) {
  //   decorateBlock(innerBlock);
  //   await loadBlock(innerBlock);
  // }

  // This is the most straightforward fix if your linter allows a standard `for` loop.
  const blocks = dialog.querySelectorAll('.block');
  const blockPromises = Array.from(blocks).map(async (innerBlock) => {
    decorateBlock(innerBlock);
    return loadBlock(innerBlock); // loadBlock returns a promise.
  });

  // Wait for all promises to resolve.
  await Promise.all(blockPromises);

  // 4. Add event listeners for cleanup
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open', 'noscroll');
    if (Array.from(document.body.classList).includes('scroll-lock')) {
      document.body.classList.remove('scroll-lock');
    }
    block.remove(); // Clean up the modal block from the DOM
  });

  // 5. Show the modal
  try {
    dialog.showModal();
  } catch (error) {
    // console.log(error);
  }
  document.body.classList.add('modal-open', 'noscroll');
  if (window.location.href.includes('/mutual-fund/in/en/our-funds/')) {
    document.body.style.overflow = 'hidden';
  }
  // --- END: NEW LOGIC ---
}
// --- The SINGLE, SMART handler for ALL modal clicks ---
const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
async function removeClassAfterDelay() {
  await delay(1200);
}

export function initializeModalHandlers() {
  document.body.addEventListener('click', async (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href) return;

    // Check if it's a link to a modal fragment
    if (link.href.includes('/modals/')) {
      e.preventDefault();

      if (link.href.includes('fm-portfolio')) {
        const fmId = e.target.parentNode.getAttribute('data_id');
        localStorage.setItem('FM-AgentName', fmId);
        document.body.classList.add('noscroll');
      }

      // If it's our special card button, use the on-card logic
      if (link.classList.contains('invest-now') || link.classList.contains('card-btn') || link.classList.contains('submit') || link.classList.contains('sip-btn')) {
        e.stopPropagation(); // Stop other listeners!
        await openModalOnElement(link.href, link);
        // await openModal(link.href);
      } else {
        // For all other modal links, use the default behavior
        if (link.closest('.card-container')) {
          const schode = link.closest('.card-container')
            .querySelector('.star-wrap .star').getAttribute('schcode');
          localStorage.setItem('planCode', `Direct:${schode}`);
        }
        if (link.closest('.card-wrap')) {
          const schode = link.closest('.card-wrap')
            .querySelector('.risk-home-two a').getAttribute('schemesh');
          localStorage.setItem('planCode', `${schode}`);
        }
        if (link.closest('.list-view-container')) {
          const schode = link.closest('.list-view-container')
            .querySelector('.star').getAttribute('schcode');
          localStorage.setItem('planCode', `Direct:${schode}`);
        }
        await openModal(link.href);
      }
    }

    removeClassAfterDelay();
    const modal = document.querySelector('.modal');
    if (modal && modal.querySelector('.fm-portfolio-container')) {
      document.querySelector('.modal').classList.add('modal-journey-fund');
    } else if (!modal.querySelector('.embed')) {
      document.querySelector('.modal').classList.add('modal-journey');
    }

    // Media coverage page - Adding class to modal
    if (window.location.pathname.includes('/wcs/in/en/coverage')) {
      if (!modal.querySelector('.embed')) {
        modal.classList.add('coverage-image-modal');
        if (!modal.querySelector('.modal-content .close-button')) {
          modal.querySelector('.modal-content').prepend(modal.querySelector('.close-button'));
        }
      } else {
        modal.classList.add('coverage-video-modal');
      }
    }
  });
}

//  FDP PAN FUND
