import dataMapMoObj from '../../scripts/constant.js';

export default function decorate(block) {
  dataMapMoObj.CLASS_PREFIXES = [
    'philosophy-cont',
    'philosophy-sec',
    'philosophy-sub',
    'philosophy-inner-text',
    'philosophy-list',
    'philosophy-list-content',
    'philosophy-list-row',
  ];
  dataMapMoObj.addIndexed(block);
  const cont1 = document.querySelector('.strategy-philosophy .philosophy-cont1');
  const cont2 = document.querySelector('.strategy-philosophy .philosophy-cont2');

  if (cont1 && cont2) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('philosophy-wrap'); // your new wrapper

    // Insert wrapper before cont1
    cont1.parentNode.insertBefore(wrapper, cont1);

    // Move cont1 & cont2 inside wrapper
    wrapper.appendChild(cont1);
    wrapper.appendChild(cont2);
  }
}
