<script setup>
import {ref} from 'vue'

const profileData = ref([
  {label: 'Email Address', value: 'Mohammed Adnan'},
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

    <div class="profile-member-container">

      <div class="profile-header">

        <div class="avatar-wrapper">
          <img class="avatar-img" src="/images/user-icon.png" alt="Profile Picture"/>
          <div class="status-badge" :class="userStatus.toLowerCase()">
            <UIcon name="i-heroicons-check-circle" class="status-icon"/>
          </div>
        </div>

        <div class="user-info">
          <p>ID: <span>MKM-20250623-0001</span></p>
          <p>Name: <span>mohammed Jamal</span></p>
        </div>

        <button class="status-toggle-btn" @click="toggleUserStatus">
          {{ userStatus === 'Active' ? 'Deactivate Account' : 'Activate Account' }}
        </button>

      </div>

      <div class="profile-info">
        <div class="form-grid">
          <div class="form-item" v-for="(item, index) in profileData" :key="index">
            <label>{{ item.label }}</label>
            <p>{{ item.value }}</p>
          </div>
        </div>
      </div>


    </div>

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
  margin: 20px auto;
  min-height: 100vh;

  .profile-member-container {
    margin: 30px auto;
    display: grid;
    grid-template-columns: 1fr;
    padding: 24px 0;

    @media (min-width: 768px) {
      max-width: 1280px;
      grid-template-columns:  1fr 3fr;
      gap: 20px;
    }

    @media (min-width: 1024px) {
      max-width: 1280px;
      grid-template-columns:  1fr 3fr;
    }

    .profile-header {
      display: block;
      align-items: center;
      gap: 0;
      padding: 0 20px ;
      max-height: 300px;
      text-align: center;

      .avatar-wrapper {
        width: 150px;
        height: 150px;
        margin: 10px auto;
        position: relative; // Added for positioning the status badge

        .avatar-img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
        }

        // Status badge styles
        .status-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          .status-icon {
            font-size: 24px;
          }

          &.active {
            color: var(--profit-color);
          }

          &.inactive {
            color: var(--danger-color);
          }
        }
      }

      .user-info {
        flex: 1;
        width: calc(100% - 40px);
        margin: 0 auto;

        p {
          margin: 10px 0;
          color: var(--primary-text-color);

          span {
            color: var(--secondary-text-color);

            // Status text styling
            &.status-text {
              font-weight: 600;

              &.active {
                color: #22c55e;
              }

              &.inactive {
                color: #94a3b8;
              }

              &.busy {
                color: #ef4444;
              }

              &.away {
                color: #f59e0b;
              }
            }
          }
        }
      }

      .status-toggle-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        font-size: var(--button-text-size);
        background-color: var(--button-bg);
        border: none;
        border-radius: 6px;
        cursor: pointer;
        width: 100%;
        transition: var(--transition);

        @media (min-width: 640px) {
          width: auto;
        }

        &:hover {
          background-color: var(--hover-button-bg);
        }
      }


    }

    .profile-info {

      .form-grid {
        display: grid;
        gap: 10px;
        margin-bottom: 30px;

        .form-item {
          display: grid;
          grid-template-columns: 1fr 1fr;

          label {
            color: var(--primary-text-color);
            height: 36px;
            align-content: center;
            font-weight: 600;
            font-size: var(--label-text);

          }

          p {
            margin: 0;
            color: var(--secondary-text-color);
            height: 36px;
            align-content: center;
          }
        }
      }
    }

    @media (min-width: 768px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      .avatar-wrapper {
        width: 150px;
        height: 150px;
      }
    }

    @media (min-width: 1024px) {
      .form-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  .member-analytics-container-cards {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
    margin: 1rem 0;
    align-items: center;
    text-align: center;
    border-top: 2px solid var(--card-bg);
    border-bottom: 2px solid var(--card-bg);

    .member-analytics-container-cards {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
      margin: 20px 0;
      text-align: center;

      @media (min-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .member-analytics-card {
      padding: 20px;
      display: block;
      border-right: 2px solid var(--card-bg);

      &:last-child {
        border-right: none;
      }

      .member-analytics-card-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        width: 100%;
        height: auto;

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
      display: block;
      font-size: var(--body-text);
      color: var(--secondary-text-color);
      padding: 10px 0 !important;
      text-align: center;
    }

  }

}
</style>