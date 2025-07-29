<script setup lang="ts">
import {ref, computed} from 'vue'

const search = ref('')
const selectedTransactions = ref<number[]>([])
const selectedType = ref('All')

const transactions = ref([
  {
    transaction_id: 1,
    transaction_code: 'DTKM-20250728-0001',
    member_id: 101,
    source_type: 'deposit',
    reference_id: 'REF-001',
    direction: 'in',
    amount: 500.00,
    payment_method: 'bank_transfer',
    created_at: '2025-07-28T10:00:00',
  },
  {
    transaction_id: 2,
    transaction_code: 'WTKM-20250728-0002',
    member_id: 102,
    source_type: 'withdrawal',
    reference_id: 'REF-002',
    direction: 'out',
    amount: 200.00,
    payment_method: 'cash',
    created_at: '2025-07-28T11:30:00',
  },
  {
    transaction_id: 3,
    transaction_code: 'STKM-20250728-0003',
    member_id: 103,
    source_type: 'share',
    reference_id: 'REF-003',
    direction: 'in',
    amount: 750.50,
    payment_method: 'card',
    created_at: '2025-07-28T13:45:00',
  },
  {
    transaction_id: 4,
    transaction_code: 'RTKM-20250728-0004',
    member_id: 104,
    source_type: 'registration_payments',
    reference_id: 'REF-004',
    direction: 'in',
    amount: 120.00,
    payment_method: 'ewallet',
    created_at: '2025-07-28T14:15:00',
  }
])

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

const deleteSelected = () => {
  transactions.value = transactions.value.filter(
      (transaction) => !selectedTransactions.value.includes(transaction.transaction_id)
  )
  selectedTransactions.value = []
}
</script>

<template>
  <div class="transaction">
    <div class="transaction-header">

      <h2 class="transaction-title">Manage Transactions</h2>

      <div class="transaction-header-container">

        <input
            type="text"
            v-model="search"
            class="transaction-search"
            placeholder="Search Transactions ... "
        />
        <nuxt-link to="" class="transaction-create-btn">
          Create transaction
        </nuxt-link>

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
<!--          <input-->
<!--              type="checkbox"-->
<!--              v-model="selectedTransactions"-->
<!--              :value="transaction.transaction_id"-->
<!--              class="transaction-checkbox"-->
<!--          />-->
          <span></span>
          <span>{{ transaction.transaction_code }}</span>
          <span>{{ transaction.source_type }}</span>
          <span>{{ transaction.direction }}</span>
          <span>RM {{ parseFloat(transaction.amount).toFixed(2) }}</span>
          <span>{{ transaction.payment_method }}</span>
          <span>{{ transaction.created_at.slice(0, 10) }}</span>
          <div class="transaction-actions">
            <NuxtLink to="" class="btn btn--update">
              <UIcon name="mdi-file-eye" class="icon"/>
              View
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<style scoped lang="scss">
.transaction {
  padding: 15px;

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

</style>