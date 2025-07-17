<script setup lang="ts">

const resendCode = () => {
  alert('Resend code triggered.');
}

</script>

<template>
  <section class="email-confirmation-container">
    <div class="container">

      <div class="email-confirmation-content">
        <h2>Check Your Email</h2>
        <p>We've sent a verification link to your email address.</p>
        <p>Please check your inbox and also your spam/junk folder, then click the link to verify your email.</p>
        <a class="resend-btn" @click="resendCode">Resend Code</a>
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

    a {
      font-size: var(--body-text);
      border: none;
      cursor: pointer;
      text-decoration: none;
      margin: 10px 0;
      height: 40px;
      color: var(--secondary-text-color);
      transition: var(--transition);

      &:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }
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