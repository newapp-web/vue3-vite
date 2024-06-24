import { createMemoryHistory, createRouter, createWebHashHistory } from "vue-router";

import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.name === "Home" && savedPosition) {
      window.scrollTo({
        top: savedPosition?.y || 0,
        left: 0,
        behavior: "instant",
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  },
});

router.afterEach((to, from) => {
  console.log("---after-each---");
});

export default router;
