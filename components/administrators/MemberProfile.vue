<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'

const api = useApi()
const route = useRoute()

const profileData = ref<any[]>([])
const userStatus = ref("Inactive")
const member = ref<any>(null)

const toggleUserStatus = async () => {
  try {
    await api.patch(`/members/detail/${route.params.id}/`, {
      registration_status: "paid",
    })

    userStatus.value = "Active"
    member.value.registration_status = "paid"

    setTimeout (() => {
      location.reload()
    },1500)

    location.reload()
  } catch (error) {
    console.error("Failed to update status:", error)
  }
}

onMounted(async () => {
  try {
    const response = await api.get(`/members/detail/${route.params.id}/`)
    member.value = response.data

    profileData.value = [
      { label: 'Email Address', value: member.value.email ?? '-' },
      { label: 'IC Number', value: member.value.ic_number ?? '-' },
      { label: 'Gender', value: member.value.gender ?? '-' },
      { label: 'Date of Birth', value: member.value.date_of_birth ?? '-' },
      { label: 'Phone Number', value: member.value.phone_number ?? '-' },
      { label: 'Country', value: member.value.country ?? '-' },
      { label: 'Address', value: member.value.address_line ?? '-' },
      { label: 'City', value: member.value.city ?? '-' },
      { label: 'State', value: member.value.state ?? '-' },
      { label: 'Bank Name', value: member.value.bank_name ?? '-' },
      { label: 'Account Holder Name', value: member.value.account_holder_name ?? '-' },
      { label: 'Bank Account Number', value: member.value.bank_account_number ?? '-' },
      { label: 'Registration Status', value: member.value.registration_status ?? '-' },
    ]

    userStatus.value = member.value.registration_status === "paid" ? "Active" : "Inactive"
  } catch (error) {
    console.error("Failed to fetch member detail:", error)
  }
})

</script>

<template>
  <section>
    <div class="profile-member-container">
      <div class="profile-header">
        <div class="avatar-wrapper">

          <img
              class="avatar-img"
              :src="member?.profile_picture || '/images/user-icon.png'"
              alt="Profile Picture"
          />


          <div class="status-badge" :class="userStatus.toLowerCase()">
            <UIcon name="i-heroicons-check-circle" class="status-icon"/>
          </div>
        </div>

        <div class="user-info">
          <p>ID: <span>{{ member?.member_code }}</span></p>
          <p>Name: <span>{{ member?.full_name }}</span></p>
        </div>

        <button
            v-if="userStatus !== 'Active'"
            class="status-toggle-btn"
            @click="toggleUserStatus"
        >
          Activate Account
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
  </section>
</template>

<style scoped lang="scss">

section {
  width: calc(100% - 40px);
  margin: 20px auto 50px;

  .profile-member-container {
    display: grid;
    grid-template-columns: 1fr;
    padding: 24px 0;
    margin: 30px auto;

    @media (min-width: 768px) {
      grid-template-columns: 2fr 3fr;
    }

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 3fr;
    }

    .profile-header {
      text-align: center;
      padding: 0 20px;

      .avatar-wrapper {
        position: relative;
        width: 150px;
        height: 150px;
        margin: 10px auto;

        .avatar-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

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
          background-color:var(--primary-bg);

          .status-icon {
            font-size: var(--heading-3);
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
        width: calc(100% - 40px);
        margin: 0 auto;

        p {
          margin: 10px 0;
          color: var(--primary-text-color);

          span {
            color: var(--secondary-text-color);

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

        &:hover {
          background-color: var(--hover-button-bg);
        }

        @media (min-width: 640px) {
          width: auto;
        }
      }
    }

    .profile-info {
      .form-grid {
        display: grid;
        gap: 10px;
        margin: 20px 0;

        .form-item {
          display: grid;
          grid-template-columns: 1fr 1fr;

          @media (min-width: 768px) {
            grid-template-columns: 1fr;
          }

          @media (min-width: 1024px) {
            grid-template-columns: 1fr 1fr;
          }

          label {
            color: var(--primary-text-color);
            font-size: var(--label-text);
            font-weight: 600;
            height: 36px;
            align-content: center;
          }

          p {
            color: var(--secondary-text-color);
            margin: 0;
            height: 36px;
            align-content: center;
          }
        }

        @media (min-width: 768px) {
          grid-template-columns: 1fr 1fr;
          gap: 0 20px;
        }
      }
    }
  }

}
</style>
