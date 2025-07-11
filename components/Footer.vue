<template>
  <footer class="footer">
    <p>
      © {{ currentYear }}
      <a href="https://members.koperasimasjid.com" target="_blank" rel="noopener" class="link">
        members.koperasimasjid.com
      </a>. All rights reserved.
    </p>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  text-align: center;
  background-color: var(--card-bg);
  font-size: var(--body-text);
  color: var(--body-text);
  height: 80px;
  align-items: center;
  justify-content: center;
  display: flex;
}

.link {
  text-decoration: none;
  transition: var(--transition);

}

.link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}
</style>
