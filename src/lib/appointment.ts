import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const appointmentInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  service: z.string().min(1, "Service is required"),
  date: z.string().min(1, "Date is required"),
  slot: z.string().min(1, "Time slot is required"),
  message: z.string().optional(),
});

export const createAppointmentFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) => appointmentInputSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      // Dynamic imports to keep Node/Mongoose libraries out of the client bundle
      const { connectToDatabase } = await import("./db");
      const { Appointment } = await import("@/models/Appointment");

      // Connect to Database
      await connectToDatabase();

      // Create new appointment entry
      const appointment = new Appointment({
        name: data.name,
        phone: data.phone,
        service: data.service,
        date: data.date,
        slot: data.slot,
        message: data.message,
      });

      await appointment.save();

      return {
        success: true,
        id: appointment._id.toString(),
        message: "Appointment saved successfully to database.",
      };
    } catch (error: any) {
      console.error("Database Save Error:", error);
      throw new Error(error.message || "Failed to save appointment to database.");
    }
  });

export const getAppointmentsFn = createServerFn({
  method: "GET",
})
  .handler(async () => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Appointment } = await import("@/models/Appointment");

      await connectToDatabase();

      const appointments = await Appointment.find().sort({ createdAt: -1 });

      return appointments.map((a) => ({
        id: a._id.toString(),
        name: a.name,
        phone: a.phone,
        service: a.service,
        date: a.date,
        slot: a.slot,
        message: a.message || "",
        status: a.status || "pending",
        createdAt: a.createdAt.toISOString(),
      }));
    } catch (error: any) {
      console.error("Database Retrieve Error (Appointments):", error);
      throw new Error(error.message || "Failed to retrieve appointments.");
    }
  });

export const deleteAppointmentFn = createServerFn({
  method: "POST",
})
  .inputValidator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Appointment } = await import("@/models/Appointment");

      await connectToDatabase();

      await Appointment.findByIdAndDelete(id);

      return {
        success: true,
        message: "Appointment deleted successfully.",
      };
    } catch (error: any) {
      console.error("Database Delete Error (Appointment):", error);
      throw new Error(error.message || "Failed to delete appointment.");
    }
  });

const updateAppointmentStatusInputSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
});

export const updateAppointmentStatusFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) => updateAppointmentStatusInputSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Appointment } = await import("@/models/Appointment");

      await connectToDatabase();

      await Appointment.findByIdAndUpdate(data.id, { status: data.status });

      return {
        success: true,
        message: `Appointment status updated to ${data.status}.`,
      };
    } catch (error: any) {
      console.error("Database Update Error (Appointment):", error);
      throw new Error(error.message || "Failed to update appointment status.");
    }
  });
