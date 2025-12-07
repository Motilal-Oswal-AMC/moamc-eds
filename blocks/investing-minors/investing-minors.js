import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = [
    'investing-main',
    'investing-sub',
    'investing-inner',
    'investing-detail',
    'investing-point',
    'investing-note',
  ];
  dataMapMoObj.addIndexed(block);
}
