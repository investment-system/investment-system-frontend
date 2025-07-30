<script setup lang="ts">
const links = [
  {
    id: '1',
    link: '/administrators/profile',
    label: 'Profile',
  },
  {
    id: '2',
    link: '/administrators/profile/edit',
    label: 'Update Profile',
  },
  {
    id: '3',
    link: '',
    label: 'Change Password',
  },
]

const profileInfo = {
  full_name: {
    label: 'Full Name',
    value: 'Adnan Madi',
  },
  email: {
    label: 'Email Address',
    value: 'adnan.madi@example.com',
  },
  ic_number: {
    label: 'IC Number',
    value: '900101-14-5678',
  },
  gender: {
    label: 'Gender',
    value: 'Male',
  },
  date_of_birth: {
    label: 'Date of Birth',
    value: '1990-01-01',
  },
  phone_number: {
    label: 'Phone Number',
    value: '+60 12-345 6789',
  },
  role: {
    label: 'Role',
    value: 'admin',
  },
  position: {
    label: 'Position',
    value: 'Project Coordinator',
  },
}

</script>

<template>
  <section class="profile-page">

    <div class="header">
      <div class="header-bg">
        <img src="/images/profile-bg.jpg" alt="Profile Header Background"/>
      </div>

      <div class="profile-info">
        <div class="avatar">
          <img src="/images/profile-user-pic.jpg" alt="Profile Image"/>
        </div>
        <div class="info-text">
          <span class="user-id">ID: AKM-20250726-0001</span>
          <span class="user-name">Aminah Rosli</span>
        </div>
      </div>

      <nav class="profile-nav">
        <NuxtLink
            v-for="link in links"
            :key="link.id"
            :to="link.link"
            class="nav-link"
            :class="{ active: $route.path === link.link }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>

    <div class="profile-details">

      <div class="profile-header-container">

        <h4>My Profile</h4>
        <hr class="profile-divider"/>

      </div>

      <div class="details-grid">
        <div class="detail-item" v-for="(item, key) in profileInfo" :key="key">
          <label class="item-label">{{ item.label }}</label>
          <p class="item-value">{{ item.value }}</p>
        </div>
      </div>
    </div>


  </section>
</template>

<style scoped>
.profile-page {
  width: 100%;
  margin: 0 auto;
  min-height: 100vh;
}

.header {
  background-color: var(--card-bg);
  overflow: hidden;
  border-radius: 12px;
}

.header-bg img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
  border-radius: 12px 12px 0 0;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 10px;
  margin-top: -25px;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--card-bg);
  background-color: var(--card-bg);
  object-fit: cover;
}

.info-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-id {
  font-size: var(--small-text);
  color: var(--secondary-text-color);
  height: 20px;
  align-items: center;
}

.user-name {
  font-size: var(--body-text);
  color: var(--primary-text-color);
  height: 20px;
  align-items: center;
}

.profile-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 20px 0 0 20px;
}

.nav-link {
  padding: 10px 15px;
  border-radius: 6px 6px 0 0;
  text-decoration: none;
  height: 36px;
  align-content: center;
  color: var(--primary-text-color);
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.active {
  background-color: var(--primary-bg);
}

@media (min-width: 768px) {
  .profile-page {
    width: calc(100% - 40px);
    max-width: 1240px;
    margin: 20px auto;
  }

  .profile-info {
    gap: 20px;
    margin-left: 20px;
  }

  .avatar img {
    width: 120px;
    height: 120px;
  }

  .user-name {
    font-size: var(--body-text);
  }
}

@media (min-width: 1024px) {
  .profile-page {
    width: calc(100% - 40px);
    max-width: 1240px;
  }
}

.profile-details {
  flex: 1;
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  margin: 20px 0;

  .profile-header-container {

    h4 {
      font-size: var(--heading-4);
      color: var(--primary-text-color);
      font-weight: normal;
    }

    .profile-divider {
      width: 100%;
      height: 3px;
      margin: 20px 0;
      background-color: var(--secondary-text-color);
    }
  }

  .details-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr ;
    }

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }

    .detail-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;

      .item-label {
        font-size: var(--body-text);
        color: var(--primary-text-color);
        font-weight: 600;
        height: 36px;
        align-items: center;
      }

      .item-value {
        font-size: var(--body-text);
        color: var(--secondary-text-color);
        height: 36px;
        align-items: center;
      }
    }
  }
}


</style>
