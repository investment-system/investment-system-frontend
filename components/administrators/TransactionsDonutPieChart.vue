<script setup lang="ts">
import {ref, onMounted, computed} from 'vue'
import {useApi} from '~/composables/useApi'
import {sourceTypeOptions} from '@/constants/lists'

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

const transactions = ref<Transaction[]>([])
const latestShareTransaction = ref<Transaction | null>(null)
const loading = ref(false)
const error = ref('')

const transactionCounts = ref<Record<string, number>>({})

const typeColors = ref<Record<string, string>>({
  share: '#FDD835',
  deposit: '#43A047',
  withdrawal: '#E53935',
  payment: '#1E88E5',
  cancellation: '#8E24AA',
  registration_payments: '#FB8C00',
  Profit_payments: '#FFB300'
})

const transactionPercentages = ref<Record<string, number>>({})

const circleSegments = computed(() => {
  const total = transactions.value.length || 1
  const radius = 70
  const circumference = 2 * Math.PI * radius
  let currentOffset = 0

  return sourceTypeOptions.map(type => {
    const count = transactionCounts.value[type.value] || 0
    const percentage = (count / total) * 100
    const strokeDasharray = (percentage / 100) * circumference
    const strokeDashoffset = -currentOffset

    const segment = {
      type: type.value,
      label: type.label,
      count,
      percentage: Math.round(percentage),
      strokeDasharray: `${strokeDasharray} ${circumference}`,
      strokeDashoffset,
      color: typeColors.value[type.value] || '#666'
    }

    currentOffset += strokeDasharray
    return segment
  }).filter(segment => segment.count > 0)
})

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/transactions/')
    let allTransactions: Transaction[] = []

    if (Array.isArray(response.data)) {
      allTransactions = response.data
    } else if (response.data.transactions && typeof response.data.transactions === 'string') {
      const secondResponse = await api.get(response.data.transactions)
      allTransactions = secondResponse.data
    } else {
      error.value = 'Unexpected API response format'
      return
    }

    transactions.value = allTransactions

    // Count each type
    transactionCounts.value = sourceTypeOptions.reduce((acc, type) => {
      const count = allTransactions.filter(t => t.source_type === type.value).length
      acc[type.value] = count
      return acc
    }, {} as Record<string, number>)

    // Calculate percentages for each type
    const total = allTransactions.length || 1
    transactionPercentages.value = sourceTypeOptions.reduce((acc, type) => {
      acc[type.value] = Math.round((transactionCounts.value[type.value] / total) * 100)
      return acc
    }, {} as Record<string, number>)

    // Latest share transaction
    const shareTransactions = allTransactions.filter(t => t.source_type === 'share')
    shareTransactions.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    latestShareTransaction.value = shareTransactions[0] || null

  } catch (err) {
    console.error(err)
    error.value = 'Unable to load transactions. Please try again later.'
  } finally {
    loading.value = false
  }
}

const totalBalance = ref(0)


const fetchStats = async () => {
  try {
    const {data: transactionData} = await api.get('/transactions/stats/')

    totalBalance.value = parseFloat(transactionData.total_balance) ?? 0

  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  }
}

onMounted(() => {
  fetchStats()
  fetchTransactions()

})

</script>

