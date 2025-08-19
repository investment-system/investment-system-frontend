<script setup lang="ts">
import { defineEmits, defineProps, reactive, watch, ref } from 'vue'
import { useApi } from '~/composables/useApi'

const props = defineProps({
  show: Boolean,
  transactionId: Number,
})

const emit = defineEmits(['update:show'])
const api = useApi()
const loading = ref(false)
const error = ref('')

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
  cancellation_date: new Date().toISOString().split('T')[0],
  payout_type: 'pending',
  penalty_rate: '0.00',
  penalty_amount: '',
  refund_amount: '',
  created_at: new Date().toISOString().slice(0, 16)
})

watch(
    () => props.transactionId,
    async (id) => {
      if (!id) return
      loading.value = true
      try {
        const { data: t } = await api.get(`/transactions/transactions/${id}/`)
        console.log(t)

        form.source_type = t.source_type || ''
        form.direction = t.direction || ''
        form.amount = t.amount || ''
        form.payment_method = t.payment_method || ''
        form.reference_id = t.reference_id || ''
        form.member_id = t.member_id || ''
        form.share = t.share || t.share_record?.share_id || ''  // Pull share_id if exists
        form.cancellation_date = t.cancellation_date?.slice(0, 10) || ''
        form.payout_type = t.payout_type || 'pending'
        form.penalty_rate = t.penalty_rate || '0.00'
        form.penalty_amount = t.penalty_amount || ''
        form.refund_amount = t.refund_amount || ''
        form.created_at = t.created_at?.slice(0, 16) || new Date().toISOString().slice(0, 16)
      } catch (err) {
        console.error('Failed to fetch transaction:', err)
        error.value = 'Unable to fetch transaction.'
      } finally {
        loading.value = false
      }
    },
    { immediate: true }
)


const submitForm = async () => {
  try {
    loading.value = true
    await api.put(`/transactions/${props.transactionId}/`, form) // Update API
    console.log('Transaction updated successfully:', form)
    closePopup()
  } catch (err) {
    console.error('Failed to update transaction:', err)
    error.value = 'Failed to update transaction.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-header">
        <h4 class="popup-title">Update Transaction</h4>
      </div>
      <div class="popup-body">
        <div v-if="loading">Loading transaction...</div>
        <div v-else>
          <form @submit.prevent="submitForm" class="transaction-form">
            <div v-for="field in Object.keys(form)" :key="field" class="form-group">
              <label :for="field">{{ field.replace('_', ' ').toUpperCase() }}</label>
              <input
                  v-if="['amount','member_id','share','penalty_rate','penalty_amount','refund_amount'].includes(field)"
                  type="number"
                  :id="field"
                  v-model="form[field]"
                  class="form-control"
              />
              <input
                  v-else-if="['cancellation_date','created_at'].includes(field)"
                  type="date"
                  :id="field"
                  v-model="form[field]"
                  class="form-control"
              />
              <input
                  v-else
                  type="text"
                  :id="field"
                  v-model="form[field]"
                  class="form-control"
              />
            </div>
            <button type="submit" class="submit-btn">Update</button>
          </form>
        </div>
      </div>
      <div v-if="error" class="error">{{ error }}</div>
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
