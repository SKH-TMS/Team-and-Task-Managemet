"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import NavbarTeam from "../../NavbarTeam/page";

interface Task {
  TaskId: string;
  title: string;
  description: string;
  assignedTo: string[]; // Array of user IDs
  deadline: string; // ISO date string
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Member {
  UserId: string;
  firstname: string;
  lastname: string;
  profilepic: string;
  email: string;
}

interface CurrentUser {
  UserId: string;
  firstname: string;
  lastname: string;
  email: string;
}

export default function ProjectTasksPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state and inputs
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [gitHubUrl, setGitHubUrl] = useState("");
  const [explanation, setExplanation] = useState("");
  const fetchProjectTasks = async () => {
    try {
      const response = await fetch(
        `/api/teamData/getProjectTasks/${projectId}`,
        {
          method: "GET",
        }
      );
      const data = await response.json();
      if (data.success) {
        setTasks(data.tasks);
        setMembers(data.members);
        setCurrentUser(data.currentUser);
      } else {
        setError(data.message || "Failed to fetch tasks.");
        toast.error(data.message || "Failed to fetch tasks.");
      }
    } catch (err) {
      console.error("Error fetching project tasks:", err);
      setError("Failed to fetch project tasks. Please try again later.");
      toast.error("Failed to fetch project tasks. Please try again later.");
    }
    setLoading(false);
  };
  useEffect(() => {
    if (projectId) {
      fetchProjectTasks();
    }
  }, [projectId]);

  const handleCardClick = (task: Task) => {
    // Only allow clicking if not completed.
    if (task.status === "Completed") return;
    // For tasks that are "In Progress", ask for confirmation before opening modal.
    if (task.status === "In Progress") {
      const confirmProceed = window.confirm(
        "This Task has already been performed.This action will result in overriding the current implementation. Do you want to proceed?"
      );
      if (!confirmProceed) return;
    }
    setSelectedTask(task);
    setGitHubUrl("");
    setExplanation("");
  };

  const handleSubmitTask = async () => {
    if (!selectedTask) return;
    // If task is "In Progress", confirm again on submission
    if (selectedTask.status === "In Progress") {
      const confirmSubmit = window.confirm(
        "This Task has already been performed. Updating it will override the current implementation. Are you sure you want to update it?"
      );
      if (!confirmSubmit) return;
    }
    try {
      const response = await fetch("/api/teamData/submitTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TaskId: selectedTask.TaskId,
          gitHubUrl,
          context: explanation,
          submittedby: currentUser?.UserId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Task updated successfully!");
        setSelectedTask(null);
        // Optionally refresh tasks...
        fetchProjectTasks();
      } else {
        toast.error(data.message || "Failed to update task.");
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <NavbarTeam />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Tasks for Project {projectId}
        </h1>
        {tasks.length === 0 ? (
          <p className="text-center">No tasks assigned for this project yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tasks.map((task) => {
              // Check if currentUser exists and if the user's ID is in the task's assignedTo array.
              const isAssignedToYou =
                currentUser && task.assignedTo.includes(currentUser.UserId);

              // Set card background based on status:
              // "In Progress": blue, "Completed": green, otherwise default white.
              let cardBg = "bg-white";
              if (task.status === "In Progress") cardBg = "bg-blue-200";
              if (task.status === "Completed") cardBg = "bg-green-100";

              return (
                <div
                  key={task.TaskId}
                  className={`${cardBg} shadow-lg rounded-xl p-6 transition duration-300 ${
                    isAssignedToYou && task.status !== "Completed"
                      ? "hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer"
                      : "cursor-default"
                  }`}
                  onClick={() => isAssignedToYou && handleCardClick(task)}
                >
                  <h4 className="text-2xl font-bold text-gray-800 mb-2">
                    {task.title}
                  </h4>
                  <p className="text-black text-sm mb-3">Details</p>

                  <p className="text-gray-600 text-sm mb-3">
                    {task.description}
                  </p>
                  <p className="text-xs font-bold text-green-900 mb-1">
                    Deadline:
                  </p>
                  <p className="text-xs text-stone-950 mb-1 px-12">
                    {new Date(task.deadline).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p className="text-xs font-bold text-black mb-3">Status:</p>
                  <p className="text-xs font-semibold text-orange-400 mb-3 px-8">
                    {task.status}
                  </p>
                  <div className="mb-3">
                    <p className="font-semibold text-sm mb-1 text-gray-700">
                      Assigned To:
                    </p>
                    <ul className="list-disc list-inside text-xs text-gray-700">
                      {task.assignedTo.map((userId) => {
                        const member = members.find((m) => m.UserId === userId);
                        return (
                          <ol key={userId}>
                            {member
                              ? `${member.firstname} ${member.lastname} (${member.email})`
                              : userId}
                          </ol>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="mt-2">
                    {isAssignedToYou ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded-full">
                        Assigned to you
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
                        Not assigned to you
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Form for submitting task update */}
        {selectedTask && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                Submit Task Update for {selectedTask.title}
              </h2>
              {selectedTask.status === "In Progress" && (
                <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 text-yellow-700 rounded">
                  This Task has already been performed. You are trying to update
                  it. This action will override the current implementation.
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={gitHubUrl}
                  onChange={(e) => setGitHubUrl(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter GitHub repository URL"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Explanation
                </label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Provide your explanation..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitTask}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Upload Task
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
