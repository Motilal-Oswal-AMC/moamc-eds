import dataMapMoObj from "../../../scripts/constant.js";
import dataCfObj from "../../../scripts/dataCfObj.js";
import {
  div,
  img,
  input,
  label,
  li,
  span,
  ul,
} from "../../../scripts/dom-helpers.js";
import {
  createBarSummaryBlock,
  createInputBlock,
  createOptionSelectorBlock,
  extractOptionsSelect,
  getAuthorData,
} from "../common-ui-field/common-ui-field.js";

dataMapMoObj.mode = "sip";
let planType = "Direct";
let planOption = "Growth";

function updatePlanOptions(fund, block) {
  const wrapper = block.querySelector(".custom-select-plan");
  const optionsContainer = wrapper.querySelector(".select-options-plan");
  const selectedDisplay = wrapper.querySelector(".select-selected-plan");
  const hiddenInput = wrapper.querySelector("#planOption");
  optionsContainer.innerHTML = "";

  if (!fund?.planList) return;

  const filteredPlans = fund.planList.filter((p) => p.planName === planType);
  const uniqueOptions = [...new Set(filteredPlans.map((p) => p.optionName))];

  uniqueOptions.forEach((name) => {
    const optionEl = div(
      { class: "select-option-plan", "data-value": name },
      name
    );
    optionEl.addEventListener("click", () => {
      debugger
      selectedDisplay.textContent = name;
      hiddenInput.value = name;
      planOption = name;
      optionsContainer.classList.remove("open");
      // updateReturnRate();
    });
    optionsContainer.append(optionEl);
  });

  if (uniqueOptions.length) {
    const defaultPlan = uniqueOptions.includes("Growth")
      ? "Growth"
      : uniqueOptions[0];
    selectedDisplay.textContent = defaultPlan;
    hiddenInput.value = defaultPlan;
    planOption = defaultPlan;
  }
}

function openPlanSelect(e, block) {
  e.stopPropagation();
  // block.querySelector(".select-options-plan")?.classList?.remove("open");
  block.querySelector(".select-options-plan")?.classList?.toggle("open");
}

