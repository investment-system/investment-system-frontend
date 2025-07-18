<script setup lang="ts">
import {ref} from 'vue'

const verificationCode = ref('')

const verifyCode = () => {
  if (!/^\d{5}$/.test(verificationCode.value)) {
    alert('Please enter a valid 5-digit code.')
    return
  }

  // Add actual verification logic here
  console.log('Verifying code:', verificationCode.value)
}

const resendCode = () => {
  // Trigger resend code logic
  console.log('Resending verification code...')
  alert('Verification code resent to your email.')
}
</script>

<template>
  <section class="email-confirmation-container">
    <div class="container">

      <div class="email-confirmation-content">
        <h2>Enter Verification Code</h2>
        <p>
          We've sent a verification code to your email. Please check your inbox and also your spam/junk folder.
          Enter the 5-digit code below to verify your identity.
        </p>
      </div>

      <div class="verification-code-form">
        <input
            id="verification-code"
            type="text"
            v-model="verificationCode"
            placeholder="Enter 5-digit code"
            class="form-input"
            maxlength="5"
            pattern="\d*"
            inputmode="numeric"
            required
        />
        <button
            @click="verifyCode"
            class="send-button"
        >
          Verify
        </button>
      </div>

      <div class="resend-code-text">
        Didn’t receive the code?
        <a href="#" @click.prevent="resendCode">Resend Code</a>
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
    max-height: 500px;
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
      margin: 10px 0;
    }
  }

  .verification-code-form {
    margin: 20px auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;

    input {
      width: 340px;
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

  .resend-code-text {
    margin: 15px auto;
    font-size: 0.95rem;
    color: var(--primary-text-color);

    a {
      margin-left: 5px;
      color: var(--link-color);
      cursor: pointer;
      text-decoration: underline;
    }
  }

  .image-container {
    margin-top: 20px;

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

    .verification-code-form {
      flex-direction: column;
      gap: 10px;

      input,
      button {
        width: 100%;
      }
    }

    .image-container img {
      max-width: 90%;
    }
  }
}
</style>
