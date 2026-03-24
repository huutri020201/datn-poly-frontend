<template>
  <div class="admin-wrapper">
    <div class="container-fluid p-0">
      <div class="row g-0 min-vh-100">
        <aside class="col-md-3 col-lg-2 admin-sidebar border-end shadow-sm">
          <div class="sidebar-header p-4">
            <h4 class="mb-0 fw-bold text-primary">ADMIN PANEL</h4>
          </div>

          <nav class="sidebar-nav p-3">
            <router-link to="/admin/users" class="nav-item">
              <i class="bi bi-people me-2"></i> Users
            </router-link>
            <router-link to="/admin/products" class="nav-item">
              <i class="bi bi-box-seam me-2"></i> Products
            </router-link>
            <router-link to="/admin/orders" class="nav-item">
              <i class="bi bi-cart me-2"></i> Orders
            </router-link>
            <router-link to="/admin/bookings" class="nav-item">
              <i class="bi bi-calendar-check me-2"></i> Bookings
            </router-link>
            <router-link to="/admin/pitches" class="nav-item">
              <i class="bi bi-dribbble me-2"></i> Pitches
            </router-link>
            <router-link to="/admin/promotions" class="nav-item">
              <i class="bi bi-megaphone me-2"></i> Promotions
            </router-link>
            <router-link to="/admin/feedback" class="nav-item">
              <i class="bi bi-chat-left-dots me-2"></i> Feedbacks
            </router-link>

            <hr class="my-4" />

            <router-link to="/" class="nav-item text-muted">
              <i class="bi bi-house me-2"></i> Quay lại trang chủ
            </router-link>
          </nav>
        </aside>

        <main class="col-md-9 col-lg-10 admin-main bg-light">
          <header
            class="admin-topbar p-3 bg-white border-bottom d-flex justify-content-end align-items-center"
          >
            <div class="user-info small fw-bold ">Xin chào, Admin 👋</div>
          </header>

          <div class="admin-content p-4">
            <router-view />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tổng thể wrapper */
.admin-wrapper {
  overflow-x: hidden;
}

/* Sidebar Styles */
.admin-sidebar {
  background-color: #ffffff;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-item {
  color: #4b5563;
  text-decoration: none;
  font-size: 15px;
  padding: 12px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: #38bdf8;
}

/* Trạng thái Active cho Sidebar dọc */
.router-link-active {
  background-color: #e0f2fe;
  color: #0284c7 !important;
  font-weight: 600;
}

/* Nội dung chính */
.admin-main {
  min-height: 100vh;
}

.admin-topbar {
  height: 60px;
}

/* Responsive fix */
@media (max-width: 768px) {
  .admin-sidebar {
    height: auto;
    position: relative;
  }
}
</style>