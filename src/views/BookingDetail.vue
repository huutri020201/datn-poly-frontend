<template>
  <div class="container mt-5 mb-5" style="max-width: 800px; min-height: 60vh;">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold m-0 text-dark">Chi tiết Đơn Đặt Sân</h3>
      <button @click="$router.go(-1)" class="btn btn-outline-secondary btn-sm px-3 rounded-pill">
        <i class="bi bi-arrow-left me-1"></i> Quay lại
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
    </div>

    <div v-else-if="!booking" class="alert alert-warning text-center py-4 rounded-4 shadow-sm">
      <i class="bi bi-exclamation-circle fs-1 text-warning d-block mb-2"></i>
      Không tìm thấy thông tin đơn đặt sân!
    </div>

    <div v-else class="card border-0 shadow-sm p-4 rounded-4 bg-white">
      
      <div class="d-flex justify-content-between border-bottom pb-3 mb-4">
        <div>
          <div class="text-muted small fw-bold mb-1">MÃ ĐƠN SÂN</div>
          <div class="fw-bold fs-5 text-dark">#{{ booking.id.substring(0, 8).toUpperCase() }}</div>
        </div>
        <div class="text-end">
          <div class="text-muted small fw-bold mb-1">TRẠNG THÁI</div>
          <span :class="getStatusBadge(booking.status)">{{ getStatusText(booking.status) }}</span>
        </div>
      </div>

      <div class="row mb-4 g-3">
        
        <div class="col-md-6">
          <div class="p-3 bg-light rounded-3 h-100 border border-light-subtle">
            <h6 class="fw-bold text-success mb-3">
              <i class="bi bi-calendar-check me-2"></i>Thông tin thời gian
            </h6>
            <div class="mb-2 d-flex justify-content-between">
              <span class="text-muted">Ngày nhận sân:</span>
              <span class="fw-bold">{{ formatDate(booking.date) }}</span>
            </div>
            <div class="mb-2 d-flex justify-content-between align-items-center">
              <span class="text-muted">Giờ bắt đầu:</span>
              <span class="badge bg-white text-dark border px-3 py-2">{{ booking.startTime }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-muted">Giờ kết thúc:</span>
              <span class="badge bg-white text-dark border px-3 py-2">{{ booking.endTime }}</span>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="p-3 bg-light rounded-3 h-100 border border-light-subtle">
            <h6 class="fw-bold text-primary mb-3">
              <i class="bi bi-geo-alt me-2"></i>Thông tin sân
            </h6>
            <div class="mb-2">
              <span class="text-muted d-block mb-1">Mã tham chiếu sân:</span>
              <span class="fw-bold text-dark small" style="word-break: break-all;">
                {{ booking.pitchId }}
              </span>
            </div>
            <div class="mt-4 pt-3 border-top border-secondary-subtle">
              <p class="mb-0 text-warning-emphasis small fw-medium">
                <i class="bi bi-info-circle me-1"></i>Vui lòng đến trước 15 phút để làm thủ tục nhận sân.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="border-top pt-4 mt-2 d-flex justify-content-between align-items-center">
        <div>
          <h5 class="fw-bold text-dark m-0">Tổng thanh toán</h5>
          <small class="text-muted">Đã bao gồm VAT</small>
        </div>
        <h2 class="fw-bold text-danger m-0">{{ formatCurrency(booking.totalPrice) }}</h2>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getBookingDetail } from '@/api/pitchApi'; // Sửa đường dẫn nếu cần

const route = useRoute();
const booking = ref(null);
const loading = ref(true);

const fetchDetail = async () => {
  try {
    const res = await getBookingDetail(route.params.id);
    booking.value = res.data.result || res.data;
  } catch (error) {
    console.error("Lỗi lấy chi tiết:", error);
  } finally {
    loading.value = false;
  }
};

const formatCurrency = (value) => {
  if (!value) return "0đ";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

const getStatusBadge = (status) => {
  switch (status) {
    case 'PENDING': return 'badge bg-warning text-dark px-3 py-2 fs-6';
    case 'CONFIRMED': return 'badge bg-success px-3 py-2 fs-6';
    case 'CANCELLED': return 'badge bg-danger px-3 py-2 fs-6';
    default: return 'badge bg-secondary px-3 py-2 fs-6';
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

onMounted(() => {
  fetchDetail();
});
</script>