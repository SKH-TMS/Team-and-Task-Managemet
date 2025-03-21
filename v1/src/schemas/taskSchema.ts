import { z } from "zod";

// Schema for task creation
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Task title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Task description is required")
    .max(500, "Task description must be less than 500 characters"),
  // Expecting assignedTo to be an array of strings matching "User-<number>"
  assignedTo: z
    .array(
      z
        .string()
        .regex(
          /^User-(\d+)$/,
          "Each assigned user ID must be in the format 'User-<number>'"
        )
        .optional()
    )
    .optional(),
  // Assuming the assignedTo follows the "User-<number>" pattern
  status: z
    .enum(["Pending", "In Progress", "Completed"], {
      errorMap: () => ({
        message:
          "Invalid status. Allowed values are: Pending, In Progress, Completed.",
      }),
    })
    .default("Pending"), // Default status is "Pending"
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format for deadline",
    })
    .transform((val) => new Date(val)), // Transform string into Date
});

// Schema for task updates
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Task title must be less than 100 characters")
    .optional(), // Make this optional for partial updates
  description: z
    .string()
    .min(1, "Task description is required")
    .max(500, "Task description must be less than 500 characters")
    .optional(), // Make this optional for partial updates
  status: z
    .enum(["Pending", "In Progress", "Completed"], {
      errorMap: () => ({
        message:
          "Invalid status. Allowed values are: Pending, In Progress, Completed.",
      }),
    })
    .optional(), // Make this optional for partial updates
  deadline: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format for deadline",
    })
    .transform((val) => new Date(val))
    .optional(), // Make this optional for partial updates
});
