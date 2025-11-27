import dataMapMoObj from '../../scripts/constant.js';

export default async function decorate(block) {
  if (block != null) {
    dataMapMoObj.CLASS_PREFIXES = [
      'glpcoding',
      'glpcoding-inner',
      'glpcoding-sub-inner',
    ];
    dataMapMoObj.addIndexed(block);
    const mainbl = block.closest('main');
    const data = mainbl.querySelectorAll('.tab-glp');
    if (data.length !== 0) {
      data.forEach((ele) => {
        if (ele != null) {
          dataMapMoObj.CLASS_PREFIXES = [
            'glp-tab-block',
            'glp-tab-inner',
            'glp-tab-sub-inner',
            'glp-tab-sub-inner-sub',
            'glp-tab-ul',
            'glp-tab-inner-ul',
            'glp-tab-li',
            'glp-tab-sub-inner-ul',
            'glp-tab-inner-li',
            'glp-tab-sub-inner-li',
            'glp-tab-sub-inner-li-sub',
            'glp-li',
            'glp-li-inner',
          ];
          dataMapMoObj.addIndexed(ele);

          const addClassName = ele.querySelectorAll('.glp-tab-li1');
          if (addClassName) {
            addClassName.forEach((elem) => {
              elem.classList.add('li-containers');
            });
          }

          const addClassNameli = ele.querySelectorAll('.glp-tab-sub-inner-ul2');
          if (addClassNameli) {
            addClassNameli.forEach((elem) => {
              elem.classList.add('same-li');
            });
          }

          const addClassNamel = ele.querySelectorAll('.glp-tab-sub-inner-ul1');
          if (addClassNamel) {
            addClassNamel.forEach((elem) => {
              elem.classList.add('same-li');
            });
          }
        }
      });
    }
  }
}
