<template>
  <div class="row">

    <!-- ================= FORM ================= -->
    <div class="col-md-4">
      <div class="p-3 rounded shadow-sm bg-form-green">

        <form @submit.prevent="submitForm">

          <h6 class="mb-3">Thông tin sản phẩm</h6>

          <div class="mb-3">
            <label class="form-label small fw-bold">Tên sản phẩm</label>
            <input v-model="form.name" class="form-control form-control-sm" required>
          </div>

          <!-- BRAND -->
          <div class="mb-3">
            <label class="form-label small fw-bold">Brand</label>

            <select v-model="form.brandId" class="form-select form-select-sm" required>
              <option value="">-- Chọn Brand --</option>

              <option v-for="b in brands" :key="b.id" :value="b.id">
                {{ b.name }}
              </option>

            </select>
          </div>

          <!-- CATEGORY -->
          <div class="mb-3">
            <label class="form-label small fw-bold">Category</label>

            <select v-model="form.categoryId" class="form-select form-select-sm" required>

              <option value="">-- Chọn Category --</option>

              <option v-for="c in categories" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>

            </select>
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Base Price</label>
            <input v-model="form.basePrice" type="number" class="form-control form-control-sm">
          </div>

          <div class="mb-3">
            <label class="form-label small fw-bold">Description</label>
            <textarea v-model="form.description" class="form-control form-control-sm"></textarea>
          </div>

          <!-- ================= VARIANTS ================= -->

          <h6 class="mt-4">Variants</h6>

          <div
            v-for="(v,index) in form.variants"
            :key="index"
            class="variant-box p-3 mb-3"
          >

            <div class="row">

              <div class="col-md-6 mb-2">
                <label class="form-label small fw-bold">SKU</label>
                <input v-model="v.sku" class="form-control form-control-sm">
              </div>

              <div class="col-md-6 mb-2">
                <label class="form-label small fw-bold">Stock</label>
                <input v-model="v.stockQty" type="number" class="form-control form-control-sm">
              </div>

              <div class="col-md-6 mb-2">
                <label class="form-label small fw-bold">Price Override</label>
                <input v-model="v.priceOverride" type="number" class="form-control form-control-sm">
              </div>

              <div class="col-md-6 mb-2">
                <label class="form-label small fw-bold">Image URL</label>
                <input v-model="v.imageUrl" class="form-control form-control-sm">
              </div>

              <div class="col-md-6 mb-2">
                <label class="form-label small fw-bold">Color</label>
                <input v-model="v.attributes.color" class="form-control form-control-sm">
              </div>

              <div class="col-md-6 mb-2">
                <label class="form-label small fw-bold">Size</label>
                <input v-model="v.attributes.size" class="form-control form-control-sm">
              </div>

            </div>

            <button
              type="button"
              class="btn btn-sm btn-danger mt-2"
              @click="removeVariant(index)"
            >
              Xóa Variant
            </button>

          </div>

          <button
            type="button"
            class="btn btn-secondary btn-sm w-100 mb-3"
            @click="addVariantRow"
          >
            + Thêm Variant
          </button>

          <!-- SUBMIT -->

          <button type="submit" class="btn btn-dark w-100 btn-sm">
            {{ isEditing ? "Cập nhật" : "Thêm sản phẩm" }}
          </button>

          <button
            v-if="isEditing"
            type="button"
            @click="resetForm"
            class="btn btn-secondary w-100 btn-sm mt-2"
          >
            Hủy
          </button>

        </form>

      </div>
    </div>


    <!-- ================= TABLE PRODUCT ================= -->

    <div class="col-md-8">

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-dark"></div>
      </div>

      <div v-else class="table-responsive">

        <table class="table table-bordered align-middle text-center border-dark custom-table">

          <thead class="table-secondary">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Variants</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>

            <tr v-for="p in products" :key="p.id">

              <td class="text-start">{{ p.name }}</td>

              <td>{{ p.basePrice }}</td>

              <td>{{ p.brandName }}</td>

              <td>{{ p.categoryName }}</td>

              <td>
                <button
                  class="btn btn-sm btn-outline-info"
                  @click="showVariants(p)"
                >
                  👁
                </button>
              </td>

              <td>

                <button
                  @click="editProduct(p)"
                  class="btn btn-sm btn-outline-primary me-1"
                >
                  ✏
                </button>

                <button
                  @click="removeProduct(p.id)"
                  class="btn btn-sm btn-outline-danger"
                >
                  🗑
                </button>

              </td>

            </tr>

            <tr v-if="products.length === 0">
              <td colspan="6">Không có dữ liệu</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>


  <!-- ================= MODAL VARIANT ================= -->

  <div v-if="variantModal" class="modal-backdrop">

    <div class="modal-box-large">

      <h5 class="mb-3">Danh sách Variant</h5>

      <table class="table table-bordered text-center">

        <thead class="table-light">
          <tr>
            <th>SKU</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Color</th>
            <th>Size</th>
          </tr>
        </thead>

        <tbody>

          <tr v-for="v in selectedVariants" :key="v.sku">
            <td>{{ v.sku }}</td>
            <td>{{ v.stockQty }}</td>
            <td>{{ v.priceOverride }}</td>
            <td>{{ v.attributes?.color }}</td>
            <td>{{ v.attributes?.size }}</td>
          </tr>

        </tbody>

      </table>

      <button
        class="btn btn-dark btn-sm"
        @click="variantModal=false"
      >
        Đóng
      </button>

    </div>

  </div>

