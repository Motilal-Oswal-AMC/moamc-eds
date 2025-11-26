import { toClassName } from '../../scripts/aem.js';
import dataCfObj from '../../scripts/dataCfObj.js';
// eslint-disable-next-line
import fundCardblock from '../fund-card/fund-card.js';
import {
  button, a, div, input, ul, li, img, table, thead, tbody, tr, th, td, p,
} from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';
// import moEdge from './popular-acticles.js';

export default async function decorate(block) {
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  // decorate tabs and tabpanels
  const tabs = [...block.children].map((child) => child.firstElementChild);
  tabs.forEach((tab, i) => {
    const id = toClassName(tab.textContent);

    // decorate tabpanel
    const tabpanel = block.children[i];
    tabpanel.className = 'tabs-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    if (i === 0 && tabpanel.querySelector('.section')) {
      tabpanel.querySelector('.section').style.display = 'flex';
    }

    // build tab button
    const tabbtn = document.createElement('button');
    tabbtn.className = 'tabs-tab';
    tabbtn.id = `tab-${id}`;
    tabbtn.innerHTML = tab.innerHTML;
    tabbtn.setAttribute('aria-controls', `tabpanel-${id}`);
    tabbtn.setAttribute('aria-selected', !i);
    tabbtn.setAttribute('role', 'tab');
    tabbtn.setAttribute('type', 'button');
    tabbtn.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      tabbtn.setAttribute('aria-selected', true);
      if (tabpanel.querySelector('.tabs-list')) {
        const idattr = tabpanel.querySelector('.tabs-list [aria-selected="true"]').getAttribute('id');
        const attr = idattr.replace('tab', 'tabpanel');
        tabpanel.querySelector(`#${attr}`).setAttribute('aria-hidden', false);
        tabpanel.querySelector(`#${attr} .section`).style.display = 'block';
        tabpanel.querySelector(`#${attr} .section`).style.display = 'flex';
      }

      // Investor Landing - Our Service Tab Gradient
      const ourServiceTab = block.closest('main').querySelector('.our-service.block');
      if (ourServiceTab !== null) {
        const ourServiceTabList = ourServiceTab.querySelector('.tabs-list');
        if ((Array.from(ourServiceTabList.children).length - 3) > i) {
          ourServiceTab.classList.add('gradient-show');
          ourServiceTabList.children[i].setAttribute('aria-selected', true);
        } else {
          ourServiceTab.classList.remove('gradient-show');
          ourServiceTabList.children[i].setAttribute('aria-selected', true);
        }
      }
    });
    tablist.append(tabbtn);
    tab.remove();
  });

  block.prepend(tablist);
  Array.from(block.querySelectorAll('.tabs-panel')).forEach((el, index) => {
    el.classList.add(`tabpanel${index + 1}`);
  });
  if (block.closest('.our-popular-funds')) {
    block.closest('.our-popular-funds').classList.add('fund-tab');
    let dataCf = dataCfObj.cfDataObjs.slice(0, 4);

    Array.from(tablist.children).forEach((element) => {
      element.addEventListener('click', (event) => {
        block.querySelectorAll('.tabs-panel').forEach((el) => {
          el.style.display = 'none';
        });

        if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-trending-funds') {
          const shcodeArr = dataCfObj.trendingFunds.map((elmap) => elmap.split(':')[1]);
          dataCf = dataCfObj.cfDataObjs.filter((data) => shcodeArr.includes(data.schcode));
          if (dataCf.length > 4) {
            dataCf = dataCf.slice(0, 4);
          }
        } else if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-most-searched-funds') {
          const shcodeArr = dataCfObj.mostSearchedFunds.map((elmap) => elmap.split(':')[1]);
          dataCf = dataCfObj.cfDataObjs.filter((data) => shcodeArr.includes(data.schcode));
          if (dataCf.length > 4) {
            dataCf = dataCf.slice(0, 4);
          }
        } else if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-most-bought-funds') {
          const shcodeArr = dataCfObj.mostBoughtFunds.map((elmap) => elmap.split(':')[1]);
          dataCf = dataCfObj.cfDataObjs.filter((data) => shcodeArr.includes(data.schcode));
          if (dataCf.length > 4) {
            dataCf = dataCf.slice(0, 4);
          }
        }
        block.querySelector(`#${event.currentTarget.getAttribute('aria-controls')}`).innerHTML = '';
        dataCf.map((elementfunds) => block.querySelector(`#${event.currentTarget.getAttribute('aria-controls')}`)
          .append(fundCardblock(elementfunds)));
        block.querySelector(`#${event.currentTarget.getAttribute('aria-controls')}`).style.display = 'flex';
      });
    });

    const wrapperTablist = document.createElement('div');
    wrapperTablist.classList.add('wrappertablist');
    wrapperTablist.append(block.querySelector('.tabs-list'));
    wrapperTablist.append(
      button(
        { class: 'btndesk' },
        a(
          { href: block.closest('.section').querySelector('.button-container a').getAttribute('href') },
          block.closest('.section').querySelector('.button-container a').textContent.trim(),
        ),
      ),
    );
    block.closest('.section').querySelector('.button-container').classList.add('btnmob');
    const tabspanel = block.querySelectorAll('.tabs-panel');
    block.innerHTML = '';
    block.append(wrapperTablist);
    tabspanel.forEach((el) => {
      block.append(el);
    });
    tablist.children[0].click();
  }
  if (block.closest('.known-our-funds')) {
    block.closest('.known-our-funds').classList.add('fund-tab');
    let dataCf = dataCfObj.cfDataObjs.map((elem) => ([...elem.fundsTaggingSection].includes('motilal-oswal:indian-equity-') ? elem : ''));
    dataCf = dataCf.filter((el) => el);
    dataCf = dataCf.slice(0, 4);
    Array.from(tablist.children).forEach((element) => {
      element.addEventListener('click', (event) => {
        block.querySelectorAll('.tabs-panel').forEach((el) => {
          el.style.display = 'none';
        });

        if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-indian-equity') {
          dataCf = dataCfObj.cfDataObjs.map((elem) => ([...elem.fundsTaggingSection].includes('motilal-oswal:indian-equity-') ? elem : ''));
          dataCf = dataCf.filter((el) => el);
          dataCf = dataCf.slice(0, 4);
          dataMapMoObj.selectviewFunds = 'indian-equity';
        } else if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-international-equity') {
          dataCf = dataCfObj.cfDataObjs.map((elem) => ([...elem.fundsTaggingSection].includes('motilal-oswal:international-equity') ? elem : ''));
          dataCf = dataCf.filter((el) => el);
          dataMapMoObj.selectviewFunds = 'international-equity';
        } else if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-hybrid-balanced') { // tabpanel-index
          dataCf = dataCfObj.cfDataObjs.map((elem) => ([...elem.fundsTaggingSection].includes('motilal-oswal:hybrid-&-balanced') ? elem : ''));
          dataCf = dataCf.filter((el) => el);
          dataMapMoObj.selectviewFunds = 'hybrid-&-balanced';
        } else if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-index') {
          dataCf = dataCfObj.cfDataObjs.map((elem) => ([...elem.fundsTaggingSection].includes('motilal-oswal:index-funds') ? elem : ''));
          dataCf = dataCf.filter((el) => el);
          dataCf = dataCf.slice(1, 5);
          dataMapMoObj.selectviewFunds = 'index-funds';
        } else if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-etfs') {
          dataCf = dataCfObj.cfDataObjs.map((elem) => ([...elem.fundsTaggingSection].includes('motilal-oswal:etf') ? elem : ''));
          dataCf = dataCf.filter((el) => el);
          dataCf = dataCf.slice(1, 5);
          dataMapMoObj.selectviewFunds = 'etf';
        } else if (event.currentTarget.getAttribute('aria-controls') === 'tabpanel-others') {
          dataCf = dataCfObj.map((elem) => (elem.sebiSubCategory === 'Other ETF' ? elem : ''));
          dataCf = dataCf.filter((el) => el);
          dataCf = dataCf.slice(1, 5);
          dataMapMoObj.selectviewFunds = 'OtherFund';
        }
        block.querySelector(`#${event.currentTarget.getAttribute('aria-controls')}`).innerHTML = '';
        dataCf.map((knowfunds) => block.querySelector(`#${event.currentTarget.getAttribute('aria-controls')}`)
          .append(fundCardblock(knowfunds)));
        block.querySelector(`#${event.currentTarget.getAttribute('aria-controls')}`).style.display = 'flex';
      });
    });
    block.querySelector('#tab-others').style.display = 'none';
    const wrapperTablist = document.createElement('div');
    wrapperTablist.classList.add('wrappertablist');
    wrapperTablist.append(block.querySelector('.tabs-list'));
    wrapperTablist.append(
      button(
        { class: 'btndesk' },
        a(
          {
            class: 'bthref',
            linkattr: block.closest('.section').querySelector('.button-container a').getAttribute('href'),
            onclick: () => {
              const closer = block.closest('.section');
              const pathname = closer.querySelector('.bthref').getAttribute('linkattr');
              localStorage.setItem('viewmark', dataMapMoObj.selectviewFunds);
              window.location.href = `${window.location.origin}${pathname}`;
            },
          },
          block.closest('.section').querySelector('.button-container a').textContent.trim(),
        ),
      ),
    );
    block.closest('.section').querySelector('.button-container').classList.add('btnmob');
    const tabspanel = block.querySelectorAll('.tabs-panel');
    block.innerHTML = '';
    block.append(wrapperTablist);
    tabspanel.forEach((el) => {
      block.append(el);
    });

    tablist.children[0].click();
  }

  /// ///ak 06-08-25//

  if (block.closest('.periodicreturn')) {
    const divWrapper = document.createElement('div');
    divWrapper.classList.add('tab-btn');
    const container = block.closest('.periodicreturn');
    const defaultwrapper = container.querySelectorAll('.default-content-wrapper');
    const btnwrapper = container.querySelectorAll('.tabs-tab');
    const mopAttr = ['_Ret', '_marketValue'];
    btnwrapper.forEach((el, index) => {
      divWrapper.appendChild(el);
      el.setAttribute('dataattr', mopAttr[index]);
    });
    const listwrapper = container.querySelector('.tabs-list');
    listwrapper.innerHTML = '';
    defaultwrapper.forEach((el, index) => (index === 0 ? listwrapper.appendChild(el) : ''));
    listwrapper.appendChild(divWrapper);
    dataMapMoObj.CLASS_PREFIXES = ['headgrp', 'headlist'];
    dataMapMoObj.addIndexed(defaultwrapper[1]);
    const headtitle = defaultwrapper[1].querySelector('.headgrp1').cloneNode(true);
    headtitle.prepend(th({ class: 'comthst', style: 'visibility   : hidden;' }, ''));
    const headstring = headtitle.outerHTML;
    const strhead = headstring.replaceAll('ul', 'tr').replaceAll('li', 'th');

    defaultwrapper[1].querySelector('.headgrp1').style.display = 'none';
    Array.from(headtitle.children).forEach((el) => {
      el.classList.add('data-name');
    });
    const formatReturn = (value) => {
      const numericValue = Number(value);

      // Use Number.isNaN() and check BEFORE calling .toFixed()
      if (Number.isNaN(numericValue)) {
        return 'NA';
      }
      if (dataMapMoObj.attr === '_Ret') {
        return `${numericValue.toFixed(2)}%`;
      } if (dataMapMoObj.attr === '_marketValue') {
        return `₹${Math.floor(numericValue)}`;
      }
      return numericValue;
    };

    const tablegrp = (param) => {
      const returnValue = [];
      dataMapMoObj.attr = param;
      const planCode = localStorage.getItem('planCode');
      let planslabel;
      if (planCode !== null) {
        const schode = planCode.split(':')[1];
        planslabel = schode;
      } else if (window.location.href.includes('/our-funds/funds-details-page')) {
        planslabel = 'LM';
      } else {
        const path = window.location.pathname.split('/').at(-1);
        const planobj = dataCfObj.cfDataObjs.filter(
          (el) => path === el.schDetail.schemeName.toLocaleLowerCase().split(' ').join('-'),
        );
        planslabel = planobj[0] !== undefined ? planobj[0].schcode : '';
      }
      // const planslabel = planCode.split(':')[1];
      const planObj = dataCfObj.cfDataObjs.filter((el) => planslabel === el.schcode);
      const cfObj = planObj;
      cfObj[0].returns.forEach((ret) => {
        if (ret.plancode + ret.optioncode === dataMapMoObj.gropcodevalue) {
          returnValue.push(ret);
        }
      });
      const divret = tbody(
        { class: 'fund-data-table' },
        tr(
          { class: 'fund-name-value return-funds' },
          td({ class: 'fund-name' }, cfObj[0].schDetail.schemeName),
          // ul(
          //   { class: 'fund-data-list' },
          td({ class: 'fund-data' }, formatReturn((returnValue[0][`oneYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((returnValue[0][`threeYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((returnValue[0][`fiveYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((returnValue[0][`sevenYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((returnValue[0][`tenYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((returnValue[0][`inception${param}`]))),
          // ),
        ),
        ...cfObj[0].benchmarkreturns.map((el) => tr(
          { class: 'fund-name-value benchmark-funds' },
          td({ class: 'fund-name' }, el.groupName),
          // ul(
          //   { class: 'fund-data-list' },
          td({ class: 'fund-data' }, formatReturn((el[`oneYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((el[`threeYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((el[`fiveYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((el[`sevenYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((el[`tenYear${param}`]))),
          td({ class: 'fund-data' }, formatReturn((el[`inception${param}`]))),
          // ),
        )),
      );
      const tabmo = table(
        { class: 'periodic-returns' },
        thead(
          { class: 'fund-data-title' },
        ),
        divret,
      );
      tabmo.querySelector('.fund-data-title').innerHTML = strhead;
      if (param === '_Ret') {
        block.querySelector('.tabpanel1').innerHTML = '';
        block.querySelector('.tabpanel1').append(tabmo);
      } else {
        block.querySelector('.tabpanel2').innerHTML = '';
        block.querySelector('.tabpanel2').append(tabmo);
      }
    };

    // defaultwrapper[1].style.display = 'none';
    dataMapMoObj.attr = '_Ret';
    tablegrp('_Ret');

    btnwrapper.forEach((elbtn) => {
      elbtn.addEventListener('click', (event) => {
        const dataattr = event.currentTarget.getAttribute('dataattr');
        tablegrp(dataattr);
      });
    });
    const ary = [];
    const planCode = localStorage.getItem('planCode');
    let planslabel;
    if (planCode !== null) {
      const schode = planCode.split(':')[1];
      planslabel = schode;
    } else if (window.location.href.includes('/our-funds/funds-details-page')) {
      planslabel = 'LM';
    } else {
      const path = window.location.pathname.split('/').at(-1);
      const planobj = dataCfObj.cfDataObjs.filter(
        (el) => path === el.schDetail.schemeName.toLocaleLowerCase().split(' ').join('-'),
      );
      planslabel = planobj[0] !== undefined ? planobj[0].schcode : '';
    }
    // const planslabel = planCode.split(':')[1];
    const planObj = dataCfObj.cfDataObjs.filter(
      (el) => planslabel === el.schcode,
    );
    Array.from(container.querySelector('.headgrp2').children).forEach((el) => ary.push(el));
    container.querySelector('.headgrp2').innerHTML = '';
    if (planObj[0].periodicReturnsTc !== '<p>NIL</p>\n') {
      container.querySelector('.headgrp2').innerHTML += planObj[0].periodicReturnsTc;
    }
    ary.forEach((elfor) => {
      container.querySelector('.headgrp2').append(elfor);
    });
    container.querySelector('.default-content-wrapper')
      .children[1].textContent = '';
    container.querySelector('.default-content-wrapper')
      .children[1].textContent = `Data as on ${dataMapMoObj.formatDate(planObj[0].schDetail.nfoStartDate)}`;
    // console.log(ary);
    container.querySelector('.headgrp2 .headlist2').removeAttribute('href');
    container.querySelector('.headgrp2 .headlist2')
      .addEventListener('click', () => {
        window.location.href = `${window.location.origin}/mutual-fund/in/en/our-funds`;
      });
  }
  /// //////////////////////first Tab ////////////////////////////
  function generateBarChart(data) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('chart-wrapper');
    data.forEach((item) => {
      const row = document.createElement('div');
      row.classList.add('bar-row');

      // Left label
      const leftLabel = document.createElement('div');
      leftLabel.classList.add('bar-label-left');
      leftLabel.textContent = item.sector;
      // Bar graph wrapper
      const barWrapper = document.createElement('div');
      barWrapper.classList.add('bar-graph-wrapper');

      const barFill = document.createElement('div');
      barFill.classList.add('bar-fill');
      barFill.style.width = item.percentage;

      barWrapper.appendChild(barFill);

      // Right label
      const rightLabel = document.createElement('div');
      rightLabel.classList.add('bar-label-right');
      rightLabel.textContent = item.percentage;

      // Append all to row
      row.appendChild(leftLabel);
      row.appendChild(barWrapper);
      row.appendChild(rightLabel);

      // Append row to wrapper
      wrapper.appendChild(row);
    });
    const tabblock = document.querySelector('.tabdiv');
    const tabpanelone = tabblock.querySelector('.tabpanel1');
    tabpanelone.appendChild(wrapper);
    return wrapper;
  }
  function generateBarChartHoldings(data) {
    //   const wrapper = createEl('div', { class: 'chart-wrapper' });
    const wrapper = document.createElement('div');
    wrapper.classList.add('chart-wrapper');
    data.forEach((item) => {
      const row = document.createElement('div');
      row.classList.add('bar-row');
      const leftLabel = document.createElement('div');
      leftLabel.classList.add('bar-label-left');
      leftLabel.textContent = item.nameOfSecurity;
      const barWrapper = document.createElement('div');
      barWrapper.classList.add('bar-graph-wrapper');

      const barFill = document.createElement('div');
      barFill.classList.add('bar-fill');
      barFill.style.width = item.percentToNAV;

      barWrapper.appendChild(barFill);
      const rightLabel = document.createElement('div');
      rightLabel.classList.add('bar-label-right');
      rightLabel.textContent = item.percentToNAV;
      row.appendChild(leftLabel);
      row.appendChild(barWrapper);
      row.appendChild(rightLabel);
      wrapper.appendChild(row);
    });
    const tabblock = document.querySelector('.tabdiv');
    const tabpaneltwo = tabblock.querySelector('.tabpanel2');
    tabpaneltwo.appendChild(wrapper);
    return wrapper;
  }
  const planCode = localStorage.getItem('planCode');
  let planslabel;
  if (planCode !== null) {
    const schode = planCode.split(':')[1];
    planslabel = schode;
  } else if (window.location.href.includes('/our-funds/funds-details-page')) {
    planslabel = 'LM';
  } else {
    const path = window.location.pathname.split('/').at(-1);
    const planobj = dataCfObj.cfDataObjs.filter(
      (el) => path === el.schDetail.schemeName.toLocaleLowerCase().split(' ').join('-'),
    );
    planslabel = planobj[0] !== undefined ? planobj[0].schcode : '';
  }
  // const planslabel = planCode.split(':')[1];
  const planObj = dataCfObj.cfDataObjs.filter((el) => planslabel === el.schcode);
  if (block.closest('.tabdiv')) {
    dataMapMoObj.scheme = planObj;
    generateBarChart(planObj[0].sector);
  }
  const tabButtons = document.querySelectorAll('.tabs-tab');
  tabButtons.forEach((tabBtn) => {
    const tabIddata = tabBtn.id.replace('tab-', '');
    if (tabIddata === 'sector-holdings' && planObj[0].sector === undefined) {
      tabBtn.style.display = 'none';
    }
    if (tabIddata === 'stock-holdings' && planObj[0].holdings === undefined) {
      tabBtn.style.display = 'none';
    }
    tabBtn.addEventListener('click', () => {
      const tabId = tabBtn.id.replace('tab-', '');
      const panel = document.getElementById(`tabpanel-${tabId}`);
      if (tabId === 'sector-holdings') {
        if (panel && !panel.querySelector('.chart-wrapper')) {
          const chart = generateBarChart(dataMapMoObj.scheme[0].sector);
          panel.appendChild(chart);
        }
      } else if (tabId === 'stock-holdings') {
        if (panel && !panel.querySelector('.chart-wrapper')) {
          const chart = generateBarChartHoldings(dataMapMoObj.scheme[0].holdings);
          panel.appendChild(chart);
        }
      }
    });
  });

  /// //////////////////////first Tab ////////////////////////////

  if (block.closest('.page-faq-section')) {
    const tempnone = block.closest('body').querySelector('footer');
    tempnone.style.display = 'none';
    dataMapMoObj.CLASS_PREFIXES = [];
    dataMapMoObj.CLASS_PREFIXES = ['itemfaq', 'subitemfaq', 'subinnerfaq', 'innersubfaq', 'inneritemfaq'];
    dataMapMoObj.addIndexed(block.closest('.page-faq-section'));

    const divtablist = block.querySelector('.tabs-list');
    const divwrapper = document.createElement('div');
    divwrapper.classList.add('tablist-search');

    const searchContainer = div(
      { class: 'search-container' },
      div(
        { class: 'search-wrapper' },
        input({
          class: 'search-field',
          placeholder: 'Search here',
          'aria-label': 'Search here',
        }),
        img({
          class: 'cancel-btn',
          src: './icons/input-cancel.svg',
          alt: 'cancel button',
        }),
      ),
      ul(
        { class: 'dropdownlist' },
        li({ class: 'singleval' }, 'asdfg'),
        li({ class: 'singleval' }, 'zxcv'),
        li({ class: 'singleval' }, 'zxcv'),
      ),
    );

    divwrapper.append(divtablist);
    divwrapper.append(searchContainer);
    block.prepend(divwrapper);

    dataMapMoObj.searchDrop = {};
    block.querySelectorAll('.tabs-panel').forEach((el) => {
      const attrbute = el.getAttribute('id');
      dataMapMoObj.searchDrop[attrbute] = [];
      const acclab = el.querySelectorAll('summary p');
      acclab.forEach((elacc) => dataMapMoObj.searchDrop[attrbute].push(elacc.textContent.trim()));
    });

    let flagover = true;
    const duplicateObj = [];
    const searchFireld = block.querySelector('.search-field');
    const dropdown = block.querySelector('.tablist-search .dropdownlist');
    const droplist = block.querySelector('.search-container');
    const cancelbtn = block.querySelector('.cancel-btn');
    const uldorp = block.querySelector('.tablist-search .dropdownlist');

    searchFireld.addEventListener('focus', () => {
      if (!Array.from(dropdown.classList).includes('dropdown-active')) {
        dropdown.classList.add('dropdown-active');
        if (dataMapMoObj.searchDrop['tabpanel-all'].length !== 0) {
          uldorp.innerHTML = '';
          dataMapMoObj.searchDrop['tabpanel-all'].forEach((ellisub) => {
            uldorp.append(li({ class: 'singleval' }, ellisub));
          });
        }
        if (Array.from(document.querySelectorAll('summary').length !== 0) && flagover) {
          flagover = false;
          block.querySelectorAll('.tabs-panel').forEach((el) => {
            const attrbute = el.getAttribute('id');
            dataMapMoObj.searchDrop[attrbute] = [];
            const acclab = el.querySelectorAll('summary p');
            acclab.forEach((elacc) => {
              dataMapMoObj.searchDrop[attrbute].push(elacc.textContent.trim());
            });
          });
          if (JSON.stringify(dataMapMoObj.searchDrop) !== '{}') {
            // const uldorp = block.querySelector('.tablist-search .dropdownlist');
            uldorp.innerHTML = '';
            Object.keys(dataMapMoObj.searchDrop).forEach((el) => {
              dataMapMoObj.searchDrop[el].forEach((innerSub) => {
                if (!duplicateObj.includes(innerSub)) {
                  duplicateObj.push(innerSub);
                  uldorp.append(li({ class: 'singleval' }, innerSub));
                }
              });
            });
            const searchFunctionality = () => {
              const searchInput = document.querySelector('.search-field');
              const listItems = document.querySelectorAll('.dropdownlist .singleval');
              const listContainer = document.querySelector('.dropdownlist');

              let activeIndex = -1;

              // This is the only function that needs a change
              const updateActiveItem = () => {
                const visibleItems = listContainer.querySelectorAll('.singleval:not([style*="display: none"])');
                listItems.forEach((item) => item.classList.remove('active'));
                if (activeIndex >= 0 && activeIndex < visibleItems.length) {
                  const activeElement = visibleItems[activeIndex];
                  activeElement.classList.add('active');
                  activeElement.scrollIntoView({
                    block: 'nearest',
                  });
                }
              };

              listContainer.addEventListener('mouseover', (event) => {
                const targetLi = event.target.closest('.singleval');
                if (!targetLi) return;
                const visibleItems = Array.from(listContainer.querySelectorAll('.singleval:not([style*="display: none"])'));
                activeIndex = visibleItems.indexOf(targetLi);
                updateActiveItem();
              });

              searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.trim().toLowerCase();
                let matchesFound = 0;
                const existingNotFound = listContainer.querySelector('.not-found-item');
                if (existingNotFound) existingNotFound.remove();
                if (searchTerm === '') {
                  listItems.forEach((itemls) => {
                    itemls.style.display = '';
                    itemls.innerHTML = itemls.textContent;
                  });
                  activeIndex = -1;
                  updateActiveItem();
                  return;
                }
                const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
                listItems.forEach((iteminner) => {
                  const originalText = iteminner.textContent;
                  if (originalText.toLowerCase().includes(searchTerm)) {
                    matchesFound += 1;
                    iteminner.style.display = '';
                    iteminner.innerHTML = originalText.replaceAll(regex, (matcheck) => `<strong>${matcheck}</strong>`);
                  } else {
                    iteminner.style.display = 'none';
                  }
                });
                if (matchesFound === 0) {
                  const liitem = document.createElement('li');
                  liitem.className = 'singleval not-found-item';
                  liitem.textContent = 'No results found';
                  listContainer.appendChild(liitem);
                }
                searchFireld.closest('.search-wrapper').classList.add('search-active');
                activeIndex = 0;
                updateActiveItem();
              });

              searchInput.addEventListener('keydown', (event) => {
                const visibleItems = listContainer.querySelectorAll('.singleval:not([style*="display: none"]):not(.not-found-item)');
                if (visibleItems.length === 0) return;
                switch (event.key) {
                  case 'ArrowDown':
                    event.preventDefault();
                    activeIndex = (activeIndex + 1) % visibleItems.length;
                    updateActiveItem();
                    break;
                  case 'ArrowUp':
                    event.preventDefault();
                    activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
                    updateActiveItem();
                    break;
                  case 'Enter':
                    event.preventDefault();
                    if (activeIndex >= 0 && activeIndex < visibleItems.length) {
                      const selectedItem = visibleItems[activeIndex];
                      searchInput.value = selectedItem.textContent;
                      let counter = 0;
                      const value = selectedItem.textContent;
                      Object.keys(dataMapMoObj.searchDrop).forEach((el) => {
                        if ([...dataMapMoObj.searchDrop[el]].includes(value) && counter === 0 && el !== 'tabpanel-all') {
                          const tabpanelText = el;
                          const tabText = el.replaceAll('tabpanel', 'tab');
                          const indexValue = [...dataMapMoObj.searchDrop[el]].indexOf(value);
                          // console.log(tabText);
                          Array.from(block.querySelector('.tabs-list').children).forEach((tabbtnlist) => tabbtnlist.setAttribute('aria-selected', 'false'));
                          Array.from(block.querySelectorAll('.tabs-panel')).forEach((tabplelist) => tabplelist.setAttribute('aria-hidden', 'true'));
                          block.querySelector(`#${tabText}`).setAttribute('aria-selected', 'true');
                          block.querySelector(`#${tabpanelText}`).setAttribute('aria-hidden', 'false');
                          Array.from(block.querySelectorAll(`#${tabpanelText} .accordion-item`)).forEach((elitem, indElm) => {
                            if (indElm === indexValue) {
                              elitem.setAttribute('open', '');
                            } else {
                              elitem.removeAttribute('open');
                            }
                          });
                          searchFireld.closest('.search-wrapper').classList.add('search-active');
                          uldorp.classList.remove('dropdown-active');
                          block.querySelector(`#${tabpanelText}`).scrollIntoView({ behavior: 'smooth' });
                          counter = 1;
                        }
                      });
                      // searchFireld.closest('.search-wrapper').classList.add('search-active');
                      searchInput.innerHTML = '';
                    }
                    break;
                  case 'Backspace':
                    if (searchInput.value.length === 1) {
                      searchFireld.closest('.search-wrapper').classList.remove('search-active');
                    } else if (searchInput.value.length > 1) {
                      searchFireld.closest('.search-wrapper').classList.add('search-active');
                    } else if (searchInput.value === '') {
                      dropdown.classList.add('dropdown-active');
                    }
                    break;
                  case 'Delete':
                    event.preventDefault();
                    activeIndex = (activeIndex - 1 + visibleItems.length) % visibleItems.length;
                    updateActiveItem();
                    if (searchInput.value.length === 1) {
                      searchFireld.closest('.search-wrapper').classList.remove('search-active');
                    } else if (searchInput.value.length > 1) {
                      searchFireld.closest('.search-wrapper').classList.add('search-active');
                    } else if (searchInput.value === '') {
                      dropdown.classList.add('dropdown-active');
                    }
                    break;
                  default:
                    break;
                }
              });
            };
            searchFunctionality();

            uldorp.addEventListener('click', (event) => {
              let counter = 0;
              const value = event.target.textContent.trim();
              Object.keys(dataMapMoObj.searchDrop).forEach((el) => {
                if ([...dataMapMoObj.searchDrop[el]].includes(value) && counter === 0 && el !== 'tabpanel-all') {
                  const searchInput = document.querySelector('.search-field');
                  const tabpanelText = el;
                  const tabText = el.replaceAll('tabpanel', 'tab');
                  const indexValue = [...dataMapMoObj.searchDrop[el]].indexOf(value);
                  // console.log(tabText);
                  Array.from(block.querySelector('.tabs-list').children).forEach((tabbtnlist) => tabbtnlist.setAttribute('aria-selected', 'false'));
                  Array.from(block.querySelectorAll('.tabs-panel')).forEach((tabplelist) => tabplelist.setAttribute('aria-hidden', 'true'));
                  block.querySelector(`#${tabText}`).setAttribute('aria-selected', 'true');
                  block.querySelector(`#${tabpanelText}`).setAttribute('aria-hidden', 'false');
                  Array.from(block.querySelectorAll(`#${tabpanelText} .accordion-item`)).forEach((elitem, indElm) => {
                    if (indElm === indexValue) {
                      elitem.setAttribute('open', '');
                    } else {
                      elitem.removeAttribute('open');
                    }
                  });
                  uldorp.classList.remove('dropdown-active');
                  block.querySelector(`#${tabpanelText}`).scrollIntoView({ behavior: 'smooth' });
                  counter = 1;
                  searchInput.value = value;
                }
              });
              searchFireld.closest('.search-wrapper').classList.add('search-active');
            });
          }
        }
      } else {
        dropdown.classList.remove('dropdown-active');
      }
    });
    document.addEventListener('click', (event) => {
      if (!droplist.contains(event.target)) {
        dropdown.classList.remove('dropdown-active');
      }
    });
    cancelbtn.addEventListener('click', () => {
      searchFireld.value = '';
      searchFireld.closest('.search-wrapper').classList.remove('search-active');
    });
  }

  if (block.closest('.popular-tab')) {
    const popualrTab = block.closest('.popular-tab');
    const defaultblk = popualrTab.querySelector('.default-content-wrapper');
    const tabList = block.querySelector('.tabs-list');
    const divtab = document.createElement('div');
    divtab.classList.add('popular-tabwrapper');
    divtab.append(defaultblk);
    divtab.append(tabList);
    block.prepend(divtab);
  }

  const glossary = block.closest('.glossary-tabs');
  if (glossary) {
    // const paragraphs = heroBlock.querySelectorAll('p');
    // dataMapMoObj.CLASS_PREFIXES = ['tab1', 'tab2',
    // 'tab3', 'tab4', 'tab5', 'tab6', 'tab7',
    // 'tab8', 'tab9'];
    dataMapMoObj.CLASS_PREFIXES = ['tabmain', 'tab-inner', 'tab-subinner', 'tab-child', 'tab-subchild', 'tab-itemmain', 'tab-subitem', 'tab-itemchild', 'tab-iteminner'];
    dataMapMoObj.addIndexed(block);

    const nextitem = block.closest('.tabs-wrapper').nextElementSibling;
    dataMapMoObj.CLASS_PREFIXES = ['defitem', 'mainitem', 'inneritem'];
    dataMapMoObj.addIndexed(nextitem);
  }
  // Get all the tab buttons
  const tabsPreviousStudies1 = document.querySelectorAll('.glossary-tabs .tabs-list .tabs-tab');
  if (tabsPreviousStudies1) {
  // Function to handle switching tabs
    const switchTab = (clickedTab) => {
    // 1. Remove 'active' and 'aria-selected' from all tabs
      Array.from(tabsPreviousStudies1).forEach((tab) => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      });
      // 2. Add 'active' and 'aria-selected' to the one you clicked
      clickedTab.classList.add('active');
      clickedTab.setAttribute('aria-selected', 'true');
    };
    // --- Set Initial State ---
    // Find the tab that is already selected in your HTML
    const initialActiveTab = document.querySelector('.tabs-tab[aria-selected="true"]');
    if (initialActiveTab) {
      initialActiveTab.classList.add('active');
    }
    // --- Add Click Listeners ---
    // Add a click event listener to each tab
    Array.from(tabsPreviousStudies1).forEach((tab) => {
      tab.addEventListener('click', () => {
      // When a tab is clicked, run the switchTab function
        switchTab(tab);
      });
    });
  }
  // previous studies tab end

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.cagr-container').forEach((el) => {
      if (!el.contains(event.target)) {
        el.querySelector('.dropdown-list').classList.remove('dropdown-active');
      }
    });
    document.querySelectorAll('.card-category').forEach((el) => {
      try {
        if (!el.contains(event.target)) {
          el.querySelector('.dropdown-list').classList.remove('dropdown-active');
        }
      } catch (error) {
        // console.log(error);
      }
    });
  });

  if (block.closest('.qglp-tabs')) {
    const mainwrapper = block.closest('main');
    const grpwrap = mainwrapper.querySelectorAll('.tab-glp-container');
    const panel = block.closest('.qglp-tabs').querySelectorAll('.tabs-panel');
    Array.from(panel).forEach((paneldata, index) => {
      paneldata.innerHTML = '';
      const struct = grpwrap[index].cloneNode(true);
      paneldata.append(struct);
      struct.style.display = 'block';
    });
    Array.from(mainwrapper.children).forEach((elchild) => {
      if (Array.from(elchild.classList).includes('tab-glp-container')) {
        elchild.style.display = 'none';
        elchild.classList.add('hide-section');
        elchild.remove();
      }
    });
    mainwrapper.querySelector('.decoding-qglp img')
      .setAttribute('fetchpriority', 'high');
  }

  if (block.closest('.previous-studies-ctn')) {
    // previous studies tab start
    const previousStudiesCtn = block.closest('.previous-studies-ctn');
    if (previousStudiesCtn !== null) {
      dataMapMoObj.CLASS_PREFIXES = ['previous-studies-ex', 'previous-studies-inter', 'previous-studies-wrp', 'previous-studies-cover', 'previous-studies-txt'];
      dataMapMoObj.addIndexed(previousStudiesCtn);
    }

    // Wait for the HTML document to be fully loaded

    // Get all the tab buttons
    const tabsPreviousStudies = document.querySelectorAll('.previous-studies-ctn .tabs-list .tabs-tab');

    if (tabsPreviousStudies) {
    // Function to handle switching tabs
      const switchTab = (clickedTab) => {
      // 1. Remove 'active' and 'aria-selected' from all tabs
        tabsPreviousStudies.forEach((tab) => {
          tab.classList.remove('active');
          tab.setAttribute('aria-selected', 'false');
        });

        // 2. Add 'active' and 'aria-selected' to the one you clicked
        clickedTab.classList.add('active');
        clickedTab.setAttribute('aria-selected', 'true');
      };

      // --- Set Initial State ---
      // Find the tab that is already selected in your HTML
      const initialActiveTab = document.querySelector('.tabs-tab[aria-selected="true"]');
      if (initialActiveTab) {
        initialActiveTab.classList.add('active');
      }

      // --- Add Click Listeners ---
      // Add a click event listener to each tab
      tabsPreviousStudies.forEach((tab) => {
        tab.addEventListener('click', () => {
        // When a tab is clicked, run the switchTab function
          switchTab(tab);
        });
      });
    }
    const mainwrapper = block.closest('main');
    const grpwrap = mainwrapper.querySelectorAll('.previous-studies-each-details');
    const panel = block.closest('.previous-studies-ex2 .previous-studies-inter1').querySelectorAll('.tabs-panel');
    Array.from(panel).forEach((paneldata, index) => {
      paneldata.innerHTML = '';
      const struct = grpwrap[index].cloneNode(true);
      paneldata.append(struct);
      struct.style.display = 'block';
    });
    Array.from(mainwrapper.children).forEach((elchild) => {
      if (Array.from(elchild.classList).includes('previous-studies-each-details')) {
        elchild.style.display = 'none';
        // elchild.classList.add('hide-section');
        elchild.remove();
      }
    });
  }
  // previous studies tab end
  if (block.closest('.previous-studies-tab')) {
    const mainblk = block.closest('main');
    Array.from(block.querySelector('.tabs-list').children)
      .forEach((tabtitle) => {
        console.log(tabtitle.textContent);
        const tabheada = `<span class='selcontent'>${dataMapMoObj.getOrdinalSuperscript(parseInt(tabtitle.textContent, 10))}</span>`;
        const tabheadb = tabtitle.textContent
          .replace(parseInt(tabtitle.textContent, 10), '').slice(2);
        const tabheadfin = tabheada.concat(tabheadb);
        tabtitle.textContent = '';
        tabtitle.innerHTML += tabheadfin;
      });
    const blk = mainblk.querySelectorAll('.prev-studies-wrapper');
    Array.from(blk).forEach((mainblkelem) => {
      // dataMapMoObj.CLASS_PREFIXES = ['prev-studies'];
      // dataMapMoObj.addIndexed(mainblk);
      const divwrapper = document.createElement('div');
      const atag = dataMapMoObj.getOrdinalSuperscript(parseInt(mainblkelem.querySelector('h1').textContent, 10));
      const btag = mainblkelem.querySelector('h1').textContent
        .replace(parseInt(mainblkelem.querySelector('h1').textContent, 10), '').slice(2);
      const fintag = atag.concat(btag);
      mainblkelem.querySelector('h1').textContent = '';
      mainblkelem.querySelector('h1').innerHTML += fintag;
      Array.from(mainblkelem.children).forEach((elblk, index) => {
        divwrapper.classList.add('prev-main-wrapper');
        if (index !== 0) {
          divwrapper.append(elblk);
        }
      });
      mainblkelem.append(divwrapper);
    });
    const panel = block.querySelectorAll('.tabs-panel');
    Array.from(panel).forEach((inner, index) => {
      panel.innerHTML = '';
      inner.append(blk[index]);
    });

    block.querySelectorAll('.prev-main-wrapper').forEach((eldata) => {
      const divprev = document.createElement('div');
      divprev.classList.add('prev-sub');
      Array.from(eldata.children).forEach((indata, index) => {
        if (index < (Array.from(eldata.children).length)) {
          divprev.append(indata);
        }
      });
      eldata.prepend(divprev);
    });

    // let initSelecTab;
    const dropdownlist = block.querySelector('.tabs-list');
    const tabDrodpwon = div(
      { class: 'tab-dropdown-wrap' },
      p({ class: 'selected-tab' }),
      div({ class: 'tab-droplist' }),
    );
    tabDrodpwon.querySelector('.tab-droplist').append(dropdownlist);
    block.prepend(tabDrodpwon);

    const dropdownWrap = mainblk.querySelector('.tab-dropdown-wrap');
    const dropList = dropdownWrap.querySelector('.tab-droplist');
    const selectedTab = dropdownWrap.querySelector('.selected-tab');
    Array.from(dropdownlist.children).forEach((tab) => {
      if (tab.getAttribute('aria-selected') === 'true') {
        const tabheada = `<span class='selcontent'>${dataMapMoObj.getOrdinalSuperscript(parseInt(tab.textContent, 10))}</span>`;
        const tabheadb = tab.textContent
          .replace(parseInt(tab.textContent, 10), '').slice(2);
        const tabheadfin = tabheada.concat(tabheadb);
        tab.textContent = '';
        tab.innerHTML += tabheadfin;
        selectedTab.innerHTML = '';
        selectedTab.innerHTML += tab.innerHTML;
      }
    });

    dropdownWrap.addEventListener('click', (evetn) => {
      evetn.preventDefault();
      // console.log('droplist : ', dropList.classList);
      if (!Array.from(dropList.classList).includes('active')) {
        dropList.classList.add('active');
      } else {
        Array.from(dropdownlist.children).forEach((tab) => {
          if (tab.getAttribute('aria-selected') === 'true') {
            selectedTab.innerHTML = '';
            selectedTab.innerHTML += tab.innerHTML;
          }
        });
        dropList.classList.remove('active');
      }
    });

    const prevpage = block.closest('.previous-studies-tab');

    [...prevpage.querySelectorAll('.prev-studies-wrapper .icon-share')].forEach((elemevent) => {
      const dsp = elemevent.parentElement.nextElementSibling;
      const prev = elemevent.closest('li').previousElementSibling;
      if (prev) prev.style.display = 'none';

      if (dsp !== null) {
        dsp.style.display = 'none';
        dataMapMoObj.CLASS_PREFIXES = ['listindex'];
        dataMapMoObj.addIndexed(dsp);
      }

      const eventvar = elemevent.parentElement;

      // 🔹 Popup Toggle
      eventvar.addEventListener('click', (e) => {
        e.stopPropagation();

        const dspblk = elemevent.parentElement.nextElementSibling;
        if (!dspblk) return;

        const isVisible = dspblk.style.display === 'block';

        // Close all others
        prevpage.querySelectorAll('.share-popup').forEach((pelem) => { pelem.style.display = 'none'; });

        dspblk.style.display = isVisible ? 'none' : 'block';
      });

      const dspblk = elemevent.parentElement.nextElementSibling;
      if (!dspblk) return;

      // Common share data
      const getShareData = () => {
        const shareUrl = window.location.href;
        const card = elemevent.closest('li');
        const shareText = card?.querySelector('h3')?.innerText || 'Check this out';
        return { shareUrl, shareText };
      };

      // 🔹 Facebook Share
      const facebookBtn = dspblk.querySelector('.listindex1');
      if (facebookBtn) {
        facebookBtn.addEventListener('click', (e) => {
          facebookBtn.querySelector('a').removeAttribute('href');
          e.stopPropagation();
          const { shareUrl } = getShareData();
          const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          window.open(fbLink, '_blank');
        });
      }

      // 🔹 WhatsApp Share
      const whatsappBtn = dspblk.querySelector('.listindex2');
      if (whatsappBtn) {
        whatsappBtn.querySelector('a').removeAttribute('href');
        whatsappBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const { shareUrl, shareText } = getShareData();
          const wpLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
          window.open(wpLink, '_blank');
        });
      }

      // 🔹 X (Twitter) Share
      const twitterBtn = dspblk.querySelector('.listindex3');
      if (twitterBtn) {
        twitterBtn.querySelector('a').removeAttribute('href');
        twitterBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const { shareUrl, shareText } = getShareData();
          const twLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
          window.open(twLink, '_blank');
        });
      }

      const copyfunc = dspblk.querySelector('.listindex4');
      if (copyfunc) {
        copyfunc.querySelector('a').removeAttribute('href');
        copyfunc.addEventListener('click', (e) => {
          const urlCopied = dspblk.querySelector('.listindex5');
          e.stopPropagation();
          try {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl);

            urlCopied.style.display = 'block';
            setTimeout(() => {
              urlCopied.style.display = 'none';
              // breadcrumb.style.display = 'none';
            }, 1000);
          } catch (err) {
            urlCopied.textContent = 'Could not copy URL. Please make sure the window is focused.';
            urlCopied.style.display = 'block';
            setTimeout(() => {
              urlCopied.style.display = 'none';
            }, 1000);
          }
        });
      }
    });

    // Click outside → close popup
    document.addEventListener('click', (event) => {
      if (!dropList.contains(event.target) && !selectedTab.contains(event.target)) {
        dropList.classList.remove('active');
      }

      const clickedShareIcon = event.target.closest('.icon-share');
      const clickedSharePopup = event.target.closest('.share-popup');

      if (clickedShareIcon || clickedSharePopup || event.target.closest('p')) return;

      prevpage.querySelectorAll('.prev-studies-wrapper .icon-share').forEach((icon) => {
        const popup = icon.parentElement.nextElementSibling;
        if (popup) popup.style.display = 'none';
      });
    });
  }
}
