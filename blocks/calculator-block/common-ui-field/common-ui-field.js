import dataMapMoObj from '../../../scripts/constant.js';
import {
  div,
  label,
  input,
  span,
  button,
} from '../../../scripts/dom-helpers.js';

/**
 * Validate, clamp and format an input with event-driven error styling.
 *
 * @param {Object} config
 * @param {Event} config.event - Input or change event
 * @param {number|string} config.min - Minimum allowed value
 * @param {number|string} config.max - Maximum allowed value
 * @param {boolean} [config.currency=false] - Format value as currency
 * @param {string} [config.currencyCode="INR"]
 * @param {string} [config.locale="en-IN"]
 * @param {boolean} [config.ignoreMin=false] - Skip min clamping, return value as-is
 *
 * @returns {{
 *   finalValue: string|number,
 *   numeric: number,
 *   isError: boolean,
 *   errorType: null|"NOT_A_NUMBER"|"MIN_EMPTY"|"ABOVE_MAX"
 * }}
 */

export function validateInputWithEvent({
  event,
  min,
  max,
  currency = false,
  currencyCode = 'INR',
  locale = 'en-IN',
  ignoreMin = false,
  allowEmpty = false,
  eventType = '',
}) {
  const inputEl = event.target;
  const rawValue = (inputEl.value || '').toString().trim();
  const minValue = Number(min);
  const maxValue = Number(max);
  let errorType = null;

  // Normalize numeric text
  const normalized = rawValue.replace(/,/g, '').replace(/[^\d.-]/g, '');
  let num = Number(normalized);

  // INVALID number
  if (normalized === '' || Number.isNaN(num)) {
    num = 0;
    errorType = 'NOT_A_NUMBER';
  }

  // MIN logic
  if (ignoreMin) {
    if (minValue === '' || (minValue !== 0 && num < minValue)) {
      errorType = 'MIN_EMPTY';
    }
  } else if (minValue !== '' && num < minValue) {
    num = minValue;
    errorType = 'MIN_EMPTY';
  }

  // MAX logic
  if (maxValue !== '' && num > maxValue) {
    num = maxValue;
    // errorType = "ABOVE_MAX";
  }

  // Toggle error class
  if (errorType) inputEl.classList.add('calc-error');
  else inputEl.classList.remove('calc-error');

  // Decide finalValue
  // debugger;
  let finalValue;

  if (currency) {
    if (num !== 0) {
      finalValue = dataMapMoObj.formatNumber({ value: num, currencyCode, locale });
    } else if (minValue === 0 && eventType === 'blur') {
      finalValue = 0;
    } else {
      finalValue = '';
    }
  } else if (rawValue === '' && allowEmpty) {
    finalValue = rawValue;
  } else {
    finalValue = num;
  }

  // Update input
  if (currency) {
    // Find fake input if it exists
    const hiddenInputEl = document.getElementById(
      `${inputEl.id?.replace('-fake', '')}`,
    );
    if (hiddenInputEl) {
      hiddenInputEl.value = num; // update numeric value in hidden input
      inputEl.value = finalValue; // update formatted currency
    } else {
      inputEl.value = finalValue; // fallback to original input
    }
  } else {
    inputEl.value = finalValue;
  }

  return {
    finalValue,
    numeric: num,
    isError: Boolean(errorType),
    errorType,
  };
}

/**
 * Format a number as currency or decimal with flexible options
 * @param {Object} options
 * @param {number|string} options.value - Number to format
 * @param {boolean} [options.currency=false] - Whether to format as currency
 * @param {string} [options.currencyCode='USD'] - Currency code if currency=true
 * @param {number} [options.minimumFractionDigits=0] - Minimum fraction digits
 * @param {number} [options.maximumFractionDigits=0] - Maximum fraction digits
 * @param {string} [options.locale='en-US'] - Locale for formatting
 * @param {boolean} [options.useGrouping=true] - Use thousand separators
 * @returns {string} Formatted number string
 */
export function formatNumber({
  value,
  currency = false,
  currencyCode = 'INR',
  minimumFractionDigits = 0,
  maximumFractionDigits = 0,
  locale = 'en-IN',
  useGrouping = true,
}) {
  if (value === null || value === '') return '';
  const num = Number(value);
  if (Number?.isNaN(num)) return '';

  return num.toLocaleString(locale, {
    style: currency ? 'currency' : 'decimal',
    currency: currency ? currencyCode : undefined,
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping,
  });
}
dataMapMoObj.formatNumber = formatNumber;

