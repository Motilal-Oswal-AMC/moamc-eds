// eslint-disable-next-line
import { loadEmbed } from "../blocks/embed/embed.js";
import {
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

import dataMapMoObj from './constant.js';
import formBlock, { createForm } from '../blocks/form/form.js';

// eslint-disable-next-line import/no-cycle
import { initializeModalHandlers } from '../blocks/modal/modal.js';
import { img, span } from './dom-helpers.js';

// console.log('f1 code');

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
function wrapImgsInLinks(container) {
  const pictures = container.querySelectorAll('picture');
  pictures.forEach((pic) => {
    const link = pic.nextElementSibling;
    if (link && link.tagName === 'A' && link.href) {
      link.innerHTML = pic.outerHTML;
      pic.replaceWith(link);
    }
  });
}

export function moveAttributes(from, to, attributes) {
  let attrs = attributes;
  if (!attrs) {
    attrs = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attrs.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter(
        (attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-'),
      ),
  );
}

async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
  } catch (e) {
    // do nothing
  }
}

// function autolinkModals(element) {
//   element.addEventListener('click', async (e) => {
//     const origin = e.target.closest('a');

//     if (origin && origin.href && origin.href.includes('/modals/')) {
//       e.preventDefault();
//       const { openModal } = await import(
//         `${window.hlx.codeBasePath}/blocks/modal/modal.js`
//       );
//       openModal(origin.href);
//     }
//   });
// }

// loadEmbed(block,link)

function autolinkVideo(element) {
  const origin = element.querySelector('a');

  if (origin && origin.href && origin.href.includes('/www.youtube.com/')) {
    // e.preventDefault();
    // const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
    // openModal(origin.href);
    loadEmbed(origin, origin.href);
  }
  // });
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // decorateBreadcrumbs();
    // TODO: add auto block, if needed
  } catch (error) {
    // no-console
  }
}

/**
 * Decorate <main> content
 */
export function decorateMain(main) {
  decorateButtons(main);
  decorateIcons(main);
  // buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Load Fragment (keep as is)
 */
export async function loadFragment(path) {
  if (path && path.startsWith('/')) {
    const cleanPath = path.replace(/(\.plain)?\.html/, '');
    const resp = await fetch(`${cleanPath}.plain.html`);
    if (resp.ok) {
      const main = document.createElement('main');
      main.innerHTML = await resp.text();

      const resetAttributeBase = (tag, attr) => {
        main.querySelectorAll(`${tag}[${attr}^="./media_"]`).forEach((elem) => {
          elem[attr] = new URL(
            elem.getAttribute(attr),
            new URL(cleanPath, window.location),
          ).href;
        });
      };
      resetAttributeBase('img', 'src');
      resetAttributeBase('source', 'srcset');

      decorateMain(main);
      await loadSections(main);
      return main;
    }
  }
  return null;
}

export default async function decorateFragment(block) {
  const link = block.querySelector('a');
  const path = link ? link.getAttribute('href') : block.textContent.trim();
  const fragment = await loadFragment(path);
  if (fragment) {
    const fragmentSection = fragment.querySelector(':scope .section');
    if (fragmentSection) {
      block.classList.add(...fragmentSection.classList);
      block.classList.remove('section');
      block.replaceChildren(...fragmentSection.childNodes);
    }
  }
}

/**
 * Auto-block for fragment & YouTube embeds (keep as is)
 */
function decorateAutoBlock(element) {
  element.querySelectorAll('a').forEach((origin) => {
    if (origin && origin.href && origin.href.includes('/fragment/')) {
      const parent = origin.parentElement;
      const div = document.createElement('div');
      div.append(origin);
      parent.append(div);
      decorateFragment(div);
    } else if (
      origin
      && origin.href
      && origin.href.includes('/www.youtube.com/')
    ) {
      loadEmbed(origin, origin.href);
    }
  });
}

async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    buildAutoBlocks(main);
    decorateAutoBlock(doc);
    await loadHeader(doc.querySelector('header'));
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
  try {
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // console.log(e);
  }
}

