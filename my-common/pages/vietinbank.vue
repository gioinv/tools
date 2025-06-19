<template>
  <div class="flex flex-col items-center justify-center bg-gray-50 px-4">

    <div class="w-3/4">
      <textarea rows="5" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Past payload" v-model="payload"></textarea>
      <div class="flex gap-4 mb-5">
        <div class="flex-1">
          <label class="block mb-1 text-sm font-medium text-gray-700">Month</label>
          <select v-model="selectedMonth"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="month in 12" :key="month" :value="month">{{ month }}</option>
          </select>
        </div>

        <div class="flex-1">
          <label class="block mb-1 text-sm font-medium text-gray-700">Year</label>
          <select v-model="selectedYear"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <div class="text-center"><button @click="handleSubmit"
          class="w-1/2 bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-200">
          Send
        </button></div>
      <hr class="my-5" />
      <div>
        <table class="table-auto border border-black w-full text-sm">
          <thead>
            <tr>
              <th colspan="3" class="border border-black px-2 py-1 text-center">Ngày tháng ghi sổ</th>
              <th rowspan="2" class="border border-black px-2 py-1 text-center">DIỄN GIẢI</th>
              <th colspan="3" class="border border-black px-2 py-1 text-center">SỐ TIỀN</th>
              <th rowspan="2" class="border border-black px-2 py-1 text-center">Ghi chú</th>
            </tr>
            <tr>
              <th class="border border-black px-2 py-1">A</th>
              <th class="border border-black px-2 py-1">B<br>Số hiệu</th>
              <th class="border border-black px-2 py-1">C<br>Ngày tháng</th>
              <th class="border border-black px-2 py-1">Thu (gửi vào)</th>
              <th class="border border-black px-2 py-1">Chi (rút ra)</th>
              <th class="border border-black px-2 py-1">Còn lại</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-black px-2 py-1"></td>
              <td class="border border-black px-2 py-1"></td>
              <td class="border border-black px-2 py-1"></td>
              <td class="border border-black px-2 py-1">Số dư đầu kỳ</td>
              <td class="border border-black px-2 py-1"></td>
              <td class="border border-black px-2 py-1"></td>
              <td class="border border-black px-2 py-1">xxx</td>
              <td class="border border-black px-2 py-1"></td>
            </tr>
            <tr v-for="(item, index) in result" :key="index">
              <td class="border border-black px-2 py-1">{{ item.tranDate }}</td>
              <td class="border border-black px-2 py-1">{{ item.trxId }}</td>
              <td class="border border-black px-2 py-1">{{ item.tranDate }}</td>
              <td class="border border-black px-2 py-1">{{ item.remark }}</td>
              <td class="border border-black px-2 py-1"> {{ item.income }}</td>
              <td class="border border-black px-2 py-1">{{ item.outcome }}</td>
              <td class="border border-black px-2 py-1"></td>
              <td class="border border-black px-2 py-1"></td>
            </tr>
          </tbody>
        </table>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const payload = ref('')
const result = ref('')
const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())
const years = [selectedYear.value, selectedYear.value - 1, selectedYear.value - 2]

const formatAmount = amountStr => {
  const num = parseFloat(amountStr.replace(/,/g, ''));
  return isNaN(num) ? '' : new Intl.NumberFormat('en-US').format(num);
};
async function handleSubmit() {
  
  const fromDate = `01/${selectedMonth.value.toString().padStart(2, '0')}/${selectedYear.value}`
  const toDate = new Date(selectedYear.value, selectedMonth.value, 0)
  const formattedToDate = `${toDate.getDate().toString().padStart(2, '0')}/${selectedMonth.value.toString().padStart(2, '0')}/${selectedYear.value}`

  const data = payload.value ? JSON.parse(payload.value) : {}
  data.fromDate = fromDate
  data.toDate = formattedToDate

  try {
    /* const response = await $fetch('https://efast.vietinbank.vn/api/v1/account/history', {
      method: 'POST',
      body: data
    })
    const transactions = response.data.transactions */
    let rs = [
      {
        "tranDate": "31-05-2025 10:06:31",
        "remark": "MST 0315384007 CDCS EBISOLVN nop 30 DPCD thang 05 nam 2025",
        "amount": "-865800.0",
        "balance": "7987764.00",
        "currency": "VND",
        "trxId": "46emW-80Y9XQbnK",
        "dorc": "D",
        "branchId": "90043",
        "branchName": "CN TP HCM - PGD DINH TIEN HOANG",
        "channel": "77 - eFAST - Corporate Internet Banking",
        "corresponsiveAccount": "119000005242",
        "corresponsiveName": "LIEN DOAN LAO DONG Q1",
        "trxRefNo": "185",
        "pmtType": "DW",
        "trnNum": "",
        "endAmt": "",
        "beginAmt": "",
        "numberOrder": 1,
        "beneficiaryBankId": "90298",
        "beneficiaryBankName": "90298 - CN 1 - TP HCM - HOI SO",
        "transferBankName": "90043 - CN TP HCM - PGD DINH TIEN HOANG",
        "businessDate": "",
        "originalAmt": "",
        "originalCurrency": "",
        "tranTypeName": "",
        "bankType": "1",
        "pmtId": "",
        "trnSrc": null,
        "tellerId": "",
        "customerCode": null
      },
      {
        "tranDate": "31-05-2025 02:08:44",
        "remark": "Tra lai tai khoan DDA",
        "amount": "+102",
        "balance": "8853564.00",
        "currency": "VND",
        "trxId": "184",
        "dorc": "C",
        "branchId": "",
        "branchName": "Back Office Operations",
        "channel": "",
        "corresponsiveAccount": "",
        "corresponsiveName": "",
        "trxRefNo": "184",
        "pmtType": "IIPD",
        "trnNum": "",
        "endAmt": "",
        "beginAmt": "",
        "numberOrder": 2,
        "beneficiaryBankId": null,
        "beneficiaryBankName": "",
        "transferBankName": "Back Office Operations",
        "businessDate": "",
        "originalAmt": "",
        "originalCurrency": "",
        "tranTypeName": "",
        "bankType": "0",
        "pmtId": "",
        "trnSrc": null,
        "tellerId": "",
        "customerCode": null
      }]

    //sort
    rs = rs.sort((a, b) => {
      const parseDate = str => {
        if (!str || typeof str !== 'string') return new Date(0); // fallback to epoch
        const [day, month, rest] = str.split("-");
        if (!rest) return new Date(0);
        const [year, time] = rest.split(" ");
        return new Date(`${year}-${month}-${day}T${time}`);
      };

      return parseDate(a.tranDate) - parseDate(b.tranDate);
    });

    rs = rs.map(item => {
      const [day, month, yearTime] = item.tranDate.split("-");
      const [year, time] = [yearTime.slice(0, 4), yearTime.slice(5)];

      const newTranDate = `${day}/${month}/${year}`;
      const newTrxId = `${day}${month}${year}`;
      const income = item.amount.startsWith('+') ? item.amount.slice(1) : '';
      const outcome = item.amount.startsWith('-') ? item.amount.slice(1) : '';

      return {
        ...item,
        tranDate: newTranDate,
        trxId: newTrxId,
        income: formatAmount(income),
        outcome: formatAmount(outcome)
      };
    });

    result.value = rs
  } catch (error) {
    console.error('Error:', error)
  }

}
handleSubmit()
</script>
