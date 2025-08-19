<script setup>
import {defineEmits, defineProps, reactive} from 'vue'

defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show'])

const closePopup = () => {
  emit('update:show', false)
}

const form = reactive({
  payout_type: 'pending',
  transaction: '',
  share_record: '',
  invoice_file: null,
  profit_rate: '12.00',
  profit_amount: '',
  refund_amount: '',
  reinvestment_created: false,
  created_at: new Date().toISOString().slice(0, 10)
});

const fields = [
  {
    label: 'Transaction ID',
    model: 'transaction',
    type: 'number',
    placeholder: 'Enter transaction ID'
  },
  {
    label: 'Share Record ID',
    model: 'share_record',
    type: 'number',
    placeholder: 'Enter share record ID'
  },
  {
    label: 'Payout Type',
    model: 'payout_type',
    type: 'select',
    placeholder: 'Select payout type',
    options: [
      {value: 'pending', label: 'Pending'},
      {value: 'full_transfer', label: 'Full Transfer'},
      {value: 'partial', label: 'Partial Transfer'},
      {value: 'reinvest', label: 'Reinvest All'}
    ]
  },
  {
    label: 'Profit Rate (%)',
    model: 'profit_rate',
    type: 'number',
    placeholder: 'Auto-filled or manual'
  },
  {
    label: 'Invoice File',
    model: 'invoice_file',
    type: 'file',
    placeholder: 'Upload invoice (optional)'
  },
];

const submitForm = () => {
  console.log('Form submitted:', form)
}
</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-header">
        <h4 class="popup-title">Update Profit Transaction</h4>
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
                :readonly="field.readonly"
                :disabled="field.disabled"
            >
              <option disabled value="">Please select</option>
              <option
                  v-for="option in field.options"
                  :key="option.value"
                  :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>

            <div v-else-if="field.type === 'file'" class="file-upload-wrapper">
              <input
                  :id="field.model"
                  type="file"
                  class="hidden-file-input"
                  @change="handleFileChange($event, field.model)"
                  :disabled="field.disabled"
              />
              <label :for="field.model" class="file-icon-label">
                <UIcon name="mdi-file-upload" class="upload-icon"/>
                <span class="file-selected" v-if="form[field.model]"> File selected</span>
              </label>
            </div>


            <input
                v-else
                :id="field.model"
                v-model="form[field.model]"
                :type="field.type"
                class="form-control"
                :placeholder="field.placeholder"
                :readonly="field.readonly"
                :disabled="field.disabled"
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
          gap: 0;
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

          .hidden-file-input {
            display: none;
          }

          .file-upload-wrapper {
            display: block;
            align-items: center;
            gap: 0.5rem;
          }

          .file-icon-label {
            display: flex;
            align-items: center;
            align-content: center;
            margin: 0 auto;
            gap: 0.4rem;
            cursor: pointer;
            background-color: var(--input-field-bg);
            padding: 6px 10px;
            border-radius: 6px;
            color: var(--primary-text-color);
          }

          .upload-icon {
            font-size: var(--heading-4);
            margin: 0 auto;
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
