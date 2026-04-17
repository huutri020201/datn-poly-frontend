<template>
  <div v-if="!product" class="text-center mt-5">
    <div class="spinner-border text-secondary" role="status"></div>
    <p class="mt-2 text-muted">Loading...</p>
  </div>

  <div class="container-fluid mt-4 px-4" v-else>
    <div class="row">
      <div class="col-lg-4 col-md-4 mb-4">
        <img  
          :src="selectedImage"
          class="img-fluid product-image shadow-sm w-100"
          style="object-fit: cover; border-radius: 8px"
        />
      </div>

      <div class="col-lg-6 col-md-6 px-lg-6 mb-4">
        <h3 class="fw-bold">{{ product.name }}</h3>
        <h4 class="text-danger mt-3 mb-4">{{ formatPrice(selectedPrice) }}</h4>
        <p class="text-muted">{{ product.description }}</p>

        <div class="mt-4">
          <h6 class="fw-bold">Color</h6>
          <button
            v-for="c in colors"
            :key="c"
            class="btn btn-outline-dark btn-sm me-2 mb-2"
            :class="{ active: selectedColor === c }"
            @click="selectColor(c)"
          >
            {{ c }}
          </button>
        </div>

        <div class="mt-3">
          <h6 class="fw-bold">Size</h6>
          <button
            v-for="s in sizes"
            :key="s"
            class="btn btn-outline-secondary btn-sm me-2 mb-2"
            :class="{ active: selectedSize === s }"
            @click="selectSize(s)"
          >
            {{ s }}
          </button>
        </div>

        <div class="mt-3">
          <small class="text-muted"
            >Stock: {{ selectedVariant?.stockQty || 0 }}</small
          >
        </div>

        <button
          class="btn btn-dark mt-4 px-4 py-2"
          :disabled="!selectedVariant"
          @click="addToCart"
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      <div class="col-lg-2 col-md-2 border-start">
        <h5 class="fw-bold border-bottom pb-2 mb-3">
          Đánh giá sản phẩm ({{ feedbacks.length }})
        </h5>
        <div class="feedback-scrollable pe-2">
          <div
            v-if="feedbacks.length === 0"
            class="text-center text-muted mt-5 fst-italic"
          >
            Chưa có đánh giá nào.
          </div>
          <div v-else class="feedback-list">
            <div
              v-for="fb in feedbacks"
              :key="fb.id"
              class="feedback-item mb-3 pb-3 border-bottom"
            >
              <div class="d-flex align-items-center mb-2">
                <div
                  class="avatar-circle bg-dark text-white me-2 d-flex justify-content-center align-items-center shadow-sm"
                >
                  {{ fb.userName ? fb.userName.charAt(0).toUpperCase() : "K" }}
                </div>
                <div>
                  <div class="fw-bold" style="font-size: 0.95rem">
                    {{ maskName(fb.userName || fb.userId) }}
                    <span
                      v-if="fb.phoneNumber"
                      class="text-muted fw-normal small ms-1"
                      >{{ maskPhone(fb.phoneNumber) }}</span
                    >
                  </div>
                  <div class="text-warning" style="font-size: 0.8rem">
                    <i
                      v-for="s in 5"
                      :key="s"
                      class="bi"
                      :class="s <= fb.rating ? 'bi-star-fill' : 'bi-star'"
                    ></i>
                    <span class="text-muted ms-2">{{
                      formatDate(fb.createdAt)
                    }}</span>
                  </div>
                </div>
              </div>
              <p class="mb-2 text-dark" style="font-size: 0.95rem">
                {{ fb.comment }}
              </p>
              <div v-if="fb.imageUrls" class="d-flex gap-2 flex-wrap mb-2">
                <img
                  v-for="(img, idx) in fb.imageUrls.split(',')"
                  :key="idx"
                  :src="img.trim()"
                  class="feedback-img rounded border"
                  @click="openLightbox(img.trim())"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="related-products mt-5 pt-5 border-top">
      <h4 class="fw-bold mb-4">Sản phẩm cùng {{ product.brandName }}</h4>
      <div class="row">
        <div
          v-for="rp in relatedProducts"
          :key="rp.id"
          class="col-lg-3 col-md-6 mb-4"
        >
          <div
            class="card h-100 border-0 shadow-sm related-card"
            @click="goToProduct(rp.id)"
            style="cursor: pointer"
          >
            <div class="img-container" style="height: 250px; overflow: hidden">
              <img
                :src="getRPImage(rp)"
                class="card-img-top h-100 w-100"
                style="object-fit: cover"
              />
            </div>
            <div class="card-body text-center">
              <h6 class="card-title text-truncate fw-bold">{{ rp.name }}</h6>
              <p class="text-danger fw-bold mb-0">
                {{ formatPrice(rp.basePrice) }}
              </p>
            </div>
          </div>
        </div>
        <div
          v-if="relatedProducts.length === 0"
          class="col-12 text-center text-muted py-4"
        >
          Không tìm thấy sản phẩm cùng bộ sưu tập.
        </div>
      </div>
    </div>

    <div
      v-if="showLightbox"
      class="lightbox-overlay"
      @click.self="closeLightbox"
    >
      <div class="lightbox-content">
        <button class="btn-close-lightbox" @click="closeLightbox">
          &times;
        </button>
        <img :src="selectedFullImage" class="img-fluid rounded shadow-lg" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { cartCount } from "@/cartState";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const product = ref(null);
