<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useApi} from '~/composables/useApi'
import TransactionForm from './popup/TransactionForm.vue'
import UpdateCancelTransaction from './popup/UpdateCancelTransaction.vue'

const showUpdateCancelTransaction = ref(false)
const selectedTransaction = ref<number | null>(null)
const showTransactionForm = ref(false)
const openDropdown = ref<number | null>(null)

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
  transaction_code: string
  source_type: string
  reference_id: string
  direction: string
  amount: number
  payment_method: string
  created_at: string
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  share: 'Share',
  payment: 'Payment',
  cancellation: 'Cancellation',
  registration_payments: 'Registration Payment',
}
const DIRECTION_LABELS: Record<string, string> = {
  in: 'In',
  out: 'Out',
  reinvest: 'Reinvest',
}
const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  bank: 'Bank Transfer',
  card: 'Card',
  ewallet: 'E-Wallet',
}

const fetchTransactions = async () => {
  if (!memberId) {
    error.value = 'Invalid member ID'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await api.get(`/transactions/admin/member/${memberId}/transactions/`)
    transactions.value = Array.isArray(response.data) ? response.data : []
  } catch (err: any) {
    console.error(err)
    error.value = err.response?.data?.detail || 'Failed to fetch transactions.'
  } finally {
    loading.value = false
  }
}

const filteredTransactions = computed(() => {
  return transactions.value.filter((t) => {
    const matchesSearch = `${t.source_type} ${t.transaction_code} ${t.direction}`
        .toLowerCase()
        .includes(search.value.toLowerCase())
    const matchesType = selectedType.value === 'All' || t.source_type === selectedType.value
    return matchesSearch && matchesType
  })
})

const toggleDropdown = (id: number) => {
  openDropdown.value = openDropdown.value === id ? null : id
}

const openUpdatePopup = (transactionId: number) => {
  selectedTransaction.value = transactionId
  showUpdateCancelTransaction.value = true
}

onMounted(() => {
  fetchTransactions()
})
</script>

<template>
  <div class="transaction">

    <div class="transaction-header">
      <h2 class="transaction-title">Member Transactions</h2>
      <div class="transaction-header-container">
        <input type="text" v-model="search" class="transaction-search" placeholder="Search Transactions ..."/>
        <button class="transaction-create-btn" @click="showTransactionForm = true">Create transaction</button>
        <TransactionForm v-model:show="showTransactionForm"/>
      </div>
    </div>

    <div class="transaction-table-wrapper">
      <div class="transaction-table">
        <div class="transaction-row transaction-row--head">
          <span></span>
          <span>Transaction Code</span>
          <span>Source Type</span>
          <span>Direction</span>
          <span>Amount (RM)</span>
          <span>Payment Method</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        <div v-for="transaction in filteredTransactions" :key="transaction.transaction_id" class="transaction-row">
          <span></span>
          <span>{{ transaction.transaction_code }}</span>
          <span>{{ SOURCE_TYPE_LABELS[transaction.source_type] || transaction.source_type }}</span>
          <span>{{ DIRECTION_LABELS[transaction.direction] || transaction.direction }}</span>
          <span>RM {{ parseFloat(transaction.amount).toFixed(2) }}</span>
          <span>{{ PAYMENT_METHOD_LABELS[transaction.payment_method] || transaction.payment_method }}</span>
          <span>{{ transaction.created_at.slice(0, 10) }}</span>

          <div class="transaction-actions">
            <div class="dropdown">
              <button class="dropdown-toggle" @click="toggleDropdown(transaction.transaction_id)">
                <UIcon name="mdi-dots-vertical"/>
                Actions
              </button>
              <div class="dropdown-menu" v-if="openDropdown === transaction.transaction_id">
                <NuxtLink :to="`/administrators/transactions/${transaction.transaction_id}`" class="dropdown-item">
                  <UIcon name="mdi:file-eye" class="icon"/>
                  View
                </NuxtLink>
                <button class="dropdown-item" @click="openUpdatePopup(transaction.transaction_id)">
                  <UIcon name="mdi-pencil" class="icon"/>
                  Update
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-if="!loading && !transactions.length" class="no-transactions">

      <img src="/images/no-data-icon.png" class="no-transactions-img-container" alt="no">

      <p class="no-transactions-header">No transactions found for this member.</p>

    </div>

    <UpdateCancelTransaction v-model:show="showUpdateCancelTransaction" :transaction-id="selectedTransaction"/>
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
  }

  &-table {
    display: flex;
    flex-direction: column;
    min-width: 1000px;
    min-height: 100px;
  }

  &-row {
    display: grid;
    grid-template-columns:
    30px
    minmax(160px, 1fr)
    minmax(160px, 1fr)
    minmax(80px, 1fr)
    minmax(100px, 1fr)
    minmax(150px, 1fr)
    minmax(100px, 1fr)
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

.dropdown {
  position: relative;
  display: inline-block;

  .dropdown-toggle {
    cursor: pointer;
    padding: 6px 12px;
    background-color: var(--cancel-button-bg);
    border: none;
    outline: none;
    border-radius: 6px;
    height: 36px;
    transition: var(--transition);

    &:hover {
      background: var(--cancel-hover-button-bg);
    }

  }

  .dropdown-menu {
    position: absolute;
    background-color: var(--primary-bg);
    min-width: 140px;
    border-radius: 6px;
    overflow: hidden;
    z-index: 1000;

    button {
      background: transparent;
      outline: none;
      border: none;
      min-width: 140px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      color: var(--primary-text-color);
      text-decoration: none;
      height: 36px;

      &:hover {
        background-color: var(--cancel-button-bg);
      }
    }
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
      grid-template-columns: 30px 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 20px;
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
      grid-template-columns: 30px 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 0;
      padding: 0;
      height: 48px;
      align-content: center;
    }
  }
}

.no-transactions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100px;
}

.no-transactions img {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.no-transactions p {
  font-size: var(--body-text);
  font-weight: 500;
  color: var(--primary-text-color);
  margin: 0;
}


</style>