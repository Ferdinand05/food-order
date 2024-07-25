<template>
  <NavbarComponent v-if="$route.path != '/login'" :username="name" :role="role_id"> </NavbarComponent>

  <div class="container mt-3">
    <div v-show="itemStore.flashMessage" class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Congratulation!</strong> {{ itemStore.flashMessage }}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    <div class="mt-3">
      <h3>Products</h3>
      <small><RouterLink :to="{ name: 'home' }" style="text-decoration: none">Home</RouterLink> &rsaquo; Product</small>

      <div class="my-3">
        <RouterLink :to="{ name: 'productCreate' }" class="btn btn-success btn-sm">Create Product</RouterLink>
      </div>
    </div>

    <table class="table table-striped my-4">
      <thead>
        <tr>
          <th>No</th>
          <th>Name</th>
          <th>Price</th>
          <th>Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items">
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ Intl.NumberFormat("id-ID").format(item.price) }}</td>
          <td>
            <img v-if="item.image" style="height: 80px; width: 100px" :src="imageUrl + item.image" :alt="item.image" class="img-fluid object-fit-cover" />
            <img v-else style="height: 80px; width: 100px" src="@/assets/images/default.jpg" :alt="item.image" class="img-fluid object-fit-cover" />
          </td>
          <td>
            <RouterLink class="btn btn-sm btn-primary" :to="{ name: 'productEdit', params: { productId: item.id } }">Edit</RouterLink> &nbsp;
            <button class="btn btn-sm btn-danger" @click="deleteProduct(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import router from "@/router";
import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useItemStore } from "@/stores/item";
const items = ref([]);
const itemStore = useItemStore();
const name = ref("");
const route = useRoute();
const role_id = ref("");
const imageUrl = "http://localhost:5173/@fs/C:/laragon/www/food_order/storage/app/public/image-item/";
const token = localStorage.getItem("token");
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

// get items
onMounted(() => {
  getItems();
});

function getItems() {
  axios
    .get("http://127.0.0.1:8000/api/item", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      items.value = response.data.data;
      console.log(items.value);
    })
    .catch(function (error) {
      console.log(error);
      itemStore.forceLogout(error.response.status);
    });
}

// delete item
function deleteProduct(id) {
  const status = confirm("Are you sure ? ");

  if (status) {
    axios
      .delete(`http://127.0.0.1:8000/api/item/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          //* mengisi ulang variable items(reactive) dan secara otomatis mengubahnya di view
          items.value = items.value.filter((item) => item.id !== id);

          // mengambil ulang data dari server/api
          // getItems();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
</script>
