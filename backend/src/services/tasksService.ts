// src/services/tasks.service.ts
import { stat } from 'fs';
import pool from '../db/db';
import {
    GET_ALL_TASKS,
    DELETE_TASK,
    CREATE_TASK,
    UPDATE_TASK_STATUS,
    GET_EMPLOYEE_SPECIFIC_TASKS,
    GET_DEPARTMENT_TASKS,
    GET_TASK_COUNT
} from '../queries/tasks.queries';

export const getAllTasks = async () => {
    const result = await pool.query(GET_ALL_TASKS);
    // // Debugging
    // console.log("tasks: ",result.rows);
    return result.rows;
};

export const getTasksCount = async () => {
    const result = await pool.query(GET_TASK_COUNT);
    // // Debugging
    // console.log("tasks: ",result.rows);
    return result.rows[0];
};

export const getEmployeeSpecificTasks = async (id:any) => {
    try {
        const result = await pool.query(GET_EMPLOYEE_SPECIFIC_TASKS,[id]);
        // // Debugging
        // console.log("tasks: ",result.rows);
        return result.rows;
    } catch (error) {
        console.log("Error fetching employee specific tasks: ", error);
        return error
    }
};
export const getDepartmentTasks = async (id:any) => {
    try {
        const result = await pool.query(GET_DEPARTMENT_TASKS,[id]);
        // // Debugging
        console.log("tasks: ",result.rows);
        return result.rows;
    } catch (error) {
        console.log("Error fetching employee specific tasks: ", error);
        return error
    }
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

export async function editTask(id: string, data: any) {
    // // Debugging
    // console.log(id);
    const { employee_name, assigned_by_name, department_name, task_name, description, status, due_date } = data;

    if (!employee_name || !assigned_by_name || !department_name || !task_name || !description || !status || !due_date) {
        return "Fill out all fields!";
    }

    // Get assigned_by user_id
    const assigned_by_id_result = await pool.query(
        `SELECT user_id FROM users WHERE name = $1`,
        [assigned_by_name]
    );
    const assigned_by = assigned_by_id_result.rows[0]?.user_id;

    // Get department_id
    const department_id_result = await pool.query(
        `SELECT dept_id FROM departments WHERE name = $1`,
        [department_name]
    );
    const department_id = department_id_result.rows[0]?.dept_id;

    const emp_idResult = await pool.query(`
        SELECT e.emp_id 
        FROM employees e
        JOIN users u ON e.user_id = u.user_id
        WHERE u.name = '${employee_name}'    
    `)
    const emp_id = emp_idResult.rows[0].emp_id

    // Build update object
    const taskData = {
        assigned_by,
        department_id,
        task_name,
        description,
        status,
        due_date
    };
    // // Debugging
    // console.log("taskData: ", taskData);

    const columns = Object.keys(taskData).map((key, index) => `${key} = $${index + 1}`);
    const values = Object.values(taskData);
    // // Debugging
    // console.log("columns: ", columns);
    // console.log("values: ", values);

    const query = `
        UPDATE onboarding_tasks
        SET ${columns.join(', ')}
        WHERE task_id = $${values.length + 1}
        RETURNING *;
    `;
    // // Debugging
    // console.log(query);

    let result;
    try {
        result = await pool.query(query, [...values, id]);
        // // Debugging
        console.log("result of the query: ", result.rows);
    } catch (error) {
        console.error("Error updating task:", error);
        return "Failed to update task.";
    }

    return result.rows[0];
}

