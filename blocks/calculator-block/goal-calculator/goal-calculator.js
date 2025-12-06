import { div, form } from "../../../scripts/dom-helpers.js";
import {
  createBarSummaryBlock,
  createInputBlock,
  createOptionSelectorBlock,
  createRadioSelectorBlock,
  extractOptionsSelect,
  getQueryParam,
  formatNumber,
} from "../common-ui-field/common-ui-field.js";

export function updateCalculateSummary({ container, data }) {
  if (!container || !data) return;

  const totalReturnsEl = container.querySelector("#sip-total-returns");
  const totalInvestedEl = container.querySelector("#total-invested-amount");
  const estimatedReturnsEl = container.querySelector(
    "#total-estimated-returns"
  );
  const compoundRateEl = container.querySelector("#compound-rate");

  if (totalReturnsEl) {
    totalReturnsEl.textContent = formatNumber({
      value: data.monthlySaving,
      currency: true,
    });
  }

  if (totalInvestedEl) {
    totalInvestedEl.textContent = formatNumber({
      value: data.totalInvested,
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
    compoundRateEl.textContent = data.compoundMultiplier;
  }
}

/**
 * Utility to safely parse numbers
 */
function toNumber(value, defaultValue = 0) {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Round to given decimals
 */
function round(value, decimals = 0) {
  return Number(value.toFixed(decimals));
}

/**
 * SIP Future Value
 */
function calculateSIP({ monthlyAmount, annualRate, years }) {
  const P = toNumber(monthlyAmount);
  const r = toNumber(annualRate) / 100 / 12; // monthly rate
  const n = toNumber(years) * 12; // months

  if (r === 0) return P * n;
  return P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

/**
 * General Goal Summary for SIP-based goals
 */
export function calculateGoalSummary({
  monthlyAmount,
  rateOfReturn,
  timePeriod,
  roundDecimal = 0,
}) {
  const invested = toNumber(monthlyAmount) * toNumber(timePeriod) * 12;
  const total = calculateSIP({
    monthlyAmount,
    annualRate: rateOfReturn,
    years: timePeriod,
  });
  const returns = total - invested;
  const multiplier = invested ? total / invested : 1;

  return {
    totalInvested: round(invested, roundDecimal),
    totalReturns: round(total, roundDecimal),
    estimatedReturns: round(returns, roundDecimal),
    compoundMultiplier: `${round(multiplier, 1)}x`,
    totalInvestedPercentage: round((invested / total) * 100, roundDecimal),
    estimatedReturnsPercentage: round((returns / total) * 100, roundDecimal),
  };
}

/**
 * Fixed-goal Summary (Plan A Trip, Buy House, Buy Vehicle)
 */
export function calculateFixedGoal({
  targetAmount,
  currentAmount = 0,
  years = 1,
  roundDecimal = 0,
}) {
  const remaining = Math.max(
    0,
    toNumber(targetAmount) - toNumber(currentAmount)
  );
  const invested = toNumber(currentAmount) + remaining;
  const multiplier = currentAmount ? targetAmount / currentAmount : 1;

  // Calculate monthly saving
  const totalMonths = years * 12;
  const monthlySaving = totalMonths > 0 ? remaining / totalMonths : remaining;

  return {
    totalInvested: round(invested, roundDecimal),
    totalReturns: round(targetAmount, roundDecimal),
    estimatedReturns: round(remaining, roundDecimal),
    monthlySaving: round(monthlySaving, roundDecimal),
    compoundMultiplier: `${round(multiplier, 1)}x`,
    totalInvestedPercentage: round(
      (currentAmount / targetAmount) * 100,
      roundDecimal
    ),
    estimatedReturnsPercentage: round(
      (remaining / targetAmount) * 100,
      roundDecimal
    ),
  };
}

/**
 * Recalculate goal summary based on goal type
 */
export function recalculateGoal({ prefix, container, roundDecimal = 0 }) {
  if (!container || !prefix) return;

  let summary;

  if (["pat", "bah", "bav"].includes(prefix)) {
    const targetAmount = toNumber(
      container.querySelector(`#${prefix}-target-amount`)?.value
    );
    const targetYear = toNumber(
      container.querySelector(`#${prefix}-target-year`)?.value
    );
    const currentYear = new Date().getFullYear(); // current year
    const years = Math.max(1, targetYear - currentYear); // convert absolute year → duration

    let currentAmount = 0;

    if (prefix === "bav") {
      const savingsOption =
        container.querySelector("#bav-savings-radio")?.value;
      if (savingsOption === "yes") {
        currentAmount = toNumber(
          container.querySelector("#bav-down-payment")?.value
        );
      }
    } else if (prefix === "pat") {
      const savingsOption =
        container.querySelector("#pat-savings-radio")?.value;
      if (savingsOption === "have-some-money-aside-for-this-goal") {
        currentAmount = toNumber(
          container.querySelector("#pat-amount-i-have")?.value
        );
      }
    } else {
      currentAmount = toNumber(
        container.querySelector(
          `#${prefix}-amount-i-have, #${prefix}-down-payment`
        )?.value
      );
    }

    summary = calculateFixedGoal({
      targetAmount,
      currentAmount,
      years,
      roundDecimal,
    });
  } else {
    const monthlyAmount = toNumber(
      container.querySelector(`#${prefix}-savings-amount`)?.value
    );
    const rateOfReturn = toNumber(
      container.querySelector(`#${prefix}-rate-of-return`)?.value
    );
    const timePeriod = toNumber(
      container.querySelector(`#${prefix}-target-duration`)?.value
    );

    summary = calculateGoalSummary({
      monthlyAmount,
      rateOfReturn,
      timePeriod,
      roundDecimal,
    });
  }

  // Safe bar percentage: clamp between 0 and 100
  const bar = container.querySelector(
    ".calc-compounding .estimated-returns-bar"
  );
  if (bar) {
    const safePercentage = Math.min(
      Math.max(summary.estimatedReturnsPercentage, 0),
      100
    );
    bar.style.width = `${safePercentage}%`;
  }

  updateCalculateSummary({ container, data: summary });
}

function generateRetirementPlanning(block, CALC_AUTHOR_MAIN) {
  const container = CALC_AUTHOR_MAIN.querySelector(".calc-author-sub1");
  const inputsDetails = container.querySelectorAll(
    "p:nth-child(n+2):nth-child(-n+17)"
  );
  // Convert NodeList → array of textContent
  const values = Array.from(inputsDetails).map((n) => n.textContent.trim());

  // helper to convert 4-item array → object
  const toObj = ([label, def, min, max]) => ({
    label,
    default: def,
    min,
    max,
  });

  // build final grouped object
  const result = {
    CIWTA: toObj(values.slice(0, 4)),
    IWTRA: toObj(values.slice(4, 8)),
    SIH: toObj(values.slice(8, 12)),
    EROR: toObj(values.slice(12, 16)),
  };

  const ciwtaBlock = createInputBlock({
    id: "rp-target-amount",
    ...result.CIWTA,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "ciwta-inp-container",
    },
    variant: "number",
  });
  const iwtraBlock = createInputBlock({
    id: "rp-target-duration",
    ...result.IWTRA,
    fieldType: "year",
    ignoreMin: true,
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "iwtra-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "rp", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "rp", container: block });
    },
  });
  const sihBlock = createInputBlock({
    id: "rp-savings-amount",
    ...result.SIH,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "sih-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "rp", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "rp", container: block });
    },
  });
  const erorBlock = createInputBlock({
    id: "rp-rate-of-return",
    ...result.EROR,
    fieldType: "year",
    ignoreMin: true,
    suffixAttr: { class: "input-suffix" },
    variant: "number",
    inputBlockAttr: {
      class: "iwtra-inp-container",
    },
    onInput: (e) => {
      recalculateGoal({ prefix: "rp", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "rp", container: block });
    },
  });
  const RP_INPUTS_CONTAINER = div(
    { class: "rp-inputs-container goal-inputs-container" },
    ciwtaBlock,
    iwtraBlock,
    sihBlock,
    erorBlock
  );
  return RP_INPUTS_CONTAINER;
}
function generateBuyAHouse(block, CALC_AUTHOR_MAIN) {
  const container = CALC_AUTHOR_MAIN.querySelector(".calc-author-sub1");
  const inputsDetails = container.querySelectorAll(
    "p:nth-child(n+18):nth-child(-n+29)"
  );
  // Convert NodeList → array of textContent
  const values = Array.from(inputsDetails).map((n) => n.textContent.trim());

  // helper to convert 4-item array → object
  const toObj = ([label, def, min, max]) => ({
    label,
    default: def,
    min,
    max,
  });
  // build final grouped object
  const result = {
    IPTBAHB: toObj(values.slice(0, 4)),
    BILA: toObj(values.slice(4, 8)),
    BFADU: toObj(values.slice(8, 12)),
  };
  console.log(result);
  const iptbahbBlock = createInputBlock({
    id: "bah-target-year",
    ...result.IPTBAHB,
    fieldType: "year",
    ignoreMin: true,
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "iptbahb-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "bah", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "bah", container: block });
    },
  });
  const bilaBlock = createInputBlock({
    id: "bah-target-amount",
    ...result.BILA,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "bila-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "bah", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "bah", container: block });
    },
  });
  const bfaduBlock = createInputBlock({
    id: "bah-down-payment",
    ...result.BFADU,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "bfadu-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "bah", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "bah", container: block });
    },
  });
  const BAH_INPUTS_CONTAINER = div(
    { class: "bah-inputs-container goal-inputs-container" },
    iptbahbBlock,
    bilaBlock,
    bfaduBlock
  );
  return BAH_INPUTS_CONTAINER;
}
function generatePlanATrip(block, CALC_AUTHOR_MAIN) {
  const container = CALC_AUTHOR_MAIN.querySelector(".calc-author-sub2");
  const inputsDetails = container.querySelectorAll(
    "p:nth-child(n+1):nth-child(-n+8)"
  );

  const radioDetails = {
    title: block
      .querySelector(".calc-author-sub2 .calc-author-subitem9")
      .textContent.trim(),
    options: extractOptionsSelect({
      listContainer: block.querySelector(
        ".calc-author-sub2 .calc-author-subitem10"
      )?.children,
    }),
  };

  // Convert NodeList → array of textContent
  const values = Array.from(inputsDetails).map((n) => n.textContent.trim());

  // helper to convert 4-item array → object
  const toObj = ([label, def, min, max]) => ({
    label,
    default: def,
    min,
    max,
  });

  const radioSelector = createRadioSelectorBlock({
    ...radioDetails,
    id: "pat-savings-radio",
    onChange: () => {
      recalculateGoal({ prefix: "pat", container: block });
    },
  });

  const amountIhave = {
    label: block
      .querySelector(".calc-author-sub2 .calc-author-subitem11")
      .textContent.trim(),
    default: block
      .querySelector(".calc-author-sub2 .calc-author-subitem12")
      .textContent.trim(),
  };

  // build final grouped object
  const result = {
    ITPGB: toObj(values.slice(0, 4)),
    BFTT: toObj(values.slice(4, 8)),
  };
  console.log(values);
  const itpgbBlock = createInputBlock({
    id: "pat-target-year",
    ...result.ITPGB,
    fieldType: "year",
    ignoreMin: true,
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "itpgb-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "pat", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "pat", container: block });
    },
  });
  const bfttBlock = createInputBlock({
    id: "pat-target-amount",
    ...result.BFTT,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "bftt-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "pat", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "pat", container: block });
    },
  });
  const amountIhaveBlock = createInputBlock({
    id: "pat-amount-i-have",
    ...amountIhave,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "amount-i-have-inp-container",
    },
    noLimit: true,
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "pat", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "pat", container: block });
    },
  });
  const PAT_INPUTS_CONTAINER = div(
    { class: "pat-inputs-container goal-inputs-container" },
    itpgbBlock,
    bfttBlock,
    radioSelector,
    amountIhaveBlock
  );
  return PAT_INPUTS_CONTAINER;
}
function generateBuyAVehicle(block, CALC_AUTHOR_MAIN) {
  const container = CALC_AUTHOR_MAIN.querySelector(".calc-author-sub2");
  const inputsDetails = [
    ...container.querySelectorAll("p:nth-child(n+13):nth-child(-n+20)"),
    ...container.querySelectorAll("p:nth-child(n+23):nth-child(-n+26)"),
  ];

  const radioDetails = {
    title: block
      .querySelector(".calc-author-sub2 .calc-author-subitem21")
      .textContent.trim(),
    options: extractOptionsSelect({
      listContainer: block.querySelector(
        ".calc-author-sub2 .calc-author-subitem22"
      )?.children,
    }),
  };

  // Convert NodeList → array of textContent
  const values = Array.from(inputsDetails).map((n) => n.textContent.trim());

  // helper to convert 4-item array → object
  const toObj = ([label, def, min, max]) => ({
    label,
    default: def,
    min,
    max,
  });
  console.log("inputdetails : ", toObj(values.slice(8, 12)));
  console.log("values : ", values);
  // console.log(
  //   "inputdetails : ",
  //   container.querySelectorAll("p:nth-child(n+23):nth-child(-n+27)")
  // );

  const radioSelector = createRadioSelectorBlock({
    ...radioDetails,
    id: "bav-savings-radio",
    onChange: () => {
      recalculateGoal({ prefix: "bav", container: block });
    },
  });

  // build final grouped object
  const result = {
    IWTBTCB: toObj(values.slice(0, 4)),
    BFTC: toObj(values.slice(4, 8)),
    AFTD: toObj(values.slice(8, 12)),
  };
  console.log(values);
  const iwtbtcbBlock = createInputBlock({
    id: "bav-target-year",
    ...result.IWTBTCB,
    fieldType: "year",
    ignoreMin: true,
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "iwtbtcb-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "bav", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "bav", container: block });
    },
  });
  const bfttBlock = createInputBlock({
    id: "bav-target-amount",
    ...result.BFTC,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "bftc-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "bav", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "bav", container: block });
    },
  });
  const aftdBlock = createInputBlock({
    id: "bav-down-payment",
    ...result.AFTD,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "aftd-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "bav", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "bav", container: block });
    },
  });
  const BAV_INPUTS_CONTAINER = div(
    { class: "bav-inputs-container goal-inputs-container" },
    iwtbtcbBlock,
    bfttBlock,
    radioSelector,
    aftdBlock
  );
  return BAV_INPUTS_CONTAINER;
}
function generateCreateYourOwn(block, CALC_AUTHOR_MAIN) {
  const container = CALC_AUTHOR_MAIN.querySelector(".calc-author-sub3");
  const inputsDetails = container.querySelectorAll(
    "p:nth-child(n+3):nth-child(-n+18)"
  );
  const goalName = {
    label: CALC_AUTHOR_MAIN.querySelector(
      ".calc-author-sub3 .calc-author-subitem1"
    ).textContent.trim(),
    default: CALC_AUTHOR_MAIN.querySelector(
      ".calc-author-sub3 .calc-author-subitem2"
    ).textContent.trim(),
  };

  // Convert NodeList → array of textContent
  const values = Array.from(inputsDetails).map((n) => n.textContent.trim());

  // helper to convert 4-item array → object
  const toObj = ([label, def, min, max]) => ({
    label,
    default: def,
    min,
    max,
  });

  // build final grouped object
  const result = {
    CIWTA: toObj(values.slice(0, 4)),
    IWTATI: toObj(values.slice(4, 8)),
    SIH: toObj(values.slice(8, 12)),
    EROR: toObj(values.slice(12, 16)),
  };

  const goalNameBlock = createInputBlock({
    id: "gc-goal-name",
    ...goalName,
    noLimit: true,
    inputBlockAttr: {
      class: "goal-name-inp-container",
    },
    variant: "text",
  });

  const ciwtaBlock = createInputBlock({
    id: "gc-target-amount",
    ...result.CIWTA,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "ciwta-inp-container",
    },
    variant: "number",
  });

  const iwtatiBlock = createInputBlock({
    id: "gc-target-duration",
    ...result.IWTATI,
    fieldType: "year",
    ignoreMin: true,
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "iwtati-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "gc", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "gc", container: block });
    },
  });

  const sihBlock = createInputBlock({
    id: "gc-savings-amount",
    ...result.SIH,
    prefix: "₹",
    fieldType: "currency",
    ignoreMin: true,
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "sih-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateGoal({ prefix: "gc", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "gc", container: block });
    },
  });

  const erorBlock = createInputBlock({
    id: "gc-rate-of-return",
    ...result.EROR,
    fieldType: "year",
    ignoreMin: true,
    suffixAttr: { class: "input-suffix" },
    variant: "number",
    inputBlockAttr: {
      class: "iwtra-inp-container",
    },
    onInput: (e) => {
      recalculateGoal({ prefix: "gc", container: block });
    },
    onChange: (v) => {
      recalculateGoal({ prefix: "gc", container: block });
    },
  });

  const RP_INPUTS_CONTAINER = div(
    { class: "gc-inputs-container goal-inputs-container" },
    goalNameBlock,
    ciwtaBlock,
    iwtatiBlock,
    sihBlock,
    erorBlock
  );
  console.log(result);
  return RP_INPUTS_CONTAINER;
}

