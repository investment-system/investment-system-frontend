<script setup lang="ts">
import { reactive, ref } from 'vue'
import { z } from 'zod'

const signupQuestions = [
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    validation: z.string().email({ message: 'Please enter a valid email address' })
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    validation: z.string().min(6, { message: 'Password must be at least 6 characters' })
  },
  {
    id: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Re-enter your password',
    validation: z.string().min(6, { message: 'Confirm Password must be at least 6 characters' }) // base validation
  }
]

const signupSchema = z.object(
    Object.fromEntries(signupQuestions.map(question => [question.id, question.validation]))
)

const form = reactive(Object.fromEntries(signupQuestions.map(question => [question.id, ''])))
const fieldErrors = ref<Record<string, string>>({})
const generalError = ref('')
const loading = ref(false)

const handleLogin = () => {
  fieldErrors.value = {}
  generalError.value = ''

  console.log('Form values before validation:', JSON.stringify(form, null, 2)) // 👈

  const result = signupSchema.safeParse(form)

  if (!result.success) {
    console.log('Validation errors:', result.error.format())
    const formatted = result.error.format()
    for (const question of signupQuestions) {
      const error = formatted[question.id]?._errors?.[0]
      if (error) fieldErrors.value[question.id] = error
    }
    return
  }

  console.log('Validation passed! Proceeding with signup...') // 👈

  loading.value = true
  setTimeout(() => {
    loading.value = false
    if (form.email === 'admin@example.com' && form.password === 'password') {
      alert('Signup successful!')
    } else {
      alert('Signup not successful!')
      generalError.value = 'Invalid email or password.'
    }
  }, 1000)
}
</script>

<template>
  <section class="signup-container">
    <div class="container">
      <div class="signup-form">

        <h2>Welcome to Koperasi Masjid Members system</h2>

        <form @submit.prevent="handleLogin">
          <div v-for="question in signupQuestions" :key="question.id">
            <label :for="question.id">{{ question.label }}</label>
            <input
                :type="question.type"
                :id="question.id"
                v-model="form[question.id]"
                :placeholder="question.placeholder"
                required
            />
            <p class="error" v-if="fieldErrors[question.id]">{{ fieldErrors[question.id] }}</p>
          </div>

          <p class="error" v-if="generalError">{{ generalError }}</p>

          <div class="links">

            Already have an account
            <NuxtLink to="/member/auth/log-in">Login ?</NuxtLink>

          </div>

          <button type="submit" class="signup-btn" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Signup' }}
          </button>
        </form>

      </div>

      <div class="image-container">
        <img src="/images/investment-icon-png.png" alt="investment"/>
        <h3 class="text">
          Your trusted platform for secure and responsible Share.
        </h3>
      </div>
    </div>

  </section>
</template>

<style scoped lang="scss">
.signup-container {
  align-items: center;
  min-height: 100vh;
  background: var(--linear-gradient-bg);
  padding: 40px 0;

  .container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background: var(--primary-bg);
    max-width: 1020px;
    margin: 0 auto;
    height: 500px;
    border-radius: 50px;
    gap: 20px;
    padding: 0;
  }

  .signup-form {
    width: 100%;
    max-width: 480px;
    height: auto;

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

      label {
        width: 100%;
        max-width: 350px;
        height: 36px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        font-size: var(--label-text);
      }

      input {
        display: block;
        padding: 15px;
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
      }

      .error {
        color: var(--error-text);
        font-size: var(--label-text);
        margin-bottom: 15px;
        text-align: center;
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

      button {
        background-color: var(--button-bg);
        color: var(--primary-text-color);
        padding: 10px;
        border: none;
        border-radius: 6px;
        font-size: var(--text-button-Text);
        font-weight: 600;
        cursor: pointer;
        width: 100%;
        max-width: 350px;
        height: 36px;
        margin: 0 auto;
        transition: var(--transition);

        &:disabled {
          background-color: var(--button-disabled-bg);
          cursor: not-allowed;
          color: var(--primary-text-hover);
        }
      }
    }
  }

  .signup-btn:hover {
    background: var(--hover-button-bg);
    color: var(--primary-text-hover);
  }

  .image-container {
    display: block;
    background: var(--input-field-bg);
    width: 100%;
    max-width: 480px;
    height: 460px;
    margin: 0 auto;
    padding: 15px;
    text-align: center;
    border-radius: 25px;

    img {
      width: 100%;
      max-width: 350px;
      height: auto;
      border-radius: 12px;
      display: block;
      margin: 20px auto;
    }

    h3 {
      font-size: var(--heading-3);
      font-weight: normal;
      width: 100%;
    }
  }

  @media (max-width: 899px) {

    .container {
      flex-direction: column;
      padding: 0;
      width: 100%;
      height: 100%;
      margin: 40px 0;
    }

    .signup-form,
    .image-container {
      width: 100%;
      max-width: 100%;
      min-height: 450px;
      height: auto;
    }

    .signup-form h2,
    .signup-form form label,
    .signup-form form input,
    .signup-form form button,
    .image-container h3 {
      width: 90%;
    }

    .signup-form h2,
    .image-container h3 {
      margin: 20px auto;
    }

    .image-container img {
      max-width: 90%;
      margin: 30px auto;
    }
  }

  @media (max-width: 480px) {

    .signup-container {
      align-items: center;
      background: var(--primary-bg) !important;
      padding: 0;
    }

    .image-container h3 {
      font-size: var(--body-text);
    }
  }
}

@media (max-width: 899px) {

  .signup-container {
    align-items: center;
    background: var(--primary-bg) !important;
    padding: 0;
  }
}
</style>
