<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useApi} from "~/composables/useApi";

const api = useApi()

const totalBalance = ref(0)

const dashboardStats = ref([
  {
    title: 'Total Members',
    icon: 'mdi-account-group',
    value: 0,
    trendIcon: 'mdi-trending-up',
    unit: '',
  },
  {
    title: 'Active Members',
    icon: 'mdi-account-check-outline',
    value: 0,
    trendIcon: 'mdi-trending-up',
    unit: '',
  },
  {
    title: 'Inactive Members',
    icon: 'mdi-account-off-outline',
    value: 0,
    trendIcon: 'mdi-trending-down',
    unit: '',
  },
  {
    title: 'Share Amount',
    icon: 'mdi-cash-multiple',
    value: 0,
    unit: 'RM',
  },
  {
    title: 'Share Completed',
    icon: 'mdi-check-circle-outline',
    value: 0,
    unit: '',
  },
  {
    title: 'Share Canceled',
    icon: 'mdi-close-circle-outline',
    value: 0,
    unit: '',
  },
  {
    title: 'Total Transactions',
    icon: 'mdi-swap-horizontal-bold',
    value: 0,
    unit: '',
  },
  {
    title: 'Expected Profit',
    icon: 'mdi-currency-usd',
    value: 0.00,
    unit: 'RM',
  },
])

const fetchStats = async () => {
  try {
    const { data: memberData } = await api.get('/members/stats/')

    const { data: transactionData } = await api.get('/transactions/stats/')


    dashboardStats.value = dashboardStats.value.map(stat => {
      switch (stat.title) {
        case 'Total Members':
          stat.value = memberData.total_members ?? stat.value
          break
        case 'Active Members':
          stat.value = memberData.total_active_members ?? stat.value
          break
        case 'Inactive Members':
          stat.value = memberData.total_inactive_members ?? stat.value
          break
        case 'Share Amount':
          stat.value = parseFloat(transactionData.share_amount) ?? stat.value
          break
        case 'Share Completed':
          stat.value = transactionData.share_completed ?? stat.value
          break
        case 'Share Canceled':
          stat.value = parseFloat(transactionData.share_canceled) ?? stat.value
          break
        case 'Total Transactions':
          stat.value = parseFloat(transactionData.total_transactions) ?? stat.value
          break
        case 'Expected Profit':
          stat.value = parseFloat(transactionData.expected_profit) ?? stat.value
          break
      }
      return stat
    })

    totalBalance.value = parseFloat(transactionData.total_balance) ?? 0

  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
  }
}

onMounted(() => {
  fetchStats()
})

</script>

<template>
  <section class="dashboard">

    <div class="bank-card">
      <div class="bank-card__header">
        <img src="/images/malaysia%20flag.png" alt="Flag of Malaysia" class="flag-container"/>
        <span class="coin">MYR</span>
      </div>

      <div class="bank-card__balance">
        <span class="title">Your Balance</span>
        <span class="amount">
          <span class="total-amount">{{ totalBalance.toFixed(2) }}</span>
        </span>
      </div>

      <div class="bank-card__info">
        <div>
          <h3 class="bank-title">Bank Card Number</h3>
          <h4 class="bank-account-number">**** **** **** ****</h4>
        </div>
        <div>
          <div>
            <h3 class="date-title">Expired Date</h3>
            <h4 class="date">MM/YY</h4>
          </div>
        </div>
      </div>
    </div>

    <div class="investment-overview">
      <div class="overview-cards">
        <div
            v-for="(stat, index) in dashboardStats"
            :key="index"
            class="overview-card"
        >
        <span class="card-title">
          <span class="icon-container">
            <UIcon :name="stat.icon"/>
          </span>
          {{ stat.title }}
        </span>
          <p>
            <span class="number">{{ stat.value }}</span>
            <span class="title" v-if="stat.trendIcon">
            <UIcon :name="stat.trendIcon" class="icon"/>
          </span>
            <span class="title" v-else-if="stat.unit">
            {{ stat.unit }}
          </span>
          </p>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped lang="scss">
.dashboard {
  display: grid;
  grid-template-columns: 1fr;
  width: calc(100% - 40px);
  margin: 20px;

  @media (min-width: 1024px) {
    max-width: 1280px;
    margin: 20px auto;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
    width: calc(100% - 40px);
  }
}

