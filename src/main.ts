import { createApp } from 'vue';
import { anu } from 'anu-vue';
import 'uno.css';
import 'anu-vue/dist/style.css';
import '@anu-vue/preset-theme-default/dist/style.css';
import { registerLocale } from 'i18n-iso-countries';
import localeData from 'i18n-iso-countries/langs/en.json';

import './style.css';
import App from './App.vue';

registerLocale(localeData);

const app = createApp(App);
anu.install(app, {
  registerComponents: false,
});
app.mount('#app');
