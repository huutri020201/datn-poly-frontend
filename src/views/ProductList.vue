:::writing{variant="standard" id="prod1"}
<template>
  <div class="container mt-4">

    <h4 class="mb-4">Sản phẩm</h4>

    <div class="row">

      <div
        class="col-md-3 mb-4"
        v-for="p in products"
        :key="p.id"
      >
        <div class="card product-card h-100">

          <img
            :src="getImage(p)"
            class="card-img-top"
            alt="product"
          >

          <div class="card-body">

            <h6 class="card-title">
              {{ p.name }}
            </h6>

            <p class="text-danger fw-bold">
              {{ formatPrice(p.basePrice) }}
            </p>

            <button
              class="btn btn-dark btn-sm w-100"
              @click="viewProduct(p.id)"
            >
              Xem chi tiết
            </button>

          </div>

        </div>
      </div>

    </div>

  </div>
</template>

<script setup>

import { ref, onMounted } from "vue"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const products = ref([])

const fetchProducts = async () => {

  const res = await axios.get("http://localhost:8080/products")

  products.value = res.data.result

}

const viewProduct = (id) => {

  router.push(`/product/${id}`)

}

const getImage = (p) => {

  if (p.variants && p.variants.length > 0) {
    return p.variants[0].imageUrl
  }

  return "https://via.placeholder.com/300"

}

const formatPrice = (price) => {

  return new Intl.NumberFormat('vi-VN',{
    style:'currency',
    currency:'VND'
  }).format(price)

}

onMounted(fetchProducts)

</script>

<style scoped>

.product-card{
  transition:0.2s;
}

.product-card:hover{
  transform:translateY(-5px);
  box-shadow:0 5px 15px rgba(0,0,0,0.2);
}

.card-img-top{
  height:220px;
  object-fit:cover;
}

</style>
:::