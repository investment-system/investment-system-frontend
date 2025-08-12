<script setup>
import { ref, computed } from 'vue'
import { z } from 'zod'
import { useApi } from '~/composables/useApi'

const api = useApi()

// Updated form fields to match Django models
const form = ref({
  full_name: '',
  email: '',
  password: '',
  ic_number: '',
  gender: '',
  date_of_birth: '',
  phone_number: '',
  profile_picture: null,
  role: 'admin', // default to admin
  position: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: ''
})

const avatarUrl = ref('/default-avatar.png')

function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (file) {
    form.value.profile_picture = file
    avatarUrl.value = URL.createObjectURL(file)
  }
}

const profileQuestions = computed(() => [
  { id: 'full_name', label: 'Full Name', type: 'text', placeholder: 'Enter full name', validation: z.string().min(1) },
  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter email address', validation: z.string().email() },
  { id: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', validation: z.string().min(6) },
  { id: 'ic_number', label: 'IC Number', type: 'text', placeholder: '900101-14-1234', validation: z.string().min(1) },
  { id: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }], validation: z.enum(['male', 'female']) },
  { id: 'date_of_birth', label: 'Date of Birth', type: 'date', validation: z.string().min(1) },
  { id: 'phone_number', label: 'Phone Number', type: 'text', placeholder: '+60 12-345 6789', validation: z.string().min(1) },
  { id: 'role', label: 'Role', type: 'select', options: [{ label: 'Super Admin', value: 'super_admin' }, { label: 'Admin', value: 'admin' }, { label: 'Moderator', value: 'moderator' }], validation: z.enum(['super_admin', 'admin', 'moderator']) },
  { id: 'position', label: 'Position', type: 'select', options: [{ label: 'Manager', value: 'manager' }, { label: 'Staff', value: 'staff' }, { label: 'Executive', value: 'executive' }], validation: z.enum(['manager', 'staff', 'executive']) },
  { id: 'address_line1', label: 'Address Line 1', type: 'text', placeholder: 'Enter address line 1', validation: z.string().optional() },
  { id: 'address_line2', label: 'Address Line 2', type: 'text', placeholder: 'Enter address line 2', validation: z.string().optional() },
  { id: 'city', label: 'City', type: 'text', placeholder: 'Enter city', validation: z.string().optional() },
  { id: 'state', label: 'State', type: 'text', placeholder: 'Enter state', validation: z.string().optional() },
  { id: 'postal_code', label: 'Postal Code', type: 'text', placeholder: 'Enter postal code', validation: z.string().optional() },
  { id: 'country', label: 'Country', type: 'text', placeholder: 'Enter country', validation: z.string().optional() }
])

async function saveChanges() {
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        fd.append(key, value)
      }
    })

    const res = await api.post('/auth/admin/register/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    alert(`Admin registered! Code: ${res.data.admin_code}`)
  } catch (err) {
    console.error(err.response?.data || err.message)
    alert('Registration failed')
  }
}
</script>

