<script setup>
import {defineEmits, defineProps} from 'vue'

defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'confirm'])

const closePopup = () => {
  emit('close')
}

const confirmDelete = () => {
  emit('confirm')
}


</script>

<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup-container">
      <div class="popup-body">
        <div class="icon-wrapper">
          <UIcon name="mdi-alert-circle" class="warning-icon"/>
        </div>
        <h3 class="popup-title">Delete Administrator</h3>
        <p class="popup-message">
          Are you sure you want to delete this administrator? This action cannot be undone.
        </p>
        <div class="popup-actions">
          <button class="btn-cancel" @click="closePopup">Cancel</button>
          <button class="btn-delete" @click="confirmDelete">Delete</button>
        </div>
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
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .popup-message {
        font-size: var(--body-text);
        color: var(--secondary-text-color);
        line-height: 1.5;
        margin: 0;
      }

      .popup-actions {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;

        button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          height: 36px;
          font-size: var(--body-text);
          color: var(--primary-text-color);
          border: none;
          border-radius: 6px;
          transition: var(--transition);
        }

        .btn-cancel {
          background-color: var(--cancel-button-bg);

          &:hover {
            background-color: var(--cancel-hover-button-bg);
          }

        }

        .btn-delete {
          background-color: var(--danger-color);
          color: var(--primary-text-color);

          &:hover {
            background-color: var(--danger-color-hover);
          }

        }

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
