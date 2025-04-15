"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeById = exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getOnboardingEmployees = exports.getAllEmployees = void 0;
// src/services/employees.service.ts
const db_1 = __importDefault(require("../db/db"));
const employees_queries_1 = require("../queries/employees.queries");
const users_queries_1 = require("../queries/users.queries");
const utils_1 = require("../utils/utils");
const getAllEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(employees_queries_1.GET_ALL_EMPLOYEES);
    // // Debugging
    // console.log(result.rows);
    return result.rows;
});
exports.getAllEmployees = getAllEmployees;
const getOnboardingEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(employees_queries_1.GET_ONBOARDING_EMPLOYEES);
    return result.rows;
});
exports.getOnboardingEmployees = getOnboardingEmployees;
const createEmployee = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    // // Debugging
    console.log("employee data while creating: ", data);
    console.log(data.role);
    if (data.role === 'Admin') {
        const resultDept = yield client.query(`SELECT dept_id FROM departments WHERE name='${data.department_name}';`);
        // // Debugging
        console.log("resultDept: ", resultDept);
        console.log("endoo");
        const department_id = resultDept.rows[0].dept_id;
        // // Debugging
        console.log("deparID: ", department_id);
        const plainPassword = yield (0, utils_1.generatePassword)();
        const hashedPassword = yield (0, utils_1.hashPassword)(plainPassword);
        const userValues = [data.employee_name, data.email, hashedPassword, data.role, department_id, data.status];
        const userResult = yield client.query(users_queries_1.USER_INSERT_QUERY, userValues);
        // // send mail (send password) 
        // await sendmail(data.name, data.email, plainPassword)
        return plainPassword;
    }
    const resultDept = yield client.query(`SELECT dept_id FROM departments WHERE name='${data.department_name}';`);
    // // Debugging
    console.log("resultDeptId: ", resultDept);
    console.log("endoo");
    const department_id = resultDept.rows[0].dept_id;
    // // Debugging
    console.log("deparID: ", department_id);
    const resultSupervisor = yield client.query(`
      SELECT e.emp_id 
      FROM employees e
      JOIN users u ON u.user_id = e.user_id
      WHERE u.name = $1;
    `, [data.supervisor_name]);
    // // Debugging 
    // console.log("supdervisor result: ",resultSupervisor);
    const supervisor_id = resultSupervisor.rows[0].emp_id;
    // // Debugging
    // console.log("supervisor_id: ", supervisor_id);
    try {
        yield client.query('BEGIN'); // Start the transaction
        const plainPassword = yield (0, utils_1.generatePassword)();
        const hashedPassword = yield (0, utils_1.hashPassword)(plainPassword);
        // Insert into users table
        const userValues = [data.employee_name, data.email, hashedPassword, data.role, department_id, data.status];
        const userResult = yield client.query(users_queries_1.USER_INSERT_QUERY, userValues);
        const userId = userResult.rows[0].user_id;
        // Insert into employees table
        const employeeValues = [userId, data.designation, data.joining_date, department_id, supervisor_id, data.document_url];
        const employeeResult = yield client.query(employees_queries_1.EMPLOYEE_INSERT_QUERY, employeeValues);
        yield client.query('COMMIT'); // Commit the transaction
        // // send mail (pasword) to the employee send password 
        // await sendmail(data.name, data.email, plainPassword)
        return Object.assign(Object.assign({}, employeeResult.rows[0]), { plainPassword }); // Return password for further use if needed
    }
    catch (error) {
        yield client.query('ROLLBACK'); // Rollback in case of error
        console.error('Transaction failed:', error);
        throw error;
    }
    finally {
        client.release(); // Release the client
    }
});
exports.createEmployee = createEmployee;
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
const updateEmployee = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { designation, joining_date, department_name, supervisor_name, document_url, email, role, status, name } = data;
    // do validation
    // if(!designation){
    //   throw error "empty designation";
    // }
    const supervisor_result = yield db_1.default.query(`
    SELECT e.emp_id
    FROM employees e
    JOIN users u ON e.user_id = u.user_id
    WHERE name=$1`, [supervisor_name]);
    const supervisor_id = supervisor_result.rows[0].emp_id;
    // // Debugging
    // console.log(supervisor_result);
    const departmentResult = yield db_1.default.query(`SELECT dept_id FROM departments WHERE name = '${department_name}'`);
    const department_id = departmentResult.rows[0].dept_id;
    const userIdresult = yield db_1.default.query(`SELECT user_id FROM employees WHERE emp_id=${id}`);
    const user_id = userIdresult.rows[0].user_id;
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
    };
    console.log("====", userDetails);
    const filteredEmployeeEntries = Object.entries(employeeDetails).filter(([_, value]) => value !== undefined);
    const filteredUserEntries = Object.entries(userDetails).filter(([_, value]) => value !== undefined);
    // // Debugging
    console.log("filteredEmployeeEntries", filteredEmployeeEntries);
    console.log("filteredUserEntries", filteredUserEntries);
    const employee_update_Details = filteredEmployeeEntries.map(([_, value]) => value);
    const employeeFields = filteredEmployeeEntries.map(([key, value]) => `${key} = $${employee_update_Details.indexOf(value) + 1}`);
    // // Debugging
    console.log("employee_update_Details", employee_update_Details);
    console.log("employeeFields", employeeFields);
    const user_update_Details = filteredUserEntries.map(([_, value]) => value);
    const userFields = filteredUserEntries.map(([key, value]) => `${key} = $${user_update_Details.indexOf(value) + 1}`);
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
        const result = yield db_1.default.query(employeeQuery, [...employee_update_Details, id]);
        const result2 = yield db_1.default.query(usersQuery, [...user_update_Details, user_id]);
        const returnStuff = result.rows[0] + result2.rows[0];
        return returnStuff;
    }
    catch (error) {
        console.error('Error updating employee:', error);
        throw new Error('Failed to update employee');
    }
});
exports.updateEmployee = updateEmployee;
const deleteEmployee = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query(employees_queries_1.DELETE_EMPLOYEE, [id]);
});
exports.deleteEmployee = deleteEmployee;
const getEmployeeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield db_1.default.query(employees_queries_1.GET_EMPLOYEE_BY_ID, [id]);
    // // Debugging
    // console.log(employee.rows[0]);
    return employee.rows[0];
});
exports.getEmployeeById = getEmployeeById;
