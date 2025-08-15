
<script setup>
import { defineEmits, defineProps } from 'vue'

defineProps({ show: Boolean })
const emit = defineEmits(['update:show'])

const closePopup = () => emit('update:show', false)
</script>

<template>
  <div v-show="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-body">
        <div class="icon-wrapper">
          <UIcon name="mdi-alert-circle" class="error-icon" />
        </div>
        <h3 class="popup-title">Profile Update Failed</h3>
        <p class="popup-message">
          Something went wrong. Your profile could not be updated. Please try again.
        </p>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
.popup-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1002;
  padding: 16px;

  .popup-container {
    background-color: var(--primary-bg);
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    padding: 24px;
    text-align: center;

    .popup-body {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;

      .icon-wrapper {
        background-color: #f8d7da;
        border-radius: 50%;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;

        .error-icon {
          font-size: 48px;
          color: var(--danger-color);
        }
      }

      .popup-title {
        font-size: var(--heading-4);
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .popup-message {
        font-size: var(--body-text);
        color: var(--secondary-text-color);
        line-height: 1.5;
        margin: 0;
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
