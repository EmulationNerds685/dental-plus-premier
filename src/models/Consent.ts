import mongoose from "mongoose";

export interface IConsent extends mongoose.Document {
  name: string;
  phone: string;
  history?: string;
  selectedProcedures: string[];
  signatureImage: string; // base64 string data URI
  certified: boolean;
  lang: "en" | "hi";
  createdAt: Date;
  updatedAt: Date;
}

const ConsentSchema = new mongoose.Schema<IConsent>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    history: { type: String, trim: true },
    selectedProcedures: { type: [String], required: true },
    signatureImage: { type: String, required: true },
    certified: { type: Boolean, required: true, default: false },
    lang: { type: String, required: true, enum: ["en", "hi"], default: "en" },
  },
  { timestamps: true }
);

export const Consent = mongoose.models.Consent || mongoose.model<IConsent>("Consent", ConsentSchema);
