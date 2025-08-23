<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import ProgressCircle from "~/components/member/ProgressCircle.vue";

interface StatItem {
  title: string
  icon: string
  value: number
  trendIcon: string
}

const generalStats = ref<StatItem[]>([
  { title: 'Total Balance', icon: 'mdi-cash', value: 0, trendIcon: 'mdi-trending-up' },
  { title: 'Total Members', icon: 'mdi-account-group', value: 0, trendIcon: 'mdi-trending-up' },
  { title: 'Share Amount', icon: 'mdi-chart-donut', value: 0, trendIcon: 'mdi-trending-up' },
  { title: 'Share Completed', icon: 'mdi-check-circle-outline', value: 0, trendIcon: 'mdi-check' },
])

const memberBalance = ref(0)
const api = useApi()
const memberId = ref<number | null>(null)

onMounted(async () => {
  try {
    const profileRes = await api.get('/auth/profile/')
    memberId.value = profileRes.data?.id ?? null

    if (!memberId.value) throw new Error('Member ID not found')

    const membersRes = await api.get('/members/stats/')
    const transactionsRes = await api.get(`/transactions/${memberId.value}/stats/`) // member-specific

    const memberData = membersRes.data ?? {}
    const transactionData = transactionsRes.data ?? {}

    const totalBalance = parseFloat(transactionData.share_amount) || 0
    const shareAmount = parseFloat(transactionData.share_amount) || 0
    const totalMembers = memberData.total_members ?? 0
    const shareCompleted = transactionData.share_completed ?? 0

    generalStats.value = [
      { ...generalStats.value[0], value: totalBalance },
      { ...generalStats.value[1], value: totalMembers },
      { ...generalStats.value[2], value: shareAmount },
      { ...generalStats.value[3], value: shareCompleted },
    ]

    memberBalance.value = totalBalance
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
  }
})
</script>


<template>
  <section class="dashboard">

    <div class="bank-cards">
      <ProgressCircle/>
    </div>

    <div class="investment-overview">
      <h3>Investment Overview</h3>
      <FinancialIconDivider/>
      <div class="investor-overview-cards">
        <div v-for="(stat, index) in generalStats" :key="index" class="investor-overview-card">
          <span class="card-title">
            <span class="icon-container"><UIcon :name="stat.icon" class="main-icon"/></span>
            {{ stat.title }}
          </span>
          <p class="stat-details">
            <span class="number">{{ stat.value }}</span>
            <span class="trend-icon"><UIcon :name="stat.trendIcon" class="icon"/></span>
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
    width: calc(100% - 60px);
  }
}

.investment-overview {
  display: block;

  h3 {
    font-size: var(--heading-4);
    color: var(--primary-text-color);
    padding: 10px 0;
    display: flex;
    align-items: center;

    @media (min-width: 1024px) {
      font-size: var(--heading-4);
    }
  }

  .investor-overview-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    width: 100%;

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }

    .investor-overview-card {
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
        background: linear-gradient(135deg, rgba(46, 125, 50, 0.15) 0%, rgba(165, 214, 167, 0.15) 100%);

        .icon-container {
          color: #1b5e20;
        }
      }

      &:nth-child(2) {
        background: linear-gradient(135deg, rgba(0, 105, 92, 0.15) 0%, rgba(178, 223, 219, 0.15) 100%);

        .icon-container {
          color: #004d40;
        }
      }

      &:nth-child(3) {
        background: linear-gradient(135deg, rgba(40, 53, 147, 0.15) 0%, rgba(159, 168, 218, 0.15) 100%);

        .icon-container {
          color: #1a237e;
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