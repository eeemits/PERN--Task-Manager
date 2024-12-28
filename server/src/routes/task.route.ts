import { Router } from "express";
import { poolDB } from "../db";
import type { CreateTask } from "../models/create-task.model";
import { isArrayNotEmpty } from "../utils";
const router = Router();

router.get("/getTasks", async (req, res) => {
  try {
    const { status, title, sortBy = "created_at", order = "asc", limit = 10, offset = 0 } = req.query;

    let query = "SELECT * FROM tasks WHERE 1=1"; // Use WHERE 1=1 for easy query construction

    if (status) {
      query += ` AND status = '${status}'`; // Filter by status
    }
    if (title) {
      query += ` AND title ILIKE '%${title}%'`; // Case-insensitive search for title
    }

    const validSortColumns = ["id", "title", "status", "created_at"];
    if (validSortColumns.includes(sortBy as string)) {
      query += ` ORDER BY ${sortBy} ${typeof order === "string" ? order.toUpperCase() : "ASC"}`;
    } else {
      query += ` ORDER BY created_at ${typeof order === "string" ? order.toUpperCase() : "ASC"}`; // Default sort by created_at
    }

    // Apply pagination (limit and offset)
    const paginationQuery = `${query} LIMIT ${limit} OFFSET ${offset}`;

    // Get the tasks based on the pagination
    const tasks = await poolDB.query(paginationQuery);

    // Get the total count of tasks matching the filters (without pagination)
    const countQuery = `SELECT COUNT(*) FROM tasks WHERE 1=1`;
    let countQueryWithFilters = countQuery;

    if (status) {
      countQueryWithFilters += ` AND status = '${status}'`;
    }
    if (title) {
      countQueryWithFilters += ` AND title ILIKE '%${title}%'`;
    }

    const countResult = await poolDB.query(countQueryWithFilters);
    const totalCount = parseInt(countResult.rows[0].count, 10);

    res.status(200).send({
      status: true,
      message: "Tasks retrieved successfully",
      rows: tasks.rows,
      totalCount: totalCount // Send total count as part of the response
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({
      status: false,
      message: "An error occurred while retrieving tasks."
    });
  }
});

router.post("/createTask", async (req, res) => {
  try {
    const { title, description, status } = req.body as CreateTask;
    const newTask = await poolDB.query(`INSERT INTO tasks (title, description, status) VALUES ($1, $2, $3) RETURNING *`, [
      title,
      description,
      status
    ]);

    res.status(201).json({
      status: true,
      message: "Task created successfully",
      rows: isArrayNotEmpty(newTask.rows) ? newTask.rows : []
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      message: error.message || "An unexpected error occurred"
    });
  }
});

router.get("/getTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await poolDB.query(`SELECT * FROM tasks WHERE id = ${id}`);

    res.send({
      status: true,
      message: `Task with ${id} retrieved successfully`,
      rows: isArrayNotEmpty(task.rows) ? task.rows[0] : null
    });
  } catch (error: any) {
    console.error(error.message);
  }
});

router.put("/updateTask/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const query = `
        UPDATE tasks 
        SET title = $1, description = $2, status = $3 
        WHERE id = $4
        RETURNING *;
      `;
    const values = [title, description, status, id];

    const updatedTask = await poolDB.query(query, values);

    if (updatedTask.rowCount! > 0) {
      res.json({
        message: "Task updated successfully",
        status: true,
        updatedTask: updatedTask.rows[0] // Send the updated task data as response
      });
    } else {
      res.status(404).json({
        message: "Task not found",
        status: false
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({
      status: false,
      message: "An error occurred while updating the task."
    });
  }
});

router.delete("/deleteTask/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const taskPool = await poolDB.query(`DELETE FROM tasks WHERE id = $1`, [id]);

    await poolDB.query(`SELECT setval(pg_get_serial_sequence('tasks', 'id'), COALESCE(MAX(id), 0)) FROM tasks`);

    res.json({
      message: taskPool.rowCount !== 0 ? "Task deleted successfully" : "Task not found",
      status: taskPool.rowCount !== 0
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).send({
      status: false,
      message: "An error occurred while deleting the task."
    });
  }
});

export const taskRouter = router;
