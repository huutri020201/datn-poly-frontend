<template>
  <div class="home-page bg-light min-h-screen pb-5">
    <div class="container">
      <h4
        class="fw-bold text-uppercase border-4 border-black pt-4"
      >Phụ kiện thể thao
      </h4>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else>
        <swiper
          :modules="swiperModules"
          :slides-per-view="4"
          :space-between="20"
          :navigation="{ prevEl: '.acc-prev', nextEl: '.acc-next' }"
          :breakpoints="swiperBreakpoints"
          class="product-swiper"
        >
          <swiper-slide v-for="p in products" :key="p.id" class="py-2">
            <div class="card product-card h-100 border-0 shadow-sm">
              <div class="img-wrapper">
                <img :src="getImage(p)" class="card-img-top" alt="product" />
              </div>
              <div class="card-body text-center d-flex flex-column">
                <h6 class="card-title text-truncate small fw-bold">
                  {{ p.name }}
                </h6>
                <p class="text-danger fw-bold mb-2 mt-auto">
                  {{ formatPrice(p.basePrice) }}
                </p>
                <button
                  class="btn btn-dark btn-sm w-100 rounded-pill"
                  @click="viewProduct(p.id)"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </swiper-slide>
        </swiper>

        <div class="d-flex justify-content-center gap-3 mt-4">
          <button
            class="btn btn-outline-primary rounded-circle nav-btn-custom acc-prev"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button
            class="btn btn-outline-primary rounded-circle nav-btn-custom acc-next"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <hr class="container my-5 opacity-25" />

    <div class="container">
      <h4
        class="fw-bold text-uppercase border-4 border-warning mb-4"
      >
        Danh sách Sân bóng
      </h4>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
      </div>

      <div v-else>
        <swiper
          :modules="swiperModules"
          :slides-per-view="4"
          :space-between="20"
          :navigation="{ prevEl: '.pitch-prev', nextEl: '.pitch-next' }"
          :breakpoints="swiperBreakpoints"
          class="pitch-swiper"
        >
          <swiper-slide v-for="pitch in pitches" :key="pitch.id" class="py-2">
            <div
              class="card h-100 border-0 shadow-sm pitch-card overflow-hidden"
            >
              <div class="position-relative">
                <img
                  src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=800&auto=format&fit=crop"
                  class="card-img-top"
                  alt="Pitch Image"
                />
                <div
                  class="pitch-logo shadow-sm bg-white rounded-circle d-flex justify-content-center align-items-center"
                >
                  <i class="bi bi-dribbble text-warning fs-5"></i>
                </div>
              </div>
              <div class="card-body pt-4 d-flex flex-column">
                <h6 class="card-title fw-bold text-truncate mt-2">
                  {{ pitch.name }}
                </h6>
                <div class="text-muted small mb-1">
                  <i class="bi bi-geo-alt-fill text-danger me-1"></i> Gò Vấp,
                  HCM
                </div>
                <div class="fw-bold text-danger mb-3 mt-auto">
                  {{ formatPrice(pitch.pricePerHour) }} / giờ
                </div>
                <button
                  @click="openBookingModal(pitch)"
                  class="btn btn-warning btn-sm w-100 fw-bold text-white rounded-pill"
                >
                  ĐẶT LỊCH
                </button>
              </div>
            </div>
          </swiper-slide>
        </swiper>

        <div class="d-flex justify-content-center gap-3 mt-4">
          <button
            class="btn btn-outline-warning rounded-circle nav-btn-custom pitch-prev"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
          <button
            class="btn btn-outline-warning rounded-circle nav-btn-custom pitch-next"
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation } from "swiper/modules";

// Swiper Styles
import "swiper/css";
import "swiper/css/navigation";

const router = useRouter();
const swiperModules = [Navigation];

const products = ref([]);
const pitches = ref([]);
const loading = ref(true);

const swiperBreakpoints = {
  320: { slidesPerView: 1 },
  768: { slidesPerView: 2 },
  1024: { slidesPerView: 4 },
};

const fetchData = async () => {
  loading.value = true;
  try {
    const [resProd, resPitch] = await Promise.all([
      axios.get("http://localhost:8080/products"),
      axios.get("http://localhost:8080/pitches"),
    ]);
    products.value = resProd.data.result || [];
    pitches.value = resPitch.data.result || [];
  } catch (err) {
    console.error("Lỗi tải dữ liệu:", err);
  } finally {
    loading.value = false;
  }
};

const formatPrice = (p) =>
  p
    ? new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(p)
    : "0 ₫";

const getImage = (p) =>
  p.variants?.[0]?.imageUrl || "https://via.placeholder.com/300?text=No+Image";

const viewProduct = (id) => router.push(`/product/${id}`);
const openBookingModal = (p) => console.log("Booking:", p.name);

onMounted(fetchData);
</script>

<style scoped>
.nav-btn-custom {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background: white;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.nav-btn-custom:hover {
  background-color: #f8f9fa;
  transform: scale(1.1);
}

.swiper-button-disabled {
  opacity: 0.2 !important;
  pointer-events: none;
}

.product-swiper,
.pitch-swiper {
  padding: 10px 0 10px 0;
}

.product-card,
.pitch-card {
  transition: transform 0.3s ease;
}

.product-card:hover,
.pitch-card:hover {
  transform: translateY(-5px);
}

.img-wrapper {
  height: 220px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.card-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pitch-logo {
  position: absolute;
  bottom: -15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border: 2px solid white;
}
</style>
