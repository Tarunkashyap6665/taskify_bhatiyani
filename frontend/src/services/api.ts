import type { Task, Analytics } from "../types";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }
  return response.json();
};

export const fetchTaskById = async (id: number): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch task with id ${id}`);
  }
  return response.json();
};

export const createTask = async (
  task: Omit<Task, "id" | "created_at">
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...task,
      created_at: new Date().toISOString(),
    }),
  });
  if (!response.ok) {
    throw new Error("Failed to create task");
  }
  return response.json();
};

export const updateTask = async (
  id: number,
  task: Partial<Task>
): Promise<Task> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error(`Failed to update task with id ${id}`);
  }
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete task with id ${id}`);
  }
};

export const fetchAnalytics = async (): Promise<Analytics> => {
  const response = await fetch(`${API_URL}/analytics`);
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return response.json();
};
