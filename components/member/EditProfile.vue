<script setup>
import {useRoute} from 'vue-router'
import {ref, reactive, onMounted, computed, onUnmounted} from 'vue'

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

const formFields = ref([
  {key: 'full_name', label: 'Full Name', type: 'text'},
  {key: 'ic_number', label: 'IC Number', type: 'text'},
  {
    key: 'gender', label: 'Gender', type: 'select',
    options: [
      {value: 'male', label: 'Male'},
      {value: 'female', label: 'Female'}
    ]
  },
  {key: 'date_of_birth', label: 'Date of Birth', type: 'date'},
  {key: 'phone_number', label: 'Phone Number', type: 'tel'},
  {key: 'email', label: 'Email', type: 'email'},
  {key: 'country', label: 'Country', type: 'text'},
  {key: 'state', label: 'State', type: 'text'},
  {key: 'city', label: 'City', type: 'text'},
  {key: 'address_line', label: 'Address', type: 'text'},
  {key: 'bank_name', label: 'Bank Name', type: 'text'},
  {key: 'account_holder_name', label: 'Account Holder', type: 'text'},
  {key: 'bank_account_number', label: 'Account Number', type: 'text'}
])

const form = reactive({
  full_name: '',
  ic_number: '',
  gender: '',
  date_of_birth: '',
  phone_number: '',
  email: '',
  country: '',
  state: '',
  city: '',
  address_line: '',
  bank_name: '',
  account_holder_name: '',
  bank_account_number: '',
})

const loading = ref(false)
const savedMessage = ref('')

const userProfile = ref({
  userId: '',
  email: '',
  avatar: '/images/user-icon.png'
})

const originalData = ref({})

const hasUnsavedChanges = computed(() => {
  return Object.keys(form).some(key => form[key] !== originalData.value[key])
})

const loadUserProfile = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const userData = {
      member_id: 'KM2025',
      email: 'mohammed@gmail.com',
      profile_picture: '/images/user-icon.png',
      full_name: 'Mohammed Adnan',
      ic_number: '123456-78-9012',
      gender: 'male',
      date_of_birth: '1995-05-20',
      phone_number: '+60123456789',
      country: 'Malaysia',
      city: 'Kuala Lumpur',
      state: 'Selangor',
      address_line: '123 Jalan Example',
      bank_name: 'Maybank',
      account_holder_name: 'Mohammed Adnan',
      bank_account_number: '1234567890',
    }

    userProfile.value = {
      userId: userData.member_id,
      email: userData.email,
      avatar: userData.profile_picture
    }

    Object.keys(form).forEach(key => {
      if (userData[key] !== undefined) {
        form[key] = userData[key]
      }
    })

    originalData.value = {...form}

  } catch (error) {
    showMessage('Failed to load profile data', 'error')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    originalData.value = {...form}
    showMessage('Profile updated successfully!', 'success')
  } catch (error) {
    showMessage('Failed to save profile. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.keys(form).forEach(key => {
    form[key] = originalData.value[key] || ''
  })
  showMessage('Form reset to last saved version', 'info')
}

const showMessage = (message, type = 'success') => {
  savedMessage.value = {text: message, type}
  setTimeout(() => {
    savedMessage.value = ''
  }, type === 'error' ? 5000 : 3000)
}

const handleBeforeUnload = (e) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => {
  loadUserProfile()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
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
        <label for="avatar-upload">
          <img class="avatar-img" src="/images/user-icon.png" alt="Profile Picture"/>
        </label>
        <input id="avatar-upload" type="file" @change="handleAvatarUpload" accept="image/*"/>
      </div>

      <div class="user-info">
        <p>ID: <span>{{ userProfile.userId }}</span></p>
        <p>Eml: <span>{{ userProfile.email }}</span></p>
        <p v-if="hasUnsavedChanges" class="unsaved-changes">
          <UIcon name="mdi-circle"/>
          Unsaved changes
        </p>
      </div>
    </div>

    <div class="profile-info">


      <div class="profile-form">
        <div class="form-grid">
          <template v-for="field in formFields" :key="field.key">
            <div
                class="form-item"
            >
              <label :for="field.key" class="form-label">
                {{ field.label }}
                <span v-if="field.required" class="required">*</span>
              </label>

              <input
                  v-if="['text', 'email', 'tel', 'date'].includes(field.type)"
                  :id="field.key"
                  :type="field.type"
                  v-model="form[field.key]"
                  :placeholder="`Enter ${field.label.toLowerCase()}`"
                  :disabled="loading"
              />

              <select
                  v-else-if="field.type === 'select'"
                  :id="field.key"
                  v-model="form[field.key]"
                  :disabled="loading"
              >

                <option value="">Select {{ field.label }}</option>
                <option
                    v-for="option in field.options"
                    :key="option"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </template>
        </div>

        <div class="form-actions">
          <button
              @click="saveProfile"
              class="save-btn"
          >
            <UIcon v-if="loading" name="mdi-loading" class="spin"/>
            <UIcon v-else name="mdi-content-save"/>
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>

        </div>

        <div v-if="savedMessage" class="message" :class="savedMessage.type">
          {{ savedMessage.text }}
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
    grid-template-columns: 1fr 3fr;
    gap: 20px;
  }

  .profile-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    min-width: 270px;
    gap: 1rem;
    background: var(--card-bg);
    padding: 1rem;
    max-height: 300px;
    margin-bottom: 20px;

    .avatar-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto;

      label {
        cursor: pointer;
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        border: 2px solid var(--border-color, #ccc);
        overflow: hidden;
        transition: transform 0.3s ease;

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }

      input[type='file'] {
        display: none;
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

  .profile-form {
    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;

      @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(4, 1fr);
      }

      .col-span-2 {
        @media (min-width: 768px) {
          grid-column: span 2;
        }
      }

      .form-item {
        display: flex;
        flex-direction: column;

        .form-label {
          font-size: var(--body-text);
          color: var(--primary-text-color);
          height: 48px;
          align-content: center;

          .required {
            color: var(--error-color);
          }
        }

        input, select, textarea {
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: var(--placeholder-text);
          transition: var(--transition);

          &:focus {
            outline: none;
            border-color: var(--accent-color);
            box-shadow: 0 0 0 2px rgba(var(--accent-color-rgb), 0.1);
          }
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;

      button {

        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: var(--text-button-Text);
        cursor: pointer;
        background: var(--button-bg);
        color: var(--primary-text-color);
        transition: var(--transition);

        &:hover {
          background-color: var(--hover-button-bg);
        }
      }
    }
  }
}
</style>