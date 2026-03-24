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
                <i class="bi bi-ticket-perforated me-2"></i>
                {{
                  isEditing ? "Cập nhật Mã Khuyến Mãi" : "Tạo Mã Voucher Mới"
                }}
              </h5>
              <div v-if="isEditing" class="badge bg-warning text-dark px-3">
                Đang chỉnh sửa: {{ form.code }}
              </div>
            </div>

            <div class="row">
              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Mã Code</label
                  >
                  <input
                    v-model="form.code"
                    type="text"
                    class="form-control text-uppercase fw-bold"
                    required
                    placeholder="SUMMER2026"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Tên chương trình</label
                  >
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    required
                    placeholder="Giảm giá mùa hè"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Sự kiện</label
                  >
                  <select v-model="form.eventType" class="form-select" required>
                    <option value="NORMAL">Bình thường</option>
                    <option value="WELCOME">Chào mừng (User mới)</option>
                    <option value="REWARD">Thưởng (VIP)</option>
                  </select>
                </div>
              </div>

              <div class="col-md-3 border-start border-end">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Loại giảm giá</label
                  >
                  <select
                    v-model="form.discountType"
                    class="form-select"
                    required
                  >
                    <option value="FIXED_AMOUNT">
                      Giảm tiền trực tiếp (VNĐ)
                    </option>
                    <option value="PERCENTAGE">Giảm theo %</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Mức giảm</label
                  >
                  <div class="input-group">
                    <input
                      v-model="form.discountValue"
                      type="number"
                      class="form-control"
                      required
                    />
                    <span class="input-group-text">{{
                      form.discountType === "FIXED_AMOUNT" ? "₫" : "%"
                    }}</span>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Đơn tối thiểu</label
                  >
                  <div class="input-group">
                    <input
                      v-model="form.minOrderValue"
                      type="number"
                      class="form-control"
                      placeholder="0"
                    />
                    <span class="input-group-text">₫</span>
                  </div>
                </div>
              </div>

              <div class="col-md-3 border-end">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Giới hạn số lượt</label
                  >
                  <input
                    v-model="form.usageLimit"
                    type="number"
                    class="form-control"
                    placeholder="∞"
                  />
                </div>
                <div class="mb-3">
                  <label
                    class="form-label small fw-bold text-uppercase text-danger"
                    >Ngày bắt đầu</label
                  >
                  <input
                    v-model="form.startDate"
                    type="datetime-local"
                    class="form-control form-control-sm"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label
                    class="form-label small fw-bold text-uppercase text-danger"
                    >Ngày kết thúc</label
                  >
                  <input
                    v-model="form.endDate"
                    type="datetime-local"
                    class="form-control form-control-sm"
                    required
                  />
                </div>
              </div>

              <div class="col-md-3">
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Giảm tối đa (Nếu dùng %)</label
                  >
                  <input
                    v-model="form.maxDiscountAmount"
                    type="number"
                    class="form-control"
                    placeholder="Ví dụ: 50.000"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-bold text-uppercase"
                    >Mô tả chi tiết</label
                  >
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                    placeholder="Điều kiện áp dụng..."
                  ></textarea>
                </div>
              </div>
            </div>

            <div
              class="mt-4 border-top pt-4 d-flex justify-content-center gap-3"
            >
              <button
                type="submit"
                class="btn btn-dark btn-lg px-5 shadow-sm fw-bold"
              >
                <i class="bi bi-save me-2"></i>
                {{ isEditing ? "LƯU CẬP NHẬT" : "TẠO VOUCHER" }}
              </button>
              <button
                v-if="isEditing"
                type="button"
                @click="resetForm"
                class="btn btn-outline-secondary btn-lg px-5"
              >
                HỦY
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-12">
        <div class="bg-white p-4 rounded shadow-sm border">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="mb-0 fw-bold">
              <i class="bi bi-list-ul me-2"></i>Danh Sách Mã Khuyến Mãi
            </h5>
            <button
              class="btn btn-sm btn-outline-dark"
              @click="fetchPromotions"
            >
              <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
            </button>
          </div>

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-success" role="status"></div>
          </div>

          <div v-else class="table-responsive">
            <table
              class="table table-hover align-middle text-center border custom-table"
            >
              <thead class="table-secondary text-uppercase small">
                <tr>
                  <th class="text-start">Mã Code / Tên</th>
                  <th>Mức giảm</th>
                  <th>Đơn tối thiểu</th>
                  <th>Hiệu lực</th>
                  <th>Lượt dùng</th>
                  <th>Trạng thái</th>
                  <th width="120">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="promo in promotions" :key="promo.id">
                  <td class="text-start">
                    <div class="fw-bold text-success">{{ promo.code }}</div>
                    <div class="extra-small text-muted">{{ promo.name }}</div>
                  </td>
                  <td class="fw-bold text-danger">
                    {{
                      promo.discountType === "FIXED_AMOUNT"
                        ? formatCurrency(promo.discountValue)
                        : promo.discountValue + "%"
                    }}
                  </td>
                  <td>{{ formatCurrency(promo.minOrderValue) }}</td>
                  <td class="small">
                    <div>S: {{ formatDate(promo.startDate) }}</div>
                    <div>E: {{ formatDate(promo.endDate) }}</div>
                  </td>
                  <td>
                    <span class="badge bg-light text-dark border">
                      {{ promo.usedCount || 0 }} / {{ promo.usageLimit || "∞" }}
                    </span>
                  </td>
                  <td>
                    <div
                      class="form-check form-switch d-flex justify-content-center"
                    >
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="promo.isActive"
                        @change="toggleActive(promo)"
                      />
                    </div>
                  </td>
                  <td>
                    <div class="btn-group shadow-sm">
                      <button
                        @click="editPromotion(promo)"
                        class="btn btn-sm btn-outline-primary px-3"
                        title="Sửa"
                      >
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button
                        @click="removePromotion(promo.id)"
                        class="btn btn-sm btn-outline-danger px-3"
                        title="Xóa"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="promotions.length === 0">
                  <td colspan="7" class="py-5 text-muted">
                    Không tìm thấy mã khuyến mãi nào
                  </td>
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
import { ref, onMounted } from "vue";
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "@/api/promotionApi";

