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
    const fundTax = block.closest('main').querySelector('.section.fund-tax');
    dataMapMoObj.CLASS_PREFIXES = ['fund-tax-contain', 'fund-tax-txt'];
    dataMapMoObj.addIndexed(fundTax);

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

    const fundPhilosophy = block.closest('main').querySelector('.section.fund-philosophy');
    dataMapMoObj.CLASS_PREFIXES = ['fund-philosophy-contain', 'fund-philosophy-txt', 'fund-philosophy-subtxt'];
    dataMapMoObj.addIndexed(fundPhilosophy);
    const develem = document.createElement('div');
    develem.classList.add('eels-vedio-wrap');
    Array.from(fundPhilosophy.children).forEach((element) => {
      develem.appendChild(element);
    });
    fundPhilosophy.appendChild(develem);
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
}
