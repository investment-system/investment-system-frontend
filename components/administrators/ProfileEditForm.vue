<script setup>
import {ref, reactive, computed, onMounted, onUnmounted} from 'vue'
import {useRoute} from 'vue-router'
import {useApi} from '~/composables/useApi'
import ProfileUpdatedSuccess from "./popup/ProfileUpdatedSuccess.vue";
import {positionChoices} from '@/constants/lists.js'

const api = useApi()
const route = useRoute()
const showSuccessPopup = ref(false)

const settingLinks = ref([
  {link: "/administrators/profile", title: "Profile", icon: "mdi-account"},
  {link: "/administrators/profile/edit", title: "Edit Profile", icon: "mdi-account"},
  {link: "/administrators/auth/change-password", title: "Change Password", icon: "mdi-lock"},
])

const nonEditableFields = ['email', 'full_name', 'gender', 'role']

const formFields = ref([
  {key: 'full_name', label: 'Full Name', type: 'text'},
  {key: 'email', label: 'Email Address', type: 'email'},
  {key: 'ic_number', label: 'IC Number', type: 'text'},
  {key: 'gender', label: 'Gender', type: 'text'},
  {key: 'date_of_birth', label: 'Date of Birth', type: 'date'},
  {key: 'phone_number', label: 'Phone Number', type: 'tel'},
  {key: 'address_line1', label: 'Address Line 1', type: 'text'},
  {key: 'address_line2', label: 'Address Line 2', type: 'text'},
  {key: 'city', label: 'City', type: 'text'},
  {key: 'state', label: 'State', type: 'text'},
  {key: 'postal_code', label: 'Postal Code', type: 'text'},
  {key: 'country', label: 'Country', type: 'text'},
  {key: 'position', label: 'Position', type: 'select', options: positionChoices},
  {key: 'role', label: 'Role', type: 'text'},
])

const form = reactive({
  full_name: '',
  email: '',
  ic_number: '',
  gender: '',
  date_of_birth: '',
  phone_number: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: '',
  position: '',
  role: '',
})

const loading = ref(false)
const uploadingAvatar = ref(false)
const savedMessage = ref('')
const userProfile = ref({
  user_id: '',
  email: '',
  avatar: '/images/user-icon.png'
})

const originalData = ref({})
const avatarFile = ref(null)
const hasAvatarChanged = ref(false)

const hasUnsavedChanges = computed(() => {
  return Object.keys(form).some(key => form[key] !== originalData.value[key]) || hasAvatarChanged.value
})

const loadUserProfile = async () => {
  loading.value = true
  try {
    const { data } = await api.get('/administrators/profile/', {
      headers: {
        Authorization: `Token ${useCookie('token').value}`
      }
    })

    // Map data to form fields correctly
    Object.keys(form).forEach(key => {
      if (key === 'full_name') {
        form.full_name = data.user?.full_name || ''
      } else if (key === 'email') {
        form.email = data.user?.email || ''
      } else if (key === 'role') {
        form.role = data.user?.user_type || data.role || ''
      } else {
        form[key] = data[key] ?? ''
      }
    })

    // Fill in userProfile object
    userProfile.value = {
      user_id: data.admin_code || '',
      email: data.user?.email || '',
      created_at: data.user?.date_joined || '',
      avatar: data.profile_picture || '/images/user-icon.png',
    }

    // Save original for reset
    originalData.value = { ...form }
    hasAvatarChanged.value = false

    console.log("=== Full Profile Loaded ===")
    console.log("Form Data:", form)
    console.log("User Profile:", userProfile.value)
    console.log("Original Data:", originalData.value)

  } catch (error) {
    console.error('Profile load error:', error)
    showMessage('Failed to load profile data', 'error')
  } finally {
    loading.value = false
  }
}

