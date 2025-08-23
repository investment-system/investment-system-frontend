<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useApi} from "~/composables/useApi";

const api = useApi()

const totalBalance = ref(0)
const dashboardStats = ref([
  {
    title: 'Total Administrators',
    icon: 'mdi-account-group',
    value: 0,
    trendIcon: 'mdi-trending-up',
  },
  {
    title: 'Active Administrators',
    icon: 'mdi-account-check-outline',
    value: 0,
    trendIcon: 'mdi-trending-up',
  },
  {
    title: 'Inactive Administrators',
    icon: 'mdi-account-off-outline',
    value: 0,
    trendIcon: 'mdi-trending-down',
  },
])

const fetchStats = async () => {
  try {
    const { data: AdminData } = await api.get('/administrators/stats/')


    dashboardStats.value = dashboardStats.value.map(stat => {
      switch (stat.title) {
        case 'Total Administrators':
          stat.value = AdminData.total_admins ?? stat.value
          break
        case 'Active Administrators':
          stat.value = AdminData.active_admins ?? stat.value
          break
        case 'Inactive Administrators':
          stat.value = AdminData.inactive_admins ?? stat.value
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
  <section class="dashboard-administrators-analytics">

    <div class="administrators-overview">
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
.dashboard-administrators-analytics {
  display: block;
  width: calc(100% - 40px);
  margin: 20px;
  height: auto;
}

.administrators-overview {
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
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
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

      .card-title {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: start;
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