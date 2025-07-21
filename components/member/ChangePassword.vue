<script setup>

import {reactive, watch} from 'vue';
import {z} from 'zod';
import {useRoute} from 'vue-router'

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

const formSchema = z.object({
  "old_password": z
      .string(),
  "new_password": z
      .string(),
  "confirm_password": z
      .string()
      .refine(value => value === form["new_password"], "Passwords must match"),
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

const route = useRoute()

const settingLinks = ref([
  {
    link: "/member/edit-profile",
    title: "Edit Profile",
    icon: "mdi-account",
  },
  {
    link: "/member/change-password",
    title: "Change Password",
    icon: "mdi-lock",
  }
])

</script>

<template>

  <section>
    <h2>Account Settings</h2>

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


  </section>

  <section class="profile-member-container">

    <div class="profile-header">
      <div class="avatar-wrapper">
        <img class="avatar-img" src="/images/user-icon.png" alt="Profile Picture"/>
      </div>
      <div class="user-info">
        <p>User ID : <span>KM2025</span></p>
        <p>Email: <span>mohammed@gmail.com</span></p>
      </div>
    </div>

    <div class="profile-info">

      <div class="change-password-from-container">
        <form @submit.prevent="handleSubmit">
          <div
              v-for="(question, index) in AdminPasswordQuestions"
              :key="index"
              class="form-group"
          >
            <div class="form-control">
              <label class="question-title" :for="question.id">
                {{ question.label }}:
              </label>
              <input
                  v-if="question.type === 'text' || question.type === 'password'"
                  :type="question.type"
                  v-model="form[question.id]"
                  :placeholder="question.placeholder"
                  :id="question.id"
              />
              <span v-if="errors[question.id]" class="error">
                {{ errors[question.id] }}
              </span>
            </div>
          </div>

          <div class="btn-wrapper">
            <button type="" class="cancel-btn">Cancel</button>
            <button type="submit" class="submit-btn">Save Changes</button>
          </div>

        </form>

      </div>

    </div>
  </section>
</template>

<style scoped lang="scss">

section {
  margin: 0 auto;

  h2 {
    font-size: var(--heading-3);
    color: var(--secondary-text-color);
    height: 50px;
    font-weight: normal;
    align-content: center;
    margin: 0 20px;
  }

  .setting-tabs {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    margin: 0 auto;

    .setting-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .setting-link {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        height: 48px;
        box-sizing: border-box;
        border: 1px solid var(--accent-color);
        color: var(--primary-text-color);
        text-align: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
        text-decoration: none;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          height: 3px;
          width: 100%;
          background-color: transparent;
          transition: var(--transition);
        }

        &:hover::before,
        &.active::before {
          background-color: var(--accent-color);
        }

        &.active {
          background-color: var(--accent-color-light);
        }
      }
    }

    @media (min-width: 768px) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      gap: 0;

      .setting-container {
        flex-direction: row;

        .setting-link {
          width: 160px;
        }
      }
    }
  }

}

.profile-member-container {
  min-height: 100vh;
  width: calc(100% - 40px);
  margin: 0 20px;
  display: grid;


  @media (min-width: 768px) {
    grid-template-columns:  1fr 3fr;
    gap: 20px;
  }

  @media (min-width: 1024px) {
    max-width: 1280px;
    grid-template-columns:  1fr 3fr;
    gap: 20px;
  }

  .profile-header {
    background: var(--card-bg);
    padding: 1rem;
    max-height: 300px;

    .avatar-wrapper {
      width: 150px;
      height: 150px;
      margin: 10px auto;

      .avatar-img {
        width: 150px;
        height: 150px;
        border-radius: 50%;
      }
    }

    .user-info {
      flex: 1;
      width: 100%;
      margin: 0 auto;

      p {
        margin: 10px 0;
        color: var(--primary-text-color);

        span {
          color: var(--secondary-text-color);
        }
      }
    }
  }

  .profile-info {

    .change-password-from-container {
      margin: 20px auto;
      display: flex;
      flex-direction: column;
      padding: 10px;
      border-radius: 10px;

      form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        label {
          font-size: var(--label-font-size);
          color: var(--primary-text-color);
          font-weight: 500;
          height: 48px;
          align-content: center;
        }

        .form-control {
          display: flex;
          flex-direction: column;

          @media (min-width: 768px) {
            display: grid;
            grid-template-columns: 200px 1fr;
          }

          input {
            height: 48px;
            padding: 0 14px;
            border: none;
            border-radius: 6px;
            background-color: var(--input-field-bg);
            color: var(--primary-text-color);
            font-size: 1rem;
            transition: border-color 0.2s;

            &:focus {
              border-color: var(--primary-color);
              outline: none;
            }
          }

          .error {
            color: red;
            font-size: 0.85rem;
            margin-top: 4px;
          }
        }
      }

      .btn-wrapper {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        flex-wrap: wrap;

        button {
          width: 100%;
          max-width: 140px;
          height: 48px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition);
        }

        .cancel-btn {
          background-color: var(--cancel-button-bg);
          color: var(--primary-text-color);
        }

        .cancel-btn:hover {
          background-color: var(--button-disabled-bg);
          color: var(--secondary-text-color);
        }

        .submit-btn {
          background-color: var(--button-bg);
          color: var(--primary-text-color);
        }

        .submit-btn:hover {
          background-color: var(--button-disabled-bg);
          color: var(--secondary-text-color);
        }
      }

      // Tablet and desktop
      @media (min-width: 768px) {
        .form-group {

          label {
            width: 100%;
            height: 48px;
            text-align: start;
          }

          .form-control {
            width: 100%;
          }
        }
      }
    }
  }

  @media (min-width: 768px) {
    .form-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .avatar-wrapper {
      width: 150px;
      height: 150px;
    }
  }

  @media (min-width: 1024px) {
    .form-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>
