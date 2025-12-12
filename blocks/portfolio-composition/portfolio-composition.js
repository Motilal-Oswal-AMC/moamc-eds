


// // /* eslint-disable */

// // // eslint-disable-next-line no-unused-vars
// // import * as am5 from '../../scripts/index.js';
// // // eslint-disable-next-line no-unused-vars
// // import * as am5xy from '../../scripts/xy.js';
// // // eslint-disable-next-line no-unused-vars
// // import * as am5percent from '../../scripts/percent.js';
// // // eslint-disable-next-line no-unused-vars, camelcase
// // import * as am5themes_Animated from '../../scripts/Animated.js';

// // import dataMapMoObj from '../../scripts/constant.js';

// // import {
// //   div,
// //   p,
// //   h2,
// //   span,
// // } from '../../scripts/dom-helpers.js';

// // window.am5.addLicense('AM5C-253273928');

// // export default function decorate(block) {
// //   console.log("abha")

// //   const bolckData = block.closest('.section.portfolio-composition');
// //   if (bolckData) {
// //     dataMapMoObj.CLASS_PREFIXES = ['portfolio-com', 'portfolio-com-inner', 'portfolio-com-sub-inner', 'portfolio-com-sub-inner-sub'];
// //     dataMapMoObj.addIndexed(bolckData);
// //     const graphPanel = bolckData.querySelector('.tabpanel1 .portfolio-com-sub-inner-sub1');
// //     const grafData = bolckData.querySelector('.portfolio-com3');
// //     graphPanel.appendChild(grafData);
// //   }

// //   const graphDiv = div({
// //     id: 'abha'
// //   });
// //   const middleContainer = div({
// //       class: 'wrapnote'
// //     },
// //     graphDiv,
// //   );
// //   block.append(middleContainer);

// //   window.am5.ready(function() {
// //     var root = window.am5.Root.new("abha");
// //     root.setThemes([
// //       window.am5themes_Animated.new(root)
// //     ]);

// //     var chart = root.container.children.push(window.am5percent.PieChart.new(root, {
// //       layout: root.verticalLayout
// //     }));

// //     var series = chart.series.push(window.am5percent.PieSeries.new(root, {
// //       alignLabels: true,
// //       calculateAggregates: true,
// //       valueField: "value",
// //       categoryField: "category"
// //     }));

// //     series.slices.template.setAll({
// //       strokeWidth: 3,
// //       stroke: window.am5.color(0xffffff)
// //     });

// //     series.labelsContainer.set("paddingTop", 30)

// //     // ---------------------------------------------------------
// //     // 1. CHANGE SLICE LABELS TO BLUE
// //     // ---------------------------------------------------------
// //     series.labels.template.setAll({
// //       fill: window.am5.color(0x0000FF), // Blue color
// //       fontSize: 14
// //     });

// //     series.slices.template.adapters.add("radius", function(radius, target) {
// //       var dataItem = target.dataItem;
// //       var high = series.getPrivate("valueHigh");

// //       if (dataItem) {
// //         var value = target.dataItem.get("valueWorking", 0);
// //         return radius * value / high
// //       }
// //       return radius;
// //     });

// //     series.data.setAll([{
// //       value: 10,
// //       category: "One"
// //     }, {
// //       value: 9,
// //       category: "Two"
// //     }, {
// //       value: 6,
// //       category: "Three"
// //     }, {
// //       value: 5,
// //       category: "Four"
// //     }, {
// //       value: 4,
// //       category: "Five"
// //     }, {
// //       value: 3,
// //       category: "Six"
// //     }]);

// //     var legend = chart.children.push(window.am5.Legend.new(root, {
// //       centerX: window.am5.p50,
// //       x: window.am5.p50,
// //       marginTop: 15,
// //       marginBottom: 15
// //     }));

// //     // ---------------------------------------------------------
// //     // 2. CHANGE LEGEND TEXT TO BLUE
// //     // ---------------------------------------------------------
// //     legend.labels.template.setAll({
// //       fill: window.am5.color(0x0000FF), // Blue color
// //       fontSize: 14
// //     });

// //     // Also change values in legend (if displayed) to Blue
// //     legend.valueLabels.template.setAll({
// //       fill: window.am5.color(0x0000FF),
// //     });

// //     // Populate legend data
// //     legend.data.setAll(series.dataItems);

// //     series.appear(1000, 100);

// //   });
// // }



// // /* eslint-disable */

