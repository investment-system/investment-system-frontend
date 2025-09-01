<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useApi} from '~/composables/useApi'
import UpdateProfitTransaction from './popup/UpdateProfitTransaction.vue'

const showUpdateProfitTransaction = ref(false)
const selectedTransaction = ref<number | null>(null)

const transactions = ref<Transaction[]>([])
const search = ref('')
const selectedType = ref('All')
const loading = ref(false)
const error = ref('')

const api = useApi()
const route = useRoute()
const memberId = route.params.id as string

interface Transaction {
  transaction_id: number
  source_type: string
  direction: string
  amount: number
  payment_method: string
  created_at: string
}

const fetchTransactions = async () => {
  if (!memberId) {
    error.value = 'Invalid member ID'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await api.get(`/profit/profit-payouts/?member_id=${memberId}`)
    transactions.value = Array.isArray(response.data) ? response.data : []
  } catch (err: any) {
    console.error(err)
    error.value = err.response?.data?.detail || 'Failed to fetch profit payouts.'
  } finally {
    loading.value = false
  }
}

const filteredTransactions = computed(() => {
  return transactions.value
      .filter(t => t.payout_type === 'pending') // only pending
      .filter((t) => {
        const matchesSearch = `${t.source_type} ${t.transaction_id} ${t.direction}`
            .toLowerCase()
            .includes(search.value.toLowerCase())
        const matchesType = selectedType.value === 'All' || t.source_type === selectedType.value
        return matchesSearch && matchesType
      })
})

const openUpdatePopup = (transactionId: number) => {
  selectedTransaction.value = transactionId
  showUpdateProfitTransaction.value = true
}

onMounted(() => {
  fetchTransactions()
})

</script>

<template>
  <div class="transaction">
    <div class="transaction-header">
      <h2 class="transaction-title">Pending Profit Approvals</h2>
    </div>

    <div class="transaction-table-wrapper">

      <div class="transaction-row transaction-row--head">
        <span></span>
        <span>ID</span>
        <span>Payout Type</span>
        <span>Profit Rate (%)</span>
        <span>Profit Amount (RM)</span>
        <span>Refund Amount (RM)</span>
        <span>Processed On</span>
        <span>Actions</span>
      </div>

      <div v-for="transaction in filteredTransactions" :key="transaction.payout_id" class="transaction-row">
        <span></span>
        <span>{{ transaction.payout_id }}</span>
        <span>{{ transaction.payout_type }}</span>
        <span>{{ transaction.profit_rate }}</span>
        <span>RM {{ parseFloat(transaction.profit_amount).toFixed(2) }}</span>
        <span>RM {{ parseFloat(transaction.refund_amount).toFixed(2) }}</span>
        <span>{{ transaction.updated_at.slice(0, 10) }}</span>
        <div class="transaction-actions">
          <button class="update-btn" @click="openUpdatePopup(transaction.payout_id)">
            <UIcon name="mdi-pencil" class="icon"/>
            Update
          </button>
        </div>
      </div>

      <div v-if="!filteredTransactions.length" class="no-transactions">
        <img src="/images/no-data-icon.png" alt="no data">
        <p>No pending transactions for this member yet.</p>
      </div>
    </div>

    <UpdateProfitTransaction
        v-model:show="showUpdateProfitTransaction"
        :payout-id="selectedTransaction"
    />

  </div>
</template>

<style scoped lang="scss">
.transaction {
  padding: 15px;
  min-height: 50vh;

  &-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  &-title {
    font-size: var(--heading-4);
    color: var(--primary-text-color);
    font-weight: normal;
    height: 36px;
    align-content: center;
  }

  .transaction-create-btn {
    width: 100%;
    font-size: var(--button-font-size);
    color: var(--primary-text-color);
    background: var(--button-bg);
    border: none;
    cursor: pointer;
    border-radius: 6px;
    padding: 10px;
    text-align: center;
    height: 36px;
    align-content: center;
    transition: var(--transition);

    &:hover {
      background: var(--hover-button-bg);
    }

    @media (min-width: 640px) {
      width: auto;
    }
  }

  .transaction-header-container {
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (min-width: 640px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &-search {
    padding: 10px 20px;
    height: 36px;
    border: 2px solid var(--secondary-text-color);
    color: var(--primary-text-color);
    border-radius: 6px;
    font-size: var(--body-text);

    @media (min-width: 640px) {
      max-width: 300px;
    }
  }

  &-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
    height: 200px;
  }

  &-table {
    display: flex;
    flex-direction: column;
    min-width: 1200px;
  }

  &-row {
    display: grid;
    grid-template-columns:
      30px
      minmax(120px, 0.8fr)
      minmax(160px, 1fr)
      minmax(80px, 0.5fr)
      minmax(120px, 1fr)
      minmax(140px, 1fr)
      minmax(160px, 1fr)
      100px;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    font-size: var(--small-text);
    color: var(--secondary-text-color);
    height: 48px;
    padding: 0;

    &--head {
      background-color: var(--table-header-bg);
      color: var(--primary-text-color);
      font-size: var(--body-text);
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
      border-radius: 6px 6px 0 0;
      min-width: 1200px;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:nth-child(3) {
        white-space: normal;
        word-break: break-word;
        line-height: 1.3;
      }
    }
  }

  &-checkbox {
    width: 18px;
    height: 18px;
    margin: 0 auto;
    border-radius: 6px;
  }

  &-actions {
    gap: 5px;
    justify-content: center;
  }
}

.scroll-hint {
  display: block;
  text-align: center;
  font-size: 0.75rem;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.btn {
  display: inline-block;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;
  text-align: center;

  &--update {
    font-size: var(--body-text);
    color: var(--primary-text-color);
    transition: var(--transition);
    text-align: start;

    &:hover {
      color: var(--accent-color);
    }
  }

  &--danger {
    display: block;
    background: var(--danger-color);
    color: var(--primary-text-color);
    margin-top: 20px;
    border: none;
    width: 150px;
    height: 36px;
    align-content: end;
    transition: var(--transition);

    &:hover:not(:disabled) {
      background: var(--danger-color);
      color: var(--secondary-text-color);
    }

    &:disabled {
      background-color: var(--danger-color);
      color: var(--primary-text-color);
      cursor: not-allowed;
    }
  }
}

@media (min-width: 640px) {
  .scroll-hint {
    display: none;
  }

  .transaction {
    &-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    &-search {
      max-width: 300px;
    }

    &-row {
      gap: 20px; // keep same columns, just add breathing space
    }
  }

  .btn {
    width: 150px;
    height: 36px;
    align-content: center;
    font-size: var(--button-font-size);
  }
}

@media (min-width: 1024px) {
  .transaction {
    padding: 20px;

    &-title {
      font-size: var(--heading-3);
    }

    &-search {
      font-size: var(--body-text);
      padding: 10px 20px;
    }

    &-row {
      gap: 0;
      padding: 0 10px;
      height: 48px;
      align-content: center;
    }
  }
}

.update-btn {
  cursor: pointer;
  padding: 6px 12px;
  background-color: var(--cancel-button-bg);
  border-radius: 6px;
  height: 36px;
  border: none;

  &:hover {
    background: var(--cancel-hover-button-bg);
  }
}

.no-transactions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100px;

  img {
    width: 80px;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  p {
    font-size: var(--body-text);
    font-weight: 500;
    color: var(--primary-text-color);
  }
}
</style>
