import {
  div,
  h2,
  button,
  input,
  form,
  label,
  p,
  span,
} from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  const crosImage = Array.from(block.querySelectorAll('p'))[0];
  if (block.querySelector('h4') === null) {
    return false;
  }
  const heading = block.querySelector('h4').textContent.trim();
  const arn = Array.from(block.querySelectorAll('p'))[1].textContent;
  const distributor = Array.from(block.querySelectorAll('p'))[2].textContent;
  const mobilenum = Array.from(block.querySelectorAll('p'))[3].textContent;
  const email = Array.from(block.querySelectorAll('p'))[4].textContent;
  const preparedfor = Array.from(block.querySelectorAll('p'))[5].textContent;
  const euin = Array.from(block.querySelectorAll('p'))[6].textContent;
  const sharebtn = Array.from(block.querySelectorAll('p'))[7].textContent;
  const downloadbtn = Array.from(block.querySelectorAll('p'))[8].textContent;
  const diclaimerText = block.querySelector('ul li p').textContent;
  const diclaimerUl = block.querySelector('ul ul');
  diclaimerUl.classList.add('co-ullist');
  block.querySelector('.co-ullist').querySelectorAll('li');
  Array.from(block.querySelector('.co-ullist').children).forEach((el) => {
    el.classList.add('co-listname');
  });
  crosImage.querySelector('img').classList.add('crossbtn');
  crosImage.classList.add('crossparbtn');

  const coBrandingSection = div(
    { class: 'co-branding-section' },
    crosImage,
    h2({ class: 'co-heading' }, heading),
    form(
      { class: 'cobrand-form' },
      div(
        { class: 'cobrand-field' },
        label({ class: 'cobrand-label', for: 'ARN' }, arn),
        input({
          class: 'cobrand-input',
          type: 'text',
          id: 'ARN',
          name: 'ARN',
          required: true,
        }),
        span({ class: 'error-msg' }, 'Please enter valid ARN Number'),
      ),
      div(
        { class: 'cobrand-field' },
        label({ class: 'cobrand-label', for: 'distributor-name' }, distributor),
        input({
          class: 'cobrand-input',
          type: 'text',
          id: 'distributor-name',
          name: 'distributor-name',
          required: true,
        }),
        span({ class: 'error-msg' }, 'Please enter valid Distributor Name'),
      ),
      div(
        { class: 'cobrand-field' },
        label({ class: 'cobrand-label', for: 'mobile-number' }, mobilenum),
        input({
          class: 'cobrand-input',
          type: 'text',
          id: 'mobile-number',
          name: 'mobile-number',
          required: true,
        }),
        span({ class: 'error-msg' }, 'Please enter valid Mobile Number'),
      ),
      div(
        { class: 'cobrand-field' },
        label({ class: 'cobrand-label', for: 'email' }, email),
        input({
          class: 'cobrand-input',
          type: 'email',
          id: 'email',
          name: 'email',
          required: true,
        }),
        span({ class: 'error-msg' }, 'Please enter valid Email'),
      ),
      div(
        { class: 'cobrand-field' },
        label({ class: 'cobrand-label', for: 'prepared-for' }, preparedfor),
        input({
          class: 'cobrand-input',
          type: 'text',
          id: 'prepared-for',
          name: 'prepared-for',
          required: true,
        }),
        span({ class: 'error-msg' }, 'Please enter valid Prepared'),
      ),
      div(
        { class: 'cobrand-field' },
        label({ class: 'cobrand-label', for: 'euin' }, euin),
        input({
          class: 'cobrand-input',
          type: 'text',
          id: 'euin',
          name: 'euin',
          required: true,
        }),
        span({ class: 'error-msg' }, 'Please enter valid EUIN'),
      ),
    ),
    div(
      { class: 'cobrand-btns' },
      button({ class: 'share' }, sharebtn),
      button({ class: 'download' }, downloadbtn),
    ),
    div(
      { class: 'cobrand-disc' },
      p({ class: 'co-diclaimer' }, diclaimerText),
      div({ class: 'co-listwrap' }, diclaimerUl),
    ),
  );

  block.textContent = '';
  block.append(coBrandingSection);

  // validate start coheading
  const distributorName = block.querySelector('#distributor-name');
  const coheadingMobilNumber = block.querySelector('#mobile-number');
  coheadingMobilNumber.setAttribute('maxLength', 10);
  const coheadingEmail = block.querySelector('#email');
  const coPrepared = block.querySelector('#prepared-for');
  const coEuin = block.querySelector('#euin');
  const ARN = block.querySelector('#ARN');

  coheadingMobilNumber.addEventListener('input', (e) => {
    const panRegex = /^\d{10}$/;
    const inputValue = e.target.value.toUpperCase();
    const errorPanEl = e.target.nextElementSibling;
    if (panRegex.test(inputValue)) {
      errorPanEl.classList.remove('show-error');
      errorPanEl.classList.add('hide-error');
      // userLoginPanNumber.setAttribute('readonly', true);
    } else {
      errorPanEl.classList.remove('hide-error');
      errorPanEl.classList.add('show-error');
    }
  });

  coheadingEmail.addEventListener('input', (e) => {
    const panRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const inputValue = e.target.value.toUpperCase();
    const errorPanEl = e.target.nextElementSibling;
    if (panRegex.test(inputValue)) {
      errorPanEl.classList.remove('show-error');
      errorPanEl.classList.add('hide-error');
      // userLoginPanNumber.setAttribute('readonly', true);
    } else {
      errorPanEl.classList.remove('hide-error');
      errorPanEl.classList.add('show-error');
    }
  });

  distributorName.addEventListener('input', (e) => {
    const panRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    const inputValue = e.target.value.toUpperCase();
    const errorPanEl = e.target.nextElementSibling;
    if (panRegex.test(inputValue)) {
      errorPanEl.classList.remove('show-error');
      errorPanEl.classList.add('hide-error');
      // userLoginPanNumber.setAttribute('readonly', true);
    } else {
      errorPanEl.classList.remove('hide-error');
      errorPanEl.classList.add('show-error');
    }
  });

  ARN.addEventListener('input', (e) => {
    const panRegex = /^\d{10}$/;
    const inputValue = e.target.value.toUpperCase();
    const errorPanEl = e.target.nextElementSibling;
    if (panRegex.test(inputValue)) {
      errorPanEl.classList.remove('show-error');
      errorPanEl.classList.add('hide-error');
      // userLoginPanNumber.setAttribute('readonly', true);
    } else {
      errorPanEl.classList.remove('hide-error');
      errorPanEl.classList.add('show-error');
    }
  });

  coEuin.addEventListener('input', (e) => {
    const panRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    const inputValue = e.target.value.toUpperCase();
    const errorPanEl = e.target.nextElementSibling;
    if (panRegex.test(inputValue)) {
      errorPanEl.classList.remove('show-error');
      errorPanEl.classList.add('hide-error');
      // userLoginPanNumber.setAttribute('readonly', true);
    } else {
      errorPanEl.classList.remove('hide-error');
      errorPanEl.classList.add('show-error');
    }
  });

  coPrepared.addEventListener('input', (e) => {
    const panRegex = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
    const inputValue = e.target.value.toUpperCase();
    const errorPanEl = e.target.nextElementSibling;
    if (panRegex.test(inputValue)) {
      errorPanEl.classList.remove('show-error');
      errorPanEl.classList.add('hide-error');
      // userLoginPanNumber.setAttribute('readonly', true);
    } else {
      errorPanEl.classList.remove('hide-error');
      errorPanEl.classList.add('show-error');
    }
  });

  // end coheading

  // const coBrand = document.querySelectorAll('.subbreadcrb4');
  // console.log(coBrand);
  const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
  async function removeClassAfterDelay() {
    await delay(1200);
    block.closest('.modal').remove();
    const bodym = document.querySelector('body');
    bodym.classList.remove('modal-open');
    bodym.classList.remove('noscroll');
  }
  const paramo = block.closest('.co-branding-container');
  paramo.classList.add('modal-show');
  paramo.classList.remove('hide-modal');
  if (block.closest('.co-branding-container')) {
    const colseicon = block.querySelector('.crossparbtn');// ('.co-branding-container');
    colseicon.addEventListener('click', () => {
      const mainmodal = block.closest('.co-branding-container');
      mainmodal.classList.remove('modal-show');
      mainmodal.classList.add('hide-modal');
      removeClassAfterDelay();
    });
  }
  return block;
}
