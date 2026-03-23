<template>
  <div class="orders-page-wrapper">
    <div class="container my-4">
      <h4 class="mb-3 text-dark fw-bold">Chi tiết đơn hàng</h4>

      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Đang tải thông tin đơn hàng...</p>
      </div>

      <div v-else-if="!order" class="text-center text-muted my-5">
        <i class="bi bi-box-seam fs-1"></i>
        <p>Không tìm thấy dữ liệu đơn hàng</p>
        <router-link to="/orders" class="btn btn-outline-primary btn-sm">Quay lại danh sách</router-link>
      </div>

      <div v-else>
        <div class="order-card section-padding mb-3 p-4 shadow-sm">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="m-0 fw-bold"><i class="bi bi-geo-alt-fill text-danger me-2"></i>Địa chỉ nhận hàng</h6>
            <span class="badge px-3 py-2" :class="statusClass(order.status)">{{ translateStatus(order.status) }}</span>
          </div>
          
          <div class="card mb-4 border-0 shadow-sm p-4">
            <div class="text-dark">
              <div class="fw-bold">Tên người nhận: {{ order.customerName }}</div>
              <div class="fw-bold">Số điện thoại: {{ order.phoneNumber }}</div>
              <div class="text-muted">Địa chỉ: {{ order.shippingAddress }}</div>
              <div v-if="order.note" class="mt-2 small text-warning"><strong>Ghi chú:</strong> {{ order.note }}</div>
            </div>
          </div>

          <div v-if="order.note" class="mt-3 p-2 bg-light rounded border-start border-3 border-warning">
            <small class="text-muted"><b>Ghi chú:</b> {{ order.note }}</small>
          </div>
        </div>

        <div class="order-card mb-3 shadow-sm overflow-hidden">
          <div class="order-header d-flex py-3 px-4 fw-bold border-bottom text-uppercase small custom-bg-light-green">
            <div class="col-product">Sản phẩm</div>
            <div class="col-price text-center">Đơn giá</div>
            <div class="col-qty text-center">Số lượng</div>
            <div class="col-total text-center">Thành tiền</div>
            <div class="col-action text-end">Đánh giá</div>
          </div>

          <div v-for="item in order.items" :key="item.id" class="order-item-row d-flex align-items-center py-4 px-4 border-bottom bg-white">
            <div class="col-product d-flex align-items-center">
              <img 
                :src="item.imageSnapshot || 'https://via.placeholder.com/80'" 
                class="me-3 border rounded shadow-sm"
                style="width: 70px; height: 70px; object-fit: cover;"
              />
              <div>
                <div class="product-name fw-bold text-dark mb-1">{{ item.productName }}</div>
                <div class="sku-text text-muted small mb-2">SKU: {{ item.sku }}</div>
                <div class="attributes-list">
                  <span v-for="(val, key) in item.attributesSnapshot" :key="key" class="badge bg-light text-dark border me-1 fw-normal">
                    {{ key }}: {{ val }}
                  </span>
                </div>
              </div>
            </div>

            <div class="col-price text-center">
              {{ formatPrice(item.priceAtPurchase) }}
            </div>

            <div class="col-qty text-center">
              x{{ item.quantity }}
            </div>

            <div class="col-total text-center fw-bold text-danger">
              {{ formatPrice(item.priceAtPurchase * item.quantity) }}
            </div>

            <div class="col-action text-end">
              <button 
                @click="openReview(item)" 
                class="btn btn-sm btn-review shadow-sm"
                :disabled="order.status !== 'DELIVERED'"
                :title="order.status !== 'DELIVERED' ? 'Bạn chỉ có thể đánh giá khi đã nhận hàng' : 'Đánh giá sản phẩm'"
              >
                <i class="bi bi-star-fill me-1"></i> Đánh giá
              </button>
            </div>
          </div>
        </div>

        <div class="order-card section-padding mb-3 p-4 shadow-sm bg-white">
          <div class="d-flex justify-content-between mb-2">
            <span class="text-muted">Tổng tiền hàng:</span>
            <span class="fw-medium">{{ formatPrice(order.subTotal) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-2" v-if="order.discountAmount > 0">
            <span class="text-muted">Giảm giá ({{ order.voucherCode }}):</span>
            <span class="text-success fw-medium">-{{ formatPrice(order.discountAmount) }}</span>
          </div>
          <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
            <span class="text-muted">Phương thức thanh toán:</span>
            <span class="fw-bold text-uppercase">{{ order.paymentMethod }}</span>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="m-0 fw-bold">Tổng thanh toán:</h5>
            <h4 class="m-0 text-danger fw-bold fs-3">{{ formatPrice(order.totalAmount) }}</h4>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-5 mt-4">
          <button @click="$router.push('/orders')" class="btn btn-outline-info px-4">
            <i class="bi bi-arrow-left me-2"></i>Quay lại danh sách
          </button>
          <button v-if="order.paymentStatus === 'UNPAID' && order.paymentUrl" 
                  @click="goToPayment" 
                  class="btn btn-danger btn-lg px-5 shadow fw-bold">
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios"; 

export default {
  data() {
    return {
      order: null,
      loading: true,
    };
  },

  async created() {
    const orderId = this.$route.params.id;
    if (orderId) {
      await this.fetchOrderDetail(orderId);
    } else {
      this.loading = false;
    }
  },

  methods: {
    async fetchOrderDetail(id) {
      this.loading = true;
      try {
        const response = await api.get(`/orders/${id}`); 
        if (response.data && response.data.result) {
          this.order = response.data.result;
        }
      } catch (error) {
        console.error("Lỗi gọi API đơn hàng:", error);
      } finally {
        this.loading = false;
      }
    },

    openReview(item) {
  console.log("Dữ liệu item bấm vào:", item); 

  const pId = item.productId || item.id; 

  if (!pId) {
    alert("Lỗi: Không tìm thấy ID sản phẩm trong dữ liệu đơn hàng!");
    return;
  }

  this.$router.push({
    path: '/feedback',
    query: {
      productId: pId, 
      orderId: this.order.id,
      productName: item.productName,
      productImage: item.imageSnapshot
    }
  });
},

    goToPayment() {
      if (this.order && this.order.paymentUrl) {
        window.location.href = this.order.paymentUrl;
      }
    },

    formatPrice(value) {
      if (!value) return "0 ₫";
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },

    translateStatus(status) {
      const map = {
        'PENDING': 'Chờ xác nhận',
        'CONFIRMED': 'Đã xác nhận',
        'SHIPPING': 'Đang giao hàng',
        'DELIVERED': 'Đã giao',
        'CANCELLED': 'Đã hủy'
      };
      return map[status] || status;
    },

    statusClass(status) {
      const map = {
        'PENDING': 'bg-warning text-dark',
        'CONFIRMED': 'bg-info text-white',
        'SHIPPING': 'bg-primary text-white',
        'DELIVERED': 'bg-success text-white',
        'CANCELLED': 'bg-danger text-white'
      };
      return map[status] || 'bg-secondary';
    }
  } 
};
</script>

<style scoped>
.orders-page-wrapper {
  background-color: #f4f7f6;
  min-height: 100vh;
}
.order-card {
  background: #fff;
  border-radius: 12px;
  border: none;
}
.order-item-row {
  transition: background 0.2s;
}
.order-item-row:hover {
  background-color: #fafafa;
}
.sku-text {
  font-size: 11px;
}
.custom-bg-light-green {
  background-color: #d4edda !important; 
  color: #155724 !important; 
}
.btn-review {
  background-color: #fadb14;
  border-color: #fadb14;
  color: #212529;
  font-weight: bold;
  transition: all 0.3s;
}
.btn-review:hover:not(:disabled) {
  background-color: #ffec3d;
  transform: scale(1.05);
}
.btn-review:disabled {
  background-color: #e8e8e8; 
  border-color: #d9d9d9;
  color: #bfbfbf;
  cursor: not-allowed; 
  opacity: 0.7;
  box-shadow: none !important;
}
.col-product { width: 35%; }
.col-price   { width: 15%; }
.col-qty     { width: 10%; }
.col-total   { width: 20%; }
.col-action  { width: 20%; }

.btn-warning {
  background-color: #fadb14;
  border-color: #fadb14;
}
.btn-warning:hover {
  background-color: #ffec3d;
  border-color: #ffec3d;
}
</style>