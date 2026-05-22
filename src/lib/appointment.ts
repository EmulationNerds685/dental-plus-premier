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
