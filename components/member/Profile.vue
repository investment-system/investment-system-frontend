<script setup>

import {useRoute} from 'vue-router'

const route = useRoute()

const settingLinks = [
  {
    link: "/member/profile",
    title: "Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/change-password",
    title: "Change Password",
    icon: "mdi-lock",
  }
]

</script>

<template>

  <section>
    <h2>Account Setting</h2>
  </section>

  <section class="profile-member-container">
    <div class="profile-header">
      <div class="avatar-wrapper">
        <img class="avatar-img" src="/images/user-icon.png" alt="Profile Picture"/>
      </div>
      <div class="user-info">
        <p>User ID : <span>KM2025</span></p>
        <p>Email: <span>mohammed@gmail.com</span></p>
      </div>
    </div>

    <div class="profile-info">

      <div class="setting-container" v-for="settingLink in settingLinks">

        <nuxt-link
            :to="settingLink.link"
            class="setting-link"
            :class="{ active: route.path.includes(settingLink.link.toLowerCase()) }"
        >
          <UIcon
              :name="settingLink.icon"
          />

          {{ settingLink.title }}
        </nuxt-link>
      </div>

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
  width: calc(100% - 40px);

  h2 {
    font-size: var(--heading-3);
    color: var(--secondary-text-color);
    height: 100px;
    font-weight: normal;
    align-content: center;
    margin-left: 20px;
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

    .setting-container {
      display: inline-grid;

      .setting-link {
        position: relative;
        width: 160px;
        height: 48px;
        box-sizing: border-box;
        border: 1px solid var(--accent-color);
        color: var(--primary-text-color);
        text-align: center;
        align-content: center;
        cursor: pointer;
        transition: var(--transition);

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
      }
    }


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
