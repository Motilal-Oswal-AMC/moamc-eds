/* eslint-disable */

// eslint-disable-next-line no-unused-vars
// import chartsData from './data.js';
// eslint-disable-next-line no-unused-vars
import * as am5 from '../../scripts/index.js';
// eslint-disable-next-line no-unused-vars
import * as am5xy from '../../scripts/xy.js';
// eslint-disable-next-line no-unused-vars
import * as am5percent from '../../scripts/percent.js';
// eslint-disable-next-line no-unused-vars, camelcase
import * as am5themes_Animated from '../../scripts/Animated.js';

import dataMapMoObj from '../../scripts/constant.js';


import {
  div, p, h2, span,
} from '../../scripts/dom-helpers.js';



window.am5.addLicense('AM5C-253273928');

export default function decorate(block) {
    console.log("abha")

    
   const bolckData = block.closest('.section.portfolio-composition');
   if(bolckData){
    dataMapMoObj.CLASS_PREFIXES = ['portfolio-com', 'portfolio-com-inner', 'portfolio-com-sub-inner','portfolio-com-sub-inner-sub'];
    dataMapMoObj.addIndexed(bolckData);
    const graphPanel = bolckData.querySelector('.tabpanel1 .portfolio-com-sub-inner-sub1');
    const grafData = bolckData.querySelector('.portfolio-com3');
    graphPanel.appendChild(grafData);

   }

      const graphDiv = div({ id: 'abha' });
  const middleContainer = div(
    { class: 'wrapnote' },
    graphDiv,
  );
  block.append(middleContainer);

window.am5.ready(function() {
var root = window.am5.Root.new("abha");
root.setThemes([
  window.am5themes_Animated.new(root)
]);

var chart = root.container.children.push(window.am5percent.PieChart.new(root, {
  layout: root.verticalLayout
}));

var series = chart.series.push(window.am5percent.PieSeries.new(root, {
  alignLabels: true,
  calculateAggregates: true,
  valueField: "value",
  categoryField: "category"
}));

series.slices.template.setAll({
  strokeWidth: 3,
  stroke: window.am5.color(0xffffff)
});

series.labelsContainer.set("paddingTop", 30)


series.slices.template.adapters.add("radius", function (radius, target) {
  var dataItem = target.dataItem;
  var high = series.getPrivate("valueHigh");

  if (dataItem) {
    var value = target.dataItem.get("valueWorking", 0);
    return radius * value / high
  }
  return radius;
});


series.data.setAll([{
  value: 10,
  category: "One"
}, {
  value: 9,
  category: "Two"
}, {
  value: 6,
  category: "Three"
}, {
  value: 5,
  category: "Four"
}, {
  value: 4,
  category: "Five"
}, {
  value: 3,
  category: "Six"
}]);

var legend = chart.children.push(window.am5.Legend.new(root, {
  centerX: window.am5.p50,
  x: window.am5.p50,
  marginTop: 15,
  marginBottom: 15
}));

// legend.data.setAll(series.dataItems);

series.appear(1000, 100);

}); 

}

