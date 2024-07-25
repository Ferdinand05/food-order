<template>
  <NavbarComponent v-if="$route.path != '/login'" :username="name" :role="role_id"> </NavbarComponent>

  <div class="container mt-3">
    <div class="row">
      <div class="col-lg-9">
        <h2>Halaman Home</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia assumenda nesciunt, culpa ex dolores sit, libero, suscipit a consequuntur tenetur doloribus totam praesentium et animi?</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi unde quaerat quis asperiores! Recusandae laborum impedit consectetur voluptatem placeat cum reprehenderit laboriosam aliquam amet, harum hic sed alias illo aut
          quis id cupiditate itaque suscipit excepturi dolorum nesciunt. Dolore sit quidem sequi dolores sint, architecto quaerat aut omnis quo molestiae.
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import NavbarComponent from "@/components/NavbarComponent.vue";
import router from "@/router";
import { ref, onMounted } from "vue";

const name = ref("");
const role_id = ref("");
onMounted(() => {
  name.value = localStorage.getItem("name");
  role_id.value = localStorage.getItem("role_id");
  if (!name.value) {
    router.push({ name: "login" });
  }
});
</script>
<style></style>
