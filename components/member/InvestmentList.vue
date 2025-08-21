<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { sourceTypeOptions, directionOptions, paymentMethodOptions } from '@/constants/lists'
import TransactionForm from '../member/popup/MemberTransactionForm.vue'

interface Transaction {
  transaction_id: number
  transaction_code: string
  member_id: number
  source_type: string
  reference_id: string
  direction: string
  amount: number
  payment_method: string
  created_at: string
}

const api = useApi()

const createLabelMap = (options: { value: string; label: string }[]): Record<string, string> => {
  return Object.fromEntries(options.map(opt => [opt.value, opt.label]))
}

const SOURCE_TYPE_LABELS = createLabelMap(sourceTypeOptions)
const DIRECTION_LABELS = createLabelMap(directionOptions)
const PAYMENT_METHOD_LABELS = createLabelMap(paymentMethodOptions)

const search = ref('')
const selectedType = ref('All')
const transactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref('')

const showTransactionForm = ref(false)

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/transactions/user/')
    if (Array.isArray(response.data)) {
      transactions.value = response.data
    } else if (response.data.transactions && typeof response.data.transactions === 'string') {
      const secondResponse = await api.get(response.data.transactions)
      transactions.value = secondResponse.data
    } else {
      console.error('Unexpected API response structure:', response.data)
      error.value = 'Unexpected API response format'
    }
  } catch (err) {
    console.error('Failed to fetch transactions:', err)
    error.value = 'Unable to load transactions. Please try again later.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTransactions()
})

const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    const matchesSearch = `${transaction.member_id} ${transaction.source_type} ${transaction.transaction_code} ${transaction.direction}`
        .toLowerCase()
        .includes(search.value.toLowerCase())

    const matchesType =
        selectedType.value === 'All' || transaction.source_type === selectedType.value

    return matchesSearch && matchesType
  })
})
</script>

<template>
  <div class="transaction">

    <div class="transaction-header">
      <h2 class="transaction-title">Transactions Records</h2>
      <div class="transaction-header-container">
        <button class="transaction-create-btn" @click="showTransactionForm = true">
          Create transaction
        </button>

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

        <div
            v-for="transaction in filteredTransactions"
            :key="transaction.transaction_id"
            class="transaction-row"
        >
          <span></span>
          <span>{{ transaction.transaction_code }}</span>
          <span>{{ SOURCE_TYPE_LABELS[transaction.source_type] || transaction.source_type }}</span>
          <span>{{ DIRECTION_LABELS[transaction.direction] || transaction.direction }}</span>
          <span>RM {{ parseFloat(transaction.amount).toFixed(2) }}</span>
          <span>{{ PAYMENT_METHOD_LABELS[transaction.payment_method] || transaction.payment_method }}</span>
          <span>{{ transaction.created_at.slice(0, 10) }}</span>
          <div class="transaction-actions">
            <NuxtLink :to="`/member/investments/${transaction.transaction_id}`" class="btn btn--update">
              <UIcon name="mdi-file-eye" class="icon" />
              View
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !transactions.length" class="no-transactions">

      <img src="/images/no-data-icon.png" class="no-transactions-img-container" alt="no">

      <p class="no-transactions-header">No transactions found for this member.</p>

    </div>

  </div>
</template>


<style scoped lang="scss">
.transaction {
  padding: 15px;
  min-height: 100vh;
  display: block;

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


  .investor-transactions-header-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin: 20px 0;

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

    @media (min-width: 640px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
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
    min-height: 50vh;
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
  transition: var(--transition);
  text-decoration: none;
  white-space: nowrap;
  text-align: start;

  &--update {
    font-size: var(--body-text);
    color: var(--primary-text-color);
    transition: var(--transition);

    &:hover {
      color: var(--accent-color);
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
      margin: 20px 0;
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
  margin-top: -30vh;
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