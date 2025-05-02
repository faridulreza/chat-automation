import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Automation from "@/models/Automation";
import TelegramAccount from "@/models/TelegramAccount";
import { getTelegramBotInfo, removeTelegramWebhook, setTelegramWebhook } from "@/lib/telegram";


// DELETE a single account by ID
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions );
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!params.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await connectDB();
    const account = await TelegramAccount.findOneAndDelete({
      _id: params.id,
      owner: session.user.id,
    });
    if (!account) {
      return NextResponse.json(
        { error: "Telegram account not found" },
        { status: 404 }
      );
    }

    await removeTelegramWebhook(account.token);
    return NextResponse.json(
      { message: "Telegram account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}