/**
 * Derive input width in `ch` based on its value length
 * @param {string|number} value - The value of the input
 * @param {number} [minChars=1] - Minimum width in ch
 * @param {number} [extraChars=0] - Extra padding in ch
 * @returns {string} width in ch units
 */
export function getInputWidth(value, minChars = 1, extraChars = 0) {
  const str = value != null ? String(value) : '';
  const { length } = str;
  const widthCh = Math.max(length + extraChars, minChars);
  return `${widthCh}ch`;
}

function formatCurrency(val) {
  if (!val) return '';
  return Number(val.replace(/,/g, '')).toLocaleString('en-IN');
}

export const updateInputSuffix = (ele) => {
  const suffixEle = ele?.target?.parentElement?.querySelector('.calc-inline-suffix')
    || ele?.parentElement?.querySelector('.calc-inline-suffix');
  const fieldType = ele?.target?.getAttribute?.('data-fieldType')
    || ele?.getAttribute?.('data-fieldType');
  const inputValue = ele?.value || ele?.target?.value || 0;
  if (suffixEle && fieldType) {
    if (fieldType === 'year') {
      suffixEle.textContent = Number(inputValue) <= 1 ? 'Year' : 'Years';
    }
  }
};

/**
 * Updates the input value and disables/enables the increment/decrement buttons based on min/max
 * @param {HTMLInputElement} inputEl - The input element
 */
function updateStepperButtons(inputEl, inputValue) {
  if (!inputEl) return;
  // debugger;
  const wrapper = inputEl.closest('.calc-input-wrapper.stepper');
  if (!wrapper) return;
  const input = wrapper.querySelector('.calc-input');
  const decBtn = wrapper.querySelector('.dec-btn');
  const incBtn = wrapper.querySelector('.inc-btn');

  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || Infinity;
  // const value = parseFloat(input.value) || 0;

  // Update disabled state
  if (decBtn) decBtn.disabled = inputValue <= min;
  if (incBtn) incBtn.disabled = inputValue >= max;
}

/**
 * Create an input block UI for calculator fields (SIP, ROI, etc.)
 * @param {Object} config
 * @param {string} config.id - Unique ID for the input
 * @param {string} config.label - Label text
 * @param {string|number} config.default - Default value
 * @param {string|number} [config.min] - Minimum value
 * @param {string|number} [config.max] - Maximum value
 * @param {string} [config.prefix] - Optional prefix (e.g., ₹)
 * @param {string} [config.suffix] - Optional suffix (e.g., %, years)
 * @param {string} [config.variant='text'] - 'text' | 'number' | 'stepper'
 * @param {Function} [config.onChange] - Input change handler
 * @returns {HTMLElement} DOM block
 */
