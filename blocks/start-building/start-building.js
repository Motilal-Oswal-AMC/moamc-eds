import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = [
    'start-container',
    'start-section',
  ];
  dataMapMoObj.addIndexed(block);
  const download = block.querySelectorAll('.fab-download.start-building-container');

  dataMapMoObj.CLASS_PREFIXES = [
    'fab-down-cont',
    'fab-down-sec',
    'fab-down-sub',
    'fab-down-inner-text',
    'fab-down-list',
    'fab-down-list-content',
    'fab-down-list-row',
  ];

  if (download.length > 0) {
    download.forEach((sublist) => dataMapMoObj.addIndexed(sublist));
  }
}
