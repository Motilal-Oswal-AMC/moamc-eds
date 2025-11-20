/**
 * Decorates the moedge-article-video block.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const mainArticle1 = block.querySelector('.mainarticle1');
  const mainArticle2 = block.querySelector('.mainarticle2');

  if (mainArticle1 && mainArticle2 && mainArticle1.parentNode === mainArticle2.parentNode) {
    const parent = mainArticle1.parentNode;
    const wrapperDiv = document.createElement('div');
    wrapperDiv.classList.add('articles-wrapper');
    parent.insertBefore(wrapperDiv, mainArticle1);
    wrapperDiv.appendChild(mainArticle1);
    wrapperDiv.appendChild(mainArticle2);
  }

  const shareWrapper = document.querySelector('.itemmainleftart3');
  const shareBtn = shareWrapper.querySelector('.submainleftart1');
  const dropdown = shareWrapper.querySelector('.submainleftart2');

  // Toggle dropdown when clicking share icon
  shareBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!shareWrapper.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  //  // Investor Education article left and right wrapper
  // if (window.location.href.includes('/investor-education/all-articles/')
  //  || window.location.href.includes('/motilal-oswal-edge/article-details')) {
  //   const maincloser = block.closest('main');
  //   const rightSub = maincloser.querySelectorAll('.article-sub-right');
  //   const rightarticle = maincloser.querySelector('.article-right-wrapper');
  //   Array.from(rightSub).forEach((rightel) => {
  //     rightarticle.append(rightel);
  //   });
  //   const leftSub = maincloser.querySelectorAll('.article-sub-left');
  //   const leftarticle = maincloser.querySelector('.article-left-wrapper');
  //   Array.from(leftSub).forEach((leftel) => {
  //     leftarticle.append(leftel);
  //   });
  //   if (maincloser.querySelector('.moedge-article-details')) {
  //     dataMapMoObj.CLASS_PREFIXES = ['articlemain', 'articlesub', 'articleitem',
  //       'subarticle', 'mainarticle', 'itemarticle', 'itemsubart',
  //       'mainitemart', 'itemmainart', 'submainart'];
  //     dataMapMoObj.addIndexed(
  //       maincloser.querySelector('.moedge-article-details'),
  //     );

  //     const mainleft = maincloser.querySelector('.article-left-wrapper');
  //     dataMapMoObj.CLASS_PREFIXES = ['leftartmain', 'leftartsub', 'leftartitem',
  //       'subleftart', 'mainleftart', 'itemleftart', 'itemleftart',
  //       'mainitemleftart', 'itemmainleftart', 'submainleftart'];
  //     dataMapMoObj.addIndexed(
  //       mainleft,
  //     );
  //   }
  //   const formpath = maincloser.querySelector('.article-right-wrapper .subscribe-email');
  //   const formdiv = formpath
  //     .querySelector('.subscribe-email .button-container');
  //   formBlock(formdiv);
  // }

  // ... any other decoration logic for this block would go here ...
}
