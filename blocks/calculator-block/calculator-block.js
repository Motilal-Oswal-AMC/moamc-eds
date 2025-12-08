import { div } from '../../scripts/dom-helpers.js';
import { loadCSS } from '../../scripts/aem.js';
import dataMapMoObj from '../../scripts/constant.js';
import fundBlock from '../fund-card/fund-card.js';
import {
  CALC_FILENAME_MAPPING,
  createSummaryCTA,
  getCardsPerRow,
} from './common-ui-field/common-ui-field.js';
import dataCfObj from '../../scripts/dataCfObj.js';

export default function decorate(block) {
  const MAIN_CONTAINER = block.parentElement.parentElement.parentElement;
  const CALCULATOR_GRAPH_CONTAINER = MAIN_CONTAINER.querySelector(
    '.calculator-graph-container',
  );
  // Configure prefixes and index the block
  dataMapMoObj.CLASS_PREFIXES = [
    'calc-author-main',
    'calc-author-sub',
    'calc-author-subitem',
  ];
  dataMapMoObj.addIndexed(block);

  if (CALCULATOR_GRAPH_CONTAINER) {
    dataMapMoObj.CLASS_PREFIXES = [
      'calc-graph-main',
      'calc-graph-item',
      'calc-graph-subitem',
    ];
    dataMapMoObj.addIndexed(CALCULATOR_GRAPH_CONTAINER);
    // calculator graph
    const CALC_GRAPH_BANNER = MAIN_CONTAINER.querySelector(
      '.calc-graph-item2 .calc-graph-subitem1',
    );
    dataMapMoObj.CLASS_PREFIXES = [
      'calc-graph-banner',
      'calc-graph-banner-item',
      'graph-banner-textcontainer',
      'graph-banner-textcontent',
    ];

    dataMapMoObj.addIndexed(CALC_GRAPH_BANNER);
    CALC_GRAPH_BANNER.querySelectorAll('.graph-banner-textcontent2 a').forEach(
      (ele) => ele.classList.add('link'),
    );

    dataMapMoObj.CLASS_PREFIXES = [
      'graph-banner-tags',
      'graph-banner-tag-item',
    ];
    dataMapMoObj.addIndexed(
      CALC_GRAPH_BANNER.querySelector('.graph-banner-textcontent3'),
    );
    CALC_GRAPH_BANNER.querySelector('.graph-banner-textcontent3 > ul');
  }

  // Calculator recommendations

  const CALC_RECOMMENDATIONS_CONTAINER = MAIN_CONTAINER.querySelector(
    '.calculators-recommendation-container',
  );
  const CALC_RECOMMENDATIONS_ITEMS = CALC_RECOMMENDATIONS_CONTAINER.querySelector('ul');

  const RECOMMENDED_GOAL_BANNER = CALC_RECOMMENDATIONS_CONTAINER.querySelectorAll('ul')[1];

  CALC_RECOMMENDATIONS_CONTAINER.querySelector('h2').classList.add(
    'calc-recommendation-title',
  );
  CALC_RECOMMENDATIONS_ITEMS.classList.add('calc-recommendation-list');
  CALC_RECOMMENDATIONS_ITEMS.querySelectorAll('li').forEach((item) => {
    item.classList.add('calc-recommendation-item');
    item.children[0].classList.add('calc-recommendation-icon');
    item.children[1].classList.add('calc-recommendation-title');
  });
  RECOMMENDED_GOAL_BANNER.classList.add('calc-recommended-goal-banner');
  const RECOMMENDED_GOAL_BANNER_ITEMS = CALC_RECOMMENDATIONS_CONTAINER.querySelectorAll(
    '.calc-recommended-goal-banner > li',
  );

  RECOMMENDED_GOAL_BANNER_ITEMS[0].classList.add('calc-recommended-goal-icon');
  RECOMMENDED_GOAL_BANNER_ITEMS[0]
    .querySelector('.calc-recommended-goal-icon > p')
    .classList.add('calc-recommended-goal-icon-container');
  RECOMMENDED_GOAL_BANNER_ITEMS[1].classList.add(
    'calc-recommended-goal-text-content',
  );
  RECOMMENDED_GOAL_BANNER_ITEMS[2].classList.add('calc-recommended-goal-cta');

  const SECTION_CONTAINER = block.parentElement.parentElement;
  const ALL_CALC_TITLE = SECTION_CONTAINER.querySelector(
    '.calculator-container > .default-content-wrapper',
  );

  const CALC_INSIGHT_N_DISCLAIMER = SECTION_CONTAINER.querySelector(
    '.calculator-container > .calculator-block-wrapper + .default-content-wrapper',
  );

  const CALC_INSIGHT = CALC_INSIGHT_N_DISCLAIMER.querySelector('ul:first-child');
  CALC_INSIGHT.classList.add('calculator-container_insight');

  ALL_CALC_TITLE.classList.add('calculator-container_title');
  dataMapMoObj.CLASS_PREFIXES = [
    'calculator-container-title-item',
    'calculator-container-title-subitem',
  ];

  dataMapMoObj.addIndexed(ALL_CALC_TITLE);

  // Get all top-level <li> elements inside the main <ul>
  const firstUL = ALL_CALC_TITLE.querySelector('ul'); // first <ul> inside the container
  const listItems = firstUL.querySelectorAll(' li'); // only direct children
  const ICON_IMG = listItems[0]?.querySelector('img');
  const NESTED_LIST = listItems[1]?.querySelector('ul');
  const BUTTON = ALL_CALC_TITLE?.querySelector(
    'ul > li > .button-container > a',
  );
  CALC_INSIGHT?.nextElementSibling?.classList?.add(
    'calculator-disclaimer-title',
  );
  CALC_INSIGHT?.nextElementSibling?.nextElementSibling?.classList?.add(
    'calculator-disclaimer-container',
  );

  CALC_INSIGHT.querySelectorAll('.calculator-disclaimer-container li').forEach(
    (ele) => ele.classList.add('calculator-disclaimer-desc'),
  );

  CALC_INSIGHT.querySelectorAll(':scope>li').forEach((ele) => ele.classList.add('insight-textcontent'));
  ICON_IMG.classList.add('calculator-container_title--icon');
  NESTED_LIST.classList.add('calculator-container-title-textcontent');
  BUTTON.classList.add('calculator-container-title-btn');
  const CALC_PATH_ARRAY = window.location.pathname.split('/');
  const CALC_TYPE = CALC_PATH_ARRAY[CALC_PATH_ARRAY.length - 1];

  const startInvestingBtn = createSummaryCTA({
    container: block.querySelector('.calc-author-main1'),
  });
  const CALC_SRC = CALC_FILENAME_MAPPING?.[CALC_TYPE];
  if (CALC_SRC) {
    (async () => {
      loadCSS(
        `${window.hlx.codeBasePath}/blocks/calculator-block/${CALC_SRC}/${CALC_SRC}.css`,
      );
      const mod = await import(
        `${window.hlx.codeBasePath}/blocks/calculator-block/${CALC_SRC}/${CALC_SRC}.js`
      );
      if (mod.default) {
        await mod.default(block);
      }
    })();
  }
  // QA container //

  const qaContainer = MAIN_CONTAINER.querySelector('.calculator-qa-container');
  // Add class 'question' to all h2 elements
  qaContainer
    .querySelectorAll('h2')
    .forEach((el) => el.classList.add('question'));

  // Add class 'answer-container' to all ul and ol elements
  qaContainer
    .querySelectorAll('ul, ol')
    .forEach((el) => el.classList.add('answer-container'));

  // Add class 'answer' to all p and li elements
  qaContainer
    .querySelectorAll('p, li')
    .forEach((el) => el.classList.add('answer'));

  // Add class 'pointer' to all <strong> elements inside <li>
  qaContainer
    .querySelectorAll('li strong')
    .forEach((el) => el.classList.add('pointer'));

  // Add class 'small-bold' to all <u> elements
  qaContainer
    .querySelectorAll('u')
    .forEach((el) => el.classList.add('small-bold'));

  // Add class 'small-bold' to all <i> elements
  qaContainer
    .querySelectorAll('em')
    .forEach((el) => el.classList.add('small-bold'));

  // Add class 'link' to all <a> elements
  qaContainer.querySelectorAll('a').forEach((el) => el.classList.add('link'));
  setTimeout(() => {
    const downloadAnalysisBtn = MAIN_CONTAINER.querySelector(
      '.calculator-container_title .button-container a',
    );

    if (downloadAnalysisBtn) {
      const STICKY_CONTAINER = div({
        class: 'calculator-sticky-cta-container',
      });

      // Clone downloadAnalysisBtn + copy inline onclick if present
      const clonedDownloadBtn = downloadAnalysisBtn.cloneNode(true);
      clonedDownloadBtn.onclick = downloadAnalysisBtn.onclick;
      STICKY_CONTAINER.appendChild(clonedDownloadBtn);
      STICKY_CONTAINER.appendChild(startInvestingBtn);

      MAIN_CONTAINER.appendChild(STICKY_CONTAINER);
    }
  }, 500);

  // Reccomended funds
  const RECOMMENDED_FUNDS = document.querySelector(
    '[data-id="recommended-funds-id"]',
  );
  if (RECOMMENDED_FUNDS) {
    const H_TAG_ELE = RECOMMENDED_FUNDS.querySelector('h1').cloneNode(true);
    const VIEW_FUND_CTA = RECOMMENDED_FUNDS.querySelector(
      '.button-container a',
    ).cloneNode(true);
    VIEW_FUND_CTA.classList.add('recommended-funds-cta');
    const RECOMMENDED_FUNDS_HEADER = div(
      { class: 'recommended-funds-header' },
      H_TAG_ELE,
      VIEW_FUND_CTA,
    );
    const FUNDS_CARDS_CONTAINER = div({ class: 'fund-cards-container' });
    RECOMMENDED_FUNDS.querySelector('.default-content-wrapper').innerHTML = '';

    RECOMMENDED_FUNDS.querySelector('.default-content-wrapper').append(
      RECOMMENDED_FUNDS_HEADER,
    );
    RECOMMENDED_FUNDS.querySelector('.default-content-wrapper').append(
      FUNDS_CARDS_CONTAINER,
    );
    RECOMMENDED_FUNDS.querySelector('.default-content-wrapper').append(
      VIEW_FUND_CTA.cloneNode(true),
    );

    dataCfObj.cfDataObjs
      .slice(0, getCardsPerRow({ padding: 0 }))
      .forEach((card) => {
        FUNDS_CARDS_CONTAINER.append(fundBlock(card));
      });
  }
  // const BREAD_CRUMB_CONTAINER =
  //   MAIN_CONTAINER.querySelector(".breadcrumbs-fdp");

  // if (BREAD_CRUMB_CONTAINER) {
  //   const breadcrumb = BREAD_CRUMB_CONTAINER;
  //   const sections = MAIN_CONTAINER.querySelectorAll(
  //     ".section:not(.breadcrumbs-fdp)"
  //   );

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           const bgColor = getComputedStyle(entry.target).backgroundColor;
  //           const brightness = getBrightness(bgColor);
  //           console.log("bgColor : ", bgColor);

  //           // ✔ Set the breadcrumb background to match the section
  //           breadcrumb.style.backgroundColor = bgColor;

  //           // ✔ Auto-adjust text color for readability
  //           // breadcrumb.style.color = brightness < 140 ? "#fff" : "#000";

  //           // (Optional) Apply a subtle shadow if background is light
  //           // breadcrumb.style.boxShadow =
  //           //   brightness > 160 ? "0 1px 4px rgba(0,0,0,0.2)" : "none";
  //         }
  //       });
  //     },
  //     { threshold: 0.5 }
  //   );

  //   sections.forEach((sec) => observer.observe(sec));

  //   function getBrightness(rgb) {
  //     const match = rgb.match(/(\d+),\s*(\d+),\s*(\d+)/);
  //     if (!match) return 255; // fallback: treat as light
  //     const [, r, g, b] = match.map(Number);
  //     return 0.299 * r + 0.587 * g + 0.114 * b;
  //   }
  // }
}
