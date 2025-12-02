/*    */
// import Embed from '../embed/embed.js';
import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  // Embed(block.children[1].querySelector('.button-container'));
  dataMapMoObj.CLASS_PREFIXES = ['fundvedmain', 'fundvedsubmain', 'fundvedinnermain', 'fundsubvedmain'];
  dataMapMoObj.addIndexed(block);
  try {
    const imgWrapper = document.createElement('div');
    imgWrapper.classList.add('fundsubinner');
    const fundv2 = block.querySelector('.fundvedmain2');
    const fundvedone = block.querySelector('.fundvedmain2 .fundvedinnermain1');
    const fundvedtwo = block.querySelector('.fundvedmain2 .fundvedinnermain2');
    imgWrapper.appendChild(fundvedone);
    imgWrapper.appendChild(fundvedtwo);
    fundv2.prepend(imgWrapper);

    const imgAltmain = block.closest('main');
    dataMapMoObj.altFunction(imgAltmain.querySelector('.fund-video-container .fundvedmain2 .fundvedinnermain2 img'), 'video-play-btn');
  } catch (error) {
    // console.log(error);
  }

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
