<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom">
    <div class="container">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03" aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">Food Order</a>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item" v-show="role == 1 || role == 4">
            <RouterLink :to="{ name: 'order' }" class="nav-link">Order</RouterLink>
          </li>
          <li class="nav-item" v-show="role == 4">
            <RouterLink :to="{ name: 'orderReport' }" class="nav-link">Order Report</RouterLink>
          </li>
          <li class="nav-item" v-show="role == 4">
            <RouterLink :to="{ name: 'product' }" class="nav-link">Product</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink :to="{ name: 'orderList' }" class="nav-link">Order List</RouterLink>
          </li>
        </ul>

        <li class="nav-item dropdown navbar-nav">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"> Hi, {{ username }}</a>
          <ul class="dropdown-menu">
            <li><RouterLink class="dropdown-item" :to="{ name: 'profile' }">Profile</RouterLink></li>
            <li><a class="dropdown-item" href="#" @click="logout()">Logout</a></li>
          </ul>
        </li>
      </div>
    </div>
  </nav>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { RouterLink } from "vue-router";

const token = ref(localStorage.getItem("token"));
defineProps({
  username: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "",
  },
});

function logout() {
  // Send a POST request
  axios
    .get("http://127.0.0.1:8000/api/logout", {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    .then(function (response) {
      console.log(response);
      localStorage.removeItem("name");
      localStorage.removeItem("token");
      localStorage.removeItem("role_id");
      localStorage.removeItem("email");

      location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
}
</script>
