<template>
  <div class="cart-page-wrapper">
    <div class="container my-4">
      <h4 class="mb-4 text-dark">Giỏ hàng của bạn</h4>

      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-danger" role="status"></div>
        <div class="mt-2 text-muted">Đang tải giỏ hàng...</div>
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart text-center my-5 bg-white p-5 rounded shadow-sm">
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" style="width: 120px; opacity: 0.6;" class="mb-4">
        <p class="fs-6 text-muted mb-3">Giỏ hàng của bạn còn trống</p>
        <button class="btn px-5 py-2 text-white text-uppercase fw-bold" style="background-color: #ee4d2d;" @click="$router.push('/products')">
          Tiếp tục mua sắm
        </button>
      </div>

      <div v-else class="cart-content">
        
        <div class="cart-header-row bg-white rounded shadow-sm d-flex align-items-center py-3 px-4 mb-3 text-muted" style="font-size: 0.9rem;">
          <div class="col-checkbox d-flex align-items-center">
            <input class="form-check-input brand-checkbox me-3" type="checkbox" id="selectAllTop" v-model="selectAll">
          </div>
          <div class="col-product">Sản Phẩm</div>
          <div class="col-price text-center">Đơn Giá</div>
          <div class="col-qty text-center">Số Lượng</div>
          <div class="col-total text-center">Số Tiền</div>
          <div class="col-action text-center">Thao Tác</div>
        </div>

        <div class="cart-items-wrapper bg-white rounded shadow-sm mb-3">
          
          <div v-for="item in cartItems" :key="item.variantId" class="cart-item-row d-flex align-items-center py-3 px-4 border-bottom">
            
            <div class="col-checkbox d-flex align-items-center">
              <input class="form-check-input brand-checkbox me-3" type="checkbox" :value="item.variantId" v-model="selectedItems">
            </div>

            <div class="col-product d-flex align-items-center pe-3">
              <img :src="item.imageUrl || 'https://via.placeholder.com/80'" alt="img" class="border rounded me-3" style="width: 80px; height: 80px; object-fit: cover;">
              <div class="product-info d-flex flex-column justify-content-center">
                <span class="text-dark mb-1 product-name" style="font-size: 0.95rem; line-height: 1.2;">{{ item.productName }}</span>
                <span class="text-muted small">Phân loại: {{ item.variantName }}</span>
              </div>
            </div>

            <div class="col-price text-center text-muted">
              {{ formatPrice(item.unitPrice) }}
            </div>

            <div class="col-qty d-flex justify-content-center">
              <div class="qty-control d-flex border rounded">
                <button class="btn btn-sm btn-light border-0 px-2 rounded-0" style="width: 30px;" @click="decreaseQty(item)">-</button>
                <input type="number" class="form-control form-control-sm text-center border-0 rounded-0 px-1" style="width: 45px; box-shadow: none;" v-model.number="item.quantity" @change="updateItem(item)" min="1">
                <button class="btn btn-sm btn-light border-0 px-2 rounded-0" style="width: 30px;" @click="increaseQty(item)">+</button>
              </div>
            </div>

            <div class="col-total text-center fw-bold" style="color: #ee4d2d;">
              {{ formatPrice(item.unitPrice * item.quantity) }}
            </div>

            <div class="col-action text-center">
              <button class="btn btn-link text-dark text-decoration-none p-0 mb-1 btn-delete" @click="removeItem(item.variantId)">Xóa</button>
            </div>
          </div>
        </div>

        <div class="bg-white rounded shadow-sm mb-3">
          <div class="d-flex justify-content-end align-items-center border-bottom p-4">
            <div class="d-flex align-items-center">
              <svg fill="none" viewBox="0 -2 23 22" style="width: 20px; height: 20px; color: #ee4d2d; fill: currentColor;" class="me-2"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.983 18.232l-1.921 1.636c-.432.368-1.077.368-1.509 0l-1.921-1.636a1 1 0 00-.645-.232H3.945c-.552 0-1-.448-1-1v-3.042a1 1 0 00-.232-.645L1.077 11.39c-.368-.432-.368-1.077 0-1.509l1.636-1.921c.15-.175.232-.398.232-.645V4.273c0-.552.448-1 1-1h3.042c.247 0 .47-.082.645-.232L9.553 1.405c.432-.368 1.077-.368 1.509 0l1.921 1.636c.175.15.398.232.645.232h3.042c.552 0 1 .448 1 1v3.042c0 .247.082.47.232.645l1.636 1.921c.368.432.368 1.077 0 1.509l-1.636 1.921a1 1 0 00-.232.645v3.042c0 .552-.448 1-1 1h-3.042a1 1 0 00-.645.232zM9.5 6.5a1 1 0 100 2 1 1 0 000-2zm0 6a1 1 0 100 2 1 1 0 000-2zm3-3a1 1 0 100 2 1 1 0 000-2zm0-3a1 1 0 100 2 1 1 0 000-2z"></path></svg>
              <span class="fs-6 text-dark me-5">Mã Giảm Giá / Voucher</span>
            </div>
            <button class="btn btn-link text-primary text-decoration-none p-0">Chọn hoặc nhập mã</button>
          </div>
          
          <div class="d-flex justify-content-end align-items-center p-4">
            <div class="d-flex align-items-center text-muted">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="me-2 text-warning"><circle cx="10" cy="10" r="9.5" stroke="currentColor"></circle><text x="50%" y="50%" text-anchor="middle" stroke="currentColor" stroke-width="1px" dy=".3em" font-size="12">$</text></svg>
              <span class="me-2">Sử dụng điểm thưởng</span>
              <span class="small me-5">Bạn chưa có điểm</span>
            </div>
            <span class="text-muted">-0₫</span>
          </div>
        </div>

      </div>
    </div>

    <div v-if="cartItems.length > 0" class="checkout-sticky-bar bg-white shadow py-3">
      <div class="container d-flex justify-content-between align-items-center">
        
        <div class="d-flex align-items-center">
          <input class="form-check-input brand-checkbox mx-3" type="checkbox" id="selectAllBottom" v-model="selectAll">
          <label class="cursor-pointer me-4 text-dark" for="selectAllBottom">Chọn Tất Cả ({{ cartItems.length }})</label>
          <button class="btn btn-link text-dark text-decoration-none p-0 me-4 btn-delete" @click="removeSelectedItems">Xóa mục đã chọn</button>
        </div>

        <div class="d-flex align-items-center">
          <div class="text-end me-4">
            <div class="d-flex align-items-center">
              <span class="text-dark me-2">Tổng thanh toán ({{ selectedItems.length }} Sản phẩm):</span>
              <span class="fs-4 fw-bold" style="color: #ee4d2d;">{{ formatPrice(selectedTotalAmount) }}</span>
            </div>
            <div class="text-muted" style="font-size: 0.8rem;">Đã bao gồm VAT (nếu có)</div>
          </div>
          <button class="btn text-white px-5 py-2 fs-5 checkout-btn" 
                  :class="{'disabled': selectedItems.length === 0}" 
                  style="background-color: #ee4d2d; min-width: 200px; border-radius: 2px;"
                  @click="checkout">
            MUA HÀNG
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { cartCount } from '@/cartState';

