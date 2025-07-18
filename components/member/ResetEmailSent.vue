<script setup lang="ts">

import {ref} from 'vue'

const resendCode = ref('')

const sendResetCode = () => {
  if (!resendCode.value) {
    alert('Please enter your email address.')
    return
  }
  // Add actual logic to trigger the resend/reset API here
  console.log('Sending code to:', resendCode.value)
}

</script>

<template>
  <section class="email-confirmation-container">
    <div class="container">

      <div class="email-confirmation-content">
        <h2>Forgot Your Password?</h2>
        <p>Enter your email address below, and we'll send you a link to reset your password. Please check your inbox and
          also your spam/junk folder.</p>
      </div>
      <div class="resent-email-form">
        <input
            id="resend-email"
            type="email"
            v-model="resendCode"
            placeholder="Enter your email"
            class="form-input"
            required
        />
        <button
            @click="sendResetCode"
            class="send-button"
        >
          Send Reset Link
        </button>
      </div>
      <div class="image-container">
        <img src="/images/email-verification-icon.png" alt="Verification icon"/>
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
    align-content: center;
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
      height: 40px;
      margin: 10px 0;
    }

  }

  .resent-email-form {
    margin: 20px auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;

    input {
      width: 300px;
      height: 48px;
      background: var(--primary-bg);
      border: 0;
      border-radius: 6px;
      padding: 0 20px;
    }

    button {
      font-size: var(--body-text);
      background: var(--button-bg);
      color: var(--primary-text-color);
      height: 48px;
      width: 140px;
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


  .image-container {
    img {
      max-width: 300px;
      width: 100%;
      height: auto;
      border-radius: 12px;
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

    .resend-btn {
      width: 100%;
    }

    .image-container img {
      max-width: 90%;
    }
  }
}

</style>