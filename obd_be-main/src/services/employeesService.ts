// src/services/employees.service.ts
import pool from '../db/db';
import {
    GET_ALL_EMPLOYEES,
    GET_ONBOARDING_EMPLOYEES,
    UPDATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    EMPLOYEE_INSERT_QUERY
} from '../queries/employees.queries';
import { USER_INSERT_QUERY } from '../queries/users.queries';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService'; // A function to send emails
import bcrypt from 'bcrypt';

export const getAllEmployees = async () => {
    const result = await pool.query(GET_ALL_EMPLOYEES);
    // // Debugging
    // console.log(result.rows);
    return result.rows;
};

export const getOnboardingEmployees = async () => {
    const result = await pool.query(GET_ONBOARDING_EMPLOYEES);
    return result.rows;
};

export const createEmployee = async (data: any) => {
  const client = await pool.connect();
  
  // // Debugging
  console.log("data: ",data);

  const resultDept = await client.query(`SELECT dept_id FROM departments WHERE name='${data.department_name.name}';`)
  // // Debugging
  console.log("resultDept: ",resultDept); console.log("endoo");
  const department_id = resultDept.rows[0].dept_id
  // // Debugging
  // console.log("deparID: ", department_id); 

  const resultSupervisor = await client.query(
    `
      SELECT e.emp_id 
      FROM employees e
      JOIN users u ON u.user_id = e.user_id
      WHERE u.name = $1;
    `,
    [data.supervisor_name]
  );
  // // Debugging
  // console.log("supdervisor result: ",resultSupervisor);
  const supervisor_id = resultSupervisor.rows[0].emp_id
  // // Debugging
  // console.log("supervisor_id: ", supervisor_id);

  try {
      await client.query('BEGIN'); // Start the transaction

      // Generate a secure random password
      const plainPassword = crypto.randomBytes(8).toString('hex'); // Example: "f3a9b4c1e8d2"
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

      // Insert into users table
      const userValues = [data.name, data.email, hashedPassword, data.role, department_id, data.status];
      const userResult = await client.query(USER_INSERT_QUERY, userValues);
      const userId = userResult.rows[0].user_id;

      // Insert into employees table
      const employeeValues = [userId, data.designation, data.joining_date, department_id, supervisor_id, data.document_url];
      const employeeResult = await client.query(EMPLOYEE_INSERT_QUERY, employeeValues);

      await client.query('COMMIT'); // Commit the transaction

      // // Send the generated password to the user's email
      // const emailSubject = 'Your Account Credentials';
      // const emailBody = `
      //     Hello ${data.name},

      //     Your account has been created successfully.
      //     Here are your login details:

      //     Email: ${data.email}
      //     Temporary Password: ${plainPassword}

      //     Please change your password upon first login.

      //     Regards,
      //     Your Company
      // `;
      // await sendEmail(data.email, emailSubject, emailBody);

      return { ...employeeResult.rows[0], plainPassword }; // Return password for further use if needed

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
