// src/services/tasks.service.ts
import pool from '../db/db';
import {
    GET_ALL_TASKS,
    DELETE_TASK,
    CREATE_TASK,
    UPDATE_TASK_STATUS
} from '../queries/tasks.queries';

export const getAllTasks = async () => {
    const result = await pool.query(GET_ALL_TASKS);
    // // Debugging
    console.log(result.rows);
    return result.rows;
};

export async function deleteTask(id: string) {
    await pool.query(DELETE_TASK, [id])
}

export async function createTask(data: any){
    await pool.query(CREATE_TASK, [data.emp_id, data.assigned_by, data.department_id, data.task_name, data.description, data.status, data.due_date])
}

export async function updateTaskStatus(id: string) {
    await pool.query(UPDATE_TASK_STATUS, [id])
}
