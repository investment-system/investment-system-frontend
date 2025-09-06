<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProfile } from '~/composables/useProfile.ts'

const { profileData } = useProfile()
const route = useRoute()

const settingLinks = ref([
  { link: "/administrators/profile", title: "Profile", icon: "mdi-account" },
  { link: "/administrators/profile/edit", title: "Edit Profile", icon: "mdi-account" },
  { link: "/administrators/auth/change-password", title: "Change Password", icon: "mdi-lock" },
])

// hold the image URL
const profilePicture = ref('')

// whenever profileData changes, set profilePicture
watch(profileData, (newVal) => {
  if (newVal && newVal.profile_picture) {
    profilePicture.value = newVal.profile_picture
  } else {
    profilePicture.value = '/images/user-pic.png' // fallback
  }
}, { immediate: true })

const displayData = computed(() => {
  if (!profileData.value) return []

  const profile = profileData.value
  return [
    { label: 'Full Name', value: profile.user?.full_name || '-' },
    { label: 'Email', value: profile.user?.email || '-' },
    { label: 'IC Number', value: profile.ic_number || '-' },
    { label: 'Gender', value: profile.gender || '-' },
    { label: 'Date of Birth', value: profile.date_of_birth || '-' },
    { label: 'Phone Number', value: profile.phone_number || '-' },
    { label: 'Address Line 1', value: profile.address_line1 || '-' },
    { label: 'Address Line 2', value: profile.address_line2 || '-' },
    { label: 'City', value: profile.city || '-' },
    { label: 'State', value: profile.state || '-' },
    { label: 'Postal Code', value: profile.postal_code || '-' },
    { label: 'Country', value: profile.country || '-' },
    { label: 'Position', value: profile.position || '-' },
    { label: 'Role', value: profile.role || '-' }
  ]
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
          <UIcon :name="settingLink.icon"/>
          {{ settingLink.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="profile-member-container">

      <div class="profile-header">
        <div class="avatar-wrapper">

          <img
              :src="profilePicture"
              alt="Profile Picture"
              class="avatar-img"
          />


        </div>
        <div class="user-info">
          <p>ID: <span>{{ profileData?.admin_code || 'N/A' }}</span></p>
          <p>Created at:
            <span>{{ profileData?.user?.date_joined ? profileData.user.date_joined.split('T')[0] : 'N/A' }}</span>
          </p>

        </div>
      </div>

      <div class="profile-info">
        <div class="form-grid">
          <div class="form-item" v-for="(item, index) in displayData" :key="index">
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
  border-radius: 12px;
  min-height: 100vh;

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
      display: flex;
      gap: 20px;
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
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    @media (min-width: 768px) {
      max-width: 1280px;
      grid-template-columns:  2fr 3fr;
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
          width: 130px;
          height: 130px;
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
          font-size: var(--body-text);

          span {
            color: var(--secondary-text-color);
            font-size: var(--small-text);
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
        grid-template-columns: repeat(1, 1fr);
        gap: 0;
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