function handleGoalTypeChange(value, goalIndex = 0, container) {
  container
    .querySelectorAll(".goal-inputs-container")
    .forEach((container, index) => {
      if (index === goalIndex) {
        container.classList.remove("dsp-none");
      } else {
        container.classList.add("dsp-none");
      }
    });

  // Get the prefix based on the selected goal type
  const goalPrefixes = ["rp", "bah", "pat", "bav", "gc"];
  const selectedPrefix = goalPrefixes[goalIndex];

  // Recalculate the summary for the newly selected goal type
  if (selectedPrefix) {
    recalculateGoal({ prefix: selectedPrefix, container });
  }
}

export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector(".calc-author-main1");
  if (!CALC_AUTHOR_MAIN) {
    console.warn("No .calc-author-main1 element found.");
    return;
  }
  const formContainer = form({ class: "goal-calculator-form" });
  CALC_AUTHOR_MAIN.parentNode.insertBefore(formContainer, CALC_AUTHOR_MAIN);
  formContainer.appendChild(CALC_AUTHOR_MAIN);

  const goalSelectorTitle = block.querySelector(
    ".calc-author-sub1 .calc-author-subitem1"
  );
  const goalOptions = extractOptionsSelect({
    listContainer: block.querySelector(
      ".calc-author-sub1 .calc-author-subitem2"
    ).children,
  });

  const OVERVIEW_DATA = CALC_AUTHOR_MAIN.querySelector(
    ":scope > .calc-author-sub4"
  );

  const calculatorOverview = createBarSummaryBlock({
    container: OVERVIEW_DATA,
  });
  // Value taken from URL query param
  const urlSelectedType = getQueryParam("type");

  // Default option defined inside radioDetails
  const configDefaultType =
    goalOptions.find((opt) => opt?.value === urlSelectedType)?.value ||
    goalOptions?.[0]?.value;

  // Create the radio selector block
  const selector = createOptionSelectorBlock({
    id: "select-goal-type",
    label: goalSelectorTitle,
    options: goalOptions,
    default: configDefaultType,
    onChange: (value, goalIndex) => {
      handleGoalTypeChange(value, goalIndex, block);
    },
  });

  const RP_CONTAINER = generateRetirementPlanning(block, CALC_AUTHOR_MAIN);
  const BAH_CONTAINER = generateBuyAHouse(block, CALC_AUTHOR_MAIN);
  const PAT_CONTAINER = generatePlanATrip(block, CALC_AUTHOR_MAIN);
  const BAV_CONTAINER = generateBuyAVehicle(block, CALC_AUTHOR_MAIN);
  const CYO_CONTAINER = generateCreateYourOwn(block, CALC_AUTHOR_MAIN);
  CALC_AUTHOR_MAIN.innerHTML = "";
  formContainer.parentNode.insertBefore(selector, formContainer);

  CALC_AUTHOR_MAIN.append(
    RP_CONTAINER,
    BAH_CONTAINER,
    PAT_CONTAINER,
    BAV_CONTAINER,
    CYO_CONTAINER
  );
  block.append(calculatorOverview);
  // show first goal inputs by default

  handleGoalTypeChange(
    configDefaultType,
    goalOptions.findIndex((opt) => opt.value === configDefaultType) || 0,
    block
  );
}
