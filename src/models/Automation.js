import mongoose from "mongoose";

const AutomationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Automation = 
  mongoose.models.Automation ||
  mongoose.model("Automation", AutomationSchema);
export default Automation;
