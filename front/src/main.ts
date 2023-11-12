import "./icons"; // Importez les icônes
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router); // Utilisez le routeur

app.component('font-awesome-icon', FontAwesomeIcon) // Ajoutez l'icône font-awesome-icon

app.mount('#app');
