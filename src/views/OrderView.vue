<template>
  <NavbarComponent v-if="$route.path != '/login'" :username="name" :role="role_id"></NavbarComponent>

  <div class="container-fluid mt-4">
    <div v-if="loading">
      <h4>Loading Data...</h4>
    </div>
    <div class="row" v-else>
      <div class="col-12 col-sm-8 mb-2">
        <div class="col-12">
          <div class="form-group">
            <input type="text" v-model="keyword" class="form-control" placeholder="Search here..." />
          </div>
        </div>
        <div class="col-12 mt-4">
          <div class="row">
            <div class="col-12 mb-2 col-md-3 col-sm-6" v-for="item in filteredItems">
              <div class="card">
                <img v-if="item.image" :src="imageUrl + item.image" style="height: 150px" ss="card-img-top object-fit-cover" alt="..." />
                <img v-else src="@/assets/images/default.jpg" style="height: 150px" ss="card-img-top object-fit-cover" alt="..." />
                <div class="card-body text-center">
                  <h5 class="card-title">{{ item.name }}</h5>
                  <p class="card-text">{{ new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumSignificantDigits: 3 }).format(item.price) }}</p>
                  <ButtonComponent @click="order(item.id)"> </ButtonComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-sm-4 border rounded border-primary-subtle mb-2">
        <h2 class="mb-3">Order List</h2>
        <div class="border rounded p-2 border-success-subtle mb-3">
          <div class="mb-3">
            <label for="" class="form-label small">Customer Detail</label>
            <input type="text" name="customer_name" id="customer_name" placeholder="Customer Name" class="form-control" v-model="customer_name" />
          </div>
          <div class="mb-3">
            <input type="number" name="table_no" id="table_no" placeholder="Table Number" class="form-control" v-model="table_no" />
          </div>
        </div>
        <!--  -->
        <div class="mb-3" v-for="order in orders">
          <div class="item-box d-flex justify-content-between">
            <span v-html="orderDescription(order)"></span>
            <span>Rp {{ Intl.NumberFormat("id-ID").format(order.price) }}</span>
          </div>
          <div>
            <button class="btn btn-outline-success btn-sm me-1" @click="decreaseItemQty(order)">-</button>
            <button class="btn btn-outline-success btn-sm me-1" @click="increaseItemQty(order)">+</button>
            <button class="btn btn-outline-danger btn-sm" @click="deleteItem(order)">Cancel</button>
          </div>
        </div>
        <!--  -->
        <hr />

        <div class="total-box d-flex justify-content-between">
          <span>Total</span>
          <span>Rp {{ Intl.NumberFormat("id-ID").format(totalPrice) }} </span>
        </div>
        <div class="d-grid mt-3 col-8 mx-auto">
          <button class="btn btn-success btn-sm" type="submit" @click="submitOrder()" :disabled="onSubmit">
            {{ onSubmit ? "Ordering..." : "Submit" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import router from "@/router";
import { useItemStore } from "@/stores/item";
//

const imageUrl = ref("http://localhost:5173/@fs/C:/laragon/www/food_order/storage/app/public/image-item/");
const name = ref("");
const keyword = ref("");
// const filteredItems = ref([]);

const itemStore = useItemStore();
const items = ref([]);
const token = localStorage.getItem("token");
const role_id = ref("");
const loading = ref(true);
onMounted(() => {
  name.value = localStorage.getItem("name");
  role_id.value = localStorage.getItem("role_id");
  if (!name.value) {
    router.push({ name: "login" });
  }

  if (role_id.value != 4 && role_id.value != 1) {
    router.push({ name: "home" });
  }
});

// get items
onMounted(() => {
  axios
    .get("http://127.0.0.1:8000/api/item", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      items.value = response.data.data;
    })
    .catch(function (error) {
      console.log(error);
      itemStore.forceLogout(error.response.status);
    })
    .finally(() => {
      loading.value = false;
    });
});

// order descripton html element
function orderDescription(order) {
  return `${order.name} <small class="text-muted small">@${order.perPrice}</small> (x${order.quantity})`;
}

// order
const orders = ref([]);
function order(id) {
  // mencari Item sesuai dngan ID yg di click order
  const item = filteredItems.value.filter((item) => item.id == id)[0];
  // menyalin ulang object
  let orderItem = Object.assign({}, item);
  let OrderIndexItem = orders.value.map((o) => o.id).indexOf(orderItem.id);

  // inisialisasi properti baru
  orderItem.perPrice = orderItem.price;

  if (OrderIndexItem != -1) {
    // menambah quantity ke dalam pesanan yg udah ada
    orders.value[OrderIndexItem].quantity += 1;

    // order yg terfilter (.price) dikali dengan orderItem.perPrice (dari items asli)
    orders.value[OrderIndexItem].price = orderItem.perPrice * orders.value[OrderIndexItem].quantity;
  } else {
    // memasukan object kedalam array Orders
    orderItem.quantity = 1;
    orders.value.push(orderItem);
  }
}

// decrease the item
function decreaseItemQty(item) {
  let indexOfArrayItem = orders.value.map((e) => e.id).indexOf(item.id);
  if (orders.value[indexOfArrayItem].quantity > 1) {
    orders.value[indexOfArrayItem].quantity -= 1;
    orders.value[indexOfArrayItem].price = orders.value[indexOfArrayItem].perPrice * orders.value[indexOfArrayItem].quantity;
  } else {
    alert("Order berada di batas Minimal");
  }
}

// increase the item
function increaseItemQty(item) {
  let indexOfArrayItem = orders.value.map((e) => e.id).indexOf(item.id);
  orders.value[indexOfArrayItem].quantity += 1;
  orders.value[indexOfArrayItem].price = orders.value[indexOfArrayItem].perPrice * orders.value[indexOfArrayItem].quantity;
}

// delete item order
function deleteItem(item) {
  let indexOfArrayItem = orders.value.map((o) => o.id).indexOf(item.id);
  orders.value.splice(indexOfArrayItem, 1);
}

//  submit ORDER
const customer_name = ref("");
const table_no = ref("");
const onSubmit = ref(false);
function submitOrder() {
  const arrayOrderId = orders.value.map((order) => ({ id: order.id, quantity: order.quantity }));

  if (customer_name.value.length == 0 || table_no.value.length == 0 || arrayOrderId.length == 0) {
    alert("Customer Detail & Order cant be empty.");
    return;
  }

  onSubmit.value = true;
  axios
    .post(
      "http://127.0.0.1:8000/api/order",
      {
        customer_name: customer_name.value,
        table_no: table_no.value,
        items: arrayOrderId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then(function (response) {
      console.log(response);
      alert("Order Success");
      customer_name.value = "";
      table_no.value = "";
      orders.value = [];
    })
    .catch(function (error) {
      console.log(error);
      itemStore.forceLogout(error.response.status);
    })
    .finally(() => {
      onSubmit.value = false;
    });
}

// count total price
const totalPrice = computed(() => {
  return orders.value.reduce((total, item) => total + item.price, 0);
});

// const ppnPrice = computed(() => {
//   const ppn = (10 / 100) * totalPrice.value;
//   return ppn;
// });

// // original price
// let originalPrice = computed(() => {
//   return totalPrice.value + ppnPrice.value;
// });

// filtered Items
const filteredItems = computed(() => {
  return items.value.filter((item) => item.name.toLowerCase().includes(keyword.value));
});
</script>

<style scoped>
.item-box {
  font-size: 18px;
}
.total-box {
  font-size: 20px;
  font-weight: bold;
}
</style>
