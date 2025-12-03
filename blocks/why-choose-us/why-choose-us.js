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
}
