import {
  createInputBlock,
  createBarSummaryBlock,
  getAuthorData,
  formatNumber,
  safeUpdateMinimalReflow,
} from "../common-ui-field/common-ui-field.js";

/**
 * Calculate Lumpsum Investment summary
 * @param {Object} params
 * @param {number} params.totalInvestment - Total amount invested initially (principal)
 * @param {number} params.rateOfReturn - Expected annual return rate (%)
 * @param {number} params.timePeriod - Investment duration (years)
 * @param {number} [params.roundDecimal] - Number of decimals to round to; 0 = integer
 * @returns {{
 *   totalInvestment: number,
 *   totalValue: number,
 *   estimatedReturns: number,
 *   compoundingAt: string,
 *   investedPercentage: number,
 *   returnsPercentage: number
 * }}
 */
export function calculateLumpsumSummary({
  totalInvestment,
  rateOfReturn,
  timePeriod,
  roundDecimal,
  callbackFunc,
}) {
  let data;
  const inputErrors = document.querySelectorAll('.calc-input.calc-error');

  if (!totalInvestment || !rateOfReturn || !timePeriod || inputErrors?.length) {
    data = {
      totalInvestment: 0,
      totalValue: 0,
      estimatedReturns: 0,
      compoundingAt: '1.0x',
      investedPercentage: 0,
      returnsPercentage: 0,
    };
    if (callbackFunc) callbackFunc(data);
    return data;
  }

  const num = (v, d = 0) => (v != null ? parseFloat(v) : d);

  // 1. FIX: Create new variables instead of overwriting parameters
  const parsedTotalInvestment = num(totalInvestment);
  const parsedRateOfReturn = num(rateOfReturn);
  const parsedTimePeriod = num(timePeriod);

  const rate = parsedRateOfReturn / 100;

  // Formula: Future Value = P * (1 + r)^t
  // 2. FIX: Use the new parsed variables in the calculation
  const totalValue = parsedTotalInvestment * (1 + rate) ** parsedTimePeriod;
  const estimatedReturns = totalValue - parsedTotalInvestment;

  const multiplier = totalValue / parsedTotalInvestment;
  const compoundingAt = `${multiplier.toFixed(1)}x`;

  const investedPercentage = (parsedTotalInvestment / totalValue) * 100;
  const returnsPercentage = (estimatedReturns / totalValue) * 100;

  const roundValue = (val) => {
    if (roundDecimal == null) return val;
    return Number(val.toFixed(roundDecimal));
  };

  data = {
    totalInvestment: roundValue(parsedTotalInvestment),
    totalValue: roundValue(totalValue),
    estimatedReturns: roundValue(estimatedReturns),
    compoundingAt,
    investedPercentage: roundValue(investedPercentage),
    returnsPercentage: roundValue(returnsPercentage),
  };

  if (callbackFunc) callbackFunc(data);
  return data;
}

export function updateCalculateSummary({ container, data }) {
  if (!container || !data) return;

  const totalReturnsEl = container.querySelector('#sip-total-returns');
  const investedAmountEl = container.querySelector('#total-invested-amount');
  const estimatedReturnsEl = container.querySelector(
    '#total-estimated-returns',
  );
  const compoundRateEl = container.querySelector('#compound-rate');
  if (totalReturnsEl) {
    totalReturnsEl.textContent = formatNumber({
      value: data.totalValue,
      currency: true,
    })?.replace('₹', '₹ ');
  }

  if (investedAmountEl) {
    investedAmountEl.textContent = formatNumber({
      value: data.totalInvestment,
      currency: true,
    });
  }

  if (estimatedReturnsEl) {
    estimatedReturnsEl.textContent = formatNumber({
      value: data.estimatedReturns,
      currency: true,
    });
  }

  if (compoundRateEl) {
    compoundRateEl.textContent = data.compoundingAt;
  }
}