const promotions = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({
  code: "",
  name: "",
  description: "Giảm giá",
  discountType: "FIXED_AMOUNT",
  discountValue: 0,
  maxDiscountAmount: null,
  minOrderValue: 0,
  eventType: "NORMAL",
  startDate: "",
  endDate: "",
  usageLimit: null,
  isActive: true,
});

const fetchPromotions = async () => {
  loading.value = true;
  try {
    const res = await getAllPromotions();
    promotions.value = res.data.result || res.data;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await updatePromotion(editingId.value, form.value);
      alert("Cập nhật voucher thành công!");
    } else {
      await createPromotion(form.value);
      alert("Tạo voucher mới thành công!");
    }
    await fetchPromotions();
    resetForm();
  } catch (err) {
    alert("Có lỗi xảy ra (Vui lòng kiểm tra mã Code bị trùng hoặc thời gian)!");
  }
};

const editPromotion = (promo) => {
  isEditing.value = true;
  editingId.value = promo.id;
  form.value = {
    ...promo,
    startDate: promo.startDate ? promo.startDate.substring(0, 16) : "",
    endDate: promo.endDate ? promo.endDate.substring(0, 16) : "",
  };
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const removePromotion = async (id) => {
  if (!confirm("Xóa mã này?")) return;
  try {
    await deletePromotion(id);
    await fetchPromotions();
  } catch (err) {
    console.error(err);
  }
};

const toggleActive = async (promo) => {
  try {
    await updatePromotion(promo.id, promo);
  } catch (err) {
    promo.isActive = !promo.isActive;
    alert("Lỗi cập nhật trạng thái");
  }
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    code: "",
    name: "",
    description: "Giảm giá",
    discountType: "FIXED_AMOUNT",
    discountValue: 0,
    maxDiscountAmount: null,
    minOrderValue: 0,
    eventType: "NORMAL",
    startDate: "",
    endDate: "",
    usageLimit: null,
    isActive: true,
  };
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    val || 0
  );
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString("vi-VN", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "N/A";

onMounted(() => fetchPromotions());
</script>

<style scoped>
.bg-form-green {
  background: #f0fdf4;
  border: 1px solid #dcfce7;
}

.custom-table thead th {
  background-color: #f8f9fa;
  color: #4b5563;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  padding: 15px 10px;
}

.extra-small {
  font-size: 0.75rem;
}

.form-switch .form-check-input {
  cursor: pointer;
  width: 2.5em;
  height: 1.25em;
}
</style>