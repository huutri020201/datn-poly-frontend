import { createApp } from "vue";
import { createPinia } from "pinia"; // Thêm dòng này
import App from "./App.vue";
import router from "./router";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { notify } from "@/utils/toast";

// Import CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);
const pinia = createPinia(); // Khởi tạo Pinia

app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
});

pinia.use(({ store }) => {
  store.$notify = notify;
});

app.provide("$notify", notify);

app.use(pinia); // Sử dụng Pinia
app.use(router);
app.mount("#app");
