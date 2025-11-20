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
}
