<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useApi} from "~/composables/useApi";

const api = useApi()

const totalBalance = ref(0)
const dashboardStats = ref([
  {
    title: 'Balance',
    icon: 'mdi-currency-usd',
    value: 0,
    trendIcon: 'mdi-trending-up',
  },
  {
    title: 'Share Amount',
    icon: 'mdi-chart-donut',
    value: 0,
  },
  {
    title: 'Registration Amount',
    icon: 'mdi-chart-donut',
    value: 0,
  },
  {
    title: 'Share Completed',
    icon: 'mdi-check-circle-outline',
    value: 0,
  },
  {
    title: 'Share Canceled',
    icon: 'mdi-cancel',
    value: 0,
  },
  {
    title: 'Transactions',
    icon: 'mdi-bank-transfer',
    value: '0.00',
    unit: 'RM',
  },
  {
    title: 'Expected Profit',
    icon: 'mdi-currency-usd',
    value: '0.00',
    unit: 'RM',
  },
])

const fetchStats = async () => {
  try {
    const { data: transactionData } = await api.get('/transactions/stats/')


    dashboardStats.value = dashboardStats.value.map(stat => {
      switch (stat.title) {
        case 'Balance':
          stat.value = parseFloat(transactionData.total_balance) ?? stat.value
          break
        case 'Share Amount':
          stat.value = parseFloat(transactionData.share_amount) ?? stat.value
          break
        case 'Registration Amount':
          stat.value = parseFloat(transactionData.registration_amount) ?? stat.value
          break
        case 'Share Completed':
          stat.value = transactionData.share_completed ?? stat.value
          break
        case 'Share Canceled':
          stat.value = parseFloat(transactionData.share_canceled) ?? stat.value
          break
        case 'Transactions':
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
  <section class="dashboard-transactions-analytics">

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
.dashboard-transactions-analytics {
  display: block;
  width: calc(100% - 40px);
  margin: 20px;
  height: auto;
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
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    .overview-card {
      background: var(--card-bg);
      padding: 12px;
      border-radius: 6px;
      height: 100px;
      transition: all 0.3s ease;
      position: relative;


      @media (min-width: 768px) {
        height: 100px;
      }

      @media (min-width: 1024px) {
        height: 100px;
      }

      .icon-container {
        padding: 10px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
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
        background: linear-gradient(135deg, rgba(0, 150, 136, 0.15) 0%, rgba(128, 203, 196, 0.15) 100%);

        .icon-container {
          color: #004d40;
        }
      }

      &:nth-child(7) {
        background: linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 204, 128, 0.15) 100%);

        .icon-container {
          color: #e65100;
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
        font-size: var(--body-text);
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
          font-size: var(--body-text);
          margin-left: 10px;
        }
      }

      .number {
        font-weight: bold;
        color: var(--primary-text-color);
        font-size: var(--body-text);
        width: 120px;

        @media (min-width: 1024px) {
          font-size: var(--heading-3);
        }
      }
    }
  }

}
</style>