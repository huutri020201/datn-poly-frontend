<template>
  <div class="feedback-wrapper container my-5">
    <div class="card shadow-sm border-0 p-4">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
      </div>

      <div v-else>
        <h4 class="fw-bold mb-4 text-dark">
          {{ isEditMode || hasFeedback ? 'Đánh giá của bạn' : 'Viết đánh giá sản phẩm' }}
        </h4>

        <div class="d-flex align-items-center mb-4 p-3 rounded custom-bg-light border">
          <div v-if="!productInfo.image" class="rounded me-3 border bg-secondary-subtle d-flex align-items-center justify-content-center" style="width: 70px; height: 70px;">
            <i class="bi bi-image text-secondary"></i>
          </div>
          <img v-else :src="productInfo.image" class="rounded me-3 border" style="width: 70px; height: 70px; object-fit: cover;">
          
          <div>
            <h6 class="mb-0 fw-bold">{{ productInfo.name || 'Sản phẩm' }}</h6>
            <small class="text-muted">Đơn hàng: #{{ String(feedbackRequest.orderId || '').substring(0, 8).toUpperCase() }}</small>
          </div>
        </div>

        <div v-if="!hasFeedback || isEditMode" class="feedback-form">
          <div class="mb-4 text-center">
            <label class="form-label d-block fw-bold fs-5">Chất lượng sản phẩm</label>
            <div class="star-rating d-inline-flex">
              <span v-for="star in 5" :key="star" 
                    @click="feedbackRequest.rating = star"
                    :class="star <= feedbackRequest.rating ? 'text-warning' : 'text-muted'"
                    class="fs-1 mx-1" style="cursor: pointer;">
                <i class="bi" :class="star <= feedbackRequest.rating ? 'bi-star-fill' : 'bi-star'"></i>
              </span>
            </div>
            <div class="text-warning fw-bold mt-2">{{ getRatingText(feedbackRequest.rating) }}</div>
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold">Nội dung đánh giá</label>
            <textarea v-model="feedbackRequest.comment" 
                      class="form-control shadow-none" 
                      rows="4" 
                      placeholder="Sản phẩm có tốt không? Hãy chia sẻ cảm nhận của bạn nhé..."></textarea>
          </div>

          <div class="mb-4">
            <label class="form-label fw-bold d-block">Hình ảnh thực tế (Tải từ máy tính)</label>
            <div class="input-group">
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileUpload" 
                class="d-none" 
                accept="image/*"
                multiple
              >
              <button @click="triggerUpload" type="button" class="btn btn-outline-success shadow-none">
                <i class="bi bi-camera me-2"></i>Chọn File ảnh
              </button>
            </div>

            <div class="d-flex mt-3 gap-3 flex-wrap">
              <div v-for="(img, idx) in previewImages" :key="idx" class="position-relative">
                <img :src="img" class="rounded border shadow-sm" style="width: 100px; height: 100px; object-fit: cover;">
                <button @click="removeImage(idx)" 
                        type="button"
                        class="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle shadow-sm" 
                        style="transform: translate(40%, -40%); width: 24px; height: 24px; padding: 0;">
                  <i class="bi bi-x"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="d-flex gap-3 justify-content-center mt-5">
            <button @click="submitFeedback" class="btn btn-success px-5 fw-bold btn-lg shadow-sm">
              {{ isEditMode ? 'CẬP NHẬT ĐÁNH GIÁ' : 'GỬI ĐÁNH GIÁ' }}
            </button>
            <button v-if="isEditMode" @click="isEditMode = false" type="button" class="btn btn-outline-secondary px-5 btn-lg">HỦY</button>
          </div>
        </div>

        <div v-else class="user-feedback-result p-4 border rounded custom-bg-light shadow-sm">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="stars mb-2 fs-4 text-warning">
                <i v-for="s in 5" :key="s" class="bi" :class="s <= myFeedback.rating ? 'bi-star-fill' : 'bi-star'"></i>
              </div>
              <p class="content text-dark fs-5">{{ myFeedback.comment }}</p>
            </div>
            <button @click="enableEdit" type="button" class="btn btn-outline-primary btn-sm">
              <i class="bi bi-pencil-square me-2"></i>Sửa
            </button>
          </div>
          
          <div v-if="myFeedback.imageUrls" class="images d-flex gap-2 my-3 flex-wrap">
            <img v-for="(img, i) in parsedImages(myFeedback.imageUrls)" 
                 :key="i" 
                 :src="img" 
                 class="rounded border shadow-sm" 
                 style="width: 120px; height: 120px; object-fit: cover;"
                 @error="(e) => e.target.src='https://placehold.co/120x120?text=Loi+Anh'">
          </div>
          
          <div class="text-muted small">Đã đánh giá vào: {{ formatDate(myFeedback.createdAt) }}</div>
        </div>

        <hr class="my-5">

        <h5 class="fw-bold mb-4"><i class="bi bi-chat-left-text me-2"></i>Đánh giá từ khách hàng khác</h5>
        
        <div v-if="productFeedbacks.length === 0" class="text-muted fst-italic py-3">
          Sản phẩm chưa có đánh giá nào khác.
        </div>
        
        <div v-else v-for="rev in productFeedbacks" :key="rev.id" class="recent-review-item mb-4 pb-3 border-bottom">
          <div class="d-flex align-items-center mb-2">
            <div class="avatar-circle me-3 bg-success-subtle text-success d-flex align-items-center justify-content-center fw-bold border border-success-subtle" style="width: 45px; height: 45px; border-radius: 50%;">
              {{ rev.userName ? rev.userName.charAt(0).toUpperCase() : 'U' }}
            </div>
            
            <div>
              <div class="fw-bold text-dark">
                {{ maskName(rev.userName || rev.userId) }} 
                <span class="text-muted fw-normal small ms-1">
                  {{ maskPhone(rev.phoneNumber) }}
                </span>
              </div>
              
              <div class="text-warning small d-flex align-items-center">
                <span class="me-2">
                  <i v-for="s in 5" :key="s" class="bi" :class="s <= rev.rating ? 'bi-star-fill' : 'bi-star'"></i>
                </span>
                <span class="text-muted small border-start ps-2">{{ formatDate(rev.createdAt) }}</span>
              </div>
            </div>
          </div>
          
          <p class="mb-0 text-dark ps-5 ms-2">{{ rev.comment }}</p>
          
          <div v-if="rev.imageUrls" class="ps-5 ms-2 mt-2 d-flex gap-2 flex-wrap">
            <img v-for="(img, i) in parsedImages(rev.imageUrls)" 
                :key="i" 
                :src="img" 
                @click="openLightbox(img)"
                class="rounded border" 
                style="width: 60px; height: 60px; object-fit: cover; cursor: zoom-in;">
                <!-- Lightbox Modal -->
                <div v-if="showLightbox" class="lightbox-overlay" @click.self="closeLightbox">
                <div class="lightbox-content">
                    <button class="btn-close-lightbox" @click="closeLightbox">&times;</button>
                    <img :src="selectedFullImage" class="img-fluid rounded shadow-lg">
                </div>
                </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/axios";

