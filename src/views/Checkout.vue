<template>
  <div class="checkout-page bg-light min-vh-100 py-4">
    <div class="container">
      <h4 class="mb-4">Thanh Toán</h4>

      <div class="row">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
              <h5 class="card-title d-flex align-items-center mb-3">
                <i class="bi bi-geo-alt-fill text-danger me-2"></i> Địa Chỉ Nhận
                Hàng
              </h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small">Họ và tên</label>
                  <input
                    type="text"
                    v-model="form.customerName"
                    class="form-control"
                    placeholder="Nhập tên người nhận"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label small">Số điện thoại</label>
                  <input
                    type="text"
                    v-model="form.phoneNumber"
                    class="form-control"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div class="col-12">
                  <label class="form-label small">Địa chỉ chi tiết</label>
                  <textarea
                    v-model="form.shippingAddress"
                    class="form-control"
                    rows="2"
                    placeholder="Số nhà, tên đường, phường/xã..."
                  ></textarea>
                </div>
                <div class="col-12">
                  <label class="form-label small">Ghi chú đơn hàng</label>
                  <input
                    type="text"
                    v-model="form.note"
                    class="form-control"
                    placeholder="Lưu ý cho người bán"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-0">
              <div class="p-3 border-bottom fw-bold">Sản phẩm đã chọn</div>
              <div
                v-for="item in selectedItems"
                :key="item.variantId"
                class="d-flex align-items-center p-3 border-bottom"
              >
                <img
                  :src="item.imageUrl"
                  class="rounded border"
                  style="width: 60px; height: 60px; object-fit: cover"
                />
                <div class="ms-3 flex-grow-1">
                  <div class="text-dark small fw-bold">
                    {{ item.productName }}
                  </div>
                  <div class="text-muted extra-small">
                    Phân loại: {{ item.variantName }}
                  </div>
                </div>
                <div class="text-end">
                  <div class="small">{{ formatPrice(item.unitPrice) }}</div>
                  <div class="text-muted small">x{{ item.quantity }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm sticky-top" style="top: 20px">
            <div class="card-body">
              <h5 class="card-title mb-4">Phương thức thanh toán</h5>

              <div class="payment-methods mb-4">
                <div
                  class="form-check payment-option p-3 border rounded mb-2"
                  :class="{ active: form.paymentMethod === 'COD' }"
                >
                  <input
                    class="form-check-input ms-0 me-3"
                    type="radio"
                    value="COD"
                    v-model="form.paymentMethod"
                    id="cod"
                  />
                  <label
                    class="form-check-label d-flex align-items-center"
                    for="cod"
                  >
                    <i class="bi bi-cash-stack me-2 fs-5"></i> Thanh toán khi
                    nhận hàng (COD)
                  </label>
                </div>
                <div
                  class="form-check payment-option p-3 border rounded"
                  :class="{ active: form.paymentMethod === 'VNPAY' }"
                >
                  <input
                    class="form-check-input ms-0 me-3"
                    type="radio"
                    value="VNPAY"
                    v-model="form.paymentMethod"
                    id="vnpay"
                  />
                  <label
                    class="form-check-label d-flex align-items-center"
                    for="vnpay"
                  >
                    <img
                      src="https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo-vnpay.png"
                      height="20"
                      class="me-2"
                    />
                    Ví điện tử / Thẻ ATM (VNPAY)
                  </label>
                </div>
              </div>

              <div class="order-summary bg-light p-3 rounded mb-4">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Tổng tiền hàng</span>
                  <span>{{ formatPrice(orderSummary.subTotal) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted">Giảm giá voucher</span>
                  <span class="text-danger"
                    >-{{ formatPrice(orderSummary.discountAmount) }}</span
                  >
                </div>
                <hr />
                <div class="d-flex justify-content-between">
                  <span class="fw-bold">Tổng thanh toán</span>
                  <span class="fs-4 fw-bold text-danger">{{
                    formatPrice(orderSummary.totalAmount)
                  }}</span>
                </div>
              </div>

              <button
                class="btn btn-danger w-100 py-3 fw-bold shadow-sm"
                :disabled="isProcessing"
                @click="handlePlaceOrder"
              >
                <span
                  v-if="isProcessing"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                {{
                  form.paymentMethod === "VNPAY"
                    ? "THANH TOÁN NGAY"
                    : "ĐẶT HÀNG"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isProcessing: false,
      selectedItems: [],
      orderSummary: {
        subTotal: 0,
        discountAmount: 0,
        totalAmount: 0,
      },
      form: {
        customerName: "",
        phoneNumber: "",
        shippingAddress: "",
        note: "",
        paymentMethod: "COD",
        voucherCode: "",
      },
    };
  },
  methods: {
    formatPrice(p) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(p || 0);
    },
    async handlePlaceOrder() {
      if (
        !this.form.customerName ||
        !this.form.phoneNumber ||
        !this.form.shippingAddress
      ) {
        return alert("Vui lòng nhập đầy đủ thông tin giao hàng");
      }

      this.isProcessing = true;
      try {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        const res = await axios.post(
          "http://localhost:8080/orders",
          this.form,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const orderResult = res.data.result;

        if (this.form.paymentMethod === "VNPAY" && orderResult.paymentUrl) {
          // Chuyển hướng sang VNPAY
          window.location.href = orderResult.paymentUrl;
        } else {
          // Thành công với COD
          alert("Đặt hàng thành công!");
          this.$router.push("/orders");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi đặt hàng");
      } finally {
        this.isProcessing = false;
      }
    },
  },
  // Trong Checkout.vue
  mounted() {
    const rawData = sessionStorage.getItem("checkout_data");
    if (!rawData) {
      alert("Không tìm thấy thông tin thanh toán, quay lại giỏ hàng.");
      this.$router.push("/cart");
      return;
    }

    const data = JSON.parse(rawData);
    this.selectedItems = data.selectedItems;
    this.orderSummary = {
      subTotal: data.subTotal,
      discountAmount: data.discountAmount,
      totalAmount: data.totalAmount,
    };
    this.form.voucherCode = data.appliedVoucherCode;
  },
};
</script>

<style scoped>
.payment-option {
  cursor: pointer;
  transition: 0.3s;
}
.payment-option:hover {
  background-color: #fff5f5;
}
.payment-option.active {
  border-color: #ee4d2d !important;
  background-color: #fff5f5;
}
.extra-small {
  font-size: 0.75rem;
}
</style>