<script setup lang="ts">

import MemberTransactionHistory from "~/components/administrators/MemberTransactionHistory.vue";
import MemberFinancialOverview from "~/components/administrators/MemberFinancialOverview.vue";
</script>

<template>
  <AdministratorsHeader/>
  <AdministratorsMemberProfile/>
  <MemberFinancialOverview/>
  <MemberTransactionHistory/>
  <Footer/>
</template>

<style scoped lang="scss">
</style>