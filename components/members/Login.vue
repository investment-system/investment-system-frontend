<script setup lang="ts">
import {ref} from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = () => {
  error.value = ''
  loading.value = true

  setTimeout(() => {
    loading.value = false
    if (email.value === 'admin@example.com' && password.value === 'password') {
      alert('Login successful!')
    } else {
      error.value = 'Invalid email or password.'
    }
  }, 1000)
}


</script>

<template>
  <section class="login-container">
    <div class="container">
      <div class="login-form">
        <h2>Welcome back to Koperasi Masjid</h2>

        <form @submit.prevent="handleLogin">
          <label for="email">Email</label>
          <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="Enter your email"
          />

          <label for="password">Password</label>
          <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="Enter your password"
          />

          <p class="error" v-if="error">{{ error }}</p>

          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
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
.login-container {
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

  .login-form {
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
        height: 48px;
        margin: 0 auto;
        display: flex;
        align-items: center;
      }

      input {
        padding: 15px;
        background-color: var(--input-field-bg);
        border-radius: 8px;
        border: none;
        font-size: var(--font-size-small);
        transition: border-color 0.3s;
        width: 100%;
        max-width: 350px;
        height: 48px;
        margin: 0 auto;
      }

      .error {
        color: var(--error-text);
        font-size: var(--small-font-size);
        margin-bottom: 15px;
        text-align: center;
      }

      button {
        background-color: var(--button-bg);
        color: var(--primary-text-color);
        padding: 10px;
        border: none;
        border-radius: 8px;
        font-size: var(--text-button-Text);
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        max-width: 350px;
        height: 48px;
        margin: 48px auto 0 auto;
        transition: var(--transition);

        &:disabled {
          background-color: var(--button-disabled-bg);
          cursor: not-allowed;
          color: var(--primary-text-hover);
        }
      }
    }
  }

  .login-btn:hover {
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

    .login-form,
    .image-container {
      width: 100%;
      max-width: 100%;
      height: auto;
    }

    .login-form h2,
    .login-form form label,
    .login-form form input,
    .login-form form button,
    .image-container h3 {
      width: 90%;
    }

    .login-form h2,
    .image-container h3 {
      margin: 20px auto;
    }

    .image-container img {
      max-width: 90%;
    }
  }

  @media (max-width: 480px) {

    .login-container {
      align-items: center;
      background: var(--primary-bg) !important;
      padding: 0;
    }

    .image-container h3 {
      font-size: var(--Body-Text);
    }
  }
}


@media (max-width: 899px) {

  .login-container {
    align-items: center;
    background: var(--primary-bg) !important;
    padding: 0;
  }
}
</style>
