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



import {
  div, p, h2, span,
} from '../../scripts/dom-helpers.js';



window.am5.addLicense('AM5C-253273928');

export default function decorate(block) {
    console.log("abha")

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


window.am5.ready(function() {
  var root = window.am5.Root.new("abha");

  root.setThemes([
    window.am5themes_Animated.new(root)
  ]);

  // 1. CHART SETUP
  // Added innerRadius to create the Donut shape
  var chart = root.container.children.push(window.am5percent.PieChart.new(root, {
    layout: root.verticalLayout,
    innerRadius: window.am5.percent(20) // Creates the hole in the middle
  }));

  // 2. SERIES SETUP
  var series = chart.series.push(window.am5percent.PieSeries.new(root, {
    alignLabels: true,
    calculateAggregates: true,
    valueField: "value",
    categoryField: "category"
  }));

  // 3. COLOR PALETTE (Matches Figma)
  // We define a specific set of colors to override the defaults
  series.get("colors").set("colors", [
    window.am5.color(0x111111), // Black/Dark
    window.am5.color(0x232388), // Dark Navy
    window.am5.color(0x3639c5), // Royal Blue
    window.am5.color(0x576dff), // Blue
    window.am5.color(0x8ba2ff), // Light Blue
    window.am5.color(0xc3d1ff), // Pale Blue
  ]);

  // 4. SLICE STYLING (Variable Radius)
  series.slices.template.setAll({
    strokeWidth: 2,
    stroke: window.am5.color(0xffffff),
    cornerRadius: 5 // Softens the edges slightly like Figma
  });

  // Keep your existing radius adapter
  series.slices.template.adapters.add("radius", function (radius, target) {
    var dataItem = target.dataItem;
    var high = series.getPrivate("valueHigh");

    if (dataItem) {
      var value = target.dataItem.get("valueWorking", 0);
      return radius * value / high;
    }
    return radius;
  });

  // 5. LABEL STYLING (The biggest visual change)
  series.labels.template.setAll({
    textType: "regular", // Ensures labels are outside
    paddingTop: 0,
    paddingBottom: 0,
    // This format creates: Big Bold Number (New Line) Smaller Category
    text: "[fontSize: 22px bold fill=#232388]{value}[/]\n[fontSize: 12px fill=#666666]{category}"
  });

  // 6. TICK (LINE) STYLING
  series.ticks.template.setAll({
    stroke: window.am5.color(0x232388), // Match the dark blue text
    strokeOpacity: 0.3,
    strokeWidth: 1
  });

  // 7. CENTER WHITE CIRCLE (Optional visual polish)
  // This places a white circle in the middle to cover the slice tips cleanly
//   var centerCircle = chart.plotContainer.children.push(window.am5.Circle.new(root, {
//     radius: 15, // Size of the white hole
//     fill: window.am5.color(0xffffff),
//     centerX: window.am5.p50,
//     centerY: window.am5.p50,
//     x: window.am5.p50,
//     y: window.am5.p50
//   }));


// ✅ USE THIS INSTEAD
var centerCircle = chart.seriesContainer.children.push(window.am5.Circle.new(root, {
  radius: 20, // Adjusted size to match Figma center hole better
  fill: window.am5.color(0xffffff),
  centerX: window.am5.p50,
  centerY: window.am5.p50,
  x: window.am5.p50,
  y: window.am5.p50
}));

  // 8. DATA
  series.data.setAll([{
    value: 85,
    category: "IT - Software"
  }, {
    value: 56,
    category: "IT - Software"
  }, {
    value: 35,
    category: "IT - Software"
  }, {
    value: 20,
    category: "IT - Software"
  }, {
    value: 42,
    category: "IT - Software"
  }, {
    value: 21,
    category: "IT - Software"
  }]);

  // If you want the Legend (Figma didn't clearly show one, but if you need it):
  /*
  var legend = chart.children.push(window.am5.Legend.new(root, {
    centerX: window.am5.p50,
    x: window.am5.p50,
    marginTop: 15,
    marginBottom: 15
  }));
  legend.data.setAll(series.dataItems);
  */

  series.appear(1000, 100);
});


}



