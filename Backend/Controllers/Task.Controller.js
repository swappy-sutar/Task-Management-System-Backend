import { Task } from "../Models/Task.Model.js";
import { User } from "../Models/User.Model.js";
import { mailSender } from "../Utils/MailSender.js";

const addTask = async (req, res) => {
  try {
    const { title, description, dueDate, employeeId } = req.body;

    if (!title || !description || !dueDate || !employeeId) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }
    
    const employee = await User.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee with the given employeeId does not exist.",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      status: "In Progress",
      dueDate,
      assignTo: employee._id,
    });

    employee.tasks.push(newTask._id);
    await employee.save();

    const populatedTask = await Task.findById(newTask._id).populate({
      path: "assignTo",
      select: "firstname lastname email role",
    });

    const email = employee.email.toLowerCase();
    const mailRes = await mailSender(
      email,
      "You have been assigned a new task - Task-Management",
      `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
          <h2 style="color: #4CAF50;">New Task Assigned</h2>
          <p>Dear ${employee.firstname},</p>
          <p>You have been assigned a new task from "${req.user.firstname} ${req.user.lastname}" in the Task Management System:</p>
          <ul>
            <li><strong>Title:</strong> ${title}</li>
            <li><strong>Description:</strong> ${description}</li>
            <li><strong>Status:</strong> In Progress</li>
            <li><strong>Due Date:</strong> ${dueDate}</li>
          </ul>
          <p>Please log in to the system to view and manage your tasks.</p>
          <p>Best Regards,<br>Task-Management Team</p>
        </div>
      `
    );

    const emailMessage = mailRes?.accepted?.includes(email.toLowerCase())
      ? "Task created successfully, and email sent to the employee."
      : "Task created successfully, but email could not be sent.";

    return res.status(201).json({
      success: true,
      message: emailMessage,
      data: populatedTask,
    });
  } catch (error) {
    console.error("Failed to add task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const getTasksById = async (req, res) => {
  try {
    const { id } = req.params;
    const getTask = await Task.findOne({ _id: id }).populate({
      path: "assignTo",
      select: "firstname lastname email role",
    });

    if (!getTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      data: getTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const getTask = await Task.find().populate({
      path: "assignTo",
      select: "firstname lastname email role",
    });

    return res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      data: getTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const getTaskStatus = async (req, res) => {
  try {
    const getTask = await Task.find().select("title status");

    return res.status(200).json({
      success: true,
      message: "All tasks and status fetched successfully",
      data: getTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id, title, description, status, dueDate } = req.body;

    if (!id || (!title && !description && !status && !dueDate)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a task ID and at least one field to update.",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (dueDate) task.dueDate = dueDate;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (error) {
    console.error("Failed to update task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required.",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const employee = await User.findById(task.assignTo);

    if (employee) {
      employee.tasks = employee.tasks.filter(
        (taskId) => taskId.toString() !== id
      );
      await employee.save();
    }

    await Task.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.error("Failed to delete task:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

export { addTask,updateTask, deleteTask, getTasksById, getTasks, getTaskStatus,  };
