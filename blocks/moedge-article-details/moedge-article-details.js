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

  // ---------------- SHARE CONTAINER ----------------

  document.querySelectorAll('.comlist.submainart3.itemmainleftart3').forEach((listItem) => {
    const ul = listItem.querySelector('.comlist.submainleftart2');
    if (!ul) return;

    [...ul.children].forEach((li, index) => {
      li.classList.add(`listindex${index + 1}`);
    });
  });

  document.querySelectorAll('.comlist.submainart3.itemmainleftart3').forEach((item) => {
    const shareIcon = item.querySelector('.icon-share-black');
    const popup = item.querySelector('.comlist.submainleftart2');

    if (!shareIcon || !popup) return;

    // Hide popup initially
    popup.classList.remove('active');

    // TOGGLE popup
    shareIcon.addEventListener('click', (e) => {
      e.stopPropagation();

      const isVisible = popup.style.display === 'block';
    });

    // GET SHARE TEXT + URL
    const getShareData = () => {
      const shareUrl = window.location.href;
      const shareText = item.querySelector('h3')?.innerText || 'Check this out';
      return { shareUrl, shareText };
    };

    // FACEBOOK
    const fb = popup.querySelector('.listindex1');
    if (fb) {
      fb.querySelector('a').removeAttribute('href');
      fb.addEventListener('click', (e) => {
        e.stopPropagation();
        const { shareUrl } = getShareData();
        const link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(link, '_blank');
      });
    }

    // WHATSAPP
    const wa = popup.querySelector('.listindex2');
    if (wa) {
      wa.querySelector('a').removeAttribute('href');
      wa.addEventListener('click', (e) => {
        e.stopPropagation();
        const { shareUrl, shareText } = getShareData();
        const link = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        window.open(link, '_blank');
      });
    }

    // X (TWITTER)
    const tw = popup.querySelector('.listindex3');
    if (tw) {
      tw.querySelector('a').removeAttribute('href');
      tw.addEventListener('click', (e) => {
        e.stopPropagation();
        const { shareUrl, shareText } = getShareData();
        const link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(link, '_blank');
      });
    }

    // COPY URL
    // COPY BUTTON (listindex4)
    const cp = popup.querySelector('.listindex4');
    const copyPopup = popup.querySelector('.listindex5');

    if (cp && copyPopup) {
      // hide listindex5 initially
      copyPopup.style.display = 'none';
      copyPopup.style.position = 'absolute';
      copyPopup.style.left = '50%';
      copyPopup.style.top = '50%';
      copyPopup.style.transform = 'translate(-50%, -50%)';
      copyPopup.style.zIndex = '999';

      cp.querySelector('a')?.removeAttribute('href');

      cp.addEventListener('click', async (e) => {
        e.stopPropagation();

        try {
          await navigator.clipboard.writeText(window.location.href);

          // show centered popup (listindex5)
          copyPopup.style.display = 'block';

          // auto-hide after 2 sec
          setTimeout(() => {
            copyPopup.style.display = 'none';
          }, 2000);
        } catch (err) {
          console.log("Copy failed", err);
        }
      });
    }
  });

  // CLOSE popup when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.comlist.submainleftart2').forEach(p => p.classList.remove('active'));//p.style.display = "none");
  });

  // const shareWrapper = document.querySelector(".itemmainleftart3");
  // const shareBtn = shareWrapper.querySelector(".submainleftart1");
  // const dropdown = shareWrapper.querySelector(".submainleftart2");

  // // Toggle dropdown when clicking share icon
  // shareBtn.addEventListener("click", function (e) {
  //   e.stopPropagation();6
  //   dropdown.classList.toggle("active");
  // });

  // // Close dropdown on outside click
  // document.addEventListener("click", function (e) {
  //   if (!shareWrapper.contains(e.target)) {
  //     dropdown.classList.remove("active");
  //   }
  // });

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
