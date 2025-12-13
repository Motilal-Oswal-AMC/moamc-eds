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
  console.log('data : ', data);

  if (TEFS_EL) {
    TEFS_EL.textContent = formatNumber({
      value: data?.totalGain,
      currency: true,
    })?.replace('₹', '₹ ');
  }
  if (IIISS_EL) {
    IIISS_EL.textContent = formatNumber({
      // Check each value; if undefined, default to 0
      value: (data?.totalValue ?? 0) - (data?.totalGain ?? 0),
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
 * Calculate STP summary using "Beginning of Period" (Type 1) logic.
 *
 * Formulas used per iteration (m = 1 to n):
 * 1. Rates:
 * i_src = sourceAnnualRate / 1200
 * i_tgt = destinationAnnualRate / 1200
 *
 * 2. Source Scheme (Outflow at Start, Interest on Remainder):
 * Transfer_m = MIN(transferAmount, SrcOpening)
 * SrcRemainder = SrcOpening - Transfer_m
 * SrcInterest = SrcRemainder * i_src
 * SrcClosing = SrcRemainder + SrcInterest
 *
 * 3. Target Scheme (Inflow at Start, Interest on Total):
 * TgtInvested = TgtOpening + Transfer_m
 * TgtInterest = TgtInvested * i_tgt
 * TgtClosing = TgtInvested + TgtInterest
 *
 * @param {Object} params
 * @param {number} params.initialInvestment - Lump sum invested in source fund (P0)
 * @param {number} params.transferAmount - Monthly STP Amount
 * @param {number} params.sourceAnnualRate - Annual return rate (%) of Source fund (#erfss)
 * @param {number} params.destinationAnnualRate - Annual return rate (%) of Target fund (#erfts)
 * @param {number} params.years - Duration of STP in years
 * @param {number} [params.roundDecimal=0] - Decimal rounding precision
 * @param {Function} [params.callbackFunc] - Optional callback function
 * @param {HTMLElement} [params.container] - Optional DOM container for inputs
 * @returns {{
 * totalTransferred: number,
 * finalDestinationValue: number,
 * remainingSourceValue: number,
 * totalValue: number,
 * totalGain: number,
 * sourceGain: number,
 * destinationGain: number,
 * transferPercentage: number,
 * gainPercentage: number
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

  // Helper: Parse number, return null if invalid
  const num = (v) => (v != null && v !== '' && !isNaN(v) ? parseFloat(v) : null);

  // 1. Parse Inputs (Argument Priority > DOM Fallback)
  // CRITICAL FIX: Ensure correct ID mapping based on acronyms
  // erfss = Expected Return From Source Scheme
  // erfts = Expected Return From Target Scheme

  const P0 = num(initialInvestment)
    ?? (container ? num(container.querySelector('#laitss-amount').value) : 0);

  const STP_amount = num(transferAmount)
    ?? (container ? num(container.querySelector('#msa-amount').value) : 0);

  const R_source = num(sourceAnnualRate)
    ?? (container ? num(container.querySelector('#erfss-start').value) : 0);

  const R_target = num(destinationAnnualRate)
    ?? (container ? num(container.querySelector('#erfts-start').value) : 0);

  const Tenure_years = num(years)
    ?? (container ? num(container.querySelector('#tosi-start').value) : 0);

  const inputErrors = document.querySelectorAll('.calc-input.calc-error');

  // 2. Validation
  if (
    !P0
    || !STP_amount
    || R_source == null
    || R_target == null
    || !Tenure_years
    || inputErrors?.length
  ) {
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
      container,
    };
    if (callbackFunc) callbackFunc(data);
    return data;
  }

  // 3. Calculation Setup
  const n = Tenure_years * 12;
  const i_src = R_source / 100 / 12; // Monthly Source Rate
  const i_tgt = R_target / 100 / 12; // Monthly Target Rate

  let SrcBalance = P0;
  let TgtBalance = 0;
  let totalTransferred = 0;

  // 4. Monthly Loop (Type 1: Transactions occur at start of month)
  for (let m = 1; m <= n; m++) {
    // --- SOURCE SIDE ---
    // 1. Deduct Transfer immediately (Start of Month)
    const actualTransfer = SrcBalance > 0 ? Math.min(STP_amount, SrcBalance) : 0;

    // 2. Calculate Interest on the REMAINING balance
    const srcRemainder = SrcBalance - actualTransfer;
    const srcInterest = srcRemainder * i_src;

    // 3. Update Closing Balance
    SrcBalance = srcRemainder + srcInterest;

    // --- TARGET SIDE ---
    // 1. Add Investment immediately (Start of Month)
    totalTransferred += actualTransfer;
    const tgtInvestedBalance = TgtBalance + actualTransfer;

    // 2. Calculate Interest on the NEW balance (Opening + Investment)
    const tgtInterest = tgtInvestedBalance * i_tgt;

    // 3. Update Closing Balance
    TgtBalance = tgtInvestedBalance + tgtInterest;
  }

  // 5. Final Aggregation
  const remainingSourceValue = SrcBalance;
  const finalDestinationValue = TgtBalance;
  const totalValue = remainingSourceValue + finalDestinationValue;
  const totalGain = totalValue - P0;

  // Breakdown
  const sourcePrincipalRemaining = P0 - totalTransferred;
  const sourceGain = remainingSourceValue - sourcePrincipalRemaining;
  const destinationGain = finalDestinationValue - totalTransferred;

  // Percentages
  const transferPercentage = P0 > 0 ? (totalTransferred / P0) * 100 : 0;
  const gainPercentage = P0 > 0 ? (totalGain / P0) * 100 : 0;

  const round = (val) => (roundDecimal != null ? Number(val.toFixed(roundDecimal)) : val);

  data = {
    totalTransferred: round(totalTransferred),
    finalDestinationValue: round(finalDestinationValue),
    remainingSourceValue: round(remainingSourceValue),
    totalValue: round(totalValue),
    totalGain: round(totalGain),
    sourceGain: round(sourceGain),
    destinationGain: round(destinationGain),
    transferPercentage: round(transferPercentage),
    gainPercentage: round(gainPercentage),
    container,
  };

  // Optional: Console log for debugging exact values if needed
  // console.log(`Source Rate: ${R_source}%, Target Rate: ${R_target}%`);
  // console.log(`Source Rem: ${remainingSourceValue}, Target FV: ${finalDestinationValue}`);

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
    ignoreMin: true,
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
    ignoreMin: true,
    inputBlockAttr: {
      class: 'tosi-inp-container',
    },
    fieldType: 'year',
    suffix: tosi?.default > 1 ? 'Years' : 'Year',
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
    ignoreMin: true,
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
    ignoreMin: true,
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
    ignoreMin: true,
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
