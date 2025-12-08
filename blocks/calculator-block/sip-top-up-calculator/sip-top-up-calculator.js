import {
  createInputBlock,
  formatNumber,
  createBarSummaryBlock,
  getAuthorData,
} from '../common-ui-field/common-ui-field.js';

/**
 * Calculate Top-up SIP Summary
 * @param {Object} params
 * @param {number} params.monthlyInvestment - Initial monthly SIP amount
 * @param {number} params.annualIncreaseRate - Annual top-up rate (%)
 * @param {number} params.annualReturnRate - Expected annual return rate (%)
 * @param {number} params.years - Investment duration (years)
 * @param {number} [params.roundDecimal] - Decimal rounding precision
 * @param {Function} [params.callbackFunc] - Optional callback with result
 * @returns {{
 *   totalInvestment: number,
 *   totalValue: number,
 *   estimatedReturns: number,
 *   compoundingAt: string,
 *   investedPercentage: number,
 *   returnsPercentage: number
 * }}
 */
export function calculateTopupSIPSummary({
  monthlyInvestment,
  annualIncreaseRate,
  annualReturnRate,
  years,
  roundDecimal = 0,
  callbackFunc,
}) {
  // 1. Validation check
  if (
    !monthlyInvestment
    || !annualIncreaseRate
    || !annualReturnRate
    || !years
  ) {
    const empty = {
      totalInvestment: 0,
      totalValue: 0,
      estimatedReturns: 0,
      compoundingAt: '1.0x',
      investedPercentage: 0,
      returnsPercentage: 0,
    };
    if (callbackFunc) callbackFunc(empty);
    return empty;
  }

  const num = (v, d = 0) => (v != null ? parseFloat(v) : d);

  // 2. Fix: Assign processed values to NEW constants
  const parsedMonthlyInvestment = num(monthlyInvestment);
  const parsedAnnualIncreaseRate = num(annualIncreaseRate);
  const parsedAnnualReturnRate = num(annualReturnRate);
  const parsedYears = num(years);

  // 3. Update calculations to use the new constants
  const months = parsedYears * 12;
  const monthlyRate = parsedAnnualReturnRate / 12 / 100;
  const topUpRate = parsedAnnualIncreaseRate / 100;

  let totalValue = 0;
  let totalInvestment = 0;
  let currentMonthly = parsedMonthlyInvestment; // Initialize with parsed value

  // Loop year by year
  for (let y = 1; y <= parsedYears; y += 1) {
    for (let m = 1; m <= 12; m += 1) {
      const monthsLeft = months - (y - 1) * 12 - (m - 1);
      totalValue += currentMonthly * (1 + monthlyRate) ** monthsLeft;
      totalInvestment += currentMonthly;
    }
    // Apply annual top-up at the end of each year
    currentMonthly *= 1 + topUpRate;
  }

  const estimatedReturns = totalValue - totalInvestment;
  const multiplier = totalValue / totalInvestment;
  const compoundingAt = `${multiplier.toFixed(1)}x`;

  const investedPercentage = (totalInvestment / totalValue) * 100;
  const returnsPercentage = (estimatedReturns / totalValue) * 100;

  const roundValue = (val) => Number(val.toFixed(roundDecimal));

  const result = {
    totalInvestment: roundValue(totalInvestment),
    totalValue: roundValue(totalValue),
    estimatedReturns: roundValue(estimatedReturns),
    compoundingAt,
    investedPercentage: roundValue(investedPercentage),
    returnsPercentage: roundValue(returnsPercentage),
  };
  
  // console.log('result : ', totalValue); // Optional: removed/commented for cleaner linting

  if (callbackFunc) callbackFunc(result);
  return result;
}

/**
 * Update Overview UI for Top-up SIP
 */
export function updateCalculateTopupSipSummary({ container, data }) {
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
    });
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

  if (compoundRateEl) compoundRateEl.textContent = data.compoundingAt;

  const bar = container.querySelector(
    '.calc-compounding .estimated-returns-bar',
  );
  if (bar) bar.style.width = `${data.returnsPercentage}%`;
}

/**
 * Recalculate when inputs change
 */
function recalculateTopupSip({
  mi,
  asu,
  eror,
  tp,
  roundDecimal = 0,
  container,
}) {
  if (!container) return;

  const miInput = container.querySelector('#mi-amount');
  const asuInput = container.querySelector('#asu-return');
  const erorInput = container.querySelector('#eror-return');
  const tpInput = container.querySelector('#tp-period');

  const monthlyInvestment = mi ?? Number(miInput?.value || 0);
  const annualIncreaseRate = asu ?? Number(asuInput?.value || 0);
  const annualReturnRate = eror ?? Number(erorInput?.value || 0);
  const years = tp ?? Number(tpInput?.value || 0);

  const summary = calculateTopupSIPSummary({
    monthlyInvestment,
    annualIncreaseRate,
    annualReturnRate,
    years,
    roundDecimal,
  });

  updateCalculateTopupSipSummary({
    container,
    data: summary,
  });
}

