export type AppointmentStatus = "booked" | "cancelled" | "done";

export interface Appointment {
  id: number;
  user_id: string | null;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
}
