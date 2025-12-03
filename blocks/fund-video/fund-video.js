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
}
