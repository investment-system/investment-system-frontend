<script setup>
import { defineEmits, defineProps, reactive } from 'vue'

defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show'])

const closePopup = () => {
  emit('update:show', false)
}

const form = reactive({
  source_type: 'cancellation',
  direction: 'out',
  amount: '',
  payment_method: '',
  reference_id: '',
  member_id: '',
  share: '',
  cancellation_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  payout_type: 'pending',
  penalty_rate: '0.00',
  penalty_amount: '',
  refund_amount: '',
  created_at: new Date().toISOString().slice(0, 16) // datetime-local format: YYYY-MM-DDTHH:mm
});

const fields = [
  {
    label: 'Source Type',
    model: 'source_type',
    type: 'select',
    placeholder: 'Select source type',
    options: [
      { value: 'share', label: 'Share' },
      { value: 'cancellation', label: 'Cancellation' },
    ]
  },
  {
    label: 'Direction',
    model: 'direction',
    type: 'select',
    placeholder: 'Select direction',
    options: [
      { value: 'in', label: 'In' },
      { value: 'out', label: 'Out' }
    ]
  },
  {
    label: 'Amount',
    model: 'amount',
    type: 'number',
    placeholder: 'Enter amount',
  },
  {
    label: 'Payment Method',
    model: 'payment_method',
    type: 'select',
    placeholder: 'Select payment method',
    options: [
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'cash', label: 'Cash' },
      { value: 'online', label: 'Online' }
    ]
  },
  {
    label: 'Reference ID',
    model: 'reference_id',
    type: 'text',
    placeholder: 'Enter reference ID (e.g., cancellation code)'
  },
  {
    label: 'Member ID',
    model: 'member_id',
    type: 'number',
    placeholder: 'Enter member ID'
  },
  {
    label: 'Share ID',
    model: 'share',
    type: 'number',
    placeholder: 'Enter related share ID'
  },
  {
    label: 'Cancellation Date',
    model: 'cancellation_date',
    type: 'date',
    placeholder: 'Select cancellation date'
  },
  {
    label: 'Payout Type',
    model: 'payout_type',
    type: 'select',
    placeholder: 'Select payout type',
    options: [
      { value: 'pending', label: 'Pending' },
      { value: 'full_transfer', label: 'Full Transfer' },
      { value: 'partial_transfer', label: 'Partial Transfer' }
    ]
  },
  {
    label: 'Penalty Rate (%)',
    model: 'penalty_rate',
    type: 'number',
    placeholder: 'Enter penalty rate'
  },
  {
    label: 'Penalty Amount',
    model: 'penalty_amount',
    type: 'number',
    placeholder: 'Auto-calculated or enter manually'
  },
  {
    label: 'Refund Amount',
    model: 'refund_amount',
    type: 'number',
    placeholder: 'Auto-calculated refund amount'
  },
  {
    label: 'Created At',
    model: 'created_at',
    type: 'datetime-local',
    placeholder: 'Auto-filled on creation'
  }
];

const submitForm = () => {
  console.log('Form submitted:', form)
}
</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-header">
        <h4 class="popup-title">Update Canceled Transaction</h4>
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
