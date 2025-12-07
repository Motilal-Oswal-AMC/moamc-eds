import {
  button,
  div,
  span,
  p,
  img,
  a,
} from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';
import {
  getTimeLeft,
  evaluateByDays,
  wishlist,
} from '../../scripts/scripts.js';

export default function decorate(block) {
  let planFlow = 'Direct';
  if (document.querySelector('.fund-toggle-wrap [type="checkbox"]')) {
    planFlow = document.querySelector('.fund-toggle-wrap [type="checkbox"]')
      .checked
      ? 'Regular'
      : 'Direct';
  }
  const iconsvg = `${
    dataMapMoObj.iconsNfo[
      block.risk.riskType.toLowerCase().replaceAll(' ', '-')
    ]
  }.svg`;
  const labelcagr = evaluateByDays(block.dateOfAllotment);
  const finPlangrp = [];
  const tempReturns = [];
  // initallize
  const DirectPlanlistArr = block.planList.filter(
    (el) => el.planName === planFlow,
  );
  block.returns.forEach((ret) => {
    if (DirectPlanlistArr.length !== 0) {
      const grp = ret.plancode + ret.optioncode;
      if (DirectPlanlistArr[0].groupedCode === grp) {
        [...Object.keys(ret)].forEach((key) => {
          if (dataMapMoObj.ObjTemp[key]) {
            tempReturns.push(dataMapMoObj.ObjTemp[key]);
          }
        });
        finPlangrp.push(ret);
      }
    }
  });
  // Get the code to match ONCE. If DirectPlanlistArr is empty, this will be undefined.
  const groupedCodeToMatch = DirectPlanlistArr[0]?.groupedCode;

  // Now filter. The comparison will fail safely if groupedCodeToMatch is undefined.
  const cagrValve = block.returns.filter(
    (el) => el.plancode + el.optioncode === groupedCodeToMatch,
  );
  let ret;
  if (dataMapMoObj.selectreturns !== '') {
    ret = dataMapMoObj.ObjTemp[dataMapMoObj.selectreturns];
  } else {
    ret = 'threeYear_Ret';
  }
  let cagrval;
  if (cagrValve.length !== 0 && cagrValve[0][ret]) {
    cagrval = cagrValve[0][ret];
  } else {
    cagrval = 'N/A';
  }
  const stylecagrval = cagrval === 'N/A' ? 'none' : 'flex';

  const starClass = dataMapMoObj.schstar.includes(block.schcode)
    ? 'star-filled'
    : '';
  if (finPlangrp.length !== 0) {
    if ([...block.fundsTaggingSection].includes('NFO')) {
      const nfosvg = `${
        dataMapMoObj.iconsNfo[
          block.risk.riskType.toLowerCase().replaceAll(' ', '-')
        ]
      }.svg`;
      const mop = `MO_${block.schcode}.svg`;

      const listcontainer = div(
        { class: 'nfo-list-container list-view-container' },
        div(
          { class: 'list-wrapper' },
          div(
            { class: 'fund-name-wrapper', schcode: block.schcode },
            div(
              { class: 'fund-inner-wrapper' },
              div(
                { class: 'logo-container' },
                img({
                  class: 'fund-logo',
                  src: `/icons/schemeicons/${mop}`,
                  alt: 'Img',
                }),
              ),
              div(
                { class: 'fund-name-container' },
                p(
                  { class: 'fund-name-txt' },
                  block.schemeName,
                ),
              ),
              img({
                class: 'logoscheme',
                src: '/icons/nfo-righticon.svg',
                alt: 'Direction Right',
              }),
            ),
            div(
              { class: 'timing-nfo-value' },
              div(
                { class: 'nfo-container' },
                span({ class: 'label-nfo' }, 'NFO'),
              ),
              div(
                { class: 'timing-container' },
                p(getTimeLeft(block.dateOfAllotment)),
              ),
            ),
          ),
          div(
            { class: 'cagr-return' },
            div({ class: 'cagr-value' }, 'N/A'),
          ),
          div(
            { class: 'risk-star-icon' },
            a(
              {
                href: '/mutual-fund/in/en/modals/risk-o-meter',
                class: 'risk-icon',
              },
              img({
                class: 'riskfactor-icon',
                src: `/icons/nfo-risk-icon/${nfosvg}`,
                alt: 'risk icon',
              }),
            ),
          ),
          div(
            {
              class: `star ${starClass}`,
              schcode: block.schcode,
              onclick: (event) => {
                if (
                  !Array.from(event.target.parentElement.classList).includes(
                    'star-filled',
                  )
                ) {
                  event.target.parentElement.classList.add('star-filled');
                } else {
                  event.target.parentElement.classList.remove('star-filled');
                }
                wishlist();
              },
            },
            img({
              class: 'star-icon',
              src: '/icons/not-filled-white-star.svg',
              alt: 'star-icon',
            }),
            img({
              class: 'fillstar-icon',
              src: '/icons/filled-star.svg',
              alt: 'fillstar-icon',
            }),
          ),
          div({ class: 'btn-invest' }, button('Invest')),
        ),
      );
      return listcontainer;
    }
    const mopsec = `MO_${block.schcode}.svg`;
    const listcontainer = div(
      { class: 'list-view-container' },
      div(
        { class: 'list-wrapper' },
        div(
          { class: 'fund-name-wrapper', schcode: block.schcode },
          div(
            { class: 'logo-container' },
            img({ class: 'fund-logo', src: `/icons/schemeicons/${mopsec}`, alt: 'Img' }),
          ),
          div(
            { class: 'fund-name-container' },
            p({ class: 'fund-name-txt' }, block.schemeName),
          ),
          img({
            class: 'logoscheme',
            src: '/icons/direction-right.svg',
            alt: 'Direction Right',
          }),
        ),
        div(
          { class: 'cagr-return' },
          div(
            { class: 'cagr-value' },
            `${cagrval}`,
            span({ style: `display:${stylecagrval}` }, '%'),
          ),

          p({ class: 'cagr-text' }, labelcagr.replace('Return', '')),
        ),
        div(
          { class: 'risk-star-icon' },
          a(
            {
              href: '/mutual-fund/in/en/modals/risk-o-meter',
              class: 'risk-icon',
            },
            img({
              class: 'riskfactor-icon',
              src: `/icons/risk-icon/${iconsvg}`,
              alt: 'risk icon',
            }),
          ),
        ),
        div(
          {
            class: `star ${starClass}`,
            schcode: block.schcode,
            onclick: (event) => {
              if (
                !Array.from(event.target.parentElement.classList).includes(
                  'star-filled',
                )
              ) {
                event.target.parentElement.classList.add('star-filled');
              } else {
                event.target.parentElement.classList.remove('star-filled');
              }
              wishlist();
            },
          },
          img({
            class: 'star-icon',
            src: '/icons/not-filled-star.svg',
            alt: 'star-icon',
          }),
          img({
            class: 'fillstar-icon',
            src: '/icons/filled-star.svg',
            alt: 'fillstar-icon',
          }),
        ),
        div({ class: 'btn-invest' }, button('Invest')),
      ),
    );
    return listcontainer;
  }
  return '';
}
