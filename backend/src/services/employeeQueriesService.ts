// src/services/employeeQueries.service.ts
import pool from '../db/db';
import {
    GET_ALL_EMPLOYEE_QUERIES,
    INSERT_NEW_QUERY,
    GET_ALL_OPEN_EMPLOYEE_QUERIES,
    REPLY_TO_QUERY,
    GET_QUERIES_BY_EMPID
} from '../queries/employeQueries.queries';

export const getAllEmployeeQueries = async() => {
    const result = await pool.query(GET_ALL_EMPLOYEE_QUERIES);
    // // Debugging
    // console.log(result.rows);
    return result.rows;
};

export const getAllOpenEmployeeQueries = async() => {
    const result = await pool.query(GET_ALL_OPEN_EMPLOYEE_QUERIES);
    // // Debugging
    // console.log(result.rows);
    return result.rows;
};
export const getQueriesByEmpID = async(emp_id:any) => {
    const result = await pool.query(GET_QUERIES_BY_EMPID,[emp_id]);
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

export const replyToHelpRequest = async(data: any) => {
    try {
        console.log("data recieved in query service: ",data);

        const result = pool.query(REPLY_TO_QUERY, [data.response, data.query_id])
        return result;
    } catch (error) {
        console.log(error);
    }
}