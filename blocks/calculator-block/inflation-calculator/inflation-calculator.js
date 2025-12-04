import {
  createInputBlock,
  createBarSummaryBlock,
  getAuthorData,
  formatNumber,
} from "../common-ui-field/common-ui-field.js";

export function updateCalculateSummary({ container, data }) {
  if (!container || !data) return;

  const futureCostEl = container.querySelector("#sip-total-returns");
  const currentCostEl = container.querySelector("#total-invested-amount");
  const inflationIncreaseEl = container.querySelector(
    "#total-estimated-returns"
  );
  const compoundRateEl = container.querySelector("#compound-rate");

  if (futureCostEl) {
    futureCostEl.textContent = formatNumber({
      value: data.futureCost,
      currency: true,
    });
  }

  if (currentCostEl) {
    currentCostEl.textContent = formatNumber({
      value: data.currentCost,
      currency: true,
    });
  }

  if (inflationIncreaseEl) {
    inflationIncreaseEl.textContent = formatNumber({
      value: data.inflationIncrease,
      currency: true,
    });
  }

  if (compoundRateEl) {
    compoundRateEl.textContent = data.inflationMultiplier;
  }
}

/**
 * 📊 Calculate Future Cost due to Inflation
 * @param {Object} params
 * @param {number} params.currentCost - Current cost of the item
 * @param {number} params.rateOfInflation - Expected annual inflation rate (%)
 * @param {number} params.timePeriod - Time in years
 * @param {number} [params.roundDecimal] - Number of decimals to round to
 * @param {Function} [params.callbackFunc] - Optional callback for returning data
 * @returns {{
 *   currentCost: number,
 *   futureCost: number,
 *   inflationIncrease: number,
 *   inflationMultiplier: string,
 *   currentCostPercentage: number,
 *   inflationIncreasePercentage: number
 * }}
 */
export function calculateInflationSummary({
  currentCost,
  rateOfInflation,
  timePeriod,
  roundDecimal,
  callbackFunc,
}) {
  let data;

  // Guard clause for invalid inputs
  if (!currentCost || !rateOfInflation || !timePeriod) {
    data = {
      currentCost: 0,
      futureCost: 0,
      inflationIncrease: 0,
      inflationMultiplier: "1.0x",
      currentCostPercentage: 0,
      inflationIncreasePercentage: 0,
    };
    if (callbackFunc) callbackFunc(data);
    return data;
  }
  const num = (v, d = 0) => (v != null ? parseFloat(v) : d);
  currentCost = num(currentCost);
  rateOfInflation = num(rateOfInflation);
  timePeriod = num(timePeriod);
  
  const rate = rateOfInflation / 100;

  // Future Cost Formula: FV = PV * (1 + r)^t
  const futureCost = currentCost * (1 + rate) ** timePeriod;
  const inflationIncrease = futureCost - currentCost;
  const multiplier = futureCost / currentCost;
  const inflationMultiplier = `${multiplier.toFixed(1)}x`;

  const currentCostPercentage = (currentCost / futureCost) * 100;
  const inflationIncreasePercentage = (inflationIncrease / futureCost) * 100;

  const roundValue = (val) =>
    roundDecimal === null || roundDecimal === undefined
      ? val
      : Number(val.toFixed(roundDecimal));

  data = {
    currentCost: roundValue(currentCost),
    futureCost: roundValue(futureCost),
    inflationIncrease: roundValue(inflationIncrease),
    inflationMultiplier,
    currentCostPercentage: roundValue(currentCostPercentage),
    inflationIncreasePercentage: roundValue(inflationIncreasePercentage),
  };

  if (callbackFunc) callbackFunc(data);
  return data;
}

function recalculateInflation({ cc, roi, tp, roundDecimal = 0, container }) {
  if (!container) return;

  const ccInput = container.querySelector("#current-cost");
  const roiInput = container.querySelector("#rate-inflation");
  const tpInput = container.querySelector("#time-period");

  const currentCost = cc != null ? Number(cc) : Number(ccInput?.value || 0);
  const rateOfInflation =
    roi != null ? Number(roi) : Number(roiInput?.value || 0);
  const timePeriod = tp != null ? Number(tp) : Number(tpInput?.value || 0);

  const summary = calculateInflationSummary({
    currentCost,
    rateOfInflation,
    timePeriod,
    roundDecimal,
  });

  const bar = container.querySelector(
    ".calc-compounding .estimated-returns-bar"
  );
  if (bar) {
    bar.style.width = `${summary.inflationIncreasePercentage}%`;
  }

  updateCalculateSummary({
    container,
    data: summary,
  });

  // return summary;
}

export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector(".calc-author-main1");
  if (!CALC_AUTHOR_MAIN) {
    console.warn("No .calc-author-main1 element found.");
    return;
  }

  // Input fields structure:
  const authors = [
    { key: "CC", selector: ":scope > .calc-author-sub1" }, // Current Cost
    { key: "ROI", selector: ":scope > .calc-author-sub2" }, // Rate of Inflation
    { key: "TP", selector: ":scope > .calc-author-sub3" }, // Time Period
  ];

  const CALC_AUTHORED_DATA = authors.map(({ key, selector }) => {
    const author = CALC_AUTHOR_MAIN.querySelector(selector);
    const data = author
      ? [...author.querySelectorAll(".comlist")].map((el) =>
          el.textContent.trim()
        )
      : [];
    return { key, data };
  });

  const OVERVIEW_DATA = CALC_AUTHOR_MAIN.querySelector(
    ":scope > .calc-author-sub4"
  );

  const inflationBlock = createBarSummaryBlock({
    container: OVERVIEW_DATA,
  });

  // Clear old contents
  CALC_AUTHOR_MAIN.innerHTML = "";

  // Extract field defaults
  const cc = getAuthorData(CALC_AUTHORED_DATA, "CC");
  const roi = getAuthorData(CALC_AUTHORED_DATA, "ROI");
  const tp = getAuthorData(CALC_AUTHORED_DATA, "TP");

  // 🏠 Current Cost
  const ccBlock = createInputBlock({
    id: "current-cost",
    ...cc,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "cc-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      recalculateInflation({ cc: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateInflation({ cc: v, container: block });
    },
  });

  // 📈 Rate of Inflation
  const roiBlock = createInputBlock({
    id: "rate-inflation",
    ...roi,
    suffix: "%",
    fieldType: "percent",
    variant: "stepper",
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "roi-inp-container",
    },
    updateWidthonChange: true,
    onInput: (e) => {
      recalculateInflation({ roi: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateInflation({ roi: v, container: block });
    },
  });

  // ⏳ Time Period
  const tpBlock = createInputBlock({
    id: "time-period",
    ...tp,
    suffix: tp?.default > 1 ? "years" : "year",
    fieldType: "year",
    variant: "stepper",
    inputBlockAttr: {
      class: "tp-inp-container",
    },
    updateWidthonChange: true,
    onInput: (e) => {
      recalculateInflation({ tp: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateInflation({ tp: v, container: block });
    },
  });

  // Add all inputs to container
  CALC_AUTHOR_MAIN.append(ccBlock, roiBlock, tpBlock);

  // Add summary block
  block.appendChild(inflationBlock);

  // Initial calculation
  updateCalculateSummary({
    container: block,
    data: calculateInflationSummary({
      currentCost: cc.default,
      rateOfInflation: roi.default,
      timePeriod: tp.default,
      roundDecimal: 0,
    }),
  });
}
