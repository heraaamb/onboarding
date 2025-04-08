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
import {generatePassword, hashPassword, sendmail} from '../utils/utils'

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
  console.log("employee data while creating: ",data);
  console.log(data.role);

  if(data.role === 'Admin'){
    const resultDept = await client.query(`SELECT dept_id FROM departments WHERE name='${data.department_name}';`)
    // // Debugging
    console.log("resultDept: ",resultDept); console.log("endoo");
    const department_id = resultDept.rows[0].dept_id
    // // Debugging
    console.log("deparID: ", department_id); 
 
    const plainPassword = await generatePassword();
    const hashedPassword = await hashPassword( plainPassword);

    const userValues = [data.employee_name, data.email, hashedPassword, data.role, department_id, data.status];
    const userResult = await client.query(USER_INSERT_QUERY, userValues);

      // // send mail (send password) 
      // await sendmail(data.name, data.email, plainPassword)
    return plainPassword;
  }

  const resultDept = await client.query(`SELECT dept_id FROM departments WHERE name='${data.department_name}';`)
  // // Debugging
  console.log("resultDeptId: ",resultDept); console.log("endoo");
  const department_id = resultDept.rows[0].dept_id
  // // Debugging
  console.log("deparID: ", department_id); 

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

      const plainPassword = await generatePassword()
      const hashedPassword = await hashPassword( plainPassword)

      // Insert into users table
      const userValues = [data.employee_name, data.email, hashedPassword, data.role, department_id, data.status];
      const userResult = await client.query(USER_INSERT_QUERY, userValues);
      const userId = userResult.rows[0].user_id;

      // Insert into employees table
      const employeeValues = [userId, data.designation, data.joining_date, department_id, supervisor_id, data.document_url];
      const employeeResult = await client.query(EMPLOYEE_INSERT_QUERY, employeeValues);

      await client.query('COMMIT'); // Commit the transaction

      // // send mail (pasword) to the employee send password 
      // await sendmail(data.name, data.email, plainPassword)

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
  // // Debugging
  console.log("Data received:", data);

  const {
    employee_name,
    email,
    department_name,
    joining_date,
    role,
    status,
    designation,
    supervisor_name,
  } = data;

  try {
    // Get user_id from employee ID
    const userRes = await pool.query(`SELECT user_id FROM employees WHERE emp_id = $1`, [id]);
    if (userRes.rows.length === 0) throw new Error("Employee not found");
    const user_id = userRes.rows[0].user_id;

    // Update employee name
    if (employee_name !== undefined) {
      await pool.query(`UPDATE users SET name = $1 WHERE user_id = $2`, [employee_name, user_id]);
    }

    // Update email
    if (email !== undefined) {
      await pool.query(`UPDATE users SET email = $1 WHERE user_id = $2`, [email, user_id]);
    }

    // Update department
    if (department_name !== undefined) {
      const deptRes = await pool.query(`SELECT dept_id FROM departments WHERE name = $1`, [department_name]);
      if (deptRes.rows.length === 0) throw new Error("Department not found");
      const department_id = deptRes.rows[0].dept_id;
      // // Debugging
      console.log("DepatmentId: ", department_id);
      await pool.query(`UPDATE users SET department_id = $1 WHERE user_id = $2`, [department_id, user_id]);
    }

    // Update joining date
    if (joining_date !== undefined) {
      await pool.query(`UPDATE employees SET joining_date = $1 WHERE user_id = $2`, [joining_date, user_id]);
    }

    // Update role
    if (role !== undefined) {
      await pool.query(`UPDATE users SET role = $1 WHERE user_id = $2`, [role, user_id]);
    }

    // Update status
    if (status !== undefined) {
      await pool.query(`UPDATE users SET status = $1 WHERE user_id = $2`, [status, user_id]);
    }

    // Update designation
    if (designation !== undefined) {
      await pool.query(`UPDATE employees SET designation = $1 WHERE user_id = $2`, [designation, user_id]);
    }

    // Update supervisor
    if (supervisor_name !== undefined) {
      const supervisorRes = await pool.query(
        `SELECT e.emp_id 
        FROM employees e
        JOIN users u ON u.user_id = e.user_id
        WHERE u.name = $1`, [supervisor_name]
      );
      if (supervisorRes.rows.length === 0) throw new Error("Supervisor not found");
      const supervisor_id = supervisorRes.rows[0].emp_id;
      await pool.query(`UPDATE employees SET supervisor_id = $1 WHERE user_id = $2`, [supervisor_id, user_id]);
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
  

export const deleteEmployee = async (id: number) => {
    await pool.query(DELETE_EMPLOYEE, [id]);
};
