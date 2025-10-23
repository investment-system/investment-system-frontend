<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import {useRoute} from 'vue-router'
import {useApi} from '~/composables/useApi'
import TransactionForm from '~/components/administrators/popup/TransactionForm.vue'
import UpdateShareTransaction from '~/components/administrators/popup/UpdateShareTransaction.vue'

const showUpdateShareTransaction = ref(false)
const selectedTransaction = ref<number | null>(null)
const showTransactionForm = ref(false)

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

const transactionTypes = ['All', 'deposit', 'withdrawal', 'share', 'payment', 'cancellation', 'registration_payments']

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

const openUpdatePopup = (transactionId: number) => {
  selectedTransaction.value = transactionId
  showUpdateShareTransaction.value = true
}

onMounted(() => {
  fetchTransactions()
})
</script>

<template>
  <div class="transaction">
    <div class="transaction-header">
      <div class="header-content">
        <h2 class="page-title">Member Transactions</h2>
        <p class="page-subtitle">View and manage all member transaction history</p>
      </div>

      <div class="filters-section">
        <button class="btn-create" @click="showTransactionForm = true">
          <UIcon name="mdi-plus" class="btn-icon" />
          <span>New Transaction</span>
        </button>

        <div class="search-wrapper">
          <UIcon name="mdi-magnify" class="search-icon" />
          <input
              type="text"
              v-model="search"
              class="search-input"
              placeholder="Search by code, type, or direction..."
          />
        </div>

        <div class="filter-wrapper">
          <label class="filter-label">Type:</label>
          <select v-model="selectedType" class="filter-select">
            <option v-for="type in transactionTypes" :key="type" :value="type">
              {{ type === 'All' ? 'All Types' : SOURCE_TYPE_LABELS[type] || type }}
            </option>
          </select>
        </div>
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
            <NuxtLink
                :to="`/administrators/transactions/${transaction.transaction_id}`"
                class="action-btn view-btn"
                title="View Transaction"
            >
              <UIcon name="mdi-file-eye" class="w-5 h-5" />
            </NuxtLink>

            <button
                @click="openUpdatePopup(transaction.transaction_id)"
                class="action-btn edit-btn"
                title="Edit Transaction"
            >
              <UIcon name="mdi-pencil" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !transactions.length" class="no-transactions">
      <img src="/images/no-data-icon.png" class="no-transactions-img-container" alt="no">
      <p class="no-transactions-header">No transactions found for this member.</p>
    </div>

    <TransactionForm v-model:show="showTransactionForm" @transaction-created="fetchTransactions" />
    <UpdateShareTransaction v-model:show="showUpdateShareTransaction" :transaction-id="selectedTransaction"/>
  </div>
</template>

<style scoped lang="scss">
.transaction {
  padding: 15px;
  min-height: 60vh;
  background-color: #f9fafb;

  @media (min-width: 768px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
  }

  &-header {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 24px;

    @media (min-width: 768px) {
      gap: 24px;
    }
  }
}

.transaction-header {
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
  }

  .header-content {
    flex: 1;
    min-width: 200px;

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #111827;
      margin: 0;
      line-height: 1.2;

      @media (min-width: 768px) {
        font-size: 1.625rem;
      }

      @media (min-width: 1024px) {
        font-size: 1.75rem;
      }
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: #6b7280;
      margin-top: 4px;

      @media (min-width: 768px) {
        font-size: 0.9rem;
      }

      @media (min-width: 1024px) {
        font-size: 0.95rem;
      }
    }
  }

  .filters-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;

    @media (min-width: 640px) {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      width: auto;
    }

    @media (min-width: 768px) {
      justify-content: flex-end;
    }

    .btn-create {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--button-bg);
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--primary-text-color);
      cursor: pointer;
      transition: all 0.25s ease;
      width: 100%;

      @media (min-width: 640px) {
        width: auto;
        font-size: var(--body-text);
      }

      &:hover {
        background: var(--hover-button-bg);
      }

      &:active {
        transform: translateY(0);
      }

      .btn-icon {
        width: 18px;
        height: 18px;
      }
    }

    .search-wrapper {
      position: relative;
      flex: 1;
      width: 100%;
      min-width: 200px;

      @media (min-width: 640px) {
        max-width: 280px;
      }

      @media (min-width: 768px) {
        max-width: 320px;
      }

      .search-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        width: 18px;
        height: 18px;
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        padding: 10px 14px 10px 42px;
        border: 1px solid #9ca3af;
        border-radius: 6px;
        font-size: 14px;
        color: #111827;
        background: #fff;
        transition: all 0.2s ease;

        &::placeholder {
          color: #9ca3af;
        }

        &:focus {
          outline: none;
          border-color: var(--button-bg);
        }
      }
    }

    .filter-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;

      @media (min-width: 640px) {
        width: auto;
      }

      .filter-label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #374151;
        white-space: nowrap;

        @media (min-width: 768px) {
          font-size: 0.9rem;
        }
      }

      .filter-select {
        flex: 1;
        padding: 8px 36px 8px 12px;
        border: 1px solid #9ca3af;
        border-radius: 6px;
        font-size: 14px;
        color: #111827;
        background: white
        url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E")
        no-repeat right 12px center;
        appearance: none;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 140px;

        @media (min-width: 640px) {
          min-width: 160px;
        }

        &:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }
      }
    }
  }
}

