import buildtabblock from '../tabs/tabs.js';
import Swiper from '../swiper/swiper-bundle.min.js';
import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  buildtabblock(block);
  block.classList.add('gradient-show');

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
    // const tabsList = block.querySelector('.tabs-list');
    // tabsList.addEventListener('click', (e) => {
    //   const isSelected = e.target.getAttribute('aria-selected') === 'true';
    //   const button = e.target.parentElement;
    //   if (isSelected) {
    //     e.target.setAttribute('aria-selected', false);
    //     button.setAttribute('aria-selected', true);
    //   } else {
    //     e.target.setAttribute('aria-selected', true);
    //   }
    //   // console.log(isSelected);
    // });
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
    'embedsublist',
    'embedlistinner',
  ];
  Array.from(classEmbed).forEach((elfor) => dataMapMoObj.addIndexed(elfor));

  block.querySelectorAll('.button-container p').forEach((paraEl) => {
    paraEl.style.margin = '0px';
  });

  // SHARE FUNCTIONALITY FOR OUR-SERVICE
  const ourServiceBlock = block.closest('.our-service');
  if (ourServiceBlock) {
    const shareIcons = ourServiceBlock.querySelectorAll('.comlist.embedsubinner1 .icon-share');

    shareIcons.forEach((elemevent) => {
      const eventvar = elemevent.parentElement;

      // POPUP TOGGLE
      eventvar.addEventListener('click', (e) => {
        e.stopPropagation();

        const dspblk = elemevent.parentElement.nextElementSibling;
        if (!dspblk) return;

        const isVisible = dspblk.style.display === 'block';

        // Close all other popups
        ourServiceBlock.querySelectorAll('.share-popup').forEach((pelem) => {
          pelem.style.display = 'none';
        });

        dspblk.style.display = isVisible ? 'none' : 'block';
      });

      const dspblk = elemevent.parentElement.nextElementSibling;
      if (!dspblk) return;

      // Initialize popup hidden and add indexed classes to its children
      if (dspblk !== null) {
        dspblk.style.display = 'none';
        dataMapMoObj.CLASS_PREFIXES = ['listindex'];
        dataMapMoObj.addIndexed(dspblk);
      }

      // SHARE DATA
      const getShareData = () => {
        const shareUrl = window.location.href;
        const card = elemevent.closest('.comlist.embedsubinner1');
        const shareText = card?.textContent?.trim() || 'Check this out';
        return { shareUrl, shareText };
      };

      // FACEBOOK SHARE
      const facebookBtn = dspblk.querySelector('.listindex1');
      if (facebookBtn) {
        facebookBtn.querySelector('a').removeAttribute('href');
        facebookBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const { shareUrl } = getShareData();
          const fbLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
          window.open(fbLink, '_blank');
        });
      }

      // WHATSAPP SHARE
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

      // X (TWITTER) SHARE
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

      // COPY SHARE
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
            setTimeout(() => { urlCopied.style.display = 'none'; }, 1000);
          } catch (err) {
            urlCopied.textContent = 'Could not copy URL. Please make sure the window is focused.';
            urlCopied.style.display = 'block';
            setTimeout(() => { urlCopied.style.display = 'none'; }, 1000);
          }
        });
      }
    });

    // CLOSE POPUPS WHEN CLICKING OUTSIDE
    document.addEventListener('click', (event) => {
      const clickedShareIcon = event.target.closest('.icon-share');
      const clickedSharePopup = event.target.closest('.share-popup');

      // Do not close when clicking inside icon, popup, OR inside <p>
      if (clickedShareIcon || clickedSharePopup || event.target.closest('p')) return;

      ourServiceBlock.querySelectorAll('.comlist.embedsubinner1 .icon-share').forEach((icon) => {
        const popup = icon.parentElement.nextElementSibling;
        if (popup) popup.style.display = 'none';
      });
    });
  }
}
