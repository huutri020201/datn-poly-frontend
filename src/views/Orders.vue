<template>
  <div class="orders-page-wrapper">
    <div class="container my-4">

      <h4 class="mb-3 text-dark">Xác nhận đơn hàng</h4>

      <div v-if="!order" class="text-center text-muted">
        Không có dữ liệu đơn hàng
      </div>

      <div v-else>

        <div class="order-card section-padding mb-3">
          <h6 class="mb-3">Địa chỉ giao hàng</h6>

          <input
            v-model="order.shippingAddress"
            class="form-control mb-3"
            placeholder="Nhập địa chỉ..."
          />

          <textarea
            v-model="order.note"
            class="form-control"
            placeholder="Ghi chú..."
          ></textarea>
        </div>

        <div class="order-card mb-3">

          <div class="order-header d-flex py-3 px-4">
            <div class="col-product">Sản phẩm</div>
            <div class="col-price">Đơn giá</div>
            <div class="col-qty">Số lượng</div>
            <div class="col-total">Thành tiền</div>
          </div>

          <div
            v-for="(item, index) in order.items"
            :key="index"
            class="order-item-row d-flex align-items-center py-3 px-4"
          >
            <div class="col-product d-flex align-items-center">
              <img
                src="https://via.placeholder.com/60"
                class="me-3 border rounded"
                style="width: 60px; height: 60px; object-fit: cover;"
              />
              <div>
                <div class="product-name text-dark">
                  {{ item.itemName }}
                </div>
                <div class="text-muted-small">
                  Loại: {{ item.itemType }}
                </div>
              </div>
            </div>

            <div class="col-price">
              {{ formatPrice(item.unitPrice) }}
            </div>

            <div class="col-qty">
              {{ item.quantity }}
            </div>

            <div class="col-total fw-bold" style="color:#ee4d2d;">
              {{ formatPrice(item.subtotal) }}
            </div>
          </div>
        </div>

        <div class="order-card mb-3 section-padding d-flex justify-content-between align-items-center">
          <span class="text-dark">Voucher</span>
          <button class="btn btn-link text-primary p-0">Chọn hoặc nhập mã</button>
        </div>

      </div>
    </div>

    <div v-if="order" class="order-sticky-bar py-3">
      <div class="container d-flex justify-content-between align-items-center">

        <div>
          <div class="text-muted-small">
            Tổng ({{ order.items.length }} sản phẩm)
          </div>
          <div class="total-price">
            {{ formatPrice(order.totalAmount) }}
          </div>
        </div>

        <button
          class="btn btn-primary-custom px-5 py-2"
          :class="{ 'btn-disabled': !order.shippingAddress }"
          @click="submitOrder"
        >
          Đặt hàng
        </button>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      order: history.state.order || null
    };
  },

  methods: {
    async submitOrder() {
      try {
        await axios.post("http://localhost:8080/orders", this.order);
        alert("Đặt hàng thành công!");
        this.$router.push("/"); 
      } catch (e) {
        alert("Lỗi khi đặt hàng!");
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(price).replace("VND", "₫");
    }
  }
};
</script>

<style scoped>
.orders-page-wrapper {
  background-color: #f5f5f5;
  min-height: calc(100vh - 100px);
  padding-bottom: 80px;
}

/* Card chung */
.order-card {
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* Header */
.order-header {
  font-size: 0.9rem;
  color: #888;
  border-bottom: 1px solid #f0f0f0;
}

/* Row layout giống cart */
.col-product  { width: 50%; }
.col-qty      { width: 15%; text-align: center; }
.col-price    { width: 15%; text-align: center; }
.col-total    { width: 20%; text-align: center; }

/* Product info */
.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Input */
.form-control {
  border-radius: 4px;
  box-shadow: none;
  border: 1px solid #ddd;
}
.form-control:focus {
  border-color: #ee4d2d;
  box-shadow: 0 0 0 1px rgba(238,77,45,0.2);
}

/* Button */
.btn-primary-custom {
  background-color: #ee4d2d;
  border: none;
  color: #fff;
}
.btn-primary-custom:hover {
  background-color: #d8431f;
}

/* Total price */
.total-price {
  color: #ee4d2d;
  font-size: 1.4rem;
  font-weight: bold;
}

/* Sticky bottom giống cart */
.order-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 999;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}

/* Disabled button */
.btn-disabled {
  opacity: 0.7;
  pointer-events: none;
}

/* Spacing */
.section-padding {
  padding: 20px;
}

/* Table-like row */
.order-item-row {
  border-bottom: 1px solid #f5f5f5;
}

/* Icon nhỏ */
.text-muted-small {
  font-size: 0.85rem;
  color: #999;
}
</style>