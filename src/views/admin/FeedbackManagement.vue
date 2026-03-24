<template>
  <div class="admin-feedback-container">
    <div class="header">
      <h2>Quản lý Đánh giá (Feedback)</h2>
      <button @click="fetchFeedbacks" class="btn-refresh" :disabled="isLoading">
        {{ isLoading ? 'Đang tải...' : 'Làm mới' }}
      </button>
    </div>

    <div class="table-responsive">
      <table class="feedback-table">
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>SĐT</th>
            <th>Sản phẩm / Đơn hàng</th>
            <th>Đánh giá & Nội dung</th>
            <th>Phản hồi của Admin</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading">
            <td colspan="7" class="text-center">Đang tải dữ liệu...</td>
          </tr>
          <tr v-else-if="feedbacks.length === 0">
            <td colspan="7" class="text-center">Chưa có đánh giá nào.</td>
          </tr>
          
          <tr 
            v-for="feedback in feedbacks" 
            :key="feedback.id" 
            v-else
            :class="{ 'low-rating-row': feedback.rating < 3 }"
          >
            <td>{{ feedback.userName }}</td>
            <td>{{ feedback.phoneNumber }}</td>
            
            <td>
              <div v-if="feedback.productId" class="text-sm">SP: {{ shortId(feedback.productId) }}</div>
              <div v-if="feedback.orderId" class="text-sm">ĐH: {{ shortId(feedback.orderId) }}</div>
            </td>
            
            <td class="comment-cell">
              <span class="stars">
                {{ '★'.repeat(feedback.rating || 0) }}{{ '☆'.repeat(5 - (feedback.rating || 0)) }}
              </span>
              <div v-if="feedback.rating < 3" class="warning-note"><i class="bi bi-exclamation-triangle"></i> Đánh giá thấp</div>
              <p class="comment-text">"{{ feedback.comment }}"</p>
              <img 
                v-if="feedback.imageUrls" 
                :src="feedback.imageUrls.split(',')[0]" 
                class="feedback-img" 
                @click="openLightbox(feedback.imageUrls.split(',')[0])"
                title="Bấm để phóng to"
              />
            </td>

            <td class="reply-cell">
              <div v-if="!feedback.isEditingReply && feedback.adminReply">
                <p class="reply-text"><strong>Admin:</strong> {{ feedback.adminReply }}</p>
                <button @click="enableEditReply(feedback)" class="btn-text btn-edit"><i class="bi bi-pencil-square"></i> Sửa</button>
              </div>
              <div v-else class="reply-input-group">
                <textarea 
                  v-model="feedback.draftReply" 
                  placeholder="Nhập phản hồi..." 
                  class="reply-input"
                  rows="2"
                ></textarea>
                <div class="reply-actions">
                  <button @click="submitReply(feedback)" class="btn-action btn-submit-reply">Gửi</button>
                  <button v-if="feedback.isEditingReply" @click="cancelEditReply(feedback)" class="btn-action btn-cancel">Hủy</button>
                </div>
              </div>
            </td>

            <td>
              <span :class="feedback.status === 'HIDDEN' ? 'badge badge-hidden' : 'badge badge-active'">
                {{ feedback.status === 'HIDDEN' ? 'Đã ẩn' : 'Hiển thị' }}
              </span>
            </td>

            <td class="actions">
              <button 
                v-if="feedback.status !== 'HIDDEN'" 
                @click="toggleStatus(feedback, 'HIDDEN')" 
                class="btn-action btn-hide"
              >
                <i class="bi bi-eye-fill"></i> Ẩn
              </button>
              <button 
                v-else 
                @click="toggleStatus(feedback, 'ACTIVE')" 
                class="btn-action btn-show"
              >
                <i class="bi bi-eye-slash-fill"></i> Hiện
              </button>
              
              <button @click="deleteFeedback(feedback.id)" class="btn-action btn-delete"><i class="bi bi-trash-fill"></i> Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="showLightbox" class="lightbox-overlay" @click.self="closeLightbox">
      <div class="lightbox-content">
        <button class="btn-close-lightbox" @click="closeLightbox">&times;</button>
        <img :src="selectedFullImage" class="img-fluid rounded shadow-lg">
      </div>

    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/admin/feedbacks';
const feedbacks = ref([]);
const isLoading = ref(false);
const showLightbox = ref(false);
const selectedFullImage = ref('');
const shortId = (id) => id ? id.substring(0, 8) + '...' : '';

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const fetchFeedbacks = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(API_BASE_URL, getAuthHeaders());
    feedbacks.value = response.data.map(fb => ({
      ...fb,
      draftReply: fb.adminReply || '',
      isEditingReply: false 
    }));
  } catch (error) {
    console.error('Lỗi khi tải danh sách đánh giá:', error);
    if (error.response && error.response.status === 401) {
      alert("Phiên đăng nhập đã hết hạn hoặc bạn không có quyền truy cập. Vui lòng đăng nhập lại!");
    }
  } finally {
    isLoading.value = false;
  }
};