async function loadLazy(doc) {
  autolinkVideo(doc);
  const main = doc.querySelector('main');
  // if (
  //   window.location.href.includes('/investor-education/all-articles/')
  //   || window.location.href.includes('/motilal-oswal-edge/article-details')
  //   || window.location.href.includes(
  //     '/motilal-oswal-edge/mo-edge-article-image',
  //   )
  //   || window.location.href.includes(
  //     '/motilal-oswal-edge/mo-edge-article-details-d',
  //   )
  //   || window.location.href.includes(
  //     '/motilal-oswal-edge/mo-edge-article-details-image',
  //   )
  //   || window.location.href.includes(
  //     '/motilal-oswal-edge/mo-edge-article-details-video',
  //   )
  // ) {
  //   const maindiv = main.querySelector('.main-wrapper');
  //   // maindiv.classList.add('main-wrapper');
  //   maindiv.append(main.querySelector('.article-left-wrapper'));
  //   maindiv.append(main.querySelector('.article-right-wrapper'));
  //   main.prepend(maindiv);
  //   main.prepend(main.querySelector('[data-id="breadcrumb"]'));
  // }
  wrapImgsInLinks(doc);
  await loadSections(main);
  dataMapMoObj.article();
  // dataMapMoObj.qglpwcs();
  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/* ---------------- Utility ---------------- */
const pad = (num) => String(num).padStart(2, '0');

/* ---------------- Time Left ---------------- */
export function getTimeLeft(targetDateStr) {
  const diffMs = new Date(targetDateStr) - Date.now();

  if (diffMs <= 0) return "Time's up!";

  const totalMinutes = Math.floor(diffMs / 60000); // 1000*60
  const days = Math.floor(totalMinutes / 1440); // 60*24
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  return `${pad(days)} days ${pad(hours)} hrs ${pad(minutes)} mins left`;
}

/* ---------------- Intersection Observer ---------------- */
export function initObserver(block, callback) {
  const observer = new IntersectionObserver((entries, obs) => {
    if (entries.some((e) => e.isIntersecting)) {
      obs.disconnect();
      callback();
    }
  });
  observer.observe(block);
}

/* ---------------- Evaluate By Days ---------------- */
export function evaluateByDays(pastDateStr) {
  const diffDays = Math.floor((Date.now() - new Date(pastDateStr)) / 86400000); // 1000*60*60*24

  if (diffDays < 0) return 'Date is in the future';
  if (diffDays >= 180) return diffDays > 365 ? 'CAGR' : 'Return Annualised';

  return 'Return Annualised';
}

/* ---------------- Wishlist ---------------- */
export function wishlist() {
  const stars = [...document.querySelectorAll('.star-filled')];
  dataMapMoObj.schstar = stars.map((el) => el.getAttribute('schcode'));

  const count = stars.length;
  const watchlistSpan = document.querySelector('.watchlisttext span');
  if (watchlistSpan) {
    watchlistSpan.textContent = `My Watchlist (${count < 10 ? '0' : ''}${count})`;
  }
}

/* ---------------- Fetch Call ---------------- */
// eslint-disable-next-line default-param-last
export async function myAPI(method, url, body = null, customHeaders = {}) {
  const options = { method };

  // 1. Create a clean headers object.
  // Using default param 'customHeaders = {}' ensures this is never undefined.
  // We use spread {...} to create a copy so we don't modify the original.
  const headers = { ...customHeaders };

  if (body) {
    // 2. Check if body is FormData
    if (body instanceof FormData) {
      // Do NOT stringify FormData
      options.body = body;

      // CRITICAL: Remove 'Content-Type'.
      // Let the browser set it to "multipart/form-data; boundary=..."
      if (headers['Content-Type']) {
        delete headers['Content-Type'];
      }
    } else {
      // 3. Handle JSON Body
      options.body = JSON.stringify(body);

      // Ensure Content-Type is JSON (if not overridden by customHeaders)
      if (!headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
      }
    }
  }

  // 4. Assign the sanitized headers object to options
  options.headers = headers;

  const response = await fetch(url, options);

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

export function generateAppId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZ';
  let appId = '';
  for (let i = 0; i < 36; i += 1) {
    appId += chars[Math.floor(Math.random() * chars.length)];
  }
  return appId;
  // return "877C010EM8A9CA4820M987BCB394B48563BE";
}

// export async function myAPI(method, url, body = null, header) {
//   const options = { method };
//   if (body) {
//     options.headers = header !== undefined ? header : { 'Content-Type': 'application/json' };
//     options.body = JSON.stringify(body);
//   }
//   const response = await fetch(url, options);
//   if (!response.ok) throw new Error(`Request failed: ${response.status}`);
//   const text = await response.text();
//   try {
//     return JSON.parse(text);
//   } catch (e) {
//     return text;
//   }
// }
/* ---------------- Expose to window ---------------- */
window.hlx = window.hlx || {};
window.hlx.utils = {
  getTimeLeft,
  evaluateByDays,
  wishlist,
  myAPI,
  generateAppId,
};

/* ---------------- Initialize ---------------- */
const initComponent = (selector, prefixes) => {
  const el = document.querySelector(selector);
  if (el) {
    dataMapMoObj.CLASS_PREFIXES = prefixes;
    dataMapMoObj.addIndexed(el);
  }
  if (document.querySelector('.quicksubactmain2') !== null) {
    Array.from(document.querySelector('.quicksubactmain2').children).forEach(
      (elmain) => {
        elmain.classList.add('quicksubactlist');
      },
    );
  }
};

function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);

  loadDelayed();
}

