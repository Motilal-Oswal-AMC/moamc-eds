import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  // const newSec = block.querySelector('section');
  dataMapMoObj.CLASS_PREFIXES = [
    'global-cont',
    'global-sec',
    'global-sub',
    'global-inner-text',
    'global-list',
    'global-list-content',
    'global-list-row',
  ];
  dataMapMoObj.addIndexed(block);

  const prosInvest = document.querySelector('.pros-of-investing.global-gateway-container');
  if (prosInvest != null) {
    dataMapMoObj.CLASS_PREFIXES = [
      'prosinvest-main',
      'prosinvest-sub',
      'prosinvest-inner',
      'prosinvest-sec',
      'prosinvest-cont',
      'prosinvest-list',
      'prosinvest-text',
    ];
    dataMapMoObj.addIndexed(prosInvest);
  }
  const howToinvest = document.querySelector('.how-to-invest.global-gateway-container');
  if (howToinvest != null) {
    dataMapMoObj.CLASS_PREFIXES = [
      'howtoinvest-main',
      'howtoinvest-sub',
      'howtoinvest-inner',
      'howtoinvest-sec',
      'howtoinvest-cont',
      'howtoinvest-list',
      'howtoinvest-text',
    ];
    dataMapMoObj.addIndexed(howToinvest);
  }
}
