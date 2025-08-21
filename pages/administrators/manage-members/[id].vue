<script setup lang="ts">

import MemberTransactionHistory from "~/components/administrators/MemberTransactionHistory.vue";
import MemberFinancialOverview from "~/components/administrators/MemberFinancialOverview.vue";
import ProfitTransactionsTable from "~/components/administrators/ProfitTransactionsTable.vue";
</script>

<template>
  <AdministratorsHeader/>
  <AdministratorsMemberProfile/>
  <MemberFinancialOverview/>
  <ProfitTransactionsTable/>
  <MemberTransactionHistory/>
  <Footer/>
</template>

<style scoped lang="scss">
</style>