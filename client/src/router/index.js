// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import Matches from "../views/Matches.vue";
import Results from "../views/Results.vue";
import Registration from "../views/Registration.vue";
import Admin from "../views/Admin.vue";
import { authService } from "../services/auth";

const routes = [
  // Routes publiques
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/matches",
    name: "matches",
    component: Matches,
  },
  {
    path: "/admin/login",
    name: "adminLogin",
    component: () => import("../views/AdminLogin.vue"),
  },
  {
    path: "/results",
    name: "results",
    component: Results,
  },
  {
    path: "/register",
    name: "register",
    component: Registration,
  },
  // Routes privées
  {
    path: "/admin",
    name: "admin",
    component: Admin,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // Si l'utilisateur essaie d'accéder à la page de connexion alors qu'il est déjà connecté
  if (to.path === "/admin/login" && authService.isAuthenticated()) {
    // Rediriger vers le tableau de bord admin
    next({ path: "/admin" });
    return;
  }

  // Vérifier si la route nécessite une authentification
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Vérifier si l'utilisateur est connecté
    if (!authService.isAuthenticated()) {
      // Si non connecté, rediriger vers la page de connexion
      next({
        path: "/admin/login",
        query: { redirect: to.fullPath }, // Stocke l'URL de destination
      });
    } else {
      // Utilisateur connecté, autoriser l'accès
      next();
    }
  } else {
    // Route publique, autoriser l'accès
    next();
  }
});

export default router;
