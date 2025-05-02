import mongoose from "mongoose";

export const BlockType = {
  TelegramRecieveMessage: "TelegramRecieveMessage",
  APITrigger: "APITrigger",
  TelegramSendMessage: "TelegramSendMessage",
  AskGPT: "AskGPT",
  ConditionChecker: "ConditionChecker",
};

const BlockSchema = new mongoose.Schema(
  {
    automationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Automation",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(BlockType),
      required: true,
    },
    position:{
        x: {
            type: Number,
            required: true,
        },
        y: {
            type: Number,
            required: true,
        },
    },
    connections: {
      type: Object,
      default: {},
    },
    data: {
      type: Object,
      default: {},
    },
    isTriggerBlock: {
      type: Boolean,
      default: false,
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

const Block = 
  mongoose.models?.Block || mongoose.model("Block", BlockSchema);
export default Block;
