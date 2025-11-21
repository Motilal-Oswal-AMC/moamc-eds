// eslint-disable-next-line
import {
  loadEmbed,
} from '../blocks/embed/embed.js';
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
import formBlock, {
  createForm,
} from '../blocks/form/form.js';

// eslint-disable-next-line import/no-cycle
import {
  initializeModalHandlers,
} from '../blocks/modal/modal.js';

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
    attrs = [...from.attributes].map(({
      nodeName,
    }) => nodeName);
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
      .map(({
        nodeName,
      }) => nodeName)
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
          elem[attr] = new URL(elem.getAttribute(attr), new URL(cleanPath, window.location)).href;
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
    } else if (origin && origin.href && origin.href.includes('/www.youtube.com/')) {
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
  if (window.location.href.includes('/investor-education/all-articles/') || window.location.href.includes('/motilal-oswal-edge/article-details') || window.location.href.includes('/motilal-oswal-edge/mo-edge-article-image') || window.location.href.includes('/motilal-oswal-edge/mo-edge-article-details-d') || window.location.href.includes('/motilal-oswal-edge/mo-edge-article-details-image') || window.location.href.includes('/motilal-oswal-edge/mo-edge-article-details-video')) {
    const maindiv = main.querySelector('.main-wrapper');
    // maindiv.classList.add('main-wrapper');
    maindiv.append(main.querySelector('.article-left-wrapper'));
    maindiv.append(main.querySelector('.article-right-wrapper'));
    main.prepend(maindiv);
  }
  wrapImgsInLinks(doc);
  await loadSections(main);
  dataMapMoObj.article();
  dataMapMoObj.qglpwcs();

  const {
    hash,
  } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
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
    Array.from(document.querySelector('.quicksubactmain2').children).forEach((elmain) => {
      elmain.classList.add('quicksubactlist');
    });
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
  'quckactmain', 'quckactmain-sub', 'quckactmain-sub-wrp',
  'quicksubactmain', 'quicksubinnactmain', 'quckaqweactmain',
]);

initComponent('.welcome-component', [
  'welcomemain', 'welcomemain-sub', 'welcomemain-sub-wrp',
  'welcomeactmain', 'welcomeinnactmain', 'welcomeaqweactmain',
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

const tabLinks = document.querySelectorAll('.table-wrapper');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      Array.from(document.querySelectorAll('.fdp-tab .comlist')).forEach((el) => {
        const b = el.querySelector('a').getAttribute('href');
        if (entry.target.getAttribute('data-id') === b) {
          el.children[0].classList.add('active');
        } else {
          el.children[0].classList.remove('active');
        }
      });
    }
  });
}, {
  root: null, // viewport
  threshold: 0, // trigger when 0.3 30% of the section is visible
  rootMargin: '0px 0px -40% 0px', // triggers a bit earlier
});

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
  if (window.location.href.includes('/investor-education/all-articles/') || window.location.href.includes('/motilal-oswal-edge/article-details') || window.location.href.includes('/motilal-oswal-edge/mo-edge-article-image') || window.location.href.includes('/motilal-oswal-edge/mo-edge-article-details-d') || window.location.href.includes('/motilal-oswal-edge/mo-edge-article-details-image') || window.location.href.includes('/motilal-oswal-edge/mo-edge-article-details-video')) {
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
    if (maincloser.querySelector('.moedge-article-details')) {
      dataMapMoObj.CLASS_PREFIXES = ['articlemain', 'articlesub', 'articleitem',
        'subarticle', 'mainarticle', 'itemarticle', 'itemsubart',
        'mainitemart', 'itemmainart', 'submainart'];
      dataMapMoObj.addIndexed(
        maincloser.querySelector('.moedge-article-details'),
      );

      const mainleft = maincloser.querySelector('.article-left-wrapper');
      dataMapMoObj.CLASS_PREFIXES = ['leftartmain', 'leftartsub', 'leftartitem',
        'subleftart', 'mainleftart', 'itemleftart', 'itemleftart',
        'mainitemleftart', 'itemmainleftart', 'submainleftart'];
      dataMapMoObj.addIndexed(
        mainleft,
      );
    }
    const formpath = maincloser.querySelector('.article-right-wrapper .subscribe-email');
    const formdiv = formpath
      .querySelector('.subscribe-email .button-container');
    formBlock(formdiv);

    const mainArticle1 = maincloser.querySelector('.moedge-article-video .mainarticle1');
    const mainArticle2 = maincloser.querySelector('.moedge-article-video .mainarticle2');

    if (mainArticle1 && mainArticle2 && mainArticle1.parentNode === mainArticle2.parentNode) {
      const parent = mainArticle1.parentNode;
      const wrapperDiv = document.createElement('div');
      wrapperDiv.classList.add('articles-wrapper');
      parent.insertBefore(wrapperDiv, mainArticle1);
      wrapperDiv.appendChild(mainArticle1);
      wrapperDiv.appendChild(mainArticle2);
    }
  }
}
dataMapMoObj.article = articleStructure;

