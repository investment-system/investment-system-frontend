<template>
  <div class="icon-divider">
    <span class="line"></span>
    <UIcon name="mdi-bar-chart" class="icon" />
    <span class="line"></span>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.icon-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;

  .line {
    flex: 1;
    height: 2px;
    background-color: var(--accent-color);
  }

  .icon {
    margin: 0 12px;
    color: var(--accent-color);
    font-size: var(--heading-4);
  }

  @media (min-width: 768px) {
    margin: 10px 0;

    .icon {
      font-size: var(--heading-3);
    }
  }

  @media (min-width: 1024px) {
    margin: 10px 0;

    .icon {
      font-size: var(--heading-2);
    }
  }
}
</style>