export function createInputBlock({
  id,
  label: labelText,
  default: defVal = '',
  fieldType,
  min,
  max,
  prefix = '',
  prefixAttr = {},
  suffix = '',
  suffixAttr = {},
  inputBlockAttr = {},
  variant = 'text',
  onChange = () => {},
  updateWidthonChange = false,
  noLimit = false,
  ignoreMin = false,
  ...rest
}) {
  const FIELD_TYPE_MAPPING = {
    year:
      variant === 'stepper'
        ? {
          min: `${min} ${Number(min) === 1 ? 'year' : 'years'}`,
          max: `${max} years`,
        }
        : {
          min: `Min. ${min}`,
          max: `Max. ${max}`,
        },
    currency: {
      min: `Min. ${formatNumber({
        value: min,
        currency: true,
      })}`,
      max: `Max. ${formatNumber({
        value: max,
        currency: true,
      })}`,
    },
    percent: { min: `Min. ${min}%`, max: `Max. ${max}%` },
  };
  const MIN_MAX_INFO = FIELD_TYPE_MAPPING?.[fieldType] || {
    min: `Min. ${min}`,
    max: `Max. ${max}`,
  };

  // ---------- Base Input ----------
  const inputAttrs = {
    id,
    class: 'calc-input',
    value:
      fieldType === 'currency'
        ? formatNumber({
          value: defVal,
        })
        : defVal,
    type:
      fieldType === 'currency'
        ? 'text'
        : variant === 'text'
          ? 'text'
          : 'number',
    min,
    max,
    'data-fieldType': fieldType,
    ...(['currency', 'percent', 'year'].includes(fieldType)
      ? {
        inputmode: 'numeric',
      }
      : {}),
    onchange: (e) => {
      let filteredValue = e.target.value;
      // onChange(e?.target?.value);
      if (fieldType === 'currency') {
        filteredValue = filteredValue ? filteredValue.replace(/,/g, '') : '';
        filteredValue = filteredValue?.replace(/[^\d]/g, ''); // allow only digits
      }
      updateInputSuffix(e);
    },
    oninput: (e) => {
      let filteredValue = e.target.value;
      // onChange(e?.target?.value);
      if (fieldType === 'currency') {
        e.target.value = formatNumber({
          value: e.target.value,
        });
        filteredValue = filteredValue ? filteredValue.replace(/,/g, '') : '';
        filteredValue = filteredValue?.replace(/[^\d]/g, ''); // allow only digits
      }

      updateInputSuffix(e);
      if (updateWidthonChange) {
        e.target.style.setProperty(
          '--input-ch-width',
          `${getInputWidth(filteredValue)}`,
        );
      }
      if (
        !noLimit
        && ['stepper', 'number'].includes(variant)
        && fieldType !== 'currency'
      ) {
        // debugger;
        const { numeric, finalValue } = validateInputWithEvent({
          event: e,
          min,
          max,
          currency: fieldType === 'currency',
          currencyCode: 'INR',
          locale: 'en-IN',
          ignoreMin,
          allowEmpty: true,
        });
        e.target.value = ignoreMin ? finalValue : numeric;
        if (variant === 'stepper') {
          updateStepperButtons(e.target, numeric);
        }
      }
      rest?.onInput?.(e);
    },
    onblur: (e) => {
      const hasError = e.target.classList.contains('calc-error');
      // debugger;
      if (hasError && ignoreMin) {
        const { numeric } = validateInputWithEvent({
          event: e,
          min,
          max,
          currency: fieldType === 'currency',
          currencyCode: 'INR',
          locale: 'en-IN',
          ignoreMin: false,
          allowEmpty: false,
          eventType: 'blur',
        });
        e.target.classList.remove('calc-error');
        if (variant === 'stepper') {
          updateStepperButtons(e.target, numeric);
        }
        onChange(numeric);
        if (suffix) {
          updateInputSuffix(e);
        }
      }
      rest?.onBlur?.(e);
    },
    ...rest,
  };
  let inputEl;
  if (fieldType === 'currency') {
    // Hidden input (original ID)
    const hiddenInput = input({
      ...rest,
      id,
      type: 'hidden',
      class: 'calc-input-hidden',
      value: defVal,
    });

    // Visible (fake) input with formatted value
    const fakeInput = input({
      ...rest,
      id: `${id}-fake`,
      type: 'text',
      class: 'calc-input',
      'data-fieldType': fieldType,
      value: formatNumber({ value: defVal }),
    });

    // SYNC: fake → hidden
    fakeInput.addEventListener('blur', (e) => {
      const result = validateInputWithEvent({
        event: e,
        min,
        max,
        currency: fieldType === 'currency',
        currencyCode: 'INR',
        locale: 'en-IN',
        ignoreMin: false,
        allowEmpty: false,
        eventType: 'blur',
      });
      const { numeric: num } = result;

      // fire onInput with RAW numeric
      rest?.onBlur?.({
        ...e,
        target: { ...hiddenInput, value: String(num) },
      });

      if (ignoreMin) {
        e.target.classList.remove('calc-error');
        onChange(num);
      }

      updateInputSuffix(e);
    });
    fakeInput.addEventListener('input', (e) => {
      const result = validateInputWithEvent({
        event: e,
        min,
        max,
        currency: fieldType === 'currency',
        currencyCode: 'INR',
        locale: 'en-IN',
        ignoreMin,
        allowEmpty: false,
      });
      const { numeric: num, finalValue } = result;
      // update hidden input
      hiddenInput.value = num;

      // update visible formatted UI
      fakeInput.value = finalValue;

      // fire onInput with RAW numeric
      rest?.onInput?.({
        ...e,
        target: { ...hiddenInput, value: String(num) },
      });

      updateInputSuffix(e);
    });

    fakeInput.addEventListener('change', (e) => {
      onChange(Number(hiddenInput.value));
    });

    // inputEl must contain both inputs (hidden + visible)
    inputEl = div(
      { class: 'currency-dual-input-wrapper' },
      fakeInput,
      hiddenInput,
    );
  } else {
    inputEl = input(inputAttrs);
  }

  if (updateWidthonChange) {
    inputEl.style.setProperty('--input-ch-width', getInputWidth(inputEl.value));
  }
  // ---------- Label ----------
  const labelEl = label(
    { for: fieldType === 'currency' ? `${id}-fake` : id, class: 'calc-label' },
    labelText,
  );

  // ---------- Build input wrapper ----------
  const children = [];

  // Prefix
  if (prefix) {
    const prefixEl = span(
      { ...prefixAttr, class: `calc-prefix ${prefixAttr?.class || ''}` },
      prefix,
    );
    children.push(prefixEl);
  }

  // ---------- Input with inline suffix wrapper ----------
  let innerInputWrapper;

  if (suffix) {
    const inlineSuffix = span(
      { ...suffixAttr, class: `calc-inline-suffix ${suffixAttr?.class || ''}` },
      suffix,
    );
    // Wrap input and suffix together
    innerInputWrapper = div(
      { class: 'calc-inner-input-wrapper' },
      inputEl,
      inlineSuffix,
    );
  } else {
    innerInputWrapper = inputEl;
  }

  // Stepper buttons
  if (variant === 'stepper') {
    const disableBtn = {
      min: Number(defVal) <= Number(min), // true if decrement should be disabled
      max: Number(defVal) >= Number(max), // true if increment should be disabled
    };

    const decBtn = button(
      {
        class: 'calc-btn dec-btn',
        type: 'button',
        'aria-label': 'decrease-btn',
        ...(disableBtn.min && { disabled: true }), // only add disabled if condition is true
      },
      '',
    );

    const incBtn = button(
      {
        class: 'calc-btn inc-btn',
        type: 'button',
        'aria-label': 'increase-btn',
        ...(disableBtn.max && { disabled: true }), // only add disabled if condition is true
      },
      '',
    );

    decBtn.addEventListener('click', () => {
      const current = parseFloat(inputEl.value) || 0;
      const newVal = noLimit
        ? current - 1
        : Math.max(Number(min) || 0, current - 1);

      updateStepperButtons(inputEl, newVal);
      inputEl.value = newVal;
      updateInputSuffix(inputEl);
      onChange(newVal);
      if (updateWidthonChange) {
        inputEl?.style?.setProperty(
          '--input-ch-width',
          `${getInputWidth(inputEl?.value)}`,
        );
      }
    });

    incBtn.addEventListener('click', () => {
      const current = parseFloat(inputEl.value) || 0;
      const newVal = noLimit
        ? current + 1
        : Math.min(Number(max) || current + 1, current + 1);

      updateStepperButtons(inputEl, newVal);
      inputEl.value = newVal;
      updateInputSuffix(inputEl);
      onChange(newVal);
      if (updateWidthonChange) {
        inputEl?.style?.setProperty(
          '--input-ch-width',
          `${getInputWidth(inputEl?.value)}`,
        );
      }
    });

    children.push(decBtn, innerInputWrapper, incBtn);
  } else {
    // Regular input
    children.push(innerInputWrapper);
  }

  // ---------- Input Wrapper ----------
  const inputWrap = div(
    { class: `calc-input-wrapper ${variant}` },
    ...children,
  );

  // ---------- Min/Max info ----------
  const minMaxRow = noLimit
    ? ''
    : div(
      { class: 'calc-limits' },
      min ? span({ class: 'calc-min' }, MIN_MAX_INFO?.min) : null,
      max ? span({ class: 'calc-max' }, MIN_MAX_INFO?.max) : null,
    );

  // ---------- Full Block ----------
  const block = div(
    {
      ...inputBlockAttr,
      class: `calc-input-block variant-${variant} ${
        inputBlockAttr?.class || ''
      }`,
    },
    labelEl,
    inputWrap,
    minMaxRow,
  );

  return block;
}

