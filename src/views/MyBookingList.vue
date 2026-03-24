<template>
  <div>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-2 text-muted">Đang tải lịch sử đặt sân...</p>
    </div>

    <div v-else-if="histories.length === 0" class="alert alert-light text-center py-5 border">
      <i class="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
      <h6 class="text-muted">Bạn chưa có đơn đặt sân nào.</h6>
      <router-link to="/pitches" class="btn btn-outline-success mt-2">Đặt sân ngay</router-link>
    </div>

    <div v-else>
      <div 
        v-for="booking in histories" 
        :key="booking.id" 
        class="card border-0 shadow-sm mb-3"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
            <span class="text-muted fw-bold small">
              MÃ ĐƠN SÂN: #{{ booking.id.substring(0, 8).toUpperCase() }}
            </span>
            <span :class="getStatusBadge(booking.status)">
              {{ getStatusText(booking.status) }}
            </span>
          </div>

          <div class="row align-items-center mb-3">
            <div class="col-8">
              <div class="fw-bold fs-5 text-dark mb-1">
                <i class="bi bi-calendar-event me-2 text-success"></i> 
                Ngày: {{ formatDate(booking.date) }}
              </div>
              <div class="text-secondary fw-semibold">
                <i class="bi bi-clock me-2 text-warning"></i> 
                Giờ chơi: {{ booking.startTime }} - {{ booking.endTime }}
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between align-items-end mt-2 pt-2 border-top">
            <div>
              <div class="text-muted small">Thành tiền</div>
              <div class="text-danger fw-bold fs-5">{{ formatCurrency(booking.totalPrice) }}</div>
            </div>
            
            <div>
              <button 
                v-if="booking.status === 'PENDING'" 
                class="btn btn-outline-danger btn-sm px-4"
                @click="cancelBooking(booking.id)"
              >
                Hủy đặt sân
              </button>
              <button class="btn btn-success btn-sm px-4 ms-2" @click="goToDetail(booking.id)">
                Xem chi tiết
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getMyBookingHistory } from '@/api/pitchApi'; // Đường dẫn tới file API của bạn

const histories = ref([]);
const loading = ref(true);

import { useRouter } from 'vue-router';
const router = useRouter();

const goToDetail = (id) => {
  router.push(`/bookings/${id}`);
};
// 1. Lấy dữ liệu từ Backend
const fetchHistory = async () => {
  loading.value = true;
  try {
    const res = await getMyBookingHistory();
    // Tùy cấu trúc trả về, thường là res.data hoặc res.data.result
    histories.value = res.data.result || res.data; 
  } catch (error) {
    console.error("Lỗi lấy lịch sử:", error);
  } finally {
    loading.value = false;
  }
};

// 2. Các hàm Format hiển thị
const formatCurrency = (value) => {
  if (!value) return "0đ";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

// 3. Xử lý màu sắc và chữ cho Trạng thái
const getStatusBadge = (status) => {
  switch (status) {
    case 'PENDING': return 'badge bg-warning text-dark px-3 py-2';
    case 'CONFIRMED': return 'badge bg-success px-3 py-2';
    case 'CANCELLED': return 'badge bg-danger px-3 py-2';
    default: return 'badge bg-secondary px-3 py-2';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'PENDING': return 'Chờ xác nhận';
    case 'CONFIRMED': return 'Đã xác nhận';
    case 'CANCELLED': return 'Đã hủy';
    default: return 'Không rõ';
  }
};

// 4. Hàm Hủy đơn (Bổ sung logic sau nếu cần)
const cancelBooking = (id) => {
  if(confirm("Bạn có chắc chắn muốn hủy đơn đặt sân này không?")) {
     alert("Chức năng hủy đang được hoàn thiện!");
     // Sau này gọi API hủy ở đây
  }
};

onMounted(() => {
  fetchHistory();
});
</script>