// // // eslint-disable-next-line no-unused-vars
// // import * as am5 from '../../scripts/index.js';
// // // eslint-disable-next-line no-unused-vars
// // import * as am5xy from '../../scripts/xy.js';
// // // eslint-disable-next-line no-unused-vars
// // import * as am5percent from '../../scripts/percent.js';
// // // eslint-disable-next-line no-unused-vars, camelcase
// // import * as am5themes_Animated from '../../scripts/Animated.js';

// // import dataMapMoObj from '../../scripts/constant.js';

// // import {
// //   div,
// //   p,
// //   h2,
// //   span,
// // } from '../../scripts/dom-helpers.js';

// // window.am5.addLicense('AM5C-253273928');

// // export default function decorate(block) {
// //   console.log("abha")

// //   const bolckData = block.closest('.section.portfolio-composition');
// //   if (bolckData) {
// //     dataMapMoObj.CLASS_PREFIXES = ['portfolio-com', 'portfolio-com-inner', 'portfolio-com-sub-inner', 'portfolio-com-sub-inner-sub'];
// //     dataMapMoObj.addIndexed(bolckData);
// //     const graphPanel = bolckData.querySelector('.tabpanel1 .portfolio-com-sub-inner-sub1');
// //     const grafData = bolckData.querySelector('.portfolio-com3');
// //     graphPanel.appendChild(grafData);
// //   }

// //   const graphDiv = div({
// //     id: 'abha'
// //   });
// //   const middleContainer = div({
// //       class: 'wrapnote'
// //     },
// //     graphDiv,
// //   );
// //   block.append(middleContainer);

// //   window.am5.ready(function() {
// //     var root = window.am5.Root.new("abha");
// //     root.setThemes([
// //       window.am5themes_Animated.new(root)
// //     ]);

// //     var chart = root.container.children.push(window.am5percent.PieChart.new(root, {
// //       layout: root.verticalLayout
// //     }));

// //     var series = chart.series.push(window.am5percent.PieSeries.new(root, {
// //       alignLabels: true,
// //       calculateAggregates: true,
// //       valueField: "value",
// //       categoryField: "category"
// //     }));

// //     series.slices.template.setAll({
// //       strokeWidth: 3,
// //       stroke: window.am5.color(0xffffff)
// //     });

// //     series.labelsContainer.set("paddingTop", 30)

// //     // ---------------------------------------------------------
// //     // WRAP TEXT AND STACK VALUE CONFIGURATION
// //     // ---------------------------------------------------------
// //     series.labels.template.setAll({
// //       fill: window.am5.color(0x0000FF), // Blue text
// //       fontSize: 14,

// //       // 1. Force the label content: Value on top (Bold/Big), Category below
// //       text: "[bold fontSize:24px]{value}[/]\n{category}",

// //       // 2. Enable Wrapping
// //       maxWidth: 110,         // Set a max width so it knows when to break the line
// //       oversizedBehavior: "wrap", // Forces the text to wrap if it exceeds maxWidth
// //       textAlign: "center",   // Centers the wrapped text

// //       // Optional: Background to help visualize the box (remove if not needed)
// //       // background: window.am5.RoundedRectangle.new(root, { fill: window.am5.color(0xeeeeee) }) 
// //     });

// //     series.slices.template.adapters.add("radius", function(radius, target) {
// //       var dataItem = target.dataItem;
// //       var high = series.getPrivate("valueHigh");

// //       if (dataItem) {
// //         var value = target.dataItem.get("valueWorking", 0);
// //         return radius * value / high
// //       }
// //       return radius;
// //     });

// //     // Updated data with longer text to test the wrapping
// //     series.data.setAll([{
// //       value: 82,
// //       category: "IT - Software" 
// //     }, {
// //       value: 98,
// //       category: "Two"
// //     }, {
// //       value: 60,
// //       category: "Three"
// //     }, {
// //       value: 53,
// //       category: "Four"
// //     }, {
// //       value: 41,
// //       category: "Five"
// //     }, {
// //       value: 78,
// //       category: "Six"
// //     },
// //   {
// //       value: 30,
// //       category: "7"
// //     },{
// //       value: 19,
// //       category: "8"
// //     },{
// //       value: 17,
// //       category: "9"
// //     },{
// //       value: 100,
// //       category: "10"
// //     },{
// //       value: 12,
// //       category: "11"
// //     },
// //   {
// //       value: 82,
// //       category: "12"
// //     },
// //   {
// //       value: 79,
// //       category: "13"
// //     },
// //   {
// //       value: 94,
// //       category: "14"
// //     },
// //   {
// //       value: 69,
// //       category: "15"
// //     },
// //   {
// //       value: 4,
// //       category: "16"
// //     }]);