/**
 * Create a radio selector block
 * @param {Object} config
 * @param {string} config.id – Unique ID for the selector
 * @param {string} config.title – Label text above radios
 * @param {Array<{label:string, value:string}>} config.options – Radio options
 * @param {string} [config.default] – Default selected value
 * @param {Function} [config.onChange] – Callback when selection changes
 * @param {Object} [config.blockAttr={}] – Additional attributes for container
 * @returns {HTMLElement} DOM block
 */
export function createRadioSelectorBlock({
  id,
  title = 'Select',
  options = [],
  default: defVal = options?.[0]?.value || '',
  onChange = () => {},
  blockAttr = {},
} = {}) {
  console.log('default : ', defVal);

  // ---------- Title Label ----------
  const titleEl = label({ for: id, class: 'calc-radio-title' }, title);

  // ---------- Hidden Input (mirrors selected radio) ----------
  const hiddenInput = input({
    type: 'hidden',
    id,
    name: id,
    value: defVal,
    class: 'calc-radio-hidden-input',
  });

  // ---------- Radio Buttons ----------
  const radios = options.map(({ label: text, value }) => {
    const wrapper = div({ class: 'calc-radio-item' });

    const radio = input({
      type: 'radio',
      name: `${id}-radio`,
      id: `${id}-radio-${value}`,
      value,
      checked: value === defVal,
      class: 'calc-radio-input',
    });

    radio.addEventListener('change', () => {
      hiddenInput.value = value;
      onChange(value);
    });

    const radioLabel = label(
      { class: 'calc-radio-label', for: `${id}-radio-${value}` },
      text,
    );

    wrapper.append(radio, radioLabel);
    return wrapper;
  });

  // ---------- Parent Wrapper for All Radio Items ----------
  const itemsWrap = div({ class: 'calc-radio-items' }, ...radios);

  // ---------- Outer Block Wrapper ----------
  const block = div(
    {
      ...blockAttr,
      class: `calc-radio-selector ${blockAttr?.class || ''}`,
    },
    titleEl,
    hiddenInput,
    itemsWrap,
  );

  return block;
}

