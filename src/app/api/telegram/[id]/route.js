//telegram webhook route
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TelegramAccount from "@/models/TelegramAccount";
import { sendTelegramMessage } from "@/lib/telegram";
import { Block } from "@mui/icons-material";
import { BlockType } from "@/models/Block";

export async function POST(request, { params }) {
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

    const body = await request.json();
    const text = body.message.text;
    if (!text) {
      return NextResponse.json(
        { error: "Message text is required" },
        { status: 400 }
      );
    }

    if (text === "/subscribe") {
      await TelegramAccount.findOneAndUpdate(
        { _id: params.id },
        { $addToSet: { subscribers: body.message.chat } }
      );
      await sendTelegramMessage(
        account.token,
        body.chat.id,
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
    })

    if(!block){
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

    await fetch(process.env.TASK_SERVER_URL,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initial_state:{
          text: text,
          message_type: "text",
        },
        automation_id: block.data.automationId.toString(),
        start_block_id: block._id.toString(),
      }),
    })

    return NextResponse.json({ok: true}, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
