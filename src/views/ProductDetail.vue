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
          style="object-fit: cover; border-radius: 8px;"
        >
      </div>

      <div class="col-lg-4 col-md-4 px-lg-4 mb-4">
        <h3 class="fw-bold">{{ product.name }}</h3>

        <h4 class="text-danger mt-3 mb-4">
          {{ formatPrice(selectedPrice) }}
        </h4>

        <p class="text-muted">
          {{ product.description }}
        </p>

        <div class="mt-4">
          <h6 class="fw-bold">Color</h6>
          <button
            v-for="c in colors"
            :key="c"
            class="btn btn-outline-dark btn-sm me-2 mb-2"
            :class="{active:selectedColor===c}"
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
            :class="{active:selectedSize===s}"
            @click="selectSize(s)"
          >
            {{ s }}
          </button>
        </div>

        <div class="mt-3">
          <small class="text-muted">
            Stock: {{ selectedVariant?.stockQty || 0 }}
          </small>
        </div>

        <button
          class="btn btn-dark mt-4 px-4 py-2"
          :disabled="!selectedVariant"
          @click="addToCart"
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      <div class="col-lg-4 col-md-4 border-start">
        <h5 class="fw-bold border-bottom pb-2 mb-3">Đánh giá sản phẩm ({{ feedbacks.length }})</h5>

        <div class="feedback-scrollable pe-2">
          
          <div v-if="feedbacks.length === 0" class="text-center text-muted mt-5 fst-italic">
            Chưa có đánh giá nào.
          </div>

          <div v-else class="feedback-list">
            <div v-for="fb in feedbacks" :key="fb.id" class="feedback-item mb-3 pb-3 border-bottom">
              
              <div class="d-flex align-items-center mb-2">
                <div class="avatar-circle bg-dark text-white me-2 d-flex justify-content-center align-items-center shadow-sm">
                  {{ fb.userName ? fb.userName.charAt(0).toUpperCase() : 'K' }}
                </div>
                <div>
                  <div class="fw-bold" style="font-size: 0.95rem;">
                    {{ maskName(fb.userName || fb.userId) }}
                    <span v-if="fb.phoneNumber" class="text-muted fw-normal small ms-1">{{ maskPhone(fb.phoneNumber) }}</span>
                  </div>
                  
                  <div class="text-warning" style="font-size: 0.8rem;">
                    <i v-for="s in 5" :key="s" class="bi" :class="s <= fb.rating ? 'bi-star-fill' : 'bi-star'"></i>
                    <span class="text-muted ms-2">{{ formatDate(fb.createdAt) }}</span>
                  </div>
                </div>
              </div>
              
              <p class="mb-2 text-dark" style="font-size: 0.95rem;">{{ fb.comment }}</p>

              <div v-if="fb.imageUrls" class="d-flex gap-2 flex-wrap mb-2">
                <img 
                  v-for="(img, idx) in fb.imageUrls.split(',')" 
                  :key="idx" 
                  :src="img.trim()" 
                  class="feedback-img rounded border" 
                  @click="openLightbox(img.trim())"
                  title="Nhấn để phóng to"
                />
              </div>

              <div v-if="fb.adminReply" class="admin-reply bg-light p-2 mt-2 rounded border-start border-4 border-secondary">
                <div class="fw-bold mb-1" style="font-size: 0.85rem;">Phản hồi từ Người bán:</div>
                <div class="text-muted" style="font-size: 0.85rem;">{{ fb.adminReply }}</div>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="showLightbox" class="lightbox-overlay" @click.self="closeLightbox">
      <div class="lightbox-content">
        <button class="btn-close-lightbox" @click="closeLightbox">&times;</button>
        <img :src="selectedFullImage" class="img-fluid rounded shadow-lg">
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router" 
import { cartCount } from '@/cartState';
import axios from "axios"

const route = useRoute()
const router = useRouter()

const product = ref(null)
const feedbacks = ref([]) 

const selectedColor = ref(null)
const selectedSize = ref(null)
const selectedVariant = ref(null)
const showLightbox = ref(false)
const selectedFullImage = ref('')

const openLightbox = (url) => {
  selectedFullImage.value = url;
  showLightbox.value = true;
  document.body.style.overflow = 'hidden'; 
}

