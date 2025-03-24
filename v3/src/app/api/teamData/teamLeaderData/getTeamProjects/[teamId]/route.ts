import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AssignedProjectLog from "@/models/AssignedProjectLogs";
import Project from "@/models/Project";

export async function GET(
  req: NextRequest,
  { params }: { params: { teamId: string } }
) {
  try {
    const { teamId } = params;

    // Connect to the database
    await connectToDatabase();
    // Find all AssignedProjectLogs documents for the given team
    const logs = await AssignedProjectLog.find({ teamId });

    // If no logs found, return an empty array of projects
    if (!logs || logs.length === 0) {
      return NextResponse.json({ success: true, projects: [] });
    }

    // Extract project IDs from the logs
    const projectIds = logs.map((log) => log.projectId);

    // Fetch project details for these project IDs
    const projects = await Project.find({ ProjectId: { $in: projectIds } });

    // Merge log details (e.g., deadline, tasksIds) with project details
    const projectsWithLog = projects.map((project) => {
      const log = logs.find((l) => l.projectId === project.ProjectId);
      return {
        ...project.toObject(),
        deadline: log?.deadline,
        tasksIds: log?.tasksIds || [],
      };
    });

    return NextResponse.json({ success: true, projects: projectsWithLog });
  } catch (error) {
    console.error("Error fetching team projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch team projects again." },
      { status: 500 }
    );
  }
}
