<script setup>

import { ref } from 'vue'
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
  }
])

const profileData = ref([
  { label: 'Email Address', value: 'Mohammed Adnan' },
  { label: 'IC Number', value: '123456-78-9012' },
  { label: 'Gender', value: 'Male' },
  { label: 'Date of Birth', value: '1995-05-20' },
  { label: 'Phone Number', value: '+60123456789' },
  { label: 'Country', value: 'Malaysia' },
  { label: 'City', value: 'Kuala Lumpur' },
  { label: 'State', value: 'Selangor' },
  { label: 'Bank Name', value: 'Maybank' },
  { label: 'Account Holder Name', value: 'Mohammed Adnan' },
  { label: 'Bank Account Number', value: '1234567890' },
])


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
          <img class="avatar-img" src="/images/user-icon.png" alt="Profile Picture"/>
        </div>
        <div class="user-info">
          <p>ID: <span>MKM-20250623-0001</span></p>
          <p>Name: <span>mohammed Jamal</span></p>
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
  height: 80vh;
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
    width: calc(100% - 40px);
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
      padding: 20px;
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

}
</style>
