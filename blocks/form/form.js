/*    */
import createField from './form-fields.js';
import dataMapMoObj from '../../scripts/constant.js';

export async function createForm(formHref, submitHref) {
  const {
    pathname,
  } = new URL(formHref);
  const resp = await fetch(pathname);
  const json = await resp.json();

  const form = document.createElement('form');
  form.dataset.action = submitHref;

  const fields = await Promise.all(json.data.map((fd) => createField(fd, form)));
  fields.forEach((field) => {
    if (field) {
      form.append(field);
    }
  });

  // group fields into fieldsets
  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    form.querySelectorAll(`[data-fieldset="${fieldset.name}"`).forEach((field) => {
      fieldset.append(field);
    });
  });

  return form;
}

function generatePayload(form) {
  const payload = {};

  [...form.elements].forEach((field) => {
    if (field.name && field.type !== 'submit' && !field.disabled) {
      if (field.type === 'radio') {
        if (field.checked) payload[field.name] = field.value;
      } else if (field.type === 'checkbox') {
        if (field.checked) payload[field.name] = payload[field.name] ? `${payload[field.name]},${field.value}` : field.value;
      } else {
        payload[field.name] = field.value;
      }
    }
  });
  return payload;
}

async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;

    // create payload
    const payload = generatePayload(form);
    const response = await fetch(form.dataset.action, {
      method: 'POST',
      body: JSON.stringify({
        data: payload,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      if (form.dataset.confirmation) {
        window.location.href = form.dataset.confirmation;
      }
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (e) {
    //   -next-line no-console
  } finally {
    form.setAttribute('data-submitting', 'false');
    submit.disabled = false;
  }
}

export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')].map((a) => a.href);
  const formLink = links.find((link) => link.startsWith(window.location.origin) && link.endsWith('.json'));
  // const submitLink = links.find((link) => link !== formLink);
  // if (!formLink || !submitLink) return;

  const form = await createForm(formLink); // , submitLink);
  block.replaceChildren(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();
    if (valid) {
      handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }
  });

  // if (block.closest('.growth-now-container')) {
  //   const phno = block.querySelector('#form-1');

  //   if (phno) {
  //     phno.setAttribute('maxlength', '10');

  //     const sanitizeInput = (event) => {
  //       const inputValue = event.target.value;
  //       const sanitizedValue = inputValue.replace(/[^\d]/g, '');
  //       event.target.value = sanitizedValue;
  //     };
  //     phno.addEventListener('input', sanitizeInput);
  //     const wrapper = phno.closest('.field-wrapper');

  //     if (wrapper) {
  //       const label = wrapper.querySelector('label');
  //       if (label) {
  //         wrapper.appendChild(label);
  //       }
  //     }
  //   }

  //   dataMapMoObj.updateSelectIds('countrySelect', 'countryLabel');
  // }

  // Change select id and its label
  if (block.closest('.growth-now-container')) {
    const phno = block.querySelector('#form-1');

    if (phno) {
      // 1. Sanitize Input (Numbers Only)
      phno.setAttribute('maxlength', '10');
      phno.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
      });

      // 2. Setup Wrapper & Label
      const wrapper = phno.closest('.field-wrapper');
      if (wrapper) {
        wrapper.classList.add('phnodata'); // Ensure class exists for CSS

        // Move Label AFTER Input (Crucial for consistent layout)
        const label = wrapper.querySelector('label');
        if (label) {
          wrapper.appendChild(label); // Physically moves label to end
        }

        // 3. Floating Logic (The "Active" Check)
        const checkInputState = () => {
          // If input has value OR is currently focused -> Float the label
          if (phno.value.trim().length > 0 || document.activeElement === phno) {
            if (label) label.classList.add('active-label');
          } else if (label) label.classList.remove('active-label');
        };

        // Run on load (in case browser autofills)
        checkInputState();

        // Listen for events
        phno.addEventListener('focus', () => {
          if (label) label.classList.add('active-label');
        });

        phno.addEventListener('blur', checkInputState); // On click out, check if we should drop down
        phno.addEventListener('input', checkInputState); // On typing
        phno.addEventListener('change', checkInputState); // On autofill
      }
    }

    // Update country dropdowns if needed
    if (typeof dataMapMoObj !== 'undefined') {
      dataMapMoObj.updateSelectIds('countrySelect', 'countryLabel');
    }
  }

  function updateSelectIds(newSelectId, newLabelId) {
    const selectEl = block.querySelector('form .countrycode select');
    const labelEl = block.querySelector('form .countrycode label');
    if (selectEl && labelEl) {
      selectEl.id = newSelectId;
      labelEl.setAttribute('for', newSelectId);
      selectEl.setAttribute('name', 'addNumber');
      labelEl.id = newLabelId;
    }
    labelEl.remove();
    selectEl.setAttribute('aria-label', 'Select country code');
  }
  dataMapMoObj.updateSelectIds = updateSelectIds;
}
