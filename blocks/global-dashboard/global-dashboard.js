import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = ['global', 'globalsub', 'globalinner', 'globalsubinner'];
  dataMapMoObj.addIndexed(block);

  // const textPart = block.closest('.global-dashboard-container');
  // dataMapMoObj.CLASS_PREFIXES =
  //  ['global-text', 'global-textsub', 'global-textinner', 'global-textsubinner'];
  // dataMapMoObj.addIndexed(textPart);
}
