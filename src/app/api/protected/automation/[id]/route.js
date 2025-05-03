import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Automation from "@/models/Automation";
import { z } from "zod";
import Block from "@/models/Block";

// GET a single automation by ID
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions );
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id) {
      return NextResponse.json(
        { error: "Automation ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const automations = await Automation.find({
      _id: id,
      owner: session.user.id,
    });
    return NextResponse.json(automations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const automationUpdateSchema = z
  .object({
    name: z.string().nonempty(),
    status: z.enum(["active", "inactive"]),
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

// PUT update a single automation by ID
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions );
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id) {
      return NextResponse.json(
        { error: "Automation ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsedBody = automationUpdateSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.errors },
        { status: 400 }
      );
    }

    await connectDB();

    const automation = await Automation.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!automation) {
      return NextResponse.json(
        { error: "Automation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(automation);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// DELETE a single automation by ID
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions );
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params.id) {
      return NextResponse.json(
        { error: "Automation ID is required" },
        { status: 400 }
      );
    }

    await connectDB();
    const automation = await Automation.findByIdAndDelete(params.id);
    if (!automation) {
      return NextResponse.json(
        { error: "Automation not found" },
        { status: 404 }
      );
    }
    await Block.deleteMany({ automationId: params.id });
    return NextResponse.json({ message: "Automation deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