const toggleStatus = async (feedback, newStatus) => {
  try {
    const config = {
      ...getAuthHeaders(),
      params: { status: newStatus }
    };
    await axios.put(`${API_BASE_URL}/${feedback.id}/status`, null, config);
    feedback.status = newStatus; 
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái:', error);
  }
};

const deleteFeedback = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
    feedbacks.value = feedbacks.value.filter(f => f.id !== id);
  } catch (error) {
    console.error('Lỗi khi xóa đánh giá:', error);
  }
};

const enableEditReply = (feedback) => {
  feedback.draftReply = feedback.adminReply;
  feedback.isEditingReply = true;
};

const cancelEditReply = (feedback) => {
  feedback.isEditingReply = false;
};

const submitReply = async (feedback) => {
  if (!feedback.draftReply.trim()) {
    alert("Vui lòng nhập nội dung phản hồi!");
    return;
  }
  
  try {
    const config = getAuthHeaders();
    config.headers['Content-Type'] = 'text/plain';
    
    await axios.put(`${API_BASE_URL}/${feedback.id}/reply`, feedback.draftReply, config);
    
    feedback.adminReply = feedback.draftReply;
    feedback.isEditingReply = false;
    alert("Gửi phản hồi thành công!");
  } catch (error) {
    console.error('Lỗi khi gửi phản hồi:', error);
    alert("Có lỗi xảy ra khi gửi phản hồi.");
  }
};

const openLightbox = (url) => {
  selectedFullImage.value = url;
  showLightbox.value = true;
  document.body.style.overflow = 'hidden'; 
};

const closeLightbox = () => {
  showLightbox.value = false;
  selectedFullImage.value = '';
  document.body.style.overflow = 'auto'; 
};

onMounted(() => {
  fetchFeedbacks();
});
</script>

<style scoped>
.admin-feedback-container { padding: 20px; background-color: #dcfce7; border-radius: 8px; }
.header { display: flex; justify-content: space-between; margin-bottom: 20px; }
.btn-refresh { padding: 8px 16px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
.table-responsive { overflow-x: auto; background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.feedback-table { width: 100%; border-collapse: collapse; }
.feedback-table th, .feedback-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
.feedback-table th { background-color: #f3f4f6; font-weight: 600; color: #374151; }

.low-rating-row { background-color: #fef2f2; }
.warning-note { font-size: 0.75rem; color: #dc2626; font-weight: bold; background-color: #fee2e2; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-bottom: 5px; }
.stars { color: #fbbf24; font-size: 1.2rem; display: block; }
.comment-text { margin: 5px 0; font-style: italic; color: #4b5563; }
.feedback-img { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #e5e7eb; margin-top: 5px; }

/* Styles cho phần Reply */
.reply-cell { min-width: 200px; }
.reply-text { font-size: 0.9rem; color: #1f2937; background: #f3f4f6; padding: 8px; border-radius: 6px; margin: 0 0 5px 0;}
.reply-input-group { display: flex; flex-direction: column; gap: 8px; }
.reply-input { width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 4px; resize: vertical; font-family: inherit; }
.reply-actions { display: flex; gap: 8px; }
.btn-submit-reply { background-color: #3b82f6; color: white; }
.btn-submit-reply:hover { background-color: #2563eb; }
.btn-cancel { background-color: #9ca3af; color: white; }
.btn-text { background: none; border: none; font-size: 0.8rem; cursor: pointer; color: #3b82f6; text-decoration: underline; padding: 0;}

/* Badge Trạng thái */
.badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
.badge-active { background-color: #d1fae5; color: #065f46; }
.badge-hidden { background-color: #fee2e2; color: #991b1b; }

.actions { display: flex; flex-direction: column; gap: 6px; }
.btn-action { padding: 6px 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.btn-hide { background-color: #f59e0b; color: white; }
.btn-show { background-color: #10b981; color: white; }
.btn-delete { background-color: #ef4444; color: white; }
.feedback-img { 
  width: 50px; 
  height: 50px; 
  object-fit: cover; 
  border-radius: 4px; 
  border: 1px solid #e5e7eb; 
  margin-top: 5px; 
  cursor: zoom-in; /* THÊM: Đổi con trỏ chuột */
  transition: transform 0.2s;
}

.feedback-img:hover {
  transform: scale(1.05); /* THÊM: Hiệu ứng phóng to nhẹ khi hover */
}

/* THÊM MỚI: CSS cho Lightbox (Tương tự như bên Feedback.vue) */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw; /* Đảm bảo phủ kín toàn màn hình */
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: zoom-out;
  padding: 20px;
}

.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh; 
  object-fit: contain;
  border: 3px solid white;
  border-radius: 8px; /* Tùy chọn: bo góc ảnh trong lightbox */
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
  line-height: 1;
  z-index: 10000;
}

.btn-close-lightbox:hover {
  color: #ffc107;
}
</style>