// //     var legend = chart.children.push(window.am5.Legend.new(root, {
// //       centerX: window.am5.p50,
// //       x: window.am5.p50,
// //       marginTop: 15,
// //       marginBottom: 15
// //     }));

// //     legend.labels.template.setAll({
// //       fill: window.am5.color(0x0000FF),
// //       fontSize: 14
// //     });

// //     legend.valueLabels.template.setAll({
// //       fill: window.am5.color(0x0000FF),
// //     });

// //     // legend.data.setAll(series.dataItems);

// //     series.appear(1000, 100);

// //   });
// // }




// /* eslint-disable */

// // eslint-disable-next-line no-unused-vars
// import * as am5 from '../../scripts/index.js';
// // eslint-disable-next-line no-unused-vars
// import * as am5xy from '../../scripts/xy.js';
// // eslint-disable-next-line no-unused-vars
// import * as am5percent from '../../scripts/percent.js';
// // eslint-disable-next-line no-unused-vars, camelcase
// import * as am5themes_Animated from '../../scripts/Animated.js';

// import dataMapMoObj from '../../scripts/constant.js';

// import {
//   div,
//   p,
//   h2,
//   span,
// } from '../../scripts/dom-helpers.js';

// window.am5.addLicense('AM5C-253273928');

// export default function decorate(block) {
//   console.log("abha")

//   const bolckData = block.closest('.section.portfolio-composition');
//   if (bolckData) {
//     dataMapMoObj.CLASS_PREFIXES = ['portfolio-com', 'portfolio-com-inner', 'portfolio-com-sub-inner', 'portfolio-com-sub-inner-sub'];
//     dataMapMoObj.addIndexed(bolckData);
//     const graphPanel = bolckData.querySelector('.tabpanel1 .portfolio-com-sub-inner-sub1');
//     const grafData = bolckData.querySelector('.portfolio-com3');
//     graphPanel.appendChild(grafData);
//   }

//   const graphDiv = div({
//     id: 'abha'
//   });
//   const middleContainer = div({
//       class: 'wrapnote'
//     },
//     graphDiv,
//   );
//   block.append(middleContainer);

//   window.am5.ready(function() {
//     var root = window.am5.Root.new("abha");
//     root.setThemes([
//       window.am5themes_Animated.new(root)
//     ]);

//     var chart = root.container.children.push(window.am5percent.PieChart.new(root, {
//       layout: root.verticalLayout
//     }));

//     var series = chart.series.push(window.am5percent.PieSeries.new(root, {
//       // 1. DISABLE ALIGN LABELS (Puts them inside/near the slice)
//       alignLabels: false, 
//       calculateAggregates: true,
//       valueField: "value",
//       categoryField: "category"
//     }));

//     series.slices.template.setAll({
//       strokeWidth: 3,
//       stroke: window.am5.color(0xffffff)
//     });

//     // series.labelsContainer.set("paddingTop", 30) // No longer needed if labels are inside

//     // ---------------------------------------------------------
//     // LABELS INSIDE THE CIRCLE CONFIGURATION
//     // ---------------------------------------------------------
//     series.labels.template.setAll({
//       fill: window.am5.color(0x0000FF), // Blue text (Note: might be hard to read on dark slices)
//       fontSize: 14,

//       // Content: Value on top (Bold), Category below
//       text: "[bold fontSize:20px]{value}[/]\n{category}",

//       // 2. Position Inside
//       radius: window.am5.percent(-20), // Moves text 20% inwards from the edge
//       centerX: window.am5.p50,
//       centerY: window.am5.p50,
//       textAlign: "center",

//       // 3. Prevent Overlap/Clutter
//       // Since you have 16 slices, small slices cannot hold this much text.
//       // "hide" will remove labels that don't fit. "wrap" will try to force them.
//       oversizedBehavior: "hide", // or "fit"
//       maxWidth: 100
//     });

//     series.slices.template.adapters.add("radius", function(radius, target) {
//       var dataItem = target.dataItem;
//       var high = series.getPrivate("valueHigh");

//       if (dataItem) {
//         var value = target.dataItem.get("valueWorking", 0);
//         return radius * value / high
//       }
//       return radius;
//     });

