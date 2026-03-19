import { Component } from '@theme/component';

/**
 * @typedef {Object} SellingPlanPickerRefs
 * @property {HTMLInputElement[]} planInputs - Radio inputs for selling plan options
 * @property {HTMLInputElement} [sellingPlanHiddenInput] - Hidden input in the product form
 */

/** @extends {Component<SellingPlanPickerRefs>} */
class SellingPlanPicker extends Component {
  /** @type {string|null} */
  #currentSellingPlanId = null;

  connectedCallback() {
    super.connectedCallback();
    this.#initSellingPlan();
    this.addEventListener('change', this.#handleChange.bind(this));
    this.addEventListener('click', this.#handleDeliveryClick.bind(this));
  }

  /**
   * Initialize the selling plan picker by finding the product form
   * and setting up the hidden input.
   */
  #initSellingPlan() {
    const hiddenInput = this.#getSellingPlanInput();
    if (!hiddenInput) return;

    const checkedRadio = this.querySelector('input[name="selling-plan-option"]:checked');

    if (checkedRadio) {
      const planId = checkedRadio.value;
      this.#currentSellingPlanId = planId || null;
      hiddenInput.value = planId || '';
      this.#updateSelectedState(checkedRadio);
    }
  }

  /**
   * Handle radio input changes
   * @param {Event} event
   */
  #handleChange(event) {
    const target = event.target;
    if (!target || target.name !== 'selling-plan-option') return;

    const planId = target.value;
    this.#currentSellingPlanId = planId || null;

    const hiddenInput = this.#getSellingPlanInput();

    if (hiddenInput) {
      hiddenInput.value = planId || '';
    }

    this.#updateSelectedState(target);

    this.dispatchEvent(new CustomEvent('selling-plan:change', {
      detail: { sellingPlanId: planId || null },
      bubbles: true
    }));
  }

  /**
   * Handle clicks on delivery frequency option buttons
   * @param {Event} event
   */
  #handleDeliveryClick(event) {
    const button = event.target.closest('.selling-plan-picker__delivery-option');
    if (!button) return;

    const planId = button.dataset.planId;
    if (!planId) return;

    const siblings = button.parentElement.querySelectorAll('.selling-plan-picker__delivery-option');

    for (const sib of siblings) {
      sib.classList.remove('selling-plan-picker__delivery-option--selected');
    }

    button.classList.add('selling-plan-picker__delivery-option--selected');

    const parentOption = button.closest('.selling-plan-picker__option');
    const radioInput = parentOption?.querySelector('input[type="radio"]');

    if (radioInput) {
      radioInput.value = planId;
      radioInput.checked = true;
      this.#currentSellingPlanId = planId;

      const hiddenInput = this.#getSellingPlanInput();

      if (hiddenInput) {
        hiddenInput.value = planId;
      }

      this.#updateSelectedState(radioInput);

      this.dispatchEvent(new CustomEvent('selling-plan:change', {
        detail: { sellingPlanId: planId },
        bubbles: true
      }));
    }
  }

  /**
   * Update the visual selected state of the option cards
   * @param {HTMLInputElement} selectedInput
   */
  #updateSelectedState(selectedInput) {
    const options = this.querySelectorAll('.selling-plan-picker__option');

    for (const option of options) {
      option.classList.remove('selling-plan-picker__option--selected');
    }

    const parentOption = selectedInput.closest('.selling-plan-picker__option');

    if (parentOption) {
      parentOption.classList.add('selling-plan-picker__option--selected');
    }
  }

  /**
   * Find the hidden selling_plan input in the product form
   * @returns {HTMLInputElement|null}
   */
  #getSellingPlanInput() {
    const productForm = this.closest('product-form-component')
      || document.querySelector('product-form-component');

    if (productForm) {
      const input = productForm.querySelector('input[name="selling_plan"]');
      if (input) return input;
    }

    const form = document.querySelector('form[data-type="add-to-cart-form"]');
    if (form) {
      return form.querySelector('input[name="selling_plan"]');
    }

    return null;
  }

  /**
   * Get the currently selected selling plan ID
   * @returns {string|null}
   */
  getSelectedSellingPlanId() {
    return this.#currentSellingPlanId;
  }
}

customElements.define('selling-plan-picker', SellingPlanPicker);
