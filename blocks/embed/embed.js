/*    */
/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */
// eslint-disable-next-line
import buildtabblock from '../tabs/tabs.js';
import dataMapMoObj from '../../scripts/constant.js';
import {
  div, table, thead, tbody, tr, p,
} from '../../scripts/dom-helpers.js';
import { createModal } from '../modal/modal.js';

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

const getDefaultEmbed = (url) => `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="${url.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
        scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
      </iframe>
    </div>`;

const embedYoutube = (url, autoplay) => {
  const usp = new URLSearchParams(url.search);
  // const suffix = autoplay ? '&muted=1&autoplay=1' : '';
  const suffix = autoplay ? '&autoplay=1&unmute=1' : '&autoplay=0&unmute=1';
  let vid = usp.get('v') ? encodeURIComponent(usp.get('v')) : '';
  const embed = url.pathname;
  if (url.origin.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://www.youtube.com${vid ? `/embed/${vid}?rel=0&v=${vid}${suffix}` : `${embed}?${autoplay}`}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
      </div>`;
  return embedHTML;
};

const embedVimeo = (url, autoplay) => {
  const [, video] = url.pathname.split('/');
  const suffix = autoplay ? '?unmute=1&autoplay=1' : '';
  const embedHTML = `<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
        <iframe src="https://player.vimeo.com/video/${video}${suffix}" 
        style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
        frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
        title="Content from Vimeo" loading="lazy"></iframe>
      </div>`;
  return embedHTML;
};

const embedTwitter = (url) => {
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};

export const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const EMBEDS_CONFIG = [
    {
      match: ['youtube', 'youtu.be'],
      embed: embedYoutube,
    },
    {
      match: ['vimeo'],
      embed: embedVimeo,
    },
    {
      match: ['twitter'],
      embed: embedTwitter,
    },
  ];

  const config = EMBEDS_CONFIG.find((e) => e.match.some((match) => link.includes(match)));
  const url = new URL(link);
  if (config) {
    block.innerHTML = config.embed(url, autoplay);
    block.classList = `block embed embed-${config.match[0]}`;
  } else {
    block.innerHTML = getDefaultEmbed(url);
    block.classList = 'block embed';
  }
  block.classList.add('embed-is-loaded');
};

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  if (!block.closest('.media-coverage') && !block.closest('.prev-studies-wrapper')) {
    block.textContent = '';
  }
  // wcs js
  try {
    const main = block.closest('main');
    const wcsLanding = main.querySelector('.wcs-landing');
    if (wcsLanding !== null) {
      dataMapMoObj.CLASS_PREFIXES = ['wcs', 'text', 'cta', 'media'];
      dataMapMoObj.addIndexed(wcsLanding);
    }
  } catch (error) {
    // console.log('classes not appended');
  }

  const main = block.closest('main');
  if (main !== null) {
    const prevStudieswrapper = main.querySelectorAll('.prev-studies-wrapper');
    if (prevStudieswrapper.length !== 0) {
      prevStudieswrapper.forEach((el) => {
        dataMapMoObj.CLASS_PREFIXES = ['annual-wealth-wrap', 'aw-ctn', 'aw-subctn', 'aw-subctnin'];
        dataMapMoObj.addIndexed(el);

        const dropDownText = el.querySelector('.previous-studies-tab .annual-wealth-wrap2 .aw-ctn2 .aw-subctnin1');
        if (dropDownText) {
          dataMapMoObj.CLASS_PREFIXES = ['aw-subctnin1-innerchild', 'awsubctn-innerchild'];
          dataMapMoObj.addIndexed(dropDownText);
        }

        const prevStudyul = el.querySelector('.co-branding .awsubctn-innerchild5');
        if (prevStudyul) {
          dataMapMoObj.CLASS_PREFIXES = ['awsubctn-innerchild5-ul'];
          dataMapMoObj.addIndexed(prevStudyul);
          if (prevStudyul.nextElementSibling !== null && prevStudyul.closest('.aw-subctnin1-innerchild1')) {
            const elem = prevStudyul.closest('.aw-subctnin1-innerchild1').querySelector('ul');
            dataMapMoObj.CLASS_PREFIXES = ['awsubctn-innerchild5-ul'];
            dataMapMoObj.addIndexed(elem);
            elem.classList.add('panel-field');
            Array.from(elem).forEach((elfor, ind) => {
              elfor.classList.add(`panellist${ind}`);
            });
          }
          if (prevStudyul.closest('.aw-subctnin1-innerchild1')) {
            const elem = prevStudyul.closest('.aw-subctnin1-innerchild1').querySelector('ul');
            elem.classList.add('panel-field');
            Array.from(elem.children).forEach((elfor, ind) => {
              const indexVal = ind + 1;
              elfor.classList.add(`panellist${indexVal}`);
            });
          }
        }

        const prevSocialLink = el.querySelector('.co-branding .awsubctn-innerchild5-ul3');
        if (prevSocialLink) {
          dataMapMoObj.CLASS_PREFIXES = ['socialLinking', 'socialLinking-inner', 'socialLinking-child'];
          dataMapMoObj.addIndexed(prevSocialLink);
        }

        const previousStudiesText = el.querySelector('.prev-main-wrapper .embed');
        if (previousStudiesText) {
          dataMapMoObj.CLASS_PREFIXES = ['video-wrap', 'video-inner', 'video-child', 'picture-wrap', 'picture-child'];
          dataMapMoObj.addIndexed(previousStudiesText);
        }
      });
    }
  }

  if (!block.closest('.prev-studies-wrapper') && !block.closest('.media-coverage')) {
    if (placeholder && !block.closest('.media-coverage') && !block.closest('.prev-studies-wrapper')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'embed-placeholder';
      wrapper.innerHTML = '<div class="embed-placeholder-play"><button type="button" title="Play"></button></div>';
      wrapper.prepend(placeholder);
      wrapper.addEventListener('click', async (event) => {
        if (block.closest('.article-left-wrapper')) {
          // investor atricle detail

          const videoContainer = document.createElement('div');
          // videoContainer.append(block);
          loadEmbed(videoContainer, link, true);
          const { showModal } = await createModal([videoContainer]);
          showModal();
          // console.log('df');
          return false;
        }
        loadEmbed(block, link, true);
        return event;
      });
      block.append(wrapper);
    } else {
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          if (block.closest('.wcs-landing')) {
            loadEmbed(block, link, false);
          } else {
            loadEmbed(block, link);
          }
        }
      });
      observer.observe(block);
    }
  }
  const data = block.closest('main');
  if (data !== null && window.location.href.includes('/wcs/in/en/coverage')) {
    if (!data.querySelector('.maintab')) {
      const subdata = data.querySelectorAll('.section');
      if (dataMapMoObj.objdata === undefined) {
        dataMapMoObj.objdata = {};
      }

      // Batch DOM reads to reduce layout thrashing
      const tabHeadTitles = new Map();
      Array.from(subdata).forEach((eldata) => {
        const headTitle = eldata.getAttribute('data-tab-head-title');
        const tabTitle = eldata.getAttribute('data-tab-title');
        if (headTitle !== null && tabTitle !== null) {
          if (!tabHeadTitles.has(headTitle)) {
            tabHeadTitles.set(headTitle, {});
          }
          tabHeadTitles.get(headTitle)[tabTitle] = eldata;
          eldata.remove();
        }
      });

      // Store in global object
      dataMapMoObj.objdata = Object.fromEntries(
        Array.from(tabHeadTitles).map(([key, value]) => [key, value]),
      );

      const divmain = div({ class: 'maintab' });

      // Cache values array to avoid repeated calls
      const tabEntries = Object.entries(dataMapMoObj.objdata);
      const documentFragment = document.createDocumentFragment();

      tabEntries.forEach((entry, index) => {
        const [elobj, tabContent] = entry;
        const innerdiv = div({ class: 'innerdiv' });
        const innerFragment = document.createDocumentFragment();

        // Batch processing of inner elements
        Object.entries(tabContent).forEach((tabEntry) => {
          const [inner, element] = tabEntry;
          const subinner = div(
            { class: 'subinnercontain' },
            div(inner),
            div({ class: 'subbinner' }),
          );

          dataMapMoObj.CLASS_PREFIXES = ['embed-main', 'embed-inner', 'embed-subitem', 'embed-childitem', 'embed-childinner'];
          dataMapMoObj.addIndexed(element);

          // Batch image processing
          const images = element.querySelectorAll('img');
          Array.from(images).forEach((imgelement) => {
            dataMapMoObj.altFunction(imgelement, `subbinner-${index + 1}-img`);
            imgelement.loading = 'eager';
            imgelement.fetchPriority = 'high';
          });

          // Use CSS class instead of inline style for better performance
          if (index === 0) {
            element.classList.add('tab-active-display');
          }

          // Use appendChild instead of innerHTML += to avoid reparsing
          subinner.querySelector('.subbinner').appendChild(element.cloneNode(true));
          innerFragment.appendChild(subinner);
        });

        innerdiv.appendChild(innerFragment);
        buildtabblock(innerdiv);

        const container = div(
          { class: 'contain' },
          div(elobj),
          div({ class: 'maininnerdiv' }),
        );
        container.querySelector('.maininnerdiv').appendChild(innerdiv);
        documentFragment.appendChild(container);
      });

      divmain.appendChild(documentFragment);
      buildtabblock(divmain);

      if (!data.classList.contains('modal-wrapper')) {
        data.appendChild(divmain);
      }

      const tableRender = (panel) => {
        // Early return if table already rendered
        if (panel.querySelector('.coverage-table-container')) {
          return;
        }

        const headkey = panel.querySelector('.section')?.getAttribute('data-tab-head-title');
        const key = panel.querySelector('.section')?.getAttribute('data-tab-title');
        const paneldata = dataMapMoObj.objdata?.[headkey]?.[key];

        if (!paneldata) return;

        const htmldata = paneldata.querySelector('ul ul')?.querySelectorAll('ul') || [];
        const selectedLabelTab = paneldata.querySelector('p')?.textContent?.trim() || '';

        if (window.location.pathname.includes('/wcs/in/en/coverage') && htmldata.length > 0) {
          const tableMain = div(
            { class: 'coverage-table-container' },
            p({ class: 'studytab-title' }, selectedLabelTab),
            table(
              { class: 'coverage-table' },
              thead(
                { class: 'coverage-thead' },
                tr(
                  { class: 'coverage-thead-tr' },
                ),
              ),
              tbody(
                { class: 'coverage-tbody' },
              ),
            ),
          );

          const headRow = tableMain.querySelector('.coverage-thead tr');
          const bodyContainer = tableMain.querySelector('.coverage-tbody');
          const headFragment = document.createDocumentFragment();
          const bodyFragment = document.createDocumentFragment();

          // Process header row
          Array.from(htmldata[0].querySelectorAll('li')).forEach((el, headind) => {
            el.classList.add('coverage-thead-th', `coverage-th-${headind + 1}`);
            const th = document.createElement('th');
            th.innerHTML = el.innerHTML;
            headFragment.appendChild(th);
          });

          headRow.appendChild(headFragment);

          // Process body rows
          Array.from(htmldata).slice(1).forEach((el) => {
            el.classList.add('coverage-tbody-tr');
            const trElem = document.createElement('tr');
            const eldatali = el.querySelectorAll('li');

            Array.from(eldatali).forEach((elsub, index) => {
              elsub.classList.add('coverage-tbody-td', `coverage-td-${index + 1}`);
              const td = document.createElement('td');
              td.innerHTML = elsub.innerHTML;
              trElem.appendChild(td);
            });

            bodyFragment.appendChild(trElem);
          });

          bodyContainer.appendChild(bodyFragment);

          const coveragePanel = panel.querySelector('.coverage-table-panel');
          if (coveragePanel) {
            coveragePanel.appendChild(tableMain);
            coveragePanel.classList.add('coverage-visible');
            panel.querySelector('.default-content-wrapper')?.classList.add('coverage-hidden');
          }
        }
      };

      // Handle tab change with performance optimization
      const handleTabChange = (container, tabbtn, tabpanels) => {
        // Use requestAnimationFrame to batch DOM updates
        requestAnimationFrame(() => {
          tabpanels.forEach((panel) => {
            panel.setAttribute('aria-hidden', 'true');
          });
          container.querySelectorAll('.tabs-list button').forEach((btn) => {
            btn.setAttribute('aria-selected', 'false');
          });

          tabbtn.setAttribute('aria-selected', 'true');
          const attr = tabbtn.getAttribute('id').replace('tab', 'tabpanel');
          const tabpanel = container.querySelector(`#${attr}`);
          if (tabpanel) {
            tabpanel.setAttribute('aria-hidden', 'false');
            if (tabpanel.querySelector('.coverage-table-panel')) {
              tableRender(tabpanel);
            }
          }
        });
      };

      // Event delegation with lazy initialization
      const setupTabHandlers = () => {
        const innerDivs = divmain.querySelectorAll('.innerdiv');
        innerDivs.forEach((eldiv) => {
          const buttons = eldiv.querySelectorAll('.tabs-list button');
          const tabpanels = eldiv.querySelectorAll('[role=tabpanel]');

          // Set initial ARIA attributes once
          if (buttons.length > 0) {
            buttons[0].setAttribute('aria-selected', 'true');
          }
          if (tabpanels.length > 0) {
            tabpanels[0].setAttribute('aria-hidden', 'false');
          }

          // Add keyboard support
          buttons.forEach((tabbtn, btnIndex) => {
            tabbtn.addEventListener('click', () => handleTabChange(eldiv, tabbtn, tabpanels));
            tabbtn.addEventListener('keydown', (e) => {
              if (e.key === 'ArrowLeft' && btnIndex > 0) {
                buttons[btnIndex - 1].focus();
                buttons[btnIndex - 1].click();
              } else if (e.key === 'ArrowRight' && btnIndex < buttons.length - 1) {
                buttons[btnIndex + 1].focus();
                buttons[btnIndex + 1].click();
              } else if (e.key === 'Home') {
                buttons[0].focus();
                buttons[0].click();
              } else if (e.key === 'End') {
                buttons[buttons.length - 1].focus();
                buttons[buttons.length - 1].click();
              }
            });
          });
        });
      };

      setupTabHandlers();

      // Coverage Tab Dropdown with keyboard support
      const dropdownlist = divmain.querySelector('.tabs-list');
      if (dropdownlist) {
        let activeTab = '';
        const buttons = dropdownlist.querySelectorAll('button');
        Array.from(buttons).forEach((btn) => {
          if (btn.getAttribute('aria-selected') === 'true') {
            activeTab = btn.textContent;
          }
        });

        const tabDrodpwon = div(
          { class: 'tab-dropdown-wrap' },
          div(
            {
              class: 'selected-tab',
              role: 'button',
              tabindex: '0',
              'aria-haspopup': 'listbox',
              'aria-expanded': 'false',
            },
            activeTab,
          ),
          div({ class: 'tab-droplist', role: 'listbox' }),
        );
        tabDrodpwon.querySelector('.tab-droplist').appendChild(dropdownlist);
        divmain.prepend(tabDrodpwon);

        const tabmainclick = divmain.querySelector('.tab-dropdown-wrap');
        const selectedTabBtn = tabmainclick.querySelector('.selected-tab');

        // Improved click handler with event delegation
        const toggleDropdown = (e) => {
          e.stopPropagation();
          tabmainclick.classList.toggle('active');
          selectedTabBtn.setAttribute('aria-expanded', tabmainclick.classList.contains('active') ? 'true' : 'false');
        };

        // Keyboard support for dropdown
        const handleDropdownKeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(e);
          } else if (e.key === 'Escape' && tabmainclick.classList.contains('active')) {
            tabmainclick.classList.remove('active');
            selectedTabBtn.setAttribute('aria-expanded', 'false');
          }
        };

        selectedTabBtn.addEventListener('click', toggleDropdown);
        selectedTabBtn.addEventListener('keydown', handleDropdownKeydown);

        // Update selected tab text
        const updateDropdownText = () => {
          const selected = tabmainclick.querySelector('.tabs-list [aria-selected="true"]');
          if (selected) {
            selectedTabBtn.textContent = selected.textContent;
          }
        };

        // Single event listener with proper scoping
        const handleClickOutside = (event) => {
          if (!selectedTabBtn.contains(event.target) && !tabmainclick.querySelector('.tab-droplist').contains(event.target)) {
            tabmainclick.classList.remove('active');
            selectedTabBtn.setAttribute('aria-expanded', 'false');
          }
        };

        // Use capture phase and single listener per dropdown
        tabmainclick.addEventListener('click', updateDropdownText);
        document.addEventListener('click', handleClickOutside, { once: false, capture: false });
      }

      block.closest('.section').classList.add('coverage-section-visible');
    }
  }
  return block;
}
