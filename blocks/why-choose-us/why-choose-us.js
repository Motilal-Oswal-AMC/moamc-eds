import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = [
    'why-choose-us-row',
    'why-choose-us-sec',
    'why-choose-us-sub',
    'choose-us-lists',
    'choose-us-lists-wrap',
    'choose-us-titles',
    'choose-us-img',
  ];
  dataMapMoObj.addIndexed(block);

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
  }
}
