// models/Task.ts
import mongoose, { Schema, model, models, Document } from "mongoose";

export interface ITask extends Document {
  TaskId: string;
  title: string;
  description: string;
  assignedTo: string[];
  deadline: Date;
  status: string; // E.g., "Pending", "In Progress", "Completed"
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    TaskId: { type: String, unique: true },
    title: {
      type: String,
      required: [true, "Task title is required"],
    },
    description: {
      type: String,
      required: [true, "Task description is required"],
    },
    assignedTo: {
      type: [String],
      required: [true, "Assigned user ID is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    deadline: { type: Date, required: [true, "Due date is required"] },
  },
  { timestamps: true }
);

// Pre-save hook to auto-generate TaskId
taskSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  // Find the last task document and extract its TaskId number
  const lastTask = await mongoose
    .model<ITask>("Task")
    .findOne({}, { TaskId: 1 })
    .sort({ TaskId: -1 });

  let newTaskId = "Task-1"; // Default for the first task

  if (lastTask && lastTask.TaskId) {
    const match = lastTask.TaskId.match(/(\d+)$/); // Extract numeric part
    const maxNumber = match ? parseInt(match[0], 10) : 0;
    newTaskId = `Task-${maxNumber + 1}`;
  }

  this.TaskId = newTaskId;
  next();
});

const Task = models?.Task || model<ITask>("Task", taskSchema, "tasks");

export default Task;
