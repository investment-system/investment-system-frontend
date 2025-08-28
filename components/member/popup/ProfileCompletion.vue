<script setup lang="ts">
import {ref, reactive, onMounted, computed, onUnmounted} from 'vue'
import {useApi} from '~/composables/useApi'
import {gender, malaysiaBanks, malaysiaStates, countries} from '@/constants/lists.js';
import {defineProps, defineEmits} from "vue";
import ProfileUpdatedSuccess from "~/components/member/popup/ProfileUpdatedSuccess.vue";

const props = defineProps<{ show: boolean }>();

const emit = defineEmits(["update:show", "success"]);

const closePopup = () => emit("update:show", false);

const api = useApi()

const nonEditableFields = ['email', 'full_name']
const formFields = ref([
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
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container animate-popup">

      <div class="popup-header">
        <h4 class="popup-title">Edit Profile</h4>
        <hr class="line"/>
        <button class="close-btn" @click="closePopup">
          <UIcon name="mdi-close"/>
        </button>
      </div>

      <div class="avatar-card">
        <label for="avatar-upload" class="avatar-label">
          <img :src="userProfile.avatar" alt="Profile Picture" class="avatar-img"/>
          <div class="avatar-overlay">
            <UIcon name="mdi-camera" class="camera-icon"/>
            <span>Change Photo</span>
          </div>
        </label>
        <input id="avatar-upload" type="file" accept="image/*" @change="handleAvatarUpload"/>
        <div class="user-meta">

          <h4 class="user-name">{{ form.full_name || "Loading..." }}</h4>

          <div class="user-info">

            <span>
              <UIcon name="mdi-card-account-details-outline" class="user-icon"/>
            {{ userProfile.userId || "Loading..." }}
            </span>

            <span>
              <UIcon name="mdi-email" class="user-icon"/>
            {{ form.email || "Loading..." }}
            </span>

          </div>
        </div>
      </div>

      <!-- Form -->
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
                class="input-field"
            />

            <select
                v-else-if="field.type === 'select'"
                :id="field.key"
                v-model="form[field.key]"
                :disabled="loading || nonEditableFields.includes(field.key)"
                class="input-field"
            >
              <option value="">Select {{ field.label }}</option>
              <option v-for="option in field.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </div>
        </template>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button class="btn secondary" @click="resetForm">Cancel</button>
        <button class="btn primary" @click="saveProfile" :disabled="loading">
          {{ loading ? "Saving..." : "Save Changes" }}
        </button>
      </div>

      <!-- Success Toast -->
      <ProfileUpdatedSuccess v-if="showSuccessPopup" :show.sync="showSuccessPopup"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 1rem;
}

.popup-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  animation: fadeInScale 0.3s ease;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  margin-bottom: 16px;
  background-color: var(--secondary-bg);
  height: 50px;
  align-content: center;
  padding: 12px;
  border-radius: 6px;

  .popup-title {
    font-size: var(--body-font-size);
    white-space: nowrap;
  }

  .line {
    flex-grow: 1;
    border-bottom: 2px solid var(--border-color);
    height: 0;
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: var(--heading-4);
    cursor: pointer;
    color: var(--secondary-text-color);
    transition: var(--transition);

    &:hover {
      color: var(--primary-text-color);
    }
  }

}

.avatar-card {
  display: flex;
  align-items: center;
  gap: 20px;
  text-align: center;
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid var(--card-border);

  .avatar-label {
    display: inline-block;
    position: relative;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      color: var(--special-text-color);
      font-size: var(--small-text);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: 0.3s;
    }

    &:hover .avatar-overlay {
      opacity: 1;
    }
  }

  input[type="file"] {
    display: none;
  }

  .user-meta {
    margin-top: 5px;
    font-size: var(--small-text);
    color: var(--secondary-text-color);
    text-align: start;

    h4 {
      font-size: var(--heading-4);
      color: var(--primary-text-color);
      font-weight: normal;
    }

    .user-info {
      margin: 10px;

      span{
        margin-right: 5px;

        .user-icon{
          margin-right: 5px;
        }

      }

    }
  }
}

.form-grid {
  display: grid;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .form-label {
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
      font-weight: 500;
      color: #333;
    }

    .input-field {
      width: 100%;
      padding: 0.6rem 0.8rem;
      height: 36px;
      border-radius: 6px;
      font-size: var(--label-text);
      border: none;
      outline: none;
      background-color: var(--input-field-bg);
      transition: var(--transition);

      &:disabled {
        background: var(--hover-input-field-bg);
        cursor: not-allowed;
      }
    }
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  margin-top: 1.5rem;

  .btn {
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: 0.3s;
    border: none;

    &.primary {
      background: var(--button-bg);
      color: var(--primary-text-color);
      transition: var(--transition);

      &:hover {
        background: var(--hover-button-bg);
      }
    }

    &.secondary {
      background: var(--cancel-button-bg);
      color: var(--primary-text-color);
      transition: var(--transition);

      &:hover {
        background: var(--cancel-hover-button-bg);
      }
    }
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

