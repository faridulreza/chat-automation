import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Automation from "@/models/Automation";
import TelegramAccount from "@/models/TelegramAccount";
import { getTelegramBotInfo, setTelegramWebhook } from "@/lib/telegram";

// GET all accounts
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions );
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const accounts = await TelegramAccount.find({ owner: session.user.id });
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new account
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions );
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await request.json();
    if (!body.token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const botInfo = await getTelegramBotInfo(body.token);

    if (!botInfo) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const botExists = await TelegramAccount.findOne({
      id: botInfo.id,
      owner: session.user.id,
    });

    if (botExists) {
      return NextResponse.json(
        { error: "Telegram account already exists" },
        { status: 400 }
      );
    }


    const acc = await TelegramAccount.create({
      name: botInfo.first_name,
      id: botInfo.id,
      username: botInfo.username,
      token: body.token,
      owner: session.user.id,
    });

    await setTelegramWebhook(body.token, acc._id.toString());
    return NextResponse.json(
      {
        message: "Telegram account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
