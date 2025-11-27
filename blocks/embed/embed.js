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
  div, table, thead, tbody, tr, p, sup, span,
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
  if (config && autoplay !== undefined) {
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
      Array.from(subdata).forEach((eldata) => {
        if (eldata.getAttribute('data-tab-head-title') !== null) {
          if (dataMapMoObj.objdata[eldata.getAttribute('data-tab-head-title')] === undefined) {
            dataMapMoObj.objdata[eldata.getAttribute('data-tab-head-title')] = {};
          }
          dataMapMoObj.objdata[eldata.getAttribute('data-tab-head-title')][eldata.getAttribute('data-tab-title')] = eldata;
          eldata.remove();
        }
      });
      // console.log(dataMapMoObj.objdata);
      const divmain = div({ class: 'maintab' });
      Object.keys(dataMapMoObj.objdata).forEach((elobj, index) => {
        const innerdiv = div({ class: 'innerdiv' });
        const valueAry = Object.values(dataMapMoObj.objdata);
        Object.keys(valueAry[index]).forEach((inner) => {
          const subinner = div(
            { class: 'subinnercontain' },
            div(inner),
            div({ class: 'subbinner' }),
          );
          dataMapMoObj.CLASS_PREFIXES = ['embed-main', 'embed-inner', 'embed-subitem', 'embed-childitem', 'embed-childinner'];
          dataMapMoObj.addIndexed(valueAry[index][inner]);
          Array.from(valueAry[index][inner].querySelectorAll('img')).forEach((el) => {
            dataMapMoObj.altFunction(el, `subbinner-${index + 1}-img`);
          });
          if (index === 0) {
            valueAry[index][inner].style.display = 'flex';
          }
          subinner.querySelector('.subbinner').innerHTML += valueAry[index][inner].outerHTML;
          // subinner.querySelector('.section > .default-content-wrapper > p')
          //   .classList.add('studytab-title');
          // .append(valueAry[index][inner]);
          innerdiv.append(subinner);
        });
        buildtabblock(innerdiv);
        const container = div(
          { class: 'contain' },
          div(elobj),
          div({ class: 'maininnerdiv' }),
        );
        container.querySelector('.maininnerdiv').innerHTML += innerdiv.outerHTML;
        divmain.append(container);
      });
      // console.log(divmain);
      buildtabblock(divmain);
      if (!data.classList.contains('modal-wrapper')) {
        data.append(divmain);
      }

      const tableRender = (panel) => {
        const headkey = panel.querySelector('.section').getAttribute('data-tab-head-title');
        const key = panel.querySelector('.section').getAttribute('data-tab-title');
        const paneldata = dataMapMoObj.objdata[headkey][key];
        const htmldata = paneldata.querySelector('ul ul').querySelectorAll('ul');
        const selectedLabelTab = paneldata.querySelector('p').textContent.trim();
        const pPreVal = selectedLabelTab.split(' ')[0].slice(0, -2);
        const supValue = selectedLabelTab.split(' ')[0].slice(-2);
        // var pPostval = selectedLabelTab.split(' ')[1]
        const pPostval = selectedLabelTab.split(' ').slice(1).join(' ');

        if (window.location.pathname.includes('/wcs/in/en/coverage')) {
          const tableMain = div(
            { class: 'coverage-table-container' },
            // p({ class: 'studytab-title' }, selectedLabelTab),
            p({ class: 'studytab-title' }, pPreVal, sup({ class: 'test' }, supValue), ' ', pPostval),
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
          Array.from(htmldata[0].querySelectorAll('li')).map((el, headind) => {
            el.classList.add('coverage-thead-th');
            el.classList.add(`coverage-th-${headind + 1}`);
            const stringel = el.outerHTML;
            const repformat = stringel.replaceAll('<li', '<th').replaceAll('</li>', '</th>');
            tableMain.querySelector('.coverage-thead tr').innerHTML += repformat;
            return el;
          });
          Array.from(Array.from(htmldata).slice(1)).map((el) => {
            el.classList.add('coverage-tbody-tr');
            const eldatali = el.querySelectorAll('li');
            Array.from(eldatali).forEach((elsub, index) => {
              elsub.classList.add('coverage-tbody-td');
              elsub.classList.add(`coverage-td-${index + 1}`);
            });
            const stringsec = el.outerHTML;
            const repformat = stringsec.replaceAll('<ul', '<tr')
              .replaceAll('</ul>', '</tr>').replaceAll('<li', '<td').replaceAll('</li>', '</td>');
            tableMain.querySelector('.coverage-tbody').innerHTML += repformat;
            return el;
          });
          if (!panel.querySelector('.coverage-table-container')) {
            panel.querySelector('.coverage-table-panel').append(tableMain);
            panel.querySelector('.coverage-table-panel').style.display = 'block';
            panel.querySelector('.default-content-wrapper').style.display = 'none';
          }
        }
      };

      data.querySelectorAll('.innerdiv').forEach((eldiv) => {
        eldiv.querySelectorAll('.tabs-list button').forEach((tabbtn) => {
          tabbtn.addEventListener('click', () => {
            eldiv.querySelectorAll('[role=tabpanel]').forEach((panel) => {
              panel.setAttribute('aria-hidden', true);
            });
            eldiv.querySelectorAll('.tabs-list button').forEach((btn) => {
              btn.setAttribute('aria-selected', false);
            });
            tabbtn.setAttribute('aria-selected', true);
            const attr = tabbtn.getAttribute('id').replace('tab', 'tabpanel');
            const tabpanel = eldiv.querySelector(`#${attr}`);
            tabpanel.setAttribute('aria-hidden', false);
            if (tabpanel.querySelector('.coverage-table-panel')) {
              tableRender(tabpanel);
            }
          });
        });
        eldiv.querySelectorAll('.tabs-list button')[0]
          .setAttribute('aria-selected', true);
        eldiv.querySelectorAll('[role=tabpanel]')[0]
          .setAttribute('aria-hidden', false);
      });

      // Coverage Tab Dropdown
      const dropdownlist = divmain.querySelector('.tabs-list');
      let activeTab;
      Array.from(dropdownlist.children).forEach((el) => {
        if (el.getAttribute('aria-selected') === 'true') {
          activeTab = el.textContent;
        }
      });
      // sup
      const pPreValactive = activeTab.split(' ')[0].slice(0, -2);
      const supValueactive = activeTab.split(' ')[0].slice(-2);
      // var pPostvalactive = activeTab.split(' ')[1]
      const pPostvalactive = activeTab.split(' ').slice(1).join(' ');
      const tabDrodpwon = div(
        { class: 'tab-dropdown-wrap' },
        // p({ class: 'selected-tab' }, activeTab),
        p({ class: 'selected-tab' }, p({ class: 'studytab-title' }, pPreValactive, sup({ class: 'test' }, supValueactive), ' ', pPostvalactive)),
        div({ class: 'tab-droplist' }),
      );
      tabDrodpwon.querySelector('.tab-droplist').append(dropdownlist);

      divmain.prepend(tabDrodpwon);

      // // coverage dropdown should be visible onle after more than 1
      const wcsCoverageDrpdownOpt = divmain.querySelectorAll('.tab-dropdown-wrap .tabs-list .tabs-tab');
      const wcsCoverageDrpdown = divmain.querySelector('.selected-tab');
      if (wcsCoverageDrpdownOpt.length <= 1) {
        wcsCoverageDrpdown.style.pointerEvents = 'none';
        wcsCoverageDrpdown.classList.add('no-dropdown-icon');
      } else {
        wcsCoverageDrpdown.style.removeProperty('pointer-events');
        wcsCoverageDrpdown.classList.remove('no-dropdown-icon');
      }

      const tabmainclick = divmain.querySelector('.tab-dropdown-wrap');
      tabmainclick.addEventListener('click', () => {
        const selectedTab = tabmainclick.querySelector('.selected-tab');
        const tabslistwrap = tabmainclick.querySelector('.tab-droplist');
        const tabslist = tabmainclick.querySelectorAll('.tabs-list .tabs-tab');
        const a = tabmainclick.querySelectorAll('button');

        a.forEach((btn) => {
          const arr = btn.textContent;
          console.log(arr);
          // sup
          const pPreValbtn = arr.split(' ')[0].slice(0, -2);
          const supValuebtn = arr.split(' ')[0].slice(-2);
          // var pPostvalbtn = arr.split(' ')[1]
          const pPostvalbtn = arr.split(' ').slice(1).join(' ');
          btn.innerHTML = '';
          btn.appendChild(span({ class: 'studytab-title' }, pPreValbtn, sup({ class: 'test' }, supValuebtn), ' ', pPostvalbtn));
          tabmainclick.classList.toggle('active');
        });

        if (!tabslistwrap.classList.contains('active')) {
          tabslist.forEach((tab) => {
            if (tab.getAttribute('aria-selected') === 'true') {
              // selectedTab.textContent = tab.textContent;
              selectedTab.innerHTML = '';
              selectedTab.innerHTML = tab.innerHTML;
            }
          });
        }
      });
      block.closest('.section').style.display = 'block';
      document.addEventListener('click', (event) => {
        const selectedTab = tabmainclick.querySelector('.selected-tab');
        const tabslistwrap = tabmainclick.querySelector('.tab-droplist');
        if (!selectedTab.contains(event.target) && !tabslistwrap.contains(event.target)) {
          tabmainclick.classList.remove('active');
        }
      });
    }
  }
  return block;
}
