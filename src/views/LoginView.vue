<template>
  <div class="container d-flex justify-content-center align-items-center mt-5">
    <div class="card shadow-sm" style="width: 100%; max-width: 400px">
      <div class="card-body">
        <h2 class="text-center mb-4">Login</h2>
        <form @submit.prevent>
          <div class="mb-3">
            <label for="email" class="form-label">Email address</label>
            <input type="email" v-model="email" class="form-control" id="email" aria-describedby="emailHelp" />
            <small class="text-danger">{{ errorEmail }}</small>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" v-model="password" class="form-control" id="password" />
            <small class="text-danger">{{ errorPassword }}</small>
          </div>
          <button type="submit" @click="login()" class="btn btn-primary w-100">Login</button>
        </form>
        <p class="text-center mt-3">Don't have an account? <a href="#">Sign up</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

import axios from "axios";
import router from "@/router";
const email = ref("");
const password = ref("");
let errorEmail = ref("");
let errorPassword = ref("");
const name = ref("");
onMounted(() => {
  name.value = localStorage.getItem("name");
  if (name.value) {
    router.push({ name: "home" });
  }
});

function login() {
  // Send a POST request
  errorEmail.value = "";
  errorPassword.value = "";
  axios
    .post("http://127.0.0.1:8000/api/login", {
      email: email.value,
      password: password.value,
    })
    .then(function (response) {
      console.log(response.data.data);
      localStorage.setItem("email", response.data.data.user.email);
      localStorage.setItem("name", response.data.data.user.name);
      localStorage.setItem("role_id", response.data.data.user.role_id);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user_id", response.data.data.user.id);
      router.push({ name: "home" });
    })
    .catch(function (error) {
      errorEmail.value = error.response.data.errors.email ? error.response.data.errors.email[0] : "";
      errorPassword.value = error.response.data.errors.password ? error.response.data.errors.password[0] : "";
      console.log(error);
    });
}
</script>
