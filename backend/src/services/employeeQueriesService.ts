// src/services/employeeQueries.service.ts
import pool from '../db/db';
import {
    GET_ALL_EMPLOYEE_QUERIES,
    INSERT_NEW_QUERY
} from '../queries/employeQueries.queries';

export const getAllEmployeeQueries = async() => {
    const result = await pool.query(GET_ALL_EMPLOYEE_QUERIES);
    // // Debugging
    // console.log(result.rows);
    return result.rows;
};

export const insertNewQuery = async(data: any) => {
    try {
        console.log("data recieved in query service: ",data);
        const result = await pool.query(INSERT_NEW_QUERY, [data.emp_id, data.query_text]);
        // Debugging
        console.log(result.rows);
        return result.rows;
    } catch (error) {
        console.log(error);
    }
};