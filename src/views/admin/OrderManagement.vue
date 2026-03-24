<template>
  <div class="admin-order-container">
    <div class="header-actions">
      <h2 class="fw-bold mb-0">Quản lý Đơn hàng</h2>
      
      <div class="filter-group">
        <label class="me-2 fw-bold text-muted">Lọc trạng thái:</label>
        <select v-model="statusFilter" @change="handleFilterChange" class="form-select w-auto d-inline-block">
          <option value="">Tất cả đơn hàng</option>
          <option value="PENDING">Chờ xác nhận</option>
          <option value="CONFIRMED">Đã xác nhận</option>
          <option value="SHIPPING">Đang giao hàng</option>
          <option value="DELIVERED">Đã giao</option>
          <option value="SUCCESS">Mua tại cửa hàng</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
        <button @click="fetchOrders(1)" class="btn btn-primary ms-3" :disabled="isLoading">
          <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
        </button>
      </div>
    </div>

    <div class="table-responsive shadow-sm rounded bg-white mt-4">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-light">
          <tr>
            <th>Mã ĐH</th>
            <th>Khách hàng</th>
            <th>SĐT</th>
            <th>Ngày đặt</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th class="text-center">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="8" class="text-center py-4">
              <div class="spinner-border text-primary" role="status"></div>
              <div class="mt-2 text-muted">Đang tải dữ liệu...</div>
            </td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="8" class="text-center py-4 text-muted fst-italic">
              Không tìm thấy đơn hàng nào.
            </td>
          </tr>
          
          <tr v-for="order in orders" :key="order.id" v-else>
            <td><span class="fw-bold text-primary">#{{ shortId(order.id) }}</span></td>
            <td>{{ order.customerName }}</td>
            <td>{{ order.phoneNumber }}</td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td class="text-danger fw-bold">{{ formatPrice(order.totalAmount) }}</td>
            <td>
              <span class="badge bg-secondary">{{ order.paymentMethod }}</span>
              <div class="small mt-1" :class="order.paymentStatus === 'PAID' ? 'text-success' : 'text-warning'">
                {{ order.paymentStatus === 'PAID' ? 'Đã thanh toán' : 'Chưa thanh toán' }}
              </div>
            </td>
            <td>
              <select 
                v-model="order.status" 
                @change="updateOrderStatus(order, $event.target.value)"
                class="form-select form-select-sm status-select"
                :class="getStatusClass(order.status)"
              >
                <option value="PENDING">Chờ xác nhận</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="SHIPPING">Đang giao hàng</option>
                <option value="DELIVERED">Đã giao</option>
                <option value="SUCCESS">Mua tại cửa hàng</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </td>
            <td class="text-center">
              <button @click="viewDetails(order)" class="btn btn-sm btn-outline-info">
                <i class="bi bi-eye"></i> Chi tiết
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3" v-if="totalPages > 1">
      <div class="text-muted small">
        Trang {{ currentPage }} / {{ totalPages }}
      </div>
      <ul class="pagination mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="fetchOrders(currentPage - 1)">Trước</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="fetchOrders(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="fetchOrders(currentPage + 1)">Sau</button>
        </li>
      </ul>
    </div>

    <div v-if="showModal" class="custom-modal-overlay" @click.self="closeModal">
      <div class="custom-modal-content">
        <div class="modal-header border-bottom pb-3 mb-3 d-flex justify-content-between align-items-center">
          <h5 class="mb-0 fw-bold">Chi tiết Đơn hàng #{{ shortId(selectedOrder.id) }}</h5>
          <button @click="closeModal" class="btn-close"></button>
        </div>
        
        <div class="modal-body">
          <div class="row mb-4">
            <div class="col-md-6">
              <h6 class="fw-bold text-secondary">Thông tin khách hàng</h6>
              <p class="mb-1"><strong>Tên:</strong> {{ selectedOrder.customerName }}</p>
              <p class="mb-1"><strong>SĐT:</strong> {{ selectedOrder.phoneNumber }}</p>
              <p class="mb-1"><strong>Địa chỉ:</strong> {{ selectedOrder.shippingAddress }}</p>
              <p class="mb-1" v-if="selectedOrder.note"><strong>Ghi chú:</strong> {{ selectedOrder.note }}</p>
            </div>
            <div class="col-md-6">
              <h6 class="fw-bold text-secondary">Thông tin thanh toán</h6>
              <p class="mb-1"><strong>Tạm tính:</strong> {{ formatPrice(selectedOrder.subTotal) }}</p>
              <p class="mb-1 text-success"><strong>Giảm giá:</strong> -{{ formatPrice(selectedOrder.discountAmount) }} <span v-if="selectedOrder.voucherCode">({{ selectedOrder.voucherCode }})</span></p>
              <p class="mb-1 fs-5 text-danger fw-bold"><strong>Tổng cộng:</strong> {{ formatPrice(selectedOrder.totalAmount) }}</p>
            </div>
          </div>

          <h6 class="fw-bold text-secondary mb-3">Sản phẩm đã đặt</h6>
          <div class="table-responsive">
            <table class="table table-bordered align-middle">
              <thead class="table-light">
                <tr>
                  <th>Ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Phân loại</th>
                  <th>Đơn giá</th>
                  <th>SL</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td style="width: 70px;">
                    <img :src="item.imageSnapshot || 'https://via.placeholder.com/60'" class="rounded border" style="width: 50px; height: 50px; object-fit: cover;">
                  </td>
                  <td>
                    <div class="fw-bold">{{ item.productName }}</div>
                    <div class="text-muted small">SKU: {{ item.sku }}</div>
                  </td>
                  <td>
                    <span v-for="(val, key) in item.attributesSnapshot" :key="key" class="badge bg-light text-dark border me-1">
                      {{ key }}: {{ val }}
                    </span>
                  </td>
                  <td>{{ formatPrice(item.priceAtPurchase) }}</td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="fw-bold">{{ formatPrice(item.priceAtPurchase * item.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/admin/orders';
const orders = ref([]);
const isLoading = ref(false);
const statusFilter = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = ref(10);
const showModal = ref(false);
const selectedOrder = ref(null);
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const shortId = (id) => id ? id.substring(0, 8).toUpperCase() : '';

const formatPrice = (price) => {
  if (!price) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatDate = (dateString) => {
  if (!dateString) return '---';
  const d = new Date(dateString);
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const getStatusClass = (status) => {
  const map = {
    'PENDING': 'bg-warning-subtle text-warning-emphasis', 
    'CONFIRMED': 'bg-info-subtle text-info-emphasis',       
    'SHIPPING': 'bg-primary-subtle text-primary-emphasis',  
    'DELIVERED': 'bg-success-subtle text-success-emphasis', 
    'SUCCESS': 'bg-success-subtle text-success-emphasis',   
    'CANCELLED': 'bg-danger-subtle text-danger-emphasis'    
  };
  return map[status] || '';
};

const fetchOrders = async (page = 1) => {
  isLoading.value = true;
  currentPage.value = page;
  try {
    const params = {
      page: currentPage.value,
      size: pageSize.value,
    };
    if (statusFilter.value) {
      params.status = statusFilter.value;
    }

    const response = await axios.get(API_BASE_URL, {
      ...getAuthHeaders(),
      params: params
    });
    const pageResponse = response.data.result;
    orders.value = pageResponse.data || pageResponse.content || []; 
    totalPages.value = pageResponse.totalPages || 1;

  } catch (error) {
    console.error('Lỗi tải danh sách đơn hàng:', error);
    if (error.response?.status === 401) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
    }
  } finally {
    isLoading.value = false;
  }
};

const handleFilterChange = () => {
  fetchOrders(1);
};

const updateOrderStatus = async (order, newStatus) => {
  const originalStatus = order.status;
  if (!confirm(`Xác nhận đổi trạng thái đơn hàng #${shortId(order.id)} thành ${newStatus}?`)) {
    fetchOrders(currentPage.value); 
    return;
  }

  try {
    const payload = { status: newStatus };
    await axios.patch(`${API_BASE_URL}/${order.id}/status`, payload, getAuthHeaders());
    alert("Cập nhật trạng thái thành công!");
    if (statusFilter.value) {
      fetchOrders(currentPage.value);
    }
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái:', error);
    alert("Cập nhật thất bại!");
    order.status = originalStatus; 
  }
};
const viewDetails = (order) => {
  selectedOrder.value = order;
  showModal.value = true;
  document.body.style.overflow = 'hidden'; 
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
  document.body.style.overflow = 'auto';
};

onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.admin-order-container {
  padding: 24px;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.status-select {
  font-weight: 500;
  border: 1px solid #dee2e6;
  cursor: pointer;
}

/* Modal Overlay làm mờ background */
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 20px;
}

.custom-modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.table th {
  white-space: nowrap;
}
</style>