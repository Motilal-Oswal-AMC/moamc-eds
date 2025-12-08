import {
  div,
  span,
  ul,
  li,
  h2,
  p,
  img,
  a,
} from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';
import dataCfObj from '../../scripts/dataCfObj.js';
// eslint-disable-next-line
import {
  evaluateByDays,
  wishlist,
} from '../../scripts/scripts.js';

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
export default function decorate(block) {
  let planFlow = 'Direct';
  if (document.querySelector('.fund-toggle-wrap [type="checkbox"]')) {
    planFlow = document.querySelector('.fund-toggle-wrap [type="checkbox"]')
      .checked
      ? 'Regular'
      : 'Direct';
  }
  const fundsTaggingSection = block.fundsTaggingSection.slice(0, 2);
  const finPlangrp = [];
  const tempReturns = [];

  const DirectPlanlistArr = block.planList.filter(
    (el) => el.planName === planFlow,
  );
  block.returns.forEach((ret) => {
    if (DirectPlanlistArr.length !== 0) {
      const grp = ret.plancode + ret.optioncode;
      if (DirectPlanlistArr[0].groupedCode === grp) {
        [...Object.keys(ret)].forEach((key) => {
          if (dataMapMoObj.ObjTemp[key]) {
            if (key === 'inception_Ret') {
              tempReturns.unshift(dataMapMoObj.ObjTemp[key]);
            } else {
              tempReturns.push(dataMapMoObj.ObjTemp[key]);
            }
          }
        });
        finPlangrp.push(ret);
      }
    }
  });

  const labelcagr = evaluateByDays(block.dateOfAllotment);
  const classplan = DirectPlanlistArr.length !== 0 && tempReturns.length !== 0 ? '' : ' not-provided';
  const dropdowndot = DirectPlanlistArr.length !== 0 ? '' : 'no-planlist';
  const [fstRetYear] = tempReturns;
  const valRet = dataMapMoObj.selectreturns === '' ? '3 Years' : dataMapMoObj.selectreturns;
  const returnYear = tempReturns.includes(valRet)
    ? valRet
    : fstRetYear;
  const iconsvg = `${dataMapMoObj.iconsNfo[
    block.risk.riskType.toLowerCase().replaceAll(' ', '-')
  ]}.svg`;
  const starClass = dataMapMoObj.schstar.includes(block.schcode)
    ? 'star-filled'
    : '';
  const mop = `/icons/schemeicons/MO_${block.schcode}.svg`;
  const dspdate = returnYear === 'Since Inception' ? 'block' : 'none';
  // const cagrValue = finPlangrp
  if (finPlangrp.length !== 0) {
    if ([...block.fundsTaggingSection].includes('NFO')) {
      const nfosvg = `${dataMapMoObj.iconsNfo[
        block.risk.riskType.toLowerCase().replaceAll(' ', '-')
      ]}.svg`;
      const NfocardContainer = div(
        { class: 'nfo-card-container card-container' },
        div(
          { class: 'card-wrapper' },
          div(
            { class: 'card-upper-title' },
            div(
              { class: 'brand-star-wrap' },
              div(
                { class: 'brand-logo' },
                img({
                  class: 'logoscheme',
                  src: `${mop}`,
                  alt: 'Img',
                }),
              ),
              div(
                { class: 'star-wrap' },
                span({ class: 'watchlistlabel' }, 'Watchlist'),
                div(
                  {
                    class: `star ${starClass}`,
                    onclick: (event) => {
                      if (
                        !Array.from(
                          event.target.parentElement.classList,
                        ).includes('star-filled')
                      ) {
                        event.target.parentElement.classList.add('star-filled');
                        event.target.closest('.watchlistlabel').textContent = 'Added to Watchlist';
                      } else {
                        event.target.parentElement.classList.remove(
                          'star-filled',
                        );
                        event.target.closest('.watchlistlabel').textContent = 'Watchlist';
                      }
                      wishlist();
                    },
                    schcode: block.schcode,
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
              ),
            ),
            div(
              { class: 'brand-fund-wrap' },
              h2(
                { class: 'fund-name-title' },
                block.schDetail.schemeName,
              ),
            ),
          ),
          div(
            { class: `card-category ${dropdowndot}` },
            div(
              { class: 'fund-tagging' },
              ul(
                { class: 'fundtagging-list' },
                ...fundsTaggingSection.map((eloption) => li(
                  { class: 'fundtagging-list-name' },
                  eloption
                    .replaceAll('motilal-oswal:', '')
                    .replaceAll('-', ' ')
                    .toUpperCase(),
                )),
              ),
            ),
          ),
          div(
            { class: 'banner-timing-container ' },
            div(
              { class: 'banner-container' },
              img({
                class: 'nfo-img',
                src: '/icons/nfo-banner.png',
                alt: 'NFO Image',
              }),
              span('Grab Them All'),
            ),
            div(
              { class: 'timing-nfo-value' },
              div(
                { class: 'timing-container' },
                span({ class: 'timing-text' }, `NFO Ends On: ${dataMapMoObj.formatDate(block.dateOfAllotment)}`),
              ),
              div(
                { class: 'dis-investor' },
                img({
                  class: 'riskfactor-icon',
                  src: `/icons/nfo-risk-icon/${nfosvg}`,
                  alt: 'risk icon',
                }),
              ),
            ),
          ),
          div(
            { class: 'button-container' },
            a(
              {
                href: 'https://www.motilaloswalmf.com/mutual-funds/motilal-oswal-special-opportunities-fund',
                class: 'know-more card-btn',
              },
              'Know More',
            ),
            a(
              {
                href: '/mutual-fund/in/en/modals/invest-now-homepage',
                class: 'invest-now card-btn',
              },
              'Invest',
            ),
          ),
        ),
      );
      return NfocardContainer;
    }
    const cardContainer = div(
      {
        class: 'card-container',
      },
      div(
        {
          class: 'card-wrapper',
        },
        div(
          {
            class: 'card-upper-title',
          },
          div(
            {
              class: 'brand-star-wrap',
            },
            div(
              {
                class: 'brand-logo',
              },
              img({
                class: 'logoscheme',
                src: `${mop}`,
                alt: 'Img',
              }),
            ),
            div(
              { class: 'star-wrap' },
              span({ class: 'watchlistlabel' }, 'Watchlist'),
              div(
                {
                  class: `star ${starClass}`,
                  onclick: (event) => {
                    if (
                      !Array.from(
                        event.target.parentElement.classList,
                      ).includes('star-filled')
                    ) {
                      event.target.parentElement.classList.add('star-filled');
                      event.target.parentElement.parentElement.querySelector('.watchlistlabel').textContent = 'Added to Watchlist';
                    } else {
                      event.target.parentElement.classList.remove(
                        'star-filled',
                      );
                      event.target.parentElement.parentElement.querySelector('.watchlistlabel').textContent = 'Watchlist';
                    }
                    wishlist();
                  },
                  schcode: block.schcode,
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
            ),
          ),
          div(
            {
              class: 'brand-fund-wrap',
            },
            h2(
              { class: 'fund-name-title' },
              block.schDetail.schemeName,
            ),
          ),
        ),
        div(
          {
            class: `card-category ${dropdowndot}`,
          },
          div(
            {
              class: 'fund-tagging',
            },
            ul(
              {
                class: 'fundtagging-list',
              },
              ...fundsTaggingSection.map((eloption) => li(
                { class: 'fundtagging-list-name' },
                toTitleCase(
                  eloption
                    .replaceAll('motilal-oswal:', '')
                    .replaceAll('-', ' '),
                ),
              )),
            ),
          ),
        ),
        div(
          {
            class: `cagr-container ${classplan}`,
          },
          div(
            {
              class: 'cagr-dropdown',
            },
            span({ class: 'cagr-txt' }, labelcagr),
            div(
              {
                class: 'cagr-select-wrapper',
              },
              p(
                {
                  class: 'selectedtext',
                  onclick: (event) => {
                    if (
                      Array.from(
                        event.target.nextElementSibling.classList,
                      ).includes('dropdown-active')
                    ) {
                      event.target.nextElementSibling.classList.remove(
                        'dropdown-active',
                      );
                    } else {
                      event.target.nextElementSibling.classList.add(
                        'dropdown-active',
                      );
                    }
                  },
                },
                returnYear,
                p(
                  {
                    class: 'cagr-date',
                    style: `display:${dspdate}`,
                  },
                  dataMapMoObj.formatDate(block.dateOfAllotment),
                ),
              ),
              ul(
                { class: 'dropdown-list' },
                ...tempReturns.map((eloption) => li(
                  {
                    class: 'returnyears',
                    value: dataMapMoObj.ObjTemp[eloption],
                    onclick: (event) => {
                      const cgarValue = finPlangrp[0][event.target.getAttribute('value')];
                      event.currentTarget
                        .closest('.dropdown-list')
                        .classList.remove('dropdown-active');
                      event.currentTarget
                        .closest('.cagr-select-wrapper')
                        .querySelector('p').innerText = '';
                      event.currentTarget
                        .closest('.cagr-select-wrapper')
                        .querySelector('p').innerText = event.currentTarget.textContent.trim();
                      event.target
                        .closest('.cagr-container')
                        .querySelector('.cagr-value .cagr-val-label').textContent = '';
                      event.target
                        .closest('.cagr-container')
                        .querySelector(
                          '.cagr-value .cagr-val-label',
                        ).textContent = `${cgarValue}`;
                      event.target
                        .closest('.cagr-container')
                        .querySelector('.cagr-value .cagr-val-label')
                        .append(span('%'));
                      if (
                        event.target.textContent.trim() === 'Since Inception'
                      ) {
                        event.currentTarget
                          .closest('.cagr-select-wrapper')
                          .querySelector('p').append(
                            p(
                              {
                                class: 'cagr-date',
                              },
                              dataMapMoObj.formatDate(block.dateOfAllotment),
                            ),
                          );
                      }
                    },
                  },
                  eloption,
                )),
              ),
            ),
          ),
          div(
            {
              class: 'cagr-value',
            },
            span({ class: 'cagr-val-label' }, `${finPlangrp[0][dataMapMoObj.ObjTemp[returnYear]]}`, span('%')),
            p(
              {
                class: 'scheme-yet',
                style: 'display:none',
              },
              'Scheme is yet to complete 10 Years',
            ),
          ),
          div(
            {
              class: 'cagr-desc',
            },
            span(
              { class: 'cagr-desc-text' },
              'Return is not provided because thescheme has not completed 6 months',
            ),
          ),
        ),
        div(
          {
            class: 'risk-container',
            style: 'display:none',
          },
          span({ class: 'risk-label' }, 'Risk Factor'),
          span({ class: 'risk-text' }, block.risk.riskType),
        ),
        div(
          {
            class: 'discription',
          },
          p(
            {
              class: 'dis-choosen',
            },
            // 'Chosen by ',
            div(
              {
                class: 'dis-investor',
              },
              img({
                class: 'icon person',
                src: '/icons/user-icon.svg',
                alt: 'person',
              }),
              span({ class: 'investor-txt' }, '2.7L Investors in this fund'),
            ),
            a(
              {
                href: '/mutual-fund/in/en/modals/risk-o-meter',
                onclick: (event) => {
                  const clasName = event.target.closest('body');
                  clasName.classList.add('scroll-lock');
                },
              },
              img({
                class: 'riskfactor-icon',
                src: `/icons/risk-icon/${iconsvg}`,
                alt: 'risk icon',
              }),
            ),
          ),
        ),
        div(
          { class: 'button-container' },
          a(
            {
              class: 'know-more card-btn',
              onclick: (event) => {
                let planFlowsec = 'Direct';
                if (event.target.closest('.right-container')) {
                  const flowparent = event.target.closest('.right-container');
                  const togglebtn = flowparent.querySelector('#toggle').checked;
                  planFlowsec = togglebtn ? 'Regular' : 'Direct';
                }
                const cardWrapper = event.target.closest('.card-wrapper');
                const cardWrapperStar = cardWrapper.querySelector('.star');
                const cardWrapperSh = cardWrapperStar.getAttribute('schcode');
                localStorage.setItem(
                  'planCode',
                  `${planFlowsec}:${cardWrapperSh}`,
                );
                let schCard;
                dataCfObj.cfDataObjs.forEach((el) => {
                  if (el.schcode === cardWrapperSh) {
                    schCard = el.schDetail.schemeName.toLowerCase().split(' ').join('-');
                  }
                });
                if (schCard === undefined) {
                  window.location.href = `${window.location.origin}/mutual-fund/in/en/our-funds/funds-details-page`;
                } else {
                  window.location.href = `${window.location.origin}/mutual-fund/in/en/our-funds/${schCard}`;
                }
              },
            },
            'Know More',
          ),
          a(
            {
              href: '/mutual-fund/in/en/modals/invest-now-homepage',
              class: 'invest-now card-btn',
            },
            'Invest',
          ),
        ),
      ),
    );
    return cardContainer;
  }
  return '';
}
