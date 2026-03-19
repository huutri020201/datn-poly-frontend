<template>
  <div class="profile-update-page py-5">
    <div class="container">
      <h4 class="mb-4 d-flex align-items-center fw-bold">
        <i class="bi bi-person-circle me-2"></i> Hồ sơ cá nhân
      </h4>

      <div class="row g-4">
        <div class="col-md-4 col-lg-3">
          <div class="card border-0 shadow-sm p-4 text-center avatar-card">
            <div class="position-relative d-inline-block mx-auto mb-3">
              <img 
                :src="previewImage || 'https://ui-avatars.com/api/?name=User&background=random'" 
                class="rounded-circle img-thumbnail shadow-sm"
                style="width: 150px; height: 150px; object-fit: cover;"
              />
            </div>
            <div class="mb-3">
              <input type="file" class="form-control form-control-sm" id="avatarInput" @change="handleFileUpload" accept="image/*" />
            </div>
            <h5 class="fw-bold mt-2 text-truncate">{{ profile.fullName || 'Tên người dùng' }}</h5>
          </div>
        </div>

        <div class="col-md-8 col-lg-9">
          <div class="card border-0 shadow-sm p-4 mb-4">
            <h5 class="mb-4 fw-bold text-success"><i class="bi bi-person-vcard me-2"></i> Thông tin cá nhân</h5>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label text-muted small fw-bold">Họ tên</label>
                <input v-model="profile.fullName" type="text" class="form-control custom-input" placeholder="Nhập họ tên đầy đủ" />
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small fw-bold">Giới tính</label>
                <select v-model="profile.gender" class="form-select custom-input">
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted small fw-bold">Ngày sinh</label>
                <input v-model="profile.dob" type="date" class="form-control custom-input" />
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm p-4">
            <h5 class="mb-4 fw-bold text-success"><i class="bi bi-geo-alt me-2"></i> Địa chỉ & Liên lạc</h5>
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label text-muted small fw-bold">Số điện thoại</label>
                <input v-model="profile.phone" type="text" class="form-control custom-input" placeholder="0xxxxxxxxx" />
              </div>
              <div class="col-12">
                <label class="form-label text-muted small fw-bold">Địa chỉ chi tiết</label>
                <textarea v-model="profile.address" class="form-control custom-input" rows="2" placeholder="Số nhà, tên đường, phường/xã..."></textarea>
              </div>
            </div>
          </div>

          <div class="text-end mt-4">
            <button @click="handleUpdateProfile" class="btn btn-save px-5 py-2" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              HOÀN TẤT HỒ SƠ
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const previewImage = ref(null);
const selectedFile = ref(null);

const profile = reactive({
  fullName: '',
  gender: 'Nữ',
  dob: '1999-09-09',
  phone: '',
  address: '',
  avatarUrl: ''
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewImage.value = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      profile.avatarUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleUpdateProfile = async () => {
  const token = localStorage.getItem('accessToken'); 
  const userId = localStorage.getItem('userId');

  if (!token || !userId || token === 'undefined') { 
    alert("Phiên làm việc hết hạn, vui lòng thực hiện lại từ liên kết trong email!");
    return;
  }

  const payload = {
    userId: userId, 
    fullName: profile.fullName,
    gender: profile.gender,
    dob: profile.dob,
    phone: profile.phone,
    address: profile.address,
    avatarUrl: profile.avatarUrl
  };

  try {
    loading.value = true;
    await axios.post('http://localhost:8080/auth/complete-profile', payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Cập nhật thành công!");
    router.push('/'); 
  } catch (error) {
    alert(error.response?.data?.message || "Lỗi lưu dữ liệu");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    console.warn("Cảnh báo: UserId đang bị null trong LocalStorage");
  }
});
</script>

<style scoped>
.profile-update-page { background-color: #fcfbf4; min-height: 100vh; }
.avatar-card { border-radius: 15px; }
.custom-input { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 10px; padding: 12px; }
.custom-input:focus { border-color: #28a745; box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.15); }
.btn-save { background-color: #2c3e50; color: white; border-radius: 10px; font-weight: bold; transition: all 0.3s; border: none; }
.btn-save:hover { background-color: #1a252f; transform: translateY(-2px); }
.card { border-radius: 15px; }
</style>