<script setup lang="ts">
import {reactive, ref} from 'vue'
import {z} from 'zod'
import { useApi } from '~/composables/useApi'
import { useCookie } from '#app'

const api = useApi()
const showPassword = ref(false)

const loginQuestions = [
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validation: z.string().email({message: 'Please enter a valid email address'})
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    validation: z.string().min(2, {message: 'Password must be at least 6 characters'})
  }
]

const loginSchema = z.object(
    Object.fromEntries(loginQuestions.map(question => [question.id, question.validation]))
)

const form = reactive(Object.fromEntries(loginQuestions.map(question => [question.id, ''])))
const fieldErrors = ref<Record<string, string>>({})
const generalError = ref('')
const loading = ref(false)

const handleLogin = async () => {
  fieldErrors.value = {}
  generalError.value = ''

  const result = loginSchema.safeParse(form)
  if (!result.success) {
    const formatted = result.error.format()
    for (const question of loginQuestions) {
      const error = formatted[question.id]?._errors?.[0]
      if (error) fieldErrors.value[question.id] = error
    }
    return
  }

  loading.value = true
  try {
    const { data } = await api.post('/auth/token/', {
      email: form.email,
      password: form.password,
    })

    // Support both simple token and JWT response structures
    const accessToken = data.access || data.token
    const refreshTokenValue = data.refresh || null
    const userType = data.user?.user_type || 'member'  // fallback to 'member'

    if (!accessToken) {
      throw new Error('Login response missing token information')
    }

    useCookie('token').value = accessToken
    useCookie('refreshToken').value = refreshTokenValue
    useCookie('role').value = userType

    if (userType === 'admin') {
      await navigateTo('/administrators/', { replace: true })
    } else {
      await navigateTo('/member/', { replace: true })
    }

  } catch (error: any) {
    if (error.response?.status === 401 || error.response?.status === 400) {
      generalError.value = 'Invalid email or password.'
    } else {
      generalError.value = 'Something went wrong. Please try again later.'
    }
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <section class="login-container">
    <div class="container">
      <div class="login-form">

        <h2> Welcome to Koperasi Masjid</h2>

        <form @submit.prevent="handleLogin">
          <div v-for="question in loginQuestions" :key="question.id" class="form-field">
            <label :for="question.id">{{ question.label }}</label>

            <div v-if="question.id !== 'password'" class="input-wrapper">
              <input
                  :type="question.type"
                  :id="question.id"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :class="{ 'error-input': fieldErrors[question.id] }"
                  :aria-describedby="fieldErrors[question.id] ? `${question.id}-error` : undefined"
                  required
              />

            </div>

            <div v-else class="input-wrapper password-wrapper">

              <input
                  :type="showPassword ? 'text' : 'password'"
                  :id="question.id"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :class="{ 'error-input': fieldErrors[question.id] }"
                  :aria-describedby="fieldErrors[question.id] ? `${question.id}-error` : undefined"
                  required
              />

              <a
                  type="button"
                  class="toggle-password"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'"
                  :title="showPassword ? 'Hide password' : 'Show password'"
              >
                <UIcon
                    :name="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    class="eye-icon"
                />
              </a>

            </div>

            <p
                v-if="fieldErrors[question.id]"
                :id="`${question.id}-error`"
                class="error-message"
                role="alert"
            >
              {{ fieldErrors[question.id] }}
            </p>
          </div>

          <p v-if="generalError" class="error-message general-error" role="alert">
            {{ generalError }}
          </p>

          <div class="links">
            Don't have an account?
            <NuxtLink to="/member/auth/signup">Sign Up</NuxtLink>
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

      </div>

      <div class="image-container">

        <img src="/images/investment-icon.png" alt="investment" />

        <h3 class="text">
          Your trusted platform for secure and responsible Share.
        </h3>

      </div>
    </div>

  </section>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  min-height: 100vh;
  background: var(--linear-gradient-bg);
  padding: 40px 20px;

  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: var(--primary-bg);
    max-width: 1020px;
    margin: 0 auto;
    min-height: 500px;
    border-radius: 12px;
    gap: 20px;
    padding: 0;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .login-form {
    width: 100%;
    max-width: 480px;
    padding: 40px;

    h2 {
      text-align: center;
      font-size: var(--heading-2);
      font-weight: normal;
      color: var(--primary-text-color);
      width: 100%;
      max-width: 350px;
      margin: 20px auto;
    }

    form {
      display: flex;
      flex-direction: column;

      .form-field {
        position: relative;

        label {
          width: 100%;
          max-width: 350px;
          height: 36px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          font-size: var(--label-text);
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;

          input {
            display: block;
            padding: 16px;
            background-color: var(--input-field-bg);
            border-radius: 6px;
            border: none;
            font-size: var(--label-text);
            transition: border-color 0.3s;
            width: 100%;
            max-width: 350px;
            height: 36px;
            margin: 0 auto;
            outline: none;

            &::placeholder {
              color: var(--secondary-text-color);
              opacity: 0.7;
            }

            &:focus {
              border-color: var(--accent-color);
              background-color: var(--card-bg);
              box-shadow: 0 0 0 4px rgba(var(--accent-color-rgb), 0.1);
            }

            &.error-input {
              border-color: var(--danger-color);
              background-color: rgba(var(--danger-color-rgb), 0.05);
            }
          }

          .input-icon {
            position: absolute;
            left: 20px;
            color: var(--secondary-text-color);
            pointer-events: none;
            z-index: 2;
            font-size: var(--small-text);
            transition: var(--transition);
          }

          &:focus-within .input-icon {
            color: var(--accent-color);
          }

          &.password-wrapper {
            .toggle-password {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              background: none;
              cursor: pointer;
              padding: 12px;
              transition: var(--transition);
              border: none;
              outline: none;

              .toggle-icon-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;

                .eye-icon {
                  color: var(--secondary-text-color);
                  transition: var(--transition);
                }
              }
            }
          }
        }

        .error-message {
          color: var(--danger-color);
          font-size: var(--small-text);
          margin-top: 8px;
          display: flex;
          align-items: center;
          height: 36px;

          &::before {
            content: "";
            font-size: var(--small-text);
          }
        }
      }

      .general-error {
        color: var(--danger-color);
        font-size: var(--small-text);
        display: flex;
        align-items: center;
        height: 36px;
        width: 100%;
        max-width: 350px;
        margin: 0 auto;


      }

      .links {
        display: flex;
        width: 100%;
        max-width: 350px;
        gap: 5px;
        height: 36px;
        margin: 0 auto;
        align-items: center;
        justify-content: start;
        font-size: var(--text-button-small);
        color: var(--secondary-text-color);

        a {
          text-decoration: none;

          &:link:hover {
            text-decoration: underline;
          }

        }

      }

      .login-btn {
        background-color: var(--button-bg);
        color: var(--primary-text-color);
        padding: 10px;
        border: none;
        border-radius: 6px;
        font-size: var(--text-button-Text);
        cursor: pointer;
        width: 100%;
        max-width: 350px;
        height: 36px;
        margin: 0 auto;
        transition: var(--transition);

        &:hover {
          background: var(--hover-button-bg);
        }

        &:disabled {
          background: var(--button-disabled-bg);
          cursor: not-allowed;
          color: var(--secondary-text-color);
          transform: none;
          box-shadow: none;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top: 2px solid white;
          animation: spin 1s linear infinite;
        }
      }
    }
  }

  .image-container {
    width: calc(100% - 40px);
    margin: 0 auto;
    max-width: 480px;
    height: 460px;
    padding: 40px;
    text-align: center;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      max-width: 280px;
      height: auto;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    h3 {
      font-size: var(--heading-4);
      font-weight: 500;
      color: var(--primary-text-color);
      line-height: 1.5;
      margin: 0;
    }
  }

  // Responsive Design
  @media (max-width: 899px) {
    padding: 20px;

    .container {
      flex-direction: column;
      width: 100%;
      min-height: auto;
      gap: 0;
    }

    .login-form,
    .image-container {
      width: 100%;
      max-width: 100%;
      padding: 30px;
    }

    .image-container {
      height: auto;
      min-height: 300px;
    }
  }

  @media (max-width: 480px) {
    padding: 10px;
    background: var(--primary-bg);

    .container {
      box-shadow: none;
      border-radius: 0;
    }

    .login-form,
    .image-container {
      padding: 20px;
    }

    .login-form form .form-field .input-wrapper input {
      padding: 14px 44px 14px 44px;
    }

    .image-container h3 {
      font-size: var(--body-text);
    }
  }
}

// Animations
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>