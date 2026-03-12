import api from "@/api/axios";

// REGISTER
export const registerByEmail = (data) =>{
  const requestBody = {
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword
  };
    return api.post("/auth/register-email", requestBody);
};


export const verifyEmail = (token) =>
  api.get(`/auth/verify-email/${token}`);
;
export const registerByPhone = (data) =>{
  const requestBody = {
    phone: data.phone,
    password: data.password,
    confirmPassword: data.confirmPassword
  };
  return api.post("/auth/register-phone", requestBody);
};
export const verifyPhone = (data) =>
  api.post("/auth/verify-phone", data);

export const resendOtp = (data) =>
  api.post("/auth/resend-otp", data);

// LOGIN
export const login = (data) => {
  const requestBody = {
    loginIdentifier: data.username,
    password: data.password,
  };

  return api.post("/auth/login", requestBody);
};

export const refreshToken = (data) =>
  api.post("/auth/refresh-token", data);

export const logout = (data) =>
  api.post("/auth/logout", data);

// RESET PASSWORD
export const findAccount = (data) =>
  api.post("/auth/find-account", data);

export const sendOtpReset = (data) =>
  api.post("/auth/send-otp-reset", data);

export const verifyOtpReset = (data) =>
  api.post("/auth/verify-otp-reset", data);

export const resetPassword = (data) =>
  api.post("/auth/reset-password", data);