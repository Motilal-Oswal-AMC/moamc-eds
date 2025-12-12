import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  //   dataMapMoObj.CLASS_PREFIXES = [
  //     'performance-cont',
  //     'performance-sec',
  //     'performance-sub',
  //     'performance-inner-text',
  //     'performance-list',
  //     'performance-list-content',
  //     'performance-list-row',
  //   ];
  //   dataMapMoObj.addIndexed(block);
  dataMapMoObj.CLASS_PREFIXES = [
    'strategy-performance-cont',
    'strategy-performance-sec',
    'strategy-performance-row',
    'strategy-performance-bar',
    'strategy-performance-label',
  ];
  dataMapMoObj.addIndexed(block);
}
