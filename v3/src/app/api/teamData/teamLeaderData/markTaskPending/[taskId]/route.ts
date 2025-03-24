import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";
import { getToken, GetUserId } from "@/utils/token";

export async function POST(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const { taskId } = params;

    // Connect to the database
    await connectToDatabase();

    // Retrieve the current user's token information
    const token = await getToken(req);

    // Fetch the task by TaskId
    const task = await Task.findOne({ TaskId: taskId });
    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found.",
        },
        { status: 404 }
      );
    }

    // Update the task status to "Pending"
    task.status = "Pending";
    task.gitHubUrl = "";
    task.context = "";
    task.submittedby = "";
    task.updatedAt = new Date();

    await task.save(); // Save the task with the updated status

    return NextResponse.json({
      success: true,
      message: "Task marked as Pending successfully.",
    });
  } catch (error) {
    console.error("Error marking task as Pending:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark task as Pending.",
      },
      { status: 500 }
    );
  }
}
