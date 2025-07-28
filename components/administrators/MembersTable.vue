<script setup lang="ts">
import {ref, computed} from 'vue'

const search = ref('')
const selectedType = ref('All')

const members = ref([
  {
    id: 1,
    member_code: 'MBR-20250728-0001',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    phone_number: '+60123456789',
    address: '123 Jalan Ampang, Kuala Lumpur',
    is_active: true,
    is_staff: false,
    date_joined: '2025-07-28T10:30:00Z',
    updated_at: '2025-07-28T11:00:00Z'
  },
  {
    id: 2,
    member_code: 'MBR-20250728-0002',
    email: 'jane.ali@example.com',
    full_name: 'Jane Ali',
    phone_number: '+60129876543',
    address: '45 Jalan Bukit, Johor Bahru',
    is_active: false,
    is_staff: false,
    date_joined: '2025-07-28T12:00:00Z',
    updated_at: '2025-07-28T12:30:00Z'
  },
  {
    id: 3,
    member_code: 'MBR-20250728-0003',
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    phone_number: '+60123456789',
    address: '123 Jalan Ampang, Kuala Lumpur',
    is_active: true,
    is_staff: false,
    date_joined: '2025-07-28T10:30:00Z',
    updated_at: '2025-07-28T11:00:00Z'
  },
  {
    id: 4,
    member_code: 'MBR-20250728-0004',
    email: 'jane.ali@example.com',
    full_name: 'Jane Ali',
    phone_number: '+60129876543',
    address: '45 Jalan Bukit, Johor Bahru',
    is_active: false,
    is_staff: false,
    date_joined: '2025-07-28T12:00:00Z',
    updated_at: '2025-07-28T12:30:00Z'
  },
])

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    const matchesSearch = `${member.id} ${member.member_code} ${member.is_active}  ${member.full_name}`
        .toLowerCase()
        .includes(search.value.toLowerCase())

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
            :key="member.id"
            class="member-row"
        >
          <span>{{ member.full_name }}</span>
          <span>{{ member.member_code }}</span>
          <span>{{ member.email }}</span>
          <span>{{ member.phone_number }}</span>
          <span>{{ member.date_joined.slice(0, 10) }}</span>
          <div class="member-actions">
            <NuxtLink to="" class="btn btn--update">
              <UIcon name="mdi-eye" class="icon"/>
              View
            </NuxtLink>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
.member {
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
    height: 48px;
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
    height: 48px;
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
    min-width: 1000px;
  }

  &-row {
    display: grid;
    grid-template-columns:
    minmax(180px,0)
    minmax(180px, 1fr)
    minmax(180px, 1fr)
    minmax(180px, 1fr)
    minmax(150px, 1fr)
    minmax(100px, 1fr)
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
    height: 48px;
    align-content: center;
    font-size: var(--button-font-size);
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

</style>