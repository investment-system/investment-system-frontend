<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { defineEmits, defineProps } from 'vue'
import { useApi } from '~/composables/useApi'
import { shareStatus } from '@/constants/lists'


const props = defineProps({
  show: Boolean,
  transactionId: Number
})

const emit = defineEmits(['update:show', 'updated'])
const api = useApi()
const loading = ref(false)
const error = ref('')

const shareRecordId = ref<number | null>(null)
const transactionShareStatus = ref('')

const filteredShareStatus = computed(() => {
  if (!transactionShareStatus.value) return shareStatus
  return shareStatus.filter(c =>
      c.label.toLowerCase().startsWith(transactionShareStatus.value.toLowerCase())
  )
})

const SOURCE_TYPE_LABELS: Record<string, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  share: 'Share',
  payment: 'Payment',
  cancellation: 'Cancellation',
  registration_payments: 'Registration Payment',
  Profit_payments: 'Profit Payment'
}
const DIRECTION_LABELS: Record<string, string> = { in: 'In', out: 'Out', reinvest: 'Reinvest' }
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
  ewallet: 'E-Wallet'
}

const fields = ref([
  { label: 'Source Type', model: 'source_type', type: 'select', editable: false, options: Object.entries(SOURCE_TYPE_LABELS).map(([value, label]) => ({ value, label })) },
  { label: 'Direction', model: 'direction', type: 'select', editable: false, options: Object.entries(DIRECTION_LABELS).map(([value, label]) => ({ value, label })) },
  { label: 'Amount (MYR)', model: 'amount', type: 'number', editable: false },
  { label: 'Payment Method', model: 'payment_method', type: 'select', editable: false, options: Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({ value, label })) },
  { label: 'Project Name', model: 'project_name', type: 'text', editable: true },
  { label: 'Share Date', model: 'share_date', type: 'date', editable: false },
  { label: 'Return Rate (%)', model: 'share_return_rate', type: 'number', editable: true },
  { label: 'Expected Maturity Date', model: 'expected_share_maturity_date', type: 'date', editable: true },
  { label: 'Status', model: 'status', type: 'select', editable: true, options: filteredShareStatus.value },
  { label: 'Duration (Days)', model: 'share_duration_days', type: 'number', editable: true }
])

const form = ref({
  source_type: '',
  direction: '',
  amount: '',
  payment_method: '',
  reference_id: '',
  member_id: '',
  project_name: '',
  share_date: '',
  share_return_rate: '',
  expected_share_maturity_date: '',
  status: '',
  received_transaction: '',
  share_duration_days: 365,
  profit_payout_created: false,
  share_record_id: null
})

const fetchTransaction = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get(`/transactions/transactions/${props.transactionId}/`)

    form.value = {
      transactionId: data.transaction_id,
      transaction_code: data.transaction_code,
      source_type: data.source_type,
      direction: data.direction,
      amount: data.amount,
      payment_method: data.payment_method,
      reference_id: data.reference_id,
      member_id: data.member,
      project_name: data.share_record?.project_name || '',
      share_date: data.share_record?.share_date || '',
      share_return_rate: data.share_record?.share_return_rate || '',
      expected_share_maturity_date: data.share_record?.expected_share_maturity_date || '',
      status: data.share_record?.status || '',
      share_duration_days: data.share_record?.share_duration_days || 365,
      received_transaction: data.received_invoice_doc || '',
      profit_payout_created: data.share_record?.profit?.payout_created || false,
      share_record_id: data.share_record?.share_id || null
    }

  } catch (err) {
    console.error('Error fetching transaction:', err)
    error.value = 'Unable to fetch transaction.'
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (val) => {
  if (val && props.transactionId) fetchTransaction()
})

const closePopup = () => emit('update:show', false)

const submitForm = async () => {
  if (!form.value.share_record_id) {
    console.warn('Share record ID missing')
    return alert('Share record ID missing')
  }

  const payload = {
    project_name: form.value.project_name || '',
    status: form.value.status || 'pending',
    expected_share_maturity_date: form.value.expected_share_maturity_date || form.value.share_date,
    share_duration_days: Number(form.value.share_duration_days) || 365 ,
    share_return_rate: Number(form.value.share_return_rate) || 10
  }


  try {
    const response = await api.patch(
        `/share/share-record/${form.value.share_record_id}/`,
        payload
    )


    if (response?.data?.error) {
      console.error('Backend returned an error:', response.data.error)
      return alert('Failed to update transaction: ' + response.data.error)
    }

    emit('updated')
    closePopup()

  } catch (err: any) {

    alert('Failed to update transaction: ' + err.message)
    console.error('Failed to update ShareRecord:', err)

    const message =
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        'Failed to update transaction'

    alert(message)
  }
}
</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-header">
        <h4>Update Share Transaction</h4>
      </div>

      <div class="popup-body" v-if="!loading && !error">
        <form @submit.prevent="submitForm" class="transaction-form">
          <div v-for="field in fields" :key="field.model" class="form-group">

            <label :for="field.model">{{ field.label }}</label>

            <select class="form-control" v-if="field.type === 'select'" :id="field.model" v-model="form[field.model]" :disabled="!field.editable">
              <option disabled value="">Please select</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">{{ option.label }}</option>
            </select>

            <input class="form-control" v-else :id="field.model" v-model="form[field.model]" :type="field.type" :readonly="!field.editable"/>
          </div>

          <div class="btn-wrapper">
            <button type="button" class="cancel-btn" @click="closePopup">Cancel</button>
            <button type="submit" class="submit-btn">Submit</button>
          </div>
        </form>
      </div>

      <div v-if="loading">Loading transaction...</div>
      <div v-if="error">{{ error }}</div>
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

        .btn-wrapper {
          display: flex;
          justify-content: end;
          gap: 20px;

          button {
            height: 36px;
            padding: 10px 15px;
            align-items: end;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 20px;
            color: var(--primary-bg-text-color);
            font-size: var(--text-button-text);
            transition: var(--transition);
          }

          .submit-btn {
            background: var(--button-bg);

            &:hover {
              background: var(--hover-button-bg);
            }
          }

          .cancel-btn {
            background: var(--cancel-button-bg);

            &:hover {
              background: var(--cancel-hover-button-bg);
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
