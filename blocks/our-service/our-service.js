import buildtabblock from '../tabs/tabs.js';
import Swiper from '../swiper/swiper-bundle.min.js';
import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  buildtabblock(block);

  const tabPanels = block.querySelectorAll('.tabs-panel');
  tabPanels.forEach((el) => {
    el.setAttribute('aria-hidden', true);
  });
  tabPanels[0].setAttribute('aria-hidden', false);
  // const tabs = block.querySelectorAll('.tabs-tab');
  // console.log(tabs);
  if (tabPanels.length > 0) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('tabs-panels-wrapper');

    tabPanels.forEach((panel) => {
      wrapper.appendChild(panel);
    });

    const tabsList = block.querySelector('.tabs-list');
    if (tabsList && tabsList.parentNode) {
      tabsList.parentNode.insertBefore(wrapper, tabsList.nextSibling);
    }
  }

  function updateTabsForMobile() {
    const isMobile = window.innerWidth < 768;
    const roleTabs = block.querySelectorAll('[role="tab"]');

    roleTabs.forEach((tab) => {
      const tabId = tab.getAttribute('aria-controls');
      const panel = block.querySelector(`#${tabId}`);

      if (!panel) return;

      const alreadyWrapped = tab.closest('.tabs-wrapper');

      if (isMobile && !alreadyWrapped) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('tabs-wrapper');

        tab.parentNode.insertBefore(wrapper, tab);
        wrapper.appendChild(tab);
        wrapper.appendChild(panel);
      }

      if (!isMobile && alreadyWrapped) {
        const parent = alreadyWrapped.parentNode;
        parent.insertBefore(tab, alreadyWrapped);
        parent.insertBefore(panel, alreadyWrapped);
        alreadyWrapped.remove();
      }
    });
    const tabsList = block.querySelector('.tabs-list');
    tabsList.addEventListener('click', (e) => {
      const isSelected = e.target.getAttribute('aria-selected') === 'true';
      const button = e.target.parentElement;
      if (isSelected) {
        e.target.setAttribute('aria-selected', false);
        button.setAttribute('aria-selected', true);
      } else {
        e.target.setAttribute('aria-selected', true);
      }
      // console.log(isSelected);
    });
  }
  updateTabsForMobile();

  window.addEventListener('resize', updateTabsForMobile);

  const swiperEl = block.querySelector('.tabs-panel .swiper');
  if (swiperEl) {
    Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      slidesOffsetBefore: 0,
      slidesOffsetAfter: 0,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });
  }

  if (window.innerWidth <= 768) {
    const timeList = block.querySelectorAll('.tabs-wrapper');
    dataMapMoObj.CLASS_PREFIXES = [
      'list-tabs',
      'tabsgsub',
      'tabsinner',
      'tabssubinner',
    ];
    Array.from(timeList).forEach((elfor) => dataMapMoObj.addIndexed(elfor));
  } else {
    const timeList = block.querySelector('.tabs-list');
    dataMapMoObj.CLASS_PREFIXES = [
      'list-tabs',
      'tabsgsub',
      'tabsinner',
      'tabssubinner',
    ];
    dataMapMoObj.addIndexed(timeList);
  }

  const classEmbed = block.querySelectorAll('.embed-container');
  dataMapMoObj.CLASS_PREFIXES = [
    'embed-videos',
    'embedsub',
    'embedinner',
    'embedsubinner',
  ];
  Array.from(classEmbed).forEach((elfor) => dataMapMoObj.addIndexed(elfor));

  block.querySelectorAll('.button-container p').forEach((paraEl) => {
    paraEl.style.margin = '0px';
  });
}
