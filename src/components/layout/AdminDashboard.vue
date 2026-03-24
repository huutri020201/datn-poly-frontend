<template>
  <div class="admin-layout">

    <!-- 🔹 TOP NAVBAR -->
    <header class="admin-header">
      <div class="header-left">
        <h4 class="mb-0">Admin Panel</h4>
      </div>

      <nav class="header-right">
        <router-link to="/admin/users" class="nav-item">
          Users
        </router-link>
        <router-link to="/admin/products" class="nav-item">
          Products
        </router-link>
        <router-link to="/admin/orders" class="nav-item">
          Orders
        </router-link>
        <router-link to="/admin/bookings" class="nav-item">
          Bookings
        </router-link>
        <router-link to="/admin/pitches" class="nav-item">
          Pitches
        </router-link>
        <router-link to="/admin/promotions" class="nav-item">
          Promotions
        </router-link>
        <router-link to="/admin/feedback" class="nav-item">
          Feedbacks
        </router-link>
      </nav>
    </header>

    <!-- 🔹 CONTENT -->
    <main class="admin-content">
      <router-view />
    </main>

  </div>
</template>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #111;
  color: white;
  padding: 15px 30px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 14px;
  transition: 0.2s;
}

.nav-item:hover {
  color: #38bdf8;
}

.router-link-active {
  font-weight: bold;
  border-bottom: 2px solid #38bdf8;
}

.admin-content {
  padding: 30px;
}
</style>