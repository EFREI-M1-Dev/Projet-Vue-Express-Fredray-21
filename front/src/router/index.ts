import { createRouter, createWebHistory } from 'vue-router';

import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Register from '../components/register.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/register', component: Register },

    // Ajoutez d'autres routes ici
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    // Vérifiez si l'utilisateur est logué
    const loggedIn = window.localStorage.getItem('tokenAuthExpressChat');

    if (!loggedIn && to.path !== '/login' && to.path !== '/register') {
        // Si l'utilisateur n'est pas logué et qu'il essaie d'accéder à une autre page que /login, redirigez-le vers la page d'accueil
        next('/login');
    } else {
        if(loggedIn && to.path === '/login') {
            // Si l'utilisateur est logué et qu'il essaie d'accéder à la page /login, redirigez-le vers la page d'accueil
            next('/');
        }
        // Sinon, autorisez l'accès à la page
        next();
    }
});

export default router;
