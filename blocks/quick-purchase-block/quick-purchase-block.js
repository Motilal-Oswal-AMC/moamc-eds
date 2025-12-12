import {
  div,
  form,
  label,
  input,
  button,
  span,
  p,
  ul,
  li,
  a,
  img,
} from '../../scripts/dom-helpers.js';

export default function decoratePurchaseForm(block) {
  const generatedUrl = 'https://example.com/tdh/6sdhgd8';

  const purchaseForm = form(
    { class: 'purchase-form' },

    div(
      { class: 'form-group' },
      label({ for: 'scheme' }, 'Select Scheme'),

      div(
        { class: 'scheme-select-wrapper' },
        p({ class: 'selectedtext', "data-value":"All Funds (Mutual Fund + Index Fund)",}, 'All Funds (Mutual Fund + Index Fund)'),

        ul(
          { class: 'dropdown-list' },
          li(
            { class: 'returnyears', value: 'scheme_1' },
            'All Funds (Mutual Fund + Index Fund)',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL CONSUMPTION FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_3' },
            'MOTILAL OSWAL SPECIAL OPPORTUNITIES FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_4' },
            'MOTILAL OSWAL BSE 1000 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_5' },
            'MOTILAL OSWAL SERVICES FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL INFRASTRUCTURE FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL ACTIVE MOMENTUM FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL INNOVATION OPPORTUNITIES FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL ARBITRAGE FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL ARBITRAGE FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL ARBITRAGE FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY CAPITAL MARKET INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY MIDSMALL FINANCIAL SERVICES INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY MIDSMALL HEALTHCARE INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY MIDSMALL INDIA CONSUMPTION INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY MIDSMALL IT AND TELECOM INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL DIGITAL INDIA FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY 500 MOMENTUM 50 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL BUSINESS CYCLE FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL MANUFACTURING FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY INDIA DEFENCE INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL MULTI CAP FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL LARGE CAP FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL SMALL CAP FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY MICROCAP 250 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL BALANCE ADVANTAGE FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL EQUITY HYBRID FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL FOCUSED FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL LARGE AND MIDCAP FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL LIQUID FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL ELSS TAX SAVER FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL MIDCAP FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL MULTI ASSET FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL FLEXI CAP FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY 50 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY 500 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY BANK INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY MIDCAP 150 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY NEXT 50 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY SMALLCAP 250 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL ASSET ALLOCATION PASSIVE FUND OF FUND - AGGRESSIVE',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL ASSET ALLOCATION PASSIVE FUND OF FUND - CONSERVATIVE',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL 5 YEAR G-SEC FUND OF FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL GOLD AND SILVER ETFS FUND OF FUNDS',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL MSCI EAFE TOP 100 SELECT INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY 200 MOMENTUM 30 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL S&P BSE LOW VOLATILITY INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL S&P BSE FINANCIALS EX BANK 30 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL S&P BSE ENHANCED VALUE INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL S&P BSE QUALITY INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL ULTRA SHORT TERM FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL NIFTY G-SEC MAY 2029 INDEX FUND',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'MOTILAL OSWAL QUANT FUND',
          ),

        ),
      ),
    ),

    div(
      { class: 'form-group' },
      label({}, 'Transaction Type', span({ class: 'required' }, '*')),
      div(
        { class: 'transaction-types' },
        label(
          {},
          input({
            type: 'radio',
            name: 'transactionType',
            value: 'lumpsum',
            checked: true,
          }),
          ' Lumpsum',
        ),
        label(
          {},
          input({
            type: 'radio',
            name: 'transactionType',
            value: 'sip',
          }),
          ' SIP',
        ),
        label(
          {},
          input({
            type: 'radio',
            name: 'transactionType',
            value: 'both',
          }),
          ' Both',
        ),
      ),
    ),
    div(
      { class: 'select-option' },
      div(
        { class: 'select-schema-radio form-group' },
        label({ for: 'amount' }, 'Select Scheme'),
        input({
          type: 'text',
          id: 'amount',
          name: 'amount',
          placeholder: '₹ 70000',
          "data-type":"number",
          "maxlength":"10"
        }),
        span({ class: 'error-msg scheme-error' }, 'Please select a scheme'),
      ),

      div(
        { class: 'radio-section' },
        label({}, 'Select Option', span({ class: 'required' }, '*')),
        div(
          { class: 'select-radio' },
          label(
            {},
            input({
              type: 'radio',
              name: 'selectOption',
              value: 'distributor',
              checked: true,
            }),
            ' Distributor / Broker',
          ),
          label(
            {},
            input({
              type: 'radio',
              name: 'selectOption',
              value: 'ria',
            }),
            ' RIA',
          ),
        ),
      ),
    ),

    div(
      { class: 'grid' },
      div(
        { class: 'form-group' },
        label(
          { for: 'distributorArn' },
          'Distributor / Broker ARN Code',
          span({ class: 'required' }, '*'),
        ),
        input({
          type: 'text',
          id: 'distributorArn',
          name: 'distributorArn',
          placeholder: 'ARN Number',
          "data-type":"number",
          "maxlength":"15"
        }),
        span({ class: 'error-msg scheme-error'}, 'Please select a scheme'),
      ),
      div(
        { class: 'form-group' },
        label({ for: 'subDistributorArn' }, 'Sub-Distributor ARN Code'),
        input({
          type: 'text',
          id: 'subDistributorArn',
          name: 'subDistributorArn',
          placeholder: 'ARN Number',
          "data-type":"number",
          "maxlength":"6"
        }),
        span({ class: 'error-msg scheme-error' }, 'Please select a scheme'),
      ),
    ),

    div(
      { class: 'grid' },
      div(
        { class: 'form-group' },
        label(
          { for: 'employeeCode' },
          'Internal Sub Broker / Employee Code',
        ),
        input({
          type: 'text',
          id: 'employeeCode',
          name: 'employeeCode',
          placeholder: 'Employee Code',
          "data-type":"alpha",
          "maxlength":"10"
        }),
        span({ class: 'error-msg scheme-error'}, 'Please select a scheme'),
      ),
      div(
        { class: 'form-group' },
        label({ for: 'euin' }, 'EUIN No'),
        input({
          type: 'text',
          id: 'euin',
          name: 'euin',
          placeholder: 'E',
          "data-type":"number",
          "maxlength":"9"
        }),
        span({ class: 'error-msg scheme-error' }, 'Please select a scheme'),
      ),
    ),

    div(
      { class: 'form-actions' },
      button({ type: 'reset', class: 'btn-reset' }, 'Reset'),
      button({ type: 'submit', class: 'btn-submit' }, 'Generate Link'),
    ),

    div(
      { class: 'share-url-section' },

      p({ class: 'share-title' }, 'Share the generated campaign URL'),

      div(
        { class: 'share-url-box' },

        input({
          type: 'text',
          class: 'generated-url',
          value: generatedUrl,
          readonly: true,
        }),

        /* NEW WRAPPER FOR ICONS */
        div(
          { class: 'share-icons-wrapper' },

          a(
            { target: '_blank' },
            img({
              class: 'social-btn',
              src: '/icons/copyfdp.svg',
            }),
          ),

          a(
            { target: '_blank' },
            img({
              class: 'social-btn',
              src: '/icons/facebookfdp.svg',
            }),
          ),

          a(
            { target: '_blank' },
            img({
              class: 'social-btn',
              src: '/icons/whatsapp.svg',
            }),
          ),

          a(
            { target: '_blank' },
            img({
              class: 'social-btn',
              src: '/icons/Twitter.svg',
            }),
          ),
        ),
      ),
    ),
  );

  block.textContent = '';
  block.append(purchaseForm);

