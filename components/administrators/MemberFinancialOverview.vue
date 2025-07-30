<script setup>
import {ref} from 'vue'

const profileData = ref([
  {label: 'Email Address', value: 'mohammed.adnan@gmail.com'},
  {label: 'IC Number', value: '123456-78-9012'},
  {label: 'Gender', value: 'Male'},
  {label: 'Date of Birth', value: '1995-05-20'},
  {label: 'Phone Number', value: '+60123456789'},
  {label: 'Country', value: 'Malaysia'},
  {label: 'City', value: 'Kuala Lumpur'},
  {label: 'State', value: 'Selangor'},
  {label: 'Bank Name', value: 'Maybank'},
  {label: 'Account Holder Name', value: 'Mohammed Adnan'},
  {label: 'Bank Account Number', value: '1234567890'},
])

const userStatus = ref("Active")

const memberAnalytics = ref([
  {
    title: 'Total Account Balance',
    icon: 'i-heroicons-banknotes',
    value: 'RM 12,500.00',
    valueIcon: 'i-heroicons-currency-dollar',
  },
  {
    title: 'Total Earnings',
    icon: 'i-heroicons-chart-bar',
    value: 'RM 3,200.00',
    valueIcon: 'i-heroicons-arrow-trending-up',
  },
  {
    title: 'Earnings Growth Rate',
    icon: 'i-heroicons-presentation-chart-line',
    value: '25%',
    valueIcon: 'i-heroicons-arrow-trending-up',
  },
])

const toggleUserStatus = () => {
  userStatus.value = userStatus.value === 'Active' ? 'Inactive' : 'Active'
}


</script>

<template>

  <section>

    <div class="member-analytics-container-cards">
      <div
          class="member-analytics-card"
          v-for="member in memberAnalytics"
          :key="member.title"
      >
        <div class="member-analytics-card-header">
          <UIcon :name="member.icon" class="analytics-icon"/>
          <span class="analytics-value">{{ member.value }}</span>
          <UIcon :name="member.valueIcon" class="analytics-value-icon"/>
        </div>
        <span class="analytics-title">{{ member.title }}</span>

      </div>
    </div>

  </section>

</template>

<style scoped lang="scss">

section {
  width: calc(100% - 40px);
  margin: 20px auto 50px;

  .member-analytics-container-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    margin: 20px 0;
    text-align: center;
    border-top: 2px solid var(--card-bg);
    border-bottom: 2px solid var(--card-bg);

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .member-analytics-card {
    padding: 20px;
    border-bottom: 2px solid var(--card-bg);

    &:last-child {
      border-bottom: none;
    }

    @media (min-width: 640px) {
      border-bottom: none;
      border-right: 2px solid var(--card-bg);

      &:last-child {
        border-right: none;
      }
    }

    .member-analytics-card-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;

      .analytics-icon {
        font-size: var(--heading-3);
        color: var(--primary-color);
      }

      .analytics-value {
        font-size: var(--heading-4);
        font-weight: bold;
        color: var(--primary-text-color);
      }

      .analytics-value-icon {
        font-size: var(--heading-4);
        color: var(--accent-color);
      }
    }
  }

  .analytics-title {
    font-size: var(--body-text);
    color: var(--secondary-text-color);
    padding: 10px 0;
    text-align: center;
  }
}
</style>
