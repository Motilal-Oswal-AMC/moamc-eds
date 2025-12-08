/*  */
// eslint-disable-next-line no-unused-vars
import * as am5 from '../../../scripts/index.js';
// eslint-disable-next-line no-unused-vars
import * as am5xy from '../../../scripts/xy.js';
// eslint-disable-next-line no-unused-vars, camelcase
import * as am5themes_Animated from '../../../scripts/Animated.js';
// import dataMapMoObj from "../../../scripts/constant.js";
import { div } from '../../../scripts/dom-helpers.js';
import {
  createInputBlock,
  formatNumber,
  createBarSummaryBlock,
  getAuthorData,
} from '../common-ui-field/common-ui-field.js';

const createSipCalc = () => {
  window.am5.ready(() => {
    // --- 1️⃣ Create Root Element ---
    const root = window.am5.Root.new('calc-graph-container');
    root.setThemes([window.am5themes_Animated.new(root)]);

    // --- 2️⃣ Create Chart Container ---
    const chart = root.container.children.push(
      window.am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: 'none',
        wheelY: 'none',
      }),
    );

    // --- 3️⃣ Create Axes ---
    const xRenderer = window.am5xy.AxisRendererX.new(root, {
      minGridDistance: 60,
      minorGridEnabled: false,
    });

    const xAxis = chart.xAxes.push(
      window.am5xy.ValueAxis.new(root, {
        renderer: xRenderer,
        min: 0,
        max: 30,
        strictMinMax: true,
        extraMin: 0,
        extraMax: 0,
      }),
    );

    // Force ticks every 5 units
    xAxis.get('renderer').labels.template.setAll({
      text: '{value}',
    });

    xAxis.set('tooltip', window.am5.Tooltip.new(root, {}));

    const yAxis = chart.yAxes.push(
      window.am5xy.ValueAxis.new(root, {
        renderer: window.am5xy.AxisRendererY.new(root, {}),
        min: 0,
        visible: false,
      }),
    );

    // --- 4️⃣ Add Smoothed Line Series ---
    // function createSeries(name, field) {
    //   const series = chart.series.push(
    //     am5xy.LineSeries.new(root, {
    //       name,
    //       xAxis,
    //       yAxis,
    //       valueYField: field,
    //       categoryXField: 'year',
    //       tooltip: am5.Tooltip.new(root, {}),
    //     }),
    //   );

    //   series.get('tooltip').label.adapters.add('text', (text, target) => {
    //     text = '';
    //     let i = 0;
    //     chart.series.each((series) => {
    //       const tooltipDataItem = series.get('tooltipDataItem');
    //       if (tooltipDataItem) {
    //         if (i != 0) {
    //           text += '\n';
    //         }
    //         text += `[${series
    //           .get('stroke')
    //           .toString()}]●[/] [bold width:100px]${series.get(
    //           'name',
    //         )}:[/] ${tooltipDataItem.get('valueY')}`;
    //       }
    //       i++;
    //     });
    //     return text;
    //   });

    //   series.fills.template.setAll({
    //     fillOpacity: 0.5,
    //     visible: true,
    //   });

    //   series.data.setAll(data);
    //   series.appear(1000);
    // }

    // --- 4️⃣ Add Smoothed Line Series (Final Attempt Fix) ---

    const series = chart.series.push(
      window.am5xy.LineSeries.new(root, {
        // Using LineSeries (not Smoothed) for simplicity
        name: 'SIP Growth',
        xAxis,
        yAxis,
        valueYField: 'value',
        valueXField: 'year',
        // Basic default tooltip
        tooltip: window.am5.Tooltip.new(root, {
          labelText: 'Year: {valueX}\nAmount: {valueY}',
        }),
      }),
    );

    // --- 5️⃣ Bullets for Growth Labels ---
    series.bullets.push((rootNew, test, dataItem) => {
      console.log('test : ', test);

      if (dataItem.dataContext.label) {
        return window.am5.Bullet.new(rootNew, {
          sprite: window.am5.Label.new(rootNew, {
            text: dataItem.dataContext.label,
            centerX: window.am5.p50,
            centerY: window.am5.p50,
            background: window.am5.RoundedRectangle.new(rootNew, {
              fill: window.am5.color(0xe0e5ff),
              cornerRadiusTL: 4,
              cornerRadiusTR: 4,
              cornerRadiusBL: 4,
              cornerRadiusBR: 4,
            }),
            fill: window.am5.color(0x3b4cc0),
            fontSize: 11,
            paddingLeft: 6,
            paddingRight: 6,
            paddingTop: 3,
            paddingBottom: 3,
          }),
        });
      }
      return null;
    });

    // --- 6️⃣ Generate SIP Data ---
    function generateSipData(P, years, annualReturn) {
      const r = annualReturn / 12 / 100;
      const n = years * 12;
      const data = [];
      for (let i = 1; i <= n; i += 1) {
        const maturity = P * (((1 + r) ** i - 1) / r) * (1 + r);
        const multiplier = `${(maturity / (P * i)).toFixed(1)}x`;
        if (i % 36 === 0 || i === n) {
          data.push({ year: i / 12, value: maturity, label: multiplier });
        } else {
          data.push({ year: i / 12, value: maturity });
        }
      }
      return data;
    }

    const sipData = generateSipData(10000, 30, 12);
    series.data.setAll(sipData);

    // --- 7️⃣ Add Side Labels ---
    const invested = 10000 * 12 * 30;
    const estimated = sipData[sipData.length - 1].value;
    const returns = estimated - invested;

    chart.children.unshift(
      window.am5.Label.new(root, {
        text: `Investment Amount\n₹${(invested / 100000).toFixed(0)}L`,
        fontSize: 14,
        fontWeight: 'bold',
        fill: window.am5.color(0x3b4cc0),
        x: -40,
        y: window.am5.percent(50),
        rotation: 0,
        textAlign: 'left',
      }),
    );

    chart.children.push(
      window.am5.Label.new(root, {
        text: `Estimated Returns\n₹${(returns / 1000).toFixed(0)},000`,
        fontSize: 14,
        fontWeight: 'bold',
        fill: window.am5.color(0x3b4cc0),
        x: window.am5.percent(95),
        y: 10,
        textAlign: 'right',
      }),
    );

    // --- 8️⃣ Animate the Chart ---
    series.appear(1000);
    chart.appear(1000, 100);

    // --- 9️⃣ Enable cursor for hover tooltip ---
    const cursor = chart.set(
      'cursor',
      window.am5xy.XYCursor.new(root, { behavior: 'none', xAxis }),
    );
    cursor.lineY.set('visible', true);
    cursor.lineX.set('visible', true);
    // Show vertical line
    cursor.lineX.setAll({
      stroke: window.am5.color(0xffffff), // initial color
      strokeWidth: 2,
      strokeOpacity: 0.5,
    });

    // Change vertical line color on hover over series
    series.events.on('pointerover', () => {
      cursor.lineX.set('stroke', window.am5.color(0x3b4cc0)); // new color on hover
    });

    series.events.on('pointerout', () => {
      cursor.lineX.set('stroke', window.am5.color(0xffffff)); // revert back
    });
  });
};

