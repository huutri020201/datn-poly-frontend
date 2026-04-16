<template>
  <div class="modal fade" id="addUserModal" tabindex="-1" ref="modalElement">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow">
        <div class="modal-header border-bottom-0">
          <h5 class="fw-bold">Thêm người dùng mới</h5>
          <button type="button" class="btn-close" @click="hide"></button>
        </div>
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label small fw-bold">Email</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                placeholder="example@gmail.com"
              />
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold">Số điện thoại</label>
              <input
                v-model="form.phone"
                type="text"
                class="form-control"
                placeholder="09xxxxxxxx"
              />
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold">Mật khẩu ban đầu</label>
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                required
                minlength="8"
              />
            </div>
            <div class="mb-3">
              <label class="form-label small fw-bold">Vai trò</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value="CUSTOMER"
                    v-model="form.roles"
                    id="roleCustomer"
                  />
                  <label class="form-check-label" for="roleCustomer"
                    >Customer</label
                  >
                </div>
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value="ADMIN"
                    v-model="form.roles"
                    id="roleAdmin"
                  />
                  <label class="form-check-label" for="roleAdmin">Admin</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-top-0">
            <button type="button" class="btn btn-light" @click="hide">
              Hủy
            </button>
            <button
              type="submit"
              class="btn btn-dark px-4"
              :disabled="submitting"
            >
              <span
                v-if="submitting"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Xác nhận tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import userApi from "@/api/userApi";
import { Modal } from "bootstrap";
import { inject } from "vue";

const notify = inject("$notify");
const emit = defineEmits(["success"]);
const modalElement = ref(null);
let bsModal = null;
const submitting = ref(false);

const form = reactive({
  email: "",
  phone: "",
  password: "",
  roles: ["CUSTOMER"], // Mặc định là khách hàng
});

onMounted(() => {
  bsModal = new Modal(modalElement.value);
});

const show = () => bsModal.show();
const hide = () => {
  Object.assign(form, {
    email: "",
    phone: "",
    password: "",
    roles: ["CUSTOMER"],
  });
  bsModal.hide();
};

const handleSubmit = async () => {
  if (!form.email && !form.phone) {
    notify.warning("Phải nhập Email hoặc Số điện thoại");
    return;
  }

  try {
    submitting.value = true;
    await userApi.createUser(form);
    notify.success("Tạo người dùng thành công");
    emit("success"); // Báo cho cha biết để reload table
    hide();
  } catch (error) {
    notify.error(error.message || "Không thể tạo người dùng");
  } finally {
    submitting.value = false;
  }
};

defineExpose({ show, hide });
</script>
