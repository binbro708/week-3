const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/LoginPage.vue"),
  },
  {
    path: "/products",
    name: "products",
    component: () => import("@/views/ProductsPage.vue"),
  },
];

export default routes;
