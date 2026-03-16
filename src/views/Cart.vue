<template>
  <div class="cart-page d-flex justify-content-center align-items-center mt-5">
    <div class="cart-card p-4 shadow">

      <h3 class="text-center mb-4">Giỏ hàng của bạn</h3>

      <div v-if="loading" class="text-center">
        <div class="spinner-border text-dark" role="status"></div>
        <div class="mt-2">Đang tải giỏ hàng...</div>
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <p>Giỏ hàng của bạn đang trống</p>
        <button class="btn btn-dark mt-2" @click="$router.push('/products')">
          Tiếp tục mua sắm
        </button>
      </div>

      <div v-else>
        <table class="cart-table mb-3">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Phân loại</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in cartItems" :key="item.variantId">
              <td>{{ item.productName }}</td>
              <td>{{ item.variantName }}</td>
              <td class="text-danger fw-bold">{{ formatPrice(item.unitPrice) }}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  class="cart-input"
                  v-model.number="item.quantity"
                  @change="updateItem(item)"
                />
              </td>
              <td class="text-danger fw-bold">
                {{ formatPrice(item.unitPrice * item.quantity) }}
              </td>
              <td>
                <button
                  class="btn btn-sm btn-danger-custom"
                  @click="removeItem(item.variantId)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="cart-summary d-flex justify-content-between align-items-center mt-4">
          <h4 class="mb-0">Tổng tiền: <span class="text-danger">{{ formatPrice(totalAmount) }}</span></h4>

          <div class="d-flex gap-2">
            <button
              class="btn btn-outline-danger"
              @click="clearCart"
            >
              Xóa tất cả
            </button>
            <button
              class="btn btn-dark-custom px-4"
              @click="checkout"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Cart",

  data() {
    return {
      cartItems: [],
      loading: true
    };
  },

  computed: {
    totalAmount() {
      return this.cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );
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
        const res = await axios.get("http://localhost:8080/cart", {
          headers: this.getAuthHeaders()
        });
        
        this.cartItems = res.data.items || res.data.result?.items || [];
      } catch (error) {
        console.error("Lỗi load cart:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("accessToken");
          this.$router.push("/login");
        }
      } finally {
        this.loading = false;
      }
    },

    async updateItem(item) {
      if (item.quantity < 1) {
        alert("Số lượng ít nhất phải là 1");
        item.quantity = 1;
      }
      
      try {
        await axios.put("http://localhost:8080/cart/item", {
          variantId: item.variantId,
          quantity: item.quantity
        }, {
          headers: this.getAuthHeaders()
        });
      } catch (error) {
        console.error("Update cart lỗi:", error);
        alert("Không thể cập nhật số lượng!");
      }
    },

    async removeItem(variantId) {
      try {
        await axios.delete(`http://localhost:8080/cart/item/${variantId}`, {
          headers: this.getAuthHeaders()
        });

        this.cartItems = this.cartItems.filter(
          item => item.variantId !== variantId
        );
      } catch (error) {
        console.error("Remove item lỗi:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      }
    },

    async clearCart() {
      if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) return;

      try {
        await axios.delete("http://localhost:8080/cart/clear", {
          headers: this.getAuthHeaders()
        });
        this.cartItems = [];
      } catch (error) {
        console.error("Clear cart lỗi:", error);
        alert("Không thể xóa giỏ hàng lúc này!");
      }
    },

    checkout() {
      alert("Chuyển sang trang thanh toán...");
    },

    formatPrice(price) {
      if (!price) return '0 ₫';
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(price);
    }
  },

  mounted() {
    this.fetchCart();
  }
};
</script>

<style scoped>
.cart-page {
  min-height: 60vh;
}

.cart-card {
  background-color: #fff;
  width: 100%;
  max-width: 900px;
  border-radius: 15px;
  border: 1px solid #eee;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
}

.cart-table th {
  background-color: #f8f9fa;
  color: #333;
  padding: 12px;
  border-bottom: 2px solid #ddd;
}

.cart-table td {
  padding: 15px 10px;
  text-align: center;
  vertical-align: middle;
}

.cart-table tr {
  border-bottom: 1px solid #eee;
}

.cart-input {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px;
  width: 70px;
  text-align: center;
}

.cart-input:focus {
  outline: none;
  border-color: #222;
}

.btn-dark-custom {
  background-color: #222;
  color: white;
  border-radius: 8px;
  padding: 8px 20px;
  font-weight: 500;
  transition: 0.2s;
}

.btn-dark-custom:hover {
  background-color: #444;
  color: white;
}

.btn-danger-custom {
  background-color: #dc3545;
  color: white;
  border-radius: 6px;
  padding: 6px 12px;
  border: none;
  transition: 0.2s;
}

.btn-danger-custom:hover {
  background-color: #bb2d3b;
}

.empty-cart {
  text-align: center;
  padding: 50px 20px;
  font-size: 1.1rem;
  color: #666;
}
</style>