import dataMapMoObj from '../../scripts/constant.js';
import {
  div, ul, li, p, input, label, button, img,
} from '../../scripts/dom-helpers.js';
import { myAPI, generateAppId } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wealthModalData = Array.from(block.children);
  const wealthModal = wealthModalData[0];

  if (wealthModal) {
    dataMapMoObj.CLASS_PREFIXES = ['wealth', 'wealth-inner', 'wealth-sub-inner', 'wealth-sub-inner-sub', 'wealth-sub-inner-sub-li'];
    dataMapMoObj.addIndexed(wealthModal);
  }

  const crossBtn = wealthModal.querySelector('.wealth-inner1').cloneNode(true);
  const flag = wealthModal.querySelector('.icon-national-flag').cloneNode(true);
  const ragLable = wealthModal.querySelector('.wealth1 .wealth-inner2');
  const nameLab = wealthModal.querySelector('.wealth1 .wealth-inner3');
  const emailLab = wealthModal.querySelector('.wealth1 .wealth-inner4');
  const numLab = wealthModal.querySelector('.wealth1 .wealth-sub-inner2');
  const associatedLab = wealthModal.querySelector('.wealth1 .wealth-inner6');
  const botton = wealthModal.querySelector('.wealth1 .wealth-inner7');
  const mend = wealthModal.querySelector('.wealth1 .wealth-inner8');
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
        button({ class: 'btn', disabled: true }, botton.textContent),
        p({ class: 'mandatory' }, mend.textContent),
      ),
    ),
  );

  wealthModal.textContent = '';
  wealthModal.append(wealthRagisterModal);

  const assocDiv = wealthModal.querySelector('.inp-lab-div.associated-drop');
  const assocInput = assocDiv.querySelector('.associated-inp');
  const assocDrop = assocDiv.querySelector('.assoc-drop');
  const arrow = assocDiv.querySelector('.dropdown-arrow');

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

  const fields = [nameInput, emailInput, phoneInput, assocInput];
  const touchedFields = new Set();

  function validateForm() {
    // Ensure all fields are validated, including the associated dropdown
    return fields.every((f) => dataMapMoObj.validateField(f));
  }

  function toggleSubmitButton() {
    // FIX: removed hasAttribute('readonly') logic that was incorrectly marking assocInput as filled
    const allFilled = fields.every((f) => f.value.trim() !== '');
    const allValid = fields
      .every((f) => (touchedFields.has(f) ? dataMapMoObj.validateField(f) : true));

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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

  submitButton.addEventListener('click', async (e) => {
    e.preventDefault();
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
          'X-Encrypted-Key': 'N',
          appid: generateAppId(),
        };

        const response = await myAPI(
          'POST',
          'https://mf.moamc.com/ums/api/SaveLead/create-leads',
          objreq,
          headers,
        );

        const result = await response.json();
        // console.log('API Response:', result);

        if (response.ok) {
          alert('Your details have been submitted successfully!');
          // Reset form
          fields.forEach((f) => {
            f.value = '';
            const labelvar = f.parentElement.querySelector('.label');
            if (labelvar) labelvar.classList.remove('filled');
          });
          toggleSubmitButton();
        } else {
          alert(`Something went wrong: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        // console.error('API Error:', error);
        alert('Failed to submit form. Please try again later.');
      }
    } else {
      toggleSubmitButton();
    }
  });

  block.closest('.wealth-register')
    .classList.add('modal-show');
}
