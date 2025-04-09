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
exports.getAllTasks = void 0;
exports.deleteTask = deleteTask;
exports.createTask = createTask;
exports.updateTaskStatus = updateTaskStatus;
exports.editTask = editTask;
const db_1 = __importDefault(require("../db/db"));
const tasks_queries_1 = require("../queries/tasks.queries");
const getAllTasks = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.default.query(tasks_queries_1.GET_ALL_TASKS);
    // // Debugging
    // console.log("tasks: ",result.rows);
    return result.rows;
});
exports.getAllTasks = getAllTasks;
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query(tasks_queries_1.DELETE_TASK, [id]);
    });
}
function createTask(data) {
    return __awaiter(this, void 0, void 0, function* () {
        // // Debugging
        // console.log("Create task data: ",data);
        yield db_1.default.query(tasks_queries_1.CREATE_TASK, [data.employee_name, data.assigned_by_name, data.department_name, data.task_name, data.description, data.due_date]);
    });
}
function updateTaskStatus(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.default.query(tasks_queries_1.UPDATE_TASK_STATUS, [id]);
    });
}
function editTask(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log(id);
        const { employee_name, assigned_by_name, department_name, task_name, description, status, due_date } = data;
        if (!employee_name || !assigned_by_name || !department_name || !task_name || !description || !status || !due_date) {
            return "Fill out all fields!";
        }
        // Get assigned_by user_id
        const assigned_by_id_result = yield db_1.default.query(`SELECT user_id FROM users WHERE name = $1`, [assigned_by_name]);
        const assigned_by = (_a = assigned_by_id_result.rows[0]) === null || _a === void 0 ? void 0 : _a.user_id;
        // Get department_id
        const department_id_result = yield db_1.default.query(`SELECT dept_id FROM departments WHERE name = $1`, [department_name]);
        const department_id = (_b = department_id_result.rows[0]) === null || _b === void 0 ? void 0 : _b.dept_id;
        const emp_idResult = yield db_1.default.query(`
        SELECT e.emp_id 
        FROM employees e
        JOIN users u ON e.user_id = u.user_id
        WHERE u.name = '${employee_name}'    
    `);
        const emp_id = emp_idResult.rows[0].emp_id;
        // Build update object
        const taskData = {
            assigned_by,
            department_id,
            task_name,
            description,
            status,
            due_date
        };
        // // Debugging
        // console.log("taskData: ", taskData);
        const columns = Object.keys(taskData).map((key, index) => `${key} = $${index + 1}`);
        const values = Object.values(taskData);
        // // Debugging
        // console.log("columns: ", columns);
        // console.log("values: ", values);
        const query = `
        UPDATE onboarding_tasks
        SET ${columns.join(', ')}
        WHERE task_id = $${values.length + 1}
        RETURNING *;
    `;
        // // Debugging
        // console.log(query);
        let result;
        try {
            result = yield db_1.default.query(query, [...values, id]);
            // // Debugging
            console.log("result of the query: ", result.rows);
        }
        catch (error) {
            console.error("Error updating task:", error);
            return "Failed to update task.";
        }
        return result.rows[0];
    });
}
