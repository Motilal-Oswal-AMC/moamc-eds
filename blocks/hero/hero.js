import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  const heroBlock = block.closest('.pws-hero-section');

  if (heroBlock) {
    // const paragraphs = heroBlock.querySelectorAll('p');
    dataMapMoObj.CLASS_PREFIXES = ['para', 'p2', 'p3'];
    dataMapMoObj.addIndexed(block);
    // paragraphs.forEach((p, index) => {
    //     if (index < classesToAdd.length) {
    //         p.classList.add(classesToAdd[index]);
    //     }
    // });
    const contactUs = document.querySelector('.comlist.p33');

    const anchorTag = contactUs.querySelector('a');

    if (anchorTag) {
      anchorTag.removeAttribute('title');
    }
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
  // });
  const newSection = document.querySelectorAll('.mo-inter-business.hero-container');
  dataMapMoObj.CLASS_PREFIXES = [
    'mo-inter-cont',
    'mo-inter-sec',
    'mo-inter-sub',
    'mo-inter-inner-text',
    'mo-inter-list',
    'mo-inter-list-content',
    'mo-inter-list-row',
  ];
  newSection.forEach((sublist) => dataMapMoObj.addIndexed(sublist));
}
