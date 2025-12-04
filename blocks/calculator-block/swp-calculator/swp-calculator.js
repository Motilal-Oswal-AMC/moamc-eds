import { div, span, button } from '../../../scripts/dom-helpers.js';

import {
  createInputBlock,
  formatNumber,
} from '../common-ui-field/common-ui-field.js';

/**
 * Update SWP Summary Block values dynamically
 * @param {Object} params
 * @param {HTMLElement} params.container - The SWP summary container element
 * @param {number|string} [params.preSwpValue] - Investment value before SWP starts
 * @param {number|string} [params.totalWithdrawn] - Total withdrawn amount
 * @param {string} [params.withdrawDuration] - Duration of withdrawal (e.g. "12 years & 1 month")
 * @param {string} [params.ctaLabel] - Optional CTA button label
 */
export function updateSWPSummary({
  container = null,
  preSwpValue,
  totalWithdrawn,
  withdrawDuration,
  ctaLabel,
}) {
  if (!container) return;

  // Helper to safely update inner text
  const updateText = (selector, value, formatter = null) => {
    const el = container.querySelector(selector);
    if (!el || value == null) return;
    el.textContent = typeof formatter === 'function' ? formatter(value) : value;
  };

  // Format numbers into INR style currency (₹)
  const formatCurrency = (val) => formatNumber({ value: val, currency: true });

  // --- Update the main values ---
  updateText('#swp-pre-value', preSwpValue, formatCurrency);
  updateText('#swp-total-withdrawn', totalWithdrawn, formatCurrency);
  updateText('#swp-duration', withdrawDuration);

  // --- Update CTA label if provided ---
  if (ctaLabel) {
    const ctaBtn = container.querySelector('.calc-overview-cta');
    if (ctaBtn) ctaBtn.textContent = ctaLabel;
  }
}
/**
 * Calculate SWP summary (Two-Phase: Growth before SWP + Withdrawals during SWP)
 * Runs SWP until the corpus is exhausted (no fixed swpYears needed)
 *
 * @param {Object} params
 * @param {number} params.initialInvestment - Initial lump sum investment
 * @param {number} params.swpStartAfterYears - Number of years before withdrawals start
 * @param {number} params.preSwpAnnualReturnRate - Annual return rate before SWP begins (%)
 * @param {number} params.swpAmountPerMonth - Monthly withdrawal amount at SWP start
 * @param {number} params.swpIncreaseRatePerYear - Annual % increase in SWP withdrawal
 * @param {number} params.swpAnnualReturnRate - Expected annual return rate during SWP phase (%)
 * @param {number} [params.roundDecimal] - Number of decimals to round to; 0 = integer
 * @param {Function} [params.callbackFunc] - Optional callback to receive calculated results
 * @returns {Object} SWP summary data
 */
/**
 * SWP Simulation: Grow corpus before SWP, then withdraw monthly until depleted.
 *
 * @param {Object} params
 * @returns {Object} summary data
 */
