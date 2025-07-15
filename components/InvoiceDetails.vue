<script setup>
// Here you can later bind real data via props or API
</script>

<template>
  <section class="invoice">
    <!-- Invoice Info -->
    <div class="section">
      <h3>Invoice Info</h3>
      <div class="grid">
        <div class="item"><strong>Invoice ID:</strong> INV-20250012</div>
        <div class="item"><strong>Transaction ID:</strong> TXN-INV-20250012</div>
        <div class="item"><strong>Invoice Date:</strong> 2025-06-27</div>
        <div class="item"><strong>Investment ID:</strong> INVST-00123</div>
        <div class="item"><strong>Status:</strong> Active</div>
      </div>
    </div>

    <!-- Member Info -->
    <div class="section">
      <h3>Member Information</h3>
      <div class="grid">
        <div class="item"><strong>Member ID:</strong> INV-001</div>
        <div class="item"><strong>Full Name:</strong> Ahmad bin Salleh</div>
        <div class="item"><strong>IC Number:</strong> 900101-14-1234</div>
        <div class="item"><strong>Email:</strong> ahmad@example.com</div>
        <div class="item"><strong>Phone:</strong> +60 13-456 7890</div>
        <div class="item"><strong>Country:</strong> Malaysia</div>
        <div class="item full"><strong>Address:</strong> No. 123, Jalan Damai, Kuala Lumpur, Selangor</div>
        <div class="item"><strong>Bank Name:</strong> Maybank</div>
        <div class="item"><strong>Account Holder:</strong> Ahmad bin Salleh</div>
        <div class="item"><strong>Account No:</strong> 1234567890</div>
      </div>
    </div>

    <!-- Investment Details -->
    <div class="section">
      <h3>Investment Details</h3>
      <div class="grid">
        <div class="item"><strong>Activity:</strong> Real Estate ActivityA</div>
        <div class="item"><strong>Investment Date:</strong> 2025-06-01</div>
        <div class="item"><strong>Amount:</strong> RM 10,000.00</div>
        <div class="item"><strong>Profit Rate:</strong> 10%</div>
        <div class="item"><strong>Expected Return:</strong> 2026-06-01</div>
        <div class="item"><strong>Final Return:</strong> RM 11,000.00</div>
        <div class="item"><strong>Status:</strong> Active</div>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="section">
      <h3>Payment Methods</h3>
      <div class="grid">
        <div class="item"><strong>Received via:</strong> Bank Transfer</div>
        <div class="item"><strong>Returned via:</strong> Online</div>
      </div>
    </div>

    <!-- If Investment is Canceled -->
    <div class="section">
      <h3>If Investment is Canceled</h3>
      <div class="grid">
        <div class="item"><strong>Is Canceled:</strong> Yes</div>
        <div class="item"><strong>Cancellation Date:</strong> 2025-06-01</div>
        <div class="item"><strong>Amount Invested:</strong> RM 10,000.00</div>
        <div class="item"><strong>Penalty Rate:</strong> 5%</div>
        <div class="item"><strong>Adjusted Final Return:</strong> RM 9,500.00</div>
      </div>
    </div>

    <!-- Final Summary -->
    <div class="section">
      <h3>Final Return</h3>
      <div class="grid">
        <div class="item"><strong>Final Return:</strong> RM 11,000.00</div>
        <div class="item"><strong>Adjusted Return:</strong> RM 9,500.00</div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.invoice {
  padding: 1.5rem;
  background: #fff;
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
  font-size: 14px;
  color: #333;

  .section {
    margin-bottom: 2rem;

    h3 {
      font-size: 16px;
      color: #222;
      margin-bottom: 1rem;
      border-left: 4px solid #e0c281;
      padding-left: 10px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

      .item {
        background: #f9f9f9;
        padding: 12px 16px;
        border-radius: 6px;
        line-height: 1.4;

        strong {
          font-weight: 600;
          color: #444;
        }
      }

      .full {
        grid-column: span 1;

        @media (min-width: 600px) {
          grid-column: span 2;
        }

        @media (min-width: 1024px) {
          grid-column: span 3;
        }
      }
    }
  }
}
</style>
