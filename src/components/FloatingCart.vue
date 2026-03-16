<template>
  <div class="floating-cart" @click="$router.push('/cart')">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
    </svg>

    <span :key="cartCount" class="cart-badge" v-if="cartCount > 0">
      {{ cartCount }}
    </span>
  </div>
</template>

<script setup>
import { cartCount } from '@/cartState'
</script>

<style scoped>
.floating-cart {
  position: fixed;
  bottom: 80px; 
  right: 20px;  
  width: 55px;
  height: 55px;
  background-color: #fff;
  border: 2px solid #1f6b41; 
  color: #1f6b41;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 9999; 
  transition: all 0.3s ease;
}

.floating-cart:hover {
  background-color: #1f6b41;
  color: #fff;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #fff;
  animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
  0% { transform: scale(0.5); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>