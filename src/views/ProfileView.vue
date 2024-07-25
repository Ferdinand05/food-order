<template>
  <NavbarComponent :username="name" :role="role_id"></NavbarComponent>
  <div class="container mt-4">
    <main v-if="userDetail.role">
      <h2>My Profile</h2>
      <div class="small text-muted">Account Created at {{ new Date(userDetail.created_at).toLocaleString("id-ID") }}</div>
      <div class="badge text-bg-primary mt-4">{{ userDetail.role.name }}</div>
      <div class="row mt-2">
        <div class="col-lg-6 col-md-7">
          <div class="mb-3">
            <label for="username">Username</label>
            <input type="text" name="username" id="username" class="form-control" v-model="userDetail.name" />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-md-7">
          <div class="mb-3">
            <label for="email">Email</label>
            <input type="text" name="email" id="email" class="form-control" :disabled="true" :value="userDetail.email" />
          </div>
        </div>
      </div>
      <div>
        <ButtonComponent @click="updateProfile(userDetail.id)">Update</ButtonComponent>
      </div>
    </main>
    <div class="text-muted fs-3" v-else>Loading............</div>
  </div>
</template>

<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import router from "@/router";
import { RouterLink, useRoute } from "vue-router";
import { ref, onMounted, onBeforeMount } from "vue";
import axios from "axios";
import { useItemStore } from "@/stores/item";

const itemStore = useItemStore();
const name = ref(localStorage.getItem("name"));
const role_id = ref(localStorage.getItem("role_id"));

let userDetail = ref("");
function getDetailUser() {
  axios
    .get("http://127.0.0.1:8000/api/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      userDetail.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
      itemStore.forceLogout(error.response.status);
    });
}

onMounted(() => {
  getDetailUser();
});

// update User Profile
function updateProfile(user_id) {
  axios
    .put(
      `http://127.0.0.1:8000/api/user/${user_id}`,
      {
        name: userDetail.value.name,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      localStorage.setItem("name", response.data.data.name);
      alert("Profile Updated Successfully");
    })
    .catch((error) => {
      console.log(error);
      itemStore.forceLogout(error.response.status);
    });
}
</script>
