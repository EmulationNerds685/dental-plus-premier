import mongoose from "mongoose";

export interface IAppointment extends mongoose.Document {
  name: string;
  phone: string;
  service: string;
  date: string;
  slot: string;
  message?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}

const AppointmentSchema = new mongoose.Schema<IAppointment>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    message: { type: String, trim: true },
    status: { type: String, required: true, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export const Appointment = mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);
