// src/app/api/teamData/submitTask/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";
import { performTaskSchema } from "@/schemas/taskSchema";
import { getToken, GetUserRole } from "@/utils/token";

export async function POST(req: NextRequest) {
  try {
    const { TaskId, gitHubUrl, context, submittedby } = await req.json();

    // Validate incoming data
    if (!TaskId || !gitHubUrl || !submittedby || !context) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }
    const token = await getToken(req);
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. No token provided." },
        { status: 401 }
      );
    }

    const userrole = GetUserRole(token);
    let isverified = false;
    if (userrole && userrole.includes("TeamMember")) {
      isverified = true;
    }
    if (!isverified) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not a TeamMember.",
        },
        { status: 401 }
      );
    }

    // Validate request data using Zod schema
    const validatedData = performTaskSchema.safeParse({
      TaskId,
      gitHubUrl,
      submittedby,
      context,
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
    // Update the task with the new GitHub URL and context (explanation)
    const updatedTask = await Task.findOneAndUpdate(
      { TaskId },
      { gitHubUrl, submittedby, context, status: "In Progress" },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.error("Error submitting task:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit task." },
      { status: 500 }
    );
  }
}
