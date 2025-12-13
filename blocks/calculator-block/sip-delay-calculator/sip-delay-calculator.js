import { div } from '../../../scripts/dom-helpers.js';
import {
  createInputBlock,
  formatNumber,
  getAuthorData,
  safeUpdateMinimalReflow,
} from '../common-ui-field/common-ui-field.js';

/**
 * Calculate SIP Delay Summary with Opportunity Loss
 *
 * Implements the following logic based on the provided specification:
 * 1. Inputs:
 * P0 = monthlyInvestment (Monthly SIP entered by user)
 * Years = Investment period in years
 * d = Delay in months (derived from delayYears * 12)
 * R = annualReturnRate / 100
 *
 * 2. Derived Variables:
 * i = R / 12 (Monthly return)
 * n = Years * 12 (Total months)
 * n_delay = n - d (Months with SIP after delay)
 *
 * 3. Formulas (Annuity Due):
 * FV_start = P0 * ((1 + i)^n - 1) / i * (1 + i)
 * FV_delay = P0 * ((1 + i)^n_delay - 1) / i * (1 + i)
 * OppLoss = FV_start - FV_delay
 *
 * @param {Object} params
 * @param {number} params.monthlyInvestment - Amount invested per month (P0)
 * @param {number} params.annualReturnRate - Expected annual return rate (%)
 * @param {number} params.years - Investment duration in years
 * @param {number} params.delayYears - Delay in years (converted to 'd' months)
 * @param {number} [params.roundDecimal=0] - Decimal rounding precision
 * @param {Function} [params.callbackFunc] - Optional callback function
 * @returns {{
 * todaySummary: { totalValue: number },
 * delaySummary: { totalValue: number },
 * opportunityLoss: number,
 * totalInvestment: number,
 * delayInvestment: number,
 * delayMonths: number  // Added this field
 * }}
 */
export function calculateSipDelaySummary({
  monthlyInvestment,
  annualReturnRate,
  years,
  delayYears,
  roundDecimal = 0,
  callbackFunc,
}) {
  const inputErrors = document.querySelectorAll('.calc-input.calc-error');
  if (inputErrors?.length) {
    return {
      todaySummary: { totalValue: 0 },
      delaySummary: { totalValue: 0 },
      opportunityLoss: 0,
      totalInvestment: 0,
      delayInvestment: 0,
      delayMonths: 0, // Added strictly for UI display requirement
    };
  }
  // 1. Calculate Periodic Rate and Total Periods
  const P0 = monthlyInvestment;
  const R = annualReturnRate / 100;
  const i = R / 12; // Monthly return

  const n = years * 12; // Total months
  const d = Math.round(delayYears * 12); // Delay in months
  const n_delay = n - d; // Months with SIP after delay

  // --- Future Value of Annuity Due Helper ---
  // Formula: P * [((1 + i)^N - 1) / i] * (1 + i)
  const calculateFV_AnnuityDue = (P, rate, periods) => {
    if (periods <= 0) return 0;
    if (rate === 0) return P * periods;
    return P * (((1 + rate) ** periods - 1) / rate) * (1 + rate);
  };

  // 2. Calculate Final Values
  // FV_start: Final value if investor starts SIP today (using n)
  const FV_start = calculateFV_AnnuityDue(P0, i, n);

  // FV_delay: Final value if investor starts SIP after the delay (using n_delay)
  const FV_delay = calculateFV_AnnuityDue(P0, i, n_delay);

  // 3. Opportunity Loss
  const OppLoss = FV_start - FV_delay;

  // --- Formatting and Output ---
  const roundValue = (v) => Number(v.toFixed(roundDecimal));

  const result = {
    todaySummary: { totalValue: roundValue(FV_start) },
    delaySummary: { totalValue: roundValue(FV_delay) },
    opportunityLoss: roundValue(OppLoss),
    totalInvestment: roundValue(P0 * n),
    delayInvestment: roundValue(P0 * (n_delay > 0 ? n_delay : 0)),
    delayMonths: d, // Added strictly for UI display requirement
  };

  if (callbackFunc) callbackFunc(result);

  return result;
}