loadPage();

initComponent('.quick-actions', [
  'quckactmain',
  'quckactmain-sub',
  'quckactmain-sub-wrp',
  'quicksubactmain',
  'quicksubinnactmain',
  'quckaqweactmain',
]);

initComponent('.welcome-component', [
  'welcomemain',
  'welcomemain-sub',
  'welcomemain-sub-wrp',
  'welcomeactmain',
  'welcomeinnactmain',
  'welcomeaqweactmain',
]);

export async function decorateForm(block) {
  const formLink = block.querySelector('a').href;
  const submitLink = '/api';
  // if (!formLink || !submitLink) return;
  const form = await createForm(formLink, submitLink);
  block.replaceChildren(form);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();
    if (valid) {
      // handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  });
}

export function loadAutoBlock(doc) {
  doc.querySelectorAll('a').forEach((ael) => {
    if (ael && ael.href && ael.href.includes('/forms/')) {
      decorateForm(ael.parentElement);
    }
  });
}

initializeModalHandlers();
/* -------------------------
   API UTILS COMMENTED OUT
------------------------- */

/* glp page start */

const glpDecoding = document.querySelector('.glp-decoding');

if (glpDecoding != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'glpcoding',
    'glpcoding-inner',
    'glpcoding-sub-inner',
  ];
  dataMapMoObj.addIndexed(glpDecoding);
}

/* glp page End */

/* Gift City Start */
const chooseGift = document.querySelector('.choose-gift');

if (chooseGift != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'gift-choose',
    'gift-choose-inner',
    'gift-choose-sub-inner',
    'gift-choose-sub-inner-sub',
    'gift-choose-sub-inner-sub-inner',
    'choose-gift-sub-inner-sub-inner',
  ];
  dataMapMoObj.addIndexed(chooseGift);
}

/* Gift City End */

const tabLinks = document.querySelectorAll('.table-wrapper');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        Array.from(document.querySelectorAll('.fdp-tab .comlist')).forEach(
          (el) => {
            const b = el.querySelector('a').getAttribute('href');
            if (entry.target.getAttribute('data-id') === b) {
              el.children[0].classList.add('active');
            } else {
              el.children[0].classList.remove('active');
            }
          },
        );
      }
    });
  },
  {
    root: null, // viewport
    threshold: 0, // trigger when 0.3 30% of the section is visible
    rootMargin: '0px 0px -40% 0px', // triggers a bit earlier
  },
);

tabLinks.forEach((section) => observer.observe(section));

// *Calculators card  starts *//

const calculatorsCard = document.querySelector('.calculators-cards');

if (calculatorsCard != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'cal-car',
    'cal-car-inner',
    'cal-car-sub-inner',
    'cal-car-sub-inner-sub',
    'cal-car-sub-inner-sub-inner',
  ];
  dataMapMoObj.addIndexed(calculatorsCard);
}

