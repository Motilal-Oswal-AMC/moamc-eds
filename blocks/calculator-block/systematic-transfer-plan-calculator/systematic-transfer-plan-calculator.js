import {
  createInputBlock,
  formatNumber,
} from '../common-ui-field/common-ui-field.js';
import dataMapMoObj from '../../../scripts/constant.js';
import { div, span } from '../../../scripts/dom-helpers.js';

export function updateSTPCalcSummary(data) {
  const { container } = data || {};
  if (!container) {
    return;
  }
  const TEFS_EL = container.querySelector('#TEFS');
  const IIISS_EL = container.querySelector('#IIISS');
  const ARISS_EL = container.querySelector('#ARISS');
  const TIITS_EL = container.querySelector('#TIITS');
  const FMVOTS_EL = container.querySelector('#FMVOTS');

  if (TEFS_EL) {
    TEFS_EL.textContent = formatNumber({
      value: data?.totalGain,
      currency: true,
    });
  }
  if (IIISS_EL) {
    IIISS_EL.textContent = formatNumber({
      value: data?.totalValue - data?.totalGain,
      currency: true,
    });
  }
  if (ARISS_EL) {
    ARISS_EL.textContent = formatNumber({
      value: data.remainingSourceValue,
      currency: true,
    });
  }
  if (TIITS_EL) {
    TIITS_EL.textContent = formatNumber({
      value: data.totalTransferred,
      currency: true,
    });
  }
  if (FMVOTS_EL) {
    FMVOTS_EL.textContent = formatNumber({
      value: data.finalDestinationValue,
      currency: true,
    });
  }
}

/**
 * Calculate STP summary (Transfer totals, Growth in source & destination fund)
 * @param {Object} params
 * @param {number} params.initialInvestment - Lump sum invested in source fund
 * @param {number} params.transferAmount - Fixed amount transferred every month
 * @param {number} params.sourceAnnualRate - Annual return rate (%) of source fund
 * @param {number} params.destinationAnnualRate - Annual return rate (%) of destination fund
 * @param {number} params.years - Duration of STP (years)
 * @param {number} [params.roundDecimal] - Decimal rounding; 0 = integer
 * @returns {{
 *   totalTransferred: number,
 *   finalDestinationValue: number,
 *   remainingSourceValue: number,
 *   totalValue: number,
 *   totalGain: number,
 *   sourceGain: number,
 *   destinationGain: number,
 *   transferPercentage: number,
 *   gainPercentage: number
 * }}
 */

export function calculateSTPSummary({
  initialInvestment,
  transferAmount,
  sourceAnnualRate,
  destinationAnnualRate,
  years,
  roundDecimal = 0,
  callbackFunc = updateSTPCalcSummary,
  container,
}) {
  let data;
  if (!container) {
    return console.warn('No container element found.');
  }
  const num = (v, d = 0) => (v != null ? parseFloat(v) : d);
  const laitssAmount = num(initialInvestment)
    || container.querySelector('#laitss-amount').value * 1;
  const msaAmount = num(transferAmount) || container.querySelector('#msa-amount').value * 1;
  const erftsStart = num(sourceAnnualRate) || container.querySelector('#erfts-start').value * 1;
  const erfssStart = num(destinationAnnualRate)
    || container.querySelector('#erfss-start').value * 1;
  const tosiStart = num(years) || container.querySelector('#tosi-start').value * 1;

  if (!laitssAmount || !msaAmount || !erftsStart || !erfssStart || !tosiStart) {
    data = {
      totalTransferred: 0,
      finalDestinationValue: 0,
      remainingSourceValue: 0,
      totalValue: 0,
      totalGain: 0,
      sourceGain: 0,
      destinationGain: 0,
      transferPercentage: 0,
      gainPercentage: 0,
    };
    return data;
  }

  const months = tosiStart * 12;
  const sourceMonthlyRate = erftsStart / 12 / 100;
  const destinationMonthlyRate = erfssStart / 12 / 100;

  // Track balances
  let sourceBalance = laitssAmount;
  let destinationBalance = 0;
  let totalTransferred = 0;

  for (let i = 1; i <= months; i += 1) {
    // 1. Apply monthly growth on source fund
    sourceBalance *= 1 + sourceMonthlyRate;

    // 2. Transfer from source → destination
    const transfer = Math.min(msaAmount, sourceBalance);
    sourceBalance -= transfer;
    totalTransferred += transfer;

    // 3. Apply growth on destination fund AFTER transfer
    destinationBalance = (destinationBalance + transfer) * (1 + destinationMonthlyRate);
  }

  const remainingSourceValue = sourceBalance;
  const finalDestinationValue = destinationBalance;
  const totalValue = remainingSourceValue + finalDestinationValue;
  const totalGain = totalValue - laitssAmount;

  const sourceGain = remainingSourceValue - (laitssAmount - totalTransferred);
  const destinationGain = finalDestinationValue - totalTransferred;

  const transferPercentage = (totalTransferred / laitssAmount) * 100;
  const gainPercentage = (totalGain / laitssAmount) * 100;

  const roundValue = (val) => {
    if (roundDecimal == null) return val;
    return Number(val.toFixed(roundDecimal));
  };

  data = {
    totalTransferred: roundValue(totalTransferred),
    finalDestinationValue: roundValue(finalDestinationValue),
    remainingSourceValue: roundValue(remainingSourceValue),
    totalValue: roundValue(totalValue),
    totalGain: roundValue(totalGain),
    sourceGain: roundValue(sourceGain),
    destinationGain: roundValue(destinationGain),
    transferPercentage: roundValue(transferPercentage),
    gainPercentage: roundValue(gainPercentage),
    container,
  };
  console.log('data : ', data);

  if (callbackFunc) callbackFunc(data);

  return data;
}

