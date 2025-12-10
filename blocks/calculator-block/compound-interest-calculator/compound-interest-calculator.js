import {
  createBarSummaryBlock,
  createInputBlock,
  createOptionSelectorBlock,
  extractOptionsSelect,
  formatNumber,
  getAuthorData,
} from '../common-ui-field/common-ui-field.js';

const freqMap = {
  yearly: 1,
  halfyearly: 2,
  quarterly: 4,
  monthly: 12,
};

function updateCalculateCompoundSummary({ container, data }) {
  if (!container || !data) return;

  const principalEl = container.querySelector('#total-invested-amount');
  const totalValueEl = container.querySelector('#sip-total-returns');
  const interestEarnedEl = container.querySelector('#total-estimated-returns');
  const multiplierEl = container.querySelector('#compound-multiplier');
  container.querySelector(
    '.calc-compounding .estimated-returns-bar',
  ).style.width = `${data?.returnsPercentage}%`;

  if (principalEl) {
    principalEl.textContent = formatNumber({
      value: data.principal,
      currency: true,
    });
  }
  if (totalValueEl) {
    totalValueEl.textContent = formatNumber({
      value: data.totalValue,
      currency: true,
    });
  }
  if (interestEarnedEl) {
    interestEarnedEl.textContent = formatNumber({
      value: data.interestEarned,
      currency: true,
    });
  }
  if (multiplierEl) {
    multiplierEl.textContent = data.multiplier;
  }
}

export function calculateCompoundSummary({
  principal,
  annualRateRate,
  years,
  compoundingFrequency,
  roundDecimal,
  callbackFunc,
}) {
  const inputErrors = document.querySelectorAll('.calc-input.calc-error');
  if (inputErrors?.length) {
    return {
      principal: 0,
      totalValue: 0,
      interestEarned: 0,
      multiplier: '0x',
      investedPercentage: 0,
      returnsPercentage: 0,
    };
  }

  const P = principal;
  const r = annualRateRate / 100;
  const n = compoundingFrequency;
  const t = years;

  const amount = P * (1 + r / n) ** (n * t);
  const interestEarned = amount - P;

  const multiplier = amount / (P || 1);

  const totalValue = amount;
  const invested = P;

  const investedPercentage = (invested / totalValue) * 100;
  const returnsPercentage = (interestEarned / totalValue) * 100;

  const roundValue = (val) => {
    if (roundDecimal == null) return val;
    return Number(val.toFixed(roundDecimal));
  };

  const data = {
    principal: roundValue(P),
    totalValue: roundValue(totalValue),
    interestEarned: roundValue(interestEarned),
    multiplier: `${roundValue(multiplier)}x`,
    investedPercentage: roundValue(investedPercentage),
    returnsPercentage: roundValue(returnsPercentage),
  };

  if (callbackFunc) callbackFunc(data);

  return data;
}

function recalculateCompoundInterest({
  principal,
  rate,
  years,
  frequencyValue,
  roundDecimal = 0,
  container,
}) {
  if (!container) return;

  // Get DOM inputs if arguments aren’t provided:
  const principalInput = container.querySelector('#principal-amount');
  const rateInput = container.querySelector('#rate-of-interest');
  const yearsInput = container.querySelector('#time-period');
  const freqInput = container.querySelector('#compoundFrequency');
  const P = principal != null ? Number(principal) : Number(principalInput?.value || 0);
  const r = rate != null ? Number(rate) : Number(rateInput?.value || 0);
  const t = years != null ? Number(years) : Number(yearsInput?.value || 0);
  const freqSel = frequencyValue != null ? frequencyValue : freqInput?.value;
  const n = freqMap[freqSel] || 1;
  // Reuse calculateCompoundSummary
  const summary = calculateCompoundSummary({
    principal: P,
    annualRateRate: r,
    years: t,
    compoundingFrequency: n,
    roundDecimal,
  });

  // Update UI bar if you have one
  const bar = container.querySelector(
    '.calc‑compounding .estimated‑interest‑bar',
  );
  if (bar && summary.totalValue > 0) {
    const perc = (summary.interestEarned / summary.totalValue) * 100;
    bar.style.width = `${perc}%`;
  }

  // Update summary UI
  updateCalculateCompoundSummary({
    container,
    data: summary,
  });

  //   return summary;
}

