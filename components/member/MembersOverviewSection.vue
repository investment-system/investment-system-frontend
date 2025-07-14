<script setup lang="ts">
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

      <h3>Investment Overview</h3>

      <FinancialIconDivider/>

      <div class="overview-cards">
        <div class="overview-card">
          <span class="card-title">
            <span class="icon-container">
              <UIcon name="mdi-calendar-check-outline"/>
            </span>
            Total Activities
          </span>
          <h4>
            <span class="number">12</span>
            <span class="title">
              <UIcon name="mdi-trending-up" class="icon" />
            </span>
          </h4>
        </div>

        <div class="overview-card">
          <span class="card-title">
            <span class="icon-container">
              <UIcon name="mdi-users-group-outline"/>

            </span>
            Total Members
          </span>
          <h4>
            <span class="number">500</span>
            <span class="title">
              <UIcon name="mdi-trending-up" class="icon" />
            </span>
          </h4>
        </div>

        <div class="overview-card">
          <span class="card-title">
            <span class="icon-container">
              <UIcon name="mdi-bank-transfer"/>
            </span>
            Total Investment
          </span>
          <h4>
            <span class="number">1000.00</span>
            <span class="title">RM</span>
          </h4>
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
      color: var(--secondary-text-color);
    }

    .total-amount {
      font-weight: normal;
      color: var(--accent-color);
      font-size: var(--heading-3);

      @media (min-width: 1024px) {
        font-size: 24px;
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
    }

    .bank-account-number,
    .date {
      color: var(--secondary-text-color);
      font-size: var(--body-text);
      gap: 12px;
      padding: 12px 0;
      text-align: left;

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
    gap: 20px;
    width: 100%;

    @media (min-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    .overview-card {
      background: var(--card-bg);
      padding: 16px;
      border-radius: 12px;
      height: 120px;

      .card-title {
        display: grid;
        grid-template-columns: 1fr 3fr;
        align-items: center;
        font-size: var(--body-text);
        color: var(--secondary-text-color);

        .icon-container {
          padding: 12px;
          background: var(--hover-button-bg);
          color: var(--primary-text-color);
          font-size: var(--heading-3);
          align-items: center;
          justify-content: center;
          text-align: center;
          max-width: 50px;
          height: 50px;
          border-radius: 6px;
        }

        @media (min-width: 1024px) {
          font-size: var(--heading-4);
        }
      }

      h4 {
        font-size: var(--body-text) !important;
        width: 120px;
        margin: 10px 0;
        display: flow;
      }

      .title {
        font-size: var(--heading-2);
        color: var(--secondary-text-color);
        margin-left: 10px;
        width: 30px;
        height: 30px;
        align-content: start;

        @media (min-width: 1024px) {
          font-size: var(--heading-3);
          margin-left: 10px;
        }
      }

      .number {
        font-weight: bold;
        color: var(--primary-text-color);
        font-size: var(--heading-4);
        width: 120px;

        @media (min-width: 1024px) {
          font-size: var(--heading-4);
        }
      }
    }
  }
}
</style>
