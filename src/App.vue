<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100 bg-light-yellow">
    <Header />
    <main class="flex-grow-1">
      <router-view /> 
    </main>
    <Footer /> 
  </div>
</template>

<style>
.bg-light-yellow {
  background-color: #fdfdf0; /* Màu nền vàng nhạt của toàn trang */
}
</style>