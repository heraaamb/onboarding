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
    // console.log("tasks: ",result.rows);
    return result.rows;
};

export async function deleteTask(id: string) { 
    await pool.query(DELETE_TASK, [id])
}

export async function createTask(data: any){
    // // Debugging
    // console.log("Create task data: ",data);
    await pool.query(CREATE_TASK, [data.employee_name, data.assigned_by_name, data.department_name, data.task_name, data.description, data.due_date])
}

export async function updateTaskStatus(id: string) {
    await pool.query(UPDATE_TASK_STATUS, [id])
}
