<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isOpen = ref(false)
const router = useRouter()

const links = [
  { id: 1, link: '/member/', label: 'Home', icon: 'i-lucide-home' },
  { id: 2, link: '/', label: 'Change Password', icon: 'i-lucide-lock' },
  { id: 3, link: '/member/profile', label: 'Profile', icon: 'i-lucide-user' },
  { id: 4, link: '/', label: 'Logout', icon: 'i-lucide-log-out' }
]

const handleLogout = () => {
  console.log('Logging out...')
  router.push('/login')
}

const logo = "/images/logo.png";
</script>

<template>
  <header class="main-header">
    <nav class="nav-container">
      <a href="/" class="nav-logo">
        <img :src="logo" class="logo" alt="Koperasi-logo" />
      </a>

      <button
          class="hamburger"
          @click="isOpen = !isOpen"
          :aria-expanded="isOpen"
          aria-label="Toggle menu"
      >
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>

      <ul :class="['nav-links', { open: isOpen }]">
        <li v-for="item in links" :key="item.id">
          <template v-if="item.label === 'Logout'">
            <a href="#" @click.prevent="handleLogout">

              <UIcon :name="item.icon" class="icon" />
              Logout</a>
          </template>
          <template v-else>
            <NuxtLink :to="item.link" active-class="active-link">
              <UIcon :name="item.icon" class="icon" />
              {{ item.label }}
            </NuxtLink>
          </template>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.main-header {
  background-color: var(--card-bg);
  width: 100%;
  height: 80px;
  position: relative;
  z-index: 1002;

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 1rem;
    height: 100%;
    position: relative;
    z-index: 2;

    .nav-logo {
      display: flex;
      align-items: center;

      .logo {
        width: 100px;
        height: 60px;
        object-fit: contain;
      }
    }

    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;

      span {
        display: block;
        width: 25px;
        height: 3px;
        background-color: var(--primary-text-color);
        transition: 0.3s;
      }

      span.open:nth-of-type(1) {
        transform: translateY(8px) rotate(45deg);
      }

      span.open:nth-of-type(2) {
        opacity: 0;
      }

      span.open:nth-of-type(3) {
        transform: translateY(-8px) rotate(-45deg);
      }
    }

    .nav-links {
      list-style: none;
      display: flex;
      gap: 1.5rem;
      margin: 0;

      li a {
        color: var(--primary-text-color) !important;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s;

        .icon {
          margin-right: 5px;
          width: 15px;
          height: 15px;
          vertical-align: middle;
        }

        &:hover,
        &.active-link {
          color: var(--accent-color) !important;
        }
      }

      @media (max-width: 768px) {
        position: absolute;
        top: 80px;
        left: 0;
        right: 0;
        flex-direction: column;
        background-color: var(--card-bg);
        padding: 1rem;
        display: none;
        z-index: 9999;

        &.open {
          display: flex;
        }

        li {
          padding: 0.5rem 0;
        }
      }
    }

    @media (max-width: 768px) {
      .hamburger {
        display: flex;
      }

      .nav-links {
        display: none; // initial state
      }
    }
  }
}
</style>