/**
 * Main Decorator — Builds Input + Overview UI
 */
export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector('.calc-author-main1');
  if (!CALC_AUTHOR_MAIN) {
    console.warn('No .calc-author-main1 element found.');
    return;
  }

  // Get authored data sections
  const authors = [
    { key: 'MI', selector: ':scope > .calc-author-sub1' },
    { key: 'ASU', selector: ':scope > .calc-author-sub2' },
    { key: 'EROR', selector: ':scope > .calc-author-sub3' },
    { key: 'TP', selector: ':scope > .calc-author-sub4' },
  ];

  const CALC_AUTHORED_DATA = authors.map(({ key, selector }) => {
    const author = CALC_AUTHOR_MAIN.querySelector(selector);
    const data = author
      ? [...author.querySelectorAll('.comlist')].map((el) => el.textContent.trim())
      : [];
    return { key, data };
  });

  // Get the .calc-author-sub4 section
  const overviewParent = CALC_AUTHOR_MAIN.querySelector(
    ':scope > .calc-author-sub4',
  );

  // Filter out only the overview items (skip subitem1–4)
  let OVERVIEW_DATA = null;
  if (overviewParent) {
    OVERVIEW_DATA = document.createElement('div');
    OVERVIEW_DATA.classList.add('overview-container');

    // Select all children except .calc-author-subitem1 to .calc-author-subitem4
    const overviewItems = overviewParent.querySelectorAll(
      ':scope > .comlist:not(.calc-author-subitem1):not(.calc-author-subitem2):not(.calc-author-subitem3):not(.calc-author-subitem4)',
    );

    overviewItems.forEach((item) => OVERVIEW_DATA.appendChild(item.cloneNode(true)));
  }

  const sipBlock = createBarSummaryBlock({ container: OVERVIEW_DATA });
  CALC_AUTHOR_MAIN.innerHTML = '';

  const mi = getAuthorData(CALC_AUTHORED_DATA, 'MI');
  const asu = getAuthorData(CALC_AUTHORED_DATA, 'ASU');
  const eror = getAuthorData(CALC_AUTHORED_DATA, 'EROR');
  const tp = getAuthorData(CALC_AUTHORED_DATA, 'TP');

  const miBlock = createInputBlock({
    id: 'mi-amount',
    ...mi,
    prefix: '₹',
    fieldType: 'currency',
    prefixAttr: { class: 'currency-prefix' },
    inputBlockAttr: { class: 'mi-inp-container' },
    variant: 'number',
    onInput: (e) => recalculateTopupSip({ mi: e.target.value, container: block }),
    onChange: (v) => recalculateTopupSip({ mi: v, container: block }),
  });

  const asuBlock = createInputBlock({
    id: 'asu-return',
    ...asu,
    suffix: '%',
    inputBlockAttr: { class: 'asu-inp-container' },
    suffixAttr: { class: 'input-suffix' },
    fieldType: 'percent',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => recalculateTopupSip({ asu: e.target.value, container: block }),
    onChange: (v) => recalculateTopupSip({ asu: v, container: block }),
  });

  const erorBlock = createInputBlock({
    id: 'eror-return',
    ...eror,
    suffix: '%',
    inputBlockAttr: { class: 'eror-inp-container' },
    suffixAttr: { class: 'input-suffix' },
    fieldType: 'percent',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => recalculateTopupSip({ eror: e.target.value, container: block }),
    onChange: (v) => recalculateTopupSip({ eror: v, container: block }),
  });

  const tpBlock = createInputBlock({
    id: 'tp-period',
    ...tp,
    inputBlockAttr: { class: 'tp-inp-container' },
    fieldType: 'year',
    suffix: tp?.default > 1 ? 'years' : 'year',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => recalculateTopupSip({ tp: e.target.value, container: block }),
    onChange: (v) => recalculateTopupSip({ tp: v, container: block }),
  });

  CALC_AUTHOR_MAIN.append(miBlock, asuBlock, erorBlock, tpBlock);
  block.appendChild(sipBlock);
  console.log('sipBlock : ', sipBlock);

  // Initial summary render
  updateCalculateTopupSipSummary({
    container: block,
    data: calculateTopupSIPSummary({
      monthlyInvestment: Number(mi.default),
      annualIncreaseRate: Number(asu.default),
      annualReturnRate: Number(eror.default),
      years: Number(tp.default),
      roundDecimal: 0,
    }),
  });
}
