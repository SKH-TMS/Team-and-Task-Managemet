import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";
import AssignedProjectLog from "@/models/AssignedProjectLogs";

export async function POST(req: NextRequest) {
  try {
    const { taskIds } = await req.json();

    if (!taskIds || taskIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No tasks selected for deletion." },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Step 1: Delete tasks from the Task collection
    const deletedTasks = await Task.deleteMany({ TaskId: { $in: taskIds } });

    // Step 2: Update the AssignedProjectLog collection
    await AssignedProjectLog.updateMany(
      { tasksIds: { $in: taskIds } },
      { $pull: { tasksIds: { $in: taskIds } } } // Remove the taskIds from tasksIds array
    );

    if (deletedTasks.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No tasks were deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `${deletedTasks.deletedCount} task(s) deleted successfully.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting selected tasks:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete tasks." },
      { status: 500 }
    );
  }
}