export default function decorate(block) {
  const CALC_AUTHOR_MAIN = block.querySelector(".calc-author-main1");
  if (!CALC_AUTHOR_MAIN) {
    console.warn("No .calc-author-main1 element found.");
    return;
  }
  const schemeNames = dataCfObj.cfDataObjs.map(
    (fund) => fund.schDetail.schemeName
  );

  const authors = [
    { key: "SA", selector: ":scope > .calc-author-sub1" },
    { key: "ITP", selector: ":scope > .calc-author-sub2" },
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

  const sa = getAuthorData(CALC_AUTHORED_DATA, "SA");
  const itp = getAuthorData(CALC_AUTHORED_DATA, "ITP");

  const durationAuthorData = CALC_AUTHOR_MAIN.querySelector(
    ":scope > .calc-author-sub3"
  )?.children;
  const durationTitle = durationAuthorData[0]?.textContent;

  const durationOptions = extractOptionsSelect({
    listContainer: durationAuthorData[1]?.children,
  });

  const OVERVIEW_DATA = CALC_AUTHOR_MAIN.querySelector(
    ":scope > .calc-author-sub4"
  );

  const sipBlock = createBarSummaryBlock({
    container: OVERVIEW_DATA,
  });
  CALC_AUTHOR_MAIN.innerHTML = "";
  // let selectedFund = dataCfObj.find((fund) => fund.schcode === 'FM'); // CP
  const planCode = localStorage.getItem("planCode");
  let schcode;
  if (planCode !== null) {
    const schdata = planCode.split(":")[1];
    schcode = schdata;
  } else if (window.location.href.includes("/our-funds/funds-details-page")) {
    schcode = "LM";
  } else {
    const path = window.location.pathname.split("/").at(-1);
    const planobj = dataCfObj.cfDataObjs.filter(
      (el) =>
        path ===
        el.schDetail.schemeName.toLocaleLowerCase().split(" ").join("-")
    );
    schcode = planobj[0] !== undefined ? planobj[0].schcode : "LM";
  }
  let selectedFund = dataCfObj.cfDataObjs.find(
    (fund) => fund.schcode === schcode
  );

  let returnCAGR = 0;
  const selectedFundName = selectedFund.schDetail.schemeName;

  const schemeSelect = div(
    { class: "search-bar-wrapper" },
    label({ class: "search-bar-label" }, "Scheme"), // dynamic
    input({
      value: selectedFund.schDetail.schemeName,
      type: "text",
      placeholder: "Search a fund",
      id: "searchFundInput",
      role: "combobox",
      "aria-label": "Search for products",
      "aria-autocomplete": "list",
      "aria-expanded": "false",
      autocomplete: "off",
      class: "search-bar-inp",
    }),
    div(
      { class: "cancel-search-wrap searchbar-active" },
      img({
        class: "cancel-btn",
        src: "../../icons/input-cancel.svg",
        alt: "cancel button",
      }),
      img({
        class: "search-btn",
        src: "../../icons/search-blue.svg",
        alt: "cancel button",
      })
    ),
    div(
      { class: "search-results-wrapper" },
      ul(
        { id: "searchResults", role: "listbox", class: "search-result-ul" },
        li({ class: "search-result-li" }, "motilal oswal")
      )
    ),
    span({ class: "search-error error-hide" }, "Fund not found")
  );

  const togglerNidcw = div(
    { class: "spi-wrapper" },
    // 🔄 SIP & Lumpsum toggle

    // 🔀 Direct/Regular toggle & plan options
    div(
      { class: "plan-options-wrapper" },
      div(
        { class: "plan-type-toggle" },
        span({ class: "toggle-label active" }, "Direct"),
        label(
          {
            class: "toggle-switch",
            htmlFor: "planToggle",
            "aria-label": "Switch between Direct and Regular Plan",
          },
          input({
            type: "checkbox",
            id: "planToggle",
            class: "toggle-inp",
            "aria-label": "Switch between Direct and Regular Plan",
          }),
          span({ class: "slider" })
        ),
        span({ class: "toggle-label" }, "Regular")
      ),
      div(
        {
          class: "plan-option-select custom-select-plan",
          onclick: (e) => openPlanSelect(e, block),
        },
        div({ class: "select-selected-plan" }, "Growth"),
        div({ class: "select-options-plan" }),
        input({ type: "hidden", id: "planOption", value: "Growth" })
      )
    )
  );
  const saBlock = createInputBlock({
    id: "sip-amount",
    ...sa,
    prefix: "₹",
    fieldType: "currency",
    prefixAttr: { class: "currency-prefix" },
    inputBlockAttr: {
      class: "sa-inp-container",
    },
    variant: "number",
    onInput: (e) => {
      // recalculateSip({ sa: e.target.value, container: block });
    },
    onChange: (v) => {
      // recalculateSip({ sa: v, container: block });
    },
  });

  const itpBlock = createInputBlock({
    id: "invested-time-period",
    ...itp,
    inputBlockAttr: {
      class: "itp-inp-container",
    },
    fieldType: "year",
    suffix: itp?.default > 1 ? "years" : "year",
    variant: "stepper",
    updateWidthonChange: true,
    onInput: (e) => {
      // recalculateSip({ itp: e.target.value, container: block });
    },
    onChange: (v) => {
      // recalculateSip({ itp: v, container: block });
    },
  });

  const durationSelector = createOptionSelectorBlock({
    id: "compoundFrequency",
    label: durationTitle,
    options: durationOptions,
    onChange: (val) => {
      // recalculateCompoundInterest({ frequency: val, container: block });
    },
  });

  CALC_AUTHOR_MAIN.append(
    schemeSelect,
    togglerNidcw,
    saBlock,
    itpBlock,
    durationSelector
  );
  const searchInput = block.querySelector("#searchFundInput");
  const searchResults = block.querySelector("#searchResults");
  const searchWrapper = block.querySelector(".search-results-wrapper");

  let currentFocus = -1;
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    searchResults.innerHTML = "";
    currentFocus = -1;
    const filtered = query
      ? schemeNames.filter((name) => name.toLowerCase().includes(query))
      : schemeNames;

    // --- ADD THIS BLOCK ---
    // If no funds match the query, show the "not found" message
    if (filtered.length === 0) {
      // const errorLi = document.createElement('li');
      // errorLi.textContent = 'Fund not found';
      // searchResults.appendChild(errorLi);
      // calContainer.querySelector('.cancel-btn').style.display = 'block';
      calContainer
        .querySelector(".cancel-search-wrap")
        .classList.remove("searchbar-active");
      const searchError = document.querySelector(".search-error");
      searchError.classList.remove("error-hide");
      return; // Stop further execution
    }
    // --- END BLOCK ---

    filtered.forEach((name) => {
      const lione = document.createElement("li");
      lione.classList.add("searchli");
      lione.innerHTML = name.replace(
        new RegExp(`(${query})`, "gi"),
        "<strong>$1</strong>"
      );
      lione.addEventListener("click", () => {
        searchInput.value = name;
        // searchInput.style.backgroundPosition = 'left center';
        // searchInput.style.paddingLeft = '24px';
        selectedFund = dataCfObj.cfDataObjs.find(
          (f) => f.schDetail.schemeName === name
        );
        searchResults.innerHTML = "";
        updatePlanOptions(selectedFund, block);
        // updateReturnRate();
        // calContainer.querySelector('.cancel-btn').style.display = 'block';
        block
          .querySelector(".cancel-search-wrap")
          .classList.remove("searchbar-active");
      });
      searchResults.appendChild(lione);
    });
    searchWrapper.style.display = "block";
  });
  updatePlanOptions(selectedFund, block);

  // Tenure & Plan dropdowns
  // block.querySelector(".select-selected")?.addEventListener("click", (e) => {
  //   e.stopPropagation();
  //   block.querySelector(".select-options-plan").classList.remove("open");
  //   block.querySelector(".select-options").classList.toggle("open");
  // });

  // block
  //   .querySelector(".select-selected-plan")
  //   ?.addEventListener("click", (e) => {
  //     e.stopPropagation();
  //     block.querySelector(".select-options").classList.remove("open");
  //     block.querySelector(".select-options-plan").classList.toggle("open");
  //   });

  block.appendChild(sipBlock);
}
