<script setup lang="ts">
import { defineProps, defineEmits, reactive, watch, ref } from 'vue'
import { useApi } from '~/composables/useApi'

const props = defineProps({
  show: Boolean,
  transactionId: Number,  // cancellation record ID
})

const emit = defineEmits(['update:show', 'updated'])
const api = useApi()
const loading = ref(false)
const error = ref('')

// Editable fields only
const editableFields = ['payout_type', 'invoice_file', 'penalty_rate']
const isEditable = (field: string) => editableFields.includes(field)

const closePopup = () => {
  emit('update:show', false)
}

// Form reactive object
const form = reactive({
  cancellation_code: '',
  payout_type: 'pending',
  share: '',
  member_id: '',
  cancellation_date: new Date().toISOString().split('T')[0],
  penalty_rate: '0.00',
  penalty_amount: '',
  refund_amount: '',
  invoice_file: null as File | null,
  created_at: new Date().toISOString().slice(0, 16),
})

// Watch transactionId and fetch cancel transaction
watch(
    () => props.transactionId,
    async (id) => {
      if (!id) return
      loading.value = true
      error.value = ''
      try {
        const { data } = await api.get(`/cancels/cancellation-record/${props.transactionId}/`)

        form.cancellation_code = data.cancellation_code
        form.payout_type = data.payout_type
        form.share = data.share
        form.member_id = data.member
        form.cancellation_date = data.cancellation_date?.slice(0, 10)
        form.penalty_rate = data.penalty_rate
        form.penalty_amount = data.penalty_amount
        form.refund_amount = data.refund_amount
        form.created_at = data.created_at?.slice(0, 16)
        form.invoice_file = null // reset file, optional
      } catch (err) {
        console.error('Failed to fetch transaction:', err)
        error.value = 'Unable to fetch transaction.'
      } finally {
        loading.value = false
      }
    },
    { immediate: true }
)

// Submit updated fields
const submitForm = async () => {
  try {
    loading.value = true
    const payload = new FormData()
    editableFields.forEach((field) => {
      if (field === 'invoice_file' && form.invoice_file) {
        payload.append(field, form.invoice_file)
      } else {
        payload.append(field, (form as any)[field])
      }
    })
    await api.put(`/cancels/cancellation-record/${props.transactionId}/`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    console.log('Cancel transaction updated successfully')
    emit('updated')
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
        <h4 class="popup-title">Update Cancel Transaction</h4>
      </div>
      <div class="popup-body">
        <div v-if="loading">Loading transaction...</div>
        <div v-else>
          <form @submit.prevent="submitForm" class="transaction-form">
            <div v-for="field in Object.keys(form)" :key="field" class="form-group">
              <label :for="field">{{ field.replace('_', ' ').toUpperCase() }}</label>

              <!-- File input -->
              <input
                  v-if="field === 'invoice_file'"
                  type="file"
                  @change="e => form.invoice_file = e.target.files[0]"
                  :disabled="!isEditable(field)"
              />

              <!-- Number input -->
              <input
                  v-else-if="['penalty_rate','penalty_amount','refund_amount','share','member_id'].includes(field)"
                  type="number"
                  :id="field"
                  v-model="form[field]"
                  :readonly="!isEditable(field)"
                  class="form-control"
              />

              <!-- Date input -->
              <input
                  v-else-if="['cancellation_date','created_at'].includes(field)"
                  type="date"
                  :id="field"
                  v-model="form[field]"
                  :readonly="!isEditable(field)"
                  class="form-control"
              />

              <!-- Text input -->
              <input
                  v-else
                  type="text"
                  :id="field"
                  v-model="form[field]"
                  :readonly="!isEditable(field)"
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

<style scoped>
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.popup-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 500px;
  max-width: 90%;
}
.popup-header {
  margin-bottom: 16px;
}
.popup-title {
  font-size: 18px;
  font-weight: bold;
}
.transaction-form .form-group {
  margin-bottom: 12px;
}
.submit-btn {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #0056b3;
}
.error {
  color: red;
  margin-top: 10px;
}
</style>
