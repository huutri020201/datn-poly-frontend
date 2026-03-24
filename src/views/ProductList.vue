<template>
  <div class="container mt-4">
    <div class="row">
      <h2 class="fw-bold text-dark mb-5 text-center">Phụ Kiện Thể Thao</h2>
      <div class="col-md-3 mb-4">
        <div class="filter-sidebar p-3 rounded shadow-sm bg-white border">
          <h6 class="fw-bold mb-3 border-bottom pb-2">Bộ lọc sản phẩm</h6>

          <div class="mb-4">
            <label class="form-label small fw-bold">Tìm kiếm</label>
            <div class="input-group input-group-sm">
              <input
                v-model="filters.keyword"
                type="text"
                class="form-control"
                placeholder="Nhập tên..."
                @keyup.enter="handleFilter"
              />
              <button class="btn btn-dark" @click="handleFilter">
                <i class="bi bi-search"></i>
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold">Danh mục</label>
            <select
              v-model="filters.categoryId"
              class="form-select form-select-sm"
              @change="handleFilter"
            >
              <option value="">Tất cả danh mục</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold">Thương hiệu</label>
            <select
              v-model="filters.brandId"
              class="form-select form-select-sm"
              @change="handleFilter"
            >
              <option value="">Tất cả thương hiệu</option>
              <option v-for="b in brands" :key="b.id" :value="b.id">
                {{ b.name }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold">Khoảng giá (VNĐ)</label>
            <div class="d-flex align-items-center gap-2 mb-2">
              <input
                v-model.number="filters.minPrice"
                type="number"
                class="form-control form-control-sm"
                placeholder="Từ"
              />
              <span>-</span>
              <input
                v-model.number="filters.maxPrice"
                type="number"
                class="form-control form-control-sm"
                placeholder="Đến"
              />
            </div>
            <button
              class="btn btn-outline-dark btn-sm w-100"
              @click="handleFilter"
            >
              Áp dụng giá
            </button>
          </div>

          <button
            class="btn btn-link btn-sm w-100 text-decoration-none text-muted"
            @click="resetFilters"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      </div>

      <div class="col-md-9">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-dark" role="status"></div>
        </div>

        <div v-else class="row">
          <div class="col-lg-4 col-md-6 mb-4" v-for="p in products" :key="p.id">
            <div class="card product-card h-100 border-0 shadow-sm">
              <div class="position-relative overflow-hidden">
                <img :src="getImage(p)" class="card-img-top" :alt="p.name" />
                <div
                  class="overlay d-flex align-items-center justify-content-center"
                >
                  <!-- <button
                    class="btn btn-light btn-sm fw-bold"
                    @click="viewProduct(p.id)"
                  >
                    CHI TIẾT
                  </button> -->
                </div>
              </div>

              <div class="card-body text-center">
                <p class="text-uppercase text-muted extra-small mb-1">
                  {{ p.brandName }}
                </p>
                <h6 class="card-title fw-bold text-truncate">{{ p.name }}</h6>
                <p class="text-danger fw-bold mb-3">
                  {{ formatPrice(p.basePrice) }}
                </p>
                <button
                  class="btn btn-dark btn-sm w-100 rounded-pill"
                  @click="viewProduct(p.id)"
                >
                  Xem sản phẩm
                </button>
              </div>
            </div>
          </div>

          <div v-if="products.length === 0" class="col-12 text-center py-5">
            <i class="bi bi-box-seam fs-1 text-muted"></i>
            <p class="mt-3 text-muted">
              Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAllProducts,
  getAllBrands,
  getAllCategories,
} from "@/api/admin/productApi";

const router = useRouter();
const products = ref([]);
const brands = ref([]);
const categories = ref([]);
const loading = ref(false);

// State cho bộ lọc
const filters = reactive({
  keyword: "",
  categoryId: "",
  brandId: "",
  minPrice: null,
  maxPrice: null,
});

// FETCH DATA
const fetchProducts = async () => {
  loading.value = true;
  try {
    // Loại bỏ các field rỗng trước khi gửi lên BE
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "" && v !== null)
    );
    const res = await getAllProducts(params);
    products.value = res.data.result;
  } catch (err) {
    console.error("Lỗi lấy sản phẩm:", err);
  } finally {
    loading.value = false;
  }
};

const fetchFilterOptions = async () => {
  try {
    const [brandRes, catRes] = await Promise.all([
      getAllBrands(),
      getAllCategories(),
    ]);
    brands.value = brandRes.data.result;
    categories.value = catRes.data.result;
  } catch (err) {
    console.error("Lỗi lấy danh mục/thương hiệu:", err);
  }
};

// HANDLERS
const handleFilter = () => {
  fetchProducts();
};

const resetFilters = () => {
  Object.assign(filters, {
    keyword: "",
    categoryId: "",
    brandId: "",
    minPrice: null,
    maxPrice: null,
  });
  fetchProducts();
};

const viewProduct = (id) => {
  router.push(`/product/${id}`);
};

const getImage = (p) => {
  if (p.variants && p.variants.length > 0 && p.variants[0].imageUrl) {
    return p.variants[0].imageUrl;
  }
  return "https://via.placeholder.com/300?text=No+Image";
};

const formatPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

onMounted(() => {
  fetchProducts();
  fetchFilterOptions();
});
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12) !important;
}

.card-img-top {
  height: 250px;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .card-img-top {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .overlay {
  opacity: 1;
}

.extra-small {
  font-size: 0.7rem;
  letter-spacing: 1px;
}

.filter-sidebar {
  position: sticky;
  top: 100px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>