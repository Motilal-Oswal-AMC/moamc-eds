/*  */
import {
  div, p, span, a, button,
} from '../../scripts/dom-helpers.js';
// eslint-disable-next-line no-unused-vars
import * as am5 from '../../scripts/index.js';
// eslint-disable-next-line no-unused-vars
import * as am5xy from '../../scripts/xy.js';
// eslint-disable-next-line no-unused-vars, camelcase
import * as am5themes_Animated from '../../scripts/Animated.js';
import chartsDataReturn from './datareturn.js';
import { initObserver, myAPI } from '../../scripts/scripts.js';

window.am5.addLicense('AM5C-253273928');

export default function decorate(block) {
  // Extract authored content
  const container = block.closest('.performance-graph-returning-container');
  if (container) {
    const defaultContent = container.querySelector('.default-content-wrapper');
    const performanceGraphReturningWrapper = container.querySelector('.performance-graph-returning-wrapper');
    const performanceWrapper = container.querySelector(
      '.performance-graph-returning-wrapper',
    );

    if (
      defaultContent
      && performanceWrapper
      && !defaultContent.parentElement.classList.contains(
        'performance-graph-wrapper',
      )
    ) {
      const newWrapper = document.createElement('div');
      newWrapper.classList.add('performance-graph-wrapper');
      container.insertBefore(newWrapper, defaultContent);
      newWrapper.appendChild(defaultContent);
      newWrapper.appendChild(performanceWrapper);
    } else {
      const newWrapper = document.createElement('div');
      newWrapper.classList.add('performance-graph-wrapper');
      container.insertBefore(newWrapper, performanceGraphReturningWrapper);
      newWrapper.appendChild(performanceWrapper);
    }
  }

  // Extract authored content
  const fundNote = block.children[0].querySelector('p').textContent;
  const fundName = block.children[1].querySelector('p').textContent;
  const ctaBtn = block.children[2].querySelector('a');
  const ctaLink = ctaBtn.href;
  const ctaText = ctaBtn.textContent;

  let root = null;
  const useLiveAPI = true;

  // ---------- RENDER GRAPH (Corrected & Cleaned) ----------

  function renderGraph(chartData) {
    if (root) {
      root.dispose();
      root = null;
    }
    root = window.am5.Root.new('chartdiv1');
    root.setThemes([window.am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      window.am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
      }),
    );

    // ✅ Set the cursor to a pointer on hover
    chart.plotContainer.set('cursorOverStyle', 'pointer');

    chart.set(
      'cursor',
      window.am5xy.XYCursor.new(root, {
        lineY: { visible: false },
        lineX: { visible: true }, // ✅ Enable the vertical line
      }),
    );

    // --- Y-Axis Configuration
    const yAxis = chart.yAxes.push(
      window.am5xy.ValueAxis.new(root, {
        renderer: window.am5xy.AxisRendererY.new(root, {}),
      }),
    );
    const yRenderer = yAxis.get('renderer');
    yRenderer.labels.template.set('forceHidden', true);
    yRenderer.grid.template.set('forceHidden', true);

    // --- X-Axis Configuration
    const xAxis = chart.xAxes.push(
      window.am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: 'day', count: 1 },
        // gridInterval: { timeUnit: 'month', count: 3 },

        renderer: window.am5xy.AxisRendererX.new(root, {
          line: window.am5.Line.new(root, {
            stroke: window.am5.color('#E0E0E0'),
            strokeWidth: 1,
            strokeOpacity: 1,
          }),
          // minGridDistance: 80, // Ensures enough space for year
        }),
        // tooltip: window.am5.Tooltip.new(root, {}),
        // tooltip: window.am5.Tooltip.new(root, {
        //   // ✨ Set the format for the tooltip when hovering over the axis
        //   dateFormat: 'MMM yyyy',
        // }),
      }),
    );

    const xRenderer = xAxis.get('renderer');
    xRenderer.grid.template.set('forceHidden', true);
    xAxis.set('zIndex', 10);

    // test
    xAxis.get('renderer').labels.template.setAll({
      centerY: window.am5.p50, // Align text vertically
      // text: '{valueX.formatDate('MMM yy')}', // Should show 'Jul 24', 'Sep 24'
      text: '{valueX.formatDate("MMM yy")}', // Note the single quotes around yy
      fill: window.am5.color('#212121'), // A dark color for the text
      fontFamily: 'Inter', // As requested
      fontSize: '14px', // Font size
      fontWeight: '500', // A medium font weight
      textAlign: 'center',
      paddingTop: 10,
      // lineHeight: '16px',
    });

    // Custom formatter for x-axis labels
    // xAxis.get('renderer').labels.template.adapters.add('text', function (text, target) {
    //   const date = new Date(target.dataItem.get('valueX'));
    //   const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
    //   const year = date.getFullYear().toString().slice(-2);
    //   return `${month} ${year}`;
    // });

    // Alternative approach using a custom formatter:
    // xAxis.get('renderer').labels.template.set('text', function (target, key) {
    //   const date = new Date(target.dataItem.get('valueX'));
    //   const month = date.toLocaleDateString('en-US', { month: 'short' });
    //   const year = date.getFullYear().toString().slice(-2);
    //   console.log('RYUUU', `${month} ${year}`)
    //   return `${month} ${year}`;
    //   // return 'MAYYY'
    // });

    // --- Series Configuration ---
    const series = chart.series.push(
      window.am5xy.LineSeries.new(root, {
        name: 'Performance',
        xAxis,
        yAxis,
        valueYField: 'value1',
        valueXField: 'date',
        tensionX: 0.8,
      }),
    );

    // series.strokes.template.setAll({
    //   strokeWidth: 2,
    //   stroke: window.am5.color('#7A88FD'), // 7986FD
    // });

    series.fills.template.setAll({
      visible: true,
      fillGradient: window.am5.LinearGradient.new(root, {
        rotation: 90,
        stops: [
          { color: window.am5.color('#7A88FD'), opacity: 1 }, // Top: solid
          { color: window.am5.color('#7A88FD'), opacity: 0 }, // Bottom: transparent
        ],
      }),
    });

    // --- Tooltip Configuration ---
    const tooltip = window.am5.Tooltip.new(root, {
      // labelText: 'NAV on {valueX.formatDate('dd MMM yyyy')}\n• {valueY}',
      labelHTML: 'NAV on {valueX.formatDate(\'dd MMM yyyy\')}<br><span style=\'color: #7986FD; font-weight: bold;\'>●</span> {valueY}',
      getFillFromSprite: false,
      getStrokeFromSprite: false,
      autoTextColor: false,
      pointerOrientation: 'horizontal',
      keepTargetHover: true,
      radius: 4,
      fill: window.am5.color('#7986FD'),
      stroke: window.am5.color('#FFFFFF'),
      strokeWidth: 2,
    });
    series.set('tooltip', tooltip);

    tooltip.get('background').setAll({
      fill: window.am5.color('#2E2A94'), // 1E293B
      fillOpacity: 0.95,
      strokeOpacity: 0,
      cornerRadius: 8,
      shadowColor: window.am5.color('#000000'),
      shadowOpacity: 0.2,
      shadowOffsetX: 0,
      shadowOffsetY: 4,
      shadowBlur: 12,
    });

    tooltip.label.setAll({
      fill: window.am5.color('#FFF'),
      fontFamily: 'Inter', // Inter, sans-serif
      fontSize: 14,
      fontWeight: '500',
      // lineHeight: '16px',
    });

    series.strokes.template.setAll({
      strokeWidth: 2,
      stroke: window.am5.color('#7A88FD'),
    });

    series.data.setAll(chartData);
    series.appear(1000);
    chart.appear(1000, 100);
  }

  // ---------- FILTER FUNCTION ----------
  function filterChartData(data, filter) {
    if (!data || data.length === 0) return [];
    const sortedData = data.sort(
      (ato, b) => new Date(ato.navdate) - new Date(b.navdate),
    );
    if (filter === 'All') return sortedData;
    const latestDate = new Date(sortedData[sortedData.length - 1].navdate);
    const daysMap = {
      '1M': 30,
      '3M': 90,
      '6M': 180,
      '1Y': 365,
      '3Y': 1095,
      '5Y': 1825,
    };
    const days = daysMap[filter];
    if (!days) return sortedData;
    const cutoffDate = new Date(
      latestDate.getTime() - days * 24 * 60 * 60 * 1000,
    );
    const filtered = sortedData.filter(
      (item) => new Date(item.navdate) >= cutoffDate,
    );
    return filtered.length > 0 ? filtered : sortedData;
  }

  // ---------- LOAD DATA ----------
  async function showGraph(filter) {
    try {
      let parsedChartData;
      if (useLiveAPI) {
        const requestData = {
          api_name: 'PerformanceGraphNew',
          cmt_schcode: '26136',
          graphType: 'Lumpsum',
          invamount: '10000',
          isCompare: '',
          isin: 'INF247L01502',
          period: 'Y',
          schcode: 'CP',
        };
        parsedChartData = await myAPI(
          'POST',
          'https://www.motilaloswalmf.com/mutualfund/api/v1/PerformanceGraphNew',
          requestData,
        );
      } else {
        parsedChartData = chartsDataReturn;
      }
      let key; let
        chartArray;
      if (useLiveAPI) {
        [key] = Object.keys(parsedChartData.data.response);
        chartArray = parsedChartData.data.response[key];
      } else {
        [key] = Object.keys(parsedChartData);
        chartArray = parsedChartData[key];
      }
      const filteredData = filterChartData(chartArray, filter);

      // // ✅ Add this line to downsample the data
      // const sampledData = downsampleData(filteredData, 30);

      // // ✅ Use the new sampledData array here
      // const chartData = sampledData.map((item) => ({
      //   date: new Date(item.navdate).getTime(),
      //   value1: parseFloat(item.marketValue_Scheme),
      // }));

      const chartData = filteredData.map((item) => ({
        date: new Date(item.navdate).getTime(),
        value1: parseFloat(item.marketValue_Scheme),
      }));
      initObserver(block, () => {
        renderGraph(chartData);
      });
    } catch (error) {
      // console.error('Error loading chart data:', error);
    }
  }
  // ---------- FILTER BAR ----------
  const filterBar = div({ class: 'chart-filter-bar' });
  const filters = ['1M', '3M', '6M', '1Y', '3Y', '5Y', 'All'];
  let activeFilter = 'All';

  filters.forEach((filter) => {
    const btn = button({ class: 'filter-btn' }, filter);
    if (filter === activeFilter) btn.classList.add('active');

    btn.addEventListener('click', () => {
      activeFilter = filter;
      filterBar
        .querySelectorAll('button')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      showGraph(activeFilter);
    });
    // filterBar.append(btn);
  });

  // ---------- FUND HEADER ----------
  const fundHeader = div(
    { class: 'fund-header' },
    div(
      { class: 'fund-details' },
      div(
        { class: 'fund-identity' },
        p({ class: 'fund-note' }, fundNote),
        p({ class: 'fund-name' }, fundName),
      ),
      div(
        { class: 'fund-meta' },
        div(
          { class: 'fund-tags-wrapper' },
          div(
            { class: 'fund-tags-main' },
            span({ class: 'fund-tag' }, 'Indian Equity'),
          ),
          div(
            { class: 'fund-tags-main' },
            span({ class: 'fund-tag' }, 'Large and Mid Cap'),
          ),
        ),
        div(
          { class: 'fund-returns-main' },
          // p({ class: 'fund-returns' },
          //   'Returns ',
          //   span({ class: 'value' }, '15.28%'),
          // )
          span({ class: 'fund-returns' }, 'Returns '),
          span({ class: 'value' }, '15.28', span({ class: 'fund-percentage' }, '%')),
        ),
      ),
    ),
    div(
      { class: 'invest-now-btn' },
      a({ href: ctaLink, class: 'button button-desktop' }, ctaText),
    ),
  );

  const mobileInvestButton = div(
    { class: 'invest-now-btn-mobile' },
    a({ href: ctaLink, class: 'button button-mobile' }, ctaText),
  );

  // ---------- CHART DIV ----------
  const chartDiv1 = div({ id: 'chartdiv1' });
  chartDiv1.style.width = '100%';

  block.innerHTML = '';
  block.append(fundHeader, filterBar, chartDiv1, mobileInvestButton);

  // ---------- API CALL (Modernized with fetch) ----------
  // async function myAPI(method, url, body = null) {
  //   const options = { method };
  //   if (body) {
  //     options.headers = { 'Content-Type': 'application/json' };
  //     options.body = JSON.stringify(body);
  //   }
  //   const response = await fetch(url, options);
  //   if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  //   const text = await response.text();
  //   try {
  //     return JSON.parse(text);
  //   } catch (e) {
  //     return text;
  //   }
  // }

  // ---------- INITIAL LOAD ----------
  showGraph(activeFilter);
}
