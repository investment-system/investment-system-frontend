<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useApi } from '~/composables/useApi'

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
  direction: string
  amount: string
  payment_method: string
  created_at: string
  share_record: ShareRecord
}

const api = useApi()

const latestShareTransaction = ref<Transaction | null>(null)
const loading = ref(false)
const error = ref('')

const goalDays = computed(() => {
  return latestShareTransaction.value?.share_record?.share_duration_days || 0
})

const daysPassed = computed(() => {
  if (!latestShareTransaction.value) return 0
  const created = new Date(latestShareTransaction.value.share_record.share_date).getTime()
  const now = new Date().getTime()
  return Math.floor((now - created) / (1000 * 60 * 60 * 24))
})

const percentage = computed(() => {
  if (!latestShareTransaction.value || !goalDays.value) return 0
  return Math.min(100, Math.round((daysPassed.value / goalDays.value) * 100))
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/transactions/user/')
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

    const shareTransactions = allTransactions.filter(t => t.source_type === 'share')

    shareTransactions.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    latestShareTransaction.value = shareTransactions[0] || null

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
  <div class="progress-circle-card">

    <div class="card-header">
      <div class="header-content">
        <h2 class="title">Share Progress</h2>
        <div class="status-badge" v-if="latestShareTransaction">
          <span class="status-dot"></span>
          {{ latestShareTransaction.share_record.status.toUpperCase() }}

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

      <div v-else-if="latestShareTransaction" class="content">

        <div class="progress-section">

          <div class="circle-container">
            <svg class="circle" viewBox="0 0 160 160">

              <circle class="circle-bg" r="70" cx="80" cy="80" />

              <circle
                  class="circle-progress"
                  r="70"
                  cx="80"
                  cy="80"
                  :stroke-dasharray="2 * Math.PI * 70"
                  :stroke-dashoffset="2 * Math.PI * 70 * (1 - percentage / 100)"
              />
              <!-- Inner glow effect -->
              <circle class="circle-glow" r="70" cx="80" cy="80" />
            </svg>

            <!-- Center content with enhanced typography -->
            <div class="circle-center">
              <div class="percentage">{{ percentage }}%</div>
              <div class="progress-label">Complete</div>
            </div>

            <!-- Floating progress indicator -->
            <div class="progress-indicator" :style="{ transform: `rotate(${(percentage / 100) * 360 - 90}deg)` }">
              <div class="indicator-dot"></div>
            </div>
          </div>

          <div class="progress-stats">
            <div class="stat-item">
              <span class="stat-value">{{ daysPassed }}</span>
              <span class="stat-label">Days Passed</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ goalDays - daysPassed }}</span>
              <span class="stat-label">Days Left</span>
            </div>
          </div>

        </div>

        <div class="info-grid">

          <div class="info-card">
            <UIcon name="material-symbols:attach-money" class="info-icon" />
            <div class="info-content">
              <h3 class="info-title">
                RM {{ latestShareTransaction.share_record.invested_amount.toLocaleString() }}
              </h3>
              <p class="info-subtitle">Amount Invested</p>
            </div>
          </div>

          <div class="info-card">
            <UIcon name="material-symbols:calendar-month-outline" class="info-icon" />
            <div class="info-content">
              <h3 class="info-title">{{ formatDate(latestShareTransaction.share_record.expected_share_maturity_date) }}</h3>
              <p class="info-subtitle">Maturity Date</p>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="empty-state">
        <div class="empty-state-content">
          <img src="/images/no-data-icon.png" alt="empty-state">

          </div>
        <h3 class="empty-title">No Active Shares</h3>
        <p class="empty-message">Start your investment journey today</p>
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
    background: linear-gradient(135deg, rgba(217, 162, 0, 0.15) 0%, rgba(245, 179, 1, 0.15) 100%);
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
        gap: 0.5rem;
        background: rgba(46, 125, 50, 0.2);
        backdrop-filter: blur(10px);
        color: var(--profit-color);
        padding: 5px 10px;
        border-radius: 2rem;
        font-size: var(--small-text);
        font-weight: 500;

        .status-dot {
          width: 8px;
          height: 8px;
          background: var(--profit-color);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }
      }
    }
  }

  .card-body {
    padding: 10px;
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
    grid-template-columns: 2fr 3fr;
    gap: 10px;

    .circle-container {
      position: relative;
      width: 120px;
      height: 120px;

      .circle {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);

        .circle-bg {
          fill: none;
          stroke: var(--cancel-button-bg);
          stroke-width: 4;
        }

        .circle-progress {
          fill: none;
          stroke: var(--accent-color);
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 8px rgba(217, 162, 0, 0.4));
        }

        .circle-glow {
          fill: none;
          stroke: rgba(217, 162, 0, 0.1);
          stroke-width: 10;
          opacity: 0.5;
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

        .percentage {
          font-size: var(--heading-4);
          font-weight: 500;
          color: var(--primary-text-color);
          line-height: 1;
          background: linear-gradient(135deg, var(--accent-color) 0%, var(--hover-button-bg) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-label {
          font-size: var(--small-text);
          color: var(--secondary-text-color);
          font-weight: 500;
          margin-top: 0.25rem;
        }
      }

      .progress-indicator {
        position: absolute;
        top: 5px;
        left: 50%;
        width: 6px;
        height: 6px;
        margin-left: -3px;
        transform-origin: 3px 55px;
        transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);

        .indicator-dot {
          width: 6px;
          height: 6px;
          background: var(--accent-color);
          border-radius: 50%;
          border: 1px solid white;
          box-shadow: 0 1px 2px var(--shadow);
        }
      }
    }

    .progress-stats {
      display: flex;
      align-items: center;
      gap: 20px;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        .stat-value {
          font-size: var(--body-text);
          font-weight: 700;
          color: var(--primary-text-color);
          line-height: 1;
        }

        .stat-label {
          font-size: var(--small-text);
          color: var(--secondary-text-color);
          font-weight: 500;
          margin-top: 0.25rem;
        }
      }
    }
  }

  .info-grid {
    display: flex;
    flex-direction: row;
    gap: 20px;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 12px;
    padding: 12px 24px;

    .info-card {
      display: flex;
      align-items: center;
      gap: 10px;
      transition: var(--transition);

      &.primary {
        border-color: var(--accent-color);
      }

      .info-icon {
        font-size: var(--heading-3);
        color: var(--accent-color);
        flex-shrink: 0;
      }

      .info-content {
        display: flex;
        flex-direction: column;

        .info-title {
          font-size: var(--small-text);
          color: var(--primary-text-color);
        }

        .info-subtitle {
          font-size: var(--small-text);
          color: var(--secondary-text-color);
        }
      }
    }
  }

  .empty-state {
    text-align: center;
    padding: 20px 0;

    .empty-state-content {

      img{
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
    .info-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .progress-stats {
      flex-direction: row;
      gap: 1rem;
    }
  }

  @media (min-width: 768px) {
    .card-body {
      padding: 20px;
    }

    .info-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .circle-container {
      width: 280px;
      height: 280px;
    }
  }
}

@keyframes shimmer {
  0%, 100% {
    background-position: 200% 0;
  }
  50% {
    background-position: -200% 0;
  }
}

@keyframes shine {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
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