<script setup>
import {ref, reactive, onMounted, computed, onUnmounted} from 'vue'
import {useRoute} from 'vue-router'
import {useApi} from '~/composables/useApi'
import ProfileUpdatedSuccess from "./popup/ProfileUpdatedSuccess.vue";
import {gender, malaysiaBanks, malaysiaStates, countries} from '@/constants/lists.js';

const api = useApi()
const route = useRoute()

const settingLinks = ref([
  {link: "/member/profile", title: "Profile", icon: "mdi-account"},
  {link: "/member/profile/edit", title: "Edit Profile", icon: "mdi-account"},
  {link: "/member/auth/change-password", title: "Change Password", icon: "mdi-lock"},
])

const nonEditableFields = ['email', 'full_name']
const formFields = ref([
  {key: 'full_name', label: 'Full Name', type: 'text'},
  {key: 'ic_number', label: 'IC Number', type: 'text'},
  {key: 'gender', label: 'Gender', type: 'select', options: gender},
  {key: 'date_of_birth', label: 'Date of Birth', type: 'date'},
  {key: 'phone_number', label: 'Phone Number', type: 'tel'},
  {key: 'email', label: 'Email', type: 'email'},
  {key: 'country', label: 'Country', type: 'select', options: countries},
  {key: 'state', label: 'State', type: 'select', options: malaysiaStates},
  {key: 'city', label: 'City', type: 'text'},
  {key: 'address_line', label: 'Address', type: 'text'},
  {key: 'bank_name', label: 'Bank Name', type: 'select', options: malaysiaBanks},
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
const userProfile = ref({userId: '', email: '', avatar: '/images/user-icon.png'})
const originalData = ref({})

const showSuccessPopup = ref(false)

const hasUnsavedChanges = computed(() => Object.keys(form).some(key => form[key] !== originalData.value[key]))

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

const loadUserProfile = async () => {
  loading.value = true
  try {
    const {data} = await api.get('/members/profile/')

    userProfile.value = {
      userId: data.member_code,
      email: data.email,
      avatar: data.profile_picture || '/images/user-icon.png'
    }

    Object.keys(form).forEach(key => {
      if (data[key] !== undefined) form[key] = data[key]
    })

    originalData.value = {...form}
  } catch (error) {
    console.error('Failed to load profile:', error)
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  loading.value = true
  try {

    const fd = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') fd.append(key, value)
    })
    if (avatarFile.value instanceof File) fd.append('profile_picture', avatarFile.value)


    await api.put('/members/profile/', fd, {
      headers: {'Content-Type': 'multipart/form-data'}
    })

    originalData.value = JSON.parse(JSON.stringify(form))

    showSuccessPopup.value = true

    setTimeout(() => {
      showSuccessPopup.value = false
    }, 1500)

  } catch (error) {
    console.error('Failed to save profile:', error)

    alert('Failed to save profile')

  } finally {
    loading.value = false
  }
}
const resetForm = () => {
  Object.keys(form).forEach(key => form[key] = originalData.value[key])
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

    <div class="setting-tabs">
      <div class="setting-container" v-for="link in settingLinks" :key="link.link">
        <nuxt-link :to="link.link" class="setting-link" :class="{ active: route.path.startsWith(link.link) }">
          <UIcon :name="link.icon"/>
          {{ link.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="profile-member-container">

      <div class="profile-header">

        <div class="avatar-wrapper">
          <label for="avatar-upload" class="avatar-label">
            <img class="avatar-img" :src="userProfile.avatar" alt="Profile Picture"/>
            <div class="avatar-overlay">
              <span><UIcon name="mdi-camera"/></span>
              <span>Change Photo</span>
            </div>
          </label>
          <input
              id="avatar-upload"
              type="file"
              @change="handleAvatarUpload"
              accept="image/*"
          />
        </div>

        <div class="user-info">
          <p>ID: <span>{{ userProfile.userId || 'Loading...' }}</span></p>
          <p>Name: <span>{{ form.full_name || 'Loading...' }}</span></p>
        </div>
      </div>

      <div class="profile-form">
        <div class="form-grid">
          <template v-for="field in formFields" :key="field.key">
            <div class="form-item">
              <label :for="field.key" class="form-label">{{ field.label }}</label>

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
                <option v-for="option in field.options" :key="option.value" :value="option.value">{{
                    option.label
                  }}
                </option>
              </select>
            </div>
          </template>
        </div>

        <div class="form-actions">

          <button class="cancel-btn" @click="resetForm">Cancel</button>

          <button class="save-btn" @click="saveProfile" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>

          <ProfileUpdatedSuccess
              v-if="showSuccessPopup"
              :show.sync="showSuccessPopup"
          />

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
    width: calc(100% - 40px);
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
        position: relative;
        width: 150px;
        height: 150px;
        margin: 0 auto;

        .avatar-label {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          cursor: pointer;
          position: relative;

          .avatar-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transition: transform 0.3s ease;
          }

          .avatar-overlay {
            position: absolute;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.4);
            color: var(--special-text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            font-size: 1rem;
            font-weight: 500;
            transition: opacity 0.3s ease;
          }

          &:hover .avatar-overlay {
            opacity: 1;
          }
        }

        input[type="file"] {
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
            max-width: 200px;

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
</style>
