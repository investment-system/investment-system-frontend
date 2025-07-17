<script setup>

import {ref} from 'vue'

const invoiceSection = ref(null)

const printInvoice = () => {
  const originalTitle = document.title
  document.title = 'Invoice_INV'
  window.print()
  setTimeout(() => {
    document.title = originalTitle
  }, 1000)
}

</script>


<template>
  <div class="no-print">
    <MemberHeader/>
  </div>

  <section class="invoice invoice-body" ref="invoiceSection">

    <div class="print-only print-header">
      <img src="/images/logo.png" alt="koperasi masjid logo" class="koperasi masjid logo"/>
      <h1>INVOICE</h1>
    </div>

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

    <div class="section">
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

    <div class="print-only signature-section">
      <p>__________________________</p>
      <p>Authorized Signature</p>
    </div>

    <div class="print-only print-footer">
      <div class="contact-info">
        <p>
          <span>
          Koperasi masjid
        </span>
        </p>
        <p>1, Jln Hang Tuah, Bukit Bintang, 55200 Kuala Lumpur</p>
        <p> Wilayah Persekutuan Kuala Lumpur</p>
        <p>Email: info@koperasimasjid.com | Phone: +60 19-335 5368</p>
      </div>
      <div>
        <img src="/images/logo.png" alt="koperasi masjid logo" class="logo small-logo"/>
      </div>

    </div>


    <div class="section btn-container">

      <button class="print-btn" @click="printInvoice">Print / Save PDF</button>

    </div>

  </section>

  <Footer/>
</template>

<style scoped lang="scss">

.print-only {
  display: none;
}

.invoice {
  padding: 1.5rem 0;
  color: var(--primary-text-color);

  .section {
    background: var(--input-field-bg);
    padding: 1rem;
    margin-bottom: 0;

    @media (min-width: 600px) {
      width: calc(100% - 80px);
      margin: 0 auto 2rem;
      border-radius: 12px;

      &.btn-container {
        background: transparent;
      }

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

  .print-btn {
    font-size: var(--text-button-Text);
    width: 150px;
    height: 48px;
    margin: 0 !important;
    background-color: var(--button-bg);
    border: none;
    outline: none;
    border-radius: 6px;
    transition: var(--transition);

    &:hover {
      background-color: var(--hover-button-bg);
    }
  }
}

@media print {

  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }

  @page {
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: 'Inter', sans-serif;
    background: var(--primary-bg) !important;
    font-size: var(--body-text);
  }

  .section {
    background-color: white !important;
    box-shadow: none;
    border-radius: 0 !important;
  }

  .print-header {
    display: flex !important;
    justify-content: space-between !important;
    margin-bottom: 20px;
    border-bottom: 2px solid var(--primary-bg);
    padding-bottom: 1rem;
  }

  .print-header h1 {
    font-size: var(--heading-1);
    text-transform: uppercase;
    letter-spacing: 1.5px;
  }

  .btn-container {
    display: none !important;
  }

  Footer {
    display: none !important;
  }

  .invoice-content {
    display: none;
  }

  .invoice {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    background: var(--primary-bg);
    color: var(--primary-text-color);
  }

  .print-only {
    display: block !important;
    width: 100%;
    max-width: 1200px;
  }

  .print-header {
    width: 90%;
    margin: 0 auto;
    padding: 0;
    display: flex !important;
    align-items: center;
    justify-content: space-between;
  }

  .print-header .logo {
    width: 120px;
    height: 80px;
    margin-bottom: 0.5rem;
  }

  .print-header h1 {
    font-size: var(--heading-1);
    margin: 0;
    letter-spacing: 2px;
  }

  .signature-section {
    width: 90%;
    display: flex;
    justify-content: end;
    text-align: end;
    font-size: var(--body-text);
    margin: 5rem 0;
  }

  .signature-section p:first-child {
    margin-bottom: 0.5rem;
  }

  .print-footer {
    width: 90%;
    margin: 0 auto;
    padding: 0;
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
  }

  .print-footer .contact-info p {
    margin: 0.2rem 0;
    font-size: var(--small-text);
  }

  .print-footer .contact-info p span {
    color: var(--secondary-text-color);
    padding: 5px;
    margin: 0 10px;
  }

  .print-footer .small-logo {
    width: 120px;
    margin-top: 0.5rem;
  }
}

@media screen {
  .print-only {
    display: none !important;
  }
}


</style>
