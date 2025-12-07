import {
  div,
  span,
  h2,
  p,
  img,
  a,
} from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';
// import dataCfObj from '../../scripts/dataCfObj.js';

export default function decorate(block) {
  Array.from(block.children).forEach((child, ind) => {
    child.classList.add(`watchlist-items${ind + 1}`);
    Array.from(child.children).forEach((subChild, subind) => {
      subChild.classList.add(`watchlist-subitems${subind + 1}`);
      Array.from(subChild.children).forEach((innerChild, innerind) => {
        innerChild.classList.add(`watchlist-inneritems${innerind + 1}`);
      });
    });
  });

  const data = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
    if (!el.fundsTaggingSection) {
      return false;
    }
    return [...el.fundsTaggingSection].includes('motilal-oswal:conservative');
  });

  const cardContainer = div(
    { class: 'card-wrapper' },
    div(
      { class: 'card-left' },
      div(
        {
          class: 'card-left-title',
        },
        img({
          class: 'watchlist-logo',
          src: block.querySelector('.watchlist-items1 img').src,
          alt: 'BrandLogo',
        }),
        div(
          { class: 'titlewrapper' },
          h2(
            { class: 'card-title' },
            block.querySelector('.watchlist-items1 .watchlist-inneritems2')
              .innerText,
          ),
        ),
      ),
      div(
        { class: 'button-wrapper' },
        block.querySelector('.watchlist-items1 .watchlist-inneritems3'),
      ),
    ),
    div(
      { class: 'card-coner' },
      div(
        { class: 'card-right' },
        div(
          { class: 'upper-right' },
          div(
            { class: 'fund-logo' },
            img({ src: '/icons/Group.svg', alt: 'FundLogo' }),
          ),
          div(
            { class: 'wishlist-icon' },
            a(
              { href: '/mutual-fund/in/en/modals/risk-o-meter', class: 'risk-meter-icon' },
              img({
                class: 'riskfactor-icon',
                src: '/icons/risk-icon/high-risk.svg',
                alt: 'risk icon',
              }),
            ),
            block.querySelector('.watchlist-items2 .watchlist-inneritems2'),
          ),
        ),
        div(
          { class: 'lower-right' },
          div(
            { class: 'fund-name-card' },
            // p(
            //   { class: 'brand-text' },
            //   block.querySelector('.watchlist-items2 .watchlist-inneritems1')
            //     .innerText,
            // ),
            div(
              { class: 'fund-name' },
              data[0].schemeName, // .replaceAll('Motilal Oswal', ''),
            ),
          ),
          div(
            { class: 'fund-returns' },
            p({ class: 'returns-text' }, 'Annualised'),
            div(
              { class: 'returns' },
              p({ class: 'returns-percent' }, data[0].returns[0].oneYear_Ret ? data[0].returns[0].oneYear_Ret : '10'),
              span({ class: 'returns-percentage' }, '%'),
            ),
          ),
        ),
      ),
    ),
  );
  block.innerHTML = '';
  block.appendChild(cardContainer);
}
