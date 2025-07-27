<script setup lang="ts">

const dashboardStats = [
  {
    title: 'Total Members',
    icon: 'mdi-account-group',
    value: 500,
    trendIcon: 'mdi-trending-up',
  },
  {
    title: 'Total Active Members',
    icon: 'mdi-account-check-outline',
    value: 350,
    trendIcon: 'mdi-trending-up',
  },
  {
    title: 'Total Inactive Members',
    icon: 'mdi-account-off-outline',
    value: 150,
    trendIcon: 'mdi-trending-down',
  },
  {
    title: 'Total Share',
    icon: 'mdi-chart-donut',
    value: 1200,
  },
  {
    title: 'Total Share Completed',
    icon: 'mdi-check-circle-outline',
    value: 800,
  },
  {
    title: 'Total Share Canceled',
    icon: 'mdi-cancel',
    value: 100,
  },
  {
    title: 'Total Investment',
    icon: 'mdi-bank-transfer',
    value: '1000.00',
    unit: 'RM',
  },
  {
    title: 'Total Expected Profit',
    icon: 'mdi-currency-usd',
    value: '850.00',
    unit: 'RM',
  },
]


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
          RM <span class="total-amount">1000.00</span>
        </span>
      </div>

      <div class="bank-card__info">
        <div>
          <h3 class="bank-title">Bank Card Number</h3>
          <h4 class="bank-account-number">**** **** **** 1231</h4>
        </div>
        <div>
          <h3 class="date-title">Expired Date</h3>
          <h4 class="date">03/23</h4>
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
            <UIcon :name="stat.icon" />
          </span>
          {{ stat.title }}
        </span>
          <p>
            <span class="number">{{ stat.value }}</span>
            <span class="title" v-if="stat.trendIcon">
            <UIcon :name="stat.trendIcon" class="icon" />
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
  min-height: 100vh ;

  @media (min-width: 1024px) {
    max-width: 1280px;
    margin: 20px auto;
    grid-template-columns: 1fr 2fr;
    gap: 20px;
    width: calc(100% - 60px);
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
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .overview-card {
      background: var(--card-bg);
      padding: 12px;
      border-radius: 6px;
      height: 100px;
      transition: all 0.3s ease;
      position: relative;

      .icon-container {
        padding: 10px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
      }

      &:nth-child(1) {
        background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
        .icon-container {
          color: #0d47a1;
        }
      }

      &:nth-child(2) {
        background: linear-gradient(135deg, #2e7d32 0%, #a5d6a7 100%);
        .icon-container {
          color: #1b5e20;
        }
      }

      &:nth-child(3) {
        background: linear-gradient(135deg, #00695c 0%, #b2dfdb 100%);
        .icon-container {
          color: #004d40;
        }
      }

      &:nth-child(4) {
        background: linear-gradient(135deg, #37474f 0%, #90a4ae 100%);
        .icon-container {
          color: #263238;
        }
      }

      &:nth-child(5) {
        background: linear-gradient(135deg, #283593 0%, #9fa8da 100%);
        .icon-container {
          color: #1a237e;
        }
      }

      &:nth-child(6) {
        background: linear-gradient(135deg, #f9a825 0%, #fff59d 100%);
        .icon-container {
          color: #f57f17;
        }
      }

      &:nth-child(7) {
        background: linear-gradient(135deg, #6d4c41 0%, #d7ccc8 100%);
        .icon-container {
          color: #4e342e;
        }
      }

      &:nth-child(8) {
        background: linear-gradient(135deg, #00838f 0%, #b2ebf2 100%);
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
          padding: 12px;
          font-size: var(--small-text);
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 50px;
          height: 50px;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        @media (min-width: 1024px) {
          font-size: var(--danger-color);
        }
      }

      p {
        font-size: var(--body-text) !important;
        width: 120px;
        margin: 10px 0;
        display: flow;
      }

      .title {
        font-size: var(--heading-2);
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
          font-size: var(--body-text);
        }
      }
    }
  }

}
</style>