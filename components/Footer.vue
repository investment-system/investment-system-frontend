<template>
  <footer class="footer">
    <p>
      © {{ currentYear }}
      <a href="https://members.koperasimasjid.com" target="_blank" rel="noopener" class="link">
        koperasimasjid2u.com
      </a>. All rights reserved.
    </p>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped lang="scss">

.footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  padding: 20px;
  text-align: center;
  background-color: var(--card-bg);
  font-size: var(--body-text);
  color: var(--primary-text-color);
  min-height: 60px;
  line-height: 1.5;
  word-break: break-word;
}

.link {
  text-decoration: none;
  color: var(--primary-color);
  transition: var(--transition);
}

.link:hover {
  color: var(--accent-color);
  text-decoration: underline;
}


</style>
