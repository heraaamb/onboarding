// src/services/employees.service.ts
import pool from '../db/db';
import {
    GET_ALL_EMPLOYEES,
    GET_ONBOARDING_EMPLOYEES,
    UPDATE_EMPLOYEE,
    DELETE_EMPLOYEE,
    EMPLOYEE_INSERT_QUERY,
    GET_EMPLOYEE_BY_ID
} from '../queries/employees.queries';
import { DELETE_TASK_EMPID } from '../queries/tasks.queries';
import {DELETE_USER} from '../queries/users.queries'
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

// export const updateEmployee = async (id: number, data: any) => {
//   const { designation, joining_date, department_name, supervisor_name, email, role, status, name } = data;

//   if (!designation || !joining_date || !department_name || !supervisor_name || !email || !role || !status || !name) {
//     return "Fill out all fields!";
//   }

//   const supervisor_result = await pool.query(
//     `SELECT e.emp_id FROM employees e JOIN users u ON e.user_id = u.user_id WHERE u.name = $1`,
//     [supervisor_name]
//   );
//   const supervisor_id = supervisor_result.rows[0]?.emp_id;

//   const departmentResult = await pool.query(
//     `SELECT dept_id FROM departments WHERE name = $1`,
//     [department_name.name]
//   );
//   const department_id = departmentResult.rows[0]?.dept_id;

//   const userIdResult = await pool.query(`SELECT user_id FROM employees WHERE emp_id = $1`, [id]);
//   const user_id = userIdResult.rows[0]?.user_id;

//   const employeeDetails = {
//     designation,
//     joining_date,
//     department_id,
//     supervisor_id
//   };

//   const userDetails = {
//     name,
//     email,
//     role,
//     department_id,
//     status
//   };

//   const filteredEmployeeEntries = Object.entries(employeeDetails).filter(([_, value]) => value);
//   const filteredUserEntries = Object.entries(userDetails).filter(([_, value]) => value);

//   const employee_update_Details = filteredEmployeeEntries.map(([_, value]) => value);
//   const employeeFields = filteredEmployeeEntries.map(([key], index) =>
//     `${key} = $${index + 1}`
//   );

//   const user_update_Details = filteredUserEntries.map(([_, value]) => value);
//   const userFields = filteredUserEntries.map(([key], index) =>
//     `${key} = $${index + 1}`
//   );

//   const employeeQuery = `
//     UPDATE employees
//     SET ${employeeFields.join(', ')}
//     WHERE emp_id = $${employee_update_Details.length + 1}
//     RETURNING *;
//   `;

//   const usersQuery = `
//     UPDATE users
//     SET ${userFields.join(', ')}
//     WHERE user_id = $${user_update_Details.length + 1}
//     RETURNING *;
//   `;

//   try {
//     const result = await pool.query(employeeQuery, [...employee_update_Details, id]);
//     const result2 = await pool.query(usersQuery, [...user_update_Details, user_id]);

//     return {
//       employee: result.rows[0],
//       user: result2.rows[0]
//     };
//   } catch (error) {
//     console.error('Error updating employee:', error);
//     throw new Error('Failed to update employee');
//   }
// };


export const updateEmployee = async (id: number, data: any) => {
  const { designation, joining_date, department_name, supervisor_name, document_url, email,  role, status, name} = data;

  // do validation

  // if(!designation){
  //   throw error "empty designation";
  // }

  
  const supervisor_result = await pool.query(`
    SELECT e.emp_id
    FROM employees e
    JOIN users u ON e.user_id = u.user_id
    WHERE name=$1`,[supervisor_name])
  const supervisor_id = supervisor_result.rows[0].emp_id
  // // Debugging
  // console.log(supervisor_result);

  const departmentResult = await pool.query(`SELECT dept_id FROM departments WHERE name = '${department_name}'`)
  const department_id = departmentResult.rows[0].dept_id

  const userIdresult = await pool.query(`SELECT user_id FROM employees WHERE emp_id=${id}`)
  const user_id = userIdresult.rows[0].user_id

  const employeeDetails = {
    designation,
    joining_date,
    department_id,
    supervisor_id
  };

  const userDetails = {
    name,
    email,
    role,
    department_id,
    status
  }

  console.log("====",userDetails);

  const filteredEmployeeEntries = Object.entries(employeeDetails).filter(([_, value]) => value !== undefined);
  const filteredUserEntries = Object.entries(userDetails).filter(([_, value]) => value !== undefined);
  // // Debugging
  console.log("filteredEmployeeEntries", filteredEmployeeEntries);
  console.log("filteredUserEntries", filteredUserEntries);

  const employee_update_Details = filteredEmployeeEntries.map(([_, value]) => value);
  const employeeFields = filteredEmployeeEntries.map(([key, value]) => 
    `${key} = $${employee_update_Details.indexOf(value) + 1}`
  );
  // // Debugging
  console.log("employee_update_Details", employee_update_Details);
  console.log("employeeFields", employeeFields);

  const user_update_Details = filteredUserEntries.map(([_, value]) => value);
  const userFields = filteredUserEntries.map(([key, value]) => 
      `${key} = $${user_update_Details.indexOf(value) + 1}`
    );
  // // Debugging
  console.log("user_update_Details", user_update_Details);
  console.log("userFields", userFields);    

  // employee query
  const employeeQuery = `
    UPDATE employees
    SET ${employeeFields.join(', ')}
    WHERE emp_id = $${employee_update_Details.length + 1}
    RETURNING *;
  `;

  // users query
  const usersQuery = `
    UPDATE users
    SET ${userFields.join(', ')}
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


export const getEmployeeById = async (id: number) => {
    const employee = await pool.query(GET_EMPLOYEE_BY_ID, [id]);
    // // Debugging
    // console.log(employee.rows[0]);
    return employee.rows[0];
};
