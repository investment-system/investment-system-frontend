<script setup lang="ts">
import {ref, computed, onMounted} from 'vue'
import DeleteAdminConfirmation from "./popup/DeleteAdminConfirmation.vue";

const api = useApi()

const search = ref('')
const selectedAdmins = ref<number[]>([])
const admins = ref([])
const loading = ref(true)
const error = ref(null)

const showDeletePopup = ref(false)

const fetchAdmins = async () => {
  try {
    loading.value = true
    const {data} = await api.get('/administrators/list/')
    admins.value = data
  } catch (err) {
    error.value = 'Failed to load administrators.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredAdmins = computed(() =>
    admins.value.filter((admin: any) =>
        `${admin.full_name} ${admin.email} ${admin.admin_code}`
            .toLowerCase()
            .includes(search.value.toLowerCase())
    )
)

const toggleSelected = (id: number) => {
  if (selectedAdmins.value.includes(id)) {
    selectedAdmins.value = selectedAdmins.value.filter((i) => i !== id)
  } else {
    selectedAdmins.value.push(id)
  }
}

const deleteSelected = () => {
  if (selectedAdmins.value.length === 0) return
  showDeletePopup.value = true
}

const confirmDelete = async () => {
  try {
    await Promise.all(
        selectedAdmins.value.map(id => api.delete(`/administrators/${id}/delete/`))
    )

    admins.value = admins.value.filter(admin => !selectedAdmins.value.includes(admin.id))
    selectedAdmins.value = []
    showDeletePopup.value = false
    location.reload()
  } catch (err) {
    console.error('Failed to delete admins:', err)
    alert('Failed to delete admins.')
  }
}

onMounted(fetchAdmins)
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

        <nuxt-link
            to="/administrators/auth/create"
            class="administrators-create-btn">
          Create Administrator
        </nuxt-link>

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
              :value="admin.user.id"
              :checked="selectedAdmins.includes(admin.user.id)"
              @change="toggleSelected(admin.user.id)"
              class="admin-checkbox"
          />

          <span>{{ admin.user.full_name }}</span>
          <span>{{ admin.user.email }}</span>
          <span>{{ admin.position }}</span>
          <span>{{ admin.phone_number }}</span>
          <span>{{ admin.admin_code }}</span>
          <div class="admin-actions">

            <NuxtLink
                v-if="admin?.user?.id"
                :to="`/administrators/manage/${admin.user.id}/`"
                class="btn btn--update"
            >
              <UIcon name="mdi-file" class="icon" /> Update
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

    <div v-if="!loading && !admins.length" class="no-admins">

      <img src="/images/no-data-icon.png" class="no-admins-img-container" alt="no">

      <p class="no-admins-header">No transactions found for this member.</p>

    </div>


    <DeleteAdminConfirmation
        v-if="showDeletePopup"
        :show="showDeletePopup"
        @close="showDeletePopup = false"
        @confirm="confirmDelete"
    />


  </div>
</template>

<style scoped lang="scss">
.admin {
  padding: 15px;
  min-height: 100vh;

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
    min-width: 1200px;
  }

  &-row {
    display: grid;
    grid-template-columns:
    30px
    minmax(120px, 1fr)
    minmax(200px, 1fr)
    minmax(60px, 1fr)
    minmax(150px, 1fr)
    minmax(100px, 1fr)
    100px;
    gap: 0 10px;
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
      grid-template-columns: 40px 1fr 1.2fr .8fr 1fr 1fr .8fr;
      gap: 0 10px;
      padding: 0;
      height: 48px;
      align-content: center;
    }
  }
}

.no-admins {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100px;
}

.no-admins img {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.no-admins p {
  font-size: var(--body-text);
  font-weight: 500;
  color: var(--primary-text-color);
  margin: 0;
}



</style>