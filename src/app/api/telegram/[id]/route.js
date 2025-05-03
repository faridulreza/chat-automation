//telegram webhook route
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TelegramAccount from "@/models/TelegramAccount";
import { sendTelegramMessage } from "@/lib/telegram";
import Block, { BlockType } from "@/models/Block";
import Automation from "@/models/Automation";

const getUniqueSubscribers = (subscribers) => {
  const exists = new Set();
  const uniqueSubscribers = [];

  for (const subscriber of subscribers) {
    if (!exists.has(subscriber.id)) {
      exists.add(subscriber.id);
      uniqueSubscribers.push(subscriber);
    }
  }

  return uniqueSubscribers;
};
export async function POST(request, { params }) {
  const body = await request.json();
  try {
    if (!params.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await connectDB();
    const account = await TelegramAccount.findOne({
      _id: params.id,
    });

    if (!account) {
      return NextResponse.json(
        { error: "Telegram account not found" },
        { status: 200 }
      );
    }

    const text = body.message.text;
    if (!text) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    if (text === "/subscribe") {
      const subscribers = getUniqueSubscribers([
        ...account.subscribers,
        body.message.chat,
      ]);

      await TelegramAccount.findOneAndUpdate(
        { _id: params.id },
        { subscribers }
      );
      await sendTelegramMessage(
        account.token,
        body.message.chat.id,
        "You have successfully subscribed to the bot."
      );
      return NextResponse.json(
        { message: "Subscribed successfully" },
        { status: 200 }
      );
    }

    const block = await Block.findOne({
      type: BlockType.TelegramRecieveMessage,
      "data.accountId": params.id,
    });

    if (!block) {
      await sendTelegramMessage(
        account.token,
        body.chat.id,
        "No automation found for this message."
      );

      return NextResponse.json(
        { error: "No automation found" },
        { status: 200 }
      );
    }

    const automation = await Automation.findById(block.data.automationId, {
      _id: 1,
      status: 1,
    });
    if (!automation || automation.status !== "active") {
      return NextResponse.json(
        { error: "Automation is not active" },
        { status: 200 }
      );
    }

    await fetch(process.env.TASK_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initial_state: {
          text: text,
          message_type: "text",
        },
        automation_id: block.data.automationId.toString(),
        start_block_id: block._id.toString(),
      }),
    });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.log("body", JSON.stringify(body));
    console.error("Error in Telegram webhook route:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
