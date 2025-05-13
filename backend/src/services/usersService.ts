// src/services/users.service.ts
import pool from '../db/db';
import {
    GET_ALL_USERS,
    CREATE_USER,
    UPDATE_USER,
    DELETE_USER,
    GET_SUPERVISORS_BY_DEPARTMENT
} from '../queries/users.queries';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const getAllUsers = async () => {
    const result = await pool.query(GET_ALL_USERS);
    // // Debugging
    console.log(result.rows);
    return result.rows;
};

export const getSupervisorsByDepartment = async (department: string) => {
    try {
        // Query to get users who are supervisors in the specified department
        const result = await pool.query(GET_SUPERVISORS_BY_DEPARTMENT, [department]);

        if (result.rows.length === 0) {
            console.log(`No supervisors found for department: ${department}`);
        } else {
            console.log(`Fetched supervisors for department: ${department}`);
        }

        return result.rows;  // Return list of supervisors
    } catch (err) {
        console.error('Error fetching supervisors:', err);
        throw new Error('Database error while fetching supervisors');
    }
};



export const createUser = async (data: any) => {
    const plainPassword = crypto.randomBytes(8).toString('hex');
    const saltRounds = 10
    const password_hash = await bcrypt.hash(plainPassword,saltRounds)
    // // Debugging
    // console.log(password_hash);

    const { name, email, role, department_name, status } = data;
    const department_id = await pool.query(`SELECT dept_id FROM departments where name='$1'`,[department_name])
    console.log(department_id);
    const result = await pool.query(
        CREATE_USER,
        [name, email, password_hash, role, department_id, status]
    );
    return result.rows[0];
};

export const updateUser = async (id: number, data: any) => {
    const { name, email, password_hash, role, department_id, status } = data;
    const result = await pool.query(
        UPDATE_USER,
        [name, email, password_hash, role, department_id, status]
    );
    return result.rows[0];
};

export const deleteUser = async (id: number) => {
    await pool.query(DELETE_USER, [id]);
};