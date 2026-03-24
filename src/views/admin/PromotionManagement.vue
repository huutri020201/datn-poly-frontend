<template>
  <div class="row py-3">

    <div class="col-md-4 mb-4">
      <div class="p-4 rounded shadow-sm bg-form-green h-100">
        <form @submit.prevent="submitForm">
          <h5 class="mb-4 fw-bold text-success">
            {{ isEditing ? "Cập nhật Mã Khuyến Mãi" : "Tạo Mã Mới" }}
          </h5>

          <div class="row">
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Mã Code</label>
              <input v-model="form.code" type="text" class="form-control form-control-sm text-uppercase" required placeholder="VD: SUMMER2026">
            </div>
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Tên CTKM</label>
              <input v-model="form.name" type="text" class="form-control form-control-sm" required placeholder="VD: Giảm giá mùa hè">
            </div>
          </div>

          <div class="row">
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Loại giảm giá</label>
              <select v-model="form.discountType" class="form-select form-select-sm" required>
                <option value="FIXED_AMOUNT">Giảm tiền trực tiếp</option>
                <option value="PERCENTAGE">Giảm theo %</option>
              </select>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Mức giảm</label>
              <input v-model="form.discountValue" type="number" class="form-control form-control-sm" required placeholder="VD: 50000 hoặc 20">
            </div>
          </div>

          <div class="row">
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Đơn tối thiểu</label>
              <input v-model="form.minOrderValue" type="number" class="form-control form-control-sm" placeholder="VD: 100000">
            </div>
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Giảm tối đa (nếu %)</label>
              <input v-model="form.maxDiscountAmount" type="number" class="form-control form-control-sm" placeholder="VD: 50000">
            </div>
          </div>

          <div class="row">
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Ngày bắt đầu</label>
              <input v-model="form.startDate" type="datetime-local" class="form-control form-control-sm" required>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Ngày kết thúc</label>
              <input v-model="form.endDate" type="datetime-local" class="form-control form-control-sm" required>
            </div>
          </div>

          <div class="row">
            <div class="col-6 mb-3">
              <label class="form-label small fw-bold">Sự kiện</label>
              <select v-model="form.eventType" class="form-select form-select-sm" required>
                <option value="NORMAL">Bình thường</option>
                <option value="WELCOME">Chào mừng (User mới)</option>
                <option value="REWARD">Thưởng (VIP)</option>
              </select>
            </div>
            <div class="col-6 mb-4">
              <label class="form-label small fw-bold">Giới hạn số lượt</label>
              <input v-model="form.usageLimit" type="number" class="form-control form-control-sm" placeholder="Để trống = Không giới hạn">
            </div>
          </div>

          <button type="submit" class="btn w-100 fw-bold shadow-sm" :class="isEditing ? 'btn-warning' : 'btn-success'">
            {{ isEditing ? "LƯU CẬP NHẬT" : "TẠO VOUCHER" }}
          </button>
          <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-outline-secondary w-100 mt-2 fw-bold">HỦY</button>
        </form>
      </div>
    </div>

    <div class="col-md-8">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">Danh Sách Mã Khuyến Mãi</h5>
        <button class="btn btn-sm btn-dark" @click="fetchPromotions">↻ Làm mới</button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
      </div>

      <div v-else class="table-responsive bg-white rounded shadow-sm">
        <table class="table table-bordered align-middle text-center border-dark custom-table mb-0">
          <thead class="table-secondary">
            <tr>
              <th>Mã Code</th>
              <th>Mức giảm</th>
              <th>Đơn tối thiểu</th>
              <th>Đã dùng</th>
              <th>Trạng thái</th>
              <th width="100">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="promo in promotions" :key="promo.id">
              <td class="text-start fw-bold text-success">{{ promo.code }}</td>
              
              <td class="text-danger fw-bold">
                {{ promo.discountType === 'FIXED_AMOUNT' ? formatCurrency(promo.discountValue) : promo.discountValue + '%' }}
              </td>
              
              <td>{{ formatCurrency(promo.minOrderValue) }}</td>
              
              <td>
                <span class="badge bg-secondary">{{ promo.usedCount || 0 }} / {{ promo.usageLimit || '∞' }}</span>
              </td>
              
              <td>
                <div class="form-check form-switch d-flex justify-content-center">
                  <input class="form-check-input" type="checkbox" v-model="promo.isActive" @change="toggleActive(promo)">
                </div>
              </td>
              
              <td>
                <button @click="editPromotion(promo)" class="btn btn-sm btn-outline-primary me-1" title="Sửa">✏</button>
                <button @click="removePromotion(promo.id)" class="btn btn-sm btn-outline-danger" title="Xóa">🗑</button>
              </td>
            </tr>
            <tr v-if="promotions.length === 0">
              <td colspan="6" class="py-4 text-muted">Chưa có mã khuyến mãi nào</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllPromotions, createPromotion, updatePromotion, deletePromotion } from '@/api/promotionApi';

const promotions = ref([]);
const loading = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = ref({
  code: "", name: "", description: "Giảm giá",
  discountType: "FIXED_AMOUNT", discountValue: 0, maxDiscountAmount: null, minOrderValue: 0,
  eventType: "NORMAL", startDate: "", endDate: "", usageLimit: null, isActive: true
});

const fetchPromotions = async () => {
  loading.value = true;
  try {
    const res = await getAllPromotions();
    promotions.value = res.data.result || res.data;
  } catch (err) { console.error(err); } 
  finally { loading.value = false; }
};

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await updatePromotion(editingId.value, form.value);
    } else {
      await createPromotion(form.value);
    }
    await fetchPromotions();
    resetForm();
  } catch (err) {
    alert("Có lỗi xảy ra (Có thể trùng mã Code)!");
  }
};

const editPromotion = (promo) => {
  isEditing.value = true;
  editingId.value = promo.id;
  // Format datetime-local requires YYYY-MM-DDThh:mm format
  form.value = { ...promo, 
    startDate: promo.startDate ? promo.startDate.substring(0, 16) : "",
    endDate: promo.endDate ? promo.endDate.substring(0, 16) : "" 
  };
};

const removePromotion = async (id) => {
  if (!confirm("Xóa mã này?")) return;
  try {
    await deletePromotion(id);
    await fetchPromotions();
  } catch (err) { console.error(err); }
};

const toggleActive = async (promo) => {
  try {
    await updatePromotion(promo.id, promo);
  } catch (err) {
    promo.isActive = !promo.isActive; // Hoàn tác nếu lỗi
    alert("Lỗi cập nhật trạng thái");
  }
};

const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    code: "", name: "", description: "Giảm giá",
    discountType: "FIXED_AMOUNT", discountValue: 0, maxDiscountAmount: null, minOrderValue: 0,
    eventType: "NORMAL", startDate: "", endDate: "", usageLimit: null, isActive: true
  };
};

const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

onMounted(() => fetchPromotions());
</script>

<style scoped>
.bg-form-green { background: #dcfce7; }
.custom-table thead th { background: #d1d5db; }
.table td { padding: 12px 8px; background: #f9fafb; }
</style>