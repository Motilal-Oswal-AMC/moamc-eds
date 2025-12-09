import { div } from '../../../scripts/dom-helpers.js';
import {
  createInputBlock,
  formatNumber,
  getAuthorData,
} from '../common-ui-field/common-ui-field.js';

/**
 * Calculate SIP Delay Summary with Opportunity Loss
 * * This function calculates the future value of a Systematic Investment Plan (SIP)
 * under two scenarios (starting now vs. starting later) using the formula for
 * the Future Value of an Annuity Due (payments at the start of the period).
 * * The calculation is based on the summation method:
 * * 1. Future Value Today (FV_T):
 * FV_T = Sum(m = 1 to M) [ P * (1 + r_m)^(M - m + 1) ]
 * * 2. Future Value Delayed (FV_D):
 * FV_D = Sum(m = 1 to (M - D_m)) [ P * (1 + r_m)^(M - m - D_m + 1) ]
 * * Where:
 * P   = monthlyInvestment (Monthly SIP)
 * r_m = monthlyRate (Monthly Return Rate)
 * M   = months (Total Investment Months)
 * D_m = delayMonths (Delay in Months)
 * m   = Current month index in the loop
 * * @param {Object} params
 * @param {number} params.monthlyInvestment - Amount invested per month (P)
 * @param {number} params.annualReturnRate - Expected annual return rate (%)
 * @param {number} params.years - Investment duration (years)
 * @param {number} params.delayYears - Delay in years (e.g., 1 month = 1/12)
 * @param {number} [params.roundDecimal] - Decimal rounding
 * @param {function} [params.callbackFunc] - Function to call with result
 */
export function calculateSipDelaySummary({
  monthlyInvestment,
  annualReturnRate,
  years,
  delayYears,
  roundDecimal = 0,
  callbackFunc,
}) {
  // 1. Calculate Periodic Rate and Total Periods
  const monthlyRate = annualReturnRate / 12 / 100; // i (Monthly Rate)
  const totalMonths = years * 12; // Total Timeframe in months
  const delayMonths = Math.round(delayYears * 12); // Delay period in months

  // --- Future Value of Annuity Due (FVA) Helper ---
  // FV = P * [((1 + i)^n - 1) / i] * (1 + i)
  const calculateFVA = (P, i, n) => {
    // Edge case: If the rate is 0, the value is just the total principal invested
    if (i === 0) {
      return P * n;
    }

    // FVA Factor: [((1 + i)^n - 1) / i]
    const fvaFactor = ((1 + i) ** n - 1) / i;

    // Annuity Due: Multiply by (1 + i) because payments are at the start of the period
    return P * fvaFactor * (1 + i);
  };

  // --- Calculation Logic ---

  // 1. Total if started today (Today Total)
  // Total payments (n) = totalMonths
  const todayTotal = calculateFVA(monthlyInvestment, monthlyRate, totalMonths);

  // 2. Total if delayed (Delay Total)
  // The number of payments made (n') is reduced by the delay.
  const delayInstallments = totalMonths - delayMonths;

  let delayTotal = 0;
  if (delayInstallments > 0) {
    delayTotal = calculateFVA(
      monthlyInvestment,
      monthlyRate,
      delayInstallments,
    );
  }

  // 3. Opportunity Loss
  // The loss is the difference in the final corpus due to missing the early payments.
  const opportunityLoss = todayTotal - delayTotal;

  // --- Formatting and Output ---
  const roundValue = (v) => Number(v.toFixed(roundDecimal));

  const result = {
    todaySummary: { totalValue: roundValue(todayTotal) },
    delaySummary: { totalValue: roundValue(delayTotal) },
    opportunityLoss: roundValue(opportunityLoss),
    // Optional: Add total investment to show the returns earned
    totalInvestment: roundValue(monthlyInvestment * totalMonths),
    delayInvestment: roundValue(monthlyInvestment * delayInstallments),
  };

  console.log('result : ', result);
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
    });
  }

  // ✅ Update delayed investment value
  const delayValueEl = container.querySelector('#delay-investment-value');
  if (delayValueEl) {
    delayValueEl.textContent = formatNumber({
      value: delaySummary?.totalValue,
      currency: true,
    });
  }

  // ✅ Update “Invest Today” value
  const todayValueEl = container.querySelector('#invest-today-value');
  if (todayValueEl) {
    todayValueEl.textContent = formatNumber({
      value: todaySummary?.totalValue,
      currency: true,
    });
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

  CALC_AUTHOR_MAIN.innerHTML = '';

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
    inputBlockAttr: { class: 'mi-inp-container' },
    onInput: (e) => recalculateSipDelay({ mi: e.target.value, container: block }),
    onChange: (v) => recalculateSipDelay({ mi: v, container: block }),
  });

  const ipBlock = createInputBlock({
    id: 'inv-period',
    ...ip,
    fieldType: 'year',
    suffix: ip?.default > 1 ? 'years' : 'year',
    variant: 'stepper',
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
    inputBlockAttr: { class: 'delay-inp-container' },
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => recalculateSipDelay({ delay: e.target.value, container: block }),
    onChange: (v) => recalculateSipDelay({ delay: v, container: block }),
  });

  CALC_AUTHOR_MAIN.append(miBlock, ipBlock, rorBlock, delayBlock);

  //   const overviewBlock = createSipDelayOverviewBlock({ container: block });

  // Initial calculation
  //   recalculateSipDelay({
  //     mi: mi?.default,
  //     ror: ror?.default,
  //     ip: ip?.default,
  //     delay: delay?.default,
  //     container: block,
  //   });
}
