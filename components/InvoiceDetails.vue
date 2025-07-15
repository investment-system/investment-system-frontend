<script setup>

const invoiceDetails = [
  {label: 'Invoice ID', value: 'INV-20250012'},
  {label: 'Transaction ID', value: 'TXN-INV-20250012'},
  {label: 'Invoice Date', value: '2025-06-27'},
  {label: 'Investment ID', value: 'INVST-00123'},
  {label: 'Status', value: 'Active'},
];

</script>


<template>
  <section class="invoice">
    <div class="section">
      <h3>Invoice Info</h3>
      <hr class="divider"/>
      <div class="grid">
        <div class="item"><span class="label">Invoice ID:</span><span class="data">INV-20250012</span></div>
        <div class="item"><span class="label">Transaction ID:</span><span class="data">TXN-INV-20250012</span></div>
        <div class="item"><span class="label">Invoice Date:</span><span class="data">2025-06-27</span></div>
        <div class="item"><span class="label">Investment ID:</span><span class="data">INVST-00123</span></div>
        <div class="item"><span class="label">Status:</span><span class="data">Active</span></div>
      </div>
    </div>

    <div class="section">
      <h3>Member Information</h3>
      <hr class="divider"/>

      <div class="grid">
        <div class="item"><span class="label">Member ID:</span><span class="data">INV-001</span></div>
        <div class="item"><span class="label">Full Name:</span><span class="data">Ahmad bin Salleh</span></div>
        <div class="item"><span class="label">IC Number:</span><span class="data">900101-14-1234</span></div>
        <div class="item"><span class="label">Email:</span><span class="data">ahmad@example.com</span></div>
        <div class="item"><span class="label">Phone:</span><span class="data">+60 13-456 7890</span></div>
        <div class="item"><span class="label">Country:</span><span class="data">Malaysia</span></div>
        <div class="item "><span class="label">Address:</span><span class="data">No. 123, Jalan Damai, Kuala Lumpur, Selangor</span>
        </div>
        <div class="item"><span class="label">Bank Name:</span><span class="data">Maybank</span></div>
        <div class="item"><span class="label">Account Holder:</span><span class="data">Ahmad bin Salleh</span></div>
        <div class="item"><span class="label">Account No:</span><span class="data">1234567890</span></div>
      </div>
    </div>

    <div class="section">
      <h3>Investment Details</h3>
      <hr class="divider"/>

      <div class="grid">
        <div class="item"><span class="label">Activity:</span><span class="data">Real Estate ActivityA</span></div>
        <div class="item"><span class="label">Investment Date:</span><span class="data">2025-06-01</span></div>
        <div class="item"><span class="label">Amount:</span><span class="data">RM 10,000.00</span></div>
        <div class="item"><span class="label">Profit Rate:</span><span class="data">10%</span></div>
        <div class="item"><span class="label">Expected Return:</span><span class="data">2026-06-01</span></div>
        <div class="item"><span class="label">Final Return:</span><span class="data">RM 11,000.00</span></div>
        <div class="item"><span class="label">Status:</span><span class="data">Active</span></div>
      </div>
    </div>

    <div class="section">
      <h3>Payment Methods</h3>
      <div class="grid">
        <div class="item"><span class="label">Received via:</span><span class="data">Bank Transfer</span></div>
        <div class="item"><span class="label">Returned via:</span><span class="data">Online</span></div>
      </div>
    </div>

    <div class="section canceled">
      <h3>If Investment is Canceled</h3>
      <hr class="divider"/>

      <div class="grid">
        <div class="item"><span class="label">Is Canceled:</span><span class="data">Yes</span></div>
        <div class="item"><span class="label">Cancellation Date:</span><span class="data">2025-06-01</span></div>
        <div class="item"><span class="label">Amount Invested:</span><span class="data">RM 10,000.00</span></div>
        <div class="item"><span class="label">Penalty Rate:</span><span class="data">5%</span></div>
        <div class="item"><span class="label">Adjusted Final Return:</span><span class="data">RM 9,500.00</span></div>
      </div>
    </div>

    <div class="section">
      <h3>Final Return</h3>

      <hr class="divider"/>

      <div class="grid">
        <div class="item"><span class="label">Final Return:</span><span class="data">RM 11,000.00</span></div>
        <div class="item"><span class="label">Adjusted Return:</span><span class="data">RM 9,500.00</span></div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.invoice {
  padding: 1.5rem 0;
  color: var(--primary-text-color);

  .section {
    background: var(--input-field-bg);
    padding: 1rem;
    margin-bottom: 2rem;

    @media (min-width: 600px) {
      width: calc(100% - 40px);
      margin: 0 auto 2rem;
      border-radius: 12px;
    }

    h3 {
      font-size: var(--heading-4);
      margin: 0 0 1rem 0;
      color: var(--secondary-text-color);
      font-weight: normal;
    }

    .divider {
      border-bottom: 2px solid var(--secondary-text-color);
      margin: 0 auto 1rem;
      width: 100%;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr);
      }

      .item {
        display: flex;
        flex-direction: column;
        font-size: var(--body-text);

        .label {
          font-weight: 500;
          height: 50px;
          align-content: center;
        }

        .data {
          color: var(--secondary-text-color);
          height: 50px;
          align-content: center;
          background-color: var(--primary-bg);
          padding: 10px;
          border-radius: 10px;

          @media (min-width: 600px) {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
          }

          @media (min-width: 1024px) {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
          }
        }
      }
    }
  }
}
</style>
