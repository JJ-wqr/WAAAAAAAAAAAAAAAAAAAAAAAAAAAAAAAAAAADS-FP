import { NextRequest, NextResponse } from "next/server";
import { tasks } from "@/lib/taskStore";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json(
    { id: task.id, title: task.title, description: task.description },
    { status: 200 }
  );
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  const body = await req.json();
  if (body.title !== undefined) tasks[index].title = body.title;
  if (body.description !== undefined) tasks[index].description = body.description;
  return NextResponse.json(tasks[index], { status: 200 });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  tasks.splice(index, 1);
  return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
}