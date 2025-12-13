import {
  div, input, label, img,
} from '../../scripts/dom-helpers.js';

import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = [
    'wealth-form',
    'wealth-form-inner',
    'wealth-form-inner-sub',
    'wealth-form-sub',
    'wealth-formsub-inner',
  ];
  dataMapMoObj.addIndexed(block);

  const indImg = block.querySelector(' .wealth-form-sub1 .wealth-formsub-inner1 img').src;
  const contCode = block.querySelector('.wealth-form-inner-sub2 .wealth-form-sub2');
  const numLable = block.querySelector('.wealth-form-inner-sub2 .wealth-form-sub3');
  const emailLable = block.querySelector('.wealth-form-inner-sub2 .wealth-form-sub4');
  const submitBtn = block.querySelector('.wealth-form-inner-sub2 .wealth-form-sub5');

  const wealthFormModal = div(
    { class: 'form-container' },
    div(
      { class: 'num-cont-wrapper' },
      div(
        { class: 'cont-wrapper' },
        div(
          { class: 'ind-svg' },
          img({ class: 'ind-img', src: indImg }),
        ),
        div({ class: 'cont-code' }, contCode),
      ),
      div(
        { class: 'num-label-inp' },
        label({ class: 'num-label' }, numLable),
        input({ class: 'num-input' }),
      ),

    ),
    div(
      { class: 'email-submit-wrapper' },
      div(
        { class: 'email-label-inp' },
        label({ class: 'email-label' }, emailLable),
        input({ class: 'email-imput' }),
      ),
      div({ class: 'submit-btn' }, submitBtn),
    ),
  );

  const formData = block.querySelector('.wealth-form-inner-sub2');
  formData.innerHTML = '';
  formData.appendChild(wealthFormModal);
}