export function calculateSWPSummary(params) {
  // ----- Extract numbers -----
  const num = (v, d = 0) => (v != null ? parseFloat(v) : d);

  const initialInvestment = num(params.initialInvestment);
  const swpStartAfterYears = num(params.swpStartAfterYears);
  const preSwpAnnualReturnRate = num(params.preSwpAnnualReturnRate);
  const swpAmountPerMonth = num(params.swpAmountPerMonth);
  const swpIncreaseRatePerYear = num(params.swpIncreaseRatePerYear);
  const swpAnnualReturnRate = num(params.swpAnnualReturnRate);
  const swpYears = num(params.swpYears); // optional cap
  const roundDecimal = num(params.roundDecimal, 0);
  const { callbackFunc, container } = params;

  // ----- Validation -----
  if (
    initialInvestment <= 0
    || preSwpAnnualReturnRate < 0
    || swpAnnualReturnRate < 0
    || swpAmountPerMonth <= 0
  ) {
    const empty = {
      initialInvestment: 0,
      preSwpValue: 0,
      totalWithdrawn: 0,
      remainingValue: 0,
      estimatedReturns: 0,
      compoundingAt: '1.0x',
      withdrawnPercentage: 0,
      remainingPercentage: 0,
      actualYears: 0,
      actualMonths: 0,
    };
    callbackFunc?.({ ...empty, container });
    return empty;
  }

  // ---------------------------------------------------------
  // PHASE 1: Growth before SWP
  // ---------------------------------------------------------
  const preSwpMonths = swpStartAfterYears * 12;
  const preSwpMonthlyRate = preSwpAnnualReturnRate / 12 / 100;

  const preSwpValue = initialInvestment * (1 + preSwpMonthlyRate) ** preSwpMonths;

  // ---------------------------------------------------------
  // PHASE 2: SWP Simulation
  // ---------------------------------------------------------
  const swpMonthlyRate = swpAnnualReturnRate / 12 / 100;
  const maxMonths = swpYears > 0 ? swpYears * 12 : 1200; // hard cap 100 years

  let remaining = preSwpValue;
  let withdrawn = 0;
  let withdrawal = swpAmountPerMonth;

  let monthsElapsed = 0;

  for (let m = 1; m <= maxMonths; m++) {
    // Apply monthly return
    remaining *= 1 + swpMonthlyRate;

    // Withdraw (stop mid-month if corpus would go negative)
    if (remaining <= withdrawal) {
      withdrawn += remaining;
      remaining = 0;
      monthsElapsed = m;
      break;
    }

    remaining -= withdrawal;
    withdrawn += withdrawal;
    monthsElapsed = m;

    // Annual withdrawal increase
    if (m % 12 === 0) {
      withdrawal *= 1 + swpIncreaseRatePerYear / 100;
    }
  }

  // ---------------------------------------------------------
  // Summary Calculations
  // ---------------------------------------------------------
  const years = Math.floor(monthsElapsed / 12);
  const months = monthsElapsed % 12;

  const totalValue = remaining + withdrawn;
  const estimatedReturns = totalValue - initialInvestment;

  const compoundingAt = `${(totalValue / initialInvestment).toFixed(1)}x`;

  const withdrawnPct = (withdrawn / totalValue) * 100;
  const remainingPct = (remaining / totalValue) * 100;

  const r = (v) => Number(v.toFixed(roundDecimal));

  const result = {
    initialInvestment: r(initialInvestment),
    preSwpValue: r(preSwpValue),
    totalWithdrawn: r(withdrawn),
    remainingValue: r(remaining),
    estimatedReturns: r(estimatedReturns),
    compoundingAt,
    withdrawnPercentage: r(withdrawnPct),
    remainingPercentage: r(remainingPct),
    actualYears: years,
    actualMonths: months,
  };

  // Optional callback
  callbackFunc?.({
    ...result,
    container,
    withdrawDuration: `${years} years & ${months} month${
      months !== 1 ? 's' : ''
    }`,
  });

  return result;
}

/**
 * Recalculate SWP when any input changes
 * It automatically reads missing values from DOM inputs.
 *
 * @param {Object} params
 * @param {HTMLElement} params.container - The main calculator block element
 * @param {number|string} [params.iia] - Initial Investment Amount
 * @param {number|string} [params.sst] - SWP Start Time (years)
 * @param {number|string} [params.ror] - Expected Rate of Return before SWP
 * @param {number|string} [params.sapm] - SWP Amount per month
 * @param {number|string} [params.aiisa] - Annual Increase in SWP Amount (%)
 * @param {number|string} [params.rords] - Expected Rate of Return during SWP
 */
export function recalculateSWP({
  container = document,
  iia,
  sst,
  ror,
  sapm,
  aiisa,
  rords,
} = {}) {
  if (!container) return;

  // Helper to safely extract value from DOM inputs
  const getValue = (selector) => {
    const el = container.querySelector(selector);
    if (!el) return null;
    const val = el.value || el.getAttribute('value') || null;
    if (val == null) return null;
    const num = Number(String(val).replace(/[^0-9.-]/g, ''));
    return Number.isNaN(num) ? 0 : num;
  };

  // Read from DOM if not provided
  const initialInvestment = iia ?? getValue('#iia-amount');
  const swpStartAfterYears = sst ?? getValue('#sst-start');
  const preSwpAnnualReturnRate = ror ?? getValue('#ror-rate');
  const swpAmountPerMonth = sapm ?? getValue('#sapm-amount');
  const swpIncreaseRatePerYear = aiisa ?? getValue('#aiisa-increase');
  const swpAnnualReturnRate = rords ?? getValue('#rords-rate');

  // Call calculator logic
  calculateSWPSummary({
    initialInvestment,
    swpStartAfterYears,
    preSwpAnnualReturnRate,
    swpAmountPerMonth,
    swpIncreaseRatePerYear,
    swpAnnualReturnRate,
    roundDecimal: 0,
    container,
    callbackFunc: updateSWPSummary,
  });
}

