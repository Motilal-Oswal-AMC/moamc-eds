// import { toClassName } from '../../scripts/aem.js';
// import dataCfObj from '../../scripts/dataCfObj.js';
// import fundCardblock from '../fund-card/fund-card.js';
// import {
//   button, a, div, input, ul, li, img, table, thead, tbody, tr, th, td,
// } from '../../scripts/dom-helpers.js';
import dataMapMoObj from '../../scripts/constant.js';
// import moEdge from './popular-acticles.js';

export default async function decorate(block) {
  const previousStudiesBlog = block.closest('.previous-studies-blog');
  if (previousStudiesBlog !== null) {
    dataMapMoObj.CLASS_PREFIXES = ['ps-ex', 'ps-in', 'ps-cont', 'ps-subcont'];
    dataMapMoObj.addIndexed(previousStudiesBlog);
  }

  document.querySelectorAll('.previous-studies-blog > .comlist').forEach((card) => {
  // Find the key containers within this specific card
    const psIn1 = card.querySelector('.comlist.ps-in1'); // container for picture
    const psIn4 = card.querySelector('.comlist.ps-in4'); // container for source anchor

    // --- This is the key check ---
    // If .ps-in4 doesn't exist (like in ps-ex1), skip this card.
    if (!psIn1 || !psIn4) {
      return;
    }

    // Find the picture element (currently in ps-in1)
    const picture = psIn1.querySelector('picture');
    // Find the anchor element (currently in ps-in4)
    const sourceAnchor = psIn4.querySelector('a.comlist.ps-subcont1');

    // Only proceed if we found both the picture and the anchor
    if (sourceAnchor && picture) {
    // 1. Detach the picture from its current location (ps-in1)
      picture.remove();

      // 2. Clear the text (like '/content/...') from the anchor
      sourceAnchor.innerHTML = '';

      // 3. Put the picture inside the anchor
      sourceAnchor.appendChild(picture);

      // 4. Put the anchor (which now holds the picture) into ps-in1
      psIn1.appendChild(sourceAnchor);

      // 5. Remove the now-empty ps-in4 container
      psIn4.remove();
    }
  });

  const playBtn = document.querySelectorAll('.previous-studies-ctn .tabs-panel .previous-studies-blog-wrapper .icon img');
  playBtn.forEach((e) => {
    dataMapMoObj.altFunction(e, 'play-btn-icon');
  });

  const psCont1 = document.querySelectorAll('.previous-studies-blog-wrapper .previous-studies-blog .ps-in1 .ps-cont1');
  if (psCont1) {
    psCont1.forEach((e) => {
      e.classList.add('ps-cont-plybtn');
    });
  }

  const eachStudiesBlog = document.querySelectorAll('.previous-studies-blog-wrapper .previous-studies-blog > .comlist');
  Array.from(eachStudiesBlog).forEach((ex) => {
    const parent = ex.querySelector('.ps-in1');
    const toMove = ex.querySelector('.ps-in3');

    if (parent && toMove) {
      parent.appendChild(toMove); // move ps-in3 inside ps-in1
    }
  });

  try {
    const legendWord = document.querySelector('.section.previous-studies-ctn');
    if (legendWord) {
      legendWord.classList.add('legendWordCtn');
    }
  } catch (error) {
    // console.log(error);
  }
}
