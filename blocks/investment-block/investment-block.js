// import dataCfObj from '../../scripts/dataCfObj.js';
import fundcardblock from '../fund-card/fund-card.js';
import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  block.style.display = 'none'; // RM11
  Array.from(block.children).forEach((element) => {
    element.classList.add('compound-item');
    Array.from(element.children).forEach((subelement) => {
      subelement.classList.add('compound-sub-item');
    });
  });

  if (block.closest('.index-fund')) { // [...block.classList].includes('index-fund')
    const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
      if (!el.fundsTaggingSection) {
        return false;
      }
      return el;
    });
    const dataCF = tempDfilt.slice(0, 2);
    const divWrapper = document.createElement('div');
    divWrapper.classList.add('card-items');
    dataCF.forEach((el) => {
      const cardV2 = fundcardblock(el);
      divWrapper.append(cardV2);
    });

    block.querySelector('.compound-item').append(divWrapper);
  }
}
