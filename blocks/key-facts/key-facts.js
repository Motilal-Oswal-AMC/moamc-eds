/*    */
// import dataCfObj from '../../scripts/dataCfObj.js';
import dataMapMoObj from '../../scripts/constant.js';
import {
  div,
  span,
  li,
  p,
  ul,
} from '../../scripts/dom-helpers.js';

export default async function decorate(block) {
  const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
    if (!el.fundsTaggingSection || !el.planList || !el.returns) {
      return false;
    }
    return el;
  });
  Array.from(block.children).forEach((el, index) => {
    el.classList.add(`block-item${index + 1}`);
    Array.from(el.children).forEach((elsub, ind) => {
      elsub.classList.add(`block-subitem${ind + 1}`);
      Array.from(elsub.children).forEach((finelsub, sub) => {
        finelsub.classList.add(`block-subitem-finelsub${sub + 1}`);
      });
    });
  });

  const planCode = localStorage.getItem('planCode');
  let planFlow;
  let planslabel;
  if (planCode !== null) {
    [planFlow, planslabel] = planCode.split(':');
  } else if (window.location.href.includes('/our-funds/funds-details-page')) {
    planslabel = 'LM';
    planFlow = 'Direct';
  } else {
    const path = window.location.pathname.split('/').at(-1);
    const planobj = tempDfilt.filter(
      (el) => path === el.schemeName.toLocaleLowerCase().split(' ').join('-'),
    );
    planslabel = planobj[0].schcode;
    planFlow = 'Direct';
  }
  // const [planFlow, planslabel] = planCode.split(':');
  let planObj;
  //= tempDfilt.filter((el) => planslabel === el.schcode);
  if (dataMapMoObj.schemeCodeResp === undefined || dataMapMoObj.schemeCodeResp === null || dataMapMoObj.schemeCodeResp === '') {
    planObj = await dataMapMoObj.getscheme(planslabel);
  } else {
    planObj = dataMapMoObj.schemeCodeResp;
  }
  const data = planObj;
  const DirectPlanlistArr = planObj[0].planList.filter(
    (el) => el.planName === planFlow,
  );
  function dateFormat(date) {
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return formattedDate;
  }
  const keyFactsSection = div(
    { class: 'key-facts-section' },

    div(
      { class: 'investment-objective' },
      p(block.querySelector('.block-subitem-finelsub1')),
      p(
        { class: 'investment-discripstion' },
        'The fund aims for medium to long-term capital appreciation by primarily investing in Large and Midcap stocks, though this objective... ',
      ),
    ),
    div(
      { class: 'key-facts-amounts' },
      div(
        { class: 'minimum-amount' },
        div(
          { class: 'Application-Amount' },
          p(
            { class: 'key-facts-amounts-title' },
            block.querySelector('.block-subitem-finelsub2'),
          ),
          p(
            { class: 'key-facts-amounts-sub' },
            '₹500/- and in multiples of ₹1/- thereafter',
          ),
        ),
        div(
          { class: 'redemption-amount' },
          p(
            { class: 'key-facts-amounts-title' },
            block.querySelector('.block-subitem-finelsub3'),
          ),
          p(
            { class: 'key-facts-amounts-sub' },
            '₹500/- then ₹1/- increments, up to account balance',
          ),
        ),
      ),
      div(
        { class: 'key-plans' },
        div(
          { class: 'aum-benchmark' },
          div(
            { class: 'aum-groups' },
            div(
              { class: 'aum' },
              p(block.querySelector('.block-subitem-finelsub4')),
              p(
                `₹${data[0].aum[0].latestAum}`,
                span(`(as on ${dateFormat(data[0].aum[0].latestAumAsOnDt)})`),
              ),
            ),
            div(
              { class: 'portfolio' },
              p(block.querySelector('.block-subitem-finelsub1')),
              p(data[0].portfolioTurnoverRatio),
            ),
            div(
              { class: 'Plans' },
              p(
                block.querySelector('.block-subitem2 .block-subitem-finelsub2'),
              ),
              p(DirectPlanlistArr[0].planName),
            ),
            div(
              { class: 'options' },
              p(
                block.querySelector('.block-subitem2 .block-subitem-finelsub3'),
              ),
              p(DirectPlanlistArr[0].optionName),
            ),
          ),
          div(
            { class: 'benchmark-groups' },
            div(
              { class: 'Benchmark' },
              p(
                block.querySelector('.block-subitem2 .block-subitem-finelsub4'),
              ),
              p(data[0].benchmark),
            ),
            div(
              { class: 'expense-ratio' },
              p(
                block.querySelector('.block-subitem3 .block-subitem-finelsub1'),
              ),
              p('nil'), // not found
            ),
            div(
              { class: 'Inception-date' },
              p(
                block.querySelector('.block-subitem3 .block-subitem-finelsub2'),
              ),
              p(data[0].benchmarkreturns[0].latNavDate),
            ),
            div(
              { class: 'entry-load' },
              p(
                block.querySelector('.block-subitem3 .block-subitem-finelsub3'),
              ),
              p({ class: 'entry-load-detail' }, 'nil'),
            ),
          ),
        ),
        div(
          { class: 'load-policy' }, // not found
          p(
            { class: 'load-policy-para' },
            block.querySelector('.block-subitem3 .block-subitem-finelsub4'),
          ),
          div(
            { class: 'load-policy-list' },
            ul(
              { class: 'load-policy-list-ul' },
              li(
                '1% exit load applies if redeemed within 365 days of allotment.',
              ),
              li('No exit load applies if redeemed after 365 days.'),
              li(
                'Exit load is applicable when switching between different MOMF Schemes.',
              ),
              li(
                'No exit load for switching between options or plans within the same Scheme.',
              ),
            ),
          ),
        ),
      ),
    ),
  );
  block.appendChild(keyFactsSection);
  // Add Read More / Read Less functionality
  const fullText = data[0].investmentObjective || '';
  const textContent = fullText?.replaceAll(/<\/?[^>]+(>|$)/g, '') || ''; // Strip HTML tags for counting
  const words = textContent?.split(/\s+/) || '';
  const preview = words.slice(0, 20).join(' ') + (words.length > 20 ? '...' : '');

  const container = block.querySelector('.investment-discripstion');

  // Create preview paragraph
  // const previewPara = document.createElement('p');
  if (!preview) {
    document.querySelector('.investment-objective').style.display = 'none';
  }
  // previewPara.innerHTML = preview;

  // Create toggle button
  const toggleBtn = document.createElement('span');
  toggleBtn.textContent = 'Read More';
  toggleBtn.className = 'read-toggle-btn';
  // toggleBtn.style.marginLeft = '10px';
  // toggleBtn.style.cursor = 'pointer';
  // toggleBtn.style.color = 'blue';

  // Append preview and button initially
  container.innerHTML = '';
  container.textContent = preview;
  container.appendChild(toggleBtn);

  if (words.length > 20) {
    toggleBtn.addEventListener('click', () => {
      container.innerHTML = '';

      if (toggleBtn.textContent === 'Read More') {
        // const fullPara = document.createElement('p');
        container.textContent = textContent;
        // container.appendChild(fullPara);
        toggleBtn.textContent = 'Read Less';
      } else {
        // const previewParaAgain = document.createElement('p');
        container.textContent = preview;
        // container.appendChild(previewParaAgain);
        toggleBtn.textContent = 'Read More';
      }

      container.appendChild(toggleBtn);
    });
  }
  block.querySelector('.entry-load-detail').innerHTML = data[0].entryLoad.toLowerCase();
  block.querySelector('.load-policy-list').innerHTML = '';
  const replacepara = data[0].schDetail.exitLoad.replaceAll('<p>', '<li>').toLowerCase();
  const replaceparatwo = replacepara.replaceAll('</p>', '</li>').toLowerCase();
  const prarrep = replaceparatwo.replaceAll('<li>&nbsp;</li>', '').toLowerCase();

  const ulCover = document.createElement('ul');
  ulCover.className = 'load-policy-list-ul';
  ulCover.innerHTML = prarrep;
  block.querySelector('.load-policy-list').append(ulCover);
  // block.querySelector('.load-policy-list').innerHTML = prarrep;

  const brEl = document.createElement('br');
  const keyplan = document.querySelector('.key-plans span');
  const keyplanparent = document.querySelector('.key-plans span').parentElement;
  keyplanparent.append(brEl);
  keyplanparent.append(keyplan);

  const dateLaunch = block.closest('.key-facts-container');
  const datelch = dateLaunch.querySelector('.default-content-wrapper ol ol').children;
  datelch[1].textContent = '';
  datelch[1].textContent = `Launched on ${dateFormat(planObj[0].dateOfAllotment)}`;
}