function recalculateLumpsum({
  ti, ror, tp, roundDecimal = 0, container,
}) {
  if (!container) return;
  // If values are not passed, fetch from input elements
  const tiInput = container.querySelector('#total-investment-amt');
  const rorInput = container.querySelector('#rate-return');
  const tpInput = container.querySelector('#time-period');

  const totalInvestment = ti != null ? Number(ti) : Number(tiInput?.value || 0);
  const rateOfReturn = ror != null ? Number(ror) : Number(rorInput?.value || 0);
  const timePeriod = tp != null ? Number(tp) : Number(tpInput?.value || 0);

  // 1️⃣ Calculate SIP summary
  const summary = calculateLumpsumSummary({
    totalInvestment,
    rateOfReturn,
    timePeriod,
    roundDecimal,
  });
  container.querySelector(
    '.calc-compounding .estimated-returns-bar',
  ).style.width = `${summary?.returnsPercentage}%`;
  // 2️⃣ Update the UI with the new values
  updateCalculateSummary({
    container,
    data: summary,
  });

  // return summary; // optional
}

export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector('.calc-author-main1');
  if (!CALC_AUTHOR_MAIN) {
    console.warn('No .calc-author-main1 element found.');
    return;
  }

  const authors = [
    { key: 'TI', selector: ':scope > .calc-author-sub1' },
    { key: 'ROR', selector: ':scope > .calc-author-sub2' },
    { key: 'IP', selector: ':scope > .calc-author-sub3' },
  ];

  const CALC_AUTHORED_DATA = authors.map(({ key, selector }) => {
    const author = CALC_AUTHOR_MAIN.querySelector(selector);
    const data = author
      ? [...author.querySelectorAll('.comlist')].map((el) => el.textContent.trim())
      : [];
    return { key, data };
  });
  const OVERVIEW_DATA = CALC_AUTHOR_MAIN.querySelector(
    ':scope > .calc-author-sub4',
  );
  const lumpsumBlock = createBarSummaryBlock({
    container: OVERVIEW_DATA,
  });
  // CALC_AUTHOR_MAIN.innerHTML = "";

  const ti = getAuthorData(CALC_AUTHORED_DATA, 'TI');
  const ror = getAuthorData(CALC_AUTHORED_DATA, 'ROR');
  const tp = getAuthorData(CALC_AUTHORED_DATA, 'IP');
  const tiBlock = createInputBlock({
    id: 'total-investment-amt',
    ...ti,
    prefix: '₹',
    fieldType: 'currency',
    ignoreMin: true,
    prefixAttr: { class: 'currency-prefix' },
    inputBlockAttr: {
      class: 'ti-inp-container',
    },
    variant: 'number',
    onInput: (e) => {
      recalculateLumpsum({ ti: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateLumpsum({ ti: v, container: block });
    },
  });

  const rorBlock = createInputBlock({
    id: 'rate-return',
    ...ror,
    suffix: '%',
    inputBlockAttr: {
      class: 'ror-inp-container',
    },
    suffixAttr: { class: 'input-suffix' },
    fieldType: 'percent',
    variant: 'stepper',
    ignoreMin: true,
    updateWidthonChange: true,
    onInput: (e) => {
      recalculateLumpsum({ ror: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateLumpsum({ ror: v, container: block });
    },
  });

  const tpBlock = createInputBlock({
    id: 'time-period',
    ...tp,
    inputBlockAttr: {
      class: 'tp-inp-container',
    },
    fieldType: 'year',
    suffix: tp?.default > 1 ? 'Years' : 'Year',
    variant: 'stepper',
    ignoreMin: true,
    updateWidthonChange: true,
    onInput: (e) => {
      recalculateLumpsum({ tp: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateLumpsum({ tp: v, container: block });
    },
  });
  // Append to container
  // CALC_AUTHOR_MAIN.append(tiBlock, rorBlock, tpBlock);
  safeUpdateMinimalReflow(
    CALC_AUTHOR_MAIN,
    () => {
      const frag = document.createDocumentFragment();
      frag.append(tiBlock, rorBlock, tpBlock);
      return frag;
    },
    /* useReserve= */ true,
    /* extraPx= */ 0
  );

  block.appendChild(lumpsumBlock);

  updateCalculateSummary({
    container: block,
    data: calculateLumpsumSummary({
      totalInvestment: ti.default,
      rateOfReturn: ror.default,
      timePeriod: tp.default,
      roundDecimal: 0,
    }),
  });
}