// *Calculators card  End *//
// // article
function articleStructure() {
  // Investor Education article left and right wrapper
  if (
    window.location.href.includes('/investor-education/all-articles/')
    || window.location.href.includes('/motilal-oswal-edge/insights/blogs')
    || window.location.href.includes('/motilal-oswal-edge/article-details')
    || window.location.href.includes(
      '/motilal-oswal-edge/mo-edge-article-image',
    )
    || window.location.href.includes(
      '/motilal-oswal-edge/mo-edge-article-details-d',
    )
    || window.location.href.includes(
      '/motilal-oswal-edge/mo-edge-article-details-image',
    )
    || window.location.href.includes(
      '/motilal-oswal-edge/mo-edge-article-details-video',
    )
    || window.location.href.includes(
      '/investor-education/keys-of-investing/',
    )
    || window.location.href.includes(
      '/motilal-oswal-edge/insights/',
    )
    || window.location.href.includes(
      '/investor-education/blogs/',
    )
  ) {
    const maincloser = document.querySelector('main');
    const rightSub = maincloser.querySelectorAll('.article-sub-right');
    const rightarticle = maincloser.querySelector('.article-right-wrapper');
    Array.from(rightSub).forEach((rightel) => {
      rightarticle.append(rightel);
    });
    const leftSub = maincloser.querySelectorAll('.article-sub-left');
    const leftarticle = maincloser.querySelector('.article-left-wrapper');
    Array.from(leftSub).forEach((leftel) => {
      leftarticle.append(leftel);
    });

    Array.from(leftSub).forEach((subleft) => {
      dataMapMoObj.CLASS_PREFIXES = [
        'investarticle-leftmain',
        'investarticle-leftsub',
        'investarticle-leftinner',
        'investsub-leftarticle',
        'investleft-subinner',
        'investleft-articleitem',
        'investleft-itemchild',
        'investleft-subchild',
      ];
      dataMapMoObj.addIndexed(subleft);
    });

    Array.from(rightSub).forEach((subright) => {
      dataMapMoObj.CLASS_PREFIXES = [
        'investarticle-rightmain',
        'investarticle-rightsub',
        'investarticle-rightinner',
        'investsub-rightarticle',
        'investright-subinner',
        'investright-articleitem',
        'investright-itemchild',
        'investright-subchild',
      ];
      dataMapMoObj.addIndexed(subright);
    });
    const maindiv = maincloser.querySelector('.main-wrapper');
    maindiv.classList.add('open-share-popup');
    // maindiv.classList.add('main-wrapper');
    maindiv.append(maincloser.querySelector('.article-left-wrapper'));
    maindiv.append(maincloser.querySelector('.article-right-wrapper'));
    maincloser.prepend(maindiv);
    maincloser.prepend(maincloser.querySelector('[data-id="breadcrumb"]'));
    if (maincloser.querySelector('.moedge-article-details')) {
      dataMapMoObj.CLASS_PREFIXES = [
        'articlemain',
        'articlesub',
        'articleitem',
        'subarticle',
        'mainarticle',
        'itemarticle',
        'itemsubart',
        'mainitemart',
        'itemmainart',
        'submainart',
      ];
      dataMapMoObj.addIndexed(
        maincloser.querySelector('.moedge-article-details'),
      );
      const mainleft = maincloser.querySelector('.article-left-wrapper');
      dataMapMoObj.CLASS_PREFIXES = [
        'leftartmain',
        'leftartsub',
        'leftartitem',
        'subleftart',
        'mainleftart',
        'itemleftart',
        'itemleftart',
        'mainitemleftart',
        'itemmainleftart',
        'submainleftart',
      ];
      dataMapMoObj.addIndexed(mainleft);
    }
    // if (maincloser.querySelector('.moedge-article-details')) {
    //   const videoContainer = maincloser.querySelector('.moedge-article-video-container');

    //   if (videoContainer) {
    //     const allWrappers = videoContainer.querySelectorAll('.default-content-wrapper');

    //     // Array of class names you wanted to map
    //     const classPrefixes = [
    //       'main-article-content',
    //       'main-article-heading',
    //       'main-article-para',
    //       'main-article-subheading'
    //     ];

    //     allWrappers.forEach((wrapper, index) => {
    //       // Check if we have a class name for this specific index
    //       if (classPrefixes[index]) {
    //         wrapper.classList.add(classPrefixes[index]);
    //       } else {
    //         // Fallback for items exceeding the array length
    //         wrapper.classList.add('main-article-general');
    //       }
    //     });
    //   }
    // }
    const container = document.querySelector('.moedge-article-video-container');

    if (container) {
      const wrappers = container.querySelectorAll('.default-content-wrapper');

      wrappers.forEach((wrapper) => {
        wrapper.classList.add('default-content');
      });
    }

    const formpath = maincloser.querySelector(
      '.article-right-wrapper .subscribe-email',
    );
    const formdiv = formpath.querySelector(
      '.subscribe-email .button-container',
    );
    formBlock(formdiv);

    const mainArticle1 = maincloser.querySelector(
      '.moedge-article-video .mainarticle1',
    );
    const mainArticle2 = maincloser.querySelector(
      '.moedge-article-video .mainarticle2',
    );

    if (
      mainArticle1
      && mainArticle2
      && mainArticle1.parentNode === mainArticle2.parentNode
    ) {
      const parent = mainArticle1.parentNode;
      const wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('articles-wrapper');
      parent.insertBefore(wrapperDiv, mainArticle1);
      wrapperDiv.appendChild(mainArticle1);
      wrapperDiv.appendChild(mainArticle2);
    } else if (maincloser.querySelector('.moedge-article-details')) {
      const mainArticle3 = maincloser.querySelector(
        '.moedge-article-details .mainarticle1',
      );
      const mainArticle4 = maincloser.querySelector(
        '.moedge-article-details .mainarticle2',
      );
      const parent = mainArticle3.parentNode;
      const wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('articles-wrapper');
      parent.insertBefore(wrapperDiv, mainArticle3);
      wrapperDiv.appendChild(mainArticle3);
      wrapperDiv.appendChild(mainArticle4);
      const maindiver = maincloser.querySelector('.main-wrapper');
      // maindiv.classList.add('main-wrapper');
      maindiver.append(maincloser.querySelector('.article-left-wrapper'));
      maindiver.append(maincloser.querySelector('.article-right-wrapper'));
      maincloser.prepend(maindiver);
      maincloser.prepend(maincloser.querySelector('[data-id="breadcrumb"]'));
      // const main1 = maincloser.querySelector('.article-left-wrapper');
      // const main2 = maincloser.querySelector('.article-right-wrapper');
      // const mainwrapperDiv = maincloser.querySelector('.main-wrapper');
      // mainwrapperDiv.appendChild(main1);
      // mainwrapperDiv.appendChild(main2);
    }

    // const shareWrapper = document.querySelector('.itemmainleftart3');
    const openSharePopup = document.querySelector('.open-share-popup');
    const shareBtn = openSharePopup.querySelector('.icon-share-black');
    const dropdown = openSharePopup.querySelector('.submainleftart2');
    let dropdownV2;
    if (dropdown === null) {
      const sharemedia = `<ul class="comlist list-share-media">
                        <li class="listindex1"><a title="Facebook"><span class="icon icon-facebookfdp"><img data-icon-name="facebookfdp" src="/icons/facebookfdp.svg" alt="" loading="lazy" width="16" height="16"></span>Facebook</a></li>
                        <li class="listindex2"><a title="WhatsApp"><span class="icon icon-whatsapp"><img data-icon-name="whatsapp" src="/icons/whatsapp.svg" alt="" loading="lazy" width="16" height="16"></span>WhatsApp</a></li>
                        <li class="listindex3"><a title="X"><span class="icon icon-Twitter"><img data-icon-name="Twitter" src="/icons/Twitter.svg" alt="" loading="lazy" width="16" height="16"></span>X</a></li>
                        <li class="listindex4"><a title="Copy"><span class="icon icon-copyfdp"><img data-icon-name="copyfdp" src="/icons/copyfdp.svg" alt="" loading="lazy" width="16" height="16"></span>Copy</a></li>
                        <li class="listindex5" style="display: none; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 999;">URL Copied</li>
                      </ul>`;
      const sharemediaV2 = document.createElement('div');
      sharemediaV2.classList.add('list-share-popup');
      // sharemediaV2.style.display = 'none';
      sharemediaV2.innerHTML += sharemedia;
      shareBtn.closest('li').appendChild(sharemediaV2);
      shareBtn.closest('li').classList.add('mediaicons');
      dropdownV2 = openSharePopup.querySelector('.list-share-popup');
    }
    if (openSharePopup) {
      // Toggle dropdown when clicking share icon
      shareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dropdown !== null) {
          dropdown.classList.toggle('active');
        } else if (dropdownV2 !== null) {
          dropdownV2.classList.toggle('active');
        }
      });

      // Close dropdown on outside click
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.open-share-popup')) {
          dropdown.classList.remove('active');
        }
      });
    }

    // document.querySelectorAll('.comlist.submainart3.itemmainleftart3').forEach((listItem) => {
    //   const ul = listItem.querySelector('.list-share-popup');
    //   if (!ul) return;

    //   [...ul.children].forEach((li, index) => {
    //     li.classList.add(`listindex${index + 1}`);
    //   });
    // });

    document.querySelectorAll('.mediaicons').forEach((item) => {
      const shareIcon = item.querySelector('.icon-share-black');
      const popup = item.querySelector('.list-share-popup');

      if (!shareIcon || !popup) return;

      // Hide popup initially
      popup.classList.remove('active');

      // TOGGLE popup
      shareIcon.addEventListener('click', (e) => {
        e.stopPropagation();

        const isVisible = popup.style.display === 'block';
      });

      // GET SHARE TEXT + URL
      const getShareData = () => {
        const shareUrl = window.location.href;
        const shareText = item.querySelector('h3')?.innerText || 'Check this out';
        return { shareUrl, shareText };
      };

      // FACEBOOK
      const fb = popup.querySelector('.listindex1');
      if (fb) {
        fb.querySelector('a').removeAttribute('href');
        fb.addEventListener('click', (e) => {
          e.stopPropagation();
          const { shareUrl } = getShareData();
          const link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          window.open(link, '_blank');
        });
      }

      // WHATSAPP
      const wa = popup.querySelector('.listindex2');
      if (wa) {
        wa.querySelector('a').removeAttribute('href');
        wa.addEventListener('click', (e) => {
          e.stopPropagation();
          const { shareUrl, shareText } = getShareData();
          const link = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
          window.open(link, '_blank');
        });
      }

      // X (TWITTER)
      const tw = popup.querySelector('.listindex3');
      if (tw) {
        tw.querySelector('a').removeAttribute('href');
        tw.addEventListener('click', (e) => {
          e.stopPropagation();
          const { shareUrl, shareText } = getShareData();
          const link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          window.open(link, '_blank');
        });
      }

      // COPY URL
      // COPY BUTTON (listindex4)
      const cp = popup.querySelector('.listindex4');
      const copyPopup = popup.querySelector('.listindex5');

      if (cp && copyPopup) {
        // hide listindex5 initially
        copyPopup.style.display = 'none';
        copyPopup.style.position = 'absolute';
        copyPopup.style.left = '50%';
        copyPopup.style.top = '50%';
        copyPopup.style.transform = 'translate(-50%, -50%)';
        copyPopup.style.zIndex = '999';

        cp.querySelector('a')?.removeAttribute('href');

        cp.addEventListener('click', async (e) => {
          e.stopPropagation();

          try {
            await navigator.clipboard.writeText(window.location.href);

            // show centered popup (listindex5)
            copyPopup.style.display = 'block';

            // auto-hide after 2 sec
            setTimeout(() => {
              copyPopup.style.display = 'none';
            }, 2000);
          } catch (err) {
            console.log('Copy failed', err);
          }
        });
      }
    });

    const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
    delay(2000).then(() => {
      let blokform;
      if (formdiv.querySelector('#form-email-1')) {
        blokform = formdiv.querySelector('#form-email-1');
      } else if (formdiv.querySelector('#form-email')) {
        blokform = formdiv.querySelector('#form-email');
      }
      // const footerfield = formdiv.querySelector('.footer-section2 .footer-sub-cont2');
      // footerfield.style.display = 'none';
      // blokform.style.display = 'none';
      if (blokform !== null && blokform !== undefined) {
        const elemObj = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const formem = blokform;
        formem.classList.add('email-imput');
        formem.addEventListener('input', (event) => {
          const closblock = event.target.closest('.footer');
          elemObj.errorelm = closblock;
          if (closblock.querySelector('.errormsg') === null) {
            closblock.querySelector('.field-wrapper').append(span({ class: 'errormsg' }, 'Enter a valid email address'));
          }
          const inpval = event.target.value;
          const inpelm = event.target.parentElement.classList;
          if (inpval.length < 1) {
            inpelm.remove('email-fail');
            inpelm.remove('email-success');
            closblock.querySelector('.errormsg').style.display = 'none';
            formem.nextElementSibling.style.display = 'none';
          } else if (emailRegex.test(inpval)) {
            closblock.querySelector('.errormsg').style.display = 'none';
            inpelm.remove('email-fail');
            formem.nextElementSibling.style.display = 'none';
            // inpelm.add('email-success');
          } else {
            closblock.querySelector('.errormsg').style.display = 'block';
            inpelm.add('email-fail');
            formem.nextElementSibling.style.display = 'block';
            // inpelm.remove('email-success');
          }
        });
        const wrapperimg = document.createElement('div');
        wrapperimg.classList.add('wrapimgform');
        wrapperimg.append(formem);
        wrapperimg.append(img({
          src: '/icons/error-cross.svg',
          alt: 'Img',
          class: 'crossimg',
          onclick: () => {
            formem.value = '';
            formem.parentElement.classList.remove('email-fail');
            elemObj.errorelm.querySelector('.errormsg').style.display = 'none';
            formem.nextElementSibling.style.display = 'none';
          },
        }));
        formdiv.querySelector('.email-wrapper').append(wrapperimg);
        formdiv.querySelector('.submit-btn .button').addEventListener('click', () => {
          if (emailRegex.test(formem.value)) {
            elemObj.errorelm.querySelector('.errormsg').style.display = 'none';
            formem.closest('.wrapimgform').classList
              .remove('email-fail');
            formem.closest('.wrapimgform').classList
              .add('email-success');
            formem.nextElementSibling.style.display = 'none';
          }
        });
      }
    });
  }
}
dataMapMoObj.article = articleStructure;

