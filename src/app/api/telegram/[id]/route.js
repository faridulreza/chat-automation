//telegram webhook route
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";

export async function POST(request, { params }) {
  try {
    const body = await request.json();
    if (!body) {
      return NextResponse.json({ error: "Body is required" }, { status: 400 });
    }
    if (!params.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await connectDB();
    const automations = await Automation.find({
      _id: params.id,
      owner: session.user.id,
    });
    return NextResponse.json(automations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
