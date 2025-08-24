<script setup lang="ts">

import Dashboard from "~/components/administrators/Dashboard.vue";
import LatestShareProgressChart from "~/components/administrators/LatestShareProgressChart .vue";


</script>

<template>
  <AdministratorsHeader/>
  <Dashboard/>
  <LatestShareProgressChart/>
  <AdministratorsTransactionsTableLatest/>
  <Footer/>
</template>

<style scoped lang="scss">

</style>