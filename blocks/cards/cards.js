import { createOptimizedPicture } from '../../scripts/aem.js';
import dataMapMoObj from '../../scripts/constant.js';
import { moveInstrumentation } from '../../scripts/scripts.js';
// import formBlock from '../form/form.js';

export default function decorate(block) {
  /* change to ul, li */
  const ulblk = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ulblk.append(li);
  });
  ulblk.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ulblk);

  // function setupAuthorListToggle() {
  //   const sections = document.querySelectorAll('.behind-the-content.our-author-list');
  //   sections.forEach((section) => {
  //     const cardsBlock = section.querySelector('.cards.block');
  //     if (!cardsBlock) return;

  //     const ul = cardsBlock.querySelector('ul');
  //     if (!ul) return;

  //     const allItems = Array.from(ul.querySelectorAll('li'));
  //     const SHOW_COUNT = 12;

  //     if (allItems.length <= SHOW_COUNT) return;

  //     const hiddenItems = allItems.slice(SHOW_COUNT);
  //     hiddenItems.forEach((li) => li.classList.add('cards-card-hidden'));

  //     let viewAllBtn = section.querySelector('.default-content-wrapper .button');
  //     if (!viewAllBtn) {
  //       const wrapper = section.querySelector('.default-content-wrapper') || section;
  //       viewAllBtn = document.createElement('a');
  //       viewAllBtn.className = 'button view-all';
  //       viewAllBtn.setAttribute('href', '#');
  //       viewAllBtn.textContent = 'View All';
  //       const p = document.createElement('p');
  //       p.className = 'button-container';
  //       p.appendChild(viewAllBtn);
  //       wrapper.appendChild(p);
  //     } else {
  //       // normalize to act as button (prevent navigation)
  //       viewAllBtn.classList.add('view-all');
  //     }

  //     // Accessibility: set aria-controls and aria-expanded
  //     const ulId = ul.id || `cards-${Math.random().toString(36).slice(2, 8)}`;
  //     ul.id = ulId;
  //     viewAllBtn.setAttribute('aria-controls', ulId);
  //     viewAllBtn.setAttribute('aria-expanded', 'false');
  //     viewAllBtn.setAttribute('role', 'button');

  //     let isExpanded = false;

  //     const toggleShowAll = (e) => {
  //       e.preventDefault();
  //       if (!isExpanded) {
  //         // show all
  //         hiddenItems.forEach((li) => li.classList.remove('cards-card-hidden'));
  //         viewAllBtn.textContent = 'View Less'; // optional: change label
  //         viewAllBtn.setAttribute('aria-expanded', 'true');
  //         isExpanded = true;
  //       } else {
  //         // hide them again
  //         hiddenItems.forEach((li) => li.classList.add('cards-card-hidden'));
  //         viewAllBtn.textContent = 'View All';
  //         viewAllBtn.setAttribute('aria-expanded', 'false');
  //         isExpanded = false;

  //         // optionally scroll to top of section so user sees beginning again
  //         // section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //       }
  //     };

  //     viewAllBtn.addEventListener('click', toggleShowAll);
  //     // also allow keyboard activation on Enter/Space for anchor acting as button
  //     viewAllBtn.addEventListener('keydown', (ev) => {
  //       if (ev.key === 'Enter' || ev.key === ' ') {
  //         ev.preventDefault();
  //         toggleShowAll(ev);
  //       }
  //     });
  //   });
  // }
  // setupAuthorListToggle();

  const blkmain = block.closest('.contact-card');
  if (blkmain !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['contact-main', 'contact-sub', 'contact-inner', 'sub-contact'];
    dataMapMoObj.addIndexed(block);

    const listli = block.querySelectorAll('.contact-inner2 ul > li > ul');
    const listul = block.querySelectorAll('.contact-inner2 ul > li');
    dataMapMoObj.CLASS_PREFIXES = ['contact-li'];
    Array.from(listli).forEach((inner) => {
      dataMapMoObj.addIndexed(inner);
    });

    Array.from(listul).forEach((Element, index) => Element.classList.add(`list-elem-${index + 1}`));
    Array.from(listul).forEach((Element) => Element.classList.add('common-list'));
  }

  const pmsRooted = block.closest('.pms-rooted');
  if (pmsRooted !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['pms-rooted-ex', 'pms-rooted-card', 'pms-rooted-card-cont', 'pms-rooted-card-subcont'];
    dataMapMoObj.addIndexed(pmsRooted);
  }

  const rootedIcon = document.querySelectorAll('.pms-rooted-card-cont1 .comlist .icon img');
  if (rootedIcon) {
    rootedIcon.forEach((img) => {
      img.setAttribute('alt', 'icon');
    });
  }
  const rootedImg = document.querySelectorAll('.pms-rooted-card1 .icon img');
  if (rootedImg) {
    rootedImg.forEach((img) => {
      img.setAttribute('alt', 'background-image');
    });
  }

  const pmsHighSkin = block.closest('.high-skin');
  if (pmsHighSkin !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['pms-high-skin', 'pms-high-skin-card', 'pms-high-skin-card-cont', 'pms-high-skin-card-subcont'];
    dataMapMoObj.addIndexed(pmsHighSkin);
  }
  // high skin component
  const pmsHighSkinBtn = document.querySelectorAll('.pms-high-skin-card-subcont1 .cards-card-body p a');
  if (pmsHighSkinBtn) {
    pmsHighSkinBtn.forEach((btn) => {
      btn.setAttribute('alt-label', 'hidden');
    });
  }
  const pmsHighSkinImg = document.querySelectorAll('.pms-high-skin-card-subcont1 .cards-card-image img');
  if (pmsHighSkinImg) {
    pmsHighSkinImg.forEach((img) => {
      img.setAttribute('alt', 'coin-img');
    });
  }
  const pmsChoose = block.closest('.pms-choose');
  if (pmsChoose !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['pms-choose', 'pms-choose-detail', 'pms-choose-detail-cont', 'pms-choose-detail-subcont', 'pms-choose-detail-list', 'pms-choose-detail-sublist', 'pms-choose-detail-cls'];
    dataMapMoObj.addIndexed(pmsChoose);
  }

  const pmsChooseLink = document.querySelectorAll('.pms-choose2 h3');
  if (pmsChooseLink) {
    pmsChooseLink.forEach((img) => {
      img.setAttribute('alt-label', 'hidden');
    });
  }
  const pmsChooseImg = document.querySelectorAll('.pms-choose2 pms-choose-detail12 img');
  if (pmsChooseImg) {
    pmsChooseImg.forEach((img) => {
      img.setAttribute('alt', 'tree-img');
    });
  }
  const pmsChooseBtn = document.querySelectorAll('.pms-choose2 .pms-choose-detail11 .button');
  if (pmsChooseBtn) {
    pmsChooseBtn.forEach((btn) => {
      btn.setAttribute('alt-label', 'hidden');
    });
  }

  // aif component start
  const aifCard = block.closest('main').querySelector('.aif-component .cards-wrapper .cards');
  if (aifCard !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['aifCard-ctn', 'aif-each-ex', 'aif-each-in'];
    dataMapMoObj.addIndexed(aifCard);
  }
  // aif component end

  // // Investor Education article left and right wrapper
  // if (window.location.href.includes('/investor-education/all-articles/')
  // || window.location.href.includes('/motilal-oswal-edge/article-details')) {
  //   const maincloser = block.closest('main');
  //   const rightSub = maincloser.querySelectorAll('.article-sub-right');
  //   const rightarticle = maincloser.querySelector('.article-right-wrapper');
  //   Array.from(rightSub).forEach((rightel) => {
  //     rightarticle.append(rightel);
  //   });
  //   const leftSub = maincloser.querySelectorAll('.article-sub-left');
  //   const leftarticle = maincloser.querySelector('.article-left-wrapper');
  //   Array.from(leftSub).forEach((leftel) => {
  //     leftarticle.append(leftel);
  //   });
  //   if (maincloser.querySelector('.moedge-article-details')) {
  //     dataMapMoObj.CLASS_PREFIXES = ['articlemain', 'articlesub', 'articleitem',
  //       'subarticle', 'mainarticle', 'itemarticle', 'itemsubart',
  //       'mainitemart', 'itemmainart', 'submainart'];
  //     dataMapMoObj.addIndexed(
  //       maincloser.querySelector('.moedge-article-details'),
  //     );

  //     const mainleft = maincloser.querySelector('.article-left-wrapper');
  //     dataMapMoObj.CLASS_PREFIXES = ['leftartmain', 'leftartsub', 'leftartitem',
  //       'subleftart', 'mainleftart', 'itemleftart', 'itemleftart',
  //       'mainitemleftart', 'itemmainleftart', 'submainleftart'];
  //     dataMapMoObj.addIndexed(
  //       mainleft,
  //     );
  //   }
  //   const formpath = maincloser.querySelector('.article-right-wrapper .subscribe-email');
  //   const formdiv = formpath
  //     .querySelector('.subscribe-email .button-container');
  //   formBlock(formdiv);
  // }

  // WCS Series
  if (block.closest('.wcs-series-pdf')) {
    dataMapMoObj.CLASS_PREFIXES = ['wcs-mainitem',
      'wcs-subitem', 'wcs-inneritem', 'wcs-subinner',
      'wcs-carditem', 'wcs-cardinner', 'wcs-cardsub'];
    dataMapMoObj.addIndexed(block);
  }

  // cal class strat /s
  const calClass = block.closest('.calc-cards');
  if (calClass !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['cal-item', 'cal-item-sub', 'cal-item-inner', 'sub-cal-item', 'sub-inner-cal-item', 'sub-cal-item-inner'];
    dataMapMoObj.addIndexed(calClass);
  }
  // cal class end

  if (block.closest('main').querySelector('.behind-the-content')) {
    // Find the container that has your special classes
    const mainContainer = block.closest('main')
      .querySelector('.behind-the-content .cards');

    // Only run this pagination logic if we are in the correct block
    if (mainContainer) {
      // Select all the card items
      const items = Array.from(mainContainer.querySelectorAll('li'));
      const itemsPerPage = items.slice(0, 12).length;

      if (items.length > itemsPerPage) {
        dataMapMoObj.setupPagination(mainContainer, items, itemsPerPage);
      }
    }
  }

  // Error Screen adding
  const error = block.closest('.section.screen-400, .section.screen-401, .section.screen-403, .section.screen-408, .section.screen-500, .section.service-screen');
  if (error) {
    const newEle = document.createElement('div');
    newEle.classList.add('errscn-txtwrap');
    const secondP = document.querySelector('.cards-container .cards-card-body p:nth-child(2)');
    const errscnCont = document.querySelector('.cards-container .cards-card-body');
    errscnCont.append(newEle);
    newEle.append(secondP);
    dataMapMoObj.CLASS_PREFIXES = ['error-screen-wrapper', 'error-screen-wrap', 'error-screen-ul', 'error-screen-li', 'errscrn-img-cont', 'errscrn-cont', 'errscrn-inner-cont'];
    dataMapMoObj.addIndexed(error);
  }
}

