<script setup>

import {useRoute} from 'vue-router'

const route = useRoute()

const settingLinks = ref([
  {
    link: "/member/edit-profile",
    title: "Edit Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/change-password",
    title: "Change Password",
    icon: "mdi-lock",
  }
])

</script>

<template>

  <section>
    <h2>Account Settings</h2>

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


  </section>

  <section class="profile-member-container">
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
        <div class="form-item">
          <label>Full Name</label>
          <p>Mohammed Adnan</p>
        </div>
        <div class="form-item">
          <label>IC Number</label>
          <p>123456-78-9012</p>
        </div>
        <div class="form-item">
          <label>Gender</label>
          <p>Male</p>
        </div>
        <div class="form-item">
          <label>Date of Birth</label>
          <p>1995-05-20</p>
        </div>
        <div class="form-item">
          <label>Phone Number</label>
          <p>+60123456789</p>
        </div>
        <div class="form-item">
          <label>Country</label>
          <p>Malaysia</p>
        </div>
        <div class="form-item">
          <label>City</label>
          <p>Kuala Lumpur</p>
        </div>
        <div class="form-item">
          <label>State</label>
          <p>Selangor</p>
        </div>
        <div class="form-item">
          <label>Bank Name</label>
          <p>Maybank</p>
        </div>
        <div class="form-item">
          <label>Account Holder Name</label>
          <p>Mohammed Adnan</p>
        </div>
        <div class="form-item">
          <label>Bank Account Number</label>
          <p>1234567890</p>
        </div>
      </div>
    </div>
  </section>

</template>

<style scoped lang="scss">

section {
  margin: 0 auto;

  h2 {
    font-size: var(--heading-3);
    color: var(--secondary-text-color);
    height: 50px;
    font-weight: normal;
    align-content: center;
    margin: 0 20px;
  }

  .setting-tabs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    margin: 0 auto;

    .setting-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .setting-link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        height: 48px;
        box-sizing: border-box;
        border: 1px solid var(--accent-color);
        color: var(--primary-text-color);
        text-align: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
        text-decoration: none;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background-color: transparent;
          transition: var(--transition);
        }

        &:hover::before,
        &.active::before {
          background-color: var(--accent-color);
        }

        &.active {
          background-color: var(--accent-color-light);
        }
      }
    }

    @media (min-width: 768px) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 0;

      .setting-container {
        flex-direction: row;

        .setting-link {
          width: 160px;
        }
      }
    }
  }

}

.profile-member-container {
  min-height: 100vh;
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
    padding: 1rem;
    max-height: 300px;
    margin-bottom: 20px;

    .avatar-wrapper {
      width: 150px;
      height: 150px;
      margin: 1rem auto;

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
      gap: 20px;

      .form-item {

        label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--primary-text-color);
          height: 48px;
          align-content: center;
        }

        p {
          margin: 0;
          color: var(--secondary-text-color);
          height: 48px;
          align-content: center;
          background-color: var(--card-bg);
          padding: 0 10px;
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
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>
