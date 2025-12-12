import dataMapMoObj from '../../scripts/constant.js';

export default async function decorate(block) {
  if (block != null) {
    dataMapMoObj.CLASS_PREFIXES = [
      'glpcoding',
      'glpcoding-inner',
      'glpcoding-sub-inner',
    ];
    dataMapMoObj.addIndexed(block);
    const mainbl = block.closest('main');
    const data = mainbl.querySelectorAll('.tab-glp');
    if (data.length !== 0) {
      data.forEach((ele) => {
        if (ele != null) {
          dataMapMoObj.CLASS_PREFIXES = [
            'glp-tab-block',
            'glp-tab-inner',
            'glp-tab-sub-inner',
            'glp-tab-sub-inner-sub',
            'glp-tab-ul',
            'glp-tab-inner-ul',
            'glp-tab-li',
            'glp-tab-sub-inner-ul',
            'glp-tab-inner-li',
            'glp-tab-sub-inner-li',
            'glp-tab-sub-inner-li-sub',
            'glp-li',
            'glp-li-inner',
          ];
          dataMapMoObj.addIndexed(ele);

          const addClassName = ele.querySelectorAll('.glp-tab-li1');
          if (addClassName) {
            addClassName.forEach((elem) => {
              elem.classList.add('li-containers');
            });
          }

          const addClassNameli = ele.querySelectorAll('.glp-tab-sub-inner-ul2');
          if (addClassNameli) {
            addClassNameli.forEach((elem) => {
              elem.classList.add('same-li');
            });
          }

          const addClassNamel = ele.querySelectorAll('.glp-tab-sub-inner-ul1');
          if (addClassNamel) {
            addClassNamel.forEach((elem) => {
              elem.classList.add('same-li');
            });
          }
        }
      });
    }

    (function () {
      const mobileBreakpoint = 768;
      let imageContainer = block.querySelector('.decoding-qglp-static .comlist.glpcoding2');
      let targetParent = block.querySelector('.decoding-qglp-static .comlist.glpcoding1 > .comlist.glpcoding-inner1');
      let referenceElement = block.querySelector('.decoding-qglp-static .comlist.glpcoding-sub-inner3');

      // Fallback attempt to search within a broader scope (mainbl)
      if (!imageContainer || !targetParent || !referenceElement) {
        imageContainer = imageContainer || mainbl.querySelector('.comlist.glpcoding2');
        targetParent = targetParent || mainbl.querySelector('.comlist.glpcoding1 > .comlist.glpcoding-inner1');
        referenceElement = referenceElement || mainbl.querySelector('.comlist.glpcoding-sub-inner3');
      }

      // Final check for required elements
      if (!imageContainer || !targetParent || !referenceElement) {
        console.error('QGLP reordering: required elements not found.');
        return;
      }

      // Save original location for desktop restoration
      // const originalParent = imageContainer.parentElement;
      // const originalNextSibling = imageContainer.nextElementSibling;

      // --- Responsive Movement Logic ---
      function moveImageForMobile() {
        const currentWidth = window.innerWidth;

        if (currentWidth < mobileBreakpoint) {
          // Mobile (Width <= 767px): move into the text area before the reference element
          if (imageContainer.parentElement !== targetParent) {
            targetParent.insertBefore(imageContainer, referenceElement);
            // console.debug('QGLP: moved image into text block for mobile');
          }
        }
        // else {
        //   if (imageContainer.parentElement !== originalParent) {
        //     if (originalNextSibling && originalNextSibling.parentElement === originalParent) {
        //       originalParent.insertBefore(imageContainer, originalNextSibling);
        //     } else {
        //       originalParent.appendChild(imageContainer);
        //     }
        //   }
        // }
      }
      // --- End of moveImageForMobile function ---

      // 1. Run once now (for direct load)
      moveImageForMobile();

      // 2. Keep it responsive (listen for resize/orientation change)
      window.addEventListener('resize', moveImageForMobile);

      // Correctly close the Immediately Invoked Function Expression (IIFE)
    }());

    (function () {
      const parentElements = document.querySelectorAll('.qglp-static-component .comlist.qglp-static-ls-li2');

      const newClass = 'highlight';

      // 2. Check if any parent elements were found (length > 0)
      if (parentElements.length > 0) {
        // 3. Iterate over each parent element found
        parentElements.forEach((parentElement) => {
          const strongElement = parentElement.querySelector('strong');
          if (strongElement) {
            strongElement.classList.add(newClass);
          }
        });
      }
    }());
  }
}
