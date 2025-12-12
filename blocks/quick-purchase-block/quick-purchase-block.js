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

        p({ class: 'selectedtext' }, 'NFO-Motilal Oswal Consumption Fund'),
        ul(
          { class: 'dropdown-list' },
          li(
            { class: 'returnyears', value: 'scheme_1' },
            'NFO-Motilal Oswal Consumption Fund',
          ),
          li(
            { class: 'returnyears', value: 'scheme_2' },
            'NFO-Motilal Oswal Consumption Fund',
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

wrapper.closest('form').addEventListener('submit', function (event) {
  event.preventDefault();

  let formIsValid = true;

  const showError = (input, message) => {
    const span = input.parentElement.querySelector('.error-msg');
    span.textContent = message;
    span.style.display = 'block';
    formIsValid = false;
  };

  const clearError = (input) => {
    const span = input.parentElement.querySelector('.error-msg');
    span.style.display = 'none';
  };

  const amountInput = wrapper.querySelector('.select-schema-radio input');

  const distributorArn = document.getElementById('distributorArn');
  const subDistributorArn = document.getElementById('subDistributorArn');
  const employeeCode = document.getElementById('employeeCode');
  const euin = document.getElementById('euin');

  const arnRegex = /^ARN-\d{2,6}$/i;
  const employeeRegex = /^[a-zA-Z0-9-]{1,20}$/;
  const euinRegex = /^E\d{6}$/i;

  if (amountInput.value.trim() === '' || amountInput.value.trim() === '0') {
    showError(amountInput, 'Please select a scheme');
  } else {
    clearError(amountInput);
  }

  if (distributorArn.value.trim() === '') {
    showError(distributorArn, 'Distributor ARN is required');
  } else if (!arnRegex.test(distributorArn.value.trim())) {
    showError(distributorArn, 'Invalid ARN (e.g., ARN-12345)');
  } else {
    clearError(distributorArn);
  }

  if (subDistributorArn.value.trim() !== '' && !arnRegex.test(subDistributorArn.value.trim())) {
    showError(subDistributorArn, 'Invalid Sub-Distributor ARN');
  } else {
    clearError(subDistributorArn);
  }

  if (employeeCode.value.trim() !== '' && !employeeRegex.test(employeeCode.value.trim())) {
    showError(employeeCode, 'Only A-Z, 0-9, hyphen, max 20 chars');
  } else {
    clearError(employeeCode);
  }

  if (euin.value.trim() !== '' && !euinRegex.test(euin.value.trim())) {
    showError(euin, 'Invalid EUIN (e.g., E123456)');
  } else {
    clearError(euin);
  }

  if (formIsValid) {
    this.submit();
  }
});


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

  return block;
}