//     series.data.setAll([{
//       value: 82,
//       category: "IT - Software" 
//     }, {
//       value: 98,
//       category: "Two"
//     }, {
//       value: 60,
//       category: "Three"
//     }, {
//       value: 53,
//       category: "Four"
//     }, {
//       value: 41,
//       category: "Five"
//     }, {
//       value: 78,
//       category: "Six"
//     }, {
//       value: 30,
//       category: "7"
//     }, {
//       value: 19,
//       category: "8"
//     }, {
//       value: 17,
//       category: "9"
//     }, {
//       value: 100,
//       category: "10"
//     }, {
//       value: 12,
//       category: "11"
//     }, {
//       value: 82,
//       category: "12"
//     }, {
//       value: 79,
//       category: "13"
//     }, {
//       value: 94,
//       category: "14"
//     }, {
//       value: 69,
//       category: "15"
//     }, {
//       value: 4,
//       category: "16"
//     }]);

//     var legend = chart.children.push(window.am5.Legend.new(root, {
//       centerX: window.am5.p50,
//       x: window.am5.p50,
//       marginTop: 15,
//       marginBottom: 15
//     }));

//     legend.labels.template.setAll({
//       fill: window.am5.color(0x0000FF),
//       fontSize: 14
//     });

//     legend.valueLabels.template.setAll({
//       fill: window.am5.color(0x0000FF),
//     });

//     // Uncomment this if you want the legend to appear
//     legend.data.setAll(series.dataItems);

//     series.appear(1000, 100);

//   });
// }




/* eslint-disable */
import * as am5 from '../../scripts/index.js';
import * as am5percent from '../../scripts/percent.js';
import * as am5themes_Animated from '../../scripts/Animated.js';
import { div } from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';

window.am5.addLicense('AM5C-253273928');

export default function decorate(block) {
  console.log("abha");

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

  window.am5.ready(function () {
    var root = window.am5.Root.new("abha");
    root.setThemes([window.am5themes_Animated.new(root)]);

    var chart = root.container.children.push(window.am5percent.PieChart.new(root, {
      layout: root.verticalLayout
    }));

    var series = chart.series.push(window.am5percent.PieSeries.new(root, {
      alignLabels: false, // Keep labels inside (or close to) the slice
      calculateAggregates: true,
      valueField: "value",
      categoryField: "category"
    }));

    series.slices.template.setAll({
      strokeWidth: 3,
      stroke: window.am5.color(0xffffff)
    });

    // ---------------------------------------------------------
    //  FIX OVERLAP AND SET FONT WEIGHTS (600 vs 400)
    // ---------------------------------------------------------
    series.labels.template.setAll({
      fill: window.am5.color(0x1d1d85), // Dark Blue color

      // 1. Position: Move text slightly closer to center
      radius: 5,
      centerX: window.am5.p50,
      centerY: window.am5.p50,
      textAlign: "center",

      // 2. Formatting: Value = 600 weight, Category = 400 weight
      // We use [] brackets to apply styles to specific parts of the string
      text: "[fontWeight:600 fontSize:24px]{value}[/]\n[fontWeight:400 fontSize:14px]{category}[/]",

      // 3. CLEAN UP: Hide labels that are too big for their slice
      oversizedBehavior: "hide",
      maxWidth: 90  // Restrict width to force wrapping or hiding
    });

    series.slices.template.adapters.add("radius", function (radius, target) {
      var dataItem = target.dataItem;
      var high = series.getPrivate("valueHigh");
      if (dataItem) {
        var value = target.dataItem.get("valueWorking", 0);
        return radius * value / high;
      }
      return radius;
    });

    series.data.setAll([
      { value: 21.03, category: "IT - Software" },
      { value: 14.97, category: "IT - Software" },
      { value: 14.97, category: "IT - Software" },
      { value: 35, category: "IT - Software" },
      { value: 82, category: "IT - Software" },
      { value: 20, category: "IT - Software" },
      { value: 56, category: "IT - Software" },
      { value: 35, category: "IT - Software" },
      { value: 35, category: "IT - Software" },
      { value: 85, category: "IT - Software" },
      { value: 20, category: "IT - Software" },
      { value: 42, category: "IT - Software" },

    ]);

    var legend = chart.children.push(window.am5.Legend.new(root, {
      centerX: window.am5.p50,
      x: window.am5.p50,
      marginTop: 15,
      marginBottom: 15
    }));

    legend.labels.template.setAll({
      fill: window.am5.color(0x1d1d85),
      fontSize: 14,
      fontWeight: "400"
    });

    legend.valueLabels.template.setAll({
      fill: window.am5.color(0x1d1d85),
      fontWeight: "600"
    });

    // legend.data.setAll(series.dataItems);

    series.appear(1000, 100);
  });
}