const chooseUs = document.querySelector('.why-choose-us');
if (chooseUs != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'choose-title',
    'choose-us-para',
    'choose-us-img',
  ];
  dataMapMoObj.addIndexed(chooseUs);
  Array.from(chooseUs.querySelectorAll('img')).forEach((ele, index) => {
    if (index === 0) {
      ele.setAttribute('fetchpriority', 'high');
    }
  });
}

const chooseusCard = document.querySelector('.why-choose-card');
if (chooseusCard != null) {
  dataMapMoObj.CLASS_PREFIXES = ['card-image', 'card-title', 'card-subtitle'];
  dataMapMoObj.addIndexed(chooseusCard);
}

// qglp static class appending
const qglpStaticComponent = document.querySelector('.qglp-static-component');
if (qglpStaticComponent != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'qglp-static-ctn',
    'qglp-static-ext',
    'qglp-static-int',
    'qglp-static-wrp',
    'qglp-static-box',
    'qglp-static-ls-ul',
    'qglp-static-ls-li',
  ];
  dataMapMoObj.addIndexed(qglpStaticComponent);
}

// why qglp componet  start
const whyQGLPComponent = document.querySelector(
  '.why-qglp .default-content-wrapper',
);
if (whyQGLPComponent != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'why-qglp-ctn',
    'why-qglp-ext',
    'why-qglp-int',
    'why-qglp-wrp',
    'why-qglp-box',
    'why-qglp-ls-ul',
    'why-qglp-ls-li',
  ];
  dataMapMoObj.addIndexed(whyQGLPComponent);
}
// why qglp componet end

