<template>
  <div class="container-fluid">
    <div class="row g-4">
      <div class="col-12">
        <div class="p-4 rounded shadow-sm bg-form-green border">
          <form @submit.prevent="submitForm">
            <div
              class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2"
            >
              <h5 class="mb-0 fw-bold text-success">
                <i class="bi bi-plus-circle me-2"></i>
                {{
                  isEditing
                    ? "Cập nhật thông tin sản phẩm"
                    : "Thêm sản phẩm mới vào hệ thống"
                }}
              </h5>
              <div v-if="isEditing" class="badge bg-warning text-dark px-3">
                Đang chỉnh sửa ID: {{ editingId }}
              </div>
            </div>

            <div class="row">
              <div class="col-md-4">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Tên sản phẩm</label
                  >
                  <input
                    v-model="form.name"
                    class="form-control"
                    required
                    placeholder="VD: Giày Thể Thao Nike"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Thương hiệu (Brand)</label
                  >
                  <select
                    v-model="form.brandId"
                    class="form-select"
                    @change="handleBrandChange"
                    required
                  >
                    <option value="">-- Chọn Brand --</option>
                    <option v-for="b in brands" :key="b.id" :value="b.id">
                      {{ b.name }}
                    </option>
                    <option
                      value="MANAGE_BRAND"
                      class="fw-bold text-primary bg-light"
                    >
                      + Thêm Brand...
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Danh mục (Category)</label
                  >
                  <select
                    v-model="form.categoryId"
                    class="form-select"
                    @change="handleCategoryChange"
                    required
                  >
                    <option value="">-- Chọn Category --</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">
                      {{ c.name }}
                    </option>
                    <option
                      value="MANAGE_CATEGORY"
                      class="fw-bold text-primary bg-light"
                    >
                      + Thêm Category...
                    </option>
                  </select>
                </div>
              </div>

              <div class="col-md-8">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Giá bán gốc (Base Price)</label
                  >
                  <div class="input-group w-50">
                    <input
                      v-model="form.basePrice"
                      type="number"
                      class="form-control"
                      required
                    />
                    <span class="input-group-text">₫</span>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Mô tả sản phẩm</label
                  >
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="5"
                    placeholder="Nhập thông tin mô tả chi tiết..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="mt-4 border-top pt-4">
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h6 class="fw-bold mb-0 text-uppercase small text-muted">
                  Các phiên bản sản phẩm (Variants)
                </h6>
                <button
                  type="button"
                  class="btn btn-success btn-sm"
                  @click="addVariantRow"
                >
                  <i class="bi bi-plus-lg me-1"></i> Thêm mẫu/size mới
                </button>
              </div>

              <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 mb-4">
                <div
                  v-for="(v, index) in form.variants"
                  :key="index"
                  class="col"
                >
                  <div
                    class="variant-box p-3 border rounded shadow-sm position-relative"
                  >
                    <button
                      type="button"
                      class="btn-close position-absolute top-0 end-0 m-2"
                      style="font-size: 0.7rem"
                      @click="removeVariant(index)"
                    ></button>
                    <div class="row g-2">
                      <div class="col-6">
                        <label class="extra-small fw-bold">SKU</label>
                        <input
                          v-model="v.sku"
                          class="form-control form-control-sm"
                          placeholder="Mã định danh"
                        />
                      </div>
                      <div class="col-6">
                        <label class="extra-small fw-bold">Kho</label>
                        <input
                          v-model="v.stockQty"
                          type="number"
                          class="form-control form-control-sm"
                        />
                      </div>
                      <div class="col-6">
                        <label class="extra-small fw-bold">Giá riêng</label>
                        <input
                          v-model="v.priceOverride"
                          type="number"
                          class="form-control form-control-sm"
                        />
                      </div>
                      <div class="col-6">
                        <label class="extra-small fw-bold">Màu sắc</label>
                        <input
                          v-model="v.attributes.color"
                          class="form-control form-control-sm"
                        />
                      </div>
                      <div class="col-6">
                        <label class="extra-small fw-bold">Size</label>
                        <input
                          v-model="v.attributes.size"
                          class="form-control form-control-sm"
                        />
                      </div>
                      <div class="col-6">
                        <label class="extra-small fw-bold">URL Ảnh</label>
                        <input
                          v-model="v.imageUrl"
                          class="form-control form-control-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="mt-4 border-top pt-4 d-flex justify-content-center gap-3"
            >
              <button type="submit" class="btn btn-dark btn-lg px-5 shadow-sm">
                <i class="bi bi-save me-2"></i>
                {{ isEditing ? "CẬP NHẬT THAY ĐỔI" : "LƯU SẢN PHẨM" }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                @click="resetForm"
                class="btn btn-outline-secondary btn-lg px-5"
              >
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-12">
        <div class="bg-white p-4 rounded shadow-sm border">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-list-stars me-2"></i>Danh sách sản phẩm hệ thống
            </h5>
            <div class="badge bg-dark px-3 py-2">
              Tổng: {{ products.length }} sản phẩm
            </div>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle border">
              <thead class="table-light text-center">
                <tr>
                  <th width="70">STT</th>
                  <th class="text-start">Tên sản phẩm</th>
                  <th>Mô tả</th>
                  <th>Giá gốc</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Kho hàng</th>
                  <th width="150">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(p, index) in products" :key="p.id">
                  <td class="text-center text-muted fw-bold">
                    {{ index + 1 }}
                  </td>
                  <td class="text-start">
                    <div class="fw-bold">{{ p.name }}</div>
                  </td>
                  <td class="text-center text-danger fw-bold">
                    {{ formatCurrency(p.basePrice) }}
                  </td>
                  <td>
                    <div class="extra-small text-muted">
                      {{ p.description?.substring(0, 50) }}...
                    </div>
                  </td>
                  <td class="text-center">
                    <span class="badge bg-info text-dark">{{
                      p.brandName
                    }}</span>
                  </td>
                  <td class="text-center">
                    <span class="badge bg-warning text-dark">{{
                      p.categoryName
                    }}</span>
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-outline-secondary"
                      @click="showVariants(p)"
                    >
                      Chi tiết
                    </button>
                  </td>
                  <td class="text-center">
                    <div class="btn-group">
                      <button
                        @click="editProduct(p)"
                        class="btn btn-primary btn-sm px-3"
                      >
                        ✏️
                      </button>
                      <button
                        @click="removeProduct(p.id)"
                        class="btn btn-danger btn-sm px-3"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="variantModal" class="custom-modal-backdrop">
    <div class="modal-box-large bg-white rounded shadow p-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="m-0 fw-bold">Chi tiết các phiên bản</h5>
        <button class="btn-close" @click="variantModal = false"></button>
      </div>
      <table class="table table-bordered text-center small">
        <thead class="table-light">
          <tr>
            <th>Hình ảnh</th>
            <th>SKU</th>
            <th>Kho</th>
            <th>Giá bán</th>
            <th>Thuộc tính</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="v in selectedVariants" :key="v.sku">
            <td>
              <img
                :src="v.imageUrl || 'https://via.placeholder.com/40'"
                class="rounded"
                width="40"
                height="40"
                style="object-fit: cover"
              />
            </td>
            <td class="fw-bold">{{ v.sku }}</td>
            <td>{{ v.stockQty }}</td>
            <td class="text-danger fw-bold">
              {{ formatCurrency(v.priceOverride || 0) }}
            </td>
            <td>
              <span class="badge bg-light text-dark border me-1"
                >Màu: {{ v.attributes?.color }}</span
              >
              <span class="badge bg-light text-dark border"
                >Size: {{ v.attributes?.size }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div v-if="brandModal" class="custom-modal-backdrop">
    <div class="modal-box-small bg-white rounded shadow p-3">
      <h6 class="fw-bold mb-3 border-bottom pb-2">Quản lý Thương hiệu</h6>
      <div class="input-group input-group-sm mb-3">
        <input
          v-model="brandForm.name"
          class="form-control"
          placeholder="Tên thương hiệu..."
        />
        <button class="btn btn-primary" @click="submitBrand">
          {{ brandForm.id ? "Sửa" : "Thêm" }}
        </button>
      </div>
      <div class="list-wrapper border rounded mb-3">
        <table class="table table-sm table-hover m-0 small text-center">
          <tbody>
            <tr v-for="b in brands" :key="b.id">
              <td>{{ b.name }}</td>
              <td class="text-end pe-2">
                <span
                  class="me-2 cursor-pointer text-primary"
                  @click="editBrand(b)"
                  >✏️</span
                >
                <span
                  class="cursor-pointer text-danger"
                  @click="deleteBrandAction(b.id)"
                  >🗑️</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        class="btn btn-secondary btn-sm w-100"
        @click="brandModal = false"
      >
        Đóng
      </button>
    </div>
  </div>

  <div v-if="categoryModal" class="custom-modal-backdrop">
    <div class="modal-box-small bg-white rounded shadow p-3">
      <h6 class="fw-bold mb-3 border-bottom pb-2">Quản lý Danh mục</h6>
      <div class="input-group input-group-sm mb-3">
        <input
          v-model="categoryForm.name"
          class="form-control"
          placeholder="Tên danh mục..."
        />
        <button class="btn btn-success" @click="submitCategory">
          {{ categoryForm.id ? "Sửa" : "Thêm" }}
        </button>
      </div>
      <div class="list-wrapper border rounded mb-3">
        <table class="table table-sm table-hover m-0 small text-center">
          <tbody>
            <tr v-for="c in categories" :key="c.id">
              <td>{{ c.name }}</td>
              <td class="text-end pe-2">
                <span
                  class="me-2 cursor-pointer text-primary"
                  @click="editCategory(c)"
                  >✏️</span
                >
                <span
                  class="cursor-pointer text-danger"
                  @click="deleteCategoryAction(c.id)"
                  >🗑️</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
        class="btn btn-secondary btn-sm w-100"
        @click="categoryModal = false"
      >
        Đóng
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/admin/productApi";

const products = ref([]);
const brands = ref([]);
const categories = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const variantModal = ref(false);
const brandModal = ref(false);
const categoryModal = ref(false);
const selectedVariants = ref([]);

const form = ref({
  name: "",
  brandId: "",
  categoryId: "",
  basePrice: 0,
  description: "",
  variants: [],
});

const brandForm = ref({ id: null, name: "" });
const categoryForm = ref({ id: null, name: "" });

const handleBrandChange = (e) => {
  if (e.target.value === "MANAGE_BRAND") {
    form.value.brandId = "";
    openBrandModal();
  }
};
const handleCategoryChange = (e) => {
  if (e.target.value === "MANAGE_CATEGORY") {
    form.value.categoryId = "";
    openCategoryModal();
  }
};

const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await getAllProducts();
    products.value = res.data.result;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  if (form.value.variants.length === 0)
    return alert("Vui lòng thêm ít nhất 1 variant");
  try {
    if (isEditing.value) {
      await updateProduct(editingId.value, form.value);
      alert("Cập nhật thành công");
    } else {
      await createProduct(form.value);
      alert("Thêm sản phẩm thành công");
    }
    fetchProducts();
    resetForm();
  } catch (err) {
    alert("Lỗi khi lưu sản phẩm");
  }
};

const removeProduct = async (id) => {
  if (!confirm("Xóa sản phẩm này sẽ xóa tất cả variant liên quan?")) return;
  await deleteProduct(id);
  fetchProducts();
};

const editProduct = (p) => {
  isEditing.value = true;
  editingId.value = p.id;
  form.value = JSON.parse(JSON.stringify(p));
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    name: "",
    brandId: "",
    categoryId: "",
    basePrice: 0,
    description: "",
    variants: [],
  };
};

