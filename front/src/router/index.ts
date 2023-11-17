import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Register from '../views/Register.vue';
import Reconnection from '../views/Reconnection.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/reconnection', component: Reconnection },

    // Ajoutez d'autres routes ici
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    // Vérifiez si l'utilisateur est logué
    const loggedIn = window.localStorage.getItem('token');

    const publicPages = ['/login', '/register', '/reconnection'];
    if (!loggedIn && !publicPages.includes(to.path)) {
        // Si l'utilisateur n'est pas logué et qu'il essaie d'accéder à une autre page que page public, redirigez-le vers la page d'accueil
        next('/login');
    } else {
        if(loggedIn && publicPages.includes(to.path)) {
            // Si l'utilisateur est logué et qu'il essaie d'accéder à la page public, redirigez-le vers la page d'accueil
            next('/');
        }
        // Sinon, autorisez l'accès à la page
        next();
    }
});

export default router;
