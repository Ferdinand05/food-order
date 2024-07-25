<template>
  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useItemStore } from "./stores/item";

const itemStore = useItemStore();
</script>

<style scoped></style>