const addVariantRow = () => {
  form.value.variants.push({
    sku: "",
    stockQty: 0,
    priceOverride: 0,
    imageUrl: "",
    attributes: { color: "", size: "" },
    isActive: true,
  });
};
const removeVariant = (index) => form.value.variants.splice(index, 1);
const showVariants = (p) => {
  selectedVariants.value = p.variants || [];
  variantModal.value = true;
};

const fetchBrands = async () => {
  const res = await getAllBrands();
  brands.value = res.data.result;
};
const openBrandModal = () => {
  brandForm.value = { id: null, name: "" };
  brandModal.value = true;
};
const editBrand = (b) => (brandForm.value = { ...b });
const submitBrand = async () => {
  if (!brandForm.value.name) return;
  brandForm.value.id
    ? await updateBrand(brandForm.value.id, brandForm.value)
    : await createBrand(brandForm.value);
  fetchBrands();
  brandForm.value = { id: null, name: "" };
};
const deleteBrandAction = async (id) => {
  if (confirm("Xóa brand này?")) {
    await deleteBrand(id).catch(() => alert("Brand này đang được sử dụng!"));
    fetchBrands();
  }
};

const fetchCategories = async () => {
  const res = await getAllCategories();
  categories.value = res.data.result;
};
const openCategoryModal = () => {
  categoryForm.value = { id: null, name: "" };
  categoryModal.value = true;
};
const editCategory = (c) => (categoryForm.value = { ...c });
const submitCategory = async () => {
  if (!categoryForm.value.name) return;
  categoryForm.value.id
    ? await updateCategory(categoryForm.value.id, categoryForm.value)
    : await createCategory(categoryForm.value);
  fetchCategories();
  categoryForm.value = { id: null, name: "" };
};
const deleteCategoryAction = async (id) => {
  if (confirm("Xóa category này?")) {
    await deleteCategory(id).catch(() =>
      alert("Category này đang được sử dụng!")
    );
    fetchCategories();
  }
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val
  );

onMounted(() => {
  fetchProducts();
  fetchBrands();
  fetchCategories();
});
</script>

<style scoped>
.bg-form-green {
  background: #f0fdf4;
  border: 1px solid #dcfce7;
}
.variant-box {
  background: #ffffff;
  transition: 0.3s;
}
.variant-box:hover {
  border-color: #198754;
}
.extra-small {
  font-size: 0.7rem;
  color: #666;
}
.cursor-pointer {
  cursor: pointer;
}
.list-wrapper {
  max-height: 200px;
  overflow-y: auto;
  background: #fafafa;
}
.custom-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-box-large {
  width: 90%;
  max-width: 800px;
}
.modal-box-small {
  width: 400px;
}
</style>