/**
 * Create SWP Summary Block UI
 * @param {Object} params
 * @param {HTMLElement} params.container - The parent container holding SWP <ul> elements
 * @param {string} [params.ctaLabel='Start Your SWP Today'] - CTA button label
 * @param {string} [params.ctaHref='#'] - CTA button link
 * @returns {HTMLElement|null} - Generated summary block
 */
export function createSWPSummaryBlock({
  container = null,
  ctaLabel = 'Start Your SWP Today',
  ctaHref = '#',
}) {
  if (!container) return null;

  const parent = div({
    class: 'calc-overview-summary calc-author-main2 swp-summary',
  });
  const uls = container.querySelectorAll('ul');
  if (!uls.length) return parent;

  // ---------- Investment value before SWP ----------
  const preSwpUl = uls[0];
  if (preSwpUl) {
    const lis = preSwpUl.querySelectorAll('li');
    parent.appendChild(
      div(
        { class: 'swp-top-summary' },
        span({ class: 'small-title' }, lis[0]?.textContent.trim() || ''),
        span(
          { id: 'swp-pre-value', class: 'swp-amount' },
          formatNumber({
            value: lis[1]?.textContent.trim()?.replaceAll(',', '') || '',
            currency: true,
          }),
        ),
      ),
    );
  }

  // ---------- Withdrawal Summary header ----------
  const summaryUl = uls[1];
  if (summaryUl) {
    const lis = summaryUl.querySelectorAll('li');
    const iconEl = lis[0]?.querySelector('img');

    const headerDiv = div({ class: 'swp-withdrawal-header' });

    if (iconEl) {
      const iconWrap = span({ class: 'icon icon-analytics' });
      iconWrap.appendChild(iconEl.cloneNode(true));
      headerDiv.appendChild(iconWrap);
    }

    headerDiv.appendChild(
      div(
        { class: 'withdrawal-header-text' },
        span({ class: 'small-title' }, lis[1]?.textContent.trim() || ''),
        span({ class: 'desc' }, lis[2]?.textContent.trim() || ''),
      ),
    );

    parent.appendChild(headerDiv);
  }

  // ---------- Withdrawal details (Amount + Duration) ----------
  const detailsWrapper = div({ class: 'swp-withdrawal-details' });

  const totalWithdrawnUl = uls[2];
  const withdrawnForUl = uls[3];

  if (totalWithdrawnUl) {
    const lis = totalWithdrawnUl.querySelectorAll('li');
    detailsWrapper.appendChild(
      div(
        { class: 'withdrawal-item' },
        span({ class: 'small-title' }, lis[0]?.textContent.trim() || ''),
        span(
          { id: 'swp-total-withdrawn', class: 'swp-amount' },
          formatNumber({
            value: lis[1]?.textContent.trim()?.replaceAll(',', '') || '',
            currency: true,
          }),
        ),
      ),
    );
  }

  if (withdrawnForUl) {
    const lis = withdrawnForUl.querySelectorAll('li');
    detailsWrapper.appendChild(
      div(
        { class: 'withdrawal-item' },
        span({ class: 'small-title' }, lis[0]?.textContent.trim() || ''),
        span(
          { id: 'swp-duration', class: 'swp-duration-text' },
          lis[1]?.textContent.trim() || '',
        ),
      ),
    );
  }

  parent.appendChild(detailsWrapper);

  // ---------- CTA ----------
  const ctaUl = uls[4];
  let ctaText = ctaLabel;
  if (ctaUl) {
    const link = ctaUl.querySelector('a');
    if (link) {
      ctaText = link.textContent.trim() || ctaLabel;
    }
  }

  const ctaBtn = button(
    {
      class: 'calc-overview-cta',
      onclick: () => {
        window.location.href = ctaHref;
      },
    },
    ctaText,
  );

  parent.appendChild(ctaBtn);

  return parent;
}

