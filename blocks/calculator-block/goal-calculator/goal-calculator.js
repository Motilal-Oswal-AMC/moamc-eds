import { div, form } from "../../../scripts/dom-helpers.js";
import {
  createBarSummaryBlock,
  createInputBlock,
  createOptionSelectorBlock,
  createRadioSelectorBlock,
  extractOptionsSelect,
} from "../common-ui-field/common-ui-field.js";

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
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "iwtra-inp-container",
    },
    variant: "number",
  });
  const sihBlock = createInputBlock({
    id: "rp-savings-amount",
    ...result.SIH,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "sih-inp-container",
    },
    variant: "number",
  });
  const erorBlock = createInputBlock({
    id: "rp-rate-of-return",
    ...result.EROR,
    fieldType: "year",
    suffixAttr: { class: "input-suffix" },
    variant: "number",
    inputBlockAttr: {
      class: "iwtra-inp-container",
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
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "iptbahb-inp-container",
    },
    variant: "number",
  });
  const bilaBlock = createInputBlock({
    id: "bah-target-amount",
    ...result.BILA,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "bila-inp-container",
    },
    variant: "number",
  });
  const bfaduBlock = createInputBlock({
    id: "bah-down-payment",
    ...result.BFADU,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "bfadu-inp-container",
    },
    variant: "number",
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
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "itpgb-inp-container",
    },
    variant: "number",
  });
  const bfttBlock = createInputBlock({
    id: "pat-target-amount",
    ...result.BFTT,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "bftt-inp-container",
    },
    variant: "number",
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
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "iwtbtcb-inp-container",
    },
    variant: "number",
  });
  const bfttBlock = createInputBlock({
    id: "bav-target-amount",
    ...result.BFTC,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "bftc-inp-container",
    },
    variant: "number",
  });
  const aftdBlock = createInputBlock({
    id: "bav-target-amount",
    ...result.AFTD,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "aftd-inp-container",
    },
    variant: "number",
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
    suffixAttr: { class: "input-suffix" },
    inputBlockAttr: {
      class: "iwtati-inp-container",
    },
    variant: "number",
  });

  const sihBlock = createInputBlock({
    id: "gc-savings-amount",
    ...result.SIH,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "sih-inp-container",
    },
    variant: "number",
  });

  const erorBlock = createInputBlock({
    id: "gc-rate-of-return",
    ...result.EROR,
    fieldType: "year",
    suffixAttr: { class: "input-suffix" },
    variant: "number",
    inputBlockAttr: {
      class: "iwtra-inp-container",
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

  const selector = createOptionSelectorBlock({
    id: "select-goal-type",
    label: goalSelectorTitle,
    options: goalOptions,
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
  handleGoalTypeChange(goalOptions[0]?.value, 0, block);
}
