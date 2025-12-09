// import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  Array.from(block.children).forEach((el, index) => {
    el.classList.add(`imagelist${index + 1}`);
    Array.from(el.children).forEach((elsub) => {
      elsub.classList.add('subimagelist');
    });
  });
  Array.from(
    block
      .closest('.think-equity-container')
      .querySelector('.default-content-wrapper').children,
  ).forEach((el, i) => {
    el.classList.add(`item-child-${i + 1}`);
  });
  Array.from(
    block.closest('.think-equity-container').querySelector('.columns-wrapper')
      .children[0].children[0].children,
  ).forEach((elem, index) => {
    elem.classList.add(`item-child-${index + 1}`);
    Array.from(elem.children).forEach((ele, ind) => {
      ele.classList.add(`subitem-child-${ind + 1}`);
    });
  });
}

// // why-invest-minor section start
// const whyInvestminor = document.querySelector('.why-invest-minor think-equity-container');
// if (whyInvestminor != null) {
//   dataMapMoObj.CLASS_PREFIXES = [
//     'why-invest-minor-main',
//     'why-invest-minor-sub',
//     'why-invest-minor-inner',
//   ];
//   dataMapMoObj.addIndexed(whyInvestminor);
// }