// why qglp componet  start
const promiseQGLP = document.querySelector(
  '.promise-qglp .default-content-wrapper',
);
if (promiseQGLP != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'promise-qglp-ctn',
    'promise-qglp-ext',
    'promise-qglp-int',
    'promise-qglp-wrp',
    'promise-qglp-box',
  ];
  dataMapMoObj.addIndexed(promiseQGLP);
}
// why qglp componet end
const whyQGLPWrp = document.querySelector('.why-qglp .default-content-wrapper');

if (whyQGLPWrp) {
  whyQGLPWrp.classList.add('why-qglp-wrapper');
  // why qglp css lent end
}

// promise qglp css lent start
const promiseQGLPWrp = document.querySelector(
  '.promise-qglp .default-content-wrapper',
);

if (promiseQGLPWrp) {
  promiseQGLPWrp.classList.add('promise-qglp-wrapper');
  // why qglp css lent end
}
// promise qglp css lent end

// Skin the game static start
const highskinText = document.querySelector('.high-skin-text');
if (highskinText != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'high-skin-wrap-one',
    'high-skin-wrap-two',
    'high-skin-wrap-three',
    'high-skin-heading',
    'high-skin-subheading',
    'high-skin-paragraph',
    'high-skin-paragraph-one',
    'high-skin-paragraph-two',
  ];
  dataMapMoObj.addIndexed(highskinText);
}
const highimageComponent = document.querySelector('.high-image-component');
if (highimageComponent != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'high-skin-component-wrap',
    'high-skin-component-heading',
    'high-skin-component-paragraph',
    'high-skin-component-ctn',
    'high-skin-component-external',
    'high-skin-component-internal',

  ];
  dataMapMoObj.addIndexed(highimageComponent);
}