/**
 * Create SIP Delay Summary Block from existing authored elements
 */
export function createSipDelaySummaryBlock({ container = null }) {
  if (!container) return null;

  // Parent wrapper div
  const parent = div({
    class: 'calc-overview-summary calc-author-main2 sip-delay-summary',
  });

  // Select all authored subitems except 1–4
  const elements = container.querySelectorAll(
    '.comlist:not(.calc-author-subitem1):not(.calc-author-subitem2):not(.calc-author-subitem3):not(.calc-author-subitem4)',
  );

  elements.forEach((el) => {
    // Determine additional class for the child
    el.classList.add('calc-summary-item');
    let type = 'extra'; // default type

    if (el.classList.contains('calc-author-subitem6')) {
      el.classList.add('delay-item');
      type = 'delay';
    } else if (el.classList.contains('calc-author-subitem7')) {
      el.classList.add('delay-investment-item');
      type = 'delay-investment';
    } else if (el.classList.contains('calc-author-subitem8')) {
      el.classList.add('invest-today-item');
      type = 'invest-today';
    } else {
      if (el.querySelector('.button')) {
        el.querySelector('.button').classList.add('calc-overview-cta');
      }
      el.classList.add('extra-item');
    }

    // Process LIs
    const lis = el.querySelectorAll('li');
    lis.forEach((li, index) => {
      const hasIcon = li.querySelector('.icon');
      if (index === lis.length - 1) {
        li.classList.add('sip-amount'); // value class
        // Add unique ID
        li.id = `${type}-value`;
      } else if (!hasIcon) {
        li.classList.add('description');
      }
    });

    // Append the element directly to the parent
    parent.appendChild(el.cloneNode(true));
  });

  return parent;
}

/**
 * Update SIP Delay Overview dynamically
 * (used after recalculating delay SIP values)
 */
export function updateSipDelayOverview({ container, data }) {
  if (!container || !data) return;
  const { todaySummary, delaySummary, opportunityLoss } = data;

  // ✅ Update opportunity loss value
  const opportunityLossEl = container.querySelector('#delay-value');
  if (opportunityLossEl) {
    opportunityLossEl.textContent = formatNumber({
      value: opportunityLoss,
      currency: true,
    })?.replace('₹', '₹ ');
  }

  // ✅ Update delayed investment value
  const delayValueEl = container.querySelector('#delay-investment-value');
  if (delayValueEl) {
    delayValueEl.textContent = formatNumber({
      value: delaySummary?.totalValue,
      currency: true,
    })?.replace('₹', '₹ ');
  }

  // ✅ Update “Invest Today” value
  const todayValueEl = container.querySelector('#invest-today-value');
  if (todayValueEl) {
    todayValueEl.textContent = formatNumber({
      value: todaySummary?.totalValue,
      currency: true,
    })?.replace('₹', '₹ ');
  }
}

/**
 * Recalculate SIP Delay summary on input change
 */
function recalculateSipDelay({
  mi,
  ror,
  ip,
  delay,
  roundDecimal = 0,
  container,
}) {
  if (!container) return;

  const miInput = container.querySelector('#mi-amount');
  const rorInput = container.querySelector('#ror-return');
  const ipInput = container.querySelector('#inv-period');
  const delayInput = container.querySelector('#delay-period');

  const monthlyInvestment = mi != null ? Number(mi) : Number(miInput?.value || 0);
  const annualReturnRate = ror != null ? Number(ror) : Number(rorInput?.value || 0);
  const years = ip != null ? Number(ip) : Number(ipInput?.value || 0);
  const delayYears = delay != null ? Number(delay) : Number(delayInput?.value || 0);

  const summary = calculateSipDelaySummary({
    monthlyInvestment,
    annualReturnRate,
    years,
    delayYears,
    roundDecimal,
  });

  updateSipDelayOverview({ container, data: summary });
}