<template>
  <div class="create-admin-profile-form">

    <div class="form-header">
      <div class="header-content">
        <h1 class="form-title">New Administrators</h1>
        <div class="title-line"></div>
      </div>
    </div>

    <div class="form-body">

      <div class="profile-section">
        <div class="avatar-container">
          <div class="avatar-wrapper">
            <img
                :src="avatarUrl"
                alt="Profile Picture"
                class="avatar-image"
                @error="avatarUrl = '/images/user-icon.png'"
            />
            <div class="avatar-overlay">
              <label for="avatar-upload" class="upload-label">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
                <span>Change Photo</span>
              </label>
              <input id="avatar-upload" type="file" @change="handleAvatarUpload" accept="image/*" class="file-input"/>
            </div>
          </div>
          <div class="avatar-info">
            <h3>Profile Picture</h3>
            <p>Upload a clear photo of yourself</p>
          </div>
        </div>
      </div>

      <div class="form-container">
        <div class="form-grid">
          <div v-for="question in profileQuestions" :key="question.id" class="form-group">
            <label :for="question.id" class="form-label">
              <span class="label-icon">{{ question.icon }}</span>
              {{ question.label }}
            </label>
            <div class="input-container">
              <input
                  v-if="question.type !== 'select' && question.type !== 'date'"
                  :type="question.type"
                  :id="question.id"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  class="form-input"
              />
              <input
                  v-else-if="question.type === 'date'"
                  type="date"
                  :id="question.id"
                  v-model="form[question.id]"
                  class="form-input date-input"
              />
              <select
                  v-else-if="question.type === 'select'"
                  :id="question.id"
                  v-model="form[question.id]"
                  class="form-select"
              >
                <option disabled value="">Choose {{ question.label.toLowerCase() }}</option>
                <option v-for="option in question.options" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary">Cancel</button>
          <button type="button" @click="saveChanges" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.create-admin-profile-form {
  background: var(--primary-bg);
  max-width: 1280px;
  margin: 0 auto;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

  @media (min-width: 768px) {
    padding: 0 20px;
  }
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  height: 80px;
  width: calc(100% - 40px);
  margin: 0 20px;

  @media (min-width: 768px) {
    width: calc(100% - 20px);
    margin: 0 auto;
  }

  .form-title {
    font-size: var(--body-text);
    font-weight: normal;
    color: var(--secondary-text-color);
  }

  .title-line {
    flex-grow: 1;
    height: 2px;
    background-color: var(--secondary-text-color);
  }

  @media (min-width: 768px) {

    .header-content {
      width: 100%;
      margin: 0;
      gap: 0;
    }

    .form-title {
      font-size: var(--heading-3);
      min-width: 300px;
    }
  }
}

.form-body {
  display: grid;
  grid-template-columns: 1fr;
  background: var(--card-bg);
  border-radius: 12px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 3fr;
    gap: 20px;
  }

}

.profile-section {
  padding: 1.5rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    padding: 2.5rem;
  }

  .avatar-container {
    display: block;
    align-content: center;
    text-align: center;

    .avatar-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      align-content: center;
      margin: 20px auto;

      .avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .avatar-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }

        .upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          gap: 0.5rem;
          font-size: 0.75rem;
        }

        .file-input {
          display: none;
        }
      }
    }

    .avatar-info {
      h3 {
        font-size: var(--body-text);
        margin: 0;
        color: var(--primary-text-color);
      }

      p {
        color: var(--secondary-text-color);
        font-size: var(--small-text);
        margin: 10px;
        line-height: 1;
      }
    }
  }
}

.form-container {
  padding: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px 20px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: var(--body-text);
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    height: 36px;
  }

  .input-container {
    position: relative;
  }

  .form-input,
  .form-select {
    width: 100%;
    height: 36px;
    padding: 10px 15px;
    border-radius: 6px;
    font-size: var(--body-text);
    background: var(--input-field-bg);
    border: none;
    transition: var(--transition);

    &:focus {
      outline: none;
      border-color: var(--secondary-text-color);
    }

    &::placeholder {
      color: var(--secondary-text-color);
    }
  }

  .form-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
    background-position: right 1rem center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    padding-right: 3rem;
    cursor: pointer;
  }

  .date-input {
    cursor: pointer;
  }

}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: flex-end;
  }
}

.btn-primary,
.btn-secondary {
  padding: 10px 15px;
  height: 36px;
  border-radius: 6px;
  font-size: var(--text-button-Text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100px;

  @media (min-width: 768px) {
    width: auto;
    min-width: 100px;
  }
}

.btn-primary {
  background: var(--button-bg);
  color: var(--primary-text-color);
  border: none;
  outline: none;
  transition: var(--transition);

  &:hover {
    background: var(--hover-button-bg);
  }
}

.btn-secondary {
  background: var(--cancel-button-bg);
  color: var(--primary-text-color);
  border: none;
}

</style>
