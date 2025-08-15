<script setup>
import { z } from 'zod'
import { ref, reactive, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useCookie } from '#app'
import PasswordUpdatedSuccess from "./popup/PasswordUpdatedSuccess.vue";
import PasswordUpdatedFailed from "./popup/PasswordUpdatedFailed.vue";

const showPasswordUpdatedSuccess = ref(false)
const showPasswordUpdatedFailed = ref(false)

const route = useRoute()
const router = useRouter()
const api = useApi()

const loading = ref(false)
const savedMessage = ref('')

const settingLinks = ref([
  { link: '/administrators/profile', title: 'Profile', icon: 'mdi-account' },
  { link: '/administrators/profile/edit', title: 'Edit Profile', icon: 'mdi-account' },
  { link: '/administrators/auth/change-password', title: 'Change Password', icon: 'mdi-lock' },
])

const MemberPasswordQuestions = [
  { label: 'Current Password', type: 'password', placeholder: 'Enter Current Password', id: 'old_password' },
  { label: 'New Password', type: 'password', placeholder: 'Enter New Password', id: 'new_password' },
  { label: 'Confirm New Password', type: 'password', placeholder: 'Confirm New Password', id: 'confirm_password' },
]

const formSchema = z.object({
  old_password: z.string()
      .min(8, 'Current password must be at least 8 characters')
      .regex(/[A-Z]/, 'Current password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Current password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Current password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Current password must contain at least one special character'),

  new_password: z.string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'New password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'New password must contain at least one special character'),

  confirm_password: z.string()
      .min(8, 'Please confirm your new password')
}).refine(data => data.new_password === data.confirm_password, {
  message: 'Passwords must match',
  path: ['confirm_password'],
})

const oldPasswordSchema = z.object({
  old_password: z.string()
      .min(8, 'Current password must be at least 8 characters')
      .regex(/[A-Z]/, 'Current password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Current password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Current password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Current password must contain at least one special character')
})

