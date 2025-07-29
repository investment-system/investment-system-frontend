<script setup>

import {ref, reactive, onMounted, computed, onUnmounted} from 'vue'
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
    link: "/member/change-password",
    title: "Change Password",
    icon: "mdi-lock",
  }
])

const nonEditableFields = ['email', 'full_name', 'gender']
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
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  setTimeout(() => {
    location.reload()
  }, 2000)
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

const avatarFile = ref(null)

const handleAvatarUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  avatarFile.value = file
  const reader = new FileReader()
  reader.onload = () => {
    userProfile.value.avatar = reader.result
  }
  reader.readAsDataURL(file)
}


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

      <h4>Edit Profile</h4>
      <hr class="profile-divider"/>

    </div>

    <div class="profile-member-container">

      <div class="profile-header">
        <div class="avatar-wrapper">
          <label for="avatar-upload">
            <img class="avatar-img" :src="userProfile.avatar" alt="Profile Picture"/>
          </label>
          <input id="avatar-upload" type="file" @change="handleAvatarUpload" accept="image/*"/>
        </div>
        <div class="user-info">
          <p>ID: <span>KM2025</span></p>
          <p><span>mohammed@gmail.com</span></p>
        </div>
      </div>

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
                  :disabled="loading || nonEditableFields.includes(field.key)"
              />

              <select
                  v-else-if="field.type === 'select'"
                  :id="field.key"
                  v-model="form[field.key]"
                  :disabled="loading || nonEditableFields.includes(field.key)"
              >
                <option value="">Select {{ field.label }}</option>
                <option
                    v-for="option in field.options"
                    :key="option.value"
                    :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>

            </div>
          </template>
        </div>

        <div class="form-actions">

          <button class="cancel-btn" @click="resetForm">Cancel</button>

          <button
              @click="saveProfile"
              class="save-btn"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}

          </button>

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

    .profile-divider {
      width: calc(100% - 40px);
      height: 3px;
      margin: 20px;
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

        label {
          cursor: pointer;
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 12px;
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
          grid-template-columns: repeat(2, 1fr);
        }

        .col-span-2 {
          @media (min-width: 768px) {
            grid-column: span 2;
          }
        }

        .form-item {
          display: grid;
          grid-template-columns: 1fr 1fr;

          .form-label {
            font-size: var(--body-text);
            color: var(--primary-text-color);
            height: 36px;
            align-content: center;

            .required {
              color: var(--error-color);
            }
          }

          input, select, textarea {
            padding: 0.75rem;
            border: none;
            outline: none;
            border-radius: 4px;
            font-size: var(--placeholder-text);
            transition: var(--transition);
            height: 36px;
            align-content: center;

            &:focus {
              outline: none;
              border-color: var(--accent-color);
            }
          }
          input:disabled,
          select:disabled {
            cursor: not-allowed;
          }
        }
      }

      .form-actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        gap: 20px;
        margin: 20px;

        button {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          border: none;
          border-radius: 6px;
          font-size: var(--text-button-Text);
          cursor: pointer;
          background: var(--button-bg);
          color: var(--primary-text-color);
          transition: var(--transition);

          &:hover {
            background-color: var(--hover-button-bg);
          }
        }

        .cancel-btn {
          background: var(--cancel-button-bg);

          &:hover {
            background: var(--cancel-hover-button-bg);
          }
        }
      }
    }

  }

}
</style>
