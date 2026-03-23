<template>
  <div class="profile-page container my-5">
    <h4 class="mb-4"><i class="bi bi-person-circle"></i> Hồ sơ cá nhân</h4>

    <div class="row">
      <div class="col-md-4">
        <div class="card p-4 text-center shadow-sm">
          <img :src="form.avatarUrl || defaultAvatar" class="avatar mb-3" />
          <input type="file" class="form-control mb-2" @change="handleAvatar"/>
          <h5>{{ form.fullName || "User" }}</h5>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card p-4 shadow-sm">
          <h5 class="mb-3"><i class="bi bi-person-bounding-box"></i> Thông tin cá nhân</h5>

          <div class="mb-3">
            <label>Họ tên</label>
            <input v-model="form.fullName" class="form-control"/>
          </div>

          <div class="mb-3">
            <label>Giới tính</label>
            <select v-model="form.gender" class="form-control">
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
            </select>
          </div>

          <div class="mb-3">
            <label>Ngày sinh</label>
            <input type="date" v-model="form.dob" class="form-control"/>
          </div>
        </div>

        <div class="card p-4 shadow-sm mt-4">
          <h5 class="mb-3"><i class="bi bi-geo-alt"></i> Địa chỉ</h5>

          <div class="mb-3">
            <label>Số điện thoại</label>
            <input v-model="address.phoneNumber" placeholder="Nhập SĐT" class="form-control"/>
          </div>

          <div class="mb-3">
            <label>Địa chỉ chi tiết</label>
            <input v-model="address.detailAddress" placeholder="Nhập địa chỉ chi tiết" class="form-control"/>
          </div>
        </div>

        <div class="text-end mt-4">
          <button class="btn btn-save px-4 py-2" @click="saveAllChanges">
             Lưu thay đổi
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  name: "Profile",

  data() {
    return {
      form: {
        fullName: "",
        gender: "MALE",
        dob: "",
        avatarUrl: ""
      },

      address: {
        id: null,
        receiverName: "",
        phoneNumber: "",
        detailAddress: ""
      },

      defaultAvatar: "https://i.pravatar.cc/150"
    };
  },

  mounted() {
    this.fetchProfile();
    this.fetchAddress();
  },

  methods: {
    getAuthHeaders() {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    getUserId() {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");

      if (!token) return null;

      try {
        const decoded = jwtDecode(token);
        return decoded.sub; 
      } catch (e) {
        return null;
      }
    },

    async fetchProfile() {
      try {
        const userId = this.getUserId();
        if (!userId) {
          this.$router.push("/login");
          return;
        }

        const res = await axios.get(`http://localhost:8080/profile/me`, { headers: this.getAuthHeaders() });
        const data = res.data.data || res.data; 

        this.form.fullName = data?.fullName || "";
        this.form.gender = data?.gender || "MALE";
        this.form.avatarUrl = data?.avatarUrl || "";
        if (data?.dob) {
          this.form.dob = data.dob.substring(0, 10);
        } else {
          this.form.dob = "";
        }

      } catch (e) {
        console.error("Lỗi load profile:", e);
      }
    },
    async fetchAddress() {
      try {
        const userId = this.getUserId();
        if (!userId) return;

        const res = await axios.get(`http://localhost:8080/addresses/profile/${userId}`, { headers: this.getAuthHeaders() });
        const addressData = res.data.data || res.data;

        if (Array.isArray(addressData) && addressData.length > 0) {
          this.address = { ...this.address, ...addressData[0] };
        } else if (addressData && typeof addressData === 'object' && Object.keys(addressData).length > 0) {
          this.address = { ...this.address, ...addressData };
        }

      } catch (e) {
        console.error("Lỗi load address", e);
      }
    },

    handleAvatar(e) {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        this.form.avatarUrl = event.target.result; 
      };
      reader.readAsDataURL(file); 
    },

    updateProfile() {
      const userId = this.getUserId();
      return axios.put(
        `http://localhost:8080/profile/${userId}`,
        this.form,
        { headers: this.getAuthHeaders() }
      );
    },

    saveAddress() {
      const userId = this.getUserId();
      const payload = {
        ...this.address,
        profileId: userId 
      };

      if (this.address.id) {
        return axios.put(
          `http://localhost:8080/addresses/${this.address.id}`,
          payload,
          { headers: this.getAuthHeaders() }
        );
      } else {
        return axios.post(
          `http://localhost:8080/addresses`,
          payload,
          { headers: this.getAuthHeaders() }
        );
      }
    },
    async saveAllChanges() {
      try {
        const userId = this.getUserId();
        if (!userId) {
          alert("Bạn chưa đăng nhập!");
          return;
        }

        await Promise.all([
          this.updateProfile(),
          this.saveAddress()
        ]);

        alert("Lưu thay đổi thành công!");
        this.fetchProfile();
        this.fetchAddress();

      } catch (e) {
        alert("Có lỗi xảy ra trong quá trình lưu. Vui lòng thử lại!");
        console.error("Lỗi khi saveAllChanges:", e);
      }
    }
  }
};
</script>

<style scoped>
.profile-page {
  min-height: 80vh;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.card {
  border-radius: 10px;
}

.btn-save {
  background-color: #ee4d2d;
  color: white;
  border: none;
  padding: 10px 20px;
}
</style>