const feedbacks = ref([]);
const relatedProducts = ref([]);

const selectedColor = ref(null);
const selectedSize = ref(null);
const selectedVariant = ref(null);
const showLightbox = ref(false);
const selectedFullImage = ref("");

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      fetchProduct();
      fetchFeedbacks();
    }
  }
);

const fetchProduct = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/products/${route.params.id}`
    );
    const data = res.data.result || res.data;
    product.value = data;

    if (data?.variants?.length) {
      const defaultVariant =
        data.variants.find((v) => v.active) || data.variants[0];
      selectedVariant.value = defaultVariant;
      selectedColor.value = defaultVariant.attributes?.color;
      selectedSize.value = defaultVariant.attributes?.size;
    }

    // QUAN TRỌNG: Gọi hàm lấy sản phẩm tương tự bằng Tên thay vì ID
    fetchRelatedProducts(data.categoryName, data.brandName);
  } catch (err) {
    console.error("Load product error:", err);
  }
};

const fetchRelatedProducts = async (categoryName, brandName) => {
  try {
    // Gọi lấy tất cả sản phẩm
    const res = await axios.get(`http://localhost:8080/products`);
    const all = res.data.result || [];

    // Tự lọc tại Frontend dựa trên thông tin String mà BE trả về
    relatedProducts.value = all
      .filter(
        (p) =>
          p.categoryName === categoryName && // Cùng tên danh mục
          p.brandName === brandName && // Cùng tên hãng
          p.id !== route.params.id // Loại bỏ sản phẩm đang xem
      )
      .slice(0, 4); // Chỉ lấy 4 cái
  } catch (err) {
    console.error("Load related products error:", err);
  }
};

const goToProduct = (id) => {
  router.push(`/product/${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const getRPImage = (rp) => {
  return rp.variants?.[0]?.imageUrl || "https://via.placeholder.com/300";
};

const fetchFeedbacks = async () => {
  try {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

    const res = await axios.get(`http://localhost:8080/feedbacks/product/${route.params.id}`, {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });

    console.log("Dữ liệu feedback:", res.data);
    const data = res.data.result !== undefined ? res.data.result : res.data;   
    feedbacks.value = Array.isArray(data) ? data.filter(f => f.status !== 'HIDDEN') : [];
  } catch (err) {
    console.error("Lỗi tải feedback:", err);
    if (err.response && err.response.status === 401) {
       console.warn("Bạn cần đăng nhập để xem đánh giá hoặc Token hết hạn.");
    }
  }
};

const openLightbox = (url) => {
  selectedFullImage.value = url;
  showLightbox.value = true;
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  showLightbox.value = false;
  document.body.style.overflow = "auto";
};

const maskName = (n) =>
  n ? n.charAt(0) + "***" + n.charAt(n.length - 1) : "Khách hàng";
const maskPhone = (p) => (p ? "*******" + p.slice(-3) : "");
const formatPrice = (p) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    p
  );
const formatDate = (ds) => (ds ? new Date(ds).toLocaleDateString("vi-VN") : "");

const selectColor = (c) => {
  selectedColor.value = c;
  findVariant();
};
const selectSize = (s) => {
  selectedSize.value = s;
  findVariant();
};

const findVariant = () => {
  if (!product.value) return;
  selectedVariant.value = product.value.variants.find(
    (v) =>
      v.active &&
      v.attributes?.color === selectedColor.value &&
      v.attributes?.size === selectedSize.value
  );
};

const colors = computed(() => {
  if (!product.value) return [];
  return [
    ...new Set(
      product.value.variants
        .filter((v) => v.active)
        .map((v) => v.attributes?.color)
        .filter((c) => c)
    ),
  ];
});

const sizes = computed(() => {
  if (!product.value) return [];
  return [
    ...new Set(
      product.value.variants
        .filter((v) => v.active)
        .map((v) => v.attributes?.size)
        .filter((s) => s)
    ),
  ];
});

const selectedImage = computed(
  () =>
    selectedVariant.value?.imageUrl ||
    product.value?.variants?.[0]?.imageUrl ||
    "https://via.placeholder.com/500"
);
const selectedPrice = computed(
  () => selectedVariant.value?.priceOverride || product.value?.basePrice || 0
);

const addToCart = async () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");
  if (!token) {
    alert("Bạn cần đăng nhập!");
    return;
  }
  try {
    await axios.post(
      "http://localhost:8080/cart/add",
      {
        productId: product.value.id,
        variantId: selectedVariant.value.id,
        quantity: 1,
        unitPrice: selectedPrice.value,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    cartCount.value += 1;
    alert("Đã thêm vào giỏ hàng!");
  } catch (e) {
    alert("Lỗi khi thêm!");
  }
};

onMounted(() => {
  fetchProduct();
  fetchFeedbacks();
});
</script>

<style scoped>
.related-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}
.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}
.product-image {
  border-radius: 8px;
  border: 1px solid #eee;
}
button.active {
  background: black;
  color: white;
}
.feedback-scrollable {
  max-height: 550px;
  overflow-y: auto;
}
.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-weight: bold;
}
.feedback-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  cursor: zoom-in;
}
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.btn-close-lightbox {
  position: absolute;
  top: -40px;
  right: -10px;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
}
</style>