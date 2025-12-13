import {
  createInputBlock,
  formatNumber,
  createBarSummaryBlock,
  getAuthorData,
  safeUpdateMinimalReflow,
} from '../common-ui-field/common-ui-field.js';

/**
 * Calculate Top-up SIP Summary
 *
 * Implements the following logic based on the provided specification:
 * - g (Annual step-up rate) = annualIncreaseRate / 100
 * - R (Annual return rate) = annualReturnRate / 100
 * - i (Monthly return) = R / 12
 * - n (Total months) = years * 12
 * - SIPm (SIP in month m) = P0 * (1 + g) ^ floor((m - 1) / 12)
 * - Returnm (Return in month m) = (OBm + Depositm) * i
 * - CBm (Closing Balance) = OBm + Depositm + Returnm
 * - FV (Final Value) = CBn
 *
 * @param {Object} params
 * @param {number} params.monthlyInvestment - Initial monthly SIP amount (P0)
 * @param {number} params.annualIncreaseRate - Annual top-up rate in percentage (StepUp%)
 * @param {number} params.annualReturnRate - Expected annual return rate in percentage (Expected Return %)
 * @param {number} params.years - Investment duration in years
 * @param {number} [params.roundDecimal=0] - Decimal rounding precision for final output
 * @param {Function} [params.callbackFunc] - Optional callback function to receive the result object
 * @returns {{
 * totalInvestment: number,    // Total amount invested (Σ Depositm)
 * totalValue: number,         // Final maturity value (FV)
 * estimatedReturns: number,   // Total gains (FV - Invested)
 * compoundingAt: string,      // Multiplier string (e.g., "1.5x")
 * investedPercentage: number, // % of Total Value that is Principal
 * returnsPercentage: number   // % of Total Value that is Interest
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
  const inputErrors = document.querySelectorAll('.calc-input.calc-error');

  // 1. Validation check
  if (
    !monthlyInvestment
    || monthlyInvestment === 0 // Handle explicit 0
    || annualIncreaseRate == null
    || annualReturnRate == null
    || !years
    || inputErrors?.length
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

  // 2. Parse Inputs
  const P0 = num(monthlyInvestment); // Row 1
  const g = num(annualIncreaseRate) / 100; // Row 2
  const R = num(annualReturnRate) / 100; // Row 3
  const parsedYears = num(years);

  // 3. Derived Variables
  const i = R / 12; // Row 4: Monthly return
  const n = parsedYears * 12; // Row 5: Total months

  let OBm = 0; // Opening Balance (Row 7: OB1 = 0)
  let totalInvestment = 0; // To calculate Row 12
  let CBm = 0; // Closing Balance

  // 4. Monthly Iteration Loop
  for (let m = 1; m <= n; m += 1) {
    // Row 6: SIP in month m
    // Formula: P0 * (1 + g) ^ floor((m - 1) / 12)
    const stepUpFactor = Math.floor((m - 1) / 12);
    const SIPm = P0 * (1 + g) ** stepUpFactor;

    // Row 9: Monthly investment
    const Depositm = SIPm;

    // Row 8: Return in month m
    // Formula: (OBm + Depositm) * i
    const Returnm = (OBm + Depositm) * i;

    // Row 10: Closing balance in month m
    // Formula: OBm + Depositm + Returnm
    CBm = OBm + Depositm + Returnm;

    // Update totals
    totalInvestment += Depositm;

    // Set Opening Balance for next month (Row 7: OBm = CB(m-1))
    OBm = CBm;
  }

  // Row 11: Final Value
  const totalValue = CBm;

  // Row 13: Returns gained
  const estimatedReturns = totalValue - totalInvestment;

  // Calculate Metrics
  const multiplier = totalInvestment > 0 ? totalValue / totalInvestment : 0;
  const compoundingAt = `${multiplier.toFixed(1)}x`;

  const investedPercentage = totalValue > 0 ? (totalInvestment / totalValue) * 100 : 0;
  const returnsPercentage = totalValue > 0 ? (estimatedReturns / totalValue) * 100 : 0;

  const roundValue = (val) => Number(val.toFixed(roundDecimal));

  const result = {
    totalInvestment: roundValue(totalInvestment),
    totalValue: roundValue(totalValue),
    estimatedReturns: roundValue(estimatedReturns),
    compoundingAt,
    investedPercentage: roundValue(investedPercentage),
    returnsPercentage: roundValue(returnsPercentage),
  };

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
  // CALC_AUTHOR_MAIN.innerHTML = "";

  const mi = getAuthorData(CALC_AUTHORED_DATA, 'MI');
  const asu = getAuthorData(CALC_AUTHORED_DATA, 'ASU');
  const eror = getAuthorData(CALC_AUTHORED_DATA, 'EROR');
  const tp = getAuthorData(CALC_AUTHORED_DATA, 'TP');

  const miBlock = createInputBlock({
    id: 'mi-amount',
    ...mi,
    prefix: '₹',
    fieldType: 'currency',
    ignoreMin: true,
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
    ignoreMin: true,
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
    ignoreMin: true,
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
    ignoreMin: true,
    suffix: tp?.default > 1 ? 'Years' : 'Year',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => recalculateTopupSip({ tp: e.target.value, container: block }),
    onChange: (v) => recalculateTopupSip({ tp: v, container: block }),
  });

  safeUpdateMinimalReflow(
    CALC_AUTHOR_MAIN,
    () => {
      const frag = document.createDocumentFragment();
      frag.append(miBlock, asuBlock, erorBlock, tpBlock);
      return frag;
    },
    /* useReserve= */ true,
    /* extraPx= */ 0,
  );
  // CALC_AUTHOR_MAIN.append(miBlock, asuBlock, erorBlock, tpBlock);
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