export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector('.calc-author-main1');
  if (!CALC_AUTHOR_MAIN) {
    console.warn('No .calc-author-main1 element found.');
    return;
  }

  const OVERVIEW_CONTAINER = block
    .querySelector('.calc-author-sub4')
    .cloneNode(true);

  OVERVIEW_CONTAINER.classList.remove(...OVERVIEW_CONTAINER.classList);
  OVERVIEW_CONTAINER.classList.add(
    'calc-author-main2',
    'calc-overview-summary',
  );
  dataMapMoObj.CLASS_PREFIXES = ['calc-overview-item', 'calc-overview-subitem'];
  dataMapMoObj.addIndexed(OVERVIEW_CONTAINER);

  OVERVIEW_CONTAINER.querySelectorAll('ul').forEach((element, index) => {
    element.classList.remove(`calc-author-subitem${index + 1}`);
  });
  // OVERVIEW_CONTAINER.querySelector(".calc-overview-item1").classList.add("");
  const AMOUNTS_ID_ARR = ['TEFS', 'IIISS', 'ARISS', 'TIITS', 'FMVOTS', ''];
  OVERVIEW_CONTAINER.querySelectorAll('ul.comlist').forEach((ulEle, index) => {
    const AMOUNT_ID = AMOUNTS_ID_ARR?.[index] || '';
    if (index === 0) {
      ulEle.classList.add('calc-overview-title');
      const totalReturnsUl = ulEle;
      if (totalReturnsUl) {
        const lis = totalReturnsUl.querySelectorAll('li');
        const imgEl = lis[0]?.querySelector('img');

        const itemDiv = div({ class: 'calc-summary-item total-returns-item' });
        if (imgEl) itemDiv.appendChild(imgEl.cloneNode(true));

        const labelValueDiv = div(
          {},
          span({ class: 'small-title' }, lis[1]?.textContent.trim() || ''),
          span(
            { class: 'sip-amount', id: AMOUNT_ID },
            formatNumber({
              value: lis[2]?.textContent.trim() || '',
              currency: true,
            }),
          ),
        );
        itemDiv.appendChild(labelValueDiv);
        ulEle.replaceWith(itemDiv);
      }
    } else if (index === 5) {
      ulEle.querySelector('a').classList.add('calc-overview-cta', 'button');
    } else {
      ulEle.children[0].classList.add('calc-overview-small-title');
      ulEle.children[1].id = AMOUNT_ID;
      ulEle.children[1].classList.add('calc-overview-amount');
      ulEle.children[1].textContent = formatNumber({
        value: ulEle.children[1].textContent || '',
        currency: true,
      });
    }
  });

  // Define group names in the order they appear (every 4 values = 1 group)
  const PARAM_GROUPS = ['LAITSS', 'TOSI', 'MSA', 'ERFTS', 'ERFSS'];

  // Collect all <p> .comlist elements inside both .sub1 and .sub2
  const elements = [
    ...CALC_AUTHOR_MAIN.querySelectorAll(
      '.calc-author-sub1 .comlist, .calc-author-sub2 .comlist , .calc-author-sub3 .comlist',
    ),
  ].map((el) => el.textContent.trim());
  console.log('elements : ', elements);

  const CALC_FLAT_DATA = [];
  for (let i = 0; i < elements.length; i += 4) {
    const [label, def, min, max] = elements.slice(i, i + 4);
    const name = PARAM_GROUPS[i / 4] || `group${i / 4 + 1}`;
    CALC_FLAT_DATA.push({
      name,
      label,
      default: def,
      min,
      max,
    });
  }

  CALC_AUTHOR_MAIN.innerHTML = '';

  // Assuming you already have these from your flat data extraction:
  const laitss = CALC_FLAT_DATA.find((d) => d.name === 'LAITSS');
  const tosi = CALC_FLAT_DATA.find((d) => d.name === 'TOSI');
  const msa = CALC_FLAT_DATA.find((d) => d.name === 'MSA');
  const erfts = CALC_FLAT_DATA.find((d) => d.name === 'ERFTS');
  const erfss = CALC_FLAT_DATA.find((d) => d.name === 'ERFSS');

  const laitssBlock = createInputBlock({
    id: 'laitss-amount',
    ...laitss,
    prefix: '₹',
    fieldType: 'currency',
    prefixAttr: { class: 'currency-prefix' },
    inputBlockAttr: {
      class: 'laitss-inp-container',
    },
    variant: 'number',
    onInput: (e) => {
      calculateSTPSummary({
        initialInvestment: e.target.value,
        container: block,
      });
    },
    onChange: (v) => {
      calculateSTPSummary({ initialInvestment: v, container: block });
    },
  });

  const tosiBlock = createInputBlock({
    id: 'tosi-start',
    ...tosi,
    inputBlockAttr: {
      class: 'tosi-inp-container',
    },
    fieldType: 'year',
    suffix: tosi?.default > 1 ? 'years' : 'year',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => {
      calculateSTPSummary({ years: e.target.value, container: block });
    },
    onChange: (v) => {
      calculateSTPSummary({ years: v, container: block });
    },
  });
  const msaBlock = createInputBlock({
    id: 'msa-amount',
    ...msa,
    prefix: '₹',
    fieldType: 'currency',
    prefixAttr: { class: 'currency-prefix' },
    inputBlockAttr: {
      class: 'msa-inp-container',
    },
    variant: 'number',
    onInput: (e) => {
      calculateSTPSummary({
        transferAmount: e.target.value,
        container: block,
      });
    },
    onChange: (v) => {
      calculateSTPSummary({ transferAmount: v, container: block });
    },
  });

  const erftsBlock = createInputBlock({
    id: 'erfts-start',
    ...erfts,
    inputBlockAttr: {
      class: 'erfts-inp-container',
    },
    fieldType: 'percent',
    suffix: '%',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => {
      calculateSTPSummary({
        sourceAnnualRate: e.target.value,
        container: block,
      });
    },
    onChange: (v) => {
      calculateSTPSummary({ sourceAnnualRate: v, container: block });
    },
  });

  const erfssBlock = createInputBlock({
    id: 'erfss-start',
    ...erfss,
    inputBlockAttr: {
      class: 'erfss-inp-container',
    },
    fieldType: 'percent',
    suffix: '%',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => {
      calculateSTPSummary({
        destinationAnnualRate: e.target.value,
        container: block,
      });
    },
    onChange: (v) => {
      calculateSTPSummary({ destinationAnnualRate: v, container: block });
    },
  });
  console.log('calc-author-sub4 :  ', OVERVIEW_CONTAINER);
  block.append(OVERVIEW_CONTAINER);
  CALC_AUTHOR_MAIN.append(
    laitssBlock,
    tosiBlock,
    msaBlock,
    erftsBlock,
    erfssBlock,
  );
  calculateSTPSummary({ container: block });
}
