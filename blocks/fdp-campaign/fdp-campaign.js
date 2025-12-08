import dataMapMoObj from '../../scripts/constant.js';
import { button, div } from '../../scripts/dom-helpers.js';
import accordionBlock from '../accordion/accordion.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = ['compaign', 'compaignsub', 'compaigninner'];
  dataMapMoObj.addIndexed(block);

  const heroBlock = document.querySelector('.pws-hero-section .default-content-wrapper');

  if (heroBlock) {
    // const paragraphs = heroBlock.querySelectorAll('p');
    dataMapMoObj.CLASS
    _PREFIXES = ['para', 'p2', 'p3'];
    dataMapMoObj.addIndexed(heroBlock);
  }

  const mainblock = block.closest('main');
  if (mainblock.querySelector('.our-strategies')) {
    const strategies = mainblock.querySelector('.our-strategies');
    const divwrp = document.createElement('div');
    divwrp.classList.add('strategy-wrapper');
    const abc = strategies.querySelector('.default-content-wrapper ul');
    const def = strategies.querySelector('.default-content-wrapper p');

    divwrp.append(abc);
    divwrp.append(def);
    const ghi = strategies.querySelector('.default-content-wrapper');
    dataMapMoObj.CLASS_PREFIXES = ['strategy1', 'strategy2', 'strategy3'];
    dataMapMoObj.addIndexed(divwrp);
    ghi.append(divwrp);

    const divwrp1 = document.createElement('div');
    const divwrp2 = document.createElement('div');
    const divwrp3 = document.createElement('div');
    const divwrp4 = document.createElement('div');
    const divwrp5 = document.createElement('div');

    divwrp1.classList.add('li-wrapper-1');
    divwrp2.classList.add('li-wrapper-2');
    divwrp3.classList.add('li-wrapper-3');
    divwrp4.classList.add('li-wrapper-4');
    divwrp5.classList.add('li-wrapper-5');

    const ul = strategies.querySelector('.strategy-wrapper .strategy11');

    const jkl1 = strategies.querySelector('.strategy-wrapper .strategy21');
    const jkl2 = strategies.querySelector('.strategy-wrapper .strategy22');
    const mno1 = strategies.querySelector('.strategy-wrapper .strategy23');
    const mno2 = strategies.querySelector('.strategy-wrapper .strategy24');
    const pqr1 = strategies.querySelector('.strategy-wrapper .strategy25');
    const pqr2 = strategies.querySelector('.strategy-wrapper .strategy26');
    const tef1 = strategies.querySelector('.strategy-wrapper .strategy27');
    const tef2 = strategies.querySelector('.strategy-wrapper .strategy28');
    const ddt1 = strategies.querySelector('.strategy-wrapper .strategy29');
    const dd12 = strategies.querySelector('.strategy-wrapper .strategy210');

    divwrp1.append(jkl1);
    divwrp1.append(jkl2);

    divwrp2.append(mno1);
    divwrp2.append(mno2);

    divwrp3.append(pqr1);
    divwrp3.append(pqr2);

    divwrp4.append(tef1);
    divwrp4.append(tef2);

    divwrp5.append(ddt1);
    divwrp5.append(dd12);

    ul.append(divwrp1);
    ul.append(divwrp2);
    ul.append(divwrp3);
    ul.append(divwrp4);
    ul.append(divwrp5);

    const decorativeIcons = document.querySelectorAll('.strategy31 img');

    decorativeIcons.forEach((icon) => {
      icon.setAttribute('aria-hidden', 'true');
    });
  }


  // gift fdp-campaign  start

  if (window.location.href.includes("http://localhost:3000/mutual-fund/in/en/static-pages/gift-city") || window.location.href.includes("https://mosl-dev-upd--moamc-eds--motilal-oswal-amc.aem.live/mutual-fund/in/en/static-pages/gift-city")) {

    const giftParent = document.querySelector(".gift-campaign .fdp-campaign-wrapper");
    const giftWrapper = div({ class: 'wrapper-policy' });
    giftParent.parentNode.insertBefore(giftWrapper, giftParent);
    giftWrapper.appendChild(giftParent);

  }



  // gift fdp-campaign  End
  // document.addEventListener("DOMContentLoaded", function () {
  // Select all li elements with class starting with "strategy2" (like strategy21, strategy25...)
  const listItemsStrategy = document.querySelectorAll("li.comlist[class*='strategy2']");

  listItemsStrategy.forEach((li) => {
    const iconSpan = li.querySelector('span.icon');
    if (iconSpan) {
      // Loop through child nodes and find the text node before the icon
      const nodes = Array.from(li.childNodes);
      nodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
          // Wrap the text node in a <span class="text-wrap">
          const wrapper = document.createElement('span');
          wrapper.className = 'text-wrap';
          wrapper.textContent = node.textContent.trim();

          // Replace original text node
          li.insertBefore(wrapper, node);
          li.removeChild(node);
        }
      });
    }
  });

  const heroImage = document.querySelector('.pws-hero-section .compaignsub1');

  if (heroImage) {
    // const paragraphs = heroBlock.querySelectorAll('p');
    dataMapMoObj.CLASS_PREFIXES = ['img-1', 'img-2'];
    dataMapMoObj.addIndexed(heroImage);
  }

  const mobImage = document.querySelector('.pws-hero-section .compaign2');

  if (mobImage) {
    // const paragraphs = heroBlock.querySelectorAll('p');
    dataMapMoObj.CLASS_PREFIXES = ['mobimg-1', 'mobimg-2', 'mobimg-3'];
    dataMapMoObj.addIndexed(mobImage);
  }

  const arrows = document.querySelector('.our-strategies .strategy-wrapper');

  if (arrows) {
    // const paragraphs = heroBlock.querySelectorAll('p');
    dataMapMoObj.CLASS_PREFIXES = ['arrow-1', 'arrow-2', 'arrow-3', 'arrow-4', 'arrow-5'];
    dataMapMoObj.addIndexed(arrows);
  }
  const rrowtwo = document.querySelectorAll('.our-strategies .strategy11 img');
  if (rrowtwo) {
    Array.from(rrowtwo).forEach((el, ind) => el.classList.add(`stat${ind}`));
  }

  const compaignImage = block.querySelector('.compaignsub1');
  const compaignLink = block.querySelector('.compaign3 a');

  if (compaignLink && compaignImage) {
    compaignImage.addEventListener('click', () => {
      window.location.href = compaignLink.href;
    });
  }

  // Privacy Policy Functionality Start
  mainblock.classList.add('privacypolicy-container');
  const securitySection = mainblock.querySelectorAll('.privacy-policy-banner')[0].classList.add('active');
  const banners = mainblock.querySelectorAll('.privacy-policy-banner');

  if (window.innerWidth <= 767) {
    banners[1].style.marginTop = '58px';
  } else {
    banners[1].style.marginTop = '76px';
  }
  const fpdCampaignSection = block.parentElement.parentElement;
  if (fpdCampaignSection.classList.contains('accordion-container')) {
    const accordionContent = fpdCampaignSection.querySelector('.accordion-wrapper .accordion.block');
    accordionBlock(accordionContent);
  }

  function privacyPlicyBtn() {
    if (mainblock.querySelectorAll('.privacy-policy-banner')) {
      // Array.from(mainblock.querySelectorAll('.privacy-policy-banner')).forEach((elem) => {
      const btnstru = div(
        { class: 'button-container' },
        ...Array.from(mainblock.querySelectorAll('.privacy-policy-banner')).map((element) => button({ class: 'button', dataAttr: element.getAttribute('data-id') }, element.getAttribute('data-id'))),
      );
      const seqDiv = div({ class: 'wrapper-policy' });
      const contentDiv = div({ class: 'wrapper-content' });
      const banner = fpdCampaignSection.querySelector('.fdp-campaign-wrapper').cloneNode(true); // banner image
      const contentstru = fpdCampaignSection.querySelector('.pp-banner-wrap2').cloneNode(true); // disclaimer
      fpdCampaignSection.innerHTML = '';
      if (!fpdCampaignSection.querySelector('.wrapper-policy')) {
        contentDiv.appendChild(btnstru.cloneNode(true));
        contentDiv.appendChild(contentstru);

        seqDiv.appendChild(banner);
        seqDiv.appendChild(contentDiv);

        fpdCampaignSection.appendChild(seqDiv);
      }
      // });
    }
  }
  privacyPlicyBtn();

  // if (mainblock.querySelectorAll('.privacy-policy-banner').length !== 0) {
  //   Array.from(mainblock.querySelectorAll('.privacy-policy-banner')).forEach((elem) => {
  //     const btnstru = div({ class: 'button-container' },
  //       ...Array.from(mainblock.querySelectorAll('.privacy-policy-banner')).map((element) => {
  //         return button({ class: 'button', dataAttr: element
  // .getAttribute('data-id') }, element.getAttribute('data-id'))
  //       })
  //     );
  //     const seqDiv = div({ class: 'wrapper-policy' });
  //     const contentDiv = div({ class: 'wrapper-content' });
  //     // const accordionContent = elem.querySelector('.accordion-wrapper .accordion.block');
  //     // debugger;
  //     // if (accordionContent && elem.classList.contains('accordion-container')) {
  //     //   accordionBlock(accordionContent)
  //     // }
  //     const banner = elem.querySelector('.fdp-campaign-wrapper').cloneNode(true) //banner image
  //     const contentstru = elem.querySelector('.pp-banner-wrap2').cloneNode(true); // disclaimer
  //     elem.innerHTML = "";
  //     if (!elem.querySelector('.wrapper-policy')) {

  //       contentDiv.appendChild(btnstru.cloneNode(true));
  //       contentDiv.appendChild(contentstru);

  //       seqDiv.appendChild(banner);
  //       seqDiv.appendChild(contentDiv);

  //       elem.appendChild(seqDiv);

  //     }
  //   });
  // }

  mainblock.querySelectorAll('.button')[0].classList.add('active');
  document.querySelectorAll('.privacy-policy-banner .button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedAttr = btn.getAttribute('dataattr'); // button clicked value

      // Remove active from ALL buttons first
      document.querySelectorAll('.privacy-policy-banner .button')
        .forEach((b) => b.classList.remove('active'));

      // Add active to ALL buttons that match the clicked button
      document.querySelectorAll(`.privacy-policy-banner .button[dataattr="${selectedAttr}"]`)
        .forEach((b) => b.classList.add('active'));

      document.querySelectorAll('.privacy-policy-banner').forEach((section) => {
        const sectionAttr = section.getAttribute('data-id');

        if (sectionAttr === selectedAttr) {
          section.classList.add('active'); // show matching section
        } else {
          section.classList.remove('active'); // hide others
        }
      });
    });
  });
  // Privacy Policy Functionality End
}
