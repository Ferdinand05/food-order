import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
// import LoginView from "../views/LoginView.vue";
import OrderView from "../views/OrderView.vue";
import ProductView from "@/views/ProductView.vue";
import ProductEditView from "@/views/ProductEditView.vue";
import OrderListView from "@/views/OrderListView.vue";
import OrderDetailView from "@/views/OrderDetailView.vue";
import ProfileView from "@/views/ProfileView.vue";
import CreateProductView from "@/views/CreateProductView.vue";
import OrderReportView from "@/views/OrderReportView.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Home | Food Order",
      },
    },
    {
      path: "/login",
      name: "login",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/LoginView.vue"),
      meta: {
        title: "Login | Food Order",
      },
    },
    {
      path: "/order",
      name: "order",
      component: OrderView,
      meta: {
        title: "Order | Food Order",
      },
    },
    {
      path: "/product",
      name: "product",
      component: ProductView,
      meta: {
        title: "Product | Food Order",
      },
    },
    {
      path: "/product/:productId/edit",
      name: "productEdit",
      component: ProductEditView,
      meta: {
        title: "Product Edit | Food Order",
      },
    },
    {
      path: "/product/create",
      name: "productCreate",
      component: CreateProductView,
      meta: {
        title: "Create Product | Food Order",
      },
    },
    {
      path: "/product/:productId/edit",
      name: "productEdit",
      component: ProductEditView,
      meta: {
        title: "Product Edit | Food Order",
      },
    },
    {
      path: "/order-list",
      name: "orderList",
      component: OrderListView,
      meta: {
        title: "Order List | Food Order",
      },
    },
    {
      path: "/order/:orderId",
      name: "orderDetail",
      component: OrderDetailView,
      meta: {
        title: "Order Detail | Food Order",
      },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: {
        title: "Profile | Food Order",
      },
    },
    {
      path: "/order/order-report",
      name: "orderReport",
      component: OrderReportView,
      meta: {
        title: "Order Report| Food Order",
      },
    },
  ],
});

export default router;