export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector('.calc-author-main1');
  if (!CALC_AUTHOR_MAIN) {
    console.warn('No .calc-author-main1 element found.');
    return;
  }

  // Define group names in the order they appear (every 4 values = 1 group)
  const PARAM_GROUPS = ['IIA', 'SST', 'ROR', 'SAPM', 'AIISA', 'RORDS'];

  // Collect all <p> .comlist elements inside both .sub1 and .sub2
  const elements = [
    ...CALC_AUTHOR_MAIN.querySelectorAll(
      '.calc-author-sub1 .comlist, .calc-author-sub2 .comlist',
    ),
  ].map((el) => el.textContent.trim());

  // Group every 4 items into one structured object
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

  const CALC_OVERVIEW_DATA = CALC_AUTHOR_MAIN.querySelector('.calc-author-sub3');
  block.appendChild(createSWPSummaryBlock({ container: CALC_OVERVIEW_DATA }));
  CALC_AUTHOR_MAIN.innerHTML = '';

  // Assuming you already have these from your flat data extraction:
  const iia = CALC_FLAT_DATA.find((d) => d.name === 'IIA');
  const sst = CALC_FLAT_DATA.find((d) => d.name === 'SST');
  const ror = CALC_FLAT_DATA.find((d) => d.name === 'ROR');
  const sapm = CALC_FLAT_DATA.find((d) => d.name === 'SAPM');
  const aiisa = CALC_FLAT_DATA.find((d) => d.name === 'AIISA');
  const rords = CALC_FLAT_DATA.find((d) => d.name === 'RORDS');

  // 🟢 Initial Investment Amount
  const iiaBlock = createInputBlock({
    id: 'iia-amount',
    ...iia,
    prefix: '₹',
    fieldType: 'currency',
    prefixAttr: { class: 'currency-prefix' },
    inputBlockAttr: {
      class: 'iia-inp-container',
    },
    variant: 'number',
    onInput: (e) => {
      recalculateSWP({ iia: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSWP({ iia: v, container: block });
    },
  });

  // 🟢 SWP Start Time
  const sstBlock = createInputBlock({
    id: 'sst-start',
    ...sst,
    inputBlockAttr: {
      class: 'sst-inp-container',
    },
    fieldType: 'year',
    suffix: sst?.default > 1 ? 'years' : 'year',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => {
      recalculateSWP({ sst: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSWP({ sst: v, container: block });
    },
  });

  // 🟢 Rate of Return
  const rorBlock = createInputBlock({
    id: 'ror-rate',
    ...ror,
    suffix: '%',
    suffixAttr: { class: 'input-suffix' },
    fieldType: 'percent',
    variant: 'stepper',
    updateWidthonChange: true,
    prefixAttr: { class: 'percent-prefix' },
    inputBlockAttr: {
      class: 'ror-inp-container',
    },
    onInput: (e) => {
      recalculateSWP({ ror: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSWP({ ror: v, container: block });
    },
  });

  // 🟢 SWP Amount Per Month
  const sapmBlock = createInputBlock({
    id: 'sapm-amount',
    ...sapm,
    prefix: '₹',
    fieldType: 'currency',
    prefixAttr: { class: 'currency-prefix' },
    inputBlockAttr: {
      class: 'sapm-inp-container',
    },
    variant: 'number',
    onInput: (e) => {
      recalculateSWP({ sapm: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSWP({ sapm: v, container: block });
    },
  });

  // 🟢 Annual Increase in SWP Amount
  const aiisaBlock = createInputBlock({
    id: 'aiisa-increase',
    ...aiisa,
    suffix: '%',
    suffixAttr: { class: 'input-suffix' },
    fieldType: 'percent',
    variant: 'stepper',
    updateWidthonChange: true,
    inputBlockAttr: {
      class: 'aiisa-inp-container',
    },
    onInput: (e) => {
      recalculateSWP({ aiisa: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSWP({ aiisa: v, container: block });
    },
  });

  // 🟢 Expected Rate of Return During SWP
  const rordsBlock = createInputBlock({
    id: 'rords-rate',
    ...rords,
    suffix: '%',
    suffixAttr: { class: 'input-suffix' },
    fieldType: 'percent',
    variant: 'stepper',
    updateWidthonChange: true,
    inputBlockAttr: {
      class: 'rords-inp-container',
    },
    onInput: (e) => {
      recalculateSWP({ rords: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSWP({ rords: v, container: block });
    },
  });
  CALC_AUTHOR_MAIN.append(
    iiaBlock,
    sstBlock,
    rorBlock,
    sapmBlock,
    aiisaBlock,
    rordsBlock,
  );
  calculateSWPSummary({
    initialInvestment: iia?.default,
    preSwpAnnualReturnRate: ror?.default,
    swpAmountPerMonth: sapm?.default,
    swpAnnualReturnRate: rords?.default,
    swpIncreaseRatePerYear: aiisa?.default,
    swpStartAfterYears: sst?.default,
    callbackFunc: (data) => {
      updateSWPSummary({
        container: block.querySelector('.calc-overview-summary.swp-summary'),
        preSwpValue: data.preSwpValue,
        totalWithdrawn: data.totalWithdrawn,
        withdrawDuration: '12 years & 1 month', // or dynamically computed if needed
      });
    },
  });
}
