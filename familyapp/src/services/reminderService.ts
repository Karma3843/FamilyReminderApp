import api from "./api";

export interface Reminder {
  id: number;
  title: string;
  description: string;
  reminder_date: string;
  reminder_time: string;
  repeat: string;
  priority: string;
  is_sent: boolean;
  created_at: string | null;
  created_by?: { id: number; name: string };
  tagged_users?: { id: number; name: string }[];
}

export interface CreateReminderData {
  title: string;
  description: string;
  reminder_date: string;
  reminder_time: string;
  repeat: string;
  priority: string;
  family_id: number;
  tagged_users: number[];
}

export interface UpdateReminderData extends CreateReminderData {}

export const reminderService = {
  async getAll(): Promise<Reminder[]> {
    const res = await api.get("/families/reminders");
    return res.data;
  },

  async getById(id: number): Promise<Reminder> {
    const res = await api.get(`/reminders/${id}`);
    return res.data;
  },

  async create(data: CreateReminderData): Promise<{ message: string; reminder_id: number }> {
    const res = await api.post("/reminders", data);
    return res.data;
  },

  async update(id: number, data: UpdateReminderData): Promise<{ message: string }> {
    const res = await api.put(`/reminders/${id}`, data);
    return res.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const res = await api.delete(`/reminders/${id}`);
    return res.data;
  },

  async getUserTagged(userId: number): Promise<Reminder[]> {
    const res = await api.get(`/users/${userId}/tagged-reminders`);
    return res.data;
  },
};
