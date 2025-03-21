import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import { ITask } from "@/models/Task";
import AssignedProjectLog from "@/models/AssignedProjectLogs";
import { createTaskSchema } from "@/schemas/taskSchema";
import Team from "@/models/Team";

export async function POST(req: NextRequest) {
  let taskid;
  try {
    const { projectId, teamId, assignedTo, title, description, deadline } =
      await req.json();
    // Validate incoming data
    if (!projectId || !teamId || !title || !description || !deadline) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }
    // Validate the request data using the project schema

    // Validate request data using Zod schema
    const validatedData = createTaskSchema.safeParse({
      projectId,
      teamId,
      assignedTo,
      title,
      description,
      deadline,
    });
    if (!validatedData.success) {
      // If validation fails, return an error with the validation message
      const errorMessages = validatedData.error.errors
        .map((err) => err.message)
        .join(", ");
      return NextResponse.json(
        { success: false, message: errorMessages },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    if (assignedTo.length === 0) {
      const team = await Team.findOne({ teamId });
      const members = team.members;
      // Create a new task
      const newTask: ITask = new Task({
        title,
        description,
        assignedTo: members,
        projectId,
        teamId,
        deadline,
        status: "Pending", // Default status
      });

      // Save the new task to the database
      await newTask.save();
      taskid = newTask.TaskId; // DEFIEND FOR error handeling
      // Update AssignedProjectLogs to include the new task ID
      const assignedProjectLog = await AssignedProjectLog.findOne({
        projectId,
        teamId,
      });

      if (!assignedProjectLog) {
        Task.deleteOne({ TaskId: newTask.TaskId });
        return NextResponse.json(
          { success: false, message: "Assigned project log not found." },
          { status: 404 }
        );
      }
      console.log(assignedProjectLog);
      let taskids: string[] = assignedProjectLog.tasksIds;
      taskids.push(newTask.TaskId);
      // Add the new task ID to the TaskIds array
      assignedProjectLog.TaskIds = taskids;

      // Save the updated AssignedProjectLog
      await assignedProjectLog.save();
      return NextResponse.json({
        success: true,
        message: "Task assigned successfully!",
        task: newTask,
      });
    }
    // Check if the assigned user exists
    const assignedUser = await User.findOne({ UserId: assignedTo });
    if (!assignedUser) {
      return NextResponse.json(
        { success: false, message: "Assigned user not found." },
        { status: 404 }
      );
    }
    // Create a new task
    const newTask: ITask = new Task({
      title,
      description,
      assignedTo,
      projectId,
      teamId,
      deadline,
      status: "Pending", // Default status
    });

    // Save the new task to the database
    await newTask.save();
    taskid = newTask.TaskId; // DEFIEND FOR error handeling
    // Update AssignedProjectLogs to include the new task ID
    const assignedProjectLog = await AssignedProjectLog.findOne({
      projectId,
      teamId,
    });

    if (!assignedProjectLog) {
      Task.deleteOne({ TaskId: newTask.TaskId });
      return NextResponse.json(
        { success: false, message: "Assigned project log not found." },
        { status: 404 }
      );
    }
    console.log(assignedProjectLog);
    let taskids: string[] = assignedProjectLog.tasksIds;
    taskids.push(newTask.TaskId);
    // Add the new task ID to the TaskIds array
    assignedProjectLog.TaskIds = taskids;

    // Save the updated AssignedProjectLog
    await assignedProjectLog.save();
    return NextResponse.json({
      success: true,
      message: "Task assigned successfully!",
      task: newTask,
    });
  } catch (error) {
    Task.deleteOne({ TaskId: taskid });
    console.error("Error assigning task:", error);
    return NextResponse.json(
      { success: false, message: "Failed to assign task." },
      { status: 500 }
    );
  }
}
