/*  */
// eslint-disable-next-line no-unused-vars
import chartsData from './data.js';
// eslint-disable-next-line no-unused-vars
import * as am5 from '../../scripts/index.js';
// eslint-disable-next-line no-unused-vars
import * as am5xy from '../../scripts/xy.js';
// eslint-disable-next-line no-unused-vars, camelcase
import * as am5themes_Animated from '../../scripts/Animated.js';
import {
  div, p, h2, span,
} from '../../scripts/dom-helpers.js';
import dataCfObj from '../../scripts/dataCfObj.js';
import { initObserver, myAPI } from '../../scripts/scripts.js';

window.am5.addLicense('AM5C-253273928');

export default function decorate(block) {
  const col1 = block.children[0].querySelector('h4');
  const col2 = block.children[0].querySelector('p');

  const fundNote = h2(col1.textContent.trim());
  const fundCAGR = p(col2.textContent.trim());

  const filterBar = div({ class: 'chart-filter-bar' });

  // --- START: MODIFIED CODE FOR DYNAMIC FILTERS ---

  // 1. Define the mapping from data keys to button labels and their desired order.
  const returnKeyMapToLabel = {
    oneMonth_Ret: '1M',
    threeMonth_Ret: '3M',
    sixMonth_Ret: '6M',
    oneYear_Ret: '1Y',
    threeYear_Ret: '3Y',
    fiveYear_Ret: '5Y',
    sevenYear_Ret: '7Y',
    tenYear_Ret: '10Y',
    inception_Ret: 'All',
  };

  const filterOrder = ['1M', '3M', '6M', '1Y', '3Y', '5Y', '7Y', '10Y', 'All'];

  let root = null;
  let cachedAPIData = null;
  let planType = 'Direct';
  let planOption = 'Growth';

  const planCodeObj = localStorage.getItem('planCode');
  let schcode;
  if (planCodeObj !== null) {
    const schdata = planCodeObj.split(':')[1];
    schcode = schdata;
  } else if (window.location.href.includes('/our-funds/funds-details-page')) {
    schcode = 'LM';
  } else {
    const path = window.location.pathname.split('/').at(-1);
    const planobj = dataCfObj.cfDataObjs.filter(
      (el) => path === el.schDetail.schemeName.toLocaleLowerCase().split(' ').join('-'),
    );
    schcode = planobj[0].schcode;
  }
  // const schcode = planCodeObj.split(':')[1];
  const selectedFund = dataCfObj.cfDataObjs.find((fund) => fund.schcode === schcode);

  // 2. Get the returns data for the current fund immediately.
  const targetPlan = selectedFund?.planList;
  // .find((ptar) => ptar.planName === planType && ptar.optionName === planOption);
  // const { planCodeobj, optionCode } = targetPlan || {};
  const optionCode = targetPlan[0].optionCode || {};
  const planCodeobj = targetPlan[0].planCode || {};
  planType = targetPlan[0].planName;
  planOption = targetPlan[0].optionName;

  const targetReturns = targetPlan
    ? selectedFund.returns.find((rtar) => (
      rtar.plancode === planCodeobj && rtar.optioncode === optionCode
    ))
    : null;

  // 3. Create the dynamic filters array based on available data.
  const dynamicFilters = [];
  if (targetReturns) {
    // Invert the map for easier lookup (e.g., '1Y' -> 'oneYear_Ret')
    const labelToKeyMap = Object.fromEntries(Object.entries(returnKeyMapToLabel)
      .map(([key, value]) => [value, key]));

    filterOrder.forEach((label) => {
      const key = labelToKeyMap[label];
      // If the return key exists in our data, add the label to our filter list
      if (Object.prototype.hasOwnProperty.call(targetReturns, key)) {
        dynamicFilters.push(label);
      }
    });
  }

  // 4. Set a smart default active filter. Fallback to the first available one.
  let activeFilter = dynamicFilters.includes('3Y') ? '3Y' : (dynamicFilters[0] || 'All');
  const ind = Object.values(returnKeyMapToLabel).indexOf(activeFilter);
  const indval = Object.keys(returnKeyMapToLabel)[ind];

  // --- END: MODIFIED CODE ---

  const filterSelectedEl = span({ class: 'filter-selected' });
  const cagrValueEl = span({ class: 'cagr-value' }, targetReturns[indval]);

  const topBar = div({ class: 'fund-note-container' }, fundNote);
  const middleBar = div(
    { class: 'fund-main' },
    div({ class: 'fund-filters' }, filterBar),
    div(
      { class: 'fund-cagr' },
      div({ class: 'graph-cagr' }, fundCAGR),
      div({ class: 'fund-cagr-container' }, filterSelectedEl, cagrValueEl),
    ),
  );
  block.innerHTML = '';
  block.prepend(topBar);

  const graphDiv = div({ id: 'chartdiv' });
  const middleContainer = div(
    { class: 'wrapnote' },
    middleBar,
    graphDiv,
  );
  block.append(middleContainer);

  // --- STATE & API LOGIC ---
  const useLiveAPI = true;
  function filterChartData(data, filter) {
    if (!data || data.length === 0) return [];
    const sortedData = [...data].sort(
      (a, b) => new Date(a.navdate) - new Date(b.navdate),
    );
    if (filter === 'All') return sortedData;

    const latestDate = new Date(sortedData[sortedData.length - 1].navdate);
    const cutoffDate = new Date(latestDate);

    // A more robust way to calculate past dates
    switch (filter) {
      case '1M':
        cutoffDate.setMonth(cutoffDate.getMonth() - 1);
        break;
      case '3M':
        cutoffDate.setMonth(cutoffDate.getMonth() - 3);
        break;
      case '6M':
        cutoffDate.setMonth(cutoffDate.getMonth() - 6);
        break;
      case '1Y':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        break;
      case '3Y':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 3);
        break;
      case '5Y':
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 5);
        break;
      default:
        return sortedData; // Should not happen
    }
    return sortedData.filter((item) => new Date(item.navdate) >= cutoffDate);
  }

  // ✅ Function now accepts dynamic series names
  function renderAmChart(chartData, series1Name, series2Name) {
    if (root) {
      root.dispose();
      root = null;
    }

    // Clear any previous loader or error message
    graphDiv.innerHTML = '';

    initObserver(block, () => {
      window.am5.ready(() => {
        root = window.am5.Root.new('chartdiv');

        root.setThemes([window.am5themes_Animated.new(root)]);

        const chart = root.container.children.push(
          window.am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: 'panX',
            wheelY: 'zoomX',
            pinchZoomX: true,
            paddingBottom: 80,
          }),
        );

        chart.get('colors').set('step', 3);

        const cursor = chart.set('cursor', window.am5xy.XYCursor.new(root, {}));
        cursor.lineY.set('visible', false);

        const xAxis = chart.xAxes.push(
          window.am5xy.DateAxis.new(root, {
            baseInterval: { timeUnit: 'day', count: 1 },
            renderer: window.am5xy.AxisRendererX.new(root, {
              minorGridEnabled: true,
            }),
          }),
        );

        xAxis.get('renderer').labels.template.setAll({
          // fill: window.am5.color(0x212121),
          // fontFamily: 'Inter',
          fill: window.am5.color('#212121'), // <-- Change color here (e.g., grey) // test
          fontFamily: 'Inter', // 'Arial',             // <-- Change font family here
          fontSize: 14,
          fontWeight: 500,
          linHight: '16px',
          paddingTop: 8,
        });

        const yAxis = chart.yAxes.push(
          window.am5xy.ValueAxis.new(root, {
            renderer: window.am5xy.AxisRendererY.new(root, {}),
          }),
        );

        // Hide all grids
        xAxis.get('renderer').grid.template.set('visible', false);
        yAxis.get('renderer').grid.template.set('visible', false);

        // Show only bottom X axis baseline
        xAxis.get('renderer').setAll({
          strokeOpacity: 1,
          stroke: window.am5.color('#2E2A94'),
        });
        // Show only left Y axis baseline
        if (window.innerWidth < 900) {
          yAxis.setAll({
            marginLeft: -25, // Add space to the left of the axis
            marginRight: 0, // Add space to the right of the axis
            paddingTop: 0, // Add space at the top of the axis scale
            paddingBottom: 0, // Add space at the bottom of the axis scale
          });
        }
        yAxis.get('renderer').setAll({
          strokeOpacity: 0,
          stroke: window.am5.color(0xcccccc),
        });

        // test
        // ADD THIS CODE BLOCK FOR Y-AXIS LABELS
        yAxis.get('renderer').labels.template.setAll({
          fill: window.am5.color(0x888888), // <-- Set your desired color
          fontFamily: 'Inter', // 'Arial',             // <-- Set your desired font family
          fontSize: 14,
          // color: '#616161',
        });

        // Shared tooltip
        const sharedTooltip = window.am5.Tooltip.new(root, {
          getFillFromSprite: false,
          autoTextColor: false,
        });
        sharedTooltip.get('background').setAll({
          fill: window.am5.color(0x2f2fa2),
          fillOpacity: 1,
          strokeOpacity: 0,
          cornerRadius: 6,
        });
        sharedTooltip.label.setAll({
          fill: window.am5.color(0xffffff),
          fontFamily: 'Inter',
          // fill: window.am5.color(0xffeecc),  // <-- Change text color (e.g., light yellow)
          // fontFamily: 'Courier New',       // <-- Change font family
          fontSize: 14,
          fontWeight: 400,
        });

        // Series 1 // test
        const series1 = chart.series.push(
          window.am5xy.LineSeries.new(root, {
            name: series1Name || 'Motilal Oswal Large and Midcap fund',
            xAxis,
            yAxis,
            valueYField: 'value1',
            valueXField: 'date',
            tensionX: 0.8,
            tooltip: sharedTooltip,
            paddingTop: 40,
          }),
        );

        series1.strokes.template.setAll({
          strokeWidth: 2,
          stroke: window.am5.color(0x4a68f6),
        });
        series1.fills.template.setAll({
          visible: true,
          fillOpacity: 0.2,
          fillGradient: window.am5.LinearGradient.new(root, {
            stops: [
              { color: window.am5.color(0x4a68f6), opacity: 0.3 },
              { color: window.am5.color(0xffffff), opacity: 0 },
            ],
            rotation: 90,
          }),
        });

        // Series 2 // test
        const series2 = chart.series.push(
          window.am5xy.LineSeries.new(root, {
            name: series2Name || 'Nifty 100 TRI',
            xAxis,
            yAxis,
            valueYField: 'value2',
            valueXField: 'date',
            tensionX: 0.8,
            tooltip: sharedTooltip,
          }),
        );

        series2.strokes.template.setAll({
          strokeWidth: 2,
          stroke: window.am5.color(0xf5a623),
        });
        series2.fills.template.setAll({
          visible: true,
          fillOpacity: 0.2,
          fillGradient: window.am5.LinearGradient.new(root, {
            stops: [
              { color: window.am5.color(0xf5a623), opacity: 0.3 },
              { color: window.am5.color(0xffffff), opacity: 0 },
            ],
            rotation: 90,
          }),
        });

        // Series 1 - Blue
        series1.setAll({
          stroke: window.am5.color(0x7a88fd),
          fill: window.am5.LinearGradient.new(root, {
            stops: [
              { color: window.am5.color(0x7a88fd), opacity: 1 },
              { color: window.am5.color(0x7a88fd), opacity: 0 },
            ],
            rotation: 90,
          }),
        });

        // Series 2 - Orange
        series2.setAll({
          stroke: window.am5.color(0xff9811),
          fill: window.am5.LinearGradient.new(root, {
            stops: [
              { color: window.am5.color(0xff9811), opacity: 1 },
              { color: window.am5.color(0xff9811), opacity: 0 },
            ],
            rotation: 90,
          }),
        });

        // Combine tooltip text for both series (REPLACEMENT)
        sharedTooltip.label.adapters.add('text', (text) => {
          try {
            const axisPos = xAxis.toAxisPosition(
              cursor.getPrivate('positionX'),
            );
            const dataItem1 = xAxis.getSeriesItem(series1, axisPos);
            const dataItem2 = xAxis.getSeriesItem(series2, axisPos);

            const dateVal = (dataItem1 && dataItem1.get('valueX'))
              || (dataItem2 && dataItem2.get('valueX'));

            const formattedDate = dateVal
              ? root.dateFormatter.format(new Date(dateVal), 'd MMM yyyy')
              : '';

            let result = formattedDate
              ? `Nav on [bold]${formattedDate}[/]\n\n`
              : '';

            // Series 1 bullet in actual stroke color
            if (dataItem1) {
              const color1 = series1.get('stroke').toCSSHex();
              const val1 = dataItem1.get('valueY');
              result += `[#${color1.replace(
                '#',
                '',
              )}]●[/] [bold]${root.numberFormatter.format(
                val1,
                '#,###.00',
              )}[/]\n`;
            }

            // Series 2 bullet in actual stroke color
            if (dataItem2) {
              const color2 = series2.get('stroke').toCSSHex();
              const val2 = dataItem2.get('valueY');
              result += `[#${color2.replace(
                '#',
                '',
              )}]●[/] [bold]${root.numberFormatter.format(
                val2,
                '#,###.00',
              )}[/]`;
            }

            return result || text;
          } catch (err) {
            return text;
          }
        });

        root.dateFormatter.setAll({
          dateFormat: 'yyyy-MM-dd',
          dateFields: ['valueX'],
        });

        series1.data.setAll(chartData);
        series2.data.setAll(chartData);

        const legend = chart.children.push(
          window.am5.Legend.new(root, {
            centerX: window.am5.p50,
            x: window.am5.p50,
            centerY: window.am5.p100,
            y: window.am5.percent(110),
            layout: root.horizontalLayout,
            marginTop: 30,
            itemContainers: {
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 10,
              paddingRight: 10,
            },
          }),
        );

        // Replace rectangle markers with circle dots
        legend.markers.template.setAll({
          width: 12,
          height: 12,
          cornerRadiusTL: 6,
          cornerRadiusTR: 6,
          cornerRadiusBL: 6,
          cornerRadiusBR: 6,
        });

        // OR, more cleanly:
        legend.markers.template.set('draw', (display) => {
          display.circle(6, 6, 6); // x, y, radius
        });

        // Also update your legend labels template for better alignment:
        let lengendCss = {
          fill: window.am5.color('#2E2A94'),
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: '400',
          marginLeft: 6,
          lineHight: '16px',
          centerY: window.am5.p50, // Vertically center the text
          paddingTop: 0, // Remove any top padding
          paddingBottom: 0, // Remove any bottom padding
        };
        let legendset = {
          layout: root.horizontalLayout,
          centerX: window.am5.p50,
          x: window.am5.p50,
          centerY: window.am5.p100,
          y: window.am5.percent(110),
          paddingLeft: 0,
          paddingRight: 0,
        };
        if (window.innerWidth < 900) {
          lengendCss = {
            fill: window.am5.color('#2E2A94'),
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: '500',
            marginLeft: 6,
            lineHight: '16px',
            centerY: window.am5.p50, // Vertically center the text
            paddingTop: 0, // Remove any top padding
            paddingBottom: 0, // Remove any bottom padding
          };
          legendset = {
            layout: root.horizontalLayout,
            centerX: window.am5.p50,
            x: window.am5.p50,
            centerY: window.am5.p100,
            y: window.am5.percent(110),
            paddingLeft: -25,
            paddingRight: 0,
          };
        }
        legend.labels.template.setAll(lengendCss);
        legend.data.setAll(chart.series.values);

        // Center the legend group and keep items tight
        legend.setAll(legendset);
        // Make sure item containers size to content (no forced width)
        legend.itemContainers.template.set('width', null);

        // Alternative approach - if the above doesn't work perfectly, try this:
        legend.itemContainers.template.setAll({
          paddingTop: 4,
          paddingBottom: 4,
          marginRight: 20,
          valign: 'middle', // Ensure vertical alignment of container contents
        });

        // optional: no extra gap after the last item
        legend.itemContainers.template.adapters.add(
          'marginRight',
          (mr, target) => {
            const di = target.dataItem;
            return di && di.get('index') === legend.data.length - 1 ? 0 : mr;
          },
        );

        // Make legend markers circular dots that match series color
        [series1, series2].forEach((s) => {
          const legendItem = s.get('legendDataItem');
          if (!legendItem) return;

          const marker = legendItem.get('marker');
          marker.setAll({
            width: 2,
            height: 2,
            paddingRight: -5,
            paddingLeft: -5,
            centerY: window.am5.p50, // Center the marker vertically
            centerX: window.am5.p50, // Center the marker horizontally
          });

          // Remove default rectangle/line sample and add a circle
          marker.children.clear();
          marker.children.push(
            window.am5.Circle.new(root, {
              radius: 6,
              fill: s.get('stroke'), // use the series stroke color
              stroke: s.get('stroke'),
              paddingTop: 10,
              centerY: window.am5.p50, // Center the circle within the marker
              centerX: window.am5.p50, // Center the circle within the marker
            }),
          );
        });

        // --- START: ADDED CODE FOR RESPONSIVE LEGEND ---
        // This block overrides the settings above ONLY on mobile screens
        if (window.innerWidth <= 768) {
          legend.setAll({
            layout: root.verticalLayout, // Stack items vertically
            x: window.am5.percent(0), // Align to the left
            centerX: window.am5.percent(0), // Anchor to the left
            y: window.am5.percent(115), // Position at the bottom
            paddingTop: 100, // Add top padding
            paddingBottom: 0, // Add bottom padding
          });
          // Adjust spacing for vertical items
          legend.itemContainers.template.setAll({
            marginRight: 0,
            marginBottom: 0,
            paddingTop: 10,
            paddingBottom: 0,
            paddingLeft: 20,
            paddingRight: 20,
            // width: window.innerWidth - 40, // Full width minus padding
          });
        }
        // --- END: ADDED CODE ---

        series1.appear(1000);
        series2.appear(1000);
        chart.appear(1000, 100);
      });
    });
  }

  async function renderGraph(filter) {
    // UX Improvement: Show a loading message while fetching data
    if (!cachedAPIData) {
      graphDiv.innerHTML = '<div class=\'chart-loader\'>Loading Chart...</div>';
    }

    try {
      if (useLiveAPI && !cachedAPIData) {
        if (!schcode) throw new Error('planCode not found in localStorage.');
        if (!selectedFund) {
          throw new Error(
            `Fund with schcode '${schcode}' not found in dataCfObj.`,
          );
        }

        // const allFundsData = await myAPI(
        //   'GET',
        //   'https://main--eds-ashdemo--ashwin27jethawa.aem.page/pocmosl.json'
        // );

        /// new code
        const targetPlansec = selectedFund?.planList.find(
          (psec) => psec.planName === planType && psec.optionName === planOption,
        );
        const targetReturnssec = selectedFund?.returns.find(
          (r) => r.plancode === targetPlansec?.planCode
            && r.optioncode === targetPlansec?.optionCode,
        );

        const currentFundDetails = {
          cmt_schcode: targetReturnssec.cmt_schcode,
          isin: targetReturnssec.isin,
        };

        /// new code
        // const currentFundDetails = allFundsData.data.find(fund => fund.schcode === schcode);
        if (!currentFundDetails) throw new Error(`API details for schcode '${schcode}' not found.`);

        const requestData = {
          api_name: 'PerformanceGraphNew',
          cmt_schcode: currentFundDetails.cmt_schcode || '26136',
          graphType: 'Lumpsum',
          invamount: '10000',
          isCompare: '',
          isin: currentFundDetails.isin || 'INF247L01502',
          period: 'Y',
          schcode: schcode || 'CP',
        };

        cachedAPIData = await myAPI(
          'POST',
          'https://www.motilaloswalmf.com/mutualfund/api/v1/PerformanceGraphNew',
          requestData,
        );
      }

      if (!cachedAPIData) {
        // Fallback for local development or if live API is off
        // cachedAPIData = chartsData;
        throw new Error('No chart data available.');
      }

      if (JSON.stringify(cachedAPIData.data.response) === '{}') {
        block.closest('.fdp-card-container')
          .querySelector('.item2-ul').children[0].style.display = 'none';
        const mop = [];
        Array.from(block.closest('.fdp-card-container')
          .querySelector('.item2-ul').children).forEach((el) => {
          if (el.style.display !== 'none') {
            mop.push(el.textContent.trim());
          }
        });
        const selval = block.closest('.fdp-card-container');
        const valp = mop[0];
        selval.querySelector('.selectedtext-fdp').textContent = '';
        selval.querySelector('.selectedtext-fdp').textContent = valp;
        block.style.display = 'none';
        return false;
      }
      const key = Object.keys(cachedAPIData.data.response)[0];
      const chartArray = cachedAPIData.data.response[key];

      // ✅ Extract series names from the cached API data

      // test
      // const cagrInfo = cachedAPIData.data.cagr;
      const series1Name = 'Motilal Oswal Large and Midcap fund'; // cagrInfo.sch_name || 'Scheme';
      const series2Name = chartArray[0].co_name || 'Benchmark'; // cagrInfo.bm1_name || 'Benchmark';

      const filteredData = filterChartData(chartArray, filter);
      const chartData = filteredData.map((item) => ({
        date: new Date(item.navdate).getTime(),
        value1: parseFloat(item.marketValue_Scheme),
        value2: parseFloat(item.marketValue_BM1),
      }));

      // ✅ Pass the dynamic names to the charting function
      renderAmChart(chartData, series1Name, series2Name);
    } catch (error) {
      // console.error('Error loading chart data:', error);
      graphDiv.innerHTML = `<div class='chart-error'>Could not load chart. ${error.message}</div>`;
    }
    return false;
  }

  function updateReturnsDisplay(filter) {
    // const planTypesec = 'Direct';
    // const planOptionsec = 'Growth';

    if (!selectedFund) {
      cagrValueEl.textContent = 'N/A';
      filterSelectedEl.textContent = filter;
      return;
    }

    const targetPlantri = selectedFund.planList[0];
    // planTypesec = targetReturnstri[0].planName;
    // planOptionsec = targetPlantri[0].optionName;
    // .find((pplan) => pplan.planName === planTypesec && pplan.optionName === planOptionsec);
    // Destructure properties from targetPlantri first
    // const { planCode, optionCode } = targetPlantri || {};

    const targetReturnstri = targetPlantri
      ? selectedFund.returns.find(
        (r) => r.plancode === targetPlantri.planCode
        && r.optioncode === targetPlantri.optionCode,
      )
      : null;

    const returnKeyMap = {
      '1M': 'oneMonth_Ret',
      '3M': 'threeMonth_Ret',
      '6M': 'sixMonth_Ret',
      '1Y': 'oneYear_Ret',
      '3Y': 'threeYear_Ret',
      '5Y': 'fiveYear_Ret',
      '7Y': 'sevenYear_Ret',
      '10Y': 'tenYear_Ret',
      All: 'inception_Ret',
    };

    const returnKey = returnKeyMap[filter];
    const returnCAGR = targetReturnstri && returnKey && targetReturnstri[returnKey]
      ? parseFloat(targetReturnstri[returnKey])
      : null;

    filterSelectedEl.textContent = filter !== 'All' ? filter : 'Inception';

    if (returnCAGR !== null) {
      cagrValueEl.textContent = ` ${returnCAGR}%`;
    } else {
      cagrValueEl.textContent = '';
    }
  }

  async function updateDashboard(filter) {
    activeFilter = filter;
    // Update button styles
    [...filterBar.children].forEach((btn) => {
      btn.classList.toggle('active', btn.textContent === filter);
    });
    await renderGraph(filter);
    updateReturnsDisplay(filter);
  }

  // --- EVENT LISTENERS & INITIALIZATION ---
  // 5. Use the new dynamicFilters array to create the buttons.
  dynamicFilters.forEach((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'filter-btn';
    btn.addEventListener('click', () => updateDashboard(label));
    filterBar.appendChild(btn);
  });

  // Initial load
  updateDashboard(activeFilter);

  // function myAPI(method, url, data = null) {
  //   return new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open(method, url, true);
  //     if (data) xhr.setRequestHeader('Content-Type', 'application/json');
  //     xhr.onreadystatechange = () => {
  //       if (xhr.readyState === 4) {
  //         if (xhr.status >= 200 && xhr.status < 300) {
  //           try {
  //             const json = JSON.parse(xhr.responseText);
  //             resolve(json);
  //           } catch (err) {
  //             resolve(xhr.responseText);
  //           }
  //         } else {
  //           reject(new Error(`Request failed: ${xhr.status}`));
  //         }
  //       }
  //     };
  //     xhr.onerror = () => reject(new Error('Network error'));
  //     xhr.send(data ? JSON.stringify(data) : null);
  //   });
  // }
}
