<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import { memberSourceTypeOptions, paymentMethodOptions } from "@/constants/lists"
import TransactionSuccess from '../popup/TransactionSuccess.vue'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['update:show', 'success'])

const api = useApi()

const currentUser = ref<any>(null)
const memberId = ref<number | null>(null)

const showTransactionSuccess = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const validationErrors = ref<Record<string, string>>({})

const form = ref({
  source_type: 'share',
  direction: 'in',
  amount: '300',
  payment_method: '',
  member: null as number | null,
  received_invoice_doc: null as File | null
})

onMounted(async () => {
  try {
    const profileRes = await api.get('/auth/profile/')
    currentUser.value = profileRes.data
    memberId.value = profileRes.data.id

  } catch (err) {
    console.error("Failed to fetch current user profile", err)
  }
})

watch(() => props.show, (newVal) => {
  if (newVal) {
    if (!memberId.value) {
      console.warn('Member ID not loaded yet')
      return
    }
    form.value = {
      source_type: 'share',
      direction: 'in',
      amount: '300',
      payment_method: '',
      member: memberId.value,
      received_invoice_doc: null
    }
    validationErrors.value = {}
    errorMessage.value = ''
  }
})

const fields = [
  { label: 'Source Type', model: 'source_type', type: 'select', placeholder: 'Select source type', options: memberSourceTypeOptions, required: true },
  { label: 'Amount', model: 'amount', type: 'number', placeholder: 'Enter transaction amount', required: true },
  { label: 'Payment Method', model: 'payment_method', type: 'select', placeholder: 'Select payment method', options: paymentMethodOptions, required: true },
  { label: 'Invoice Document', model: 'received_invoice_doc', type: 'file', placeholder: 'Upload invoice document', required: true }
]

const validateForm = () => {
  const errors: Record<string, string> = {}

  fields.forEach(field => {
    const value = (form.value as any)[field.model]
    if (field.required && (!value || value === '')) {
      errors[field.model] = `${field.label} is required`
    }
  })

  validationErrors.value = errors
  return Object.keys(errors).length === 0
}

const closePopup = () => emit('update:show', false)

const submitForm = async () => {
  if (!memberId.value) {
    alert('Member profile not loaded yet. Please wait.')
    return
  }

  if (!validateForm()) {
    errorMessage.value = 'Please fill in all required fields.'
    return
  }

  submitting.value = true
  errorMessage.value = ''

  try {
    const formData = new FormData()
    for (const key in form.value) {
      const value = (form.value as any)[key]
      if (value !== null && value !== '') {
        formData.append(key, value instanceof File ? value : value.toString())
      }
    }

    await api.post('/transactions/create/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    showTransactionSuccess.value = true
    closePopup()
    emit('success')

    setTimeout(() => {
      showTransactionSuccess.value = false
      location.reload()
    }, 3000)
  } catch (error: any) {
    console.error('Error creating transaction:', error.response?.data || error.message)
    errorMessage.value = error.response?.data?.detail || error.message
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">

      <div class="popup-header">
        <h4 class="popup-title">Create Transaction</h4>
        <hr class="line"/>
      </div>

      <div class="popup-body">
        <form @submit.prevent="submitForm" class="transaction-form" autocomplete="off">
          <div v-for="field in fields" :key="field.model" class="form-group">
            <label :for="field.model">{{ field.label }}</label>

            <select v-if="field.type === 'select'" :id="field.model" v-model="form[field.model]" class="form-control">
              <option disabled value="">Please select</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>

            <input v-else-if="field.type === 'text' || field.type === 'number'"
                   :type="field.type"
                   v-model="form[field.model]"
                   :placeholder="field.placeholder"
                   class="form-control"/>

            <input v-else-if="field.type === 'file'"
                   type="file"
                   @change="e => form[field.model] = e.target.files ? e.target.files[0] : null"
                   class="form-control"/>

            <p v-if="validationErrors[field.model]" class="field-error">
              {{ validationErrors[field.model] }}
            </p>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <div class="submit-btn-wrapper">
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? 'Submitting Request...' : 'Request Transaction' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <TransactionSuccess v-model:show="showTransactionSuccess"/>
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
          text-align: start;
          width: calc(100% - 40px);
          margin: 0 auto;

          label {
            font-size: var(--label-text);
            margin-bottom: 10px;
            height: 36px;
            display: flex;
            align-items: center;
            width: 100%;
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
            width: 100%;

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
