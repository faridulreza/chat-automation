import mongoose from "mongoose";

const TelegramAccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscribers: {
      type: [
        {
          id: {
            type: Number,
            required: true,
          },
          first_name: {
            type: String,
            required: true,
          },
          last_name: {
            type: String,
            required: true,
          },
          username: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

const TelegramAccount =
  mongoose.models.TelegramAccount ||
  mongoose.model("TelegramAccount", TelegramAccountSchema);
export default TelegramAccount;
