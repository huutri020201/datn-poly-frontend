<template>
  <div class="container-fluid bg-light py-5">
    <div class="container">
      <h2 class="fw-bold mb-4 text-dark">Danh sách Sân Thể Thao</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
      </div>

      <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        <div class="col" v-for="pitch in pitches" :key="pitch.id">
          <div class="card h-100 border-0 shadow-sm pitch-card overflow-hidden">
            
            <div class="position-relative">
              <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop" 
                   class="card-img-top" style="height: 180px; object-fit: cover;" alt="Pitch Image">
              
              <div class="position-absolute top-0 start-0 p-2 d-flex gap-1">
              </div>

              <div class="position-absolute top-0 end-0 p-2 d-flex gap-2">
                <button class="btn btn-light btn-sm rounded-circle shadow-sm icon-btn">
                  <i class="bi bi-heart"></i>
                </button>
                <button class="btn btn-light btn-sm rounded-circle shadow-sm icon-btn">
                  <i class="bi bi-share"></i>
                </button>
              </div>
            </div>

            <div class="card-body d-flex flex-column position-relative pt-4">
              <div class="position-absolute pitch-logo shadow-sm bg-white rounded-circle d-flex justify-content-center align-items-center">
                <i class="bi bi-dribbble text-warning fs-4"></i>
              </div>

              <h6 class="card-title fw-bold text-truncate mt-2" :title="pitch.name">{{ pitch.name }}</h6>
              
              <div class="text-muted small mb-2 text-truncate">
                <i class="bi bi-geo-alt-fill text-danger me-1"></i> 
                Quận Gò Vấp, TP. Hồ Chí Minh
              </div>
              
              <div class="text-muted small mb-3">
                <i class="bi bi-clock-fill text-success me-1"></i> 05:00 - 24:00
              </div>

              <div class="mt-auto d-flex justify-content-between align-items-center border-top pt-3">
                <div>
                  <span class="text-muted small d-block">Giá từ</span>
                  <span class="fw-bold text-danger">{{ formatCurrency(pitch.pricePerHour) }}</span>
                </div>
                <button @click="openBookingModal(pitch)" class="btn btn-warning fw-bold text-white px-4 rounded-pill">
                  ĐẶT LỊCH
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="bookingModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-warning text-white border-0">
            <h5 class="modal-title fw-bold"><i class="bi bi-calendar-check me-2"></i> Đặt Lịch Sân</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          
          <div class="modal-body p-4" v-if="selectedPitch">
            <h6 class="fw-bold mb-4 text-center text-success">{{ selectedPitch.name }}</h6>
            
            <form @submit.prevent="submitBooking">
              <div class="mb-3">
                <label class="form-label fw-semibold text-muted small">Chọn Ngày Đặt</label>
                <input type="date" v-model="bookingData.date" class="form-control form-control-lg" required>
              </div>

              <div class="row mb-4">
                <div class="col-6">
                  <label class="form-label fw-semibold text-muted small">Giờ Bắt Đầu</label>
                  <input type="time" v-model="bookingData.startTime" class="form-control form-control-lg" required>
                </div>
                <div class="col-6">
                  <label class="form-label fw-semibold text-muted small">Giờ Kết Thúc</label>
                  <input type="time" v-model="bookingData.endTime" class="form-control form-control-lg" required>
                </div>
              </div>

              <div class="bg-light p-3 rounded mb-4 d-flex justify-content-between align-items-center">
                <span class="fw-semibold">Giá mỗi giờ:</span>
                <span class="fw-bold text-danger">{{ formatCurrency(selectedPitch.pricePerHour) }}</span>
              </div>

              <button type="submit" class="btn btn-warning w-100 py-3 fw-bold text-white rounded-3 fs-5">
                XÁC NHẬN ĐẶT LỊCH
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as bootstrap from 'bootstrap'; 
import { getAllPitches, createBooking } from '@/api/pitchApi';


const pitches = ref([]);
const loading = ref(true);


const selectedPitch = ref(null);
let bookingModalInstance = null;
const bookingData = ref({
  date: '',
  startTime: '',
  endTime: ''
});


const formatCurrency = (value) => {
  if (!value) return "0đ";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};



const openBookingModal = (pitch) => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  
  if (!token) {
    alert("Vui lòng đăng nhập tài khoản để có thể đặt sân bạn nhé!");
    router.push('/login'); 
    return; 
  }

  selectedPitch.value = pitch;
  
  bookingData.value = { date: '', startTime: '', endTime: '' };
  
  if (!bookingModalInstance) {
    bookingModalInstance = new bootstrap.Modal(document.getElementById('bookingModal'));
  }
  bookingModalInstance.show();
};

const submitBooking = async () => {
  try {
    const payload = {
      pitchId: selectedPitch.value.id,
      date: bookingData.value.date,
      startTime: bookingData.value.startTime,
      endTime: bookingData.value.endTime
    };

    // Gọi API lưu xuống DB
    await createBooking(payload);

    alert("🎉 Bạn đã đặt sân thành công!");
    bookingModalInstance.hide();
    
  } catch (error) {
    console.error("Lỗi đặt sân:", error);
    alert("Lỗi: " + (error.response?.data || "Không thể đặt sân lúc này."));
  }
};

// Fetch data
onMounted(async () => {
  try {
    const response = await getAllPitches();
    pitches.value = response.data || response;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
/* Nhúng icon bootstrap nếu dự án chưa có */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

.pitch-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pitch-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

/* Nút hình tròn chứa icon */
.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
}
.icon-btn:hover {
  color: #ff3366;
}

/* Avatar nhỏ nằm giữa ảnh bìa và thân thẻ */
.pitch-logo {
  width: 48px;
  height: 48px;
  top: -24px; /* Kéo lên 50% so với viền */
  left: 16px;
  border: 2px solid #fff;
}
</style>