</template>


<script setup>

import { ref, onMounted } from "vue"

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllBrands,
  getAllCategories,
} from "@/api/admin/productApi"


const products = ref([])
const loading = ref(false)

const brands = ref([])
const categories = ref([])

const isEditing = ref(false)
const editingId = ref(null)

const variantModal = ref(false)

const selectedVariants = ref([])

const form = ref({
  name:"",
  brandId:"",
  categoryId:"",
  basePrice:0,
  description:"",
  variants:[]
})


// FETCH PRODUCTS
const fetchProducts = async () => {

  loading.value = true

  try{

    const res = await getAllProducts()

    products.value = res.data.result

  }
  catch(err){

    console.error("Fetch product error:",err)

  }
  finally{

    loading.value = false

  }

}


// FETCH BRANDS
const fetchBrands = async () => {

  try{

    const res = await getAllBrands()

    brands.value = res.data.result

  }
  catch(err){

    console.error("Fetch brands error:",err)

  }

}


// FETCH CATEGORIES
const fetchCategories = async () => {

  try{

    const res = await getAllCategories()

    categories.value = res.data.result

  }
  catch(err){

    console.error("Fetch categories error:",err)

  }

}


// SUBMIT
const submitForm = async () => {

  if(form.value.variants.length === 0){
    alert("Sản phẩm phải có ít nhất 1 variant")
    return
  }

  try{

    if(isEditing.value){

      await updateProduct(editingId.value, form.value)

    }
    else{

      await createProduct(form.value)
       alert("Tạo sản phẩm thành công")

    }

    await fetchProducts()

    resetForm()

  }
  catch(err){

    console.error("Submit error:",err)

  }

}


// VARIANT
const addVariantRow = () => {

  form.value.variants.push({
    sku:"",
    stockQty:0,
    attributes:{color:"",size:""},
    priceOverride:null,
    imageUrl:"",
    isActive:true
  })

}

const removeVariant = (index) => {

  form.value.variants.splice(index,1)

}


// EDIT
const editProduct = (p) => {

  isEditing.value = true

  editingId.value = p.id

  form.value = JSON.parse(JSON.stringify(p))

}


// DELETE
const removeProduct = async (id) => {

  if(!confirm("Bạn có chắc muốn xóa?")) return

  try{

    await deleteProduct(id)

    await fetchProducts()

  }
  catch(err){

    console.error("Delete error:",err)

  }

}


// RESET
const resetForm = () => {

  isEditing.value = false

  editingId.value = null

  form.value = {
    name:"",
    brandId:"",
    categoryId:"",
    basePrice:0,
    description:"",
    variants:[]
  }

}


// SHOW VARIANT
const showVariants = (p) => {

  selectedVariants.value = p.variants || []

  variantModal.value = true

}


onMounted(()=>{

  fetchProducts()

  fetchBrands()

  fetchCategories()

})

</script>


<style scoped>

.bg-form-green{
  background:#dcfce7;
}

.variant-box{
  background:#f9fafb;
  border:1px solid #e5e7eb;
  border-radius:6px;
}

.custom-table thead th{
  background:#d1d5db;
}

.table td{
  padding:12px 8px;
  background:#e5e7eb;
}

.modal-backdrop{
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:rgba(0,0,0,0.4);
  display:flex;
  align-items:center;
  justify-content:center;
}

.modal-box-large{
  background:white;
  padding:20px;
  width:700px;
  border-radius:8px;
}

</style>