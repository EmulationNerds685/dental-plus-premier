import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const queryInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const createQueryFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) => queryInputSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Query } = await import("@/models/Query");

      await connectToDatabase();

      const query = new Query({
        name: data.name,
        phone: data.phone,
        email: data.email,
        subject: data.subject,
        message: data.message,
        status: "pending",
      });

      await query.save();

      return {
        success: true,
        id: query._id.toString(),
        message: "Query saved successfully to database.",
      };
    } catch (error: any) {
      console.error("Database Save Error (Query):", error);
      throw new Error(error.message || "Failed to save contact query.");
    }
  });

export const getQueriesFn = createServerFn({
  method: "GET",
})
  .handler(async () => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Query } = await import("@/models/Query");

      await connectToDatabase();

      const queries = await Query.find().sort({ createdAt: -1 });

      return queries.map((q) => ({
        id: q._id.toString(),
        name: q.name,
        phone: q.phone,
        email: q.email || "",
        subject: q.subject,
        message: q.message,
        status: q.status || "pending",
        createdAt: q.createdAt.toISOString(),
      }));
    } catch (error: any) {
      console.error("Database Retrieve Error (Queries):", error);
      throw new Error(error.message || "Failed to retrieve queries.");
    }
  });

export const deleteQueryFn = createServerFn({
  method: "POST",
})
  .inputValidator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Query } = await import("@/models/Query");

      await connectToDatabase();

      await Query.findByIdAndDelete(id);

      return {
        success: true,
        message: "Query deleted successfully.",
      };
    } catch (error: any) {
      console.error("Database Delete Error (Query):", error);
      throw new Error(error.message || "Failed to delete query.");
    }
  });

const updateStatusInputSchema = z.object({
  id: z.string(),
  status: z.enum(["pending", "resolved"]),
});

export const updateQueryStatusFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) => updateStatusInputSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Query } = await import("@/models/Query");

      await connectToDatabase();

      await Query.findByIdAndUpdate(data.id, { status: data.status });

      return {
        success: true,
        message: `Query status updated to ${data.status}.`,
      };
    } catch (error: any) {
      console.error("Database Update Error (Query):", error);
      throw new Error(error.message || "Failed to update query status.");
    }
  });
