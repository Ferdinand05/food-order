<template>
  <header>
    <NavbarComponent v-if="$route.path != '/login'" :username="username" :role="role_id"></NavbarComponent>
  </header>
  <div class="container mt-4">
    <div>
      <h2>Order Detail</h2>
      <small><RouterLink :to="{ name: 'home' }" style="text-decoration: none">Home</RouterLink> &rsaquo; <RouterLink :to="{ name: 'orderList' }" style="text-decoration: none">Order List</RouterLink> &rsaquo; Order Detail </small>
    </div>
    <div class="row mt-4">
      <div class="col-12 col-lg-10">
        <div class="mb-3">
          <div class="text-muted small">Set Status</div>
          <button class="btn btn-warning me-2" v-if="orderDetail.status == 'Ordered' && role_id == 2" @click="setAsDone(orderDetail.id)">set as Done</button>
          <button class="btn btn-success" v-if="orderDetail.status == 'Done' && (role_id == 3 || role_id == 4)" @click="setAsPaid(orderDetail.id)">set as Paid</button>
        </div>
        <div class="card mb-5">
          <div class="card-header">
            Customer Name, <b>{{ orderDetail.customer_name }}</b>
          </div>
          <div class="card-body">
            <div class="py-2">
              <div>
                Table <span class="badge text-bg-success">{{ orderDetail.table_no }}</span>
              </div>
              <div>
                Status <span :class="{ 'badge text-bg-warning': orderDetail.status == 'Done', 'badge text-bg-success': orderDetail.status == 'Paid', 'badge text-bg-primary': orderDetail.status == 'Ordered' }">{{ orderDetail.status }}</span>
              </div>
            </div>
            <table class="table table-sm table-bordered table-success">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="detail in orderDetail.order_detail">
                  <td>{{ detail.item.name }}</td>
                  <td>{{ Intl.NumberFormat("id-ID").format(detail.item.price) }}</td>
                  <td>{{ detail.qty }}</td>
                  <td>{{ Intl.NumberFormat("id-ID").format(detail.item.price * detail.qty) }}</td>
                </tr>
              </tbody>
            </table>
            <h5>Total : {{ Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(orderDetail.total) }}</h5>
          </div>
          <div class="card-footer">
            <small>Created at {{ orderDetail.order_date }} : {{ orderDetail.order_time }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useItemStore } from "@/stores/item";
import { RouterLink, useRoute } from "vue-router";
// ------------------------------------------------------------- //
const itemStore = useItemStore();
const username = ref(localStorage.getItem("name"));
const role_id = ref(localStorage.getItem("role_id"));
const route = useRoute();
const orderId = route.params.orderId;

// ketika halaman di Load
onMounted(() => {
  getDetailOrder();
});

const orderDetail = ref("");
function getDetailOrder() {
  axios
    .get(`http://127.0.0.1:8000/api/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(function (response) {
      console.log(response.data.data);
      orderDetail.value = response.data.data;
    })
    .catch(function (error) {
      console.log(error);
      itemStore.forceLogout(error.response.status);
    });
}

// set Ordered as Done
function setAsDone(order_id) {
  axios
    .get(`http://127.0.0.1:8000/api/order/${order_id}/set-as-done`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(function (response) {
      console.log(response.data);
      orderDetail.value.status = response.data.data.status;
      alert("Status Changed!");
    })
    .catch(function (error) {
      console.log(error);
    });
}
// set Done as Paid
function setAsPaid(order_id) {
  axios
    .get(`http://127.0.0.1:8000/api/order/${order_id}/payment`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(function (response) {
      console.log(response.data);
      orderDetail.value.status = response.data.data.status;
      alert("Status Changed!");
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>