export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector('.calc-author-main1');
  if (!CALC_AUTHOR_MAIN) {
    console.warn('No .calc-author-main1 element found.');
    return;
  }

  const authors = [
    { key: 'PI', selector: ':scope > .calc-author-sub1' },
    { key: 'TP', selector: ':scope > .calc-author-sub2' },
    { key: 'ROI', selector: ':scope > .calc-author-sub3' },
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
  // Select subitem1 and subitem2 together
  const firstGroup = OVERVIEW_DATA.querySelectorAll(
    '.calc-author-subitem1, .calc-author-subitem2',
  );

  // Select all other subitems (subitem3–subitem6)
  const OVERVIEW_AUTHOR_DATA = OVERVIEW_DATA.querySelectorAll(
    '.calc-author-subitem3, .calc-author-subitem4, .calc-author-subitem5, .calc-author-subitem6',
  );
  // Create a new container div
  const container = document.createElement('div');
  container.classList.add('calc-second-group'); // optional class name
  OVERVIEW_AUTHOR_DATA.forEach((el) => container.appendChild(el));

  const sipBlock = createBarSummaryBlock({
    container,
  });
  CALC_AUTHOR_MAIN.innerHTML = '';

  const pi = getAuthorData(CALC_AUTHORED_DATA, 'PI');
  const tp = getAuthorData(CALC_AUTHORED_DATA, 'TP');
  const roi = getAuthorData(CALC_AUTHORED_DATA, 'ROI');

  const compoundFreqTitle = firstGroup[0]?.textContent;

  const compoundFreqOptions = extractOptionsSelect({
    listContainer: firstGroup[1]?.children,
  });

  const piBlock = createInputBlock({
    id: 'principal-amount',
    ...pi,
    prefix: '₹',
    fieldType: 'currency',
    ignoreMin: true,
    prefixAttr: { class: 'currency-prefix' },
    inputBlockAttr: {
      class: 'pi-inp-container',
    },
    variant: 'number',
    onInput: (e) => {
      recalculateCompoundInterest({
        principal: e.target.value,
        container: block,
      });
    },
    onChange: (v) => {
      recalculateCompoundInterest({ principal: v, container: block });
    },
  });

  const tpBlock = createInputBlock({
    id: 'time-period',
    ...tp,
    suffix: tp?.default > 1 ? 'Years' : 'Year',
    fieldType: 'year',
    ignoreMin: true,
    suffixAttr: { class: 'input-suffix' },
    inputBlockAttr: {
      class: 'tp-inp-container',
    },
    updateWidthonChange: true,
    variant: 'stepper',
    onInput: (e) => {
      recalculateCompoundInterest({ years: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateCompoundInterest({ years: v, container: block });
    },
  });
  const roiBlock = createInputBlock({
    id: 'rate-of-interest',
    ...roi,
    suffix: '%',
    fieldType: 'percent',
    updateWidthonChange: true,
    ignoreMin: true,
    suffixAttr: { class: 'input-suffix' },
    inputBlockAttr: {
      class: 'roi-inp-container',
    },
    variant: 'stepper',
    onInput: (e) => {
      recalculateCompoundInterest({ rate: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateCompoundInterest({ rate: v, container: block });
    },
  });

  const selector = createOptionSelectorBlock({
    id: 'compoundFrequency',
    label: compoundFreqTitle,
    options: compoundFreqOptions,
    default: 'yearly',
    onChange: (val) => {
      recalculateCompoundInterest({ frequency: val, container: block });
    },
  });

  CALC_AUTHOR_MAIN.append(piBlock, tpBlock, roiBlock, selector);
  block.appendChild(sipBlock);

  recalculateCompoundInterest({ container: block });
}