/**
 * Main decorator
 */
export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector('.calc-author-main1');
  if (!CALC_AUTHOR_MAIN) return;

  const authors = [
    { key: 'MI', selector: ':scope > .calc-author-sub1' },
    { key: 'IP', selector: ':scope > .calc-author-sub2' },
    { key: 'ROR', selector: ':scope > .calc-author-sub3' },
    { key: 'DELAY', selector: ':scope > .calc-author-sub4' },
  ];

  const CALC_AUTHORED_DATA = authors.map(({ key, selector }) => {
    const author = CALC_AUTHOR_MAIN.querySelector(selector);
    const data = author
      ? [...author.querySelectorAll('.comlist')].map((el) => el.textContent.trim())
      : [];
    return { key, data };
  });

  const container = document.querySelector('.comlist.calc-author-sub4');

  const summaryBlock = createSipDelaySummaryBlock({
    container,
  });

  block.appendChild(summaryBlock); // or append to wherever needed

  // CALC_AUTHOR_MAIN.innerHTML = "";

  const mi = getAuthorData(CALC_AUTHORED_DATA, 'MI');
  const ip = getAuthorData(CALC_AUTHORED_DATA, 'IP');
  const ror = getAuthorData(CALC_AUTHORED_DATA, 'ROR');
  const delay = getAuthorData(CALC_AUTHORED_DATA, 'DELAY');

  // Create inputs
  const miBlock = createInputBlock({
    id: 'mi-amount',
    ...mi,
    prefix: '₹',
    fieldType: 'currency',
    ignoreMin: true,
    inputBlockAttr: { class: 'mi-inp-container' },
    onInput: (e) => recalculateSipDelay({ mi: e.target.value, container: block }),
    onChange: (v) => recalculateSipDelay({ mi: v, container: block }),
  });

  const ipBlock = createInputBlock({
    id: 'inv-period',
    ...ip,
    fieldType: 'year',
    suffix: ip?.default > 1 ? 'Years' : 'Year',
    variant: 'stepper',
    ignoreMin: true,
    inputBlockAttr: { class: 'ip-inp-container' },
    updateWidthonChange: true,
    onInput: (e) => recalculateSipDelay({ ip: e.target.value, container: block }),
    onChange: (v) => recalculateSipDelay({ ip: v, container: block }),
  });

  const rorBlock = createInputBlock({
    id: 'ror-return',
    ...ror,
    suffix: '%',
    fieldType: 'percent',
    ignoreMin: true,
    inputBlockAttr: { class: 'ror-inp-container' },
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => recalculateSipDelay({ ror: e.target.value, container: block }),
    onChange: (v) => recalculateSipDelay({ ror: v, container: block }),
  });

  const delayBlock = createInputBlock({
    id: 'delay-period',
    ...delay,
    fieldType: 'year',
    suffix: delay?.default > 1 ? 'years' : 'year',
    ignoreMin: true,
    inputBlockAttr: { class: 'delay-inp-container' },
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => recalculateSipDelay({ delay: e.target.value, container: block }),
    onChange: (v) => recalculateSipDelay({ delay: v, container: block }),
  });

  // CALC_AUTHOR_MAIN.append(miBlock, ipBlock, rorBlock, delayBlock);

  safeUpdateMinimalReflow(
    CALC_AUTHOR_MAIN,
    () => {
      const frag = document.createDocumentFragment();
      frag.append(miBlock, ipBlock, rorBlock, delayBlock);
      return frag;
    },
    /* useReserve= */ true,
    /* extraPx= */ 0,
  );
  //   const overviewBlock = createSipDelayOverviewBlock({ container: block });
  recalculateSipDelay({ container: block });
  // Initial calculation
  //   recalculateSipDelay({
  //     mi: mi?.default,
  //     ror: ror?.default,
  //     ip: ip?.default,
  //     delay: delay?.default,
  //     container: block,
  //   });
}
