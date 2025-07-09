<script setup>
import {ref} from 'vue'

const isOpen = ref(false)

const links = [
  {id: 1, link: '/', label: 'Home'},
  {id: 2, link: '/change-password', label: 'Change Password'},
  {id: 3, link: '/profile', label: 'Profile'},
  {id: 4, link: '/logout', label: 'Logout'},
]

</script>


<template>
  <header class="main-header">
    <nav class="nav-container">
      <NuxtLink to="/" class="nav-logo">

        <img src="../public/images/logo.png" class="logo" alt="koprasi-logo">

      </NuxtLink>

      <button class="hamburger" @click="isOpen = !isOpen" aria-label="Toggle menu">
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
        <span :class="{ open: isOpen }"></span>
      </button>

      <ul :class="['nav-links', { open: isOpen }]">
        <li v-for="item in links" :key="item.id">
          <NuxtLink :to="item.link" active-class="active-link">{{ item.label }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.main-header {
  background-color: var(--card-bg);
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  height: 80px;
  align-content: center;

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 0 1rem;

    .logo {
      width: 100px;
      height: 60px;
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
        background-color: #333;
        transition: 0.3s;

        &.open:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        &.open:nth-child(2) {
          opacity: 0;
        }

        &.open:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }
      }
    }

    .nav-links {
      list-style: none;
      display: flex;
      gap: 1.5rem;
      margin: 0;
      transition: all 0.3s ease-in-out;

      li a {
        color: #555;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.3s;

        &:hover,
        &.active-link {
          color: #007bff;
        }
      }
    }

    // Mobile view
    @media (max-width: 768px) {
      .hamburger {
        display: flex;
      }

      .nav-links {
        flex-direction: column;
        width: 100%;
        display: none;
        padding-top: 1rem;

        &.open {
          display: flex;
        }

        li {
          padding: 0.5rem 0;
        }
      }
    }
  }
}
</style>
