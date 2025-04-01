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
const getAllEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(employees_queries_1.GET_ALL_EMPLOYEES);
    // // Debugging
    console.log(result.rows);
    return result.rows;
});
exports.getAllEmployees = getAllEmployees;
const getOnboardingEmployees = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(employees_queries_1.GET_ONBOARDING_EMPLOYEES);
    return result.rows;
});
exports.getOnboardingEmployees = getOnboardingEmployees;
// export const createEmployee = async (data: any) => {
//     const { user_id, designation, joining_date, department_id, supervisor_id, document_url } = data;
//     const result = await pool.query(
//         CREATE_EMPLOYEE,
//         [user_id, designation, joining_date, department_id, supervisor_id, document_url]
//     );
//     return result.rows[0];
// };
const createEmployee = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield db_1.default.connect();
    try {
        yield client.query('BEGIN'); // Start the transaction
        const userValues = [data.name, data.email, data.password_hash, data.role, data.department_id, data.status];
        const userResult = yield client.query(users_queries_1.USER_INSERT_QUERY, userValues);
        const userId = userResult.rows[0].user_id;
        const employeeValues = [userId, data.designation, data.joining_date, data.department_id, data.supervisor_id, data.document_url];
        const employeeResult = yield client.query(employees_queries_1.EMPLOYEE_INSERT_QUERY, employeeValues);
        yield client.query('COMMIT'); // Commit the transaction
        return employeeResult.rows[0];
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
    const employeeFields = filteredEntries.map(([key, value]) => `${key} = $${employee_update_Details.indexOf(value) + 1}`);
    // Build query
    const query = `
      UPDATE employees
      SET ${employeeFields.join(', ')}
      WHERE emp_id = $${employee_update_Details.length + 1}
      RETURNING *;
    `;
    try {
        const result = yield db_1.default.query(query, [...employee_update_Details, id]);
        return result.rows[0];
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