function decorateArticlePage() {
  const articleDetailsElement = document.querySelector('.moedge-article-details');
  let mainElement;
  if (articleDetailsElement) {
    mainElement = articleDetailsElement.closest('main');
    if (mainElement) {
      mainElement.classList.add('moedge-article-main');
    }
  }

  // const searchContext = mainElement || document;
}

// Run the combined function
decorateArticlePage();

// const subSection = document.querySelectorAll('.section.investment-philosophy');
// dataMapMoObj.CLASS_PREFIXES = [
//   'invest-philo-cont',
//   'invest-philo-sec',
//   'invest-philo-sub',
//   'invest-philo-inner-text',
//   'invest-philo-list',
//   'invest-philo-list-content',
//   'invest-philo-list-row',
// ];
// subSection.forEach((sublist) => dataMapMoObj.addIndexed(sublist));

const subSection = document.querySelectorAll('.section.investment-philosophy');

subSection.forEach((sublist) => {
  dataMapMoObj.CLASS_PREFIXES = [
    'invest-philo-cont',
    'invest-philo-sec',
    'invest-philo-sub',
    'invest-philo-inner-text',
    'invest-philo-list',
    'invest-philo-list-content',
    'invest-philo-list-row',
  ];

  dataMapMoObj.addIndexed(sublist);
});

