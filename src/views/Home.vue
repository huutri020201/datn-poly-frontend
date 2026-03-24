<template>
  <div class="home-page bg-light min-h-screen pb-5">
    
    <!-- 1. PHẦN PHỤ KIỆN (ACCESSORIES) -->
    <div class="container mt-5">
      <h4 class="fw-bold text-uppercase border-start border-4 border-primary ps-3 mb-4">
        Phụ kiện thể thao
      </h4>

      <swiper
        :modules="swiperModules"
        :slides-per-view="4"
        :grid="{ rows: 2, fill: 'row' }"
        :space-between="20"
        :pagination="paginationOptionsAcc"
        :navigation="{ prevEl: '.acc-prev', nextEl: '.acc-next' }"
        class="product-swiper"
      >
        <swiper-slide v-for="p in products" :key="p.id">
          <div class="card product-card h-100 border-0 shadow-sm">
            <img :src="getImage(p)" class="card-img-top" alt="product">
            <div class="card-body text-center">
              <h6 class="card-title text-truncate">{{ p.name }}</h6>
              <p class="text-danger fw-bold mb-2">{{ formatPrice(p.basePrice) }}</p>
              <button class="btn btn-dark btn-sm w-100 rounded-pill" @click="viewProduct(p.id)">
                Xem chi tiết
              </button>
            </div>
          </div>
        </swiper-slide>
      </swiper>
      
      <!-- Điều khiển Phụ kiện: Prev - Số - Next -->
      <div class="d-flex justify-content-center align-items-center mt-4 gap-3">
        <button class="btn btn-outline-primary rounded-circle nav-btn-custom acc-prev">
          <i class="bi bi-chevron-left"></i>
        </button>

        <div class="pagination-acc d-flex justify-content-center m-0"></div>

        <button class="btn btn-outline-primary rounded-circle nav-btn-custom acc-next">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <hr class="container my-5 opacity-25">

    <!-- 2. PHẦN ĐẶT SÂN (PITCHES) -->
    <div class="container">
      <h4 class="fw-bold text-uppercase border-start border-4 border-warning ps-3 mb-4">
        Danh sách Sân bóng
      </h4>

      <swiper
        :modules="swiperModules"
        :slides-per-view="4"
        :grid="{ rows: 2, fill: 'row' }"
        :space-between="20"
        :pagination="paginationOptionsPitch"
        :navigation="{ prevEl: '.pitch-prev', nextEl: '.pitch-next' }"
        class="pitch-swiper"
      >
        <swiper-slide v-for="pitch in pitches" :key="pitch.id">
          <div class="card h-100 border-0 shadow-sm pitch-card overflow-hidden">
            <div class="position-relative">
              <img src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop" 
                   class="card-img-top" alt="Pitch Image">
              <div class="pitch-logo shadow-sm bg-white rounded-circle d-flex justify-content-center align-items-center">
                <i class="bi bi-dribbble text-warning fs-5"></i>
              </div>
            </div>

            <div class="card-body pt-4">
              <h6 class="card-title fw-bold text-truncate mt-2">{{ pitch.name }}</h6>
              <div class="text-muted small mb-1">
                <i class="bi bi-geo-alt-fill text-danger me-1"></i> Quận Gò Vấp, HCM
              </div>
              <div class="fw-bold text-danger mb-3">{{ formatPrice(pitch.pricePerHour) }} / giờ</div>
              <button @click="openBookingModal(pitch)" class="btn btn-warning btn-sm w-100 fw-bold text-white rounded-pill">
                ĐẶT LỊCH
              </button>
            </div>
          </div>
        </swiper-slide>
      </swiper>

      <!-- Điều khiển Sân bóng: Prev - Số - Next -->
      <div class="d-flex justify-content-center align-items-center mt-4 gap-3">
        <button class="btn btn-outline-warning rounded-circle nav-btn-custom pitch-prev">
          <i class="bi bi-chevron-left"></i>
        </button>

        <div class="pagination-pitch d-flex justify-content-center m-0"></div>

        <button class="btn btn-outline-warning rounded-circle nav-btn-custom pitch-next">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- 3. MODAL ĐẶT LỊCH (Giữ nguyên) -->
    <!-- ... đoạn code Modal của bạn ... -->
  </div>
</template>

<script setup>
// Giữ nguyên phần script của bạn, nhưng đảm bảo biến paginationOptionsPitch trỏ đúng class
// ... (các import)

const paginationOptionsAcc = {
  el: '.pagination-acc',
  clickable: true,
  renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`
};

const paginationOptionsPitch = {
  el: '.pagination-pitch', // Sửa lại chỗ này cho đúng class ở template
  clickable: true,
  renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`
};

// ... (các logic fetch API và formatPrice)
</script>

<style scoped>
/* Giữ nguyên CSS cũ và thêm/chỉnh một chút cho các nút */
.nav-btn-custom {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  z-index: 10;
}

/* Khi nút bị vô hiệu hóa (hết trang) */
:deep(.swiper-button-disabled) {
  opacity: 0.3;
  pointer-events: none;
}

/* Đảm bảo Swiper hiển thị đủ 2 dòng */
.product-swiper, .pitch-swiper {
  padding-bottom: 20px;
  height: auto; 
  min-height: 650px;
}
</style>