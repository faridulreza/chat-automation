import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Block, { BlockType } from "@/models/Block";

//POST
export async function POST(request, {params}) {
  try {
    await connectDB();
    const { id } = params;
    console.log("ID", id);
    const block = await Block.findById(id);
    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }
    if (block.type !== BlockType.APITrigger) {
      return NextResponse.json(
        { error: "Block is not an API trigger" },
        { status: 400 }
      );
    }

    const automation_id = block.automationId.toString();
    const start_block_id = block._id.toString();
    const inital_state = await request.json();

    await fetch(process.env.TASK_SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        initial_state: inital_state,
        automation_id: automation_id,
        start_block_id: start_block_id,
      }),
    });

    return NextResponse.json({ message: "okay" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
