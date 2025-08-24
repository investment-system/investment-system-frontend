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

// Helpers
const getDaysPassed = (transaction: Transaction) => {
  const start = new Date(transaction.share_record.share_date)
  const now = new Date()
  return Math.max(0, Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
}

const getDaysLeft = (transaction: Transaction) => {
  const endDate = new Date(transaction.share_record.expected_share_maturity_date)
  const now = new Date()
  const diffTime = endDate.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
}

const getPercentage = (transaction: Transaction) => {
  const total = transaction.share_record.share_duration_days
  const passed = getDaysPassed(transaction)
  return total ? Math.min(100, Math.round((passed / total) * 100)) : 0
}

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

// Fetch transactions
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

    // Filter share transactions with status "active"
    const shares = allTransactions.filter(
        t => t.source_type === 'share' && t.share_record?.status === 'active'
    )

    // Sort by nearest end date
    shares.sort((a, b) => getDaysLeft(a) - getDaysLeft(b))

    // Take top 5
    shareTransactions.value = shares.slice(0, 5)
    console.log('Top 5 nearest active shares:', shareTransactions.value)

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
  <section class="share-progress-chart">
    <div class="container">
      <div class="chart-card">

        <!-- Header -->
        <div class="chart-header">
          <h2 class="chart-title">Share Investment Progress</h2>
          <div class="chart-subtitle">Top 5 nearest to maturity</div>
        </div>

        <div v-if="loading" class="loading-container">
          <div class="skeleton-header"></div>
          <div class="skeleton-bars">
            <div v-for="i in 5" :key="i" class="skeleton-bar">
              <div class="skeleton-circle"></div>
              <div class="skeleton-content">
                <div class="skeleton-line long"></div>
                <div class="skeleton-line short"></div>
                <div class="skeleton-line medium"></div>
              </div>
              <div class="skeleton-progress"></div>
            </div>
          </div>
        </div>

        <div v-else-if="error" class="error-container">
          <div class="error-icon"><UIcon name="mdi-error"/></div>
          <p class="error-message">{{ error }}</p>
          <button @click="fetchTransactions" class="retry-button">Retry</button>
        </div>

        <div v-else-if="shareTransactions.length" class="chart-content">
          <div class="chart-grid">
            <div class="chart-headers">
              <div class="header-item">Project</div>
              <div class="header-item">Investment</div>
              <div class="header-item">Progress</div>
              <div class="header-item">Days Left</div>
              <div class="header-item">Status</div>
            </div>

            <div class="chart-rows">
              <div
                  v-for="(transaction, index) in shareTransactions"
                  :key="transaction.transaction_id"
                  class="chart-row"
                  :class="{ 'urgent': getDaysLeft(transaction) <= 30 }"
              >

                <div class="row-cell project-cell">
                  <div class="project-indicator" ></div>
                  <div class="project-info">
                    <div class="project-name">{{ transaction.share_record.project_name || `Share #${transaction.share_record.share_id}` }}</div>
                    <div class="project-date">Started {{ formatDate(transaction.share_record.share_date) }}</div>
                  </div>
                </div>

                <div class="row-cell amount-cell">
                  <div class="amount">{{ formatCurrency(transaction.share_record.invested_amount) }}</div>
                  <div class="return-rate">{{ transaction.share_record.share_return_rate }}% return</div>
                </div>

                <div class="row-cell progress-cell">
                  <div class="progress-container">
                    <div class="progress-bar">
                      <div
                          class="progress-fill"
                          :style="{
                          width: `${getPercentage(transaction)}%`,
                        }"
                      ></div>
                    </div>
                    <div class="progress-text">{{ getPercentage(transaction) }}%</div>
                  </div>
                  <div class="progress-details">
                    {{ getDaysPassed(transaction) }} of {{ transaction.share_record.share_duration_days }} days
                  </div>
                </div>

                <div class="row-cell days-cell">
                  <div class="days-number" :class="{ 'urgent': getDaysLeft(transaction) <= 30 }">
                    {{ getDaysLeft(transaction) }}
                    <span class="days-label">days left</span>
                  </div>
                  <div class="maturity-date">{{ formatDate(transaction.share_record.expected_share_maturity_date) }}</div>
                </div>

                <div class="row-cell status-cell">
                  <div class="status-badge" :class="transaction.share_record.status.toLowerCase()">
                    {{ transaction.share_record.status }}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-container">
          <div class="empty-icon"><img src="/images/no-data-icon.png" alt="empty"></div>
          <h3 class="empty-title">No Active Shares</h3>
          <p class="empty-message">Start your investment journey to see progress charts here</p>
        </div>

      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.share-progress-chart {
  width: calc(100% - 40px);
  margin: 0 auto;
  max-width: 1280px;

  .container {
    .chart-card {
      background: var(--card-hover);
      border-radius: 12px;
      overflow: hidden;
      transition: var(--transition);

      .chart-header {
        padding: 20px;

        .chart-title {
          font-size: var(--heading-3);
          font-weight: normal;
          color: var(--primary-text-color);
        }

        .chart-subtitle {
          font-size: var(--small-text);
          color: var(--secondary-text-color);
          margin: 0;
        }
      }

      .loading-container {
        padding: 24px;

        .skeleton-bars {
          display: flex;
          flex-direction: column;
          gap: 16px;

          .skeleton-bar {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 8px;

            .skeleton-circle {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s ease-in-out infinite;
              flex-shrink: 0;
            }

            .skeleton-content {
              flex: 1;
              display: flex;
              flex-direction: column;
              gap: 8px;

              .skeleton-line {
                height: 12px;
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading 1.5s ease-in-out infinite;
                border-radius: 4px;

                &.long { width: 80%; }
                &.medium { width: 60%; }
                &.short { width: 40%; }
              }
            }

            .skeleton-progress {
              width: 100px;
              height: 8px;
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s ease-in-out infinite;
              border-radius: 4px;
            }
          }
        }
      }

      .error-container {
        text-align: center;
        padding: 48px 24px;

        .error-icon {
          font-size: var(--heading-3);
          margin-bottom: 16px;
        }

        .error-message {
          color: var(--danger-color);
          margin-bottom: 16px;
          font-weight: 500;
        }

        .retry-button {
          background: var(--accent-color);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition);

          &:hover {
            background: var(--hover-button-bg);
          }
        }
      }

      .chart-content {
        .chart-grid {
          .chart-headers {
            display: grid;
            grid-template-columns: 1.5fr 1.5fr 2fr 1fr 1fr;
            gap: 20px;
            height: auto;
            align-items: center;
            padding: 20px;
            background: var(--table-header-bg);
            border-bottom: 1px solid var(--accent-color);
            border-radius: 12px 12px 0 0;

            .header-item {
              font-weight: normal;
              color: var(--primary-text-color);
              font-size: var(--body-text);
            }
          }

          .chart-rows {
            .chart-row {
              display: grid;
              grid-template-columns: 1.5fr 1.5fr 2fr 1fr 1fr;
              gap: 20px;
              height: auto;
              padding: 12px;
              align-items: center;
              border-bottom: 1px solid var(--accent-color);
              transition: var(--transition);

              .row-cell {
                display: flex;
                flex-direction: column;
                justify-content: center;

                &.project-cell {
                  display: block;
                  margin-left: 8px;

                  .project-indicator {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    flex-shrink: 0;
                  }

                  .project-info {
                    .project-name {
                      font-weight: 600;
                      color: var(--primary-text-color,);
                    }

                    .project-date {
                      font-size: var(--date-text);
                      color: var(--secondary-text-color);
                    }
                  }
                }

                &.amount-cell {
                  .amount {
                    font-weight: normal;
                    font-size: var(--small-text);
                    color: var(--secondary-text-color);
                    margin-bottom: 2px;
                  }

                  .return-rate {
                    font-size: var(--date-text);
                    color: var(--profit-color);
                    font-weight: 500;
                  }
                }

                &.progress-cell {
                  .progress-container {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 4px;

                    .progress-bar {
                      flex: 1;
                      height: 8px;
                      background: var(--cancel-button-bg);
                      border-radius: 4px;
                      overflow: hidden;

                      .progress-fill {
                        height: 100%;
                        border-radius: 4px;
                        transition: var(--transition);
                        position: relative;
                        background-color: var(--accent-color);

                        &::after {
                          content: '';
                          position: absolute;
                          top: 0;
                          left: 0;
                          right: 0;
                          bottom: 0;
                          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%);
                          animation: shine 2s ease-in-out infinite;
                        }
                      }
                    }

                    .progress-text {
                      font-weight: 600;
                      font-size: var(--small-text);
                      color: var(--primary-text-color);
                      min-width: 40px;
                    }
                  }

                  .progress-details {
                    font-size: var(--small-text);
                    color: var(--secondary-text-color);
                  }
                }

                &.days-cell {
                  text-align: center;

                  .days-number {
                    font-size: var(--body-text);
                    font-weight: 700;
                    color: var(--primary-text-color);
                    margin-bottom: 2px;

                    &.urgent {
                      color: var(--danger-color);
                    }
                  }

                  .days-label {
                    font-size: var(--small-text);
                    color: var(--secondary-text-color);
                  }

                  .maturity-date {
                    font-size: var(--date-text);
                    color: var(--secondary-text-color );
                  }
                }

                &.status-cell {
                  align-items: start;

                  .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: var(--small-text);
                    font-weight: normal;
                    text-align: center;
                    text-transform: capitalize;

                    &.active {
                      background: rgba(40, 167, 69, 0.1);
                      color: var(--profit-color);
                    }

                  }
                }
              }
            }
          }
        }
      }

      .empty-container {
        text-align: center;
        padding: 64px 24px;

        .empty-icon {
          font-size: var(--heading-4);
          margin-bottom: 16px;
          opacity: 0.6;
        }

        .empty-title {
          font-size: var(--heading-4);
          font-weight: 600;
          color: var(--primary-text-color);
          margin: 0 0 8px 0;
        }

        .empty-message {
          color: var(--secondary-text-color);
          margin: 0;
        }
      }
    }
  }

  // Responsive Design
  @media (max-width: 768px) {
    width: calc(100% - 20px);

    .chart-card {
      .chart-content .chart-grid {
        .chart-headers,
        .chart-rows .chart-row {
          grid-template-columns: 1fr;
          gap: 8px;

          .row-cell {
            padding: 8px 0;
            border-bottom: 1px solid var(--card-border, #e0e0e0);

            &:last-child {
              border-bottom: none;
            }

            &.project-cell {
              flex-direction: column;
              align-items: flex-start;
            }
          }
        }

        .chart-headers {
          display: none;
        }
      }
    }
  }
}

// Animations
@keyframes loading {
  0%, 100% { background-position: 200% 0; }
  50% { background-position: -200% 0; }
}

@keyframes shine {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}
</style>