const newSection = document.querySelectorAll('.our-investing-style.cards-container');
dataMapMoObj.CLASS_PREFIXES = [
  'our-invest-cont',
  'our-invest-sec',
  'our-invest-sub',
  'our-invest-inner-text',
  'our-invest-list',
  'our-invest-list-content',
  'our-invest-list-row',
];
newSection.forEach((sublist) => dataMapMoObj.addIndexed(sublist));

// const emailFields = document.querySelectorAll(
//   '.section.article-sub-right.subscribe-email .field-wrapper.email-wrapper input'
// );

// emailFields.forEach((input) => {
//   const label = input.parentElement.querySelector('label');

//   const toggleLabel = () => {
//     if (input.value.trim() !== '' || document.activeElement === input) {
//       label.classList.add('active');
//     } else {
//       label.classList.remove('active');
//     }
//   };

//   // initialize and attach events
//   toggleLabel();
//   input.addEventListener('focus', toggleLabel);
//   input.addEventListener('blur', toggleLabel);
//   input.addEventListener('input', toggleLabel);
// });

// const listItems = document.querySelectorAll('.behind-the-content.our-author-list li');

// listItems.forEach((item) => {
//   const buttonsInBody = item.querySelectorAll('.cards-card-body .button-container:nth-child(2)');
//   const buttonToMove = buttonsInBody[buttonsInBody.length - 1];
//   const destination = item.querySelector('.cards-card-image');
//   if (buttonToMove && destination) {
//     destination.appendChild(buttonToMove);
//   }
// });