/**
 * Create an option selector block (e.g., for selecting frequency, mode, etc.)
 * @param {Object} config
 * @param {string} config.id – Unique ID for the selector
 * @param {string} config.label – Label text
 * @param {Array<{label:string, value:string}>} config.options – Array of options
 * @param {string} [config.default] – Default selected value (must match one of option values)
 * @param {Function} [config.onChange] – Callback when selection changes
 * @param {Object} [config.blockAttr={}] – Additional attributes for the outer block
 * @returns {HTMLElement} DOM block
 */
export function createOptionSelectorBlock({
  id,
  label: labelText = 'Label',
  options = [],
  default: defVal = options?.[0]?.value || '',
  onChange = () => {},
  blockAttr = {},
} = {}) {
  // ---------- Label ----------
  const labelEl = label({ for: id, class: 'calc-selector-label' }, labelText);

  // ---------- Hidden Input (always included) ----------
  const hiddenInput = input({
    type: 'hidden',
    id,
    name: id,
    value: defVal,
    class: 'calc-selector-input',
  });

  // ---------- Buttons for options ----------
  const buttons = options.map(({ label: text, value }, index) => {
    const btn = button(
      {
        type: 'button',
        class: `calc-selector-btn${
          value === defVal ? ' calc-selector-btn-active' : ''
        }`,
        'data-value': value,
      },
      text,
    );

    btn.addEventListener('click', () => {
      // Remove active state from all buttons
      buttons.forEach((b) => b.classList.remove('calc-selector-btn-active'));
      // Set active state to current button
      btn.classList.add('calc-selector-btn-active');
      // Update hidden input value
      hiddenInput.value = value;
      // Trigger callback
      onChange(value, index);
    });

    return btn;
  });

  // ---------- Wrapper for buttons ----------
  const optionsWrap = div({ class: 'calc-selector-options' }, ...buttons);

  // ---------- Outer block wrapper ----------
  const block = div(
    {
      ...blockAttr,
      class: `calc-selector ${blockAttr?.class || ''}`,
    },
    labelEl,
    hiddenInput,
    optionsWrap,
  );

  return block;
}

