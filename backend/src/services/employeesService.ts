// src/services/employees.service.ts
import pool from '../db/db';
import {
    GET_ALL_EMPLOYEES,
    GET_ONBOARDING_EMPLOYEES,
    UPDATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    EMPLOYEE_INSERT_QUERY,
    GET_EMPLOYEES_BY_DEPT_ID,
    GET_EMPLOYEE_BY_ID,
    GET_NUMBER_OF_EMPLOYEES,
} from '../queries/employees.queries';
import { DELETE_TASK_EMPID } from '../queries/tasks.queries';
import {DELETE_USER} from '../queries/users.queries'
import { USER_INSERT_QUERY } from '../queries/users.queries';
import crypto from 'crypto';
// import { sendEmail } from '../services/emailService'; // A function to send emails
import bcrypt from 'bcrypt';
import {generatePassword, hashPassword, sendmail} from '../utils/utils'

export const getAllEmployees = async () => {
  const result = await pool.query(GET_ALL_EMPLOYEES);
  // // Debugging
  // console.log(result.rows);
  return result.rows;
};

export const getEmployeeById = async (user_id:any) => {
  try {
    const result = await pool.query(GET_EMPLOYEE_BY_ID,[user_id]);
    // // Debugging
    // console.log("result: ",result.rows);
    return result.rows[0];
  } catch (error) {
    console.log(error);
  }
};

export const getOnboardingEmployees = async () => {
  const result = await pool.query(GET_ONBOARDING_EMPLOYEES);
  return result.rows;
};