const newPasswordSchema = z.object({
  new_password: z.string()
      .min(8, 'New password must be at least 8 characters')
      .regex(/[A-Z]/, 'New password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'New password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'New password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'New password must contain at least one special character')
})

const confirmPasswordSchema = z.object({
  confirm_password: z.string()
      .min(8, 'Please confirm your new password')
})

const form = reactive({
  old_password: '',
  new_password: '',
  confirm_password: '',
})

const errors = reactive({
  old_password: '',
  new_password: '',
  confirm_password: '',
})

function validateField(field) {
  try {
    switch (field) {
      case 'old_password':
        oldPasswordSchema.parse({ old_password: form.old_password })
        errors.old_password = ''
        break
      case 'new_password':
        newPasswordSchema.parse({ new_password: form.new_password })
        errors.new_password = ''
        break
      case 'confirm_password':
        confirmPasswordSchema.parse({ confirm_password: form.confirm_password })
        errors.confirm_password = ''
        break
    }
  } catch (error) {
    errors[field] = error.errors ? error.errors[0].message : error.message
  }
}

MemberPasswordQuestions.forEach(q => {
  watch(() => form[q.id], () => validateField(q.id))
})

watch(
    () => [form.new_password, form.confirm_password],
    ([newPass, confirmPass]) => {
      if (confirmPass && newPass !== confirmPass) {
        errors.confirm_password = 'Passwords must match'
      } else if (errors.confirm_password === 'Passwords must match') {
        errors.confirm_password = ''
      }
    }
)

const hasErrors = computed(() => Object.values(errors).some(e => e !== ''))

const resetForm = () => {
  setTimeout(() => {
    location.reload()
  }, 2000)

}

const clearError = (field) => {
  errors[field] = ''
}

const handleSubmit = async () => {
  try {
    formSchema.parse(form)
  } catch (err) {
    if (err.errors) {
      err.errors.forEach(e => {
        errors[e.path[0]] = e.message
      })
    }
    return
  }

  loading.value = true
  savedMessage.value = ''

  try {
    const payload = {
      old_password: form.old_password,
      new_password: form.new_password
    }

    await api.patch('/auth/change-password/', payload, {
      headers: {
        Authorization: `Token ${useCookie('token').value}`,
        'Content-Type': 'application/json'
      }
    })

    showPasswordUpdatedSuccess.value = true

    setTimeout(() => {
      showPasswordUpdatedSuccess.value = false
      resetForm()
      useCookie('token').value = null
      useCookie('refreshToken').value = null
      useCookie('role').value = null
      router.push('/administrators/auth/login')
    }, 2000)

  } catch (error) {
    console.error('Password change error:', error)

    // Show failed popup
    showPasswordUpdatedFailed.value = true

    // Optional: auto-hide after 3 seconds
    setTimeout(() => {
      showPasswordUpdatedFailed.value = false
    }, 3000)
  } finally {
    loading.value = false
  }
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
          <UIcon :name="settingLink.icon" />
          {{ settingLink.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="security-question-form">
      <h4>Password</h4>
      <p>Change your password here. After saving, you'll be logged out.</p>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-grid">
          <div class="form-group" v-for="(field, index) in MemberPasswordQuestions" :key="index">
            <label :for="field.id">{{ field.label }}</label>
            <input
                :id="field.id"
                :name="field.id"
                v-model="form[field.id]"
                :placeholder="field.placeholder"
                :type="field.type"
                :class="{ 'input-error': errors[field.id] }"
                @focus="clearError(field.id)"
            />
            <span v-if="errors[field.id]" class="error-message">{{ errors[field.id] }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-cancel" @click="resetForm">Cancel</button>
          <button type="submit" class="btn btn-submit" :disabled="loading || hasErrors">
            {{ loading ? 'Saving...' : 'Submit' }}
          </button>

          <PasswordUpdatedSuccess
              :show="showPasswordUpdatedSuccess"
              @update:show="showPasswordUpdatedSuccess = $event"
          />
          <PasswordUpdatedFailed
              :show="showPasswordUpdatedFailed"
              @update:show="showPasswordUpdatedFailed = $event"
          />

        </div>

        <p v-if="savedMessage" class="success-message">{{ savedMessage }}</p>
      </form>
    </div>

  </section>
</template>


<style scoped lang="scss">

section {
  width: calc(100% - 40px);
  margin: 20px auto;
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

  .security-question-form {
    max-width: 600px;
    margin: 0 auto;
    padding:25px;
    border-radius: 12px;
    border: 1px solid var(--card-border);

    h4{
      font-weight: 500;
      color: var(--primary-text-color);
      font-size: var(--body-text);
      margin: 10px 0;
    }

    p {
      font-size: var(--small-text);
      color: var(--secondary-text-color);
      margin-bottom: 30px;
    }

  }

  form {
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 100%;

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      flex-direction: column;
      gap: 20px 0;

      @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;

      label {
        font-weight: 500;
        height: 36px;
        align-content: center;
        font-size: var(--large-text);
      }

      input {
        padding: 0.6rem 0.8rem;
        border-radius: 6px;
        font-size: var(--placeholder-text);
        transition: border-color 0.2s;
        height: 36px;
        align-content: center;
        border: none;
        outline: none;
        background-color: var(--card-bg);

        &:focus {
          border-color: var(--accent-color);
          outline: none;
        }

        &.input-error {
          border-color: var(--danger-color);
        }
      }

      .error-message {
        color: var(--danger-color);
        font-size: var(--small-text);
        margin-top: 0.25rem;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;

      .btn {
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        font-weight: 500;
        font-size: 1rem;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
      }

      .btn-submit {
        background-color: var(--button-bg);

        &:hover {
          background-color: var(--hover-button-bg);
        }
      }

      .btn-cancel {
        background-color: var(--cancel-button-bg);

        &:hover {
          background-color: var(--cancel-hover-button-bg);
        }
      }
    }

    @media (min-width: 768px) {
      .form-grid {
        gap: 10px 20px;

        .form-group {
          flex: 1 1 45%;
        }
      }

      .form-actions {
        justify-content: flex-end;
      }
    }
  }

}
</style>
