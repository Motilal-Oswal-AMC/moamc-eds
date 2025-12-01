import tabBlocks from '../tabs/tabs.js';
import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  tabBlocks(block);

  const goverstr = block.closest('.structure-governance');
  if (goverstr) {
    dataMapMoObj.CLASS_PREFIXES = ['goverstr-main', 'goverstr-inner', 'goverstr-item', 'goverstr-child', 'goverstr-subchild'];
    dataMapMoObj.addIndexed(goverstr);
  }
}
