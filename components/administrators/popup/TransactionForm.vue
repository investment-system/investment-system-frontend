<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'
import { sourceTypeOptions, directionOptions, paymentMethodOptions } from "@/constants/lists"
import TransactionSuccess from '../popup/TransactionSuccess.vue'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['update:show'])

const api = useApi()
const route = useRoute()
const memberId = route.params.id as string

const showTransactionSuccess = ref(false)
const errorMessage = ref("")

const form = ref({
  source_type: '',
  direction: 'in',
  amount: 50.0,
  payment_method: 'bank_transfer',
  reference_id: '',
  member: memberId,
  received_invoice_doc: null as File | null
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    form.value = {
      source_type: '',
      direction: 'in',
      amount: 50.0,
      payment_method: 'bank_transfer',
      reference_id: '',
      member: memberId,
      received_invoice_doc: null
    }
    errorMessage.value = ""
  }
})

const fields = [
  { label: 'Source Type', model: 'source_type', type: 'select', placeholder: 'Select source type', options: sourceTypeOptions, required: true },
  { label: 'Direction', model: 'direction', type: 'select', placeholder: 'Select direction', options: directionOptions, required: true },
  { label: 'Amount', model: 'amount', type: 'number', placeholder: 'Enter transaction amount', required: true },
  { label: 'Payment Method', model: 'payment_method', type: 'select', placeholder: 'Select payment method', options: paymentMethodOptions, required: true },
  { label: 'Reference ID', model: 'reference_id', type: 'text', placeholder: 'Enter reference ID', required: true },
  { label: 'Invoice Document', model: 'received_invoice_doc', type: 'file', placeholder: 'Upload invoice document (optional)', required: true }
]

const closePopup = () => emit('update:show', false)

const isFormValid = computed(() => {
  return fields.every(field => {
    if (field.required) {
      const value = form.value[field.model]
      return value !== null && value !== '' && value !== undefined
    }
    return true
  })
})

const submitForm = async () => {
  try {
    if (!isFormValid.value) {
      errorMessage.value = "Please fill in all required fields before submitting."
      return
    }

    errorMessage.value = ""
    const formData = new FormData()
    for (const key in form.value) {
      if (form.value[key] !== null && form.value[key] !== '') {
        formData.append(key, form.value[key])
      }
    }

    await api.post('/transactions/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    closePopup()
    showTransactionSuccess.value = true

    setTimeout(() => {
      showTransactionSuccess.value = false
      location.reload()
    }, 3000)

  } catch (error: any) {
    console.error('Error creating transaction:', error.response?.data || error.message)
    errorMessage.value = "Failed to create transaction. Please try again."
  }
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
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <form @submit.prevent="submitForm" class="transaction-form" autocomplete="off">
          <div v-for="field in fields" :key="field.model" class="form-group">
            <label :for="field.model">
              {{ field.label }}
              <span v-if="field.required" style=""></span>
            </label>

            <select
                v-if="field.type === 'select'"
                :id="field.model"
                v-model="form[field.model]"
                class="form-control"
                :required="field.required"
            >
              <option disabled value="">Please select</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <input
                v-else-if="field.type === 'text' || field.type === 'number'"
                :type="field.type"
                v-model="form[field.model]"
                :placeholder="field.placeholder"
                class="form-control"
                :required="field.required"
            />

            <input
                v-else-if="field.type === 'file'"
                type="file"
                @change="e => form[field.model] = e.target.files ? e.target.files[0] : null"
                class="form-control"
                :required="field.required"
            />
          </div>

          <div class="submit-btn-wrapper">
            <button type="submit" class="submit-btn">Create Transaction</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <TransactionSuccess v-model:show="showTransactionSuccess" />
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
            max-width: 200px;
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
.error-message {
  color: #b00020;
  font-size: 14px;
  margin-bottom: 10px;
  background: #ffe5e5;
  padding: 6px 10px;
  border-radius: 4px;
}
</style>