const wrapper = block.querySelector('.quick-purchase-block .purchase-form');
let amount = document.getElementById("amount");
let distributorArn = document.getElementById("distributorArn")
let employeeCode = document.getElementById("employeeCode");
let subDistributorArn = document.getElementById("subDistributorArn");
let euin = document.getElementById("euin");

wrapper.closest('form').addEventListener('submit', function (event) {
  event.preventDefault();
  let amountF = validateScheme();
  let distributerBrokerArn = validateDistributerBrokerArn();
  let internalSub_broker_empCode = validateInternalSub_broker_empCode();
  let subDistributorArnF = validatesubDistributorArn();
  let euinF = validateEuin();
  let valid = amountF && distributerBrokerArn && internalSub_broker_empCode && subDistributorArnF && euinF;
  if (valid) {
    console.log("valid");
    // Create object to send
    let selectedScheme = document.querySelector(".scheme-select-wrapper .selectedtext").getAttribute("data-value").trim();
    let transactionType = document.querySelector('input[name="transactionType"]:checked').value.trim();
    let selectedOption = document.querySelector('input[name="selectOption"]:checked').value.trim();
    const formData = {
      selectedScheme: selectedScheme,
      transactionType: transactionType,
      amount: amount.value.trim(),
      selectedOption: selectedOption,
      distributorArn: distributorArn.value.trim(),
      employeeCode: employeeCode.value.trim(),
      subDistributorArn: subDistributorArn.value.trim(),
      euin: euin.value.trim(),

    };

    // Fetch POST request
    fetch("https://example.com/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Server Response:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

  }
});

document.addEventListener('click', function (event) {
  const card = document.querySelector('.scheme-select-wrapper');
  const isInsideCard = card && card.contains(event.target);

  if (!isInsideCard) {
    document.querySelector(".dropdown-list").style.display = "none";
  }
});
document.querySelector(".purchase-form .btn-reset").addEventListener("click", function () {
  document.querySelectorAll("input[data-type]").forEach(function (ele) {
    ele.value = "";
    ele.closest(".form-group").querySelector(".error-msg").style.display = "none";
  });
  document.querySelector(".scheme-select-wrapper .selectedtext").innerText =
    document.querySelector(".scheme-select-wrapper .dropdown-list .returnyears:first-child").innerText.trim();
  document.querySelector('[name="transactionType"]').checked = true
  document.querySelector('[name="selectOption"]').checked = true
});

document.querySelectorAll("input[data-type]").forEach((input) => {
  input.addEventListener("keypress", function (e) {
    const type = this.dataset.type;
    const char = e.key;

    if (["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"].includes(char)) {
      return true;
    }

    // NUMBER ONLY
    if (type === "number" && !/^[0-9]$/.test(char)) {
      e.preventDefault();
      return false;
    }

    // ALPHABET ONLY
    if (type === "alpha" && !/^[A-Za-z]$/.test(char)) {
      e.preventDefault();
      return false;
    }
  });
});

amount.addEventListener("input", function () {
  validateScheme();
});

distributorArn.addEventListener("input", function () {
  validateDistributerBrokerArn();
});

employeeCode.addEventListener("input", function () {
  validateInternalSub_broker_empCode();
});

subDistributorArn.addEventListener("input", function () {
  validatesubDistributorArn();
});
euin.addEventListener("input", function () {
  validateEuin();
});

function count(ele) {
  const max = ele.getAttribute("maxlength");
  if (ele.value.length > max) {
    ele.value = ele.value.slice(0, max);
  }
}

function validateScheme() {
  let ele = document.getElementById("amount");
  count(ele);
  let val = ele.value.trim();
  let errorMsg = ele.closest(".form-group").querySelector(".error-msg");
  let message = "Amount should be greater than or equal to 500"
  if (val === "" || val < 500) {
    showError(errorMsg, message)
    return false;
  } else {
    hideError(errorMsg)
    return true;
  }
}

function validatesubDistributorArn() {
  let ele = document.getElementById("subDistributorArn");
  count(ele);
  let val = ele.value.trim();
  let errorMsg = ele.closest(".form-group").querySelector(".error-msg");
  let message = "Please enter ARN code"
  if (val === "") {
    showError(errorMsg, message)
    return false;
  } else {
    hideError(errorMsg)
    return true;
  }
}

function validateDistributerBrokerArn() {
  let ele = document.getElementById("distributorArn");
  count(ele);
  let val = ele.value.trim();
  let errorMsg = ele.closest(".form-group").querySelector(".error-msg");
  let message = "Error"
  if (val === "") {
    showError(errorMsg, message)
    return false;
  } else {
    hideError(errorMsg)
    return true;
  }
}

function validateInternalSub_broker_empCode() {
  let ele = document.getElementById("employeeCode");
  count(ele);
  let val = ele.value.trim();
  let errorMsg = ele.closest(".form-group").querySelector(".error-msg");
  let message = "Error"
  if (val === "") {
    showError(errorMsg, message)
    return false;
  } else {
    hideError(errorMsg)
    return true;
  }
}

function validateEuin() {
  let ele = document.getElementById("euin");
  count(ele);
  let val = ele.value.trim();
  let errorMsg = ele.closest(".form-group").querySelector(".error-msg");
  let message = "Error"
  if (val === "") {
    showError(errorMsg, message)
    return false;
  } else {
    hideError(errorMsg)
    return true;
  }
}
// ---------- HELPERS ----------
function showError(element, message) {
  element.innerText = message;
  element.style.display = "block";
}

function hideError(element) {
  element.innerText = "";
  element.style.display = "none";
}

if (purchaseForm !== null) {
  const wrapper = block.querySelector('.quick-purchase-block .scheme-select-wrapper');

  if (wrapper) {
    wrapper.addEventListener('click', (event) => {
      const dropdown = wrapper.querySelector('.dropdown-list');
      if (dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
      } else {
        dropdown.style.display = 'block';
      }
    });
  }
}
document.querySelectorAll(".purchase-form .dropdown-list .returnyears").forEach(function (element) {
  let elementVal = element;
  element.addEventListener("click", function (ele) {
    document.querySelector(".scheme-select-wrapper .selectedtext").innerText = elementVal.innerText.trim();
    document.querySelector(".scheme-select-wrapper .selectedtext").setAttribute("data-value", elementVal.getAttribute("value").trim())
  })
})

  return block;
}