/**
 * Create SIP summary block with total returns, invested amount, and estimated returns
 * @param {HTMLElement} container - Container element with summary data
 * @param {string} [ctaLabel="Start SIP"] - CTA button text
 * @param {string} [ctaHref="#"] - CTA link
 * @param {boolean} [showCompoundRate=true] - Whether to show compound rate section
 * @returns {HTMLElement}
 */
export function createBarSummaryBlock({
  container = null,
  showCompoundRate = false,
}) {
  if (!container) return null;
  const parent = div({ class: 'calc-overview-summary calc-author-main2' });
  const uls = container.querySelectorAll('ul');

  // Total returns
  const totalReturnsUl = uls[0];
  if (totalReturnsUl) {
    const lis = totalReturnsUl.querySelectorAll('li');
    const imgEl = lis[0]?.querySelector('img');

    const itemDiv = div({ class: 'calc-summary-item total-returns-item' });
    if (imgEl) itemDiv.appendChild(imgEl.cloneNode(true));

    const labelValueDiv = div(
      {},
      span({ class: 'small-title' }, lis[1]?.textContent.trim() || ''),
      span(
        { id: 'sip-total-returns', class: 'sip-amount' },
        formatNumber({
          value: lis[2]?.textContent.trim() || '',
          currency: true,
        }),
      ),
    );
    itemDiv.appendChild(labelValueDiv);
    parent.appendChild(itemDiv);

    // Empty compounding div
    const estimatedReturnsBarChildren = [div({ class: 'compound-container' })];

    // Conditionally add compound rate container
    if (showCompoundRate) {
      estimatedReturnsBarChildren.push(
        div(
          { class: 'compound-rate-container' },
          span({ class: 'text' }, 'Compounding at'),
          span({ id: 'compound-rate' }, '1.4px'),
        ),
      );
    }

    parent.appendChild(
      div(
        { class: 'calc-compounding' },
        div({ class: 'invested-amount-bar' }),
        div({ class: 'estimated-returns-bar' }, ...estimatedReturnsBarChildren),
      ),
    );
  }

  // Invested amount + Est. returns wrapper
  const investedEstWrapper = div({ class: 'calc-summary-half-wrapper' });

  [uls[1], uls[2]].forEach((ul, index) => {
    if (!ul) return;
    const lis = ul.querySelectorAll('li');
    const color = lis[0]?.textContent.trim();
    const itemDiv = div({ class: 'calc-summary-item half-width' });
    document.documentElement.style.setProperty(
      index === 0 ? '--invst-amt-bg' : '--est-return-bg',
      color,
    );

    // Color block
    itemDiv.appendChild(
      span(
        {
          class: `color-block ${
            index === 0 ? 'invested-amount' : 'est-returns'
          }`,
        },
        '',
      ),
    );

    // Label + value
    const labelValueDiv = div(
      {},
      span({ class: 'small-title' }, lis[1]?.textContent.trim() || ''),
      span(
        {
          id: index === 0 ? 'total-invested-amount' : 'total-estimated-returns',
          class: 'sip-amount',
        },
        formatNumber({
          value: lis[2]?.textContent.trim() || '',
          currency: true,
        }),
      ),
    );
    itemDiv.appendChild(labelValueDiv);

    investedEstWrapper.appendChild(itemDiv);
  });

  parent.appendChild(investedEstWrapper);

  // CTA button
  const ctaBtn = createSummaryCTA({
    container,
  });
  parent.appendChild(ctaBtn);

  return parent;
}

export function createSummaryCTA({ container }) {
  const authorCTAData = container.querySelector('.calc-author-sub4 a');
  const ctaBtn = button(
    {
      class: 'calc-overview-cta',
      onclick: () => {
        window.location.href = authorCTAData?.href || '#';
      },
    },
    authorCTAData?.textContent.trim() || 'Start SIP',
  );
  return ctaBtn;
}