export const createEmployee = async (data: any) => {
  const client = await pool.connect();
  
  // // Debugging
  console.log("employee data while creating: ",data);
  // console.log('role: ',data.role);

  if (data.role === 'Admin' || data.role === 'Dept_User'){
    const resultDept = await client.query(`SELECT dept_id FROM departments WHERE name='${data.department_name}';`)
    // // Debugging
    // console.log("resultDept: ",resultDept); 
    const department_id = resultDept.rows[0].dept_id
    // // Debugging
    // console.log("deparID: ", department_id); 
 
    const plainPassword = await generatePassword();
    const hashedPassword = await hashPassword( plainPassword);

    const userValues = [data.employee_name, data.email, hashedPassword, data.role, department_id, data.status];
    const userResult = await client.query(USER_INSERT_QUERY, userValues);

    // send mail (send password) 
    // await sendmail(data.name, data.email, plainPassword)

    return plainPassword;
  }
  else{
    try {
      await client.query('BEGIN');
  
      // 1. Get department ID
      const deptResult = await client.query(
        `SELECT dept_id FROM departments WHERE name = $1`,
        [data.department_name]
      );
  
      if (deptResult.rowCount === 0) {
        throw new Error(`Department not found: ${data.department_name}`);
      }
  
      const department_id = deptResult.rows[0].dept_id;
  
      // 2. Generate and hash password
      const plainPassword = await generatePassword();
      const hashedPassword = await hashPassword(plainPassword);
  
      // 3. Insert into users table
      const userValues = [
        data.employee_name,
        data.email,
        hashedPassword,
        data.role,
        department_id,
        data.status
      ];
      const userResult = await client.query(USER_INSERT_QUERY, userValues);
      const user_id = userResult.rows[0].user_id;
  
      // 4. Prepare employee insertion fields and values
      const employeeFields = ['user_id', 'designation', 'joining_date', 'department_id'];
      const employeeValues: any[] = [user_id, data.designation, data.joining_date, department_id];
  
      // 5. Handle optional supervisor
      if (data.supervisor_name?.trim()) {
        const supervisorResult = await client.query(
          `
          SELECT e.emp_id
          FROM employees e
          JOIN users u ON u.user_id = e.user_id
          WHERE u.name = $1;
          `,
          [data.supervisor_name.trim()]
        );
  
        if (supervisorResult.rowCount === 0) {
          throw new Error(`Supervisor not found: ${data.supervisor_name}`);
        }
  
        const supervisor_id = supervisorResult.rows[0].emp_id;
        employeeFields.push('supervisor_id');
        employeeValues.push(supervisor_id);
      }
  
      // 6. Handle optional document URL
      if (data.document_url?.trim()) {
        employeeFields.push('document_url');
        employeeValues.push(data.document_url.trim());
      }
  
      const placeholders = employeeValues.map((_, idx) => `$${idx + 1}`).join(', ');
      const employeeQuery = `
        INSERT INTO employees (${employeeFields.join(', ')})
        VALUES (${placeholders})
        RETURNING *;
      `;
  
      const employeeResult = await client.query(employeeQuery, employeeValues);
  
      await client.query('COMMIT');
  
      // Optionally send the plain password
      await sendmail(data.employee_name, data.email, plainPassword);
  
      return {
        ...employeeResult.rows[0],
        plainPassword
      };
  
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error in createEmployee:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}



export const updateEmployee = async (id: number, data: any) => {
  const { designation, joining_date, department_name, supervisor_name, document_url, email,  role, status, employee_name} = data;

  const departmentResult = await pool.query(`SELECT dept_id FROM departments WHERE name = '${department_name}'`)
  const department_id = departmentResult.rows[0].dept_id

  const userIdresult = await pool.query(`SELECT user_id FROM employees WHERE emp_id=${id}`)
  const user_id = userIdresult.rows[0].user_id

  const employeeDetails: Record<string, any> = {
    designation,
    joining_date,
    department_id
  };
  

  if (supervisor_name?.trim()) {
    const supervisor_result = await pool.query(
      `SELECT e.emp_id
       FROM employees e
       JOIN users u ON e.user_id = u.user_id
       WHERE name = $1`,
      [supervisor_name]
    );
  
    if (supervisor_result.rows.length > 0) {
      employeeDetails.supervisor_id = supervisor_result.rows[0].emp_id;
    }
  }

  const userDetails = {
    name: employee_name,
    email,
    role,
    department_id,
    status
  }

  console.log("====",userDetails);

  const employee_update_Details = Object.values(employeeDetails)
  const user_update_Details = Object.values(userDetails)
  // // Debugging upatae details
  console.log("employee_update_Details", employee_update_Details);
  console.log("user_update_Details", user_update_Details);
  
  
  const employeeFieldstemp = Object.keys(employeeDetails)
  const employeeFields = employeeFieldstemp
  .map((field, index) => `${field}=$${index + 1}`)
  .join(', ');

  const userFieldstemp = Object.keys(userDetails)
  const userFields = userFieldstemp
  .map((field, index) => `${field}=$${index + 1}`)
  .join(', ');

  // // Debugging update fields
  console.log("employeeFields: ", employeeFields);
  console.log("userFields: ", userFields);

   // employee query
  const employeeQuery = `
    UPDATE employees
    SET ${employeeFields}
    WHERE emp_id = $${employee_update_Details.length + 1}
    RETURNING *;
  `;

  // users query
  const usersQuery = `
    UPDATE users
    SET ${userFields}
    WHERE user_id = $${user_update_Details.length + 1}
    RETURNING *;
  `;

  try {
    const result = await pool.query(employeeQuery, [...employee_update_Details, id]);
    const result2 = await pool.query(usersQuery, [...user_update_Details, user_id]);

    const returnStuff = result.rows[0] + result2.rows[0]
    return returnStuff;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw new Error('Failed to update employee');
  }
};
  

export const deleteEmployee = async (id: number) => {
    // const deleted = await pool.query(DELETE_EMPLOYEE, [id]);
    // const userId = deleted.rows[0]?.user_id;
    // await pool.query(DELETE_USER, [userId]);
    // await pool.query(DELETE_TASK_EMPID, [id]);
    // console.log(deleted);

    try {
      const user_idres = await pool.query(`SELECT user_id FROM employees WHERE emp_id = $1`,[id]);
      // // Debugging
      // console.log(user_idres);
      const user_id = user_idres.rows[0].user_id
      // // Debugging
      // console.log(user_id);


      await pool.query(`DELETE FROM onboarding_tasks WHERE emp_id = $1`, [id]);
      await pool.query(`DELETE FROM employees WHERE user_id = $1`, [user_id])
      await pool.query(`DELETE FROM users WHERE user_id = $1`, [user_id])

    } catch (error) {
      console.log(error);
      return error;
    }
};


export const getEmployeesByDeptId = async (id: any) => {
  console.log(id);
    const employee = await pool.query(GET_EMPLOYEES_BY_DEPT_ID, [id]);
    // // Debugging
    console.log("employee rows",employee.rows);
    return employee.rows;
};

export const getNumberOfEmployees = async () => {
  const result = await pool.query(GET_NUMBER_OF_EMPLOYEES);
  return result.rows; // Returns [{ total_employees: 5 }]
};
