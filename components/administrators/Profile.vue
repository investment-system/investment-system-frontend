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
  }
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
          <img src="/images/user.png" alt="Profile Image"/>
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

    <div class="profile-section">
      <div class="profile-grid">
        <div class="profile-item" v-for="(item, key) in profileInfo" :key="key">
          <span class="profile-item-label">{{ item.label }}:</span>
          <span class="profile-item-value">{{ item.value }}</span>
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
}

.header-bg img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  display: block;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  margin-top: -20px;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid var(--border-color);
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
  padding: 5px 10px;
  border-radius: 3px 3px 0 0;
  text-decoration: none;
  height: 36px;
  align-content: center;
  color: var(--primary-text-color);
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--secondary-text-color);
}

.nav-link.active {
  background-color: var(--button-bg);
}

@media (min-width: 768px) {
  .profile-page {
    width: calc(100% - 40px);
    max-width: 1240px;
    margin: 20px auto;
  }

  .profile-info {
    gap: 20px;
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

.profile-section {
  width: 100%;
  background-color: var(--card-bg);
  margin: 20px 0;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  padding: 20px 0;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.profile-item {
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  border-radius: 0.5rem;
}

.profile-item-label {
  font-size: var(--body-text);
  color: var(--primary-text-color);
  height: 48px;
  align-content: center;
}

.profile-item-value {
  font-size: 1rem;
  color: var(--secondary-text-color);
  height: 48px;
  align-content: center;
  background-color: var(--input-field-bg);
  padding: 0 20px;
  border-radius: 6px;
}


</style>
