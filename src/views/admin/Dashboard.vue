<script setup>
import { ref, onMounted } from 'vue';
import { getDashboardStats } from '@/api/admin/statsApi'; // Đường dẫn tới file API ở Bước 1
import { Line, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

const loaded = ref(false);
const stats = ref({
  totalRevenue: 0, totalBookings: 0, totalUsers: 0, totalProducts: 0
});

// Dữ liệu cho biểu đồ Doanh thu (Line Chart)
const revenueChartData = ref({
  labels: [], // Sẽ chứa danh sách các Tháng ['Tháng 1', 'Tháng 2', ...]
  datasets: [{
    label: 'Doanh thu (VNĐ)',
    backgroundColor: '#0d6efd',
    borderColor: '#0d6efd',
    data: [], // Sẽ chứa mảng các con số doanh thu thực tế
    tension: 0.4
  }]
});

// Dữ liệu cho biểu đồ Sản phẩm (Doughnut Chart)
const productChartData = ref({
  labels: [], // Tên các sản phẩm
  datasets: [{
    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#FFCE56', '#94D1BE'],
    data: [] // Số lượng bán được
  }]
});

const fetchData = async () => {
  try {
    const res = await getDashboardStats();
    const data = res.data.result; // Kết quả DashboardResponse từ Java

    // 1. Cập nhật các thẻ con số tổng quát
    stats.value = {
      totalRevenue: data.totalRevenue,
      totalBookings: data.totalBookings,
      totalUsers: data.totalUsers,
      totalProducts: data.totalProducts
    };

    // 2. Map dữ liệu cho Biểu đồ Doanh thu
    revenueChartData.value.labels = data.monthlyRevenue.map(item => item.month);
    revenueChartData.value.datasets[0].data = data.monthlyRevenue.map(item => item.amount);

    // 3. Map dữ liệu cho Biểu đồ Top sản phẩm
    productChartData.value.labels = data.topProducts.map(item => item.productName);
    productChartData.value.datasets[0].data = data.topProducts.map(item => item.totalSold);

    // 4. Bật trạng thái đã tải xong để render biểu đồ
    loaded.value = true;
  } catch (e) {
    console.error("Lỗi lấy thống kê:", e);
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

onMounted(fetchData);
</script>
<template>
  <div class="container-fluid py-4">
    <h4 class="fw-bold mb-4 text-success text-uppercase">Bảng Điều Khiển Thống Kê</h4>

    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-primary text-white p-3 h-100">
          <div class="small text-uppercase opacity-75">Tổng doanh thu</div>
          <h3 class="fw-bold mb-0 mt-2">{{ formatCurrency(stats.totalRevenue) }}</h3>
          <i class="bi bi-wallet2 fs-1 position-absolute end-0 bottom-0 opacity-25 m-2"></i>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 shadow-sm bg-success text-white p-3 h-100">
          <div class="small text-uppercase opacity-75">Đơn đặt sân</div>
          <h3 class="fw-bold mb-0 mt-2">{{ stats.totalBookings }}</h3>
          <i class="bi bi-calendar-check fs-1 position-absolute end-0 bottom-0 opacity-25 m-2"></i>
        </div>
      </div>
      </div>

    <div class="row g-4">
      <div class="col-lg-8">
        <div class="bg-white p-4 rounded shadow-sm border h-100">
          <h6 class="fw-bold mb-4 text-secondary text-uppercase small">Biến động doanh thu theo tháng</h6>
          <div style="height: 400px;">
             <Line v-if="loaded" :data="revenueChartData" :options="{ responsive: true, maintainAspectRatio: false }" />
             <div v-else class="text-center py-5">Đang tải dữ liệu...</div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="bg-white p-4 rounded shadow-sm border h-100">
          <h6 class="fw-bold mb-4 text-secondary text-uppercase small">Tỷ lệ tiêu thụ sản phẩm</h6>
          <div style="height: 300px;">
             <Doughnut v-if="loaded" :data="productChartData" :options="{ responsive: true, maintainAspectRatio: false }" />
             <div v-else class="text-center py-5">Đang tải dữ liệu...</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>