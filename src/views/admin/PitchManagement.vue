<template>
  <div class="row py-3">

    <div class="col-md-4 mb-4">
      <div class="p-4 rounded shadow-sm bg-form-green h-100">
        <form @submit.prevent="submitForm">
          <h5 class="mb-4 fw-bold text-success">
            {{ isEditing ? "Cập nhật thông tin sân" : "Thêm sân mới" }}
          </h5>

          <div class="mb-3">
            <label class="form-label small fw-bold">Tên sân</label>
            <input v-model="form.name" type="text" class="form-control form-control-sm border-success-subtle" required placeholder="VD: Sân Cỏ Nhân Tạo số 1">
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Giá thuê mỗi giờ (VNĐ)</label>
            <input v-model="form.pricePerHour" type="number" class="form-control form-control-sm border-success-subtle" required placeholder="VD: 150000">
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Địa chỉ / Vị trí</label>
            <input v-model="form.address" type="text" class="form-control form-control-sm border-success-subtle" placeholder="VD: Khu A, Góc phải...">
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Link Ảnh Bìa (URL)</label>
            <input v-model="form.imageUrl" type="text" class="form-control form-control-sm border-success-subtle" placeholder="https://...">
          </div>

          <div class="mb-4">
            <label class="form-label small fw-bold">Mô tả thêm</label>
            <textarea v-model="form.description" class="form-control form-control-sm border-success-subtle" rows="3" placeholder="Tình trạng thảm, bóng đèn..."></textarea>
          </div>

          <button type="submit" class="btn w-100 fw-bold shadow-sm" :class="isEditing ? 'btn-warning' : 'btn-success'">
            {{ isEditing ? "LƯU CẬP NHẬT" : "TẠO SÂN MỚI" }}
          </button>

          <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-outline-secondary w-100 mt-2 fw-bold">
            HỦY
          </button>
        </form>
      </div>
    </div>

    <div class="col-md-8">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="fw-bold mb-0">Danh Sách Sân Bãi</h5>
        <button class="btn btn-sm btn-dark" @click="fetchPitches">↻ Làm mới</button>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success"></div>
      </div>

      <div v-else class="table-responsive bg-white rounded shadow-sm">
        <table class="table table-bordered align-middle text-center border-dark custom-table mb-0">
          <thead class="table-secondary">
            <tr>
              <th width="80">Ảnh</th>
              <th>Tên sân</th>
              <th>Giá / Giờ</th>
              <th>Trạng thái</th>
              <th width="120">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pitch in pitches" :key="pitch.id">
              <td>
                <img :src="pitch.imageUrl || 'https://via.placeholder.com/60'" class="rounded border" style="width: 60px; height: 45px; object-fit: cover;">
              </td>
              <td class="text-start fw-bold">{{ pitch.name }}</td>
              <td class="text-danger fw-bold">{{ formatCurrency(pitch.pricePerHour) }}</td>
              <td>
                <span class="badge bg-success">Hoạt động</span>
              </td>
              <td>
                <button @click="editPitch(pitch)" class="btn btn-sm btn-outline-primary me-1" title="Sửa">✏</button>
                <button @click="removePitch(pitch.id)" class="btn btn-sm btn-outline-danger" title="Xóa">🗑</button>
              </td>
            </tr>
            <tr v-if="pitches.length === 0">
              <td colspan="5" class="py-4 text-muted">Chưa có sân nào trên hệ thống</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllPitches, createPitch, updatePitch, deletePitch } from '@/api/pitchApi'; // Sửa đường dẫn nếu cần

const pitches = ref([]);
const loading = ref(false);

const isEditing = ref(false);
const editingId = ref(null);

const form = ref({
  name: "",
  pricePerHour: "",
  address: "",
  description: "",
  imageUrl: ""
});

// READ
const fetchPitches = async () => {
  loading.value = true;
  try {
    const res = await getAllPitches();
    pitches.value = res.data.result || res.data;
  } catch (err) {
    console.error("Lỗi lấy danh sách sân:", err);
  } finally {
    loading.value = false;
  }
};

// CREATE / UPDATE
const submitForm = async () => {
  try {
    if (isEditing.value) {
      await updatePitch(editingId.value, form.value);
      alert("Cập nhật thành công!");
    } else {
      await createPitch(form.value);
      alert("Tạo sân mới thành công!");
    }
    await fetchPitches();
    resetForm();
  } catch (err) {
    console.error("Lỗi lưu sân:", err);
    alert("Có lỗi xảy ra, vui lòng kiểm tra lại!");
  }
};

// Chuẩn bị EDIT
const editPitch = (pitch) => {
  isEditing.value = true;
  editingId.value = pitch.id;
  // Copy dữ liệu lên form
  form.value = {
    name: pitch.name,
    pricePerHour: pitch.pricePerHour,
    address: pitch.address || "",
    description: pitch.description || "",
    imageUrl: pitch.imageUrl || ""
  };
};

// DELETE
const removePitch = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa sân này? Dữ liệu không thể khôi phục!")) return;
  try {
    await deletePitch(id);
    await fetchPitches();
  } catch (err) {
    console.error("Lỗi xóa sân:", err);
    alert("Không thể xóa sân (Có thể do sân đang có người đặt lịch).");
  }
};

// RESET FORM
const resetForm = () => {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    name: "",
    pricePerHour: "",
    address: "",
    description: "",
    imageUrl: ""
  };
};

// FORMAT TIỀN
const formatCurrency = (price) => {
  if (!price) return "0đ";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

onMounted(() => {
  fetchPitches();
});
</script>

<style scoped>
.bg-form-green {
  background: #dcfce7; /* Xanh lá nhạt, cùng tông với Product form */
}
.custom-table thead th {
  background: #d1d5db;
}
.table td {
  padding: 12px 8px;
  background: #f9fafb;
}
</style>