<template>
  <div class="cart-page-wrapper">
    <div class="container my-4">
      <h4 class="mb-4 text-dark">Giỏ hàng của bạn</h4>

      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-danger" role="status"></div>
        <div class="mt-2 text-muted">Đang tải giỏ hàng...</div>
      </div>

      <div
        v-else-if="cartItems.length === 0"
        class="empty-cart text-center my-5 bg-white p-5 rounded shadow-sm"
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
          alt="Empty Cart"
          style="width: 120px; opacity: 0.6"
          class="mb-4"
        />
        <p class="fs-6 text-muted mb-3">Giỏ hàng của bạn còn trống</p>
        <button
          class="btn px-5 py-2 text-white text-uppercase fw-bold"
          style="background-color: #ee4d2d"
          @click="$router.push('/products')"
        >
          Tiếp tục mua sắm
        </button>
      </div>

      <div v-else class="cart-content">
        <div
          class="cart-header-row bg-white rounded shadow-sm d-flex align-items-center py-3 px-4 mb-3 text-muted"
          style="font-size: 0.9rem"
        >
          <div class="col-checkbox d-flex align-items-center">
            <input
              class="form-check-input brand-checkbox me-3"
              type="checkbox"
              id="selectAllTop"
              v-model="selectAll"
            />
          </div>
          <div class="col-product">Sản Phẩm</div>
          <div class="col-price text-center">Đơn Giá</div>
          <div class="col-qty text-center">Số Lượng</div>
          <div class="col-total text-center">Số Tiền</div>
          <div class="col-action text-center">Thao Tác</div>
        </div>

        <div class="cart-items-wrapper bg-white rounded shadow-sm mb-3">
          <div
            v-for="item in cartItems"
            :key="item.variantId"
            class="cart-item-row d-flex align-items-center py-3 px-4 border-bottom"
          >
            <div class="col-checkbox d-flex align-items-center">
              <input
                class="form-check-input brand-checkbox me-3"
                type="checkbox"
                :value="item.variantId"
                v-model="selectedItems"
              />
            </div>

            <div class="col-product d-flex align-items-center pe-3">
              <img
                :src="
                  item.imageUrl ||
                  'https://ui-avatars.com/api/?name=Product&background=random'
                "
                alt="img"
                class="border rounded me-3"
                style="width: 80px; height: 80px; object-fit: cover"
              />
              <div
                class="product-info d-flex flex-column justify-content-center"
              >
                <span
                  class="text-dark mb-1 product-name"
                  style="font-size: 0.95rem; line-height: 1.2"
                  >{{ item.productName }}</span
                >
                <span class="text-muted small"
                  >Phân loại: {{ item.variantName }}</span
                >
              </div>
            </div>

            <div class="col-price text-center text-muted">
              {{ formatPrice(item.unitPrice) }}
            </div>

            <div class="col-qty d-flex justify-content-center">
              <div class="qty-control d-flex border rounded">
                <button
                  class="btn btn-sm btn-light border-0 px-2 rounded-0"
                  style="width: 30px"
                  @click="decreaseQty(item)"
                >
                  -
                </button>
                <input
                  type="number"
                  class="form-control form-control-sm text-center border-0 rounded-0 px-1"
                  style="width: 45px; box-shadow: none"
                  v-model.number="item.quantity"
                  @change="updateItem(item)"
                  min="1"
                />
                <button
                  class="btn btn-sm btn-light border-0 px-2 rounded-0"
                  style="width: 30px"
                  @click="increaseQty(item)"
                >
                  +
                </button>
              </div>
            </div>

            <div class="col-total text-center fw-bold" style="color: #ee4d2d">
              {{ formatPrice(item.unitPrice * item.quantity) }}
            </div>

            <div class="col-action text-center">
              <button
                class="btn btn-link text-dark text-decoration-none p-0 mb-1 btn-delete"
                @click="removeItem(item.variantId)"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow-sm mb-3">
          <div
            class="d-flex justify-content-end align-items-center border-bottom p-4"
          >
            <div class="d-flex align-items-center">
              <svg
                fill="none"
                viewBox="0 -2 23 22"
                style="
                  width: 20px;
                  height: 20px;
                  color: #ee4d2d;
                  fill: currentColor;
                "
                class="me-2"
              >
                <path
                  d="M12.983 18.232l-1.921 1.636c-.432.368-1.077.368-1.509 0l-1.921-1.636a1 1 0 00-.645-.232H3.945c-.552 0-1-.448-1-1v-3.042a1 1 0 00-.232-.645L1.077 11.39c-.368-.432-.368-1.077 0-1.509l1.636-1.921c.15-.175.232-.398.232-.645V4.273c0-.552.448-1 1-1h3.042c.247 0 .47-.082.645-.232L9.553 1.405c.432-.368 1.077-.368 1.509 0l1.921 1.636c.175.15.398.232.645.232h3.042c.552 0 1 .448 1 1v3.042c0 .247.082.47.232.645l1.636 1.921c.368.432.368 1.077 0 1.509l-1.636 1.921a1 1 0 00-.232.645v3.042c0 .552-.448 1-1 1h-3.042a1 1 0 00-.645.232zM9.5 6.5a1 1 0 100 2 1 1 0 000-2zm0 6a1 1 0 100 2 1 1 0 000-2zm3-3a1 1 0 100 2 1 1 0 000-2zm0-3a1 1 0 100 2 1 1 0 000-2z"
                ></path>
              </svg>
              <span class="fs-6 text-dark me-3">Mã Giảm Giá</span>
              <span v-if="appliedVoucher" class="badge bg-danger me-3">{{
                appliedVoucher.code
              }}</span>
            </div>
            <button
              class="btn btn-link text-primary text-decoration-none p-0"
              data-bs-toggle="modal"
              data-bs-target="#voucherModal"
              @click="fetchUserVouchers"
            >
              {{ appliedVoucher ? "Thay đổi mã" : "Chọn hoặc nhập mã" }}
            </button>
          </div>

          <div class="d-flex justify-content-end align-items-center p-4">
            <div class="d-flex align-items-center text-muted">
              <span class="me-2 text-dark">Tiết kiệm:</span>
            </div>
            <span class="text-danger fw-bold"
              >-{{ formatPrice(discountAmount) }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="cartItems.length > 0"
      class="checkout-sticky-bar bg-white shadow py-3"
    >
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <input
            class="form-check-input brand-checkbox mx-3"
            type="checkbox"
            id="selectAllBottom"
            v-model="selectAll"
          />
          <label class="cursor-pointer me-4 text-dark" for="selectAllBottom"
            >Chọn Tất Cả ({{ cartItems.length }})</label
          >
          <button
            class="btn btn-link text-dark text-decoration-none p-0 me-4 btn-delete"
            @click="removeSelectedItems"
          >
            Xóa mục đã chọn
          </button>
        </div>

        <div class="d-flex align-items-center">
          <div class="text-end me-4">
            <div class="d-flex align-items-center">
              <span class="text-dark me-2"
                >Tổng thanh toán ({{ selectedItems.length }} Sản phẩm):</span
              >
              <div class="d-flex flex-column align-items-end">
                <span
                  v-if="discountAmount > 0"
                  class="text-muted text-decoration-line-through small"
                  >{{ formatPrice(selectedTotalAmount) }}</span
                >
                <span class="fs-4 fw-bold" style="color: #ee4d2d">{{
                  formatPrice(finalTotalAmount)
                }}</span>
              </div>
            </div>
          </div>
          <button
            class="btn text-white px-5 py-2 fs-5 checkout-btn"
            :class="{ disabled: selectedItems.length === 0 }"
            style="
              background-color: #ee4d2d;
              min-width: 200px;
              border-radius: 2px;
            "
            @click="checkout"
          >
            MUA HÀNG
          </button>
        </div>
      </div>
    </div>

    <div class="modal fade" id="voucherModal" tabindex="-1" aria-hidden="false">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0">
          <div class="modal-header border-0 pb-0">
            <h5 class="modal-title fw-bold">Chọn Mã giảm giá</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div
              class="d-flex gap-2 mb-4 bg-white p-3 rounded shadow-sm border"
            >
              <input
                type="text"
                v-model="voucherCodeInput"
                class="form-control border-0 shadow-none"
                placeholder="Mã Voucher"
              />
              <button
                class="btn btn-danger fw-bold px-4 py-2 text-nowrap"
                @click="applyVoucherByCode"
              >
                ÁP DỤNG
              </button>
            </div>

            <h6 class="mb-3 fw-bold">Kho Voucher của bạn</h6>
            <div
              class="voucher-list px-1"
              style="max-height: 400px; overflow-y: auto"
            >
              <div
                v-if="vouchers.length === 0"
                class="text-center py-5 text-muted"
              >
                Bạn chưa có mã giảm giá nào
              </div>

              <div
                v-for="v in vouchers"
                :key="v.id"
                class="card mb-3 border-0 shadow-sm d-flex flex-row align-items-stretch"
                :class="{ 'opacity-50': selectedTotalAmount < v.minOrderValue }"
              >
                <div
                  class="bg-danger text-white text-center p-3 d-flex flex-row align-items-center justify-content-center"
                  style="width: 120px"
                >
                  <div class="d-flex flex-column">
                    <span class="small text-uppercase" style="font-size: 0.7rem"
                      >Giảm</span
                    >
                    <span class="fw-bold fs-4">
                      {{
                        v.discountType === "PERCENTAGE"
                          ? v.discountValue + "%"
                          : formatShortPrice(v.discountValue)
                      }}
                    </span>
                  </div>
                </div>

                <div
                  class="p-3 flex-grow-1 bg-white border-start border-3 border-danger border-opacity-10"
                >
                  <div class="fw-bold text-dark truncate-2">{{ v.name }}</div>
                  <div class="small text-muted mt-1">
                    Đơn tối thiểu: {{ formatPrice(v.minOrderValue) }}
                  </div>

                  <div
                    class="mt-2 d-flex align-items-center justify-content-between"
                  >
                    <span class="text-danger small" style="font-size: 0.75rem">
                      HSD: {{ formatDate(v.endDate) }}
                    </span>
                    <span
                      v-if="selectedTotalAmount < v.minOrderValue"
                      class="badge bg-secondary"
                      style="font-size: 0.6rem"
                    >
                      Thiếu
                      {{ formatPrice(v.minOrderValue - selectedTotalAmount) }}
                    </span>
                  </div>
                </div>

                <div class="p-3 bg-white d-flex align-items-center">
                  <input
                    type="radio"
                    name="v-radio"
                    :value="v"
                    v-model="tempSelectedVoucher"
                    class="form-check-input brand-checkbox"
                    :disabled="selectedTotalAmount < v.minOrderValue"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-light px-4"
              data-bs-dismiss="modal"
            >
              TRỞ LẠI
            </button>
            <button
              type="button"
              class="btn btn-danger px-4 fw-bold"
              data-bs-dismiss="modal"
              @click="confirmVoucher"
            >
              XÁC NHẬN
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { cartCount } from "@/cartState";

export default {
  name: "Cart",
  data() {
    return {
      cartItems: [],
      selectedItems: [],
      vouchers: [],
      loading: true,
      voucherCodeInput: "",
      tempSelectedVoucher: null,
      appliedVoucher: null,
    };
  },
  computed: {
    selectAll: {
      get() {
        return (
          this.cartItems.length > 0 &&
          this.selectedItems.length === this.cartItems.length
        );
      },
      set(value) {
        this.selectedItems = value
          ? this.cartItems.map((item) => item.variantId)
          : [];
      },
    },
    selectedTotalAmount() {
      return this.cartItems
        .filter((item) => this.selectedItems.includes(item.variantId))
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    },
    discountAmount() {
      if (
        !this.appliedVoucher ||
        this.selectedTotalAmount < this.appliedVoucher.minOrderValue
      )
        return 0;
      const v = this.appliedVoucher;
      if (v.discountType === "PERCENTAGE") {
        let amount = (this.selectedTotalAmount * v.discountValue) / 100;
        return v.maxDiscountAmount
          ? Math.min(amount, v.maxDiscountAmount)
          : amount;
      }
      return v.discountValue;
    },
    finalTotalAmount() {
      return Math.max(0, this.selectedTotalAmount - this.discountAmount);
    },
  },
  watch: {
    cartItems: {
      deep: true,
      handler(newItems) {
        cartCount.value = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
      },
    },
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    // Cart.vue
    getUserId() {
      // Tìm trong cả 2 kho
      const userRaw =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (!userRaw || userRaw === "undefined" || userRaw === "null")
        return null;

      try {
        const userObj = JSON.parse(userRaw);
        // Nếu là object {id: '...'} thì lấy .id, nếu là chuỗi ID thuần thì lấy chính nó
        if (userObj && typeof userObj === "object") {
          return userObj.id || userObj.sub || null;
        }
        return userObj;
      } catch (e) {
        return userRaw; // Nếu không phải JSON, trả về chuỗi ID thuần
      }
    },
    async fetchCart() {
      try {
        const res = await axios.get("http://localhost:8080/cart", {
          headers: this.getAuthHeaders(),
        });
        this.cartItems = res.data.items || res.data.result?.items || [];
      } catch (error) {
        if (error.response?.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            this.$router.push("/login");
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchUserVouchers() {
      const userId = this.getUserId();
      if (!userId) {
        console.error("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:8080/promotions/my-vouchers/${userId}`,
          {
            headers: this.getAuthHeaders(),
          }
        );
        this.vouchers = res.data;
      } catch (e) {
        console.error("Lỗi lấy voucher:", e);
      }
    },
    async applyVoucherByCode() {
      if (!this.voucherCodeInput) return;
      try {
        const userId = this.getUserId();
        await axios.post(
          `http://localhost:8080/promotions/claim`,
          {
            userId: userId,
            voucherCode: this.voucherCodeInput,
          },
          { headers: this.getAuthHeaders() }
        );
        this.voucherCodeInput = "";
        this.fetchUserVouchers();
        alert("Săn mã thành công!");
      } catch (e) {
        alert(
          e.response?.data?.error || "Mã không hợp lệ hoặc đã được sử dụng"
        );
      }
    },
    confirmVoucher() {
      this.appliedVoucher = this.tempSelectedVoucher;
    },
    formatPrice(p) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      })
        .format(p || 0)
        .replace("VND", "₫");
    },
    formatShortPrice(price) {
      return price >= 1000 ? price / 1000 + "k" : price;
    },
    formatDate(dateString) {
      if (!dateString) return "Hết hạn";
      return new Date(dateString).toLocaleDateString("vi-VN");
    },
    increaseQty(item) {
      item.quantity += 1;
      this.updateItem(item);
    },
    decreaseQty(item) {
      if (item.quantity > 1) {
        item.quantity -= 1;
        this.updateItem(item);
      }
    },
    async updateItem(item) {
      try {
        await axios.put(
          "http://localhost:8080/cart/item",
          { variantId: item.variantId, quantity: item.quantity },
          { headers: this.getAuthHeaders() }
        );
      } catch (e) {
        alert("Lỗi cập nhật!");
      }
    },
    async removeItem(variantId) {
      if (!confirm("Xóa sản phẩm này?")) return;
      try {
        await axios.delete(`http://localhost:8080/cart/item/${variantId}`, {
          headers: this.getAuthHeaders(),
        });
        this.fetchCart();
      } catch (e) {
        alert("Lỗi xóa!");
      }
    },
    async removeSelectedItems() {
      if (!this.selectedItems.length || !confirm("Xóa các mục đã chọn?"))
        return;
      try {
        for (const id of this.selectedItems) {
          await axios.delete(`http://localhost:8080/cart/item/${id}`, {
            headers: this.getAuthHeaders(),
          });
        }
        this.selectedItems = [];
        this.fetchCart();
      } catch (e) {
        alert("Lỗi xóa nhiều!");
      }
    },
    checkout() {
      if (this.selectedItems.length === 0) {
        return alert("Vui lòng chọn ít nhất một sản phẩm!");
      }

      const selectedCartItems = this.cartItems.filter((i) =>
        this.selectedItems.includes(i.variantId)
      );

      const checkoutData = {
        selectedItems: selectedCartItems,
        appliedVoucherCode: this.appliedVoucher
          ? this.appliedVoucher.code
          : null,
        subTotal: this.selectedTotalAmount,
        discountAmount: this.discountAmount,
        totalAmount: this.finalTotalAmount,
      };

      // Lưu vào sessionStorage để trang Checkout có thể lấy ra
      sessionStorage.setItem("checkout_data", JSON.stringify(checkoutData));

      // Chuyển trang đơn giản bằng name
      this.$router.push({ name: "Checkout" });
    },
  },
  mounted() {
    this.fetchCart();
  },
};
</script>

<style scoped>
.cart-page-wrapper {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 100px;
}
.col-checkbox {
  width: 5%;
}
.col-product {
  width: 45%;
}
.col-price,
.col-qty {
  width: 15%;
}
.col-total,
.col-action {
  width: 10%;
}
.brand-checkbox {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  border-radius: 2px;
}
.brand-checkbox:checked {
  background-color: #ee4d2d;
  border-color: #ee4d2d;
}
.checkout-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  border-top: 1px solid #eee;
}
.voucher-list::-webkit-scrollbar {
  width: 5px;
}
.voucher-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}
.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>