<template>
  <header>
    <NavbarComponent v-if="$route.path != '/login'" :username="username" :role="role_id"></NavbarComponent>
  </header>
  <div class="container mt-3">
    <div>
      <h2>Order List</h2>
      <small>to Manage orders</small>
    </div>
    <div class="mt-4">
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orderList" :key="index">
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
            <td>{{ order.cashier.name ? order.cashier.name : "-" }}</td>
            <td>
              <RouterLink :to="{ name: 'orderDetail', params: { orderId: order.id } }" class="btn btn-sm btn-primary">Detail</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useItemStore } from "@/stores/item";
import { RouterLink } from "vue-router";

const itemStore = useItemStore();
const username = ref(localStorage.getItem("name"));
const role_id = ref(localStorage.getItem("role_id"));

const orderList = ref();

function getOrderList() {
  axios
    .get("http://127.0.0.1:8000/api/order", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(function (response) {
      console.log(response);
      orderList.value = response.data.data;
    })
    .catch(function (error) {
      console.log(error);
      itemStore.forceLogout(error.response.status);
    });
}

onMounted(() => {
  getOrderList();
});
</script>
