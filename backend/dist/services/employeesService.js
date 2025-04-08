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
exports.deleteEmployee = exports.updateEmployee = exports.createEmployee = exports.getOnboardingEmployees = exports.getAllEmployees = void 0;
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
const updateEmployee = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    // // Debugging
    console.log("Data received:", data);
    const { employee_name, email, department_name, joining_date, role, status, designation, supervisor_name, } = data;
    try {
        // Get user_id from employee ID
        const userRes = yield db_1.default.query(`SELECT user_id FROM employees WHERE emp_id = $1`, [id]);
        if (userRes.rows.length === 0)
            throw new Error("Employee not found");
        const user_id = userRes.rows[0].user_id;
        // Update employee name
        if (employee_name !== undefined) {
            yield db_1.default.query(`UPDATE users SET name = $1 WHERE user_id = $2`, [employee_name, user_id]);
        }
        // Update email
        if (email !== undefined) {
            yield db_1.default.query(`UPDATE users SET email = $1 WHERE user_id = $2`, [email, user_id]);
        }
        // Update department
        if (department_name !== undefined) {
            const deptRes = yield db_1.default.query(`SELECT dept_id FROM departments WHERE name = $1`, [department_name]);
            if (deptRes.rows.length === 0)
                throw new Error("Department not found");
            const department_id = deptRes.rows[0].dept_id;
            // // Debugging
            console.log("DepatmentId: ", department_id);
            yield db_1.default.query(`UPDATE users SET department_id = $1 WHERE user_id = $2`, [department_id, user_id]);
        }
        // Update joining date
        if (joining_date !== undefined) {
            yield db_1.default.query(`UPDATE employees SET joining_date = $1 WHERE user_id = $2`, [joining_date, user_id]);
        }
        // Update role
        if (role !== undefined) {
            yield db_1.default.query(`UPDATE users SET role = $1 WHERE user_id = $2`, [role, user_id]);
        }
        // Update status
        if (status !== undefined) {
            yield db_1.default.query(`UPDATE users SET status = $1 WHERE user_id = $2`, [status, user_id]);
        }
        // Update designation
        if (designation !== undefined) {
            yield db_1.default.query(`UPDATE employees SET designation = $1 WHERE user_id = $2`, [designation, user_id]);
        }
        // Update supervisor
        if (supervisor_name !== undefined) {
            const supervisorRes = yield db_1.default.query(`SELECT e.emp_id 
        FROM employees e
        JOIN users u ON u.user_id = e.user_id
        WHERE u.name = $1`, [supervisor_name]);
            if (supervisorRes.rows.length === 0)
                throw new Error("Supervisor not found");
            const supervisor_id = supervisorRes.rows[0].emp_id;
            yield db_1.default.query(`UPDATE employees SET supervisor_id = $1 WHERE user_id = $2`, [supervisor_id, user_id]);
        }
    }
    catch (error) {
        console.log(error);
        return error;
    }
});
exports.updateEmployee = updateEmployee;
const deleteEmployee = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.query(employees_queries_1.DELETE_EMPLOYEE, [id]);
});
exports.deleteEmployee = deleteEmployee;
