<template>
  <header>
    <NavbarComponent :username="name" :role="role_id"></NavbarComponent>
  </header>
  <div class="container mt-4">
    <div class="subtitle">
      <h3>Order Report</h3>
    </div>
    <div class="my-2">
      <button class="btn m-1 btn-sm btn-success" :disabled="disableBtn" @click="generatePdf()">Generate PDF</button>
      <button class="btn btn-sm btn-danger" :disabled="disableBtn" @click="exportToExcel()">Export to Excel</button>
    </div>
    <div class="my-2">
      <select class="form-select w-50" aria-label="Default select example" v-model="selectedMonth" @change="handleMonthChange()">
        <option v-for="month in months" :disabled="month.disabled" :value="month.id">{{ month.month }}</option>
      </select>
    </div>
    <div ref="pdfContent" id="content" class="px-3 pt-1">
      <div class="row mt-3 gap-2">
        <div class="col border text-center py-3 rounded bg-info">
          <div class="fw-bold">Total Income</div>
          <div class="fs-3">{{ Intl.NumberFormat("id-ID").format(orders.totalPayment ?? 0) }}</div>
        </div>
        <div class="col border text-center py-3 rounded bg-success">
          <div class="fw-bold">Order Count</div>
          <div class="fs-3">{{ orders.orderCount ?? 0 }}</div>
        </div>
        <div class="col border text-center py-3 rounded bg-warning">
          <div class="fw-bold">Highest Order</div>
          <div class="fs-3">{{ Intl.NumberFormat("id-ID").format(orders.maxPayment ?? 0) }}</div>
        </div>
        <div class="col border text-center py-3 rounded bg-danger">
          <div class="fw-bold">Lowest Order</div>
          <div class="fs-3">{{ Intl.NumberFormat("id-ID").format(orders.minPayment ?? 0) }}</div>
        </div>
      </div>
      <div class="row mt-2 mb-5">
        <table class="table table-striped table-bordered">
          <thead>
            <tr>
              <th>No</th>
              <th>Customer</th>
              <th style="width: 5%">Table</th>
              <th style="width: 10%">Date</th>
              <th style="width: 10%">Time</th>
              <th>Total (Rp)</th>
              <th style="width: 10%">Status</th>
              <th>Waitress</th>
              <th>Cashier</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loadingData">
              <td colspan="9" class="text-center">Loading...</td>
            </tr>
            <tr v-else v-for="(order, index) in orders.orders" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ order.customer_name }}</td>
              <td>{{ order.table_no }}</td>
              <td>{{ order.order_date }}</td>
              <td>{{ order.order_time }}</td>
              <td>{{ Intl.NumberFormat("id-ID").format(order.total) }}</td>
              <td>
                <span :class="{ 'badge text-bg-warning': order.status == 'Done', 'badge text-bg-success': order.status == 'Paid', 'badge text-bg-primary': order.status == 'Ordered' }">{{ order.status }}</span>
              </td>
              <td>{{ order.waitress.name }}</td>
              <td>
                <span v-if="order.cashier">{{ order.cashier.name }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
//SECTION Import
import NavbarComponent from "@/components/NavbarComponent.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useItemStore } from "@/stores/item";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
//END SECTION

const disableBtn = ref(true);
const name = ref("");
const role_id = ref("");
const pdfContent = ref(null);
const doc = new jsPDF("l", "px", "a4");
const itemStore = useItemStore();
const months = [
  { id: "", month: "Select Month", disabled: true },
  { id: 1, month: "January" },
  { id: 2, month: "February" },
  { id: 3, month: "March" },
  { id: 4, month: "April" },
  { id: 5, month: "May" },
  { id: 6, month: "June" },
  { id: 7, month: "July" },
  { id: 8, month: "August" },
  { id: 9, month: "September" },
  { id: 10, month: "October" },
  { id: 11, month: "November" },
  { id: 12, month: "December" },
];
const selectedMonth = ref("");
onMounted(() => {
  name.value = localStorage.getItem("name");
  role_id.value = localStorage.getItem("role_id");
  if (!name.value) {
    router.push({ name: "login" });
  }

  if (role_id.value != 4) {
    router.push({ name: "home" });
  }
});

const orders = ref([]);
const loadingData = ref(false);
function handleMonthChange() {
  loadingData.value = true;
  disableBtn.value = false;
  axios
    .get(`http://127.0.0.1:8000/api/order/report?month=${selectedMonth.value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      console.log(response);
      orders.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      itemStore.forceLogout(error.response.status);
    })
    .finally(() => {
      loadingData.value = false;
    });
}

function generatePdf() {
  html2canvas(pdfContent.value)
    .then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      doc.save("order_report.pdf");

      canvas.remove();
    })
    .then((response) => {
      setTimeout(() => {
        window.location.reload();
      }, 333);
    })
    .catch((error) => {
      console.log(error);
    });
}

function exportToExcel() {
  const data = orders.value.orders;

  const mappedData = data.map((item) => ({
    Customer: item.customer_name,
    Table: item.table_no,
    Date: item.order_date,
    Time: item.order_time,
    Status: item.status,
    Total: item.total,
    Waitress: item.waitress?.name,
    Cashier: item.cashier?.name,
  }));

  const worksheet = XLSX.utils.json_to_sheet(mappedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, "data.xlsx");
}
</script>

<style></style>