<template>
  <div class="progress-circle-card">

    <div class="card-header">
      <div class="header-content">
        <h2 class="title">Transaction Distribution</h2>
        <div class="status-badge" v-if="transactions.length > 0">
          <div class="status-dot"></div>
          {{ transactions.length }} Total Transactions
        </div>
      </div>
    </div>

    <div class="card-body">

      <div v-if="loading" class="loading-state">
        <div class="skeleton-circle"></div>
        <div class="skeleton-lines">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <UIcon name="error" size="lg"/>
        </div>
        <p class="error-message">{{ error }}</p>
      </div>

      <div v-else-if="transactions.length > 0" class="content">

        <div class="progress-section">

          <div class="circle-container">
            <svg class="circle" viewBox="0 0 160 160">

              <!-- Background circle -->
              <circle class="circle-bg" r="70" cx="80" cy="80"/>

              <!-- Multi-segment circles for each transaction type -->
              <circle
                  v-for="(segment, index) in circleSegments"
                  :key="segment.type"
                  class="circle-segment"
                  r="70"
                  cx="80"
                  cy="80"
                  :stroke="segment.color"
                  :stroke-dasharray="segment.strokeDasharray"
                  :stroke-dashoffset="segment.strokeDashoffset"
                  :style="{ animationDelay: `${index * 0.2}s` }"
              />

              <!-- Inner glow effect -->
              <circle class="circle-glow" r="70" cx="80" cy="80"/>
            </svg>

            <div class="circle-center">
              <span class="total-amount">Balance </span>
              <span class="total-amount">{{ totalBalance.toFixed(2) }} RM </span>
              <span class="total-amount">RM </span>
            </div>

          </div>

          <div class="progress-stats">
            <div class="legend">
              <div
                  v-for="segment in circleSegments"
                  :key="segment.type"
                  class="legend-item"
              >
                <div
                    class="legend-color"
                    :style="{ backgroundColor: segment.color }"
                ></div>
                <div class="legend-info">
                  <div class="legend-label">{{ segment.label }}</div>
                  <div class="legend-stats">{{ segment.count }} ({{ segment.percentage }}%)</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div v-else class="empty-state">
        <div class="empty-state-content">
          <img src="/images/no-data-icon.png" alt="empty-state">
        </div>
        <h3 class="empty-title">No Transactions Found</h3>
        <p class="empty-message">Start your transaction history today</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.progress-circle-card {
  background: var(--card-hover);
  border: 1px solid var(--accent-color);
  border-radius: 12px;
  overflow: hidden;
  transition: var(--transition);
  position: relative;
  backdrop-filter: blur(20px);

  .card-header {
    background: var(--table-header-bg);
    padding: 20px;
    position: relative;
    overflow: hidden;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        color: var(--primary-text-color);
        font-size: var(--body-text);
        margin: 0;
        font-weight: normal;
      }

      .status-badge {
        display: flex;
        align-items: center;
        color: var(--primary-text-color);
        padding: 5px 10px;
        border-radius: 2rem;
        font-size: var(--small-text);
        font-weight: 500;
      }
    }
  }

  .card-body {
    padding: 20px;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    .skeleton-circle {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: linear-gradient(90deg, var(--secondary-bg) 25%, var(--cancel-button-bg) 50%, var(--secondary-bg) 75%);
      background-size: 200% 100%;
      animation: loading 1.5s ease-in-out infinite;
    }

    .skeleton-lines {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
      max-width: 250px;

      .skeleton-line {
        height: 1rem;
        background: linear-gradient(90deg, var(--secondary-bg) 25%, var(--cancel-button-bg) 50%, var(--secondary-bg) 75%);
        background-size: 200% 100%;
        border-radius: 0.5rem;
        animation: loading 1.5s ease-in-out infinite;

        &.short {
          width: 60%;
        }
      }
    }
  }

  .error-state {
    text-align: center;
    padding: 3rem 1rem;

    .error-icon {
      font-size: var(--heading-3);
      margin-bottom: 1rem;
    }

    .error-message {
      color: var(--accent-color);
      font-weight: 500;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .progress-section {
    display: grid;
    grid-template-columns: 2fr 2fr;
    gap: 20px 0;

    .circle-container {
      position: relative;

      .circle {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);

        .circle-bg {
          fill: none;
          stroke: var(--cancel-button-bg);
          stroke-width: 2;
          opacity: 0.3;
        }

        .circle-segment {
          fill: none;
          stroke-width: 8;
          stroke-linecap: round;
          opacity: 0;
          animation: segmentFadeIn 0.8s ease-in-out forwards;
          filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.2));
        }

        .circle-glow {
          fill: none;
          stroke: rgba(217, 162, 0, 0.1);
          stroke-width: 12;
          opacity: 0.3;
        }
      }

      .circle-center {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;

        .total-count {
          font-size: var(--heading-3);
          font-weight: 700;
          color: var(--primary-text-color);
          line-height: 1;
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--hover-button-bg) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-label {
          font-size: var(--date-text);
          color: var(--secondary-text-color);
          font-weight: 500;
          margin-top: 0.25rem;
        }
      }

      .total-amount {
        font-size: var(--date-text);
        color: var(--secondary-text-color);
      }

    }

    .progress-stats {
      display: flex;
      align-items: center;

      .legend {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 100%;

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 0;

          .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
            flex-shrink: 0;
          }

          .legend-info {
            display: flex;
            flex-direction: column;
            min-width: 0;

            .legend-label {
              font-size: var(--date-text);
              color: var(--primary-text-color);
              font-weight: 500;
            }

            .legend-stats {
              font-size: var(--date-text);
              color: var(--secondary-text-color);
              padding: 3px 0;
            }
          }
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 20px 0;

    .empty-state-content {
      img {
        width: 70px;
        height: 70px;
      }
    }

    .empty-title {
      font-size: var(--body-text);
      font-weight: 600;
      color: var(--primary-text-color);
      margin: 0 0 0.5rem 0;
    }

    .empty-message {
      color: var(--secondary-text-color);
      margin: 0;
    }
  }

  @media (min-width: 640px) {
    .progress-section {
      gap: 20px;
    }
  }

  @media (min-width: 768px) {
    .card-body {
      padding: 20px;
    }

    .circle-container {
      width: auto !important;
      height: 100px !important;
    }
  }
}

@keyframes segmentFadeIn {
  from {
    opacity: 0;
    stroke-dasharray: 0 440;
  }
  to {
    opacity: 0.9;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes loading {
  0%, 100% {
    background-position: 200% 0;
  }
  50% {
    background-position: -200% 0;
  }
}

svg defs {
  display: none;
}
</style>