const skinmoamcComponent = document.querySelector('.skin-moamc-component');
if (skinmoamcComponent != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'moamc-component-wrap',
    'moamc-component-main-head',
    'moamc-component-title',
    'moamc-component-para',
    'moamc-component-para-one',
    'moamc-component-para-two',
    'moamc-component-para-three',

  ];
  dataMapMoObj.addIndexed(skinmoamcComponent);
}

const privacyPolicy = document.querySelectorAll('.privacy-policy-banner');

const privacyPolicyArr = Array.from(privacyPolicy);
privacyPolicyArr.forEach((child) => {
  if (child != null) {
    dataMapMoObj.CLASS_PREFIXES = [
      'pp-banner-wrap',
      'pp-banner-block',
      'pp-banner-img',
      'pp-banner-imginner',
      'pp-banner-picture',
      'pp-banner-pictureinner',
    ];
    dataMapMoObj.addIndexed(child);
  }
});

const skinstakeComponent = document.querySelector('.what-stake-component');
if (skinstakeComponent != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'stake-component-wrap',
    'stake-component-main-head',
    'stake-component-title',
    'stake-component-para',
    'stake-component-para-one',
    'stake-component-para-two',
    'stake-component-img',
    'stake-img-card-wrap',
    'stake-img-card-wrap-img',
  ];
  dataMapMoObj.addIndexed(skinstakeComponent);
}