.transaction-table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  border-radius: 8px;
  margin: 0 auto;

  @media (min-width: 768px) {
    border-radius: 10px;
  }
}

.transaction-table {
  display: flex;
  flex-direction: column;
  min-width: 900px;
  min-height: 50vh;

  @media (min-width: 1024px) {
    min-width: 1000px;
  }
}

.transaction-row {
  display: grid;
  grid-template-columns:
    20px
    minmax(140px, 1fr)
    minmax(140px, 1fr)
    minmax(80px, 0.8fr)
    minmax(100px, 1fr)
    minmax(130px, 1fr)
    minmax(100px, 0.8fr)
    90px;
  align-items: center;
  border-bottom: 1px solid var(--border-color, #e5e7eb);
  font-size: 0.813rem;
  color: var(--secondary-text-color, #6b7280);
  height: 48px;
  padding: 0 12px;

  @media (min-width: 768px) {
    grid-template-columns:
      30px
      minmax(160px, 1fr)
      minmax(160px, 1fr)
      minmax(80px, 1fr)
      minmax(100px, 1fr)
      minmax(150px, 1fr)
      minmax(100px, 1fr)
      100px;
    font-size: var(--small-text, 0.875rem);
    padding: 0 16px;
  }

  &--head {
    background-color: var(--table-header-bg, #f9fafb);
    color: var(--primary-text-color, #111827);
    font-size: 0.813rem;
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 10;
    border-radius: 8px 8px 0 0;

    @media (min-width: 768px) {
      font-size: var(--body-text, 0.875rem);
      border-radius: 10px 10px 0 0;
    }
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 4px;

    @media (min-width: 768px) {
      padding: 0 8px;
    }

    &:nth-child(3) {
      white-space: normal;
      word-break: break-word;
      line-height: 1.3;
    }
  }
}

.transaction-actions {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  justify-content: center;

  @media (min-width: 768px) {
    gap: 6px;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.25s ease;
    position: relative;
    text-decoration: none;

    @media (min-width: 768px) {
      width: 36px;
      height: 36px;
    }

    .u-icon,
    svg {
      width: 18px;
      height: 18px;
      z-index: 1;
      position: relative;

      @media (min-width: 768px) {
        width: 20px;
        height: 20px;
      }
    }

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 8px;
      background: currentColor;
      opacity: 0;
      transition: opacity 0.25s ease;
    }

    &:hover {
      transform: translateY(-1px);
      &::before {
        opacity: 0.08;
      }
    }

    &:active {
      transform: translateY(0);
      &::before {
        opacity: 0.12;
      }
    }
  }

  .view-btn {
    &:hover {
      color: #3b82f6;
      background: #eff6ff;
    }
  }

  .edit-btn {
    &:hover {
      color: #10b981;
      background: #ecfdf5;
    }
  }

  .action-btn:not(:last-child)::after {
    content: '';
    position: absolute;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 14px;
    background: #e5e7eb;
    opacity: 0.5;

    @media (min-width: 768px) {
      right: -3px;
      height: 16px;
      opacity: 0.6;
    }
  }
}

.no-transactions {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 200px;
  padding: 40px 20px;
  margin-top: -20vh;

  @media (min-width: 768px) {
    margin-top: -30vh;
    min-height: 300px;
  }

  @media (min-width: 1024px) {
    margin-top: -40vh;
  }

  img {
    width: 60px;
    height: auto;
    margin-bottom: 1rem;
    opacity: 0.7;

    @media (min-width: 768px) {
      width: 80px;
    }
  }

  p {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--primary-text-color, #111827);
    margin: 0;

    @media (min-width: 768px) {
      font-size: var(--body-text, 1rem);
    }
  }
}

@media (max-width: 639px) {
  .transaction-table-wrapper {
    margin: 0 auto;
    border-radius: 0;
  }

  .transaction-row {
    font-size: 0.75rem;

    span {
      padding: 0 2px;
    }
  }
}
</style>