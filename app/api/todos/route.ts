import { prisma } from "@/lib/db";

// ➕ CREATE
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ✅ Validation
    if (!body.title || body.title.trim() === "") {
      return Response.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        title: body.title.trim(),
      },
    });

    return Response.json(todo, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}

// 📖 READ
export async function GET() {
  try {
    const todos = await prisma.todo.findMany();

    // ✅ ALWAYS return array
    return Response.json(todos);
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}