<script setup>

import { ref } from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()

const settingLinks = ref([
  {
    link: "/member",
    title: "Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/profile/edit",
    title: "Edit Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/change-password",
    title: "Change Password",
    icon: "mdi-lock",
  }
])

const profileData = ref([
  { label: 'Full Name', value: 'Mohammed Adnan' },
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
      <div class="setting-container" v-for="settingLink in settingLinks" :key="settingLink.link">
        <nuxt-link
            :to="settingLink.link"
            class="setting-link"
            :class="{ active: route.path.includes(settingLink.link.toLowerCase()) }"
        >
          <UIcon :name="settingLink.icon"/>
          {{ settingLink.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="profile-header-container">

      <h4>My Profile</h4>
      <hr class="profile-divider"/>

    </div>

    <div class="profile-member-container">

      <div class="profile-header">
        <div class="avatar-wrapper">
          <img class="avatar-img" src="/images/user-icon.png" alt="Profile Picture"/>
        </div>
        <div class="user-info">
          <p>ID: <span>KM2025</span></p>
          <p><span>mohammed@gmail.com</span></p>
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
  background: var(--card-bg);
  height: auto;
  border-radius: 12px;

  .profile-header-container {

    h4 {
      font-size: var(--heading-4);
      color: var(--primary-text-color);
      margin: 20px;
      font-weight: normal;
    }

    .profile-divider{
      width: calc(100% - 40px);
      height: 3px;
      margin: 20px ;
      background-color: var(--secondary-text-color);
    }
  }

  .setting-tabs {
    display: grid;
    grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));
    padding: 20px;
    gap: 10px;

    @media (min-width: 1024px) {
      display: flex;
      gap: 20px;
      margin: 0 auto;
    }

    .setting-link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      color: var(--secondary-text-color);
      text-decoration: none;
      transition: var(--transition);

      &::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: transparent;
        transition: var(--transition);

      }

      &:hover {
        color: var(--accent-color);
        border-color: var(--accent-color);

        &::after {
          background-color: var(--accent-color);
        }
      }

      &.active {
        color: var(--accent-color);
        border-color: var(--accent-color);

        &::after {
          background-color: var(--accent-color);
        }
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
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      background: var(--card-bg);
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
