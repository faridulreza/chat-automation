import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Automation from "@/models/Automation";
import { z } from "zod";
import Block from "@/models/Block";

// DELETE a block
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const blockId = params.id;

    const block = await Block.findById(blockId);
    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    await Block.deleteOne({ _id: blockId, owner: session.user.id });

    return NextResponse.json(
      { message: "Block deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const BlockUpdateSchema = z
  .object({
    position: z.object({
      x: z.number(),
      y: z.number(),
    }),
    connections: z.record(z.any()).optional(),
    data: z.record(z.any()).optional(),
  })
  .partial();
// PATCH a block

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const blockId = params.id;

    const block = await Block.findById(blockId);
    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    const body = await request.json();

    const parsedBody = BlockUpdateSchema.parse(body);
    if (!parsedBody) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updatedBlock = await Block.updateOne(
      {
        _id: blockId,
        owner: session.user.id,
      },
      parsedBody,
      { new: true }
    );

    return NextResponse.json(updatedBlock, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
