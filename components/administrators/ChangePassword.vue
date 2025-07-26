<script setup>
import {reactive, watch } from 'vue';
import { z } from 'zod';

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

let { $axios } = useNuxtApp()
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


</script>

<template>
  <div class="settings-page">
    <div class="container">
      <main class="content">
        <h2>Change Admin Password</h2>
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
          <button type="submit" class="submit-btn">Save Changes</button>
        </form>
      </main>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  padding: 20px;
}

.container {
  display: flex;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
}

.content {
  flex: 3;
  background-color: var(--primary-bg);
  padding: 20px;
  border-radius: 1rem;
}

.content h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: var(--primary-text-color);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--secondary-text-color);
  border-radius: 5px;
  outline: none;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}

.submit-btn {
  padding: 10px 20px;
  background-color: var(--secondary-text-color);
  color: var(--primary-text-color);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: var(--secondary-text-color);
  color: var(--primary-text-color);
  transition: 0.3s ease-in-out;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    margin-bottom: 20px;
  }
}
</style>
