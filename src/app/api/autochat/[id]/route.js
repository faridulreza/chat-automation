import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Block from "@/models/Block";


//POST
export async function POST(request, params) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = params;
    const block = await Block.findById(id);
    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    

    return NextResponse.json({message:"okay"}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
