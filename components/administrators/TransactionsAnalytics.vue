<script setup lang="ts">


const dashboardStats = [
  {
    title: 'Share Amount',
    icon: 'mdi-chart-donut',
    value: 1200,
  },
  {
    title: 'Share Completed',
    icon: 'mdi-check-circle-outline',
    value: 800,
  },
  {
    title: 'Share Canceled',
    icon: 'mdi-cancel',
    value: 100,
  },
  {
    title: 'Transactions',
    icon: 'mdi-bank-transfer',
    value: '1000.00',
    unit: 'RM',
  },
  {
    title: 'Expected Profit',
    icon: 'mdi-currency-usd',
    value: '850.00',
    unit: 'RM',
  },
]

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

      .card-title {
        display: grid;
        grid-template-columns: 1fr 3fr;
        align-items: center;
        font-size: var(--body-text);
        color: var(--primary-text-color);

        .icon-container {
          padding: 12px;
          font-size: var(--small-text);
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 50px;
          height: 50px;
          border-radius: 6px;
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