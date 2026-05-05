"use client";

import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const queryClient = useQueryClient();

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((res) => res.json()),
  });

  const addTodo = useMutation({
    mutationFn: async () => {
      await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
    },
    onSuccess: () => {
      setTitle("");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const toggleTodo = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/todos/${id}`, { method: "PATCH" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #ffe4ec, #ffd6e0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          width: "400px",
          boxShadow: "0 10px 30px rgba(255, 182, 193, 0.4)",
        }}
      >
        <h1 style={{ textAlign: "center", color: "#ff4d88" }}>
          🌸 Todo 🌸
        </h1>

        {/* Input */}
        <div style={{ display: "flex", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Add something..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ffc0cb",
              outline: "none",
            }}
          />
          <button
            onClick={() => addTodo.mutate()}
            style={{
              marginLeft: "10px",
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: "#ff80aa",
              color: "white",
              cursor: "pointer",
            }}
          >
            Add 🎀
          </button>
        </div>

        {/* List */}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                background: "#fff0f5",
                padding: "10px",
                borderRadius: "10px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  textDecoration: todo.completed
                    ? "line-through"
                    : "none",
                  color: todo.completed ? "#aaa" : "#333",
                }}
              >
                {todo.title}
              </span>

              <div>
                <button
                  onClick={() => toggleTodo.mutate(todo.id)}
                  style={{
                    marginRight: "8px",
                    background: "#ffb6c1",
                    border: "none",
                    padding: "5px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {todo.completed ? "Undo" : "Done"}
                </button>

                <button
                  onClick={() => deleteTodo.mutate(todo.id)}
                  style={{
                    background: "#ff4d6d",
                    color: "white",
                    border: "none",
                    padding: "5px 8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Delete 🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}