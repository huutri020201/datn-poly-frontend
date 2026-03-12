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
import { useRoute } from "vue-router"
import axios from "axios"

const route = useRoute()

const product = ref(null)

const selectedColor = ref(null)
const selectedSize = ref(null)

const selectedVariant = ref(null)

const fetchProduct = async () => {

  try{

    const res = await axios.get(
      `http://localhost:8080/products/${route.params.id}`
    )

    product.value = res.data.result

  }
  catch(err){

    console.error("Load product error:",err)

  }

}

onMounted(fetchProduct)



const colors = computed(()=>{

  if(!product.value) return []

  return [...new Set(
    product.value.variants.map(v=>v.attributes.color)
  )]

})


const sizes = computed(()=>{

  if(!product.value) return []

  return [...new Set(
    product.value.variants.map(v=>v.attributes.size)
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

  selectedVariant.value = product.value.variants.find(v=>

    v.attributes.color === selectedColor.value &&
    v.attributes.size === selectedSize.value

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


const addToCart = ()=>{

  alert("Đã thêm vào giỏ: " + selectedVariant.value.sku)

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