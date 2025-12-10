import {
  div,
  p,
  img,
  table,
  tbody,
  thead,
  tr,
  th,
  td,
} from '../../scripts/dom-helpers.js';

// import objData from '../../scripts/dataCfObj.js';
import dataMapMoObj from '../../scripts/constant.js';

// Set to `true` to use the live API.
const useLiveApi = true;

// The API endpoint is now a single URL.
// const fundManagerAPIv = 'https://www.motilaloswalmf.com/mutualfund/api/v1/GetFundMangerBySchemeId';

export default async function decorate(block) {
  let fundManagers;
  let agentData;
  let managerSchemes;
  let uniqueSchemes;
  let uniquePeriods;
  let sortedPeriods;
  if (dataMapMoObj.fundManagerDetails.length !== 0) {
    fundManagers = dataMapMoObj.fundManagerDetails;
  } else {
    fundManagers = dataMapMoObj.schemeCodeResp[0].fundManager;
  }
  const selectedAgent = localStorage.getItem('FM-AgentName');

  fundManagers.forEach((e) => {
    if (selectedAgent === e.fundManagerName.split(' ').join('')) {
      agentData = e;
    }
  });

  async function fundManagerAPI() {
    if (useLiveApi) {
      try {
        const tempDfilt = dataMapMoObj.getlisting.cfDataObjs.filter((el) => {
          if (!el.fundsTaggingSection || !el.planList || !el.returns) {
            return false;
          }
          return el;
        });
        // const schemeCodeValue = localStorage.getItem('schcodeactive');
        // let planFlow;
        let planslabel;
        if (window.location.href.includes('/our-funds/funds-details-page')) {
          planslabel = 'LM';
          // planFlow = 'Direct';
        } else {
          const path = window.location.pathname.split('/').at(-1);
          const planobj = tempDfilt.filter(
            (el) => path === el.schemeName.toLocaleLowerCase().split(' ').join('-'),
          );
          planslabel = planobj[0].schcode;
          // planFlow = 'Direct';
        }
        // Create the POST request to the API
        // const response = await fetch(fundManagerAPIv, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     api_name: 'GetFundMangerBySchemeId',
        //     schcode: schemeCodeValue,
        //   }),
        // });

        // if (!response.ok) {
        //   return;
        // }
        planslabel = dataMapMoObj.schemeCodeResp !== undefined
          ? dataMapMoObj.schemeCodeResp[0].schcode : planslabel;
        const data = await dataMapMoObj.getfundmanager(planslabel);
        const managerDetails = data.data.response.mangerDetails;
        const managerSchemesAll = data.data.response.schemeReturns;
        let managerId;
        managerDetails.forEach((el) => {
          if (el.managerName.split(' ').join('') === selectedAgent) {
            managerId = el.managerId;
          }
        });
        managerSchemes = managerSchemesAll.filter((item) => item.managerId === managerId);
        uniqueSchemes = [...new Map(managerSchemes.map((s) => [s.schemeName, s])).values()];
        uniquePeriods = [...new Set(managerSchemes.map((item) => item.period))];

        sortedPeriods = uniquePeriods
          .filter((pl) => pl.toLowerCase() !== 'si') // remove "si"
          .sort((a, b) => {
            // Extract number part (like 1, 3, 5)
            const numA = parseInt(a, 10);
            const numB = parseInt(b, 10);
            return numA - numB;
          });

        // Put "si" at the end
        if (uniquePeriods.includes('si')) {
          sortedPeriods.push('si');
        }
      } catch (error) {
        // console.log('failed', error);
      }
    }
  }
  await fundManagerAPI();
  const mopdata = [
    'ajay-khandelwal',
    'atul-mehra',
    'niket-shah',
    'rakesh-shetty',
  ];
  const dataflg = mopdata.includes(agentData.fundManagerName.toLowerCase().replace(/\s+/g, '-'));
  let datafundimg;
  if (dataflg) {
    datafundimg = agentData.fundManagerName.toLowerCase().replace(/\s+/g, '-');
  } else {
    datafundimg = 'person';
  }
  const portfolioBlock = div(
    { class: 'portfolio-composition' },
    div(
      { class: 'fm-details' },
      img({ src: `/icons/fund-managers/${datafundimg}.svg`, alt: 'managerpic', class: 'fm-img' }),
      div(
        { class: 'fm-dealer-details' },
        p({ class: 'managername' }, agentData.fundManagerName),
        p({ class: 'designation' }, agentData.designation),
      ),
    ),
    div({ class: 'fm-param' }),
  );

  try {
    const tablediv = div(
      { class: 'fm-scheme-table' },
      table(
        thead(
          tr(
            th({ rowspan: '2' }, 'Scheme name'),
            ...sortedPeriods.map((item) => th({ colspan: '2' }, item)),
          ),
          tr(
            ...sortedPeriods.flatMap(() => [
              th('Scheme'),
              th('Benchmark'),
            ]),
          ),
        ),
        tbody(
          ...uniqueSchemes.map((scheme) => tr(
            td({ class: 'fundname', colspan: '2' }, scheme.schemeName), // scheme name
            // td(" "),
            ...sortedPeriods.flatMap((period) => {
              // find scheme record for this period
              const record = managerSchemes.find(
                (s) => s.schemeName === scheme.schemeName && s.period === period,
              );
              return [
                td(record?.schReturnCagr?.trim()
                  ? `${parseFloat(record.schReturnCagr).toFixed(2)}%`
                  : 'N/A'),
                td(record?.fixedbmreturncagr?.trim()
                  ? `${parseFloat(record.fixedbmreturncagr).toFixed(2)}%`
                  : 'N/A'),
              ];
            }),
          )),
        ),
      ),
    );
    if (sortedPeriods.length === 0
      && uniqueSchemes.length === 0
      && managerSchemes.length === 0) {
      portfolioBlock.append('');
    } else {
      portfolioBlock.append(tablediv);
    }
  } catch (error) {
    portfolioBlock.append('');
  }

  block.innerHTML = '';
  portfolioBlock.querySelector('.fm-param').innerHTML = agentData.description.replaceAll('br&gt;', '').replaceAll('&lt;', '');
  block.append(portfolioBlock);

  // const closeButton = block.parentElement.parentElement.querySelector('.icon-modal-btn');
  // if (closeButton) {
  //   // document.body.classList.add('noscroll');
  //   closeButton.addEventListener('click', (e) => {
  //     e.stopPropagation(); // Stop click from bubbling further
  //     document.body.classList.remove('noscroll');
  //     document.querySelector('.fdp-card-container').classList.remove('.modal-active-parent');
  //     block.closest('.modal').remove();
  //   });
  // }

  // added show modal

  const delay = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });
  async function removeClassAfterDelay(time) {
    await delay(time);
    const bodym = document.querySelector('body');
    bodym.classList.remove('modal-open');
    bodym.classList.remove('noscroll');
    block.closest('.modal').remove();
  }
  const paramo = block.closest('.fm-portfolio-container');
  paramo.classList.add('modal-show');
  paramo.classList.remove('hide-modal');
  if (block.closest('.fm-portfolio-container')) {
    const colseicon = paramo.querySelector('.fm-portfolio-container .icon-modal-cross-btn');// ('.co-branding-container');
    colseicon.addEventListener('click', () => {
      const mainmodal = block.closest('.fm-portfolio-container');
      mainmodal.classList.remove('modal-show');
      mainmodal.classList.add('hide-modal');
      removeClassAfterDelay(1200);
    });
  }
}
