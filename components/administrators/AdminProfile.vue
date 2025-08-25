<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useRoute } from 'vue-router'

const api = useApi()
const route = useRoute()

const id = route.params.id

const profileData = ref([])

const adminCode = ref('')
const dateJoined = ref('')
const userStatus = ref('')
const profilePicture = ref('')

const fetchUserProfile = async () => {
  try {
    const { data } = await api.get(`/administrators/${id}/`)

    adminCode.value = data.admin_code
    userStatus.value = data.user.is_active
    dateJoined.value = new Date(data.user.date_joined).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    // profilePicture.value = data.profile_picture || ''


    profileData.value = [
      { label: 'Full Name', value: data.user.full_name },
      { label: 'Email Address', value: data.user.email },
      { label: 'Role', value: data.role },
      { label: 'Position', value: data.position },
      { label: 'IC Number', value: data.ic_number },
      { label: 'Gender', value: data.gender },
      { label: 'Date of Birth', value: data.date_of_birth },
      { label: 'Phone Number', value: data.phone_number },
      { label: 'Address Line 1', value: data.address_line1 },
      { label: 'Address Line 2', value: data.address_line2 },
      { label: 'City', value: data.city },
      { label: 'State', value: data.state },
      { label: 'Postal Code', value: data.postal_code },
      { label: 'Country', value: data.country },
    ]

    userStatus.value = data.user.is_active ? 'active' : 'inactive'

  } catch (error) {
    console.error("Error fetching user profile:", error)
  }
}

onMounted(fetchUserProfile)
</script>

<template>

  <section>

    <div class="admin-container">

      <div class="profile-header">

        <div class="avatar-wrapper">
          <img
              :src="profileData?.profile_picture || '/images/user-icon.png'"
              alt="Profile Picture"
              class="avatar-img"
          />

          <div class="status-badge" :class="userStatus">
            <UIcon name="i-heroicons-check-circle" class="status-icon"/>
          </div>
        </div>

        <div class="user-info">
          <p>ID: <span>{{ adminCode }}</span></p>
          <p>Joined at: <span>{{ dateJoined }}</span></p>
        </div>


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

  .admin-container {
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
          background: var(--primary-bg);
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
        width: calc(100% - 40px);
        margin: 0 auto;

        p {
          margin: 10px 0;
          color: var(--primary-text-color);

          span {
            color: var(--secondary-text-color);
            font-size: var(--small-text);

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
        gap: 0 10px;
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
          gap: 0 10px;
        }
      }
    }
  }

}
</style>
