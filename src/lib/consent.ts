import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const consentInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  history: z.string().optional(),
  selectedProcedures: z.array(z.string()).min(1, "At least one procedure must be selected"),
  signatureImage: z.string().min(1, "Signature is required"),
  certified: z.boolean(),
  lang: z.enum(["en", "hi"]),
});

export const createConsentFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: unknown) => consentInputSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Consent } = await import("@/models/Consent");

      await connectToDatabase();

      const consent = new Consent({
        name: data.name,
        phone: data.phone,
        history: data.history,
        selectedProcedures: data.selectedProcedures,
        signatureImage: data.signatureImage,
        certified: data.certified,
        lang: data.lang,
      });

      await consent.save();

      return {
        success: true,
        id: consent._id.toString(),
        message: "Consent form saved successfully to database.",
      };
    } catch (error: any) {
      console.error("Database Save Error (Consent):", error);
      throw new Error(error.message || "Failed to save consent form to database.");
    }
  });

export const getConsentsFn = createServerFn({
  method: "GET",
})
  .handler(async () => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Consent } = await import("@/models/Consent");

      await connectToDatabase();

      const consents = await Consent.find().sort({ createdAt: -1 });

      return consents.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        phone: c.phone,
        history: c.history || "",
        selectedProcedures: c.selectedProcedures,
        signatureImage: c.signatureImage,
        certified: c.certified,
        lang: c.lang || "en",
        createdAt: c.createdAt.toISOString(),
      }));
    } catch (error: any) {
      console.error("Database Retrieve Error (Consents):", error);
      throw new Error(error.message || "Failed to retrieve consent forms.");
    }
  });

export const deleteConsentFn = createServerFn({
  method: "POST",
})
  .inputValidator((id: unknown) => z.string().parse(id))
  .handler(async ({ data: id }) => {
    try {
      const { connectToDatabase } = await import("./db");
      const { Consent } = await import("@/models/Consent");

      await connectToDatabase();

      await Consent.findByIdAndDelete(id);

      return {
        success: true,
        message: "Consent form deleted successfully.",
      };
    } catch (error: any) {
      console.error("Database Delete Error (Consent):", error);
      throw new Error(error.message || "Failed to delete consent form.");
    }
  });
