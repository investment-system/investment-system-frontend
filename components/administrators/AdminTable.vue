<script setup lang="ts">
import {ref, computed} from 'vue'

const search = ref('')
const selectedAdmins = ref<number[]>([])

const admins = ref([
  {
    id: 1,
    full_name: 'Adnan Madi',
    email: 'adnan@example.com',
    position: 'Manager',
    phone_number: '0123456789',
    admin_code: 'AKM-20250727-0001',
  },
  {
    id: 2,
    full_name: 'Sara Lee',
    email: 'sara@example.com',
    position: 'HR',
    phone_number: '0111111111',
    admin_code: 'AKM-20250727-0002',
  },
  {
    id: 3,
    full_name: 'Adnan Madi',
    email: 'adnan@example.com',
    position: 'Manager',
    phone_number: '0123456789',
    admin_code: 'AKM-20250727-0001',
  },
  {
    id: 4,
    full_name: 'Sara Lee',
    email: 'sara@example.com',
    position: 'HR',
    phone_number: '0111111111',
    admin_code: 'AKM-20250727-0002',
  },
])

const filteredAdmins = computed(() =>
    admins.value.filter((admin) =>
        `${admin.full_name} ${admin.email} ${admin.admin_code}`
            .toLowerCase()
            .includes(search.value.toLowerCase())
    )
)

const deleteSelected = () => {
  admins.value = admins.value.filter(
      (admin) => !selectedAdmins.value.includes(admin.id)
  )
  selectedAdmins.value = []
}
</script>

<template>
  <div class="admin">
    <div class="admin-header">

      <h2 class="admin-title">Manage Administrators</h2>

      <div class="admin-header-container">

        <input
            type="text"
            v-model="search"
            class="admin-search"
            placeholder="Search Administrative ... "
        />

        <nuxt-link to="/administrators/auth/create" class="administrators-create-btn">Create Administrator</nuxt-link>

      </div>
    </div>

    <div class="admin-table-wrapper">
      <div class="admin-table">
        <div class="admin-row admin-row--head">
          <span></span>
          <span>Full Name</span>
          <span>Email</span>
          <span>Position</span>
          <span>Phone</span>
          <span>Code</span>
          <span>Actions</span>
        </div>

        <div
            v-for="admin in filteredAdmins"
            :key="admin.id"
            class="admin-row"
        >
          <input
              type="checkbox"
              v-model="selectedAdmins"
              :value="admin.id"
              class="admin-checkbox"
          />
          <span>{{ admin.full_name }}</span>
          <span>{{ admin.email }}</span>
          <span>{{ admin.position }}</span>
          <span>{{ admin.phone_number }}</span>
          <span>{{ admin.admin_code }}</span>
          <div class="admin-actions">
            <NuxtLink to="" class="btn btn--update">
              <UIcon name="mdi-file" class="icon"/>
              Update
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <button
        class="btn btn--danger"
        :disabled="selectedAdmins.length === 0"
        @click="deleteSelected"
    >
      Delete Selected
    </button>
  </div>
</template>

<style scoped lang="scss">
.admin {
  padding: 15px;

  &-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  &-title {
    font-size: var(--heading-4);
    color: var(--primary-text-color);
    font-weight: normal;
    height: 36px;
    align-content: center;
  }

  .administrators-create-btn {
    width: 100%;
    font-size: var(--button-font-size);
    color: var(--primary-text-color);
    background: var(--button-bg);
    border: none;
    cursor: pointer;
    border-radius: 6px;
    padding: 10px;
    text-align: center;
    height: 36px;
    align-content: center;
    transition: var(--transition);

    &:hover {
      background: var(--hover-button-bg);
    }

    @media (min-width: 640px) {
      width: auto;
    }
  }

  .admin-header-container {
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (min-width: 640px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  &-search {
    padding: 10px 20px;
    height: 36px;
    border: 2px solid var(--secondary-text-color);
    color: var(--primary-text-color);
    border-radius: 6px;
    font-size: var(--body-text);

    @media (min-width: 640px) {
      max-width: 300px;
    }
  }

  &-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }

  &-table {
    display: flex;
    flex-direction: column;
    min-width: 800px;
  }

  &-row {
    display: grid;
    grid-template-columns:
    30px
    minmax(120px, 1fr)
    minmax(160px, 1fr)
    minmax(100px, 1fr)
    minmax(150px, 1fr)
    minmax(100px, 1fr)
    100px;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    font-size: var(--small-text);
    color: var(--secondary-text-color);
    height: 48px;
    padding: 0;

    &--head {
      background-color: var(--table-header-bg);
      color: var(--primary-text-color);
      font-size: var(--body-text);
      border-radius: 6px 6px 0 0;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &:nth-child(3) {
        white-space: normal;
        word-break: break-word;
        line-height: 1.3;
      }
    }
  }

  &-checkbox {
    width: 18px;
    height: 18px;
    margin: 0 auto;
    border-radius: 6px;
  }

  &-actions {
    gap: 5px;
    justify-content: center;
  }
}

.scroll-hint {
  display: block;
  text-align: center;
  font-size: 0.75rem;
  color: var(--accent-color);
  margin-bottom: 0.5rem;
}

.btn {
  display: inline-block;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  white-space: nowrap;

  &--update {
    font-size: var(--body-text);
    color: var(--primary-text-color);
    transition: var(--transition);

    &:hover {
      color: var(--accent-color);
    }
  }

  &--danger {
    display: block;
    justify-self: end;
    background: var(--cancel-button-bg);
    color: var(--danger-color);
    margin-top: 20px;
    border: none;
    width: 150px;
    height: 36px;
    align-content: center;

    &:hover:not(:disabled) {
      background: var(--cancel-button-bg);
      color: var(--danger-color);
    }

    &:disabled {
      background-color: var(--cancel-button-bg);
      color: var(--primary-text-color);
      cursor: not-allowed;
    }
  }
}

@media (min-width: 640px) {
  .scroll-hint {
    display: none;
  }

  .admin {
    &-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    &-search {
      max-width: 300px;
    }

    &-row {
      grid-template-columns: 40px 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 20px;
    }
  }

  .btn {
    width: 150px;
    height: 36px;
    align-content: center;
    font-size: var(--button-font-size);
  }
}

@media (min-width: 1024px) {
  .admin {
    padding: 20px;

    &-title {
      font-size: var(--heading-3);
    }

    &-search {
      font-size: var(--body-text);
      padding: 10px 20px;
    }

    &-row {
      grid-template-columns: 40px 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 0;
      padding: 0;
      height: 48px;
      align-content: center;
    }
  }
}

</style>