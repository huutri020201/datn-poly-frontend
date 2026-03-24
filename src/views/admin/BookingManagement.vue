<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0 fw-bold">Quản lý Đơn Đặt Sân</h5>
      <button class="btn btn-dark btn-sm" @click="fetchBookings">
        ↻ Làm mới
      </button>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-dark"></div>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-bordered align-middle text-center border-dark custom-table">
        <thead class="table-secondary">
          <tr>
            <th>Mã đơn</th>
            <th>Ngày đặt</th>
            <th>Giờ chơi</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="booking in bookings" :key="booking.id">
            
            <td class="text-start fw-bold text-secondary">
              #{{ booking.id.substring(0, 8).toUpperCase() }}
            </td>

            <td>{{ formatDate(booking.createdAt) }}</td>

            <td>{{ booking.startTime }} - {{ booking.endTime }}</td>

            <td class="text-danger fw-bold">{{ formatCurrency(booking.totalPrice) }}</td>

            <td>
              <select 
                class="form-select form-select-sm border-dark text-center mx-auto" 
                style="width: 130px; background-color: white;"
                v-model="booking.status"
                @change="handleUpdateStatus(booking.id, booking.status)">
                <option value="PENDING">Đang chờ</option>
                <option value="CONFIRMED">Xác nhận</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </td>

            <td>
              <button
                @click="handleDelete(booking.id)"
                class="btn btn-sm btn-outline-danger"
                title="Xóa đơn hàng"
              >
                🗑
              </button>
            </td>

          </tr>

          <tr v-if="bookings.length === 0">
            <td colspan="6" class="py-4">Không có dữ liệu đơn đặt sân</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { ref, onMounted } from 'vue';
import { getAllBookingsAdmin, updateBookingStatus, deleteBooking } from '@/api/pitchApi'; 
const bookings = ref([]);
const loading = ref(false);


function formatDate(dateStr) {
  return dayjs(dateStr).format('DD/MM/YYYY HH:mm')
}
// FETCH BOOKINGS
const fetchBookings = async () => {
  loading.value = true;
  try {
    const res = await getAllBookingsAdmin();
    bookings.value = res.data.result || res.data;
  } catch (err) {
    console.error("Fetch bookings error:", err);
  } finally {
    loading.value = false;
  }
};

// UPDATE STATUS
const handleUpdateStatus = async (id, newStatus) => {
  try {
    await updateBookingStatus(id, newStatus);
    alert("Cập nhật trạng thái thành công!");
  } catch (err) {
    console.error("Update status error:", err);
    alert("Lỗi khi cập nhật trạng thái!");
    fetchBookings(); // Hoàn tác lại nếu gọi API lỗi
  }
};

// DELETE BOOKING
const handleDelete = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa đơn đặt sân này?")) return;
  
  try {
    await deleteBooking(id);
    await fetchBookings();
  } catch (err) {
    console.error("Delete error:", err);
  }
};

// FORMATTERS
const formatCurrency = (price) => {
  if (!price) return "0đ";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

onMounted(() => {
  fetchBookings();
});
</script>

<style scoped>
/* CSS chuẩn bài giống hệt ProductManagement.vue của bạn */
.custom-table thead th {
  background: #d1d5db;
}

.table td {
  padding: 12px 8px;
  background: #e5e7eb;
}
</style>