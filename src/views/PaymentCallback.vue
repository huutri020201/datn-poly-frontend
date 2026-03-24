<template>
  <div class="container py-5 text-center">
    <div v-if="verifying" class="py-5">
      <div class="spinner-grow text-primary" role="status"></div>
      <h4 class="mt-4">Đang xác thực giao dịch...</h4>
    </div>

    <div v-else class="result-card p-5 bg-white shadow-sm rounded">
      <div v-if="isSuccess">
        <i
          class="bi bi-check-circle-fill text-success"
          style="font-size: 5rem"
        ></i>
        <h2 class="mt-3 text-success">Thanh Toán Thành Công!</h2>
        <p class="text-muted">
          Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
        </p>
      </div>
      <div v-else>
        <i class="bi bi-x-circle-fill text-danger" style="font-size: 5rem"></i>
        <h2 class="mt-3 text-danger">Thanh Toán Thất Bại</h2>
        <p class="text-muted">Giao dịch không thành công hoặc đã bị hủy.</p>
      </div>

      <div class="mt-4">
        <button
          class="btn btn-outline-dark px-4 me-2"
          @click="$router.push('/')"
        >
          Về Trang Chủ
        </button>
        <button class="btn btn-danger px-4" @click="$router.push('/orders')">
          Xem Đơn Hàng
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
      verifying: true,
      isSuccess: false,
      orderId: "",
    };
  },
  mounted() {
    const params = this.$route.query;
    this.orderId = params.vnp_TxnRef;
    this.isSuccess = params.vnp_ResponseCode === "00";

    // Giả lập delay 1s để người dùng thấy quá trình "đang xác thực" cho chuyên nghiệp
    setTimeout(() => {
      this.verifying = false;
    }, 1000);
  },
};
</script>