/**
 * Calculate SIP summary (Total, Returns, Multiplier, Percentages)
 * @param {Object} params
 * @param {number} params.monthlyInvestment - Amount invested every month
 * @param {number} params.annualReturnRate - Expected annual return rate (%)
 * @param {number} params.years - Investment duration (years)
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
export function calculateSIPSummary({
  monthlyInvestment,
  annualReturnRate,
  years,
  roundDecimal,
  callbackFunc,
}) {
  let data;
  if (!monthlyInvestment || !annualReturnRate || !years) {
    data = {
      totalInvestment: 0,
      totalValue: 0,
      estimatedReturns: 0,
      compoundingAt: '1.0x',
      investedPercentage: 0,
      returnsPercentage: 0,
    };
  }

  const months = years * 12;
  const monthlyRate = annualReturnRate / 12 / 100;

  // SIP Future Value formula
  const totalValue = monthlyInvestment
    * ((((1 + monthlyRate) ** months - 1) / monthlyRate) * (1 + monthlyRate));

  const totalInvestment = monthlyInvestment * months;
  const estimatedReturns = totalValue - totalInvestment;

  const multiplier = totalValue / totalInvestment;
  const compoundingAt = `${multiplier.toFixed(1)}x`;

  // Calculate percentages for bar visualization
  const investedPercentage = (totalInvestment / totalValue) * 100;
  const returnsPercentage = (estimatedReturns / totalValue) * 100;

  const roundValue = (val) => {
    if (roundDecimal == null) return val; // keep full precision
    return Number(val.toFixed(roundDecimal)); // works for 0, 1, 2, etc.
  };

  data = {
    totalInvestment: roundValue(totalInvestment),
    totalValue: roundValue(totalValue),
    estimatedReturns: roundValue(estimatedReturns),
    compoundingAt,
    investedPercentage: roundValue(investedPercentage),
    returnsPercentage: roundValue(returnsPercentage),
  };
  if (callbackFunc) {
    callbackFunc(data);
  }
  return data;
}

/**
 * Adjust the compounding label position based on initial vs current width
 */