// export default function decorate(block){


//       const graphDiv = div({ id: 'abha' });
//   const middleContainer = div(
//     { class: 'wrapnote' },
//     graphDiv,
//   );
//   block.append(middleContainer);


//    var root = window.am5.Root.new("abha");

   
// window.am5.ready(function() {
//      var root = window.am5.Root.new("abha");

// // Create root element
// // https://www.amcharts.com/docs/v5/getting-started/#Root_element
// var root = window.am5.Root.new("chartdiv");

// // Set themes
// // https://www.amcharts.com/docs/v5/concepts/themes/
// root.setThemes([
//   window.am5themes_Animated.new(root)
// ]);

// // Data
// // https://www.amcharts.com/docs/v5/charts/radar-chart/#Setting_data
// var data = [{
//   category: "One",
//   value1: 8,
//   value2: 2
// }, {
//   category: "Two",
//   value1: 11,
//   value2: 4
// }, {
//   category: "Three",
//   value1: 7,
//   value2: 6
// }, {
//   category: "Four",
//   value1: 13,
//   value2: 8
// }, {
//   category: "Five",
//   value1: 12,
//   value2: 10
// }, {
//   category: "Six",
//   value1: 15,
//   value2: 12
// }, {
//   category: "Seven",
//   value1: 9,
//   value2: 14
// }, {
//   category: "Eight",
//   value1: 6,
//   value2: 16
// }];

// // Create chart
// // https://www.amcharts.com/docs/v5/charts/radar-chart/
// var chart = root.container.children.push(
//   window.am5radar.RadarChart.new(root, {
//     panX: false,
//     panY: false,
//     wheelX: "panX",
//     wheelY: "zoomX"
//   })
// );

// // Add cursor
// // https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor
// var cursor = chart.set("cursor", window.am5radar.RadarCursor.new(root, {
//   behavior: "zoomX"
// }));

// cursor.lineY.set("visible", false);

// // Create axes and their renderers
// // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_axes
// var xRenderer = window.am5radar.AxisRendererCircular.new(root, {
//   cellStartLocation: 0.2,
//   cellEndLocation: 0.8
// });

// xRenderer.labels.template.setAll({
//   radius: 10
// });

// var xAxis = chart.xAxes.push(
//   window.am5xy.CategoryAxis.new(root, {
//     maxDeviation: 0,
//     categoryField: "category",
//     renderer: xRenderer,
//     tooltip: am5.Tooltip.new(root, {})
//   })
// );

// xAxis.data.setAll(data);

// var yAxis = chart.yAxes.push(
//   window.am5xy.ValueAxis.new(root, {
//     renderer: window.am5radar.AxisRendererRadial.new(root, {})
//   })
// );

// // Create series
// // https://www.amcharts.com/docs/v5/charts/radar-chart/#Adding_series
// for (var i = 1; i <= 2; i++) {
//   var series = chart.series.push(
//     window.am5radar.RadarColumnSeries.new(root, {
//       name: "Series " + i,
//       xAxis: xAxis,
//       yAxis: yAxis,
//       valueYField: "value" + i,
//       categoryXField: "category"
//     })
//   );

//   series.columns.template.setAll({
//     tooltipText: "{name}: {valueY}",
//     width: window.am5.percent(100)
//   });

//   series.data.setAll(data);
  
//   series.appear(1000);
// }

// // Add scrollbars
// chart.set("scrollbarX", window.am5.Scrollbar.new(root, { orientation: "horizontal", exportable: false }));
// chart.set("scrollbarY", window.am5.Scrollbar.new(root, { orientation: "vertical", exportable: false }));


// // Animate chart
// // https://www.amcharts.com/docs/v5/concepts/animations/#Initial_animation
// chart.appear(1000, 100);

// }); // end am5.ready()

// }