const closeLightbox = () => {
  showLightbox.value = false;
  selectedFullImage.value = '';
  document.body.style.overflow = 'auto'; 
}

const maskName = (name) => {
  if (!name) return "Khách hàng";
  const str = String(name).trim();
  if (str.length > 20) return "Khách hàng"; 
  if (str.length <= 2) return str.charAt(0) + "***";
  return str.charAt(0) + "***" + str.charAt(str.length - 1);
};

const maskPhone = (phone) => {
  if (!phone) return ""; 
  const str = String(phone).trim();
  if (str.length <= 3) return "***";
  return "*******" + str.slice(-3);
};

const fetchProduct = async () => {
  try {
    const res = await axios.get(`http://localhost:8080/products/${route.params.id}`)
    product.value = res.data.result || res.data; 

    if (product.value?.variants?.length) {
      const defaultVariant = product.value.variants.find(v => v.active); 
      if (defaultVariant) {
        selectedVariant.value = defaultVariant; 
        selectedColor.value = defaultVariant.attributes?.color;
        selectedSize.value = defaultVariant.attributes?.size;
      }
    }
  } catch(err) {
    console.error("Load product error:", err)
  }
}

const fetchFeedbacks = async () => {
  try {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` }
    } : {};
    const res = await axios.get(`http://localhost:8080/feedbacks/product/${route.params.id}`, config);
    
    const responseData = res.data.result || res.data;
    
    if (Array.isArray(responseData)) {
      feedbacks.value = responseData.filter(f => f.status !== 'HIDDEN');
    } else {
      feedbacks.value = [];
    }
  } catch(err) {
    console.error("Load feedbacks error:", err);
  }
}

onMounted(() => {
  fetchProduct()
  fetchFeedbacks() 
})

const colors = computed(() => {
  if(!product.value) return []
  return [...new Set(
    product.value.variants
      .filter(v => v.active) 
      .map(v => v.attributes?.color) 
      .filter(color => color) 
  )]
})

const sizes = computed(() => {
  if(!product.value) return []
  return [...new Set(
    product.value.variants
      .filter(v => v.active) 
      .map(v => v.attributes?.size) 
      .filter(size => size)
  )]
})

const selectColor = (color)=>{
  selectedColor.value = color
  findVariant()
}

const selectSize = (size)=>{
  selectedSize.value = size
  findVariant()
}

const findVariant = ()=>{
  if(!product.value) return
  selectedVariant.value = product.value.variants.find(v => 
    v.active && 
    v.attributes?.color === selectedColor.value && 
    v.attributes?.size === selectedSize.value      
  )
}

const selectedImage = computed(()=>{
  if(selectedVariant.value?.imageUrl) return selectedVariant.value.imageUrl
  if(product.value?.variants?.length) return product.value.variants[0].imageUrl
  return "https://via.placeholder.com/500"
})

const selectedPrice = computed(()=>{
  if(selectedVariant.value?.priceOverride) return selectedVariant.value.priceOverride
  return product.value.basePrice
})

const formatPrice = (price)=>{
  return new Intl.NumberFormat('vi-VN',{ style:'currency', currency:'VND' }).format(price)
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  return d.toLocaleDateString('vi-VN');
}

const addToCart = async () => {
  if (!selectedVariant.value) {
    alert("Vui lòng chọn phân loại hàng!");
    return;
  }

  const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
  
  if (!token) {
    alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
    return;
  }

  try {
    await axios.post('http://localhost:8080/cart/add', {
      productId: product.value.id,        
      variantId: selectedVariant.value.id, 
      quantity: 1,                        
      unitPrice: selectedPrice.value      
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    cartCount.value += 1;
    alert("Đã thêm " + selectedVariant.value.sku + " vào giỏ hàng thành công!");

  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ:", error);
    alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại!");
  }
}
</script>

<style scoped>
.product-image{
  border-radius:8px;
  border:1px solid #eee;
}

button.active{
  background:black;
  color:white;
}

.feedback-scrollable {
  max-height: 550px; 
  overflow-y: auto;
}

.feedback-scrollable::-webkit-scrollbar {
  width: 6px;
}

.feedback-scrollable::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
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
  transition: transform 0.2s;
}

.feedback-img:hover {
  transform: scale(1.05); 
}

.admin-reply {
  font-size: 0.9rem;
}

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
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
  border-radius: 8px;
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