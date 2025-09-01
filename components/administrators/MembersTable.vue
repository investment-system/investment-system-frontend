<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApi } from '@/composables/useApi'

const search = ref('')
const selectedType = ref('All')
const members = ref<any[]>([])
const loading = ref(false)

const api = useApi()

onMounted(async () => {
  try {
    const response = await api.get('/members/list/')
    members.value = response.data
  } catch (error) {
    console.error('Failed to fetch members:', error)
  }
})

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    const matchesSearch = `
      ${member.member_code}
      ${member.full_name}
      ${member.email}
      ${member.phone_number ?? ''}
      ${member.address ?? ''}
      ${member.registration_status}
    `.toLowerCase().includes(search.value.toLowerCase())

    const matchesType =
        selectedType.value === 'All' || member.member_code === selectedType.value

    return matchesSearch && matchesType
  })
})
</script>

<template>
  <div class="member">

    <div class="member-header">
      <h2 class="member-title">Manage Members</h2>
      <div class="member-header-container">
        <input
            type="text"
            v-model="search"
            class="member-search"
            placeholder="Search Members ... "
        />
      </div>
    </div>

    <div class="member-table-wrapper">
      <div class="member-table">
        <div class="member-row member-row--head">
          <span>Full Name</span>
          <span>Member Code</span>
          <span>Email</span>
          <span>Phone Number</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        <div
            v-for="member in filteredMembers"
            :key="member.member_code"
            class="member-row"
        >
          <span>{{ member.full_name }}</span>
          <span>{{ member.member_code }}</span>
          <span>{{ member.email }}</span>
          <span>{{ member.phone_number ?? '-' }}</span>
          <span>{{ new Date(member.created_at).toLocaleDateString() }}</span>
          <div class="member-actions">
            <NuxtLink :to="`/administrators/manage-members/${member.id}`" class="btn btn--update">
              <UIcon name="mdi:file-eye" class="icon" />
              Review Member
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && !filteredMembers.length" class="no-members">

      <img src="/images/no-data-icon.png" class="no-members-img-container" alt="no">

      <p class="no-members-header">No transactions found for this member.</p>

    </div>

  </div>
</template>

<style scoped lang="scss">
.member {
  padding: 15px;
  min-height: 50vh;

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

  .member-header-container {
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
    min-height: 50vh;
  }

  &-row {
    display: grid;
    grid-template-columns:
    minmax(200px, 2fr)
    minmax(180px, 1fr)
    minmax(220px, 2fr)
    minmax(140px, 1fr)
    minmax(140px, 1fr)
    minmax(160px, 1fr)
    100px;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid var(--border-color);
    font-size: var(--small-text);
    color: var(--secondary-text-color);
    height: 48px;

    &--head {
      background-color: var(--table-header-bg);
      color: var(--primary-text-color);
      font-size: var(--body-text);
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10;
      border-radius: 6px 6px 0 0;
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

@media (min-width: 640px) {
  .scroll-hint {
    display: none;
  }

  .member {
    &-header {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    &-search {
      max-width: 300px;
    }

    &-row {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 0;
      margin: 0;
      padding: 0 20px;
      height: 48px;
      align-content: center;
    }
  }

  .btn {
    height: 36px;
    align-content: center;
    font-size: var(--button-font-size);
    color: var(--primary-text-color);
    text-decoration: none;
    transition: var(--transition);

    &:hover{
      color: var(--secondary-text-color);
      text-decoration: underline;
    }
  }
}

@media (min-width: 1024px) {
  .member {
    padding: 20px;

    &-title {
      font-size: var(--heading-3);
    }

    &-search {
      font-size: var(--body-text);
      padding: 10px 20px;
    }

    &-row {
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 0;
      margin: 0;
      padding: 0 20px;
      height: 48px;
      align-content: center;
    }
  }
}


.no-members {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: -30vh;
}

.no-members img {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
  opacity: 0.7;
}

.no-members p {
  font-size: var(--body-text);
  font-weight: 500;
  color: var(--primary-text-color);
  margin: 0;
}


</style>