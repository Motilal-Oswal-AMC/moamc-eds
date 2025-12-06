import dataMapMoObj from '../../scripts/constant.js';
// import {
//   input
// } from '../../scripts/dom-helpers.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = [
    'edge-filter-cont',
    'edge-filter-section',
    'edge-filter-sub',
    'filter-lists',
    'filter-lists-wrap',
    'filter-titles',
    'filter-dropdown',
  ];
  dataMapMoObj.addIndexed(block);

  // Select only the list items that are actual dropdowns
  const dropdowns = block.querySelectorAll('.filter-lists2, .filter-lists3, .edge-filter-cont2 .filter-lists2');
  block.querySelectorAll('a').forEach((element) => {
    element.removeAttribute('href');
  });
  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.filter-lists-wrap1');
    if (!trigger) return;

    // Set initial accessibility attributes
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    // 1. THE FIX: Add a click listener to the trigger
    trigger.addEventListener('click', (e) => {
      // Stop the click from bubbling up to the document, which would close the menu
      e.stopPropagation();

      // Check if the current dropdown is already open
      const isOpen = dropdown.classList.contains('is-open');

      // First, close all other dropdowns
      block.querySelectorAll('.is-open').forEach((openDropdown) => {
        if (openDropdown !== dropdown) {
          openDropdown.classList.remove('is-open');
          openDropdown.querySelector('.filter-lists-wrap1').setAttribute('aria-expanded', 'false');
        }
      });

      // 2. THE FIX: Toggle the 'is-open' class on the current dropdown
      dropdown.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', !isOpen);
    });
  });

  // block.querySelectorAll('.edge-filter-sub1 ul li').forEach((elemfilter) => {
  //   elemfilter.addEventListener('click', (event) => {
  //     event.preventDefault();
  //     const textSelect = elemfilter.textContent;
  //     const spanul = event.target.closest('ul').parentElement
  //       .querySelector('p span');
  //     event.target.closest('ul').parentElement
  //       .querySelector('p').textContent = '';
  //     event.target.closest('ul').parentElement
  //       .querySelector('p').textContent = textSelect;
  //     event.target.closest('ul').parentElement
  //       .querySelector('p').append(spanul);
  //   });
  // });

  // 3. THE FIX: Add a listener to the whole document to close menus
  document.addEventListener('click', () => {
    block.querySelectorAll('.is-open').forEach((openDropdown) => {
      openDropdown.classList.remove('is-open');
      openDropdown.querySelector('.filter-lists-wrap1').setAttribute('aria-expanded', 'false');
    });
  });
}
