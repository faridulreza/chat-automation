import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Automation from "@/models/Automation";
import { z } from "zod";
import Block, { BlockType } from "@/models/Block";

// GET all blocks under an automation
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const automationId = request.nextUrl.searchParams.get("automationId");
    const blocks = await Block.find({automationId});
    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const BlockCreationSchema = z.object({
  automationId: z.string(),
  type: z.enum(Object.values(BlockType)),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),

  isTriggerBlock: z.boolean().optional(),
});

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const body = await request.json();

    const parsedBody = BlockCreationSchema.parse(body);
    if (!parsedBody) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { automationId, type, position, isTriggerBlock } = parsedBody;

    const automation = await Automation.findById(automationId);
    if (!automation) {
      return NextResponse.json(
        { error: "Automation not found" },
        { status: 404 }
      );
    }

    const block = await Block.create({
      automationId: automation._id,
      type,
      position,
      isTriggerBlock,
      owner: session.user.id,
      connection: {},
      data: {},
    });

    return NextResponse.json(block);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
