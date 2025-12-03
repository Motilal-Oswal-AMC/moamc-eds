import {
  div,
  ul,
  li,
  h2,
  span,
  p,
  img,
  input,
  label,
  a,
} from '../../scripts/dom-helpers.js';
import dataCfObj from '../../scripts/dataCfObj.js';
import dataMapMoObj from '../../scripts/constant.js';

function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function decorate(block) {
  const mainBlock = block.closest('body');
  mainBlock.querySelector('main').classList.add('top-nave');
  const whyFund = mainBlock.querySelector('main .why-fund');
  if (whyFund != null) {
    dataMapMoObj.CLASS_PREFIXES = [
      'whyfund-ol',
      'whyfund-li',
      'whyfund-inner-ol',
      'whyfund-inner-li',
      'whyfund-innertext-li',
    ];
  }
  dataMapMoObj.addIndexed(whyFund);
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
    planslabel = planobj[0].schcode;
  }
  const planObj = dataCfObj.cfDataObjs.filter(
    (el) => planslabel === el.schcode,
  );
  try {
    dataMapMoObj.CLASS_PREFIXES = [
      'compound-item',
      'compound-sub-item',
      'compound-inner-item',
    ];
    dataMapMoObj.addIndexed(block);

    const stky = mainBlock.querySelector('.fdp-sticky-nav');
    dataMapMoObj.CLASS_PREFIXES = [
      'sticky-item',
      'sticky-sub-item',
      'sticky-inner-item',
    ];
    dataMapMoObj.addIndexed(stky);

    stky.querySelector('.sticky-inner-item1').textContent = '';
    stky.querySelector('.sticky-inner-item1').textContent = planObj[0].schDetail.schemeName;
    dataMapMoObj.CLASS_PREFIXES = ['item'];
    dataMapMoObj.addIndexed(block.closest('.fdp-card-container'));
  } catch (error) {
    // console.log(error);
  }

  const cfObj = planObj;
  const fundsTaggingSection = cfObj[0].fundsTaggingSection.slice(0, 2);
  const finPlangrp = [];
  const tempReturns = [];
  const DirectPlanlistArr = cfObj[0].planList.filter((el) => el.planName);
  dataMapMoObj.planlistArr = DirectPlanlistArr;
  cfObj[0].returns.forEach((ret) => {
    if (DirectPlanlistArr[0].groupedCode === ret.plancode + ret.optioncode) {
      [...Object.keys(ret)].forEach((key) => {
        if (dataMapMoObj.ObjTempfdp[key]) {
          tempReturns.push(dataMapMoObj.ObjTempfdp[key]);
        }
      });
      finPlangrp.push(ret);
    }
  });
  // fundsTaggingSection.push(DirectPlanlistArr[0].optionName);
  const navlistArr = cfObj[0].nav.filter(
    (el) => DirectPlanlistArr[0].groupedCode === el.plancode + el.optioncode,
  );
  const initalDroptext = `${DirectPlanlistArr[0].planName} | ${DirectPlanlistArr[0].optionName}`;
  const mop = `/icons/schemeicons/MO_${cfObj[0].schcode}.svg`;
  const [firstReturnYear] = tempReturns;
  let selectedReturn;
  if (dataMapMoObj.selectreturns === '') {
    selectedReturn = 'Since 3 years';
  } else {
    selectedReturn = `Since ${dataMapMoObj.selectreturns.toLocaleLowerCase()}`;
  }
  const returnYear = tempReturns.includes(selectedReturn)
    ? selectedReturn
    : firstReturnYear;
  let textvalret = selectedReturn;
  if (returnYear !== 'Since Inception') {
    textvalret = returnYear.replace('Since', '');
  } else if (firstReturnYear.length !== 0) {
    textvalret = firstReturnYear;
  }
  dataMapMoObj.gropcodevalue = DirectPlanlistArr[0].groupedCode;
  dataMapMoObj.fundManagerDetails = cfObj[0].fundManager;
  const navdatecss = navlistArr[0].nav_date === undefined ? 'none' : 'block';
  const navnotpresent = navlistArr[0].nav_date === undefined ? 'block' : 'none';
  const navlistArrDate = navlistArr[0]?.nav_date?.replaceAll('-', ' ') ?? '';
  const navarrdate = navlistArrDate.split(' ');
  let navyear = '';
  if (navlistArr[0].nav_date !== undefined) {
    navyear = navarrdate[2].slice(-2);
  } else {
    navyear = '';
  }
  const navdaterper = `${navarrdate[0]} ${navarrdate[1]} ${navyear}`;

  function planGrpEvent(param) {
    const tempReturnsec = [];
    const returnValue = [];
    // const valueText = param.target.textContent.trim();
    // const planType = valueText.replace(' |', '');
    const plangrp = DirectPlanlistArr.filter(
      (el) => el.groupedCode === param.target.getAttribute('datacode'),
    );

    cfObj[0].returns.forEach((ret) => {
      if (ret.plancode + ret.optioncode === plangrp[0].groupedCode) {
        [...Object.keys(ret)].forEach((key) => {
          if (dataMapMoObj.ObjTempfdp[key]) {
            tempReturnsec.push(dataMapMoObj.ObjTempfdp[key]);
          }
        });
        returnValue.push(ret);
      }
    });
    const middlediv = param.target.closest('.middlediv');
    // const parentdiv = middlediv.closest('.card-wrapper');
    // const tagsgrp = parentdiv.querySelector('.tags-grp');
    // tagsgrp.querySelectorAll('.list-tag')[2].textContent = '';
    // tagsgrp.querySelectorAll('.list-tag')[2].textContent = planType;

    // year
    const yrsdrp = middlediv.querySelector('.nav-return-grp .dropdown');
    yrsdrp.innerHTML = '';
    yrsdrp.append(
      p(
        {
          class: 'selectedtext',
          onclick: (event) => {
            const toggle = event.target.closest('.dropdown');
            const droplist = toggle.querySelector('.dropdownlist').classList;
            if (!Array.from(droplist).includes('dropdown-active')) {
              droplist.add('dropdown-active');
            } else {
              droplist.remove('dropdown-active');
            }
          },
        },
        returnValue.length !== 0 ? tempReturnsec[0] : '',
      ),
    );
    const drpyrs = ul(
      {
        class: 'dropdownlist',
        onclick: (event) => {
          const valueTextsec = event.target.textContent.trim();
          const parentClosest = event.target.closest('.dropdown');
          const ptext = parentClosest.querySelector('.selectedtext');
          ptext.innerText = '';
          ptext.innerText = valueTextsec;
          const returnClass = event.target.closest('.return-grp');
          const valueCagr = returnClass.querySelector('.value-cagr');
          const dataValue = event.target.getAttribute('value');
          valueCagr.innerHTML = '';
          valueCagr.append(returnValue[0][dataValue]);
          valueCagr.append(span({ class: 'percent' }, '%'));
          const parentElem = event.target.parentElement.classList;
          parentElem.remove('dropdown-active');
        },
      },
      ...tempReturnsec.map((eloption) => li(
        {
          class: 'listval',
          value: dataMapMoObj.ObjTempfdp[eloption],
        },
        eloption,
      )),
    );
    yrsdrp.append(drpyrs);

    // cagr-value
    const cagrValue = middlediv.querySelector('.nav-return-grp .value-cagr');
    cagrValue.innerHTML = '';
    if (returnValue.length !== 0) {
      cagrValue.append(returnValue[0][dataMapMoObj.ObjTempfdp[returnYear]]);
      cagrValue.append(span({ class: 'percent' }, '%'));
    } else {
      cagrValue.append('NA');
    }

    // nav
    const navlistarray = cfObj[0].nav.filter(
      (el) => plangrp[0].groupedCode === el.plancode + el.optioncode,
    );

    if (navlistarray[0].nav_date !== undefined) {
      const navdateper = navlistarray[0].nav_date.replaceAll('-', ' ');
      const navarrdatev2 = navdateper.split(' ');
      const navyearv2 = navarrdatev2[2].slice(-2);
      const navdaterperv2 = `${navarrdatev2[0]} ${navarrdatev2[1]} ${navyearv2}`;
      const navdiv = middlediv.querySelector('.nav-return-grp .nav-label');
      navdiv.innerHTML = '';
      navdiv.append('NAV as on ');
      navdiv.append(span({ class: 'nav-date' }, navdaterperv2));

      const navValue = middlediv.querySelector('.value-nav');
      navValue.innerHTML = '';
      navValue.append(Number(navlistarray[0].latnav).toFixed(2));
      navValue.append(span({ class: 'percent' }, '%'));

      const navper = middlediv.querySelector('.nav-percent');
      navper.textContent = '';
      navper.textContent = navlistarray[0].navchngper;
      navper.append(span({ class: 'navper' }, '%'));
    } else {
      const navdiv = middlediv.querySelector('.nav-return-grp .nav-label');
      navdiv.innerHTML = '';
      navdiv.append('NAV');

      const navValue = middlediv.querySelector('.value-nav');
      navValue.innerHTML = '';
      navValue.append(Number(navlistarray[0].latnav).toFixed(2));
      navValue.append(span({ class: 'percent' }, '%'));

      const navper = middlediv.querySelector('.nav-percent');
      navper.textContent = '';
      navper.textContent = navlistarray[0].navchngper;
      navper.append(span({ class: 'navper' }, '%'));
    }
  }

  const typeOfScheme = cfObj[0].typeOfScheme === undefined ? '' : cfObj[0].typeOfScheme;
  const navchg = navlistArr[0].navchngper === undefined ? '' : Number(navlistArr[0].navchngper);
  const displaynav = navchg === '' ? 'none' : 'display';
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
          class: 'upperdiv',
        },
        div(
          {
            class: 'brandlogo-callicons',
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
            {
              class: 'contanct-share-icon',
            },
            div(
              {
                class: 'contactus-icon',
              },
              img({
                src: '/icons/call_back.svg',
                alt: 'callback',
                class: 'icon-callback',
              }),
              span(
                {
                  class: 'icon-text',
                },
                'Call back',
              ),
            ),
            div(
              {
                class: 'share-icon',
              },
              img({
                src: '/icons/share.svg',
                alt: 'callback',
                class: 'icon-callback',
              }),
              span(
                {
                  class: 'icon-text',
                },
                'Share',
              ),
            ),
          ),
        ),
        div(
          {
            class: 'title-discrption',
          },
          div(
            {
              class: 'title title-logo',
            },
            h2(
              {
                class: 'fund-name-title',
                schcode: cfObj[0].schcode,
              },
              cfObj[0].schDetail.schemeName,
            ),
          ),
          span(
            {
              class: 'discription',
            },
            typeOfScheme,
          ),
        ),
        div(
          {
            class: 'fundtagging-grp',
          },
          ul(
            {
              class: 'tags-grp',
            },
            ...fundsTaggingSection.map((eloption) => li(
              {
                class: 'list-tag',
              },
              toTitleCase(
                eloption.replaceAll('motilal-oswal:', '').replaceAll('-', ' '),
              ),
            )),
          ),
        ),
      ),
      div(
        {
          class: 'middlediv',
        },
        div(
          {
            class: 'dropdownmidle',
          },
          div(
            {
              class: 'label-text',
            },
            p(
              {
                class: 'selecttext',
                onclick: (event) => {
                  const toggle = event.target.closest('.dropdownmidle');
                  const droplist = toggle.querySelector('.dropdownlist').classList;
                  if (!Array.from(droplist).includes('dropdown-active')) {
                    droplist.add('dropdown-active');
                  } else {
                    droplist.remove('dropdown-active');
                  }
                },
                dataattr: DirectPlanlistArr[0].groupedCode,
              },
              initalDroptext,
            ),
          ),
          ul(
            {
              class: 'dropdownlist',
              onclick: (event) => {
                const targetVal = event.target;
                if (!targetVal.classList.contains('listval')) {
                  return;
                }
                const dropdownList = targetVal.parentElement;
                const allListItems = dropdownList.querySelectorAll('.listval');
                allListItems.forEach((item) => {
                  item.classList.remove('active');
                });
                targetVal.classList.add('active');
                const valueText = targetVal.textContent.trim();
                const parentClosest = event.target.closest('.dropdownmidle');
                const ptext = parentClosest.querySelector('.selecttext');
                ptext.innerText = '';
                ptext.innerText = valueText;
                dataMapMoObj.planText = valueText;
                const parentElem = event.target.parentElement.classList;
                event.target.classList.add('listval-active');
                parentElem.remove('dropdown-active');
                planGrpEvent(event);
              },
            },
            ...DirectPlanlistArr.map((eloption, ind) => li(
              {
                class: ind === 0 ? 'listval active' : 'listval',
                datacode: eloption.groupedCode,
              },
              `${eloption.planName} | ${eloption.optionName}`,
            )),
          ),
        ),
        div(
          {
            class: 'nav-return-grp',
          },
          div(
            {
              class: 'return-grp',
            },
            span(
              {
                class: 'return-text',
              },
              'Return',
            ),
            div(
              {
                class: 'dropdown',
              },
              p(
                {
                  class: 'selectedtext',
                  onclick: (event) => {
                    const toggle = event.target.closest('.dropdown');
                    const droplist = toggle.querySelector('.dropdownlist').classList;
                    if (!Array.from(droplist).includes('dropdown-active')) {
                      droplist.add('dropdown-active');
                    } else {
                      droplist.remove('dropdown-active');
                    }
                  },
                },
                textvalret,
                // returnYear,
              ),
              ul(
                {
                  class: 'dropdownlist',
                  onclick: (event) => {
                    const targetVal = event.target;
                    if (!targetVal.classList.contains('listval')) {
                      return;
                    }
                    const dropdownList = targetVal.parentElement;
                    const allListItems = dropdownList.querySelectorAll('.listval');
                    allListItems.forEach((item) => {
                      item.classList.remove('active');
                    });
                    targetVal.classList.add('active');
                    const valueText = targetVal.textContent.trim();
                    const parentClosest = event.target.closest('.dropdown');
                    const ptext = parentClosest.querySelector('.selectedtext');
                    let textval = valueText;
                    if (textval !== 'Since Inception') {
                      textval = valueText.replace('Since', '');
                    }
                    ptext.innerText = '';
                    ptext.innerText = textval;

                    const returnClass = event.target.closest('.return-grp');
                    const valueCagr = returnClass.querySelector('.value-cagr');
                    const dataValue = event.target.getAttribute('value');
                    valueCagr.innerHTML = '';
                    valueCagr.append(finPlangrp[0][dataValue]);
                    valueCagr.append(
                      span(
                        {
                          class: 'percent',
                        },
                        '%',
                      ),
                    );
                    const parentElem = event.target.parentElement.classList;
                    parentElem.remove('dropdown-active');
                  },
                },
                ...tempReturns.map((eloption) => li(
                  {
                    class: `listval ${textvalret === eloption.replace('Since', '')
                      ? 'active'
                      : ''
                      }`,
                    value: dataMapMoObj.ObjTempfdp[eloption],
                  },
                  eloption,
                )),
              ),
            ),
            div(
              {
                class: 'return-cagr',
              },
              p(
                {
                  class: 'value-cagr',
                },
                `${finPlangrp[0][dataMapMoObj.ObjTempfdp[returnYear]]}`,
                span(
                  {
                    class: 'percent',
                  },
                  '%',
                ),
              ),
            ),
          ),
          div(
            {
              class: 'nav-grp',
            },
            p(
              {
                class: 'nav-label',
                style: `display:${navdatecss}`,
              },
              'NAV as on ',
              span(
                {
                  class: 'nav-date',
                },
                navdaterper,
              ),
            ),
            p(
              {
                class: 'nav-label',
                style: `display:${navnotpresent}`,
              },
              'NAV',
            ),
            div(
              {
                class: 'nav-value-grp',
              },
              p(
                {
                  class: 'value-nav',
                },
                Number(navlistArr[0].latnav).toFixed(2),
                span({
                  class: 'percent',
                }),
              ),
              div(
                {
                  class: 'perecent-value',
                  style: `display:${displaynav}`,
                },
                img({
                  class: 'nav-img',
                  src: '/icons/upperecent.svg',
                  alt: 'navalt',
                }),
                p(
                  {
                    class: 'nav-percent',
                  },
                  navchg,
                  span(
                    {
                      class: 'navper',
                    },
                    '%',
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      div(
        {
          class: 'lowerdiv',
        },
        div(
          {
            class: 'form-wrapper',
          },
          div(
            {
              class: 'input-wrapper',
            },
            label(
              {
                for: 'pan-details', // Connects to the input's ID
              },
              'Enter PAN details', // Visible text for the label
            ),
            input({
              id: 'pan-details',
              placeholder: 'Enter PAN details',
              type: 'text',
            }),
            span(
              {
                class: 'error-span',
              },
              'Enter Valid Pan Number',
            ),
          ),
          div(
            {
              class: 'btn-wrapper',
            },
            a(
              {
                class: 'submit ',
                type: 'submit',
                href: 'https://mosldev--eds-cloud--rupeshdept.aem.live/mutual-fund/in/en/modals/invest-now-homepage',
              },
              'Invest Now',
            ),
          ),
        ),
        div(
          {
            class: 'notify-discription',
          },
          img({
            class: 'icon-person',
            src: '/icons/Icon.svg',
            alt: 'person',
          }),
          p(
            {
              class: 'notify-dis',
            },
            '88.87K have invested in this fund as on 1 Jul 2025',
          ),
        ),
      ),
    ),
  );

  const ptag = p({ class: 'selectedtext-fdp' }, 'Performance');
  const item2Ul = block.closest('.section').querySelector('.item2 ul');
  const item2 = block.closest('.section').querySelector('.item2');
  item2Ul.classList.add('item2-ul');
  item2.prepend(ptag);
  item2.querySelector('.item2-ul').classList.add('fdp-tab');
  // block.innerHTML = '';
  Array.from(block.children).forEach((elchild) => {
    elchild.style.display = 'none';
  });
  block.append(cardContainer);
  block.parentElement.parentElement.parentElement
    .querySelector('.breadcrumbs-fdp')
    .classList.add('wrapper-fdp');

  dataMapMoObj.CLASS_PREFIXES = ['tab-li-item'];
  dataMapMoObj.addIndexed(item2Ul);

  const activecls = Array.from(item2Ul.children)[0].querySelector('a');
  activecls.classList.add('active');

  const ptagtest = document.querySelector('.selectedtext-fdp');

  let currentSelectedText = '';

  const left = document.querySelector('.fdp-card-wrapper');
  function isInsideScrollable(el, stopAt) {
    while (el && el !== stopAt) {
      const style = window.getComputedStyle(el);
      const { overflowY } = style;
      if (
        (overflowY === 'auto' || overflowY === 'scroll')
        && el.scrollHeight > el.clientHeight
      ) {
        return true;
      }
      // eslint-disable-next-line no-param-reassign
      el = el.parentElement;
    }
    return false;
  }
  if (!left) {
    console.log('error');
  } else if (window.innerWidth >= 786) {
    left.addEventListener(
      'wheel',
      (e) => {
        if (isInsideScrollable(e.target, left)) return;
        const delta = e.deltaY;

        const atTop = this.scrollTop <= 0;
        const atBottom = this.scrollTop + this.clientHeight >= this.scrollHeight - 1;

        if ((delta < 0 && !atTop) || (delta > 0 && !atBottom)) {
          e.stopPropagation();
        } else {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      { passive: false },
    );
  }

  // setting id on the sticky performance list
  Array.from(item2Ul.children).forEach((elchild) => {
    const link = elchild.querySelector('a');
    const hrefValue = link.getAttribute('href');
    const cleanId = hrefValue.replace('#', '');
    elchild.setAttribute('id', cleanId);
  });

  const listItems = item2Ul.querySelectorAll('li[id]');
  // const sections = mainBlock.querySelector('main');
  // const sec = sections.querySelector('.fdp-card-container .item2');
  // item2Ul.addEventListener('click', (e) => {
  listItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      if (window.innerWidth) {
        ptag.textContent = e.target.textContent;
        if (window.innerWidth <= 786) {
          item2Ul.style.display = 'none';
          item2Ul.querySelector('.tab-li-item1').style.display = 'block';
        }
        // item2Ul.style.display = 'none';
        item2Ul.parentNode
          .querySelector('.selectedtext-fdp')
          .classList.remove('active');
        const targetId = item.id;
        // const targetSection = document.querySelector(`.section[data-id="${targetId}"]`);
        const sections = document.querySelectorAll('.section[data-id]');
        const targetSection = Array.from(sections).find(
          (ele) => ele.dataset.id === targetId,
        );

        if (targetSection) {
          const nfoBanner = document.querySelector(
            '#nav > div.section.nfo-banner',
          );
          const nfoHeight = nfoBanner ? nfoBanner.offsetHeight : 0;
          const stickyHeader = document.querySelector(
            'body > main > div.section.breadcrumbs-fdp.wrapper-fdp',
          );
          const stickyHeight = stickyHeader ? stickyHeader.offsetHeight : 65;
          const dropdown = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > p',
          );
          const dropdownHeight = dropdown ? dropdown.offsetHeight : 52;

          const performance = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.performance-graph-container',
          );
          const periodicReturn = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.periodicreturn.table-wrapper.tabs-container',
          );
          const sipCal = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.compounding.fdp-calculator.calculator-sip-container',
          );
          const whyFundvari = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.why-fund',
          );
          const fundVideo = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.fund-philosophy-video.fund-video-container',
          );
          const keyFacts = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.key-facts-container',
          );
          const portfolio = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.tabdiv.tabs-container',
          );
          const fundManager = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.our-funds-fdp-container',
          );
          const downloads = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.download.table-wrapper',
          );
          const contentLibrary = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.learning-fdp.future-building-container',
          );
          const peopleLike = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.fund-card-slider-container',
          );
          const productLabel = document.querySelector(
            'body > main > div.section.fdp-card-container > div.default-content-wrapper.comlist.item2 > div.section.table-wrapper.product-label.fdp-risk-o-meter.risk-o-meter-container',
          );

          const elementTop = targetSection.getBoundingClientRect().top + window.scrollY;

          let sectionKey;

          if (sipCal.contains(targetSection)) sectionKey = 'sipCal';
          else if (performance.contains(targetSection)) sectionKey = 'performance';
          else if (periodicReturn.contains(targetSection)) sectionKey = 'periodicReturn';
          else if (whyFundvari.contains(targetSection)) sectionKey = 'whyFund';
          else if (fundVideo.contains(targetSection)) sectionKey = 'fundVideo';
          else if (keyFacts.contains(targetSection)) sectionKey = 'keyFacts';
          else if (portfolio.contains(targetSection)) sectionKey = 'portfolio';
          else if (fundManager.contains(targetSection)) sectionKey = 'fundManager';
          else if (downloads.contains(targetSection)) sectionKey = 'downloads';
          else if (contentLibrary.contains(targetSection)) sectionKey = 'contentLibrary';
          else if (peopleLike.contains(targetSection)) sectionKey = 'peopleLike';
          else if (productLabel.contains(targetSection)) sectionKey = 'productLabel';

          let scrollPosition = window.innerWidth <= 768
            ? elementTop - nfoHeight - stickyHeight - dropdownHeight
            : 250;

          switch (sectionKey) {
            case 'performance':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 80
                : targetSection.offsetTop - 100;
              break;

            case 'sipCal':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 50
                : targetSection.offsetTop - 100;
              break;

            case 'periodicReturn':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 70
                : targetSection.offsetTop - 100;
              break;

            case 'fundVideo':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 50
                : targetSection.offsetTop - 100;
              break;

            case 'whyFund':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 80
                : targetSection.offsetTop - 100;
              break;

            case 'keyFacts':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 40
                : targetSection.offsetTop - 100;
              break;

            case 'portfolio':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 80
                : targetSection.offsetTop - 100;
              break;

            case 'fundManager':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 80
                : targetSection.offsetTop - 100;
              break;

            case 'downloads':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 50
                : targetSection.offsetTop - 90;
              break;

            case 'contentLibrary':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 80
                : targetSection.offsetTop - 100;
              break;

            case 'peopleLike':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 80
                : targetSection.offsetTop - 100;
              break;

            case 'productLabel':
              scrollPosition = window.innerWidth <= 768
                ? elementTop - nfoHeight - stickyHeight - dropdownHeight - 50
                : targetSection.offsetTop - 100;
              break;

            default:
              scrollPosition = 0; // fallback if none matches
          }

          window.scrollTo({
            top: scrollPosition,
            behavior: 'smooth',
          });
          if (window.innerWidth < 786) {
            item2Ul.closest('body').style.overflow = '';
          }
          setTimeout(() => {
            document.body.style.overflow = ''; // restore scrolling
          }, 800);
        }
      } else {
        item2Ul.parentNode
          .querySelector('.selectedtext-fdp')
          .classList.add('active');
      }
      if (window.innerWidth < 786 && e.target.tagName === 'A') {
        // changes for opstions
        const selectedText = e.target.textContent.trim();

        // Show previous selected item back (if any)
        if (currentSelectedText) {
          item2Ul.querySelectorAll('li').forEach((lielm) => {
            if (lielm.textContent.trim() === currentSelectedText) {
              lielm.style.display = '';
            }
          });
        }

        // Hide the newly selected item
        e.target.closest('li').style.display = 'none';

        // Update the current selected text
        currentSelectedText = selectedText;
        ptagtest.textContent = selectedText;
        item2Ul.style.display = 'none';
      }
    });
  });

  ptag.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      if (item2Ul.style.display === 'block') {
        item2Ul.parentNode
          .querySelector('.selectedtext-fdp')
          .classList.remove('active');
        item2Ul.style.display = 'none';
        item2Ul.closest('body').style.overflow = 'unset';
      } else {
        item2Ul.parentNode
          .querySelector('.selectedtext-fdp')
          .classList.add('active');
        item2Ul.style.display = 'block';
        item2Ul.closest('body').style.overflow = 'hidden';
      }
    }
  });
  // document.addEventListener('scroll', () => {
  //   // added for stky nav
  //   const stkyNav = document.querySelector('.selectedtext-fdp');
  //   const rect = stkyNav.getBoundingClientRect();
  //   const isStuckAtTop = rect.top <= 180;
  //   // const chikePostion = window.getComputedStyle(stkyNav);
  //   if (isStuckAtTop && stkyNav.classList.contains('active')) {
  //     item2Ul.closest('body').style.overflow = 'hidden';
  //   } else {
  //     item2Ul.closest('body').style.overflow = 'unset';
  //   }
  // });

  document.querySelectorAll('.table-wrapper').forEach((el) => {
    document.querySelector('.item2').append(el);
  });

  (function () {
    // Function to calculate the correct header offset based on screen size
    // function getHeaderOffset(targetID) { // targetId
    // const dataidStorage = dataMapMoObj.ObjDataidFdp[targetID.getAttribute('data-id')];
    // return window.innerWidth <= 768 ? dataidStorage : 240;
    // }

    // Smooth scroll setup with dynamic header offset
    function setupSmoothScroll(linkSelector) {
      if (window.innerWidth < 900) {
        Array.from(document.querySelectorAll(linkSelector)).forEach((el) => {
          el.classList.remove('active');
        });
        const act = Array.from(document.querySelectorAll(linkSelector))[0];
        if (act) {
          act.classList.add('active');
          act.parentElement.style.display = 'none';
        }
      }
      document.querySelectorAll(linkSelector).forEach((link) => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          Array.from(e.target.closest('.item2-ul').children).forEach((el) => {
            const linkclass = el.querySelector('a');
            linkclass.classList.remove('active');
            if (linkclass.style.display === 'none') {
              linkclass.style.display = 'block';
            }
          });
          const targetId = link.getAttribute('href');
          e.target.classList.add('active');
          const target = document.querySelector(
            `.section[data-id="${targetId}"]`,
          );

          if (target) {
            // const headerOffset = getHeaderOffset(target);
            // const elementPosition = target.getBoundingClientRect().top;
            // const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            // window.scrollTo({
            // top: offsetPosition,
            // behavior: 'smooth',
            // });
          }
        });
      });
    }

    // Apply to both link groups
    setupSmoothScroll('.item2-ul li a');
    setupSmoothScroll('.navlinks ul li a');

    // setupSmoothScroll('.fdp-card-container');
    // Optional: re-initialize on window resize (if layout changes)
    window.addEventListener('resize', () => {
      // No need to re-bind listeners, just let `getHeaderOffset()` always return current value
      // This works because the scroll is recalculated each click
    });
  }());

  document.addEventListener('click', (event) => {
    const dropdownmidle = block.querySelector('.dropdownmidle');
    const dropdown = block.querySelector('.dropdown');
    const mainblk = block.closest('main');
    const dropbk = mainblk.querySelector('.fdp-card-container .item2-ul');
    const dropsel = mainblk.querySelector('.fdp-card-container .selectedtext-fdp');
    // const temp = block.closest('body').querySelector('.breadcrumbs-fdp');
    // const sharlist = temp.querySelector('.innerbreadcrb2');
    if (!dropdownmidle.contains(event.target)) {
      dropdownmidle
        .querySelector('.dropdownlist')
        .classList.remove('dropdown-active');
    }
    if (!dropdown.contains(event.target)) {
      dropdown
        .querySelector('.dropdownlist')
        .classList.remove('dropdown-active');
    }
    if (window.innerWidth < 768) {
      if (!dropbk.contains(event.target)
        && !dropsel.contains(event.target)) {
        if (mainblk.querySelector('.fdp-card-container .item2-ul').style.display === 'block') {
          mainblk.querySelector('.fdp-card-container .item2-ul')
            .style.display = 'none';
          dropsel.classList.remove('active');
          mainblk.closest('body').style.overflow = 'unset';
        }
      }
    }
    // if (!sharlist.contains(event.target)) {
    //   sharlist.querySelector('.breadcrbmain2').style.display = 'none';
    // }
  });

  // changes for given class ul li

  const ulElement = mainBlock.querySelector('.breadcrumbs-fdp');
  dataMapMoObj.CLASS_PREFIXES = [
    'mainbreadcrb',
    'subbreadcrb',
    'innerbreadcrb',
    'breadcrbmain',
  ];
  dataMapMoObj.addIndexed(ulElement);

  mainBlock.querySelector('.subbreadcrb2').addEventListener('click', async (event) => {
    const breadcrumb = document.querySelector('.breadcrbmain2');
    if (event.target.textContent === 'Copy') {
      const urlCopied = block.closest('main').querySelector('.breadcrumbs-fdp .listindex5');
      try {
        const currentUrl = window.location.href;
        await navigator.clipboard.writeText(currentUrl);

        // Provide feedback to the user!
        // alert('URL copied to clipboard!');
        urlCopied.style.display = 'block';
        setTimeout(() => {
          urlCopied.style.display = 'none';
          breadcrumb.style.display = 'none';
        }, 1000);
      } catch (err) {
        // Catch potential errors and inform the user
        // console.error('Failed to copy URL: ', err);
        // //alert('Could not copy URL. Please make sure the window is focused.');
        urlCopied.textContent = 'Could not copy URL. Please make sure the window is focused.';
        urlCopied.style.display = 'block';
        setTimeout(() => {
          urlCopied.style.display = 'none';
        }, 1000);
      }
      return false;
    }
    if (breadcrumb.style.display === 'none' || breadcrumb.style.display === '') {
      breadcrumb.style.display = 'block';
    } else {
      breadcrumb.style.display = 'none';
    }
    return true;
  });

  const imgAltmain = block.closest('main');
  dataMapMoObj.altFunction(imgAltmain.querySelector('.subbreadcrb1 img'), 'callback');
  dataMapMoObj.altFunction(imgAltmain.querySelector('.subbreadcrb3 img'), 'portfolio-sheet');
  dataMapMoObj.altFunction(imgAltmain.querySelector('.subbreadcrb4 img'), 'branded-page');
  dataMapMoObj.altFunction(imgAltmain.querySelector('.subbreadcrb4 img'), 'branded-page');

  // ---------------- SHARE CONTAINER ----------------
  const shareContainer = imgAltmain.querySelector('.subbreadcrb2 .breadcrbmain2');

  // Add index classes & remove href from each <a>
  Array.from(shareContainer.children).forEach((listItem, index) => {
    listItem.classList.add(`listindex${index + 1}`);

    const link = listItem.querySelector('a');
    if (link) link.removeAttribute('href');
  });

  // ---------------- SHARE DATA ----------------
  const getShareData = () => {
    const shareUrl = window.location.href;
    const shareText = dataMapMoObj.planText || "Check this out";
    return { shareUrl, shareText };
  };

  // ---------------- FACEBOOK ----------------
  const fbBtn = shareContainer.querySelector('.listindex1');
  if (fbBtn) {
    fbBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const { shareUrl } = getShareData();
      const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
      window.open(fb, '_blank');
    });
  }

  // ---------------- WHATSAPP ----------------
  const wpBtn = shareContainer.querySelector('.listindex2');
  if (wpBtn) {
    wpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const { shareUrl, shareText } = getShareData();
      const wp = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
      window.open(wp, '_blank');
    });
  }

  // ---------------- X / TWITTER ----------------
  const twBtn = shareContainer.querySelector('.listindex3');
  if (twBtn) {
    twBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const { shareUrl, shareText } = getShareData();
      const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(tw, '_blank');
    });
  }

  // ---------------- COPY URL ----------------
  const copyBtn = shareContainer.querySelector('.listindex4');
  const msgBox = shareContainer.querySelector('.listindex5');

  if (copyBtn) {
    copyBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      try {
        const { shareUrl } = getShareData();
        await navigator.clipboard.writeText(shareUrl);

        msgBox.style.display = 'block';
        setTimeout(() => msgBox.style.display = 'none', 1000);

      } catch (err) {
        msgBox.textContent = 'Could not copy URL. Please check browser settings.';
        msgBox.style.display = 'block';
        setTimeout(() => msgBox.style.display = 'none', 1000);
      }
    });
  }

  // ---------------- PLAN TEXT CAPTURE ----------------
  block.querySelector('.btn-wrapper').addEventListener('click', () => {
    const plantext = block.querySelector('.middlediv .selecttext');
    dataMapMoObj.planText = plantext.textContent.trim();
  });

  // ---------------- REDIRECT MODIFICATION ----------------
  const redirect = mainBlock.querySelector('.fdp-card-container .fdp-card');
  const redirectbrn = redirect.querySelector('.btn-wrapper a');
  const link = redirectbrn.getAttribute('href');

  const stky = mainBlock.querySelector('.fdp-sticky-nav');
  const textVal = stky.querySelector('.sticky-sub-item2').textContent;

  stky.querySelector('.sticky-sub-item2').innerHTML = '';
  stky.querySelector('.sticky-sub-item2').append(a({
    href: link,
    class: 'submit',
  }, textVal));

  // ---------------- CLOSE POPUP WHEN CLICKED OUTSIDE ----------------
  document.addEventListener('click', (event) => {
    if (!shareContainer.contains(event.target) &&
      !imgAltmain.querySelector('.subbreadcrb2').contains(event.target)) {
      shareContainer.style.display = 'none';
    }
  });

  // Remove title attribute from all tab anchors
  document.querySelectorAll('.fdp-tab a').forEach((anc) => {
    anc.removeAttribute('title');
  });
}