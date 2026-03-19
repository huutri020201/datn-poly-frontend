<template>
  <div class="verify-page d-flex align-items-center justify-content-center py-5">
    <div class="card shadow-sm p-5 text-center" style="max-width: 500px; border-radius: 15px;">
      
      <div v-if="status === 'loading'">
        <div class="spinner-border text-success mb-3" role="status"></div>
        <h4>Đang xác thực tài khoản...</h4>
      </div>

      <div v-if="status === 'success'">
        <i class="bi bi-check-circle-fill text-success" style="font-size: 3rem;"></i>
        <h3 class="mt-3">Xác thực thành công!</h3>
        <p class="text-muted">Tài khoản của bạn đã được kích hoạt. Đang chuyển hướng đến trang hoàn thiện hồ sơ...</p>
      </div>

      <div v-if="status === 'error'">
        <i class="bi bi-exclamation-triangle-fill text-danger" style="font-size: 3rem;"></i>
        <h3 class="mt-3">Xác thực thất bại</h3>
        <p class="text-danger">{{ errorMessage }}</p>
        <router-link to="/login" class="btn btn-dark mt-3">Quay lại Đăng nhập</router-link>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const status = ref('loading');
const errorMessage = ref('');

// Trong script setup của VerifyEmail.vue
onMounted(async () => {
  const token = route.query.token;
  if (!token) { status.value = 'error'; return; }

  try {
  const response = await axios.get(`http://localhost:8080/auth/verify-email/${token}`);
  const authData = response.data.result; 

  // KIỂM TRA KỸ: Backend trả về 'accessToken', không phải 'token'
  if (authData && authData.accessToken) { 
    localStorage.setItem('accessToken', authData.accessToken); // Sửa ở đây
    localStorage.setItem('userId', authData.userId);
    console.log("Đã lưu accessToken thành công!");
  }
  
  status.value = 'success';
    setTimeout(() => { router.push('/profile-update'); }, 2000);
  } catch (error) {
    status.value = 'error';
    errorMessage.value = error.response?.data?.message || "Lỗi xác thực!";
  }
});
</script>