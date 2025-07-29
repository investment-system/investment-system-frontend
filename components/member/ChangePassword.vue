<script setup>

import {z} from 'zod';
import {ref, reactive, watch} from 'vue';
import {useRoute} from 'vue-router'

const route = useRoute()
const settingLinks = ref([
  {
    link: "/member/profile",
    title: "Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/profile/edit",
    title: "Edit Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/auth/change-password",
    title: "Change Password",
    icon: "mdi-lock",
  }
])

const AdminPasswordQuestions = [
  {
    label: "Current Password",
    type: "password",
    placeholder: "Enter Current Password",
    id: "old_password",
  },
  {
    label: "New Password",
    type: "password",
    placeholder: "Enter New Password",
    id: "new_password"
  },
  {
    label: "Confirm New Password",
    type: "password",
    placeholder: "Confirm New Password",
    id: "confirm_password"
  },
];

const formSchema = z
    .object({
      old_password: z.string().min(1, "Current password is required"),
      new_password: z.string().min(6, "New password must be at least 6 characters"),
      confirm_password: z.string().min(1, "Please confirm your new password"),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: "Passwords must match",
      path: ["confirm_password"], // specify error path
    });

const form = reactive({});
const errors = reactive({});

AdminPasswordQuestions.forEach((question) => {
  form[question.id] = "";
  errors[question.id] = "";
});

function validateField(field) {
  try {
    formSchema.shape[field].parse(form[field]);
    errors[field] = "";
  } catch (error) {
    errors[field] = error.errors ? error.errors[0].message : error.message;
  }
}

AdminPasswordQuestions.forEach((question) => {
  watch(
      () => form[question.id],
      () => validateField(question.id)
  );
});

let {$axios} = useNuxtApp()
const api = $axios

const resetForm = () => {
  AdminPasswordQuestions.forEach(({ id }) => {
    form[id] = "";
    errors[id] = "";
  });
};


const handleSubmit = async () => {
  try {
    const response = await api.post(`/`, form);

    console.log('Success:', response.data);
    alert("Password changed successfully");
    location.reload();
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      alert("Password change failed: " + (error.response.data.detail || "Please check your input."));
    } else {
      alert("Password change failed: " + error.message);
    }
  }
};


</script>

<template>

  <section>

    <div class="setting-tabs">
      <div class="setting-container" v-for="settingLink in settingLinks" :key="settingLink.link">
        <nuxt-link
            :to="settingLink.link"
            class="setting-link"
            :class="{ active: route.path.includes(settingLink.link.toLowerCase()) }"
        >
          <UIcon :name="settingLink.icon"/>
          {{ settingLink.title }}
        </nuxt-link>
      </div>
    </div>

    <div class="security-question-form">
      <div class="form-header">
        <h2>Change Security Questions</h2>
      </div>

      <form @submit.prevent="onSubmit" novalidate>
        <div class="form-grid">
          <div
              class="form-group"
              v-for="(field, index) in AdminPasswordQuestions"
              :key="index"
          >
            <label :for="field.name">{{ field.label }}</label>
            <input
                :id="field.id"
                :name="field.id"
                v-model="form[field.id]"
                :placeholder="field.placeholder"
                :type="field.type"
                :class="{ 'input-error': errors[field.id] }"
            />
            <span v-if="errors[field.id]" class="error-message">{{ errors[field.id] }}</span>

            <span v-if="errors[field.name]" class="error-message">
            {{ errors[field.name] }}
          </span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-submit">Submit</button>
          <button type="button" class="btn btn-cancel" @click="resetForm">
            Cancel
          </button>
        </div>
      </form>
    </div>

  </section>

</template>

<style scoped lang="scss">

section {
  width: calc(100% - 40px);
  margin: 20px auto;
  border-radius: 12px;
  height: 100vh;

  .setting-tabs {
    display: grid;
    grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));
    padding: 20px;
    gap: 10px;
    background: var(--card-bg);
    border-radius: 12px 12px 0 0;

    @media (min-width: 1024px) {
      display: flex;
      gap: 20px;
      margin: 0 auto;
    }

    .setting-link {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      color: var(--secondary-text-color);
      text-decoration: none;
      transition: var(--transition);

      &::after {
        content: "";
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 100%;
        height: 3px;
        background-color: transparent;
        transition: var(--transition);

      }

      &:hover {
        color: var(--accent-color);
        border-color: var(--accent-color);

        &::after {
          background-color: var(--accent-color);
        }
      }

      &.active {
        color: var(--accent-color);
        border-color: var(--accent-color);

        &::after {
          background-color: var(--accent-color);
        }
      }
    }
  }

  .security-question-form {
    padding: 20px;
    background: var(--card-bg);

    .form-header {
      margin-bottom: 20px;

      h2 {
        font-size: var(--heading-3);
        font-weight: 600;
        color: var(--primary-text-color);
      }
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;

      label {
        font-weight: 500;
        height: 36px;
        align-content: center;
      }

      input {
        padding: 0.6rem 0.8rem;
        border: 2px solid var(--secondary-text-color);
        border-radius: 6px;
        font-size: var(--placeholder-text);
        transition: border-color 0.2s;
        height: 36px;
        align-content: center;

        &:focus {
          border-color: var(--accent-color);
          outline: none;
        }

        &.input-error {
          border-color: var(--danger-color);
        }
      }

      .error-message {
        color: var(--danger-color);
        font-size: var(--small-text);
        margin-top: 0.25rem;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;

      .btn {
        padding: 0.6rem 1.2rem;
        border-radius: 6px;
        font-weight: 500;
        font-size: 1rem;
        cursor: pointer;
        border: none;
        transition: background-color 0.2s;
      }

      .btn-submit {
        background-color: var(--button-bg);

        &:hover {
          background-color: var(--hover-button-bg);
        }
      }

      .btn-cancel {
        background-color: var(--cancel-button-bg);

        &:hover {
          background-color: var(--cancel-hover-button-bg);
        }
      }
    }

    @media (min-width: 768px) {
      .form-grid {
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1.5rem;

        .form-group {
          flex: 1 1 45%;
        }
      }

      .form-actions {
        justify-content: flex-start;
      }
    }
  }

}
</style>
