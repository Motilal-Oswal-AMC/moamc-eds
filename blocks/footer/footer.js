/* */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import dataMapMoObj from '../../scripts/constant.js';
import { loadAutoBlock } from '../../scripts/scripts.js';
import { img, span } from '../../scripts/dom-helpers.js';

/**
 * Initializes the scroll-to-top button.
 */
function initScrollToTop() {
  let scrollBtn = document.querySelector('.scroll-to-top');

  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" 
           width="12" height="18" viewBox="0 0 14 21" fill="none"
           class="scroll-to-top-icon">
        <path d="M1 7.8125L7 1.8125M7 1.8125L13 7.8125M7 1.8125V19.8125" />
      </svg>
    `;
    document.querySelector('footer').appendChild(scrollBtn);
  }

  // Show/hide button
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  // Smooth scroll
  scrollBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const mainBlock = block.closest('body');
  const download = mainBlock.querySelector('main .download');
  if (mainBlock.querySelector('header [data-id="wcs-header"]')) {
    block.closest('footer').style.display = 'none';
  }
  if (download != null) {
    dataMapMoObj.CLASS_PREFIXES = [
      'download-p',
      'download-ul',
      'download-li',
      'download-inner-ul',
      'download-first-list',
      'download-second-list',
    ];
    dataMapMoObj.addIndexed(download);
  }
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  // index with your class prefixes
  dataMapMoObj.CLASS_PREFIXES = [
    'footer-container',
    'footer-section',
    'footer-sub',
    'footer-sub-cont',
    'section-content',
    'list-items',
    'list-inneritem-',
  ];
  dataMapMoObj.addIndexed(block);

  const evenFunc = block.querySelector('.mob-accordion .footer-sub2');
  const eventv2 = evenFunc.querySelector('.section-content1 .list-items2');
  const eventv3 = eventv2.querySelector('.list-inneritem-1').children;
  Array.from(eventv3).forEach((eventElem) => {
    eventElem.querySelector('a').removeAttribute('href');
    eventElem.addEventListener('click', (event) => {
      const textCurr = event.target.textContent
        .toLowerCase().replaceAll(' funds', '');
      let joinstr = textCurr.split(' ').join('-').toLowerCase();
      // console.log(joinstr);
      if (joinstr === 'index') {
        joinstr = 'index-funds';
      }
      dataMapMoObj.selectviewFunds = joinstr;

      localStorage.setItem('viewmark', dataMapMoObj.selectviewFunds);
      const pathname = '/mutual-fund/in/en/our-funds';
      window.location.href = `${window.location.origin}${pathname}`;
    });
  });
  // const logoContainers = document.querySelector('.footer-sub-cont1 .section-content1');

  // logoContainers.forEach((container) => {
  //   // Change the cursor to a pointer to show it's clickable.
  //   container.style.cursor = 'pointer';

  //   // Add the click event listener to redirect to the home page.
  //   container.addEventListener('click', () => {
  //     window.location.href = 'https://mosldevexp--eds-cloud--rupeshdept.aem.live/mutual-fund/in/en/home-page';
  //   });
  // });

  block.querySelectorAll('.accordion-item-body .list-inneritem-1').forEach((ele) => {
    Array.from(ele.children).forEach((el) => {
      el.classList.add('list-innerlist');
    });
  });

  Array.from(block.querySelector('.list-items2').children).forEach((lieltwo) => {
    lieltwo.classList.add('item-list');
    Array.from(lieltwo.children).forEach((elrt) => {
      elrt.classList.add('item-anchor');
    });
  });

  // open all footer accordions by default
  const acccontain = block.querySelector('.footer-sub2 .accordion')?.children;
  if (acccontain) {
    Array.from(acccontain).forEach((itemel) => {
      if (!itemel.hasAttribute('open')) {
        itemel.setAttribute('open', '');
      }
    });
  }

  // wrap .footer-sub-cont2 and .footer-sub-cont3 in a container
  const social = footer.querySelector('.footer-sub-cont2');
  const store = footer.querySelector('.footer-sub-cont3');
  if (social && store) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('footer-sub-wrapper');
    social.before(wrapper);
    wrapper.append(social, store);

    dataMapMoObj.altFunction(
      wrapper.querySelector('.footer-sub-cont2 .section-content1 img'),
      'facebook-icon',
    );
    dataMapMoObj.altFunction(
      wrapper.querySelector('.footer-sub-cont2 .section-content2 img'),
      'instagram-icon',
    );
    dataMapMoObj.altFunction(
      wrapper.querySelector('.footer-sub-cont2 .section-content3 img'),
      'x-icon',
    );
    dataMapMoObj.altFunction(
      wrapper.querySelector('.footer-sub-cont2 .section-content4 img'),
      'youtube-icon',
    );
    dataMapMoObj.altFunction(
      wrapper.querySelector('.footer-sub-cont2 .section-content5 img'),
      'lindkin-icon',
    );
    dataMapMoObj.altFunction(
      wrapper.querySelector('.footer-sub-cont3 .section-content1 img'),
      'bar-code',
    );
    dataMapMoObj.altFunction(
      wrapper.querySelector('.footer-sub-cont3 .section-content2 img'),
      'Download on Google Play',
    );
    dataMapMoObj.altFunction(
      wrapper.querySelector('.footer-sub-cont3 .section-content3 img'),
      'Download on the App Store',
    );
  }

  loadAutoBlock(footer);

  // Init scroll-to-top button
  initScrollToTop();
  const footercls = block.closest('.footer');
  Array.from(
    footercls.querySelector('.footer-section3 .footer-sub-cont2').children,
  ).forEach((efthre) => {
    efthre.classList.add('footerthr');
  });
  const footerContainer = document.querySelector('.footer-sub3 .icon img');

  if (footerContainer) {
    footerContainer.setAttribute('alt', 'QR code');
    // const altTextMap = {
    //   'footer-bar-code': 'QR code',
    // };
    // const imagesToFix = footerContainer.querySelectorAll('img[alt=""]');

    // imagesToFix.forEach((image) => {
    //   const { iconName } = image.dataset;

    //   const altText = altTextMap[iconName];

    //   if (altText) {
    //     image.setAttribute('alt', altText);
    //   }
    // });
  }

  const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
  async function removeClassAfterDelay() {
    await delay(2000);
    let blokform;
    if (block.querySelector('#form-email-1')) {
      blokform = block.querySelector('#form-email-1');
    } else if (block.querySelector('#form-email')) {
      blokform = block.querySelector('#form-email');
    }
    const footerfield = block.querySelector('.footer-section2 .footer-sub-cont2');
    footerfield.style.display = 'none';
    blokform.style.display = 'none';
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
      block.querySelector('.email-wrapper').append(wrapperimg);
      block.querySelector('.submit-btn .button').addEventListener('click', () => {
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
  }
  removeClassAfterDelay();
}

const container = document.querySelector('.footer-sub-cont3');

if (container) {
  const altTextMap = {
    'footer-bar-code': 'QR code for app download',
    'Playstore-footer': 'Google Play Store icon',
    'Apple-footer': 'Apple App Store icon',
  };

  const images = container.querySelectorAll('img');

  images.forEach((image) => {
    const { iconName } = image.dataset;

    const altText = altTextMap[iconName];
    if (altText) {
      image.setAttribute('alt', altText);
    }
  });
}

// Function to hide footer on WCS PAGE

const currentPath = window.location.pathname;

const targetPath = '/wcs';

if (currentPath.includes(targetPath)) {
  const hideFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }
  };

  hideFooter();

  const observer = new MutationObserver((mutations, obs) => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
      obs.disconnect();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Code End Function to hide footer on WCS PAGE
