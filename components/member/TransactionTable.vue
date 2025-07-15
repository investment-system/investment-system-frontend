<script setup>

const transactions = [
  {
    payment_id: 'PAY-20250715001',
    member_name: 'Ahmad bin Salleh',
    amount_paid: 1500.00,
    date_Invested: '2025-07-12',
    profit_amount: 120.00,
    status: 'confirmed',
  },
  {
    payment_id: 'PAY-20250715002',
    member_name: 'Siti Nur Aisyah',
    amount_paid: 2000.00,
    date_Invested: '2025-07-10',
    profit_amount: 150.00,
    status: 'pending',
  },
  {
    payment_id: 'PAY-20250715003',
    member_name: 'Mohd Faizal',
    amount_paid: 1800.00,
    date_Invested: '2025-07-09',
    profit_amount: 130.00,
    status: 'confirmed',
  }
];
</script>

<template>
  <div class="transaction-section">

    <h2 class="section-title">Financial Records</h2>
    <FinancialIconDivider/>


    <div class="transaction-table-wrapper">
      <table class="transaction-table">
        <thead>
        <tr>
          <th>Transaction ID</th>
          <th>Member Name</th>
          <th>Amount (RM)</th>
          <th>Date Invested</th>
          <th>Profit (RM)</th>
          <th>Status</th>
          <th class="invoice-header">Invoice</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="transactions.length === 0">
          <td colspan="7" class="no-data-row">
            <div class="no-data-content">
              <img src="/images/no-data-icon.png" alt="No Data"/>
              <p>No financial records found.</p>
            </div>
          </td>
        </tr>
        <tr v-else v-for="(item, index) in transactions" :key="index">
          <td>{{ item.payment_id }}</td>
          <td>{{ item.member_name }}</td>
          <td>{{ item.amount_paid }}</td>
          <td>{{ item.date_Invested }}</td>
          <td class="profit">{{ item.profit_amount }}</td>
          <td>{{ item.status }}</td>
          <td>
            <button class="invoice-btn">
              <Icon name="i-lucide-file-text"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.transaction-section {
  padding: 20px;
  background: var(--card-bg);
  width: 100%;
  max-width: 1240px;
  margin: 30px auto;

  .section-title {
    font-size: var(--heading-4);
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    height: 70px;
  }
}

.transaction-table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: var(--card-bg);
  border-radius: 10px;

  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 10px;
  }
}

.transaction-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  font-size: var(--body-text);
  color: var(--primary-text-color);

  th,
  td {
    text-align: left;
    padding: 0.75rem 1rem;
    white-space: nowrap;
    height: 50px;
  }

  thead th {
    font-weight: normal;
    color: var(--primary-text-color);
    background-color: var(--table-header-bg);
  }

  .profit {
    color: var(--profit-color);
  }

  .invoice-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--hover-text-color);
    font-size: 18px;

    &:hover {
      color: var(--accent-color);
    }
  }
}


.no-data-row {
  text-align: center;
  height: 200px;

  .no-data-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;

    img {
      width: 80px;
      opacity: 0.5;
      margin-bottom: 1rem;
    }

    p {
      color: #999;
      font-style: italic;
      font-size: 16px;
    }
  }
}

</style>
