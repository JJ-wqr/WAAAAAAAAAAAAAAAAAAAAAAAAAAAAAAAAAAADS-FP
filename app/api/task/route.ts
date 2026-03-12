
import { NextRequest, NextResponse } from "next/server";
import { tasks, getNextId } from "@/lib/taskStore";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.title || body.title.trim() === "") {
    return NextResponse.json(
      { error: "Missing Field: title is required" },
      { status: 400 }
    );
  }
  const newTask = {
    id: getNextId(),
    title: body.title.trim(),
    description: body.description?.trim() ?? "",
  };
  tasks.push(newTask);
  return NextResponse.json(newTask, { status: 201 });
}
