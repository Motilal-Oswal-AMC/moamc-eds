import dataMapMoObj from '../../scripts/constant.js';
import {
  div, ul, li, p, input, label, button, img,
} from '../../scripts/dom-helpers.js';
import { myAPI, generateAppId } from '../../scripts/scripts.js';
// OG bhai
export default function decorate(block) {
  const wealthModalData = Array.from(block.children);
  const wealthModal = wealthModalData[0];

  if (wealthModal) {
    dataMapMoObj.CLASS_PREFIXES = ['wealth', 'wealth-inner', 'wealth-sub-inner', 'wealth-sub-inner-sub', 'wealth-sub-inner-sub-li'];
    dataMapMoObj.addIndexed(wealthModal);
  }

  // unclaimed redemption class handling
  const unclaimedRedemptionModal = block.closest('main').querySelector('.unclaimed-redemption .wealth-modal');
  if (unclaimedRedemptionModal) {
    dataMapMoObj.CLASS_PREFIXES =
      ['unclaimed-redemption-modal',
        'urm-wrapper',
        'urm-inner',
        'urm-subinner'
      ];
    dataMapMoObj.addIndexed(unclaimedRedemptionModal);
  }
  // Unclaimed redemption structure update
  const urmTitle = unclaimedRedemptionModal.querySelector('.urm-inner1');
  const panLabel = unclaimedRedemptionModal.querySelector('.urm-inner2');
  const orTxt = unclaimedRedemptionModal.querySelector('.urm-inner3');
  const folioLabel = unclaimedRedemptionModal.querySelector('.urm-inner4');
  const enterOtpLAbel = unclaimedRedemptionModal.querySelector('.urm-inner5');
  const resendOtpLabel = unclaimedRedemptionModal.querySelector('.urm-inner6');
  const otpMsg = unclaimedRedemptionModal.querySelector('.urm-inner7');
  const urmAuthenticateBtn = unclaimedRedemptionModal.querySelector('.urm-inner9');
  const urmSubmitBtn = unclaimedRedemptionModal.querySelector('.urm-inner8');
  const urmDesc = unclaimedRedemptionModal.querySelector('.urm-inner10');

  const urmModalContent = div(
    { "class": 'urm-modal-content-wrapper' },
    div(
      { "class": 'urm-modal-content' },
      div(
        { "class": 'urm-modal-wrapper' },
        div(
          { "class": 'urm-title-wrap' },
          p({ "class": 'urm-title-txt' }, urmTitle.textContent),
        ),
        div({ "class": 'urm-pan-wrap' },
          div({ "class": 'pan-innerwrap' },
            label({ "for": '', "class": 'urm-pan-lbl' }, panLabel.textContent),
            input({ "type": 'text', "class": 'urm-pan-inp' })
          ),
          p({ "class": 'urm-pan-error hide-error' }, 'Please enter valid PAN Number.'),
        ),
        div(
          { "class": 'urm-or-txt' },
          p({ "class": 'urm-txt' }, orTxt.textContent),
        ),
        div({ "class": 'urm-folio-wrap' },
          div({ "class": 'folio-innerwrap' },
            label({ "for": '', "class": 'urm-folio-lbl' }, folioLabel.textContent),
            input({ "type": 'text', "class": 'urm-folio-inp' })
          ),
          p({ "class": 'urm-folio-error hide-error' }, 'Please enter valid folio number.'),
        ),
        // div(
        //   { "class": 'urm-enter-otp-wrap' },
        //   p({ "class": 'urm-otp-txt' }, enterOtpLAbel.textContent),
        //   div(
        //     { "class": 'urm-otp-field' },
        //     div(
        //       { "class": 'urm-otp-field-wrap' },
        //       div(
        //         { "class": 'urm-otpinp-wrap' },
        //         input({
        //           "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 1 of 6',
        //         }),
        //       ),
        //       div(
        //         { class: 'urm-otpinp-wrap' },
        //         input({
        //           class: 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 2 of 6',
        //         }),
        //       ),
        //       div(
        //         { class: 'urm-otpinp-wrap' },
        //         input({
        //           "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 3 of 6',
        //         }),
        //       ),
        //       div(
        //         { "class": 'urm-otpinp-wrap' },
        //         input({
        //           "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 4 of 6',
        //         }),
        //       ),
        //       div(
        //         { "class": 'urm-otpinp-wrap' },
        //         input({
        //           "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 5 of 6',
        //         }),
        //       ),
        //       div(
        //         { "class": 'urm-otpinp-wrap' },
        //         input({
        //           "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 6 of 6',
        //         }),
        //       ),
        //     ),
        //     button({ "class": 'urm-resend' }, resendOtpLabel.textContent),
        //   ),
        // ),
        // div({ "class": 'urm-otp-msg-wrap' },
        //   p({ "class": 'urm-otpmsg-txt' }, otpMsg.textContent)
        // ),
        div(
          { "class": 'otp-wrapper' },
          div(
            { "class": 'urm-enter-otp-wrap' },
            p({ "class": 'urm-otp-txt' }, enterOtpLAbel.textContent),
            div(
              { "class": 'urm-otp-field' },
              div(
                { "class": 'urm-otp-field-wrap' },
                div(
                  { "class": 'urm-otpinp-wrap' },
                  input({
                    "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 1 of 6',
                  }),
                ),
                div(
                  { class: 'urm-otpinp-wrap' },
                  input({
                    class: 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 2 of 6',
                  }),
                ),
                div(
                  { class: 'urm-otpinp-wrap' },
                  input({
                    "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 3 of 6',
                  }),
                ),
                div(
                  { "class": 'urm-otpinp-wrap' },
                  input({
                    "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 4 of 6',
                  }),
                ),
                div(
                  { "class": 'urm-otpinp-wrap' },
                  input({
                    "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 5 of 6',
                  }),
                ),
                div(
                  { "class": 'urm-otpinp-wrap' },
                  input({
                    "class": 'urm-otpinp', "type": 'text', "maxlength": '1', 'aria-label': 'OTP digit 6 of 6',
                  }),
                ),
              ),
              button({ "class": 'urm-resend' }, resendOtpLabel.textContent),
            ),
          ),
          div({ "class": 'urm-otp-msg-wrap' },
            p({ "class": 'urm-otpmsg-txt' }, otpMsg.textContent)
          ),
          button({ "class": 'urm-authenticate' }, urmAuthenticateBtn.textContent),
        ),
        button({ "class": 'urm-submit ' }, urmSubmitBtn.textContent)),
    ),
    div(
      { "class": 'urm-related-desc' },
      p({ "class": 'urm-description' }, urmDesc.textContent),
    ),
  );

  unclaimedRedemptionModal.textContent = '';
  unclaimedRedemptionModal.append(urmModalContent);

  // const inputLabels = wealthModal.querySelectorAll('.urm-modal-wrapper label');
  const urmInputs = unclaimedRedemptionModal.querySelectorAll('.urm-modal-wrapper input');

  urmInputs.forEach(input => { // Add active on click
    input.addEventListener('click', (e) => {
      if (e.target.value === '') {
        e.target.parentElement.parentElement.classList.add('active');
      }
    });
  });

  // Remove active when clicking outside for input label focus
  document.addEventListener('click', (e) => {
    urmInputs.forEach(input => {
      if (!input.contains(e.target) && input.value === '') {
        input.parentElement.parentElement.classList.remove('active');
      }
    });
  });

  // Unclaimed redemption PAN Number Oninput handling
  const panInput = unclaimedRedemptionModal.querySelector('.urm-pan-wrap');
  panInput.addEventListener('input', (e) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    e.target.value = e.target.value.toUpperCase();
    const inputValue = e.target.value;
    const errorPanEl = unclaimedRedemptionModal.querySelector('.urm-pan-error');
    // const btnAuthenticate = document.querySelector('.subpandts3 .innerpandts1');

    if (inputValue === '') {
      // If empty, hide the error
      errorPanEl.parentElement.classList.remove('show-error');
      errorPanEl.parentElement.classList.add('hide-error');
      e.target.parentElement.classList.remove('active');
    } else if (panRegex.test(inputValue)) {
      // If valid PAN, hide error
      errorPanEl.parentElement.classList.remove('show-error');
      errorPanEl.parentElement.classList.add('hide-error');
      // btnAuthenticate.classList.add('pan-active');
      // e.target.parentElement.classList.add('active');
    } else {
      // If invalid PAN, show error
      errorPanEl.parentElement.classList.remove('hide-error');
      errorPanEl.parentElement.classList.add('show-error');
      // btnAuthenticate.classList.remove('pan-active');
      e.target.parentElement.classList.add('active');
    }

  });

  // Unclaimed redemption Folio handling
  const folioInput = unclaimedRedemptionModal.querySelector('.urm-folio-wrap .urm-folio-inp');

  folioInput.addEventListener('input', (e) => {
    const folioRegex = /^[A-Za-z0-9]{1,20}$/;   // correct regex (not string)
    e.target.value = e.target.value.toUpperCase();
    const inputVal = e.target.value;

    const errorEl = unclaimedRedemptionModal.querySelector('.urm-folio-error');
    const wrapper = errorEl.parentElement; // .urm-folio-wrap

    if (inputVal === '') {
      wrapper.classList.add('show-error');
      wrapper.classList.remove('hide-error');
      return;
    } else if (folioRegex.test(inputVal)) {
      wrapper.classList.remove('show-error');
      wrapper.classList.add('hide-error');
    } else {
      wrapper.classList.add('show-error');
      wrapper.classList.remove('hide-error');
    }
  });

  // Unclaimed redemption Authenticate button handling
  const authenticateBtn = unclaimedRedemptionModal.querySelector('.urm-authenticate');
  authenticateBtn.addEventListener('click', (e) => {
    const userPanNumber = panInput.querySelector('.urm-pan-inp').value.trim();
    const userFolioNumber = folioInput.value.trim();
    const errorPanEl = unclaimedRedemptionModal.querySelector('.urm-pan-error');
    const errorFolioEl = unclaimedRedemptionModal.querySelector('.urm-folio-error');

    if (userPanNumber !== '' && userFolioNumber !== '') {
      console.log("sarika:: ", userPanNumber, userFolioNumber);
      
    }
  });


  try {
    const crossBtn = wealthModal.querySelector('.wealth-inner1').cloneNode(true);
    const flag = wealthModal.querySelector('.icon-national-flag').cloneNode(true);
    const ragLable = wealthModal.querySelector('.wealth1 .wealth-inner2');
    const nameLab = wealthModal.querySelector('.wealth1 .wealth-inner3');
    const emailLab = wealthModal.querySelector('.wealth1 .wealth-inner4');
    const numLab = wealthModal.querySelector('.wealth1 .wealth-sub-inner2');
    const associatedLab = wealthModal.querySelector('.wealth1 .wealth-inner6');
    const botton = wealthModal.querySelector('.wealth1 .wealth-inner7');
    const mend = wealthModal.querySelector('.wealth1 .wealth-inner8');
    const mentsub = mend === null ? 'Submit' : mend.textContent;
    const counCode = wealthModal.querySelector('.wealth1 .wealth-sub-inner-sub-li2');

    const wealthRagisterModal = div(
      { class: 'main-wealth-modal' },
      div({ class: 'cross-btn' }, crossBtn),
      div(
        { class: 'ragis-lab-btn' },
        p({ class: 'rag-lable' }, ragLable.textContent),
        div(
          { class: 'inp-lab' },
          div(
            { class: 'inp-lab-div' },
            label({ class: 'label name-label' }, nameLab.textContent),
            input({ class: 'inp name-inp' }),
            img({
              class: 'error-icon name-error-icon', src: '/icons/icon-error.svg', alt: 'Clear field', style: 'display:none;cursor:pointer;',
            }),
            p({ class: 'error-msg name-error' }),
          ),
          div(
            { class: 'inp-lab-div' },
            label({ class: 'label email-label' }, emailLab.textContent),
            input({ class: 'inp email-inp' }),
            img({
              class: 'error-icon email-error-icon', src: '/icons/icon-error.svg', alt: 'Clear field', style: 'display:none;cursor:pointer;',
            }),
            p({ class: 'error-msg email-error' }),
          ),
          div(
            { class: 'nat-numb' },
            div(
              { class: 'inp-lab-div country-drop' },
              label({ class: 'cont-label' }, counCode.textContent),
              input({ class: 'inp cont-inp', readonly: true }),
              div({ class: 'coun-img' }, flag),
            ),
            div(
              { class: 'inp-lab-div' },
              label({ class: 'label num-label' }, numLab.textContent),
              input({ class: 'inp num-inp', maxlength: 10 }),
              img({
                class: 'error-icon num-error-icon', src: '/icons/icon-error.svg', alt: 'Clear field', style: 'display:none;cursor:pointer;',
              }),
              p({ class: 'error-msg num-error' }),
            ),
          ),
          div(
            { class: 'inp-lab-div associated-drop' },
            label({ class: 'label associated-label' }, associatedLab.textContent),
            input({ class: 'inp associated-inp', readonly: true }),
            div({ class: 'dropdown-arrow' }),
            img({
              class: 'error-icon assoc-error-icon', src: '/icons/icon-error.svg', alt: 'Clear field', style: 'display:none;cursor:pointer;',
            }),
            ul(
              { class: 'assoc-drop' },
              li({}, 'MOFSL Business Partners'),
              li({}, 'Mutual Fund Distributors or RIAs'),
              li({}, 'Investor/Customer'),
              li({}, 'Other'),
            ),
            p({ class: 'error-msg assoc-error' }),
          ),
        ),
        div(
          { class: 'btn-mand' },
          button({ class: 'btn', disabled: true }, mentsub),
          p({ class: 'mandatory' }, botton.textContent),
        ),
      ),
    );

    wealthModal.textContent = '';
    wealthModal.append(wealthRagisterModal);

    const assocDiv = wealthModal.querySelector('.inp-lab-div.associated-drop');
    const assocInput = assocDiv.querySelector('.associated-inp');
    const assocDrop = assocDiv.querySelector('.assoc-drop');
    const arrow = assocDiv.querySelector('.dropdown-arrow');
    const formDropdownList = assocDiv.querySelectorAll('.assoc-drop li');

    function toggleDropdown(e) {
      e.stopPropagation();
      assocDiv.classList.toggle('active');
      assocDrop.classList.toggle('open');
    }

    assocInput.addEventListener('click', toggleDropdown);
    arrow.addEventListener('click', toggleDropdown);

    assocDrop.querySelectorAll('li').forEach((liarg) => {
      liarg.addEventListener('click', () => {
        const touchedFields = new Set();
        formDropdownList.forEach((liinner) => {
          liinner.setAttribute('aria-selected', 'false');
          liinner.classList.remove('active');
        });

        liarg.setAttribute('aria-selected', 'true');
        liarg.classList.add('active');
        if (liarg.getAttribute('aria-selected') === 'true') {
          assocInput.innerHTML = '';
          assocInput.innerHTML += liarg.innerHTML;
        }
        assocInput.value = liarg.textContent;
        assocDrop.classList.remove('open');
        assocDiv.classList.remove('active');
        const labelagr = assocInput.parentElement.querySelector('.label');
        labelagr.classList.add('filled');
        touchedFields.add(assocInput);
        dataMapMoObj.validateField(assocInput);
        dataMapMoObj.toggleSubmitButton();
      });
    });

    document.addEventListener('click', () => {
      assocDrop.classList.remove('open');
      assocDiv.classList.remove('active');
    });

    const closeIcon = wealthModal.querySelector('.icon-modal-cross-btn');

    if (closeIcon) {
      closeIcon.addEventListener('click', () => {
        const dialogEl = block.closest('dialog');
        if (dialogEl && dialogEl.hasAttribute('open')) {
          dialogEl.close();
          return;
        }
        const modalSection = block.closest('.wealth-register');
        if (modalSection) {
          modalSection.classList.remove('modal-show');
          modalSection.style.display = 'none';
        }
      });
    }

    const crossButton = wealthModal.querySelector('.cross-btn');
    crossButton.addEventListener('click', () => wealthModal.remove());

    const nameInput = wealthModal.querySelector('.name-inp');
    const emailInput = wealthModal.querySelector('.email-inp');
    const phoneInput = wealthModal.querySelector('.num-inp');
    const submitButton = wealthModal.querySelector('.btn');

    const fields = [nameInput, emailInput, phoneInput, assocInput]
      .filter(Boolean);
    const touchedFields = new Set();

    function validateForm() {

      // Ensure all fields are validated, including the associated dropdown
      return fields.every((f) => dataMapMoObj.validateField(f));
    }

    function toggleSubmitButton() {
      const hasStaticModal = document.querySelector('.static-modal');

      const filteredFields = fields.filter(f => {
        const isAssociated = !!(f?.classList?.contains('associated-inp'));
        // Remove ONLY when hasStaticModal AND isAssociated
        if (hasStaticModal && isAssociated) {
          return false;
        }
        return true;
      });

      // FIX: removed hasAttribute('readonly') logic that was incorrectly marking assocInput as filled
      // console.log(" fields :", fields);
      console.log("!hasStaticModal ? assocInput : null : ", filteredFields);

      const allFilled = filteredFields.every((f) => {
        const fValue = f.value.trim();

        const isValid = fValue ? !f.classList.contains('error') : false;
        return isValid;
      });

      const allValid = filteredFields
        .every((f) => (touchedFields.has(f) ? dataMapMoObj.validateField(f) : true));
      // conslog(" allValid :", allValid);
      submitButton.disabled = !(allFilled && allValid);

      submitButton.classList.toggle('active', allFilled && allValid);
    }
    dataMapMoObj.toggleSubmitButton = toggleSubmitButton;

    function toggleErrorIcon(inputarg, isValid) {
      const icon = inputarg.parentElement.querySelector('.error-icon');
      if (!icon) return;
      if (!isValid && inputarg.value.trim() !== '') icon.style.display = 'inline';
      else icon.style.display = 'none';
      icon.onclick = () => {
        inputarg.value = '';
        const errorMsg = inputarg.parentElement.querySelector('.error-msg');
        if (errorMsg) errorMsg.textContent = '';
        icon.style.display = 'none';
        inputarg.classList.remove('error');
        toggleSubmitButton();
      };
    }

    async function validateField(inputarg) {
      const nameError = wealthModal.querySelector('.name-error');
      const emailError = wealthModal.querySelector('.email-error');
      const phoneError = wealthModal.querySelector('.num-error');
      const assocError = wealthModal.querySelector('.assoc-error');
      let valid = true;

      if (inputarg.classList.contains('name-inp')) {
        const nameRegex = /^[a-zA-Z\s]*$/;
        if (inputarg.value.trim() && !nameRegex.test(inputarg.value.trim())) {
          valid = false;
          nameError.textContent = 'Only letters and spaces allowed.';
        } else nameError.textContent = '';
      }

      if (inputarg.classList.contains('email-inp')) {
        // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // const emailRegex = /^(?=.{1,30}@)[a-z0-9]+(\.[a-z0-9]+)*@[a-z0-9.-]+\.[a-z]{2,}$/i;
        const emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
        if (inputarg.value.trim() && !emailRegex.test(inputarg.value.trim())) {
          valid = false;
          emailError.textContent = 'Please enter a valid email.';
        } else emailError.textContent = '';
      }

      if (inputarg.classList.contains('num-inp')) {
        const phoneRegex = /^(?!([6-9])\1{9})[6-9]\d{9}$/;
        if (inputarg.value.trim() && !phoneRegex.test(inputarg.value.trim())) {
          valid = false;
          phoneError.textContent = 'Enter a valid 10-digit Indian number.';
        } else phoneError.textContent = '';
      }

      if (inputarg.classList.contains('associated-inp')) {
        if (!inputarg.value.trim()) {
          valid = false;
          assocError.textContent = 'Please select an association.';
        } else assocError.textContent = '';
      }
      inputarg.classList.toggle('error', !valid && inputarg.value.trim() !== '');
      toggleErrorIcon(inputarg, valid);

      return valid;
    }
    dataMapMoObj.validateField = validateField;

    fields.forEach((field) => {
      const labelval = field.parentElement.querySelector('.label');
      field.addEventListener('focus', () => labelval.classList.add('filled'));
      field.addEventListener('blur', () => {
        if (field.value.trim() === '') labelval.classList.remove('filled');
        else labelval.classList.add('filled');
      });
      field.addEventListener('input', () => {
        if (field.classList.contains('name-inp')) field.value = field.value.replace(/[^a-zA-Z\s]/g, '');
        if (field.classList.contains('num-inp')) field.value = field.value.replace(/\D/g, '').slice(0, 10);
        touchedFields.add(field);
        validateField(field);
        toggleSubmitButton();
      });
      if (field.value.trim() !== '') label.classList.add('filled');
    });

    const mop = block.closest('main').querySelectorAll('.thank-you-screen p');
    // eslint-disable-next-line prefer-destructuring
    dataMapMoObj.msgError = mop[1];
    dataMapMoObj.CLASS_PREFIXES = [
      'thank-you-scr-cont',
      'thank-you-scr-sec',
      'thank-you-scr-sub',
      'thank-you-scr-inner-text',
      'thank-you-scr-list',
      'thank-you-scr-list-content',
    ];

    dataMapMoObj.addIndexed(block.closest('main').querySelector('.thank-you-screen'));
    block.closest('main').querySelectorAll('.thank-you-screen p')[2].style.display = 'none';
    const moclosse = block.closest('main').querySelector('.thank-you-screen');
    moclosse.querySelector('.thank-you-scr-sec5 img').addEventListener('click', () => {
      moclosse.style.display = 'none';
    });
    moclosse.querySelector('.thank-you-scr-sec4 a').removeAttribute('href');
    moclosse.querySelector('.thank-you-scr-sec4').addEventListener('click', () => {
      moclosse.style.display = 'none';
    });

    async function elessSaveform() {
      try {
        const objreqelss = {
          "panNo": "",
          "name": nameInput.value.trim(),
          "stdCode": "91",
          "mobileNo": phoneInput.value.trim(),
          "emailID": emailInput.value.trim(),
          "country": "",
          "state": "",
          "city": "",
          "pinCode": "",
          "isKYC": false,
          "campaign": "",
          "productName": "",
          "url": "https://mf.moamc.com/mutual-funds/motilal-oswal-large-cap-fund",
          "deviceType": "Web",
          "osName": "Windows",
          "osVersion": "Chrome",
          "ip": "",
          "fundName": "",
          "fundCode": "",
          "plan": "",
          "option": "",
          "isNewInvestor": true,
          "_nextType": "/SaveRawLead"

        };
        const headers = {
          'Content-Type': 'application/json',
          'User-Agent': 'WEB/MultipleCampaign',
          'user-agent': 'WEB/MultipleCampaign',
          UserAgent: 'WEB/MultipleCampaign',
          appid: '27820BB4MEC3DA4D65MAC74CDFF81E020A60'
          // generateAppId(),
        };

        const response = await myAPI(
          'POST',
          'https://api.moamc.com/LMS/api/Lead/SaveRawLead',
          objreqelss,
          headers,
        );

        const result = await response;
        console.log(result);
        if (result) {
          block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
          // alert
          dataMapMoObj.msgError.innerText = '';
          dataMapMoObj.msgError.innerText = 'Your details have been submitted successfully!';
          // Reset form
          fields.forEach((f) => {
            f.value = '';
            const labelvar = f.parentElement.querySelector('.label');
            if (labelvar) labelvar.classList.remove('filled');
          });
          // block.querySelector('.btn-mand .btn').classList.remove('active');
          toggleSubmitButton();
        } else {
          block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
          dataMapMoObj.msgError.innerText = '';
          dataMapMoObj.msgError.innerText = `Something went wrong: ${result.message || 'Unknown error'}`;
          // alert
          // popup(div(`Something went wrong: ${result.message || 'Unknown error'}`));
        }
      } catch (error) {
        console.log("eror: ", error);
        block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
        dataMapMoObj.msgError.innerText = '';
        dataMapMoObj.msgError.innerText = 'Failed to submit form. Please try again later.';

      }
    }
    submitButton.addEventListener('click', async (e) => {
      e.preventDefault();
      if (document.querySelector('.static-modal')) {
        const response = await elessSaveform();
        return false;
      }
      fields.forEach((f) => touchedFields.add(f));
      if (validateForm()) {
        // console.log('Form is valid. Submitting...');
        try {
          const objreq = {
            name: nameInput.value.trim(),
            mobile: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            state: 'MH',
            city: 'M',
            customField01: 'NULL',
            customField02: 'NULL',
            customField03: 'NULL',
            userIp: '156.67.260.62',
            type: 'other',
            code: 'NA',
          };
          const headers = {
            'Content-Type': 'application/json',
            'X-Encrypted': 'N',
            appid: generateAppId(),
          };

          const response = await myAPI(
            'POST',
            'https://mf.moamc.com/ums/api/SaveLead/create-leads',
            objreq,
            headers,
          );

          const result = await response; // .json();
          // console.log('API Response:', result);

          if (result) {
            block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
            // alert
            dataMapMoObj.msgError.innerText = '';
            dataMapMoObj.msgError.innerText = 'Your details have been submitted successfully!';
            // Reset form
            fields.forEach((f) => {
              f.value = '';
              const labelvar = f.parentElement.querySelector('.label');
              if (labelvar) labelvar.classList.remove('filled');
            });
            // block.querySelector('.btn-mand .btn').classList.remove('active');
            toggleSubmitButton();
            block.querySelector('.associated-drop .error-msg').textContent = '';
          } else {
            block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
            dataMapMoObj.msgError.innerText = '';
            dataMapMoObj.msgError.innerText = `Something went wrong: ${result.message || 'Unknown error'}`;
            // alert
            // popup(div(`Something went wrong: ${result.message || 'Unknown error'}`));
          }
        } catch (error) {
          // console.error('API Error:', error);
          block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
          dataMapMoObj.msgError.innerText = '';
          dataMapMoObj.msgError.innerText = 'Failed to submit form. Please try again later.';
        }
      } else {
        toggleSubmitButton();
      }
      // const closeElements = modal.querySelectorAll('.thank-you-scr-sec4');
      // closeElements.forEach((el) => {
      //   el.addEventListener('click', () => {
      //     modal.remove();
      //   });
      // });

      // document.body.append(modal);
    });

    block.closest('.wealth-register')
      .classList.add('modal-show');
  } catch (error) {
  }
  // const crossBtn = wealthModal.querySelector('.wealth-inner1').cloneNode(true);
  // const flag = wealthModal.querySelector('.icon-national-flag').cloneNode(true);
  // const ragLable = wealthModal.querySelector('.wealth1 .wealth-inner2');
  // const nameLab = wealthModal.querySelector('.wealth1 .wealth-inner3');
  // const emailLab = wealthModal.querySelector('.wealth1 .wealth-inner4');
  // const numLab = wealthModal.querySelector('.wealth1 .wealth-sub-inner2');
  // const associatedLab = wealthModal.querySelector('.wealth1 .wealth-inner6');
  // const botton = wealthModal.querySelector('.wealth1 .wealth-inner7');
  // const mend = wealthModal.querySelector('.wealth1 .wealth-inner8');
  // const counCode = wealthModal.querySelector('.wealth1 .wealth-sub-inner-sub-li2');

  // const wealthRagisterModal = div(
  //   { class: 'main-wealth-modal' },
  //   div({ class: 'cross-btn' }, crossBtn),
  //   div(
  //     { class: 'ragis-lab-btn' },
  //     p({ class: 'rag-lable' }, ragLable.textContent),
  //     div(
  //       { class: 'inp-lab' },
  //       div(
  //         { class: 'inp-lab-div' },
  //         label({ class: 'label name-label' }, nameLab.textContent),
  //         input({ class: 'inp name-inp' }),
  //         img({
  //           class: 'error-icon name-error-icon', src: '/icons/icon-error.svg', alt: 'Clear field', style: 'display:none;cursor:pointer;',
  //         }),
  //         p({ class: 'error-msg name-error' }),
  //       ),
  //       div(
  //         { class: 'inp-lab-div' },
  //         label({ class: 'label email-label' }, emailLab.textContent),
  //         input({ class: 'inp email-inp' }),
  //         img({
  //           class: 'error-icon email-error-icon', src: '/icons/icon-error.svg', alt: 'Clear field', style: 'display:none;cursor:pointer;',
  //         }),
  //         p({ class: 'error-msg email-error' }),
  //       ),
  //       div(
  //         { class: 'nat-numb' },
  //         div(
  //           { class: 'inp-lab-div country-drop' },
  //           label({ class: 'cont-label' }, counCode.textContent),
  //           input({ class: 'inp cont-inp', readonly: true }),
  //           div({ class: 'coun-img' }, flag),
  //         ),
  //         div(
  //           { class: 'inp-lab-div' },
  //           label({ class: 'label num-label' }, numLab.textContent),
  //           input({ class: 'inp num-inp', maxlength: 10 }),
  //           img({
  //             class: 'error-icon num-error-icon', src: '/icons/icon-error.svg', alt: 'Clear field', style: 'display:none;cursor:pointer;',
  //           }),
  //           p({ class: 'error-msg num-error' }),
  //         ),
  //       ),
  //       div(
  //         { class: 'inp-lab-div associated-drop' },
  //         label({ class: 'label associated-label' }, associatedLab.textContent),
  //         input({ class: 'inp associated-inp', readonly: true }),
  //         div({ class: 'dropdown-arrow' }),
  //         img({
  //           class: 'error-icon assoc-error-icon', src: '/icons/icon-error.svg', alt: 'Clear field', style: 'display:none;cursor:pointer;',
  //         }),
  //         ul(
  //           { class: 'assoc-drop' },
  //           li({}, 'MOFSL Business Partners'),
  //           li({}, 'Mutual Fund Distributors or RIAs'),
  //           li({}, 'Investor/Customer'),
  //           li({}, 'Other'),
  //         ),
  //         p({ class: 'error-msg assoc-error' }),
  //       ),
  //     ),
  //     div(
  //       { class: 'btn-mand' },
  //       button({ class: 'btn', disabled: true }, botton.textContent),
  //       p({ class: 'mandatory' }, mend.textContent),
  //     ),
  //   ),
  // );

  // wealthModal.textContent = '';
  // wealthModal.append(wealthRagisterModal);

  // const assocDiv = wealthModal.querySelector('.inp-lab-div.associated-drop');
  // const assocInput = assocDiv.querySelector('.associated-inp');
  // const assocDrop = assocDiv.querySelector('.assoc-drop');
  // const arrow = assocDiv.querySelector('.dropdown-arrow');
  // const formDropdownList = assocDiv.querySelectorAll('.assoc-drop li');

  // function toggleDropdown(e) {
  //   e.stopPropagation();
  //   assocDiv.classList.toggle('active');
  //   assocDrop.classList.toggle('open');
  // }

  // assocInput.addEventListener('click', toggleDropdown);
  // arrow.addEventListener('click', toggleDropdown);

  // assocDrop.querySelectorAll('li').forEach((liarg) => {
  //   liarg.addEventListener('click', () => {
  //     const touchedFields = new Set();
  //     formDropdownList.forEach((liinner) => {
  //       liinner.setAttribute('aria-selected', 'false');
  //       liinner.classList.remove('active');
  //     });

  //     liarg.setAttribute('aria-selected', 'true');
  //     liarg.classList.add('active');
  //     if (liarg.getAttribute('aria-selected') === 'true') {
  //       assocInput.innerHTML = '';
  //       assocInput.innerHTML += liarg.innerHTML;
  //     }
  //     assocInput.value = liarg.textContent;
  //     assocDrop.classList.remove('open');
  //     assocDiv.classList.remove('active');
  //     const labelagr = assocInput.parentElement.querySelector('.label');
  //     labelagr.classList.add('filled');
  //     touchedFields.add(assocInput);
  //     dataMapMoObj.validateField(assocInput);
  //     dataMapMoObj.toggleSubmitButton();
  //   });
  // });

  // document.addEventListener('click', () => {
  //   assocDrop.classList.remove('open');
  //   assocDiv.classList.remove('active');
  // });

  // const closeIcon = wealthModal.querySelector('.icon-modal-cross-btn');

  // if (closeIcon) {
  //   closeIcon.addEventListener('click', () => {
  //     const dialogEl = block.closest('dialog');
  //     if (dialogEl && dialogEl.hasAttribute('open')) {
  //       dialogEl.close();
  //       return;
  //     }
  //     const modalSection = block.closest('.wealth-register');
  //     if (modalSection) {
  //       modalSection.classList.remove('modal-show');
  //       modalSection.style.display = 'none';
  //     }
  //   });
  // }

  // const crossButton = wealthModal.querySelector('.cross-btn');
  // crossButton.addEventListener('click', () => wealthModal.remove());

  // const nameInput = wealthModal.querySelector('.name-inp');
  // const emailInput = wealthModal.querySelector('.email-inp');
  // const phoneInput = wealthModal.querySelector('.num-inp');
  // const submitButton = wealthModal.querySelector('.btn');

  // const fields = [nameInput, emailInput, phoneInput, assocInput];
  // const touchedFields = new Set();

  // function validateForm() {
  //   // Ensure all fields are validated, including the associated dropdown
  //   return fields.every((f) => dataMapMoObj.validateField(f));
  // }

  // function toggleSubmitButton() {
  //   // FIX: removed hasAttribute('readonly') logic that was incorrectly marking assocInput as filled
  //   const allFilled = fields.every((f) => f.value.trim() !== '');
  //   const allValid = fields
  //     .every((f) => (touchedFields.has(f) ? dataMapMoObj.validateField(f) : true));

  //   submitButton.disabled = !(allFilled && allValid);
  //   submitButton.classList.toggle('active', allFilled && allValid);
  // }
  // dataMapMoObj.toggleSubmitButton = toggleSubmitButton;

  // function toggleErrorIcon(inputarg, isValid) {
  //   const icon = inputarg.parentElement.querySelector('.error-icon');
  //   if (!icon) return;
  //   if (!isValid && inputarg.value.trim() !== '') icon.style.display = 'inline';
  //   else icon.style.display = 'none';
  //   icon.onclick = () => {
  //     inputarg.value = '';
  //     const errorMsg = inputarg.parentElement.querySelector('.error-msg');
  //     if (errorMsg) errorMsg.textContent = '';
  //     icon.style.display = 'none';
  //     inputarg.classList.remove('error');
  //     toggleSubmitButton();
  //   };
  // }

  // async function validateField(inputarg) {
  //   const nameError = wealthModal.querySelector('.name-error');
  //   const emailError = wealthModal.querySelector('.email-error');
  //   const phoneError = wealthModal.querySelector('.num-error');
  //   const assocError = wealthModal.querySelector('.assoc-error');
  //   let valid = true;

  //   if (inputarg.classList.contains('name-inp')) {
  //     const nameRegex = /^[a-zA-Z\s]*$/;
  //     if (inputarg.value.trim() && !nameRegex.test(inputarg.value.trim())) {
  //       valid = false;
  //       nameError.textContent = 'Only letters and spaces allowed.';
  //     } else nameError.textContent = '';
  //   }

  //   if (inputarg.classList.contains('email-inp')) {
  //     // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     // const emailRegex = /^(?=.{1,30}@)[a-z0-9]+(\.[a-z0-9]+)*@[a-z0-9.-]+\.[a-z]{2,}$/i;
  //     const emailRegex = /^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/;
  //     if (inputarg.value.trim() && !emailRegex.test(inputarg.value.trim())) {
  //       valid = false;
  //       emailError.textContent = 'Please enter a valid email.';
  //     } else emailError.textContent = '';
  //   }

  //   if (inputarg.classList.contains('num-inp')) {
  //     const phoneRegex = /^(?!([6-9])\1{9})[6-9]\d{9}$/;
  //     if (inputarg.value.trim() && !phoneRegex.test(inputarg.value.trim())) {
  //       valid = false;
  //       phoneError.textContent = 'Enter a valid 10-digit Indian number.';
  //     } else phoneError.textContent = '';
  //   }

  //   if (inputarg.classList.contains('associated-inp')) {
  //     if (!inputarg.value.trim()) {
  //       valid = false;
  //       assocError.textContent = 'Please select an association.';
  //     } else assocError.textContent = '';
  //   }
  //   inputarg.classList.toggle('error', !valid && inputarg.value.trim() !== '');
  //   toggleErrorIcon(inputarg, valid);
  //   return valid;
  // }
  // dataMapMoObj.validateField = validateField;

  // fields.forEach((field) => {
  //   const labelval = field.parentElement.querySelector('.label');
  //   field.addEventListener('focus', () => labelval.classList.add('filled'));
  //   field.addEventListener('blur', () => {
  //     if (field.value.trim() === '') labelval.classList.remove('filled');
  //     else labelval.classList.add('filled');
  //   });
  //   field.addEventListener('input', () => {
  //     if (field.classList.contains('name-inp')) field.value = field.value.replace(/[^a-zA-Z\s]/g, '');
  //     if (field.classList.contains('num-inp')) field.value = field.value.replace(/\D/g, '').slice(0, 10);
  //     touchedFields.add(field);
  //     validateField(field);
  //     toggleSubmitButton();
  //   });
  //   if (field.value.trim() !== '') label.classList.add('filled');
  // });

  // const mop = block.closest('main').querySelectorAll('.thank-you-screen p');
  // // eslint-disable-next-line prefer-destructuring
  // dataMapMoObj.msgError = mop[1];
  // dataMapMoObj.CLASS_PREFIXES = [
  //   'thank-you-scr-cont',
  //   'thank-you-scr-sec',
  //   'thank-you-scr-sub',
  //   'thank-you-scr-inner-text',
  //   'thank-you-scr-list',
  //   'thank-you-scr-list-content',
  // ];

  // dataMapMoObj.addIndexed(block.closest('main').querySelector('.thank-you-screen'));
  // block.closest('main').querySelectorAll('.thank-you-screen p')[2].style.display = 'none';
  // const moclosse = block.closest('main').querySelector('.thank-you-screen');
  // moclosse.querySelector('.thank-you-scr-sec5 img').addEventListener('click', () => {
  //   moclosse.style.display = 'none';
  // });
  // moclosse.querySelector('.thank-you-scr-sec4 a').removeAttribute('href');
  // moclosse.querySelector('.thank-you-scr-sec4').addEventListener('click', () => {
  //   moclosse.style.display = 'none';
  // });
  // submitButton.addEventListener('click', async (e) => {
  //   e.preventDefault();
  //   fields.forEach((f) => touchedFields.add(f));
  //   if (validateForm()) {
  //     // console.log('Form is valid. Submitting...');
  //     try {
  //       const objreq = {
  //         name: nameInput.value.trim(),
  //         mobile: phoneInput.value.trim(),
  //         email: emailInput.value.trim(),
  //         state: 'MH',
  //         city: 'M',
  //         customField01: 'NULL',
  //         customField02: 'NULL',
  //         customField03: 'NULL',
  //         userIp: '156.67.260.62',
  //         type: 'other',
  //         code: 'NA',
  //       };
  //       const headers = {
  //         'Content-Type': 'application/json',
  //         'X-Encrypted': 'N',
  //         appid: generateAppId(),
  //       };

  //       const response = await myAPI(
  //         'POST',
  //         'https://mf.moamc.com/ums/api/SaveLead/create-leads',
  //         objreq,
  //         headers,
  //       );

  //       const result = await response; // .json();
  //       // console.log('API Response:', result);

  //       if (result) {
  //         block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
  //         // alert
  //         dataMapMoObj.msgError.innerText = '';
  //         dataMapMoObj.msgError.innerText = 'Your details have been submitted successfully!';
  //         // Reset form
  //         fields.forEach((f) => {
  //           f.value = '';
  //           const labelvar = f.parentElement.querySelector('.label');
  //           if (labelvar) labelvar.classList.remove('filled');
  //         });
  //         // block.querySelector('.btn-mand .btn').classList.remove('active');
  //         toggleSubmitButton();
  //         block.querySelector('.associated-drop .error-msg').textContent = '';
  //       } else {
  //         block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
  //         dataMapMoObj.msgError.innerText = '';
  //         dataMapMoObj.msgError.innerText = `Something went wrong: ${result.message || 'Unknown error'}`;
  //         // alert
  //         // popup(div(`Something went wrong: ${result.message || 'Unknown error'}`));
  //       }
  //     } catch (error) {
  //       // console.error('API Error:', error);
  //       block.closest('main').querySelector('.thank-you-screen').style.display = 'flex';
  //       dataMapMoObj.msgError.innerText = '';
  //       dataMapMoObj.msgError.innerText = 'Failed to submit form. Please try again later.';
  //     }
  //   } else {
  //     toggleSubmitButton();
  //   }
  //   // const closeElements = modal.querySelectorAll('.thank-you-scr-sec4');
  //   // closeElements.forEach((el) => {
  //   //   el.addEventListener('click', () => {
  //   //     modal.remove();
  //   //   });
  //   // });

  //   // document.body.append(modal);
  // });

  // block.closest('.wealth-register')
  //   .classList.add('modal-show');
}