let initialCompoundWidth = null;

export function adjustCompoundLabelPosition() {
  const compoundRate = document.querySelector('.compound-rate-container');
  if (!compoundRate) return;
  const currentWidth = compoundRate.offsetWidth;

  // Capture the initial width once (on first render)
  if (!initialCompoundWidth) {
    initialCompoundWidth = currentWidth;
    return; // nothing to compare yet
  }

  // Calculate the difference (if the container has shrunk)
  const diff = currentWidth - initialCompoundWidth;

  if (diff <= 0) {
    // Move left based on difference
    compoundRate.style.left = `-${initialCompoundWidth}px`;
  } else {
    // Reset to normal if size matches or is larger
    compoundRate.style.left = '0';
  }
}

export function updateCalculateSipSummary({ container, data }) {
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

  if (compoundRateEl) {
    compoundRateEl.textContent = data.compoundingAt;
  }
  adjustCompoundLabelPosition();
}

function recalculateSip({
  msi, ror, ip, roundDecimal = 0, container,
}) {
  if (!container) return;
  // If values are not passed, fetch from input elements
  const msiInput = container.querySelector('#sip-amount');
  const rorInput = container.querySelector('#rate-return');
  const ipInput = container.querySelector('#inv-period');

  const monthlyInvestment = msi != null ? Number(msi) : Number(msiInput?.value || 0);
  const annualReturnRate = ror != null ? Number(ror) : Number(rorInput?.value || 0);
  const years = ip != null ? Number(ip) : Number(ipInput?.value || 0);

  // 1️⃣ Calculate SIP summary
  const summary = calculateSIPSummary({
    monthlyInvestment,
    annualReturnRate,
    years,
    roundDecimal,
  });
  container.querySelector(
    '.calc-compounding .estimated-returns-bar',
  ).style.width = `${summary?.returnsPercentage}%`;
  // 2️⃣ Update the UI with the new values
  updateCalculateSipSummary({
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
  document
    .querySelector('.calculator-graph-container .calc-graph-item1')
    .insertAdjacentElement(
      'afterend',
      div({
        id: 'calc-graph-container',
      }),
    );
  createSipCalc();
  const authors = [
    { key: 'MSI', selector: ':scope > .calc-author-sub1' },
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
  const sipBlock = createBarSummaryBlock({
    container: OVERVIEW_DATA,
    showCompoundRate: true,
  });
  CALC_AUTHOR_MAIN.innerHTML = '';

  const msi = getAuthorData(CALC_AUTHORED_DATA, 'MSI');
  const ror = getAuthorData(CALC_AUTHORED_DATA, 'ROR');
  const ip = getAuthorData(CALC_AUTHORED_DATA, 'IP');

  const msiBlock = createInputBlock({
    id: 'sip-amount',
    ...msi,
    prefix: '₹',
    fieldType: 'currency',
    prefixAttr: { class: 'currency-prefix' },
    inputBlockAttr: {
      class: 'msi-inp-container',
    },
    variant: 'number',
    onInput: (e) => {
      recalculateSip({ msi: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSip({ msi: v, container: block });
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
    updateWidthonChange: true,
    onInput: (e) => {
      recalculateSip({ ror: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSip({ ror: v, container: block });
    },
  });

  const ipBlock = createInputBlock({
    id: 'inv-period',
    ...ip,
    inputBlockAttr: {
      class: 'ip-inp-container',
    },
    fieldType: 'year',
    suffix: ip?.default > 1 ? 'years' : 'year',
    variant: 'stepper',
    updateWidthonChange: true,
    onInput: (e) => {
      recalculateSip({ ip: e.target.value, container: block });
    },
    onChange: (v) => {
      recalculateSip({ ip: v, container: block });
    },
  });

  // Append to container
  CALC_AUTHOR_MAIN.append(msiBlock, rorBlock, ipBlock);

  block.appendChild(sipBlock);

  updateCalculateSipSummary({
    container: block,
    data: calculateSIPSummary({
      annualReturnRate: ror.default,
      monthlyInvestment: msi.default,
      years: ip.default,
      roundDecimal: 0,
    }),
  });
}
