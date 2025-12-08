import dataMapMoObj from '../../scripts/constant.js';
import dataCfObj from '../../scripts/dataCfObj.js';
import { img } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const riskmet = block.closest('.risk-o-meter-container');
  Array.from(block.children).forEach((row, rowIndex) => {
    row.classList.add('risk-meter-cont', `corner-${rowIndex + 1}`);
    Array.from(row.children).forEach((column, colIndex) => {
      column.classList.add('risk-meter-corner-cont-column', `column-${colIndex + 1}`);
    });
  });
  const listBlocks = block.querySelectorAll('.risk-meter-corner-cont-column ul');
  Array.from(listBlocks).forEach((ul, index) => {
    ul.classList.add(`risk-meter-corner-cont-ul-${index + 1}`);
  });

  dataMapMoObj.CLASS_PREFIXES = [];
  dataMapMoObj.CLASS_PREFIXES = ['risk'];
  const planCode = localStorage.getItem('planCode');
  let planslabel;
  if (planCode !== null) {
    const schode = planCode.split(':')[1];
    planslabel = schode;
  } else if (window.location.href.includes('/our-funds/funds-details-page')) {
    planslabel = 'LM';
  } else {
    const path = window.location.pathname.split('/').at(-1);
    const planobj = dataCfObj.cfDataObjs.filter(
      (el) => path === el.schDetail.schemeName.toLocaleLowerCase().split(' ').join('-'),
    );
    planslabel = planobj[0].schcode;
  }
  // const planslabel = planCode.split(':')[1];
  // const mop = [];
  const planobj = dataCfObj.cfDataObjs.filter((el) => el.schcode === planslabel);
  // console.log(planobj);

  if (block.closest('.product-label')) {
    // console.log(planobj[0].benchmarkreturns[0].groupName);// + Risk- O-Meter
    // console.log(planobj[0].schDetail.schemeName); // + 'Risk- O-Meter'

    // Bench image

    // if (!mop.includes(el.risk.riskType)) {
    //   mop.push(el.risk.skType);
    // }
    // console.log(mop);
    dataMapMoObj.addIndexed(block.closest('.product-label'));

    const risks = block.closest('.product-label');
    const divwrapper = document.createElement('div');
    divwrapper.classList.add('section');
    divwrapper.classList.add('risk-o-meter-container');
    divwrapper.classList.add('risk-container');
    divwrapper.append(risks.querySelector('.risk2'));
    divwrapper.append(risks.querySelector('.risk3'));
    risks.append(divwrapper);
    risks.querySelector('.risk3 h3').classList.add('defone1');
    risks.querySelector('.risk3 ul').classList.add('defone2');
    Array.from(risks.querySelector('.risk3 ul').children).forEach((el) => {
      el.classList.add('defli');
    });
    risks.querySelector('.risk3 p ').classList.add('defone3');
    // Bench Name
    if (planobj[0].risk.benchmarkRisk) {
      const riskMiterBanch = block.querySelector('.corner-1 p');
      riskMiterBanch.textContent = '';
      riskMiterBanch.textContent = `${planobj[0].schDetail.schemeName} Risk- O-Meter`;
      block.querySelector('.corner-1 .column-2').innerHTML = '';
      block.querySelector('.corner-1 .column-2').append(img(
        { src: `/icons/larg-risk-icon/${planobj[0].risk.benchmarkRisk.split(' ').join('-')}.svg`, alt: 'img' },
      ));
    }
    // Scheme Name
    if (planobj[0].risk.riskType) {
      const riskMiterScheme = block.querySelector('.corner-2 p');
      riskMiterScheme.textContent = '';
      riskMiterScheme.textContent = `${planobj[0].benchmarkreturns[0].groupName} Risk- O-Meter`;
      block.querySelector('.corner-2 .column-2').innerHTML = '';
      block.querySelector('.corner-2 .column-2').append(img(
        { src: `/icons/larg-risk-icon/${planobj[0].risk.riskType.split(' ').join('-')}.svg`, alt: 'img' },
      ));
      // block.querySelector('.corner-2 img').src
      // = `../larg-risk-icon/${planobj[0].risk.riskType.split('-').join('-')}.svg`;
    }
  }
  if (block.closest('.risk-o-meter-container')) {
    dataMapMoObj.CLASS_PREFIXES = ['defone', 'deftwo', 'defthree', 'deffour'];
    if (riskmet.querySelector('.risk-wrapper')) {
      dataMapMoObj.addIndexed(
        riskmet.querySelector('.risk-wrapper .default-content-wrapper'),
      );
    } else {
      dataMapMoObj.addIndexed(Array.from(riskmet.children)[1]);
    }
    if (riskmet.querySelector('.defone2') !== null) {
      Array.from(riskmet.querySelector('.defone2').children).forEach((elde) => {
        elde.classList.add('defli');
      });
    }
    // Bench Name
    if (planobj[0].risk.benchmarkRisk) {
      const riskMiterBanch = block.querySelector('.corner-1 p');
      riskMiterBanch.textContent = '';
      riskMiterBanch.textContent = `${planobj[0].schDetail.schemeName} Risk- O-Meter`;
      block.querySelector('.corner-1 .column-2').innerHTML = '';
      block.querySelector('.corner-1 .column-2').append(img(
        { src: `/icons/larg-risk-icon/${planobj[0].risk.benchmarkRisk.split(' ').join('-')}.svg`, alt: 'img' },
      ));
    }
    // Scheme Name
    if (planobj[0].risk.riskType) {
      const riskMiterScheme = block.querySelector('.corner-2 p');
      riskMiterScheme.textContent = '';
      riskMiterScheme.textContent = `${planobj[0].benchmarkreturns[0].groupName} Risk- O-Meter`;
      block.querySelector('.corner-2 .column-2').innerHTML = '';
      block.querySelector('.corner-2 .column-2').append(img(
        { src: `/icons/larg-risk-icon/${planobj[0].risk.riskType.split(' ').join('-')}.svg`, alt: 'img' },
      ));
      // block.querySelector('.corner-2 img').src
      // = `../larg-risk-icon/${planobj[0].risk.riskType.split('-').join('-')}.svg`;
    }
  }
}
