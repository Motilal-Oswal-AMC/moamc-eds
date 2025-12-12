import { loadCSS } from '../../scripts/aem.js';
import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  const cardsChildren = block.querySelectorAll('.cornerstones-advantage-cards > div');
  cardsChildren.forEach((ele) => {
    ele.classList.add('cards-item');
    Array.from(ele.children[0].children).forEach((element, ind) => {
      element.classList.add(`item-child-${ind + 1}`, 'item-child');
    });
  });

  if (window.location.href.includes('/static-pages/elss-fund')) {
    // const fundTax = block.closest('main').querySelector('.section.fund-tax');
    // dataMapMoObj.CLASS_PREFIXES = ['fund-tax-contain', 'fund-tax-txt'];
    // dataMapMoObj.addIndexed(fundTax);

    const investBlog = block.closest('main').querySelector('.section.invest-blog');
    dataMapMoObj.CLASS_PREFIXES = ['invest-blog-contain', 'invest-blog-txt'];
    dataMapMoObj.addIndexed(investBlog);

    const taxBlog = block.closest('main').querySelector('.section.tax-blog');
    dataMapMoObj.CLASS_PREFIXES = ['tax-blog-contain', 'tax-blog-txt', 'tax-blog-subtxt'];
    dataMapMoObj.addIndexed(taxBlog);

    const sipBlog = block.closest('main').querySelector('.section.sip-blog');
    dataMapMoObj.CLASS_PREFIXES = ['sip-blog-contain', 'sip-blog-txt', 'sip-blog-subtxt'];
    dataMapMoObj.addIndexed(sipBlog);

    const sebiBlog = block.closest('main').querySelector('.section.sebi-blog');
    dataMapMoObj.CLASS_PREFIXES = ['sebi-blog-contain', 'sebi-blog-txt', 'sebi-blog-subtxt'];
    dataMapMoObj.addIndexed(sebiBlog);

    const elssStockTable = block.closest('main').querySelector('.section.elss-stock-table');
    dataMapMoObj.CLASS_PREFIXES = ['elss-stock-table-contain', 'elss-stock-table-txt', 'elss-stock-table-subtxt'];
    dataMapMoObj.addIndexed(elssStockTable);

    // const fundPhilosophy = block.closest('main').querySelector('.section.fund-philosophy');
    // dataMapMoObj.CLASS_PREFIXES =
    // ['fund-philosophy-contain', 'fund-philosophy-txt', 'fund-philosophy-subtxt'];
    // dataMapMoObj.addIndexed(fundPhilosophy);
    // const develem = document.createElement('div');
    // develem.classList.add('eels-vedio-wrap');
    // Array.from(fundPhilosophy.children).forEach((element) => {
    //   develem.appendChild(element);
    // });
    // fundPhilosophy.appendChild(develem);
  }
  const fundPhilosophy = block.closest('main').querySelector('[data-id="fund-philosophy-vedio"]');
  if (fundPhilosophy !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['fund-philosophy-contain', 'fund-philosophy-txt', 'fund-philosophy-subtxt'];
    dataMapMoObj.addIndexed(fundPhilosophy);
    const develem = document.createElement('div');
    develem.classList.add('eels-vedio-wrap');
    Array.from(fundPhilosophy.children).forEach((element) => {
      develem.appendChild(element);
    });
    fundPhilosophy.appendChild(develem);
  }
  const fundTax = block.closest('main').querySelector('[data-id="fund-tax-data"]');
  if (fundTax !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['fund-tax-contain', 'fund-tax-txt'];
    dataMapMoObj.addIndexed(fundTax);
  }
  if (window.location.href.includes('/static-pages/become-a-partner')) {
    const partnerConnect = block.closest('main').querySelector('.section.partner-connect');
    dataMapMoObj.CLASS_PREFIXES = ['partner-connect-contain', 'partner-connect-txt'];
    dataMapMoObj.addIndexed(partnerConnect);

    const MoPartner = block.closest('main').querySelector('.section.mo-partner');
    dataMapMoObj.CLASS_PREFIXES = ['mo-partner-contain', 'mo-partner-list', 'mo-partner-txt', 'mo-partner-subtxt', 'mo-partner-subtxt-item', 'mo-partner-subtxt-item-content', 'mo-partner-subtxt-item-content-detail'];
    dataMapMoObj.addIndexed(MoPartner);
    loadCSS(
      `${window.hlx.codeBasePath}/blocks/cards/become-a-partner.css`,
    );
  }
  const strategyPartner = block.closest('main').querySelector('.strategy-details.cornerstones-advantage-cards-container');
  dataMapMoObj.CLASS_PREFIXES = ['construct-contain', 'construct-list', 'construct-txt', 'construct-subtxt', 'construct-subtxt-item', 'construct-subtxt-item-content', 'construct-subtxt-item-content-detail'];
  dataMapMoObj.addIndexed(strategyPartner);
  // 1. Select all the parent containers (e.g., '.cards-item' or '.construct-subtxt1')
  const cards = document.querySelectorAll('.construct-list1 .cards-item');

  cards.forEach((card) => {
    // 2. Find the specific elements inside THIS card instance
    const heading = card.querySelector('.item-child-2');
    const paragraph = card.querySelector('.item-child-3');

    // 3. Ensure both elements exist before trying to wrap them
    if (heading && paragraph) {
      // 4. Create the new wrapper div
      const newWrapper = document.createElement('div');
      newWrapper.classList.add('text-content-wrapper'); // Add your class name here

      // 5. Insert the new wrapper into the DOM *before* the heading
      // This keeps it in the correct position relative to item-child-1
      heading.parentNode.insertBefore(newWrapper, heading);

      // 6. Move the heading and paragraph inside the new wrapper
      // Note: appendChild removes them from their old spot and puts them here
      newWrapper.appendChild(heading);
      newWrapper.appendChild(paragraph);
    }
  });
}