function qglpwcs() {
  const mainbl = document.querySelector('main');
  const data = mainbl.querySelectorAll('.tab-glp');
  if (data.length !== 0) {
    data.forEach((ele) => {
      if (ele != null) {
        dataMapMoObj.CLASS_PREFIXES = [
          'glp-tab-block',
          'glp-tab-inner',
          'glp-tab-sub-inner',
          'glp-tab-sub-inner-sub',
          'glp-tab-ul',
          'glp-tab-inner-ul',
          'glp-tab-li',
          'glp-tab-sub-inner-ul',
          'glp-tab-inner-li',
          'glp-tab-sub-inner-li',
          'glp-tab-sub-inner-li-sub',
          'glp-li',
          'glp-li-inner',
        ];
        dataMapMoObj.addIndexed(ele);

        const addClassName = ele.querySelectorAll('.glp-tab-li1');
        if (addClassName) {
          addClassName.forEach((elem) => {
            elem.classList.add('li-containers');
          });
        }

        const addClassNameli = ele.querySelectorAll('.glp-tab-sub-inner-ul2');
        if (addClassNameli) {
          addClassNameli.forEach((elem) => {
            elem.classList.add('same-li');
          });
        }

        const addClassNamel = ele.querySelectorAll('.glp-tab-sub-inner-ul1');
        if (addClassNamel) {
          addClassNamel.forEach((elem) => {
            elem.classList.add('same-li');
          });
        }
      }
    });
  }
}
dataMapMoObj.qglpwcs = qglpwcs;

const chooseUs = document.querySelector('.why-choose-us');
if (chooseUs != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'choose-title',
    'choose-us-para',
    'choose-us-img',
  ];
  dataMapMoObj.addIndexed(chooseUs);
}

const chooseusCard = document.querySelector('.why-choose-card');
if (chooseusCard != null) {
  dataMapMoObj.CLASS_PREFIXES = [
    'card-image',
    'card-title',
    'card-subtitle',
  ];
  dataMapMoObj.addIndexed(chooseusCard);
}

// qglp static class appending
const qglpStaticComponent = document.querySelector('.qglp-static-component');
if (qglpStaticComponent != null) {
  dataMapMoObj.CLASS_PREFIXES = ['qglp-static-ctn', 'qglp-static-ext', 'qglp-static-int', 'qglp-static-wrp', 'qglp-static-box', 'qglp-static-ls-ul', 'qglp-static-ls-li'];
  dataMapMoObj.addIndexed(qglpStaticComponent);
}

// why qglp componet  start
const whyQGLPComponent = document.querySelector('.why-qglp .default-content-wrapper');
if (whyQGLPComponent != null) {
  dataMapMoObj.CLASS_PREFIXES = ['why-qglp-ctn', 'why-qglp-ext', 'why-qglp-int', 'why-qglp-wrp', 'why-qglp-box', 'why-qglp-ls-ul', 'why-qglp-ls-li'];
  dataMapMoObj.addIndexed(whyQGLPComponent);
}
// why qglp componet end

// why qglp componet  start
const promiseQGLP = document.querySelector('.promise-qglp .default-content-wrapper');
if (promiseQGLP != null) {
  dataMapMoObj.CLASS_PREFIXES = ['promise-qglp-ctn', 'promise-qglp-ext', 'promise-qglp-int', 'promise-qglp-wrp', 'promise-qglp-box'];
  dataMapMoObj.addIndexed(promiseQGLP);
}
// why qglp componet end

// why qglp css lent start
const whyQGLPWrp = document.querySelector('.why-qglp .default-content-wrapper');

if (whyQGLPWrp) {
  whyQGLPWrp.classList.add("why-qglp-wrapper");
  // why qglp css lent end
}
// why qglp css lent end

// promise qglp css lent start
const promiseQGLPWrp = document.querySelector('.promise-qglp .default-content-wrapper');

if (promiseQGLPWrp) {
  promiseQGLPWrp.classList.add("promise-qglp-wrapper");
  // why qglp css lent end
}
// promise qglp css lent end

