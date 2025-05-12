// src/services/tasks.service.ts
import { stat } from 'fs';
import pool from '../db/db';
import {
    GET_DEPARTMENT_COUNT
} from '../queries/departments.queries';
import { NumericAxisOptions } from 'aws-sdk/clients/quicksight';


export const getDepartmentsCount = async () => {
    const result = await pool.query(GET_DEPARTMENT_COUNT);
    // // Debugging
    // console.log("tasks: ",result.rows);
    return result.rows[0];
};
