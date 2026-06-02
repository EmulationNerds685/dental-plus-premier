import mongoose from "mongoose";

export interface IQuery extends mongoose.Document {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: "pending" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const QuerySchema = new mongoose.Schema<IQuery>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ["pending", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

export const Query = mongoose.models.Query || mongoose.model<IQuery>("Query", QuerySchema);
