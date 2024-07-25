import { ref, computed } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
export const useItemStore = defineStore("item", () => {
  const flashMessage = ref("");

  function forceLogout(status) {
    if (status == 401) {
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      localStorage.removeItem("role_id");
      localStorage.removeItem("user_id");

      router.push({ name: "login" });
    }
  }

  return { flashMessage, forceLogout };
});
