import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Automation from "@/models/Automation";
import { z } from "zod";
import Block from "@/models/Block";
import mongoose from "mongoose";


export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const {source, target, sourceHandle, targetHandle} = await request.json();

    const block = await Block.findById(new mongoose.Types.ObjectId(source));
    if (!block) {
      console.error("body: ", request.body);
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    const updatedBlock = await Block.updateOne(
      { _id: source },
      {
        $set: {
          [`connections.${sourceHandle}`]: target,
        },
      }
    );

    await Block.updateOne({
      _id: target,
    }, {
      $set: {
        [`connections.parent`]: source,
      },
    })
    return NextResponse.json(updatedBlock, { status: 200 });
  } catch (error) {
    console.error("body: ", request.body);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
