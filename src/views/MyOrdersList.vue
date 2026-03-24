<template>
  <div class="container my-5" style="min-height: 60vh;">
    <h3 class="mb-4 fw-bold">Lịch sử giao dịch</h3>

    <ul class="nav nav-tabs mb-4 custom-tabs">
      <li class="nav-item">
        <a 
          class="nav-link fw-bold fs-6" 
          :class="{ active: activeTab === 'products' }" 
          @click="activeTab = 'products'"
          style="cursor: pointer;"
        >
          <i class="bi bi-box-seam me-2"></i> Đơn mua hàng
        </a>
      </li>
      <li class="nav-item">
        <a 
          class="nav-link fw-bold fs-6" 
          :class="{ active: activeTab === 'bookings' }" 
          @click="activeTab = 'bookings'"
          style="cursor: pointer;"
        >
          <i class="bi bi-calendar-check me-2"></i> Lịch sử đặt sân
        </a>
      </li>
    </ul>

    <div v-if="activeTab === 'products'">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-5 bg-white shadow-sm rounded border">
        <p class="text-muted">Bạn chưa có đơn hàng nào.</p>
        <router-link to="/" class="btn btn-outline-success">Mua sắm ngay</router-link>
      </div>

      <div v-else>
        <div v-for="order in orders" :key="order.id" class="card mb-3 shadow-sm border-0 border-start border-4" :class="statusBorder(order.status)">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <div>
                <h6 class="fw-bold mb-1">Mã đơn: #{{ order.id.substring(0, 8).toUpperCase() }}</h6>
                <small class="text-muted">{{ formatDate(order.createdAt) }}</small>
              </div>
              <span :class="['badge', statusClass(order.status)]">{{ translateStatus(order.status) }}</span>
            </div>

            <div class="d-flex justify-content-between align-items-center">
              <div>
                <div class="fw-bold text-danger fs-5">{{ formatPrice(order.totalAmount) }}</div>
                <small class="text-muted">{{ order.items?.length || 0 }} sản phẩm</small>
              </div>
              <button @click="goToDetail(order.id)" class="btn btn-outline-success px-4">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'bookings'">
      <BookingHistory />
    </div>

  </div>
</template>

<script>
import api from "@/api/axios";
// IMPORT COMPONENT ĐẶT SÂN
// (Lưu ý: Nếu file BookingHistory.vue nằm ở chỗ khác, bạn chỉnh lại đường dẫn cho khớp nhé)
import BookingHistory from '@/views/MyBookingList.vue'; 

export default {
  // ĐĂNG KÝ COMPONENT
  components: {
    BookingHistory
  },
  data() {
    return {
      activeTab: 'products', // Mặc định mở tab Sản phẩm
      orders: [],
      loading: true
    };
  },
  async created() {
    try {
      const res = await api.get("/orders/my-orders");
      this.orders = res.data.result || [];
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    goToDetail(orderId) {
      this.$router.push({ name: "order-detail", params: { id: orderId } });
    },
    formatPrice(v) {
      return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v || 0);
    },
    formatDate(d) {
      return new Date(d).toLocaleString("vi-VN");
    },
    translateStatus(s) {
      const m = { PENDING: 'Chờ xác nhận', CONFIRMED: 'Đã xác nhận', SHIPPING: 'Đang giao hàng', DELIVERED: 'Đã giao', CANCELLED: 'Đã hủy' };
      return m[s] || s;
    },
    statusClass(s) {
      const m = { PENDING: 'bg-warning text-dark', CONFIRMED: 'bg-info', SHIPPING: 'bg-primary', DELIVERED: 'bg-success', CANCELLED: 'bg-danger' };
      return m[s] || 'bg-secondary';
    },
    statusBorder(s) {
      const m = { PENDING: 'border-warning', CONFIRMED: 'border-info', SHIPPING: 'border-primary', DELIVERED: 'border-success', CANCELLED: 'border-danger' };
      return m[s] || 'border-secondary';
    }
  }
};
</script>

<style scoped>
/* CSS CHO TABS (Màu xanh hợp tông với trang web) */
.custom-tabs {
  border-bottom: 2px solid #e0e0e0;
}
.custom-tabs .nav-link {
  color: #6c757d;
  border: none;
  background-color: transparent;
  padding: 12px 20px;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
}
.custom-tabs .nav-link:hover {
  color: #198754;
}
.custom-tabs .nav-link.active {
  color: #198754;
  border-bottom: 3px solid #198754;
}
</style>