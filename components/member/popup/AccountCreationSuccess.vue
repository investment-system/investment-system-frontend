<script setup>
import {defineEmits, defineProps} from 'vue'

defineProps({
  show: Boolean
})

const emit = defineEmits(['update:show', 'continue'])

const closePopup = () => {
  emit('update:show', false)
}

</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <button class="close-btn" @click="closePopup" aria-label="Close">
        <UIcon name="mdi-close"/>
      </button>

      <div class="popup-body">
        <div class="icon-wrapper">
          <UIcon name="mdi-check-circle" class="success-icon"/>
        </div>

        <h3 class="popup-title">Welcome to Our Platform!</h3>

        <p class="popup-message">
          Your account has been created successfully! We’re excited to have you on board.
          Please check your registered email for setup guidelines and activation instructions.
        </p>

        <div class="qr-section">
          <div class="qr-content">
            <div class="qr-text">
              <h5>Complete Your Membership Activation</h5>
              <p>
                To activate your membership, please make a one-time RM 50 registration fee
                together with a minimum RM 250 investment.
                <br/>
                Simply scan the QR code below to make a secure bank transfer.
                Don’t forget to keep your payment receipt for confirmation.
              </p>
            </div>
            <div class="qr-code-wrapper">
              <img src="/images/Qr-code.png" alt="Bank Transfer QR Code" class="qr-code"/>
              <span class="qr-label">Scan & Pay</span>
            </div>
          </div>
        </div>

        <div class="footer-info">
          <p class="security-note">
            <UIcon name="mdi-shield-check" class="security-icon"/>
            Your account is protected with industry-standard encryption.
          </p>
          <p class="support-note">
            Need help? Contact our support team at
            <a href="mailto:support@koperasimasjid2u.com">support@koperasimasjid2u.com</a>.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
  padding: 16px;

  .popup-container {
    background-color: var(--primary-bg);
    border-radius: 12px;
    width: 100%;
    max-width: 550px;
    padding: 20px;
    text-align: center;
    position: relative;
    max-height: 700px;
    overflow-y: auto;

    .close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: var(--heading-3);
      color: var(--secondary-text-color);
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: var(--transition);

      &:hover {
        color: var(--primary-text-color);
        background-color: var(--card-bg);
      }
    }

    .popup-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;

      .icon-wrapper {
        background-color: #dff0d8;
        border-radius: 50%;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;

        .success-icon {
          font-size: 48px;
          color: var(--profit-color);
        }
      }

      .popup-title {
        font-size: var(--heading-4);
        color: var(--primary-text-color);
        margin: 0;
      }

      .popup-message {
        font-size: var(--body-text);
        color: var(--secondary-text-color);
        line-height: 1.5;
        margin: 0;
      }

      .qr-section {
        width: 100%;
        background-color: var(--card-bg);
        border-radius: 12px;
        padding: 20px;
        border: 1px solid var(--card-border);

        .qr-content {
          display: flex;
          align-items: center;
          gap: 20px;
          justify-content: space-between;

          .qr-text {
            flex: 1;
            text-align: center;

            h5 {
              font-size: var(--body-text);
              font-weight: 600;
              color: var(--primary-text-color);
              margin: 0 0 8px 0;
            }

            p {
              font-size: var(--small-text);
              color: var(--secondary-text-color);
              margin: 0;
              line-height: 1.4;
            }
          }

          .qr-code-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;

            .qr-code {
              width: 90px;
              height: 90px;
              border-radius: 6px;
              border: 1px solid var(--card-border);
            }

            .qr-label {
              font-size: 0.75rem;
              color: var(--secondary-text-color);
              font-weight: 500;
            }
          }
        }
      }

      .footer-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;

        .security-note {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--secondary-text-color, #6b7280);
          margin: 0;

          .security-icon {
            font-size: 14px;
            color: var(--profit-color, #22c55e);
          }
        }

        .support-note {
          font-size: 0.75rem;
          color: var(--secondary-text-color, #6b7280);
          margin: 0;
          text-align: center;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .popup-container {
    margin: 16px;
    padding: 20px;

    .action-buttons {
      flex-direction: column;

      .btn {
        min-width: unset;
      }
    }
  }
}

@media (min-width: 768px) {
  .popup-container {
    padding: 32px;
  }

  .popup-body .popup-title {
    font-size: 1.5rem;
  }

  .popup-body .popup-message {
    font-size: 1.125rem;
  }
}
</style>