const uploadAvatar = async () => {
  if (!avatarFile.value) return null

  uploadingAvatar.value = true
  try {
    const formData = new FormData()
    formData.append('profile_picture', avatarFile.value)

    const {data} = await api.post('/administrators/profile/', formData, {
      headers: {
        Authorization: `Token ${useCookie('token').value}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    return data.profile_picture || data.avatar_url

    console.log(data)
  } catch (error) {
    console.error('Avatar upload error:', error)
    throw new Error('Failed to upload avatar')
  } finally {
    uploadingAvatar.value = false
  }
}

const saveProfile = async () => {
  loading.value = true
  try {
    let avatarUrl = null

    if (hasAvatarChanged.value && avatarFile.value) {
      try {
        avatarUrl = await uploadAvatar()
      } catch (error) {}
    }

    // clone form
    const updateData = { ...form }

    // remove non-editable fields
    nonEditableFields.forEach(field => {
      delete updateData[field]
    })

    if (avatarUrl) {
      updateData.profile_picture = avatarUrl
    }

    const { data } = await api.patch('/administrators/profile/', updateData, {
      headers: {
        Authorization: `Token ${useCookie('token').value}`,
        'Content-Type': 'application/json'
      }
    })

    originalData.value = { ...form }
    hasAvatarChanged.value = false

    if (avatarUrl) {
      userProfile.value.avatar = avatarUrl
    }

    originalData.value = JSON.parse(JSON.stringify(form))

    showSuccessPopup.value = true

    setTimeout(() => {
      showSuccessPopup.value = false
    }, 1500)
  } catch (error) {
    console.error('Profile save error:', error)
    console.error('Failed to save profile data')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  setTimeout(() => {
    location.reload()
  }, 500)
}

const handleAvatarUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showMessage('Please select a valid image file', 'error')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showMessage('Image size must be less than 5MB', 'error')
    return
  }

  avatarFile.value = file
  hasAvatarChanged.value = true

  const reader = new FileReader()
  reader.onload = () => {
    userProfile.value.avatar = reader.result
  }
  reader.onerror = () => {
    showMessage('Failed to read image file', 'error')
  }
  reader.readAsDataURL(file)
}

const handleBeforeUnload = (e) => {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
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
          <label for="avatar-upload" class="avatar-label">
            <img
                class="avatar-img"
                :src="userProfile.avatar"
                alt="Profile Picture"
            />
            <div class="avatar-overlay" v-if="!uploadingAvatar">
              <UIcon name="mdi-camera"/>
              <span>Change Photo</span>
            </div>
            <div class="avatar-overlay" v-else>
              <UIcon name="mdi-loading" class="spinning"/>
              <span>Uploading...</span>
            </div>
          </label>
          <input
              id="avatar-upload"
              type="file"
              @change="handleAvatarUpload"
              accept="image/*"
              style="display: none;"
              :disabled="loading || uploadingAvatar"
          />
        </div>

        <div class="user-info">
          <p>ID: <span>{{ userProfile.user_id || 'N/A' }}</span></p>
          <p>Created at:
            <span>{{ userProfile.created_at ? userProfile.created_at.split('T')[0] : 'N/A' }}</span>
          </p>
        </div>
      </div>

      <div class="profile-form">
        <div class="form-grid">
          <template v-for="field in formFields" :key="field.key">
            <div class="form-item">
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
                  class="form-input"
                  :class="{ 'disabled': nonEditableFields.includes(field.key) }"
              />

              <select
                  v-else-if="field.type === 'select'"
                  :id="field.key"
                  v-model="form[field.key]"
                  :disabled="loading || nonEditableFields.includes(field.key)"
                  class="form-select"
                  :class="{ 'disabled': nonEditableFields.includes(field.key) }"
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
          <button
              class="cancel-btn"
              @click="resetForm"
              :disabled="loading || uploadingAvatar || !hasUnsavedChanges"
          >
            Reset
          </button>
          <button
              class="save-btn"
              @click="saveProfile"
              :disabled="loading || uploadingAvatar || !hasUnsavedChanges"
          >
            <UIcon v-if="loading || uploadingAvatar" name="mdi-loading" class="spinning"/>
            {{ loading || uploadingAvatar ? 'Saving...' : 'Save Changes' }}
          </button>

          <ProfileUpdatedSuccess
              v-if="showSuccessPopup"
              :show.sync="showSuccessPopup"
          />

        </div>

        <div v-if="savedMessage.text" class="message-container">
          <p :class="savedMessage.type === 'error' ? 'error-message' : 'success-message'">
            {{ savedMessage.text }}
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">

section {
  width: calc(100% - 40px);
  margin: 20px auto;
  height: auto;
  min-height: 100vh;


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
          font-size: var(--body-text);

          span {
            color: var(--secondary-text-color);
            font-size: var(--small-text);
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
          grid-template-columns: repeat(1, 1fr);
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
            border-radius: 6px;
            font-size: var(--placeholder-text);
            transition: var(--transition);
            height: 36px;
            align-content: center;
            background: var(--cancel-button-bg);
            min-width: 200px;

            &:focus {
              outline: none;
              border-color: var(--accent-color);
              background: var(--cancel-button-bg);
            }
          }

          input:disabled,
          select:disabled {
            cursor: not-allowed;
            background: var(--cancel-button-bg);

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


.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-label {
  position: relative;
  display: block;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-size: var(--small-text);
  text-align: center;
  border-radius: 50%;
}

.avatar-label:hover .avatar-overlay {
  opacity: 1;
}

.form-input:disabled.disabled,
.form-select:disabled.disabled {
  background-color: var(--primary-bg);
  color: var(--primary-text-color);
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.message-container {
  margin-top: 1rem;
}

.success-message {
  color: #10b981;
  background: #ecfdf5;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border-left: 4px solid #10b981;
}

.error-message {
  color: #ef4444;
  background: #fef2f2;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border-left: 4px solid #ef4444;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