export const CALC_FILENAME_MAPPING = {
  'sip-calculator': 'sip-calculator',
  'swp-calculator': 'swp-calculator',
  'lumpsum-calculator': 'lumpsum-calculator',
  'inflation-calculator': 'inflation-calculator',
  'sip-top-up-calculator': 'sip-top-up-calculator',
  'systematic-transfer-plan-calculator': 'systematic-transfer-plan-calculator',
  'sip-delay-calculator': 'sip-delay-calculator',
  'compound-interest-calculator': 'compound-interest-calculator',
  'sip-past-performance-calculator': 'sip-past-performance-calculator',
  'sip-calculator': 'sip-calculator',
  'goal-calculator': 'goal-calculator',
};

/**
 * Takes a key and full data array, returns formatted data for that key.
 * @param {Array} dataArr - full CALC_AUTHORED_DATA array
 * @param {string} key - key to look for (e.g. "MSI", "ROR", "IP")
 * @returns {Object|null} structured object or null if key not found
 */
export function getAuthorData(dataArr, key) {
  const item = dataArr.find((d) => d.key === key);
  if (!item || !Array.isArray(item.data)) return null;

  const [dataLabel, def, min, max] = item.data;

  return {
    label: dataLabel || '',
    default: def || '',
    min: min || '',
    max: max || '',
  };
}

export function getCardsPerRow({
  windowWidth = window.innerWidth,
  maxWidth = 1232,
  padding = 0, // total left+right padding
  cardWidth = 296,
  gap = 0,
  minCardsSmall = 4, // minimum cards for small screens (<768px)
  smallBreakpoint = 768,
} = {}) {
  const availableWidth = Math.min(windowWidth, maxWidth) - padding;
  const fullCardWidth = cardWidth + gap;
  const calculatedCards = Math.floor(availableWidth / fullCardWidth);

  // Return minimum 4 cards if screen is smaller than smallBreakpoint
  if (windowWidth < smallBreakpoint) {
    return Math.max(calculatedCards, minCardsSmall);
  }

  return calculatedCards;
}

export function extractOptionsSelect({ listContainer }) {
  if (!listContainer) {
    console.warn('No listContainer provided to extractOptionsSelect');
    return [];
  }
  return Array.from(listContainer)
    ?.map((li) => {
      const nestedUl = li.querySelector('ul');
      if (!nestedUl) {
        return null;
      }
      const [labelEl, valueEl] = Array.from(nestedUl.children);
      const label = labelEl ? labelEl.textContent.trim() : '';
      const value = valueEl ? valueEl.textContent.trim() : '';
      return { label, value };
    })
    .filter((o) => o !== null);
}

/**
 * Get a query parameter value from a URL.
 *
 * @param {string} key - Name of the query parameter to retrieve.
 * @param {string} [url=window.location.href] - Optional URL to extract from.
 * @returns {string|null} The value of the query param, or null if not found.
 *
 * @example
 * // If URL is: https://example.com/?type=plan-a-trip
 * getQueryParam("type"); // "plan-a-trip"
 *
 * @example
 * getQueryParam("id", "https://site.com/page?id=42"); // "42"
 */
export function getQueryParam(key, url = window.location.href) {
  try {
    const params = new URL(url).searchParams;
    return params.get(key);
  } catch (err) {
    console.warn('Invalid URL:', url);
    return null;
  }
}
/**
 * Safely updates container content with minimal reflows / layout thrashing.
 * Only reads layout once (if needed), does DOM update off‑DOM, then applies in one write.
 *
 * @param {HTMLElement} container  — element whose content will be replaced
 * @param {Function} buildFn       — callback that returns a DocumentFragment or Node (new content)
 * @param {boolean} useReserve     — whether to temporarily reserve height (optional)
 * @param {number} [extraPx=0]     — extra pixels to add to reserved height
 */
export function safeUpdateMinimalReflow(
  container,
  buildFn,
  useReserve = false,
  extraPx = 0,
) {
  if (!container || typeof buildFn !== 'function') return;

  let prevHeight = 0;
  if (useReserve) {
    // Read once — this may cause a reflow here
    prevHeight = container.scrollHeight;
    container.style.maxHeight = `${prevHeight + extraPx}px`;
    container.style.overflow = 'hidden';
  }

  // Build new content off-DOM
  const newContent = buildFn();

  // Replace content in one go — minimal writes
  container.innerHTML = '';
  container.appendChild(newContent);

  if (useReserve) {
    // Restore natural layout — avoid reading again if you don't need new height
    container.style.maxHeight = '';
    container.style.overflow = '';
  }
}
