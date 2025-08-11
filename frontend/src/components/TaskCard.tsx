import { useState } from "react";
import { motion } from "framer-motion";
import type { Task } from "../types";
import { formatDate, getStatusColor, getPriorityColor } from "../lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { updateTask, deleteTask } from "../services/api";
import TaskForm from "./TaskForm";

interface TaskCardProps {
  task: Task;
  onUpdate: () => void;
}

const TaskCard = ({ task, onUpdate }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleStatusToggle = async () => {
    try {
      await updateTask(task.id, {
        status: task.status === "completed" ? "pending" : "completed",
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        title: task.title,
      });
      onUpdate();
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onUpdate();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (isEditing) {
    return (
      <TaskForm
        task={task}
        onSubmit={() => {
          setIsEditing(false);
          onUpdate();
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      <Card className="w-full shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{task.title}</CardTitle>
            <div className="flex gap-2">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Badge className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {task.description && (
            <p className="text-muted-foreground mb-4">{task.description}</p>
          )}
          {task.due_date && (
            <div className="text-sm text-muted-foreground">
              Due: {formatDate(task.due_date)}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            Created: {formatDate(task.created_at)}
          </div>
          <div className="flex gap-2">
            {task.status === "pending" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant={"default"}
                  onClick={handleStatusToggle}
                >
                  Complete
                </Button>
              </>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the task.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
