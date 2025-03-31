"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPDATE_TASK_STATUS = exports.CREATE_TASK = exports.DELETE_TASK = exports.GET_ALL_TASKS = void 0;
exports.GET_ALL_TASKS = `
  SELECT * FROM onboarding_tasks;
`;
exports.DELETE_TASK = `
  DELETE FROM onboarding_tasks 
  WHERE task_id = $1;
`;
exports.CREATE_TASK = `
  INSERT INTO onboarding_tasks (emp_id, assigned_by, department_id, task_name, description, status, due_date)
   VALUES 
   ($1, $2, $3, $4, $5, $6, $7) 
   RETURNING *;
`;
exports.UPDATE_TASK_STATUS = `
  UPDATE onboarding_tasks 
  SET status = 'Completed'
  WHERE task_id = $1;
`;
