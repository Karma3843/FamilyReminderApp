import api from "./api";

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export const authService = {
  async register(name: string, email: string, password: string): Promise<User> {
    const res = await api.post("/users", null, {
      params: { name, email, password },
    });
    return res.data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    const res = await api.post("/login", formData);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get("/me");
    return res.data;
  },
};
