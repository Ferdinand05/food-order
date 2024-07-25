<template>
  <NavbarComponent v-if="$route.path != '/login'" :username="name" :role="role_id"> </NavbarComponent>

  <div class="container mt-3">
    <div class="my-3">
      <h3>Create New Product</h3>
      <small><RouterLink :to="{ name: 'home' }" style="text-decoration: none">Home</RouterLink> &rsaquo; <RouterLink :to="{ name: 'product' }" style="text-decoration: none">Product</RouterLink> &rsaquo; Create Product</small>
    </div>
    <form action="" @submit.prevent="createProduct()" method="post" enctype="multipart/form-data">
      <div class="row">
        <div class="col-lg-9 col-md-8">
          <div class="mb-3">
            <label for="name" class="mb-2">Product Name</label>
            <input type="text" name="name" id="name" class="form-control" placeholder="Chicken" v-model="productName" />
          </div>
          <div class="mb-3">
            <label for="price" class="mb-2">Price</label>
            <input type="number" name="price" id="price" class="form-control" placeholder="0" v-model="productPrice" />
          </div>
          <div class="mb-3">
            <label for="image" class="mb-2">Upload Image <code>Optional</code></label>
            <input type="file" name="image" id="image" class="form-control" @change="imageChange($event)" />
          </div>
          <div class="alert alert-danger" v-show="!errors.values">
            <ul>
              <li v-for="error in errors" class="fst-italic">{{ error[0] }}</li>
            </ul>
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-success" :disabled="isCreating">
              {{ isCreating ? "Loading..." : "Create" }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import { ref, onMounted } from "vue";
import router from "@/router";
import { RouterLink } from "vue-router";
import { useItemStore } from "@/stores/item";
import axios from "axios";
const items = ref([]);
const itemStore = useItemStore();
const name = ref("");
const role_id = ref("");
const imageUrl = "http://localhost:5173/@fs/C:/laragon/www/food_order/storage/app/public/image-item/";
const token = localStorage.getItem("token");
const isCreating = ref();
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

const productName = ref("");
const productPrice = ref("");
const productImage = ref("");
const errors = ref([]);
function createProduct() {
  isCreating.value = true;
  const data = new FormData();
  data.append("name", productName.value);
  data.append("price", productPrice.value);
  data.append("image_file", productImage.value);

  axios
    .post("http://127.0.0.1:8000/api/item", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      console.log(response);
      itemStore.flashMessage = "Data Created Successfully";
      router.push({ name: "product" });
    })
    .catch(function (error) {
      console.log(error);
      errors.value = error.response.data.errors;
      console.log(errors.value);
    })
    .finally(() => {
      isCreating.value = false;
    });
}

function imageChange(e) {
  let file = e.target.files[0];
  productImage.value = file;
}
</script>
