import api from "./api";

export interface MemberInfo {
  id: number;
  name: string;
  email: string;
}

export interface Family {
  family_id: number;
  name: string;
  created_by: number;
  members: MemberInfo[];
}

export const familyService = {
  async createFamily(name: string): Promise<{ id: number; name: string; created_by: number }> {
    const res = await api.post("/families", null, {
      params: { name },
    });
    return res.data;
  },

  async addMember(email: string, familyId: number): Promise<{ message: string }> {
    const res = await api.post("/families/add-member", { email, family_id: familyId });
    return res.data;
  },

  async removeMember(userId: number, familyId: number): Promise<{ message: string }> {
    const res = await api.delete(`/families/members/${userId}`, {
      params: { family_id: familyId },
    });
    return res.data;
  },

  async getFamilies(): Promise<Family[]> {
    const res = await api.get("/families");
    return res.data;
  },
};