export default {
  name: "Cart",

  data() {
    return {
      cartItems: [],
      selectedItems: [],
      loading: true
    };
  },

  computed: {
    selectAll: {
      get() {
        return this.cartItems.length > 0 && this.selectedItems.length === this.cartItems.length;
      },
      set(value) {
        if (value) {
          this.selectedItems = this.cartItems.map(item => item.variantId);
        } else {
          this.selectedItems = [];
        }
      }
    },
    selectedTotalAmount() {
      return this.cartItems
        .filter(item => this.selectedItems.includes(item.variantId))
        .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    }
  },

  watch: {
    cartItems: {
      deep: true,
      handler(newItems) {
        cartCount.value = newItems.reduce((sum, item) => sum + item.quantity, 0);
      }
    }
  },

  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem("accessToken");
      return token ? { Authorization: `Bearer ${token}` } : {};
    },

    async fetchCart() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        this.loading = false;
        this.$router.push("/login");
        return; 
      }
      try {
        const res = await axios.get("http://localhost:8080/cart", { headers: this.getAuthHeaders() });
        this.cartItems = res.data.items || res.data.result?.items || [];
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          this.$router.push("/login");
        }
      } finally {
        this.loading = false;
      }
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
      if (item.quantity < 1) item.quantity = 1;
      try {
        await axios.put("http://localhost:8080/cart/item", {
          variantId: item.variantId,
          quantity: item.quantity
        }, { headers: this.getAuthHeaders() });
      } catch (error) {
        alert("Không thể cập nhật số lượng!");
      }
    },

    async removeItem(variantId) {
      if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
      try {
        await axios.delete(`http://localhost:8080/cart/item/${variantId}`, { headers: this.getAuthHeaders() });
        this.cartItems = this.cartItems.filter(item => item.variantId !== variantId);
        this.selectedItems = this.selectedItems.filter(id => id !== variantId);
      } catch (error) {
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      }
    },

    async removeSelectedItems() {
      if (this.selectedItems.length === 0) return alert("Vui lòng tick chọn sản phẩm cần xóa!");
      if (!confirm("Xóa các sản phẩm đã chọn?")) return;
      
      try {
        for (const variantId of this.selectedItems) {
          await axios.delete(`http://localhost:8080/cart/item/${variantId}`, { headers: this.getAuthHeaders() });
        }
        this.cartItems = this.cartItems.filter(item => !this.selectedItems.includes(item.variantId));
        this.selectedItems = [];
      } catch (error) {
        alert("Có lỗi xảy ra trong quá trình xóa!");
      }
    },

    checkout() {
      if (this.selectedItems.length === 0) {
        return alert("Vui lòng chọn sản phẩm!");
        }

      const selectedCartItems = this.cartItems.filter(item =>
      this.selectedItems.includes(item.variantId)
    );

      const order = {
        customerId: null, 
        shippingAddress: "",
        note: "",
        totalAmount: this.selectedTotalAmount,
        items: selectedCartItems.map(item => ({
        externalItemId: item.variantId,
        itemType: "product",
        itemName: item.productName,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.unitPrice * item.quantity
      }))
    };

      this.$router.push({
      path: "/orders",
      state: { order }
      });
    },

    formatPrice(price) {
      if (!price) return '0₫';
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(price).replace('VND', '₫');
    }
  },

  mounted() {
    this.fetchCart();
  }
};
</script>

<style scoped>
.cart-page-wrapper {
  background-color: #f5f5f5;
  min-height: calc(100vh - 100px);
  padding-bottom: 80px; 
}

.col-checkbox { width: 5%; justify-content: center; }
.col-product  { width: 45%; }
.col-price    { width: 15%; }
.col-qty      { width: 15%; }
.col-total    { width: 10%; }
.col-action   { width: 10%; }

.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-delete:hover {
  color: #ee4d2d !important;
}

.brand-checkbox {
  width: 1.1rem;
  height: 1.1rem;
  border: 1px solid #ccc;
  border-radius: 2px;
  cursor: pointer;
}
.brand-checkbox:checked {
  background-color: #ee4d2d;
  border-color: #ee4d2d;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none; margin: 0;
}
input[type="number"] { -moz-appearance: textfield; }

.cursor-pointer { cursor: pointer; }

.checkout-btn.disabled {
  opacity: 0.7;
  cursor: not-allowed;
  pointer-events: none;
}

.checkout-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05) !important;
}
</style>