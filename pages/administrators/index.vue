<script setup lang="ts">

import Dashboard from "~/components/administrators/Dashboard.vue";
import LatestShareProgressChart from "~/components/administrators/LatestShareProgressChart .vue";
import LatestPendingTransactions from "~/components/administrators/LatestPendingTransactions.vue";


</script>

<template>
  <AdministratorsHeader/>
  <Dashboard/>
  <LatestShareProgressChart/>
  <LatestPendingTransactions/>
  <AdministratorsTransactionsTableLatest/>
  <Footer/>
</template>

<style scoped lang="scss">

</style>