export default {
  data() {
    return {
      loading: true,
      hasFeedback: false,
      isEditMode: false,
      myFeedback: null,
      productFeedbacks: [],
      previewImages: [],
      productInfo: { name: "", image: "" }, 
      currentUserId: null, 
      showLightbox: false,
      selectedFullImage: "",
      feedbackRequest: {
        productId: null, 
        orderId: null,   
        rating: 5,
        comment: "",
        imageUrls: ""
      },
    };
  },
  async created() {
    const userJson = localStorage.getItem('user'); 
    if (userJson) {
      try {
        const userObj = JSON.parse(userJson);
        this.currentUserId = userObj.id || userObj.userId; 
      } catch (e) {
        this.currentUserId = userJson; 
      }
    }

    if (!this.currentUserId) {
      this.currentUserId = localStorage.getItem('userId');
    }

    if (!this.currentUserId) {
      alert("Không tìm thấy ID người dùng. Vui lòng đăng nhập!");
      return;
    }

    const q = this.$route.query;
    this.feedbackRequest.productId = q.productId;
    this.feedbackRequest.orderId = q.orderId;
    this.productInfo.name = q.productName || "Sản phẩm";
    
    await this.initData();
  },
  methods: {
    async initData() {
      const pId = this.feedbackRequest.productId;
      const oId = this.feedbackRequest.orderId; 

      if (!pId || pId === 'undefined') {
        this.loading = false;
        return;
      }

      this.loading = true;
      try {
        const [prodRes, myRes] = await Promise.all([
          api.get(`/feedbacks/product/${pId}`),
          api.get('/feedbacks/my', { headers: { userId: this.currentUserId } })
        ]);

        if (prodRes.data) {
          this.productFeedbacks = prodRes.data.slice(0, 5);
        }

        if (myRes.data && Array.isArray(myRes.data)) {
          const existing = myRes.data.find(f => 
            f.orderId && String(f.orderId).toLowerCase() === String(oId).toLowerCase()
          );
          
          if (existing) {
            this.hasFeedback = true;
            this.myFeedback = existing;
            this.feedbackRequest.comment = existing.comment;
            this.feedbackRequest.rating = existing.rating;
            this.previewImages = this.parsedImages(existing.imageUrls);
          } else {
            this.hasFeedback = false;
          }
        }
      } catch (e) {
        console.error("Lỗi API:", e);
      } finally {
        this.loading = false;
      }
    },

    triggerUpload() {
      if (this.$refs.fileInput) {
        this.$refs.fileInput.click();
      }
    },

    async handleFileUpload(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const CLOUD_NAME = "dfsab7tgu"; 
      const UPLOAD_PRESET = "datn_nhom3"; 

      this.loading = true;

      try {
        for (let file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", UPLOAD_PRESET);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            { method: "POST", body: formData }
          );
          
          const data = await response.json();
          
          if (data.secure_url) {
            this.previewImages.push(data.secure_url);
          } else {
            console.error("Cloudinary Error:", data.error?.message);
          }
        }
      } catch (error) {
        console.error("Lỗi upload:", error);
        alert("Không thể tải ảnh lên Cloudinary!");
      } finally {
        this.loading = false;
        if (this.$refs.fileInput) {
      this.$refs.fileInput.value = null;
    }
      }
    },

    removeImage(index) {
      this.previewImages.splice(index, 1);
    },

    openLightbox(url) {
        this.selectedFullImage = url;
        this.showLightbox = true;
        document.body.style.overflow = 'hidden';
    },
    closeLightbox() {
        this.showLightbox = false;
        this.selectedFullImage = "";
        document.body.style.overflow = 'auto';
    },

    async submitFeedback() {
      if (!this.feedbackRequest.comment.trim()) {
        alert("Vui lòng nhập nội dung đánh giá!");
        return;
      }

      if (!this.currentUserId) {
        alert("Không tìm thấy ID người dùng. Vui lòng đăng nhập!");
        return;
      }

      const payload = {
        productId: this.feedbackRequest.productId, 
        orderId: this.feedbackRequest.orderId,
        rating: this.feedbackRequest.rating,
        comment: this.feedbackRequest.comment,
        imageUrls: this.previewImages.join(",")
      };

      const config = { 
        headers: { 
          'userId': this.currentUserId 
        } 
      };

      try {
        if (this.isEditMode) {
          await api.put(`/feedbacks/${this.myFeedback.id}`, payload, config);
        } else {
          await api.post('/feedbacks', payload, config);
        }
        
        alert(this.isEditMode ? "Cập nhật thành công!" : "Đánh giá thành công!");
        this.isEditMode = false;
        await this.initData(); 
      } catch (e) {
        console.error("Lỗi khi submit:", e);
        alert("Có lỗi xảy ra khi gửi dữ liệu!");
      }
    },

    enableEdit() {
      this.isEditMode = true;
      this.feedbackRequest.comment = this.myFeedback.comment;
      this.feedbackRequest.rating = this.myFeedback.rating;
      this.previewImages = this.parsedImages(this.myFeedback.imageUrls);
    },

    parsedImages(urls) {
      if (!urls || typeof urls !== 'string') return [];
      return urls.split(",").filter(item => item.trim() !== "");
    },

    maskName(name) {
      if (!name) return "Người dùng";
      const str = String(name).trim();
      if (str.length > 20) return "***_" + str.substring(0, 5);
      if (str.length <= 2) return str + "***";
      return str.charAt(0) + "***" + str.charAt(str.length - 1);
    },

    maskPhone(phone) {
      if (!phone) return "(*******)";
      const str = String(phone).trim();
      return "(*******" + str.slice(-3) + ")";
    },

    formatDate(d) {
      return d ? new Date(d).toLocaleDateString("vi-VN") : "---";
    },

    getRatingText(r) {
      const texts = ["", "Quá tệ", "Không hài lòng", "Bình thường", "Hài lòng", "Tuyệt vời"];
      return texts[r] || "";
    }
  }
};
</script>

<style scoped>
.custom-bg-light { background-color: #f1f8f4; }
.star-rating i { transition: all 0.2s; }
.star-rating i:hover { transform: scale(1.15); }
.avatar-circle { width: 45px; height: 45px; border-radius: 50%; font-size: 1.2rem; }
textarea:focus { border-color: #198754; box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.25); }
.recent-review-item:last-child { border-bottom: none !important; }
/* Lớp nền mờ toàn màn hình */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85); /* Đen mờ */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  cursor: zoom-out;
  padding: 20px;
}

/* Khung chứa ảnh */
.lightbox-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh; 
  object-fit: contain;
  border: 3px solid white;
}

/* Nút đóng */
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
}

.btn-close-lightbox:hover {
  color: #ffc107;
}
</style>