// src/services/employees.service.ts
import pool from '../db/db';
import {
    GET_ALL_EMPLOYEES,
    GET_ONBOARDING_EMPLOYEES,
    CREATE_EMPLOYEE,
    UPDATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    EMPLOYEE_INSERT_QUERY
} from '../queries/employees.queries';
import { USER_INSERT_QUERY } from '../queries/users.queries';

export const getAllEmployees = async () => {
    const result = await pool.query(GET_ALL_EMPLOYEES);
    console.log(result.rows);
    return result.rows;
};

export const getOnboardingEmployees = async () => {
    const result = await pool.query(GET_ONBOARDING_EMPLOYEES);
    return result.rows;
};

// export const createEmployee = async (data: any) => {
//     const { user_id, designation, joining_date, department_id, supervisor_id, document_url } = data;
//     const result = await pool.query(
//         CREATE_EMPLOYEE,
//         [user_id, designation, joining_date, department_id, supervisor_id, document_url]
//     );
//     return result.rows[0];
// };

export const createEmployee = async (data: any) => {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN'); // Start the transaction

      const userValues = [data.name, data.email, data.password_hash, data.role, data.department_id, data.status];
      const userResult = await client.query(USER_INSERT_QUERY, userValues);
      const userId = userResult.rows[0].user_id;

      const employeeValues = [userId, data.designation, data.joining_date, data.department_id, data.supervisor_id, data.document_url];
      const employeeResult = await client.query(EMPLOYEE_INSERT_QUERY, employeeValues);
  
      await client.query('COMMIT'); // Commit the transaction
      return employeeResult.rows[0];
  
    } catch (error) {
      await client.query('ROLLBACK'); // Rollback in case of error
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      client.release(); // Release the client
    }
};

export const updateEmployee = async (id: number, data: any) => {
    const { designation, joining_date, department_id, supervisor_id, document_url } = data;
  
    const employeeDetails = {
      designation,
      joining_date,
      department_id,
      supervisor_id,
      document_url,
    };
  
    // Extract both field names and values
    const filteredEntries = Object.entries(employeeDetails).filter(([_, value]) => value !== undefined);
  
    if (filteredEntries.length === 0) {
      throw new Error('No fields to update');
    }
  
    const employee_update_Details = filteredEntries.map(([_, value]) => value);
    const employeeFields = filteredEntries.map(([key, value]) => 
        `${key} = $${employee_update_Details.indexOf(value) + 1}`
      );
      
  
    // Build query
    const query = `
      UPDATE employees
      SET ${employeeFields.join(', ')}
      WHERE emp_id = $${employee_update_Details.length + 1}
      RETURNING *;
    `;
  
    try {
      const result = await pool.query(query, [...employee_update_Details, id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error('Failed to update employee');
    }
  };
  

export const deleteEmployee = async (id: number) => {
    await pool.query(DELETE_EMPLOYEE, [id]);
};
