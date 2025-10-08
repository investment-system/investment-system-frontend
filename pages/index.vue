<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter();

onMounted(() => {
  router.push('/member/auth/login');

});
</script>

<template></template>

<style scoped lang="scss"></style>
