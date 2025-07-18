<script setup lang="ts">
import { ref } from 'vue'

const newPassword = ref('')
const confirmPassword = ref('')

const setNewPassword = () => {
  if (!newPassword.value || !confirmPassword.value) {
    alert('Please fill in both password fields.')
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match.')
    return
  }

  if (newPassword.value.length < 6) {
    alert('Password must be at least 6 characters long.')
    return
  }

  // Add actual logic to set the password
  console.log('New password set:', newPassword.value)
  alert('Your password has been successfully updated.')
}
</script>

<template>
  <section class="email-confirmation-container">
    <div class="container">

      <div class="email-confirmation-content">
        <h2>Set New Password</h2>
        <p>
          Please enter your new password below and confirm it. Make sure it's something secure and memorable.
        </p>
      </div>

      <div class="verification-code-form">
        <input
            type="password"
            v-model="newPassword"
            placeholder="New Password"
            class="form-input"
            required
        />
        <input
            type="password"
            v-model="confirmPassword"
            placeholder="Confirm Password"
            class="form-input"
            required
        />
        <button
            @click="setNewPassword"
            class="send-button"
        >
          Set Password
        </button>
      </div>

    </div>
  </section>
</template>

<style scoped lang="scss">
.email-confirmation-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--primary-bg);
  padding: 20px;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--card-bg);
    max-width: 600px;
    width: 100%;
    padding: 40px 20px;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    text-align: start;
  }

  .email-confirmation-content {
    color: var(--primary-text-color);
    max-width: 500px;
    margin: 0 auto;

    h2 {
      font-size: var(--heading-2);
      height: 50px;
      font-weight: normal;
    }

    p {
      font-size: var(--body-text);
      margin: 10px 0;
    }
  }

  .verification-code-form {
    margin: 20px auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 400px;

    input {
      height: 48px;
      background: var(--primary-bg);
      border: none;
      border-radius: 6px;
      padding: 0 20px;
      font-size: var(--body-text);
    }

    button {
      font-size: var(--body-text);
      background: var(--button-bg);
      color: var(--primary-text-color);
      height: 48px;
      border: none;
      cursor: pointer;
      border-radius: 6px;
      transition: var(--transition);
    }

    button:hover {
      color: var(--secondary-text-color);
      background: var(--hover-button-bg);
    }

  }

  @media (max-width: 768px) {
    .container {
      padding: 30px 15px;
    }

    .email-confirmation-content h2 {
      font-size: 1.5rem;
    }

    .email-confirmation-content p {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 480px) {
    .email-confirmation-content h2 {
      font-size: 1.3rem;
    }

    .email-confirmation-content p {
      font-size: 0.9rem;
    }

    .verification-code-form {
      gap: 10px;

      input,
      button {
        width: 100%;
      }
    }
  }
}
</style>