try {
  const whymattersComponent = document.querySelector('.why-matters-component');
  if (whymattersComponent != null) {
    dataMapMoObj.CLASS_PREFIXES = [
      'why-matters-wrap',
      'why-matters-heading',
      'why-matters-para',
      'why-matters-icon',
      'why-matters-title',
      'why-matters-sub-title',
      'why-matters-text',
      'why-matters-card-wrap',
      'why-matters-card-icon',
      'why-matters-card-text1',
      'why-matters-card-text2',
      'why-matters-card-text3',
    ];
    dataMapMoObj.addIndexed(whymattersComponent);
  }

  const container = document.querySelector('.section.why-matters-component.cards-container');

  const wrapper = document.createElement('div');
  wrapper.classList.add('why-matters-wrapper-in');

  const wrap1 = container.querySelector('.why-matters-wrap1');
  const wrap2 = container.querySelector('.why-matters-wrap2');

  container.insertBefore(wrapper, container.firstChild);

  wrapper.appendChild(wrap1);
  wrapper.appendChild(wrap2);
} catch (error) {
  // console.log(error);
}
// Skin the game static end

// conclusion container start
const conclusion = document.querySelector('.section.conclusion');
if (conclusion != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'conclusion-main',
    'conclusion-title',
    'conclusion-para',
    'conclusion-para-one',
    'conclusion-para-two',
  ];
  dataMapMoObj.addIndexed(conclusion);
}
// conclusion container end

// Adding custom scrollbar to WCS pages
try {
  if (document.querySelector('header [data-id="wcs-header"]')) {
    document.body.classList.add('custom-scroll');
  }
} catch (error) {
  // console.log(error);
}

async function getlisting() {
  const resp = await myAPI('GET', 'https://m71vqgw4cj.execute-api.ap-south-1.amazonaws.com/dev/api/public/v1/funds/listing');
  return resp;
}
dataMapMoObj.getlisting = getlisting;

async function getscheme(param) {
  const resp = await myAPI('GET', `https://m71vqgw4cj.execute-api.ap-south-1.amazonaws.com/dev/api/public/v1/funds?schcode=${param}`);
  return resp;
}
dataMapMoObj.getscheme = getscheme;

async function getfundmanager(param) {
  const resp = await myAPI('GET', `https://m71vqgw4cj.execute-api.ap-south-1.amazonaws.com/dev/api/public/v1/funds/manager?schcode=${param}`);
  return resp;
}
dataMapMoObj.getfundmanager = getfundmanager;

async function getinsights() {
  const resp = await myAPI('GET', 'https://main--moamc-eds--motilal-oswal-amc.aem.live/query-index-insights.json');
  return resp;
}
dataMapMoObj.getinsights = getinsights;

async function getinvestorblog() {
  const resp = await myAPI('GET', 'https://main--moamc-eds--motilal-oswal-amc.aem.live/query-index-investorblog.json');
  return resp;
}
dataMapMoObj.getinvestorblog = getinvestorblog;
// dataMapMoObj.qglpwcs = qglpwcs;
