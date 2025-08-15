<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'
import {useRoute} from 'vue-router'

const route = useRoute()

const settingLinks = ref([
  {
    link: "/member/profile",
    title: "Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/profile/edit",
    title: "Edit Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/auth/change-password",
    title: "Change Password",
    icon: "mdi-lock",
  },
])

const api = useApi()
const profile = ref({})
const profileData = ref([])
const profilePicture = ref('')

const getUserInfo = async () => {
  try {
    const { data } = await api.get('/members/profile/')
    profilePicture.value = data.profile_picture || ''
    profile.value = data

    profileData.value = [
      { label: 'Email Address', value: data.email },
      { label: 'Full Name', value: data.full_name },
      { label: 'IC Number', value: data.ic_number },
      { label: 'Gender', value: data.gender },
      { label: 'Date of Birth', value: data.date_of_birth },
      { label: 'Phone Number', value: data.phone_number },
      { label: 'Country', value: data.country },
      { label: 'Address Line', value: data.address_line },
      { label: 'City', value: data.city },
      { label: 'State', value: data.state },
      { label: 'Bank Name', value: data.bank_name },
      { label: 'Account Holder Name', value: data.account_holder_name },
      { label: 'Bank Account Number', value: data.bank_account_number },
    ]
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

onMounted(() => {
  getUserInfo()
})

</script>

<template>

  <section>

    <div class="setting-tabs">
      <div
          class="setting-container"
          v-for="settingLink in settingLinks"
          :key="settingLink.link"
      >
        <nuxt-link
            :to="settingLink.link"
            class="setting-link"
            :class="{ active: route.path.startsWith(settingLink.link) }"
        >
          <UIcon :name="settingLink.icon" />
          {{ settingLink.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="profile-member-container">

      <div class="profile-header">
        <div class="avatar-wrapper">

          <img
              :src="profilePicture || '/images/user-pic.png'"
              alt="Profile Picture"
              class="avatar-img"
          />

        </div>
        <div class="user-info">
          <div class="user-info">
            <p>ID: <span>{{ profile.member_code }}</span></p>
            <p>Name: <span>{{ profile.full_name }}</span></p>
          </div>

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
  margin: 20px auto;
  min-height: 100vh;
  border-radius: 12px;

  .setting-tabs {
    display: grid;
    grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));
    padding: 10px;
    gap: 10px;
    background: var(--card-bg);
    justify-content: start;
    border-radius: 12px;
    margin-bottom: 20px;
    width: auto;

    @media (min-width: 768px) {
      width: fit-content;
    }

    @media (min-width: 1024px) {
      display: flex;
      gap: 20px;
      width: fit-content;
    }

    .setting-link {
      display: flex;
      align-items: center;
      text-align: start;
      gap: 0.5rem;
      padding: 10px 15px;
      font-size: var(--body-text);
      color: var(--primary-text-color);
      text-decoration: none;
      transition: var(--transition);
      border-radius: 6px;

      &:hover {
        background-color: var(--card-hover);
        color: var(--primary-text-color);
        z-index: 1000;
      }

      &.active {
        background-color: var(--card-hover);
        color: var(--primary-text-color);
      }
    }

  }

  .profile-member-container {
    width: calc(100% - 0px);
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

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
      padding: 20px 0;
      max-height: 300px;
      margin-bottom: 20px;
      text-align: center;

      .avatar-wrapper {
        width: 150px;
        height: 150px;
        margin: 10px auto;

        .avatar-img {
          width: 150px;
          height: 150px;
          border-radius: 50%;
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
          }
        }
      }
    }

    .profile-info {

      .form-grid {
        display: grid;
        gap: 0 10px;
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

}
</style>
