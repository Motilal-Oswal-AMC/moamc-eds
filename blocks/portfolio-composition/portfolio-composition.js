// /* eslint-disable */  this is write code
import * as am5 from '../../scripts/index.js';
import * as am5percent from '../../scripts/percent.js';
import * as am5themes_Animated from '../../scripts/Animated.js';
import { div } from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';

window.am5.addLicense('AM5C-253273928');

export default function decorate(block) {
  const bolckData = block.closest('.section.portfolio-composition');
  if (bolckData) {
    dataMapMoObj.CLASS_PREFIXES = ['portfolio-com', 'portfolio-com-inner', 'portfolio-com-sub-inner', 'portfolio-com-sub-inner-sub'];
    dataMapMoObj.addIndexed(bolckData);
    const graphPanel = bolckData.querySelector('.tabpanel1 .portfolio-com-sub-inner-sub1');
    const grafData = bolckData.querySelector('.portfolio-com3');
    graphPanel.appendChild(grafData);
  }

  const graphDiv = div({ id: 'abha' });
  const middleContainer = div({ class: 'wrapnote' }, graphDiv);
  block.append(middleContainer);

  window.am5.ready(() => {
    const root = window.am5.Root.new('abha');
    root.setThemes([window.am5themes_Animated.new(root)]);

    const chart = root.container.children.push(window.am5percent.PieChart.new(root, {
      layout: root.verticalLayout,
      innerRadius: window.am5.percent(20), // Set inner radius for donut hole
    }));

    // --- ADD BACKGROUND CONCENTRIC CIRCLES ---
    // This adds the faint dotted circles seen in the Figma background
    [0.35, 0.6, 0.85, 1.05].forEach((radius) => {
      const bgCircle = chart.seriesContainer.children.push(window.am5.Circle.new(root, {
        radius: window.am5.percent(radius * 100),
        fillOpacity: 0,
        stroke: window.am5.color(0x000000),
        strokeOpacity: 0.08,
        strokeWidth: 1,
        strokeDasharray: [4, 4],
        centerX: window.am5.percent(50),
        centerY: window.am5.percent(50),
      }));
      bgCircle.toBack();
    });

    const series = chart.series.push(window.am5percent.PieSeries.new(root, {
      alignLabels: false,
      calculateAggregates: true,
      valueField: 'value',
      categoryField: 'category',
    }));

    // --- IMPORTANT: Tell series to use 'fill' field for color ---
    series.slices.template.set('fillField', 'fill');

    series.slices.template.setAll({
      strokeWidth: 0, // Remove white borders to match Figma
      stroke: window.am5.color(0xffffff),
      cornerRadius: 0,
    });

    series.labels.template.setAll({
      fill: window.am5.color(0x1d1d85),
      radius: 15, // Push labels further out
      centerX: window.am5.p50,
      centerY: window.am5.p50,
      textAlign: 'center',
      text: '[fontWeight:600 fontSize:18px]{value}[/]\n[fontWeight:400 fontSize:12px]{category}[/]',
      oversizedBehavior: 'wrap', // Allow text to wrap
      maxWidth: 120,
    });

    series.ticks.template.setAll({
      stroke: window.am5.color(0x1d1d85),
      strokeOpacity: 0.3,
    });

    series.slices.template.adapters.add('radius', (radius, target) => {
      const { dataItem } = target;
      const high = series.getPrivate('valueHigh');
      if (dataItem) {
        const value = target.dataItem.get('valueWorking', 0);
        // Adjust the multiplier (e.g., 0.3 to 1.1) to tune the radius difference
        return radius * (0.3 + (0.8 * (value / high)));
      }
      return radius;
    });

    // --- COLOR PALETTE ---
    const colors = {
      black: window.am5.color(0x14143B),
      deepBlue: window.am5.color(0x1D1D85),
      mediumBlue: window.am5.color(0x4A5CFF),
      lightBlue: window.am5.color(0xA3BEFF),
    };

    // --- DATA WITH SPECIFIC COLORS ---
    series.data.setAll([
      // Top Right (Light Blues)
      { value: 21.03, category: 'IT - Software', fill: colors.lightBlue },
      { value: 14.97, category: 'IT - Software', fill: colors.lightBlue },

      // Right & Bottom-Right (Medium Blues)
      { value: 35, category: 'IT - Software', fill: colors.mediumBlue },
      { value: 82, category: 'IT - Software', fill: colors.mediumBlue },
      { value: 20, category: 'IT - Software', fill: colors.mediumBlue },
      { value: 56, category: 'IT - Software', fill: colors.mediumBlue },
      { value: 35, category: 'IT - Software', fill: colors.mediumBlue },

      // Bottom-Left (Deep Blue)
      { value: 35, category: 'IT - Software', fill: colors.deepBlue },

      // Left (Darkest Black/Blue)
      { value: 20, category: 'IT - Software', fill: colors.black },
      { value: 85, category: 'IT - Software', fill: colors.deepBlue },

      // Top-Left (Darkest Black/Blue)
      { value: 20, category: 'IT - Software', fill: colors.black },
      { value: 42, category: 'IT - Software', fill: colors.black },
    ]);

    series.appear(1000, 100);
  });
}
