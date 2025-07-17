<script setup>
import {ref, computed} from 'vue'
import {z} from 'zod'
import {countries, malaysiaStates, malaysiaBanks} from '@/constants/lists'

const form = ref({
  full_name: '',
  ic_number: '',
  gender: '',
  date_of_birth: '',
  phone_number: '',
  country: '',
  address_line: '',
  city: '',
  state: '',
  bank_name: '',
  account_holder_name: '',
  bank_account_number: '',
})

const avatarUrl = ref('/default-avatar.png')

function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (file) {
    avatarUrl.value = URL.createObjectURL(file)
  }
}

const userCountriesInput = ref('')
const filteredCountries = computed(() => {
  if (!userCountriesInput.value) return countries
  return countries.filter(c =>
      c.label.toLowerCase().startsWith(userCountriesInput.value.toLowerCase())
  )
})

const userMalaysiaStatesInput = ref('')
const filteredMalaysiaStates = computed(() => {
  if (!userMalaysiaStatesInput.value) return malaysiaStates
  return malaysiaStates.filter(s =>
      s.label.toLowerCase().startsWith(userMalaysiaStatesInput.value.toLowerCase())
  )
})

const userMalaysiaBanksInput = ref('')
const filteredMalaysiaBanks = computed(() => {
  if (!userMalaysiaBanksInput.value) return malaysiaBanks
  return malaysiaBanks.filter(b =>
      b.label.toLowerCase().startsWith(userMalaysiaBanksInput.value.toLowerCase())
  )
})

const profileQuestions = computed(() => [
  {
    id: 'full_name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'e.g. Ahmad bin Ali',
    validation: z.string().min(1, {message: 'Full Name is required'}),
  },
  {
    id: 'ic_number',
    label: 'IC Number / MyKad',
    type: 'text',
    placeholder: 'e.g. 900101-01-1234',
    validation: z.string().min(1, {message: 'IC Number is required'}),
  },
  {
    id: 'gender',
    label: 'Gender',
    type: 'select',
    options: [
      {value: 'male', label: 'Male'},
      {value: 'female', label: 'Female'},
    ],
    placeholder: 'Select your gender',
    validation: z.string().min(1, {message: 'Gender is required'}),
  },
  {
    id: 'date_of_birth',
    label: 'Date of Birth',
    type: 'date',
    placeholder: '',
    validation: z.string().min(1, {message: 'Date of Birth is required'}),
  },
  {
    id: 'phone_number',
    label: 'Phone Number',
    type: 'text',
    placeholder: 'e.g. 012-3456789',
    validation: z.string().min(1, {message: 'Phone Number is required'}),
  },
  {
    id: 'country',
    label: 'Country',
    type: 'select',
    options: filteredCountries.value,
    placeholder: 'your country',
    validation: z.string().min(1, {message: 'Country is required'}),
  },
  {
    id: 'address_line',
    label: 'Address Line',
    type: 'text',
    placeholder: 'e.g. Taman Bukit Indah',
    validation: z.string().min(1, {message: 'Address is required'}),
  },
  {
    id: 'city',
    label: 'City',
    type: 'text',
    placeholder: 'e.g. Shah Alam',
    validation: z.string().min(1, {message: 'City is required'}),
  },
  {
    id: 'state',
    label: 'State',
    type: 'select',
    options: filteredMalaysiaStates.value,
    placeholder: 'your Malaysia State',
    validation: z.string().min(1, {message: 'State is required'}),
  },
  {
    id: 'bank_name',
    label: 'Bank Name',
    type: 'select',
    options: filteredMalaysiaBanks.value,
    placeholder: 'your bank name',
    validation: z.string().min(1, {message: 'Bank Name is required'}),
  },
  {
    id: 'account_holder_name',
    label: 'Account Holder Name',
    type: 'text',
    placeholder: 'e.g. Ahmad bin Ali',
    validation: z.string().min(1, {message: 'Account Holder Name is required'}),
  },
  {
    id: 'bank_account_number',
    label: 'Bank Account Number',
    type: 'text',
    placeholder: 'e.g. 158769432112',
    validation: z.string().min(1, {message: 'Bank Account Number is required'}),
  },
])

function saveChanges() {
  console.log('Saving changes:', form.value)
}

</script>

<template>
  <section class="profile-form">
    <div class="profile-header">
      <div class="avatar-wrapper">
        <label for="avatar-upload">
          <img class="avatar-img" src="/images/user-icon.png" alt="Profile Picture"/>
        </label>
        <input id="avatar-upload" type="file" @change="handleAvatarUpload" accept="image/*"/>
      </div>
      <div class="user-info">
        <p>User ID : <span>KM2025</span></p>
        <p>Email Address: <span>mohammed@gmail.com</span></p>
      </div>
    </div>

    <div class="form-grid">
      <template v-for="question in profileQuestions" :key="question.id">
        <div class="profile-question-container">
          <label :for="question.id">{{ question.label }}</label>

          <input
              v-if="question.type !== 'select' && question.type !== 'date'"
              :type="question.type"
              :id="question.id"
              v-model="form[question.id]"
              :placeholder="question.placeholder"
          />

          <input
              v-else-if="question.type === 'date'"
              type="date"
              :id="question.id"
              v-model="form[question.id]"
          />

          <select
              v-else-if="question.type === 'select'"
              :id="question.id"
              v-model="form[question.id]"
          >
            <option disabled value="">Select {{ question.placeholder }}</option>
            <option v-for="option in question.options" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </template>
    </div>

    <div class="form-actions">
      <button @click="saveChanges">Save Change</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile-form {
  width: calc(100% - 40px);
  margin: 20px auto 0 auto;


  .profile-header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin: 20px auto;
    background: var(--card-bg);
    padding: 1rem;
    border-radius: 12px;

    .avatar-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
      margin-left: 0;

      label {
        cursor: pointer;
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        border: 2px solid var(--border-color, #ccc);
        overflow: hidden;
        transition: transform 0.3s ease;

        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }

      input[type='file'] {
        display: none;
      }
    }

    .user-info {
      flex: 1;
      min-width: 200px;

      p {
        margin: 10px 0;
        color: var(--primary-text-color);

        span {
          color: var(--secondary-text-color);
        }
      }
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;

    .profile-question-container {
      display: flex;
      flex-direction: column;

      label {
        font-size: var(--body-text);
        color: var(--primary-text-color);
        height: 48px;
        width: 100%;
        margin: 0 auto;
      }

      input,
      select {
        width: 100%;
        margin: 0 auto;
        height: 48px;
        border-radius: 6px;
        font-size: var(--body-text);
        border: none;
        outline: none;
        background: var(--input-field-bg);
        padding: 0 0.75rem;
      }
    }
  }

  .form-actions {
    margin-top: 1.5rem;
    text-align: left;

    button {
      width: 100%;
      height: 48px;
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      color: var(--primary-text-color);
      background: var(--button-bg);
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: var(--hover-button-bg);
        color: var(--secondary-text-color);
      }

      @media (min-width: 768px) {
        width: 150px;
      }

      @media (min-width: 1024px) {
        width: 150px;
      }
    }
  }

  @media (min-width: 768px) {
    width: calc(100% - 40px);
    margin: 0 auto;

    .form-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px 20px;
    }

    .avatar-wrapper {
      width: 150px;
      height: 150px;
      margin-left: 20px;
    }
  }

  @media (min-width: 1024px) {
    width: calc(100% - 40px);
    margin: 0 auto;

    .form-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
