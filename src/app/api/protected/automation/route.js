import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Automation from "@/models/Automation";

// GET all automations
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions );
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const automations = await Automation.find({ owner: session.user.id });
    return NextResponse.json(automations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST a new automation
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await request.json();
    console.log(session.user);
    const automation = await Automation.create({
      name: body.name,
      status: "active",
      owner: session.user.id,
    });
    return NextResponse.json(automation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

