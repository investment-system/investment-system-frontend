<script setup lang="ts">
import {ref, onMounted} from 'vue'
import {useApi} from '~/composables/useApi'

interface ShareRecord {
  share_id: number
  project_name: string
  share_date: string
  share_return_rate: string
  expected_share_maturity_date: string
  status: string
  share_duration_days: number
  invested_amount: number
  profit: number | null
  cancel: boolean | null
}

interface Transaction {
  transaction_id: number
  transaction_code: string
  member: number
  source_type: string
  reference_id: string
  direction: string
  amount: string
  payment_method: string
  created_at: string
  share_record: ShareRecord
}

const api = useApi()

const shareTransactions = ref<Transaction[]>([])
const loading = ref(false)
const error = ref('')

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR'
  }).format(amount)
}

const getDaysLeft = (transaction: Transaction) => {
  const maturityDate = new Date(transaction.share_record.expected_share_maturity_date)
  const today = new Date()
  const diffTime = maturityDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/transactions/')
    let allTransactions: any[] = []

    if (Array.isArray(response.data)) {
      allTransactions = response.data
    } else if (response.data.transactions && typeof response.data.transactions === 'string') {
      const secondResponse = await api.get(response.data.transactions)
      allTransactions = secondResponse.data
    } else {
      console.error('Unexpected API response structure:', response.data)
      error.value = 'Unexpected API response format'
      return
    }

    const shares = allTransactions.filter(
        t => t.source_type === 'share' && t.share_record?.status === 'pending'
    )

    shareTransactions.value = shares.slice(0, 20)

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

</script>

<template>
  <section class="pending-transactions">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Pending Investments</h2>
      </div>

      <div v-if="loading" class="loading-container">
        <div class="skeleton-cards">
          <div v-for="i in 5" :key="i" class="skeleton-card"></div>
        </div>
      </div>

      <div v-else-if="error" class="error-container">
        <UIcon name="mdi-alert-circle-outline" class="error-icon"/>
        <p class="error-message">{{ error }}</p>
      </div>

      <div v-else-if="shareTransactions.length" class="cards-container">
        <div class="cards">
          <div
              v-for="transaction in shareTransactions"
              :key="transaction.transaction_id"
              class="transaction-card"
              :class="{ 'urgent': getDaysLeft(transaction) <= 30 }"
          >

            <div class="card-header">
              <div class="transaction-info">
                <span class="transaction-code">{{ transaction.transaction_code }}</span>
                <span class="transaction-date">{{ formatDate(transaction.created_at) }}</span>
              </div>

              <NuxtLink
                  :to="`/administrators/manage-members/${transaction.member}`"
                  class="status-badge"
                  :class="transaction.share_record?.status.toLowerCase()"
              >
                Review Member
              </NuxtLink>


            </div>

            <div class="card-content">
              <div class="investment-details">
                <div class="amount">{{ formatCurrency(transaction.share_record.invested_amount) }}</div>
                <div class="days-left" v-if="getDaysLeft(transaction)">
                  {{ getDaysLeft(transaction) }} days left
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div v-else class="empty-container">
        <img src="/images/no-data-icon.png" alt="No data" class="empty-icon"/>
        <h3 class="empty-title">No Pending Transactions</h3>
        <p class="empty-message">All your transactions have been processed 🎉</p>
      </div>

    </div>
  </section>
</template>

<style lang="scss" scoped>
.pending-transactions {
  width: calc(100% - 40px);
  max-width: 1280px;
  margin: 0 auto;
  padding: 50px 0;

  .section-header {
    text-align: start;
    margin-bottom: 24px;

    .section-title {
      font-size: var(--heading-4);
      font-weight: 500;
      color: var(--primary-text-color);
    }
  }

  .skeleton-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;

    .skeleton-card {
      height: 140px;
      border-radius: 16px;
      background: linear-gradient(90deg, #eaeaea 25%, #f5f5f5 50%, #eaeaea 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
  }

  .error-container {
    text-align: center;
    padding: 40px 20px;
    border-radius: 16px;
    background: var(--card-hover);
    border: 1px solid var(--card-border);

    .error-icon {
      font-size: 2rem;
      color: var(--danger-color);
      margin-bottom: 12px;
    }

    .error-message {
      margin-bottom: 12px;
      color: var(--danger-color);
      font-weight: 500;
    }
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 10px;

    .transaction-card {
      background: var(--primary-bg);
      border: 1px solid var(--card-border);
      border-radius: 12px;
      padding: 16px;
      transition: var(--transition);

      &.urgent {
        border-left: 5px solid var(--danger-color);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .transaction-info {
          .transaction-code {
            display: block;
            font-size: var(--small-text);
            color: var(--primary-text-color);
          }

          .transaction-date {
            font-size: var(--date-text);
            color: var(--secondary-text-color);
          }
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: var(--date-text);
          font-weight: 600;
          text-transform: capitalize;

          &.pending {
            background: rgba(255, 193, 7, 0.35);
            color: var(--primary-text-color);
            font-weight: normal;
          }
        }
      }

      .card-content {

        .investment-details {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .amount {
            font-size: var(--body-text);
            font-weight: 500;
            color: var(--profit-color);
          }

          .days-left {
            font-size: var(--date-text);
            color: var(--secondary-text-color);
          }
        }
      }
    }
  }

  /* Empty state */
  .empty-container {
    text-align: center;
    padding: 60px 20px;
    border-radius: 16px;
    background: var(--card-hover);
    border: 1px solid var(--card-border);

    .empty-icon {
      width: 72px;
      margin-bottom: 12px;
      opacity: 0.7;
    }

    .empty-title {
      font-weight: 700;
      margin-bottom: 4px;
      font-size: 1rem;
    }

    .empty-message {
      color: var(--secondary-text-color);
    }
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