.bank-card {
  background-image: url("/images/bank-card-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  height: 220px;
  width: 100%;

  @media (min-width: 1024px) {
    display: block;
    align-items: center;
    gap: 32px;
    max-width: 400px;
  }

  &__header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: rgba(241, 241, 241, 0.7);
    height: 35px;
    width: 100px;
    border-radius: 500px;
    gap: 15px;

    img {
      width: 30px;
      height: 30px;
      border-radius: 500px;
    }

    .coin {
      font-size: var(--body-text);
      color: var(--primary-text);
    }

    flex: 1;
  }

  &__balance {
    display: inline-grid;
    padding: 24px 0;
    gap: 16px;

    span {
      color: var(--accent-color);
      display: inline-block;
    }

    @media (min-width: 1024px) {
      font-size: var(--body-text);
    }

    .title {
      font-size: var(--body-text);
      color: var(--special-text-color);
    }

    .total-amount {
      font-weight: normal;
      color: var(--accent-color);
      font-size: var(--heading-3);

      @media (min-width: 1024px) {
        font-size: var(--heading-3);
      }
    }
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 0;
    padding: 0;
    gap: 0;

    @media (min-width: 768px) {
      gap: 16px;
    }

    @media (min-width: 1024px) {
      gap: 16px;
    }

    .bank-title,
    .date-title {
      color: var(--special-text-color);
      font-size: var(--body-text);
      font-weight: normal;
    }

    .bank-account-number,
    .date {
      color: var(--secondary-text-color);
      font-size: var(--body-text);
      gap: 12px;
      padding: 12px 0;
      text-align: left;
      font-weight: normal;

      @media (min-width: 1024px) {
        font-size: 18px;
      }
    }
  }
}

.investment-overview {
  display: block;

  h3 {
    font-size: var(--heading-3);
    color: var(--primary-text-color);
    height: 50px;
    display: flex;
    align-items: center;

    @media (min-width: 1024px) {
      font-size: var(--heading-3);
    }
  }

  .overview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    width: 100%;

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    }

    .overview-card {
      background: var(--card-bg);
      padding: 12px;
      height: 100px;
      transition: var(--transition);
      position: relative;
      border-radius: 6px;

      .icon-container {
        padding: 10px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      &:nth-child(1) {
        background: linear-gradient(135deg, rgba(13, 71, 161, 0.15) 0%, rgba(25, 118, 210, 0.15) 100%);

        .icon-container {
          color: #0d47a1;
        }
      }

      &:nth-child(2) {
        background: linear-gradient(135deg, rgba(46, 125, 50, 0.15) 0%, rgba(165, 214, 167, 0.15) 100%);

        .icon-container {
          color: #1b5e20;
        }
      }

      &:nth-child(3) {
        background: linear-gradient(135deg, rgba(0, 105, 92, 0.15) 0%, rgba(178, 223, 219, 0.15) 100%);

        .icon-container {
          color: #004d40;
        }
      }

      &:nth-child(4) {
        background: linear-gradient(135deg, rgba(55, 71, 79, 0.15) 0%, rgba(144, 164, 174, 0.15) 100%);

        .icon-container {
          color: #263238;
        }
      }

      &:nth-child(5) {
        background: linear-gradient(135deg, rgba(40, 53, 147, 0.15) 0%, rgba(159, 168, 218, 0.15) 100%);

        .icon-container {
          color: #1a237e;
        }
      }

      &:nth-child(6) {
        background: linear-gradient(135deg, rgba(249, 168, 37, 0.15) 0%, rgba(255, 245, 157, 0.15) 100%);

        .icon-container {
          color: #f57f17;
        }
      }

      &:nth-child(7) {
        background: linear-gradient(135deg, rgba(109, 76, 65, 0.15) 0%, rgba(215, 204, 200, 0.15) 100%);

        .icon-container {
          color: #4e342e;
        }
      }

      &:nth-child(8) {
        background: linear-gradient(135deg, rgba(0, 131, 143, 0.15) 0%, rgba(178, 235, 242, 0.15) 100%);

        .icon-container {
          color: #006064;
        }
      }

      .card-title {
        display: grid;
        grid-template-columns: 1fr 3fr;
        align-items: center;
        font-size: var(--body-text);
        color: var(--primary-text-color);

        .icon-container {
          font-size: var(--body-text);
          align-items: start;
          justify-content: start;
          text-align: start;
          margin: 0;
          padding-left: 0;
          transition: all 0.3s ease;

          span {
            font-size: var(--heading-3);
          }

        }

        @media (min-width: 1024px) {
          font-size: var(--danger-color);
        }
      }

      p {
        font-size: var(--heading-4);
        width: 120px;
        display: flow;
      }

      .title {
        font-size: var(--body-text);
        color: var(--primary-text-color);
        margin-left: 10px;
        width: 30px;
        height: 30px;
        align-content: start;

        @media (min-width: 1024px) {
          font-size: var(--heading-4);
          margin-left: 10px;
        }
      }

      .number {
        font-weight: bold;
        color: var(--primary-text-color);
        font-size: var(--body-text);
        width: 120px;

        @media (min-width: 1024px) {
          font-size: var(--heading-4);
        }
      }
    }
  }

}
</style>