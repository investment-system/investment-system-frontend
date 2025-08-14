<script setup>
import {ref, onMounted} from 'vue'
import {useApi} from '@/composables/useApi'
import {useRoute} from 'vue-router'

const api = useApi()
const route = useRoute()

const SOURCE_TYPE_LABELS = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  share: 'Share',
  payment: 'Payment',
  cancellation: 'Cancellation',
  registration_payments: 'Registration Payment',
}
const DIRECTION_LABELS = {
  in: 'In',
  out: 'Out',
  reinvest: 'Reinvest',
}
const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
  ewallet: 'E-Wallet',
}

const invoiceSection = ref(null)

const transaction = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const {data} = await api.get(`/transactions/user/${route.params.id}/`)

    transaction.value = {
      ...data,
      source_type: SOURCE_TYPE_LABELS[data.source_type] || data.source_type,
      direction: DIRECTION_LABELS[data.direction] || data.direction,
      payment_method: PAYMENT_METHOD_LABELS[data.payment_method] || data.payment_method,
    }
  } catch (error) {
    console.error('Error fetching transaction:', error)
  } finally {
    loading.value = false
  }
})

const profile = ref({})
const profileData = ref([])

const getUserInfo = async () => {
  try {
    const {data} = await api.get('/members/profile/')
    profile.value = data

    profileData.value = [
      {label: 'Email Address', value: data.email},
      {label: 'Full Name', value: data.full_name},
      {label: 'Gender', value: data.gender},
      {label: 'Phone Number', value: data.phone_number},
      {label: 'Country', value: data.country},
      {label: 'Address Line', value: data.address_line},
      {label: 'City', value: data.city},
      {label: 'State', value: data.state},
      {label: 'Bank Name', value: data.bank_name},
      {label: 'Account Holder Name', value: data.account_holder_name},
      {label: 'Bank Account Number', value: data.bank_account_number},
    ]
    console.log(profile.value)
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

onMounted(() => {
  getUserInfo()
})

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
      <h3>Member Information</h3>
      <hr class="divider"/>

      <div class="profile-info">
        <div class="item" v-for="(item, index) in profileData" :key="index">
          <label class="label">{{ item.label }}</label>
          <p class="data">{{ item.value }}</p>
        </div>
      </div>

    </div>

    <div class="section">
      <h3>Invoice Info</h3>
      <hr class="divider"/>
      <div class="grid">

        <div class="item">
          <span class="label">Transaction ID</span>
          <span class="data">{{ transaction?.transaction_id }}</span>
        </div>

        <div class="item">
          <span class="label">Invoice ID</span>
          <span class="data">{{ transaction?.reference_id }}</span>
        </div>

        <div class="item">
          <span class="label">Transaction Code</span>
          <span class="data">{{ transaction?.transaction_code }}</span>
        </div>

        <div class="item">
          <span class="label">Invoice Date</span>
          <span class="data">{{ transaction?.created_at?.split('T')[0] }}</span>
        </div>

        <div class="item">
          <span class="label">Source Type</span>
          <span class="data">{{ transaction?.source_type }}</span>
        </div>

        <div class="item">
          <span class="label">Amount</span>
          <span class="data">{{ transaction?.amount }}</span>
        </div>

        <div class="item">
          <span class="label">Direction</span>
          <span class="data">{{ transaction?.direction }}</span>
        </div>

        <div class="item">
          <span class="label">Payment Method</span>
          <span class="data">{{ transaction?.payment_method }}</span>
        </div>

        <div class="item">
          <span class="label">Invoice Document</span>
          <span class="data">
        <a v-if="transaction?.received_invoice_doc"
           :href="transaction.received_invoice_doc"
           target="_blank">View Document</a>
        <span v-else>No document</span>
      </span>
        </div>

      </div>
    </div>

    <div class="section">
      <h3>Investment Details</h3>
      <hr class="divider"/>

      <div class="grid">
        <div class="item"><span class="label">Activity</span><span class="data">Real Estate ActivityA</span></div>
        <div class="item"><span class="label">Investment Date</span><span class="data">2025-06-01</span></div>
        <div class="item"><span class="label">Amount</span><span class="data">RM 10,000.00</span></div>
        <div class="item"><span class="label">Profit Rate</span><span class="data">10%</span></div>
        <div class="item"><span class="label">Expected Return</span><span class="data">2026-06-01</span></div>
        <div class="item"><span class="label">Final Return</span><span class="data">RM 11,000.00</span></div>
        <div class="item"><span class="label">Status</span><span class="data">Active</span></div>
      </div>
    </div>

    <div class="section">
      <h3>Payment Methods</h3>

      <hr class="divider"/>

      <div class="grid">
        <div class="item"><span class="label">Received via</span><span class="data">Bank Transfer</span></div>
        <div class="item"><span class="label">Returned via</span><span class="data">Online</span></div>
      </div>
    </div>

    <div class="section">
      <h3>If Investment is Canceled</h3>
      <hr class="divider"/>

      <div class="grid">
        <div class="item"><span class="label">Is Canceled</span><span class="data">Yes</span></div>
        <div class="item"><span class="label">Cancellation Date</span><span class="data">2025-06-01</span></div>
        <div class="item"><span class="label">Amount Invested</span><span class="data">RM 10,000.00</span></div>
        <div class="item"><span class="label">Penalty Rate</span><span class="data">5%</span></div>
        <div class="item"><span class="label">Adjusted Final Return</span><span class="data">RM 9,360.00</span></div>
      </div>
    </div>

    <div class="section">
      <h3>Final Return</h3>

      <hr class="divider"/>

      <div class="grid">
        <div class="item"><span class="label">Final Return</span><span class="data">RM 11,000.00</span></div>
        <div class="item"><span class="label">Adjusted Return</span><span class="data">RM 9,360.00</span></div>
      </div>

    </div>

    <div class="print-only print-footer">
      <div class="contact-info">
        <p><span>Koperasi masjid</span></p>
        <p><span> Email </span> info@koperasimasjid.com | <span>Phone </span> +60 19-335 5368</p>
      </div>
      <div>
        <img src="/images/logo.png" alt="koperasi masjid logo" class="logo small-logo"/>
      </div>

    </div>

    <div class="section btn-container">

      <button class="print-btn" @click="printInvoice">Save PDF</button>

    </div>

  </section>

  <div class="no-print">
    <Footer/>
  </div>


</template>

<style scoped lang="scss">

.print-only {
  display: none;
}

.invoice {
  padding: 0;
  background: var(--primary-bg);
  color: var(--primary-text-color);

  .section {
    padding: 1rem;
    margin-bottom: 0;

    @media (min-width: 600px) {
      width: calc(100% - 40px);
      max-width: 1200px;
      margin: 0 auto;
      border-radius: 12px;

      &.btn-container {
        background: transparent;
      }

    }

    h3 {
      font-size: var(--heading-3);
      color: var(--secondary-text-color);
      font-weight: normal;
      height: 50px;
      align-content: center;
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
        grid-template-columns: repeat(3, 1fr);
      }

      .item {
        display: grid;
        grid-template-columns: 1fr 1fr;
        font-size: var(--body-text);

        .label {
          height: 36px;
          font-weight: 600;
          align-content: center;
        }

        .data {
          color: var(--secondary-text-color);
          height: 36px;
          align-content: center;
          padding: 10px;
          border-radius: 10px;

          @media (min-width: 600px) {
            padding: 0;
            border-radius: 0;
          }

          @media (min-width: 1024px) {
            padding: 0;
            border-radius: 0;
          }
        }
      }
    }

    .profile-info {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;

      @media (min-width: 600px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (min-width: 1024px) {
        grid-template-columns: repeat(3, 1fr);
      }

      .item {
        display: grid;
        grid-template-columns: 1fr 1fr;
        font-size: var(--body-text);

        .label {
          height: 36px;
          font-weight: 600;
          align-content: center;
        }

        .data {
          color: var(--secondary-text-color);
          height: 36px;
          align-content: center;
          padding: 10px;
          border-radius: 10px;

          @media (min-width: 600px) {
            padding: 0;
            border-radius: 0;
          }

          @media (min-width: 1024px) {
            padding: 0;
            border-radius: 0;
          }
        }
      }
    }
  }

  .print-btn {
    font-size: var(--text-button-Text);
    padding: 10px 15px;
    height: 36px;
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
    width: 100%;
    max-width: 1280px;
  }

  @page {
    margin: 0;
    padding: 0;
  }

  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html,
    body {
      font-size: var(--body-text);
      margin: 0;
      padding: 0;
      color: var(--primary-text-color);
      background: var(--primary-bg);
    }

    @page {
      size: A4;
      margin: 0;
    }

    .no-print {
      display: none !important;
    }

    .print-only {
      display: block !important;
      width: 100%;
      max-width: 1280px;
    }

    .invoice {
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
      padding: 30px;
    }

    .section {
      padding: 20px;
      margin: 0 auto;

      h3 {
        font-size: var(--heading-3);
        margin-bottom: 10px;
        height: 50px;
        align-content: center;
        color: var(--secondary-text-color);
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;

        @media (min-width: 600px) {
          grid-template-columns: repeat(2, 1fr) !important;
          margin: 0 auto;
        }

        .item {
          display: grid;
          grid-template-columns: 1fr 1fr;
          font-size: var(--body-text);

          .label {
            height: 36px;
            font-weight: 600;
            align-content: center;
          }

          .data {
            color: var(--secondary-text-color);
            height: 36px;
            align-content: center;
            padding: 10px;
            border-radius: 10px;

            @media (min-width: 600px) {
              padding: 0;
              border-radius: 0;
            }

            @media (min-width: 1024px) {
              padding: 0;
              border-radius: 0;
            }
          }
        }
      }


    }

    .print-header {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      h1 {
        font-size: var(--heading-1);
        letter-spacing: 1px;
        color: var(--accent-color);
        text-transform: uppercase;
        margin: 0;
      }

      .logo {
        width: 100px;
        height: auto;
      }
    }

    .print-footer {
      display: flex !important;
      justify-content: space-between;
      align-items: center;
      margin-top: 40px;
      padding-top: 10px;
      font-size: 12px;
      color: var(--primary-text-color);

      .contact-info {
        p {
          margin: 2px 0;

          span {
            font-weight: 600;
            color: var(--secondary-text-color);
          }
        }
      }

      .small-logo {
        width: 100px;
        height: auto;
      }
    }

    .btn-container,
    .invoice-content {
      display: none !important;
    }

    .print-date {
      text-align: right;
      font-size: var(--small-text);
      color: var(--secondary-bg);
      margin-top: 20px;
    }
  }
}
</style>
