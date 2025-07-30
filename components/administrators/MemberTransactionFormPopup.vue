<script setup>
import {defineEmits, defineProps} from 'vue'

defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show'])

const closePopup = () => {
  emit('update:show', false)
}

import {ref} from 'vue'

const form = ref({
  source_type: '',
  direction: 'in',
  amount: '',
  payment_method: '',
  reference_id: '',
  member_id: ''
})

const fields = [
  {
    label: 'Source Type',
    model: 'source_type',
    type: 'select',
    placeholder: 'Select source type',
    options: [
      {value: 'deposit', label: 'Deposit'},
      {value: 'withdrawal', label: 'Withdrawal'},
      {value: 'share', label: 'Share'},
      {value: 'payment', label: 'Payment'},
      {value: 'cancellation', label: 'Cancellation'},
      {value: 'registration_payments', label: 'Registration Payment'}
    ]
  },
  {
    label: 'Direction',
    model: 'direction',
    type: 'select',
    placeholder: 'Select direction',
    options: [
      {value: 'in', label: 'In'},
      {value: 'out', label: 'Out'}
    ]
  },
  {
    label: 'Amount',
    model: 'amount',
    type: 'number',
    placeholder: 'Enter transaction amount'
  },
  {
    label: 'Payment Method',
    model: 'payment_method',
    type: 'select',
    placeholder: 'Select payment method',
    options: [
      {value: 'cash', label: 'Cash'},
      {value: 'bank_transfer', label: 'Bank Transfer'},
      {value: 'card', label: 'Card'},
      {value: 'ewallet', label: 'E-Wallet'}
    ]
  },
  {
    label: 'Reference ID',
    model: 'reference_id',
    type: 'text',
    placeholder: 'Enter reference ID (if any)'
  },
  {
    label: 'Member ID',
    model: 'member_id',
    type: 'number',
    placeholder: 'Enter member ID'
  }
]

const submitForm = () => {
  console.log('Form submitted:', form.value)
  // location.reload()
}

</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-header">
        <h4 class="popup-title">Create Transaction</h4>
        <h4 class="line"></h4>
      </div>
      <div class="popup-body">

        <form @submit.prevent="submitForm" class="transaction-form" autocomplete="off">
          <div v-for="field in fields" :key="field.model" class="form-group">
            <label :for="field.model">{{ field.label }}</label>

            <select
                v-if="field.type === 'select'"
                :id="field.model"
                v-model="form[field.model]"
                class="form-control"
            >
              <option disabled value="">Please select</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <input
                v-else
                :id="field.model"
                v-model="form[field.model]"
                :type="field.type"
                class="form-control"
                :placeholder="field.placeholder"
            />
          </div>

          <div class="submit-btn-wrapper">
            <button type="submit" class="submit-btn">Submit</button>
          </div>


        </form>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  z-index: 1002;

  .popup-container {
    background-color: var(--primary-bg);
    border-radius: 12px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    text-align: center;
    padding: 16px;

    .popup-header {
      display: flex;
      align-items: center;
      gap: 20px;
      width: 100%;
      margin-bottom: 16px;
      background-color: var(--secondary-bg);
      height: 50px;
      align-content: center;
      padding: 12px;
      border-radius: 6px;

      .popup-title {
        font-size: var(--body-font-size);
        white-space: nowrap;
      }

      .line {
        flex-grow: 1;
        border-bottom: 2px solid var(--border-color);
        height: 0;
      }

    }

    .popup-body {
      .transaction-form {
        margin-block-start: 20px;

        .form-group {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          text-align: start;
          width: calc(100% - 40px);
          margin: 0 auto;

          label {
            font-size: var(--label-text);
            margin-bottom: 10px;
            height: 36px;
            display: flex;
            align-items: center;
          }

          .form-control {
            padding: 5px 10px;
            border: none;
            outline: none;
            border-radius: 6px;
            font-size: var(--placeholder-text);
            color: var(--secondary-text-color);
            background: var(--input-field-bg);
            height: 36px;
            display: flex;
            align-items: center;
          }
        }

        .submit-btn-wrapper {
          text-align: right;

          .submit-btn {
            background: var(--button-bg);
            color: var(--primary-text-color);
            font-size: var(--text-button-text);
            height: 36px;
            padding: 10px 15px;
            display: inline-flex;
            align-items: center;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
            transition: var(--transition);

            &:hover {
              background: var(--hover-button-bg);
            }
          }
        }
      }
    }
  }

  @media (min-width: 768px) {
    .popup-container {
      max-width: 80%;
      padding: 20px;

      .popup-header h4 {
        font-size: var(--heading-4);
      }

      .popup-body {
        .transaction-form {
          width: 100%;
          margin: 0 auto;

          .form-group {
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }
        }
      }
    }
  }

  @media (min-width: 1024px) {
    .popup-container {
      max-width: 500px;

      .popup-body {
        .transaction-form {
          width: 100%;
          margin: 0 auto;

          .form-group {
            grid-template-columns: 1fr 1fr;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
