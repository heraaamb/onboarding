// src/services/employeeQueries.service.ts
import pool from '../db/db';
import {
    GET_ALL_EMPLOYEE_QUERIES
} from '../queries/employeQueries.queries';
import { USER_INSERT_QUERY } from '../queries/users.queries';

export const getAllEmployeeQueries = async() => {
    const result = await pool.query(GET_ALL_EMPLOYEE_QUERIES);
    // // Debugging
    // console.log(result.rows);
    return result.rows;
};