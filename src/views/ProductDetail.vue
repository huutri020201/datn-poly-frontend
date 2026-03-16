<template>

  <div v-if="!product" class="text-center mt-5">
    Loading...
  </div>

  <div class="container mt-4" v-else>

    <div class="row">

      <!-- IMAGE -->
      <div class="col-md-5">

        <img
          :src="selectedImage"
          class="img-fluid product-image"
        >

      </div>


      <!-- INFO -->
      <div class="col-md-7">

        <h4>{{ product.name }}</h4>

        <h5 class="text-danger">
          {{ formatPrice(selectedPrice) }}
        </h5>

        <p class="text-muted">
          {{ product.description }}
        </p>

        <!-- COLOR -->
        <div class="mt-4">

          <h6>Color</h6>

          <button
            v-for="c in colors"
            :key="c"
            class="btn btn-outline-dark btn-sm me-2"
            :class="{active:selectedColor===c}"
            @click="selectColor(c)"
          >
            {{ c }}
          </button>

        </div>


        <!-- SIZE -->
        <div class="mt-3">

          <h6>Size</h6>

          <button
            v-for="s in sizes"
            :key="s"
            class="btn btn-outline-secondary btn-sm me-2"
            :class="{active:selectedSize===s}"
            @click="selectSize(s)"
          >
            {{ s }}
          </button>

        </div>


        <!-- STOCK -->
        <div class="mt-3">

          <small class="text-muted">
            Stock: {{ selectedVariant?.stockQty || 0 }}
          </small>

        </div>


        <!-- ADD CART -->
        <button
          class="btn btn-dark mt-4"
          :disabled="!selectedVariant"
          @click="addToCart"
        >
          Thêm vào giỏ hàng
        </button>

      </div>

    </div>

  </div>

</template>


<script setup>

import { ref, computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router" 
import axios from "axios"

const route = useRoute()
const router = useRouter()

const product = ref(null)

const selectedColor = ref(null)
const selectedSize = ref(null)

const selectedVariant = ref(null)

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

onMounted(fetchProduct)



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

  if(selectedVariant.value?.imageUrl)
    return selectedVariant.value.imageUrl

  if(product.value?.variants?.length)
    return product.value.variants[0].imageUrl

  return "https://via.placeholder.com/500"

})


const selectedPrice = computed(()=>{

  if(selectedVariant.value?.priceOverride)
    return selectedVariant.value.priceOverride

  return product.value.basePrice

})


const formatPrice = (price)=>{

  return new Intl.NumberFormat('vi-VN',{
    style:'currency',
    currency:'VND'
  }).format(price)

}


const addToCart = async () => {
  if (!selectedVariant.value) {
    alert("Vui lòng chọn phân loại hàng!");
    return;
  }

  const token = localStorage.getItem("accessToken");
  
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
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    alert("Đã thêm " + selectedVariant.value.sku + " vào giỏ hàng thành công!");
    router.push('/cart');
    

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

</style>