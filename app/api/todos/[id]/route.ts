import { prisma } from "@/lib/db";

// ✏️ UPDATE (toggle)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await prisma.todo.findUnique({
      where: { id },
    });

    // ✅ Handle not found
    if (!existing) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: {
        completed: !existing.completed,
      },
    });

    return Response.json(updated);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

// ❌ DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const existing = await prisma.todo.findUnique({
      where: { id },
    });

    // ✅ Handle not found
    if (!existing) {
      return Response.json({ error: "Todo not found" }, { status: 404 });
    }

    await prisma.todo.delete({
      where: { id },
    });

    return Response.json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}