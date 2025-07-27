<script setup lang="ts">
import {ref} from 'vue'

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

const profileForm = ref({
  full_name: 'Adnan Madi',
  email: 'adnan.madi@example.com',
  ic_number: '900101-14-5678',
  gender: 'Male',
  date_of_birth: '1990-01-01',
  phone_number: '+60 12-345 6789',
  role: 'admin',
  position: 'Project Coordinator',
  profile_picture: null,
})

function saveProfile() {
  console.log('Saving profile data:', profileForm.value)
  // You can connect to your backend here
}

const avatarUrl = ref('/images/user.png')

function handleAvatarChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    avatarUrl.value = URL.createObjectURL(file)
  }
}

function handleCancel() {

  setTimeout(() => {
    location.reload()
  },1000)
}


</script>

<template>
  <section class="profile-page">
    <div class="header">
      <div class="header-bg">
        <img src="/images/profile-bg.jpg" alt="Profile Header Background"/>
      </div>

      <div class="profile-info">

        <div class="avatar-upload">
          <input
              id="fileInput"
              type="file"
              accept="image/*"
              class="file-input"
              @change="handleAvatarChange"
          />
          <label for="fileInput" class="avatar-label">
            <img :src="avatarUrl" alt="Profile Avatar" class="avatar-img"/>
            <span class="upload-text">Click to upload</span>
          </label>
        </div>


        <div class="info-text">
          <span class="user-id">ID: AKM-20250726-0001</span>
          <span class="user-name">{{ profileForm.full_name }}</span>
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

        <div class="profile-item">
          <label class="profile-item-label">Full Name</label>
          <input v-model="profileForm.full_name" class="profile-input" type="text" disabled/>
        </div>

        <div class="profile-item">
          <label class="profile-item-label">Email Address</label>
          <input v-model="profileForm.email" class="profile-input" type="email" disabled/>
        </div>

        <div class="profile-item">
          <label class="profile-item-label">IC Number</label>
          <input v-model="profileForm.ic_number" class="profile-input" type="text"/>
        </div>

        <div class="profile-item">
          <label class="profile-item-label">Gender</label>
          <select v-model="profileForm.gender" class="profile-input">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div class="profile-item">
          <label class="profile-item-label">Date of Birth</label>
          <input v-model="profileForm.date_of_birth" class="profile-input" type="date"/>
        </div>

        <div class="profile-item">
          <label class="profile-item-label">Phone Number</label>
          <input v-model="profileForm.phone_number" class="profile-input" type="text"/>
        </div>

        <div class="profile-item">
          <label class="profile-item-label">Role</label>
          <input v-model="profileForm.role" class="profile-input" type="text" disabled/>
        </div>

        <div class="profile-item">
          <label class="profile-item-label">Position</label>
          <select v-model="profileForm.position" class="profile-input">
            <option value="manager">Manager</option>
            <option value="staff">Staff</option>
            <option value="executive">Executive</option>
          </select>
        </div>

      </div>

      <div class="btn-wrapper">
        <button type="button" class="cancel-btn" @click="handleCancel">Cancel</button>
        <button class="save-button" @click="saveProfile">Save Changes</button>
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

.avatar-upload {
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.file-input {
  display: none;
}

.avatar-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.avatar-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border-color);
}

.upload-text {
  font-size: var(--small-text);
  color: var(--secondary-text-color);
  margin-top: 0.5rem;
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
}

.user-name {
  font-size: var(--body-text);
  color: var(--primary-text-color);
  height: 20px;
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
  cursor: pointer;
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
  gap: 1rem;

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

.profile-input {
  padding: 10px;
  background-color: var(--input-field-bg);
  border: none;
  border-radius: 6px;
  color: var(--secondary-text-color);
  font-size: var(--body-text);
  height: 48px;
  align-content: center;
}

.profile-input:disabled {
  border: 1px solid var(--danger-color);
  cursor: not-allowed;
}

.btn-wrapper {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  margin: 0 20px ;
  padding-bottom: 20px;

  button {
    border: none;
    outline: none;
    color: var(--primary-text-color);
    cursor: pointer;
    width: 150px;
    height: 48px;
    border-radius: 6px;
  }

}

.save-button {
  background-color: var(--button-bg);
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.save-button:hover {
  background-color: var(--hover-button-bg);
}

.cancel-btn {
  background: var(--cancel-button-bg);
  color: var(--primary-text-color);
}

</style>
