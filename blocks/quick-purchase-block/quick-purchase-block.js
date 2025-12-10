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
        p({ class: 'cagr-date' }, ''),

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

  return block;
}
