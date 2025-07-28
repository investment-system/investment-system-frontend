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
]

</script>

<template>
  <section class="dashboard">

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
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    }

    .overview-card {
      background: var(--card-bg);
      padding: 12px;
      border-radius: 6px;
      height: 120px;
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
        background: linear-gradient(135deg, #2e7d32 0%, #a5d6a7 100%);

        .icon-container {
          color: #1b5e20;
        }
      }

      &:nth-child(2) {
        background: linear-gradient(135deg, #00695c 0%, #b2dfdb 100%);

        .icon-container {
          color: #004d40;
        }
      }

      &:nth-child(3) {
        background: linear-gradient(135deg, #f9a825 0%, #fff59d 100%);

        .icon-container {
          color: #f57f17;
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