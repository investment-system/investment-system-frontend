<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '@/composables/useApi'

const api = useApi()
const route = useRoute()

const transaction = ref<any>(null)
const profile = ref<any>({})
const profileData = ref<any[]>([])
const loading = ref(true)
const error = ref('')

const SOURCE_TYPE_LABELS: Record<string, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  share: 'Share',
  payment: 'Payment',
  cancellation: 'Cancellation',
  registration_payments: 'Registration Payment',
  Profit_payments: 'Profit Payment'
}
const DIRECTION_LABELS: Record<string, string> = {
  in: 'In',
  out: 'Out',
  reinvest: 'Reinvest'
}
const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
  ewallet: 'E-Wallet'
}

const getMemberInfo = async (member_id: number) => {
  try {
    const { data } = await api.get(`/members/detail/${member_id}/`)
    profile.value = data

    profileData.value = [
      { label: 'Name', value: data.full_name },
      { label: 'Email', value: data.email },
      { label: 'Gender', value: data.gender },
      { label: 'Contact Number', value: data.phone_number },
      { label: 'Country', value: data.country },
      { label: 'Street Address', value: data.address_line },
      { label: 'City', value: data.city },
      { label: 'State', value: data.state },
      { label: 'Bank Name', value: data.bank_name },
      { label: 'Account Holder', value: data.account_holder_name },
      { label: 'Account Number', value: data.bank_account_number }
    ]
  } catch (err) {
    console.error('Error fetching member info:', err)
  }
}

const fetchTransaction = async () => {
  loading.value = true
  error.value = ''
  try {
    const { data } = await api.get(`/transactions/transactions/${route.params.id}/`)
    transaction.value = {
      ...data,
      source_type: SOURCE_TYPE_LABELS[data.source_type] || data.source_type,
      direction: DIRECTION_LABELS[data.direction] || data.direction,
      payment_method: PAYMENT_METHOD_LABELS[data.payment_method] || data.payment_method
    }

    if (transaction.value.member) {
      await getMemberInfo(transaction.value.member)
    } else {
      profile.value = {}
      profileData.value = []
    }

  } catch (err) {
    console.error('Error fetching transaction:', err)
    error.value = 'Unable to fetch transaction.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTransaction()
})

const invoiceSection = ref<HTMLElement | null>(null)
const printInvoice = () => {
  const originalTitle = document.title
  document.title = `Invoice_${transaction.value?.transaction_code || 'INV'}`
  window.print()
  setTimeout(() => {
    document.title = originalTitle
  }, 1000)
}
</script>

<template>

  <div class="no-print">
    <AdministratorsHeader/>
  </div>

  <section class="invoice invoice-body" ref="invoiceSection">

    <div class="print-only print-header">
      <img src="/images/logo.png" alt="koperasi masjid logo" class="koperasi masjid logo"/>
      <h1>INVOICE</h1>
    </div>

    <div class="section profile">
      <h3>Investor Profile</h3>
      <hr class="divider"/>

      <div class="profile-info">
        <div class="item" v-for="(item, index) in profileData" :key="index">
          <label class="label">{{ item.label }}</label>
          <p class="data">{{ item.value }}</p>
        </div>
      </div>

    </div>

    <div class="section invoice">
      <h3>Transaction & Invoice</h3>
      <hr class="divider"/>
      <div class="grid">

        <div class="item">
          <span class="label">Invoice ID</span>
          <span class="data">{{ transaction?.reference_id }}</span>
        </div>

        <div class="item">
          <span class="label">Reference Code</span>
          <span class="data">{{ transaction?.transaction_code }}</span>
        </div>

        <div class="item">
          <span class="label">Date</span>
          <span class="data">{{ transaction?.created_at?.split('T')[0] }}</span>
        </div>

        <div class="item">
          <span class="label">Transaction Type</span>
          <span class="data">{{ transaction?.source_type }}</span>
        </div>

        <div class="item">
          <span class="label">mount (MYR)</span>
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
          <span class="label file-label">Invoice Document</span>
          <span class="data file-data">
            <a v-if="transaction?.received_invoice_doc"
               :href="transaction.received_invoice_doc"
               target="_blank">View Document</a>
            <span v-else>No document</span>
          </span>
        </div>
      </div>
    </div>

    <div class="section investment"
         v-if="transaction?.source_type === 'Share' && transaction?.share_record">
      <h3>Share Investment Overview</h3>
      <hr class="divider"/>
      <div class="grid profit-cancel-container">
        <div class="item"><span class="label">Activity</span><span class="data">{{
            transaction.share_record.project_name
          }}</span></div>
        <div class="item"><span class="label">Investment Date</span><span
            class="data">{{ transaction.share_record.share_date }}</span></div>
        <div class="item"><span class="label">Profit Rate</span><span
            class="data">{{ transaction.share_record.share_return_rate }}%</span></div>
        <div class="item"><span class="label">Duration (Days)</span><span
            class="data">{{ transaction.share_record.share_duration_days }}</span></div>
        <div class="item"><span class="label">Status</span><span class="data">{{
            transaction.share_record.status
          }}</span></div>
      </div>

      <div class="profit" v-if="transaction.share_record.profit">
        <h3>Profit Settlement</h3>
        <hr class="divider"/>
        <div class="grid">
          <div class="item"><span class="label">Payout Type</span><span
              class="data">{{ transaction.share_record.profit.payout_type }}</span></div>
          <div class="item"><span class="label">Profit Amount</span><span
              class="data">{{ transaction.share_record.profit.profit_amount }}</span></div>
          <div class="item"><span class="label">Refund Amount</span><span
              class="data">{{ transaction.share_record.profit.refund_amount }}</span></div>
        </div>
      </div>

      <div class="cancel" v-else-if="transaction.share_record.cancel">
        <h3>Cancellation Details</h3>
        <hr class="divider"/>
        <div class="grid ">
          <div class="item"><span class="label">Cancel Penalty Amount</span><span
              class="data">{{ transaction.share_record.cancel.penalty_amount }}</span></div>
          <div class="item"><span class="label">Refund Amount</span><span
              class="data">{{ transaction.share_record.cancel.refund_amount }}</span></div>
        </div>
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
  padding: 20px 0;
  background: var(--primary-bg);
  color: var(--primary-text-color);

  .section {
    padding: 20px;
    margin-bottom: 0;

    @media (min-width: 600px) {
      width: calc(100% - 80px);
      max-width: 1200px;
      margin: 0 auto;

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

    .grid,
    .profile-info {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0 20px;

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

        .file-data {
          background-color: var(--input-field-bg);
          align-self: center;
          justify-self: center;
          text-align: center;
          width: 100%;
          border-radius: 6px;
          transition: var(--transition);

          &:hover {
            background: var(--hover-input-field-bg);
          }

        }
      }

      .profit-cancel-container {
        padding: 0 !important;
        margin: 0 !important;
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
      font-size: var(--small-text) !important;
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

      .grid,
      .profile-info {
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
          font-size: var(--small-text);

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

          .file-data,
          .file-label {
            display: none;
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
      font-size: var(--small-text);
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
