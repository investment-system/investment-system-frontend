<script setup>

import {z} from 'zod';
import {ref, reactive, watch} from 'vue';
import {useRoute} from 'vue-router'

const route = useRoute()

const settingLinks = ref([
  {
    link: "/administrators/profile",
    title: "Profile",
    icon: "mdi-account",
  },
  {
    link: "/administrators/profile/edit",
    title: "Edit Profile",
    icon: "mdi-account",
  },
  {
    link: "/administrators/auth/change-password",
    title: "Change Password",
    icon: "mdi-lock",
  },
])

const MemberPasswordQuestions = [
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

MemberPasswordQuestions.forEach((question) => {
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

MemberPasswordQuestions.forEach((question) => {
  watch(
      () => form[question.id],
      () => validateField(question.id)
  );
});

let {$axios} = useNuxtApp()
const api = $axios

const resetForm = () => {
  MemberPasswordQuestions.forEach(({id}) => {
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

    <header>
    </header>

    <div class="security-question-form">

      <h4>Password</h4>
      <p>Change your password here. After saving, you'll be logged out.</p>

      <form @submit.prevent="onSubmit" novalidate>
        <div class="form-grid">
          <div
              class="form-group"
              v-for="(field, index) in MemberPasswordQuestions"
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
          <button type="button" class="btn btn-cancel" @click="resetForm">
            Cancel
          </button>
          <button type="submit" class="btn btn-submit">Submit</button>
        </div>
      </form>
    </div>

  </section>

</template>

<style scoped lang="scss">

section {
  width: calc(100% - 40px);
  margin: 20px auto;
  height: 100vh;

  .setting-tabs {
    display: grid;
    grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));
    padding: 10px;
    gap: 10px;
    background: var(--card-bg);
    justify-content: start;
    border-radius: 12px;
    margin-bottom: 20px;
    width: auto;

    @media (min-width: 768px) {
      width: fit-content;
    }

    @media (min-width: 1024px) {
      display: flex;
      gap: 20px;
      width: fit-content;
    }

    .setting-link {
      display: flex;
      align-items: center;
      text-align: start;
      gap: 0.5rem;
      padding: 10px 15px;
      font-size: var(--body-text);
      color: var(--primary-text-color);
      text-decoration: none;
      transition: var(--transition);
      border-radius: 6px;

      &:hover {
        background-color: var(--card-hover);
        color: var(--primary-text-color);
        z-index: 1000;
      }

      &.active {
        background-color: var(--card-hover);
        color: var(--primary-text-color);
      }
    }

  }

  .security-question-form {
    max-width: 600px;
    margin: 0 auto;
    padding:25px;
    border-radius: 12px;
    border: 1px solid var(--card-border);

    h4{
      font-weight: 500;
      color: var(--primary-text-color);
      font-size: var(--body-text);
      margin: 10px 0;
    }

    p {
      font-size: var(--small-text);
      color: var(--secondary-text-color);
      margin-bottom: 30px;
    }

  }

  form {
    display: flex;
    flex-direction: column;
    gap: 25px;
    width: 100%;

    .form-grid {
      display: grid;
      grid-template-columns: 1fr;
      flex-direction: column;
      gap: 20px 0;

      @media (min-width: 768px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;

      label {
        font-weight: 500;
        height: 36px;
        align-content: center;
        font-size: var(--large-text);
      }

      input {
        padding: 0.6rem 0.8rem;
        border-radius: 6px;
        font-size: var(--placeholder-text);
        transition: border-color 0.2s;
        height: 36px;
        align-content: center;
        border: none;
        outline: none;
        background-color: var(--card-bg);

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
        gap: 10px 20px;

        .form-group {
          flex: 1 1 45%;
        }
      }

      .form-actions {
        justify-content: flex-end;
      }
    }
  }

}
</style>
