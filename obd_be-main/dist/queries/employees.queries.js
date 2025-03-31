"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DELETE_EMPLOYEE = exports.UPDATE_EMPLOYEE = exports.EMPLOYEE_INSERT_QUERY = exports.CREATE_EMPLOYEE = exports.GET_ONBOARDING_EMPLOYEES = exports.GET_ALL_EMPLOYEES = void 0;
exports.GET_ALL_EMPLOYEES = `
  SELECT * FROM employees;
`;
exports.GET_ONBOARDING_EMPLOYEES = `
  SELECT * FROM employees 
  WHERE emp_id IN (
    SELECT emp_id FROM onboarding_tasks WHERE status != 'Completed'
  );
`;
exports.CREATE_EMPLOYEE = `
  INSERT INTO employees (
    user_id, designation, joining_date, department_id, supervisor_id, document_url
  ) VALUES (
    $1, $2, $3, $4, $5, $6
  ) RETURNING *;
`;
exports.EMPLOYEE_INSERT_QUERY = `
  INSERT INTO employees (user_id, designation, joining_date, department_id, supervisor_id, document_url)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *;
`;
// export const UPDATE_EMPLOYEE = `
//   UPDATE employees
//   SET designation = $1,
//       joining_date = $2,
//       department_id = $3,
//       supervisor_id = $4,
//       document_url = $5
//   WHERE emp_id = $6
//   RETURNING *;
// `;
exports.UPDATE_EMPLOYEE = `UPDATE employees
  SET $1 = $2
  WHERE emp_id = $3
  RETURNING *;
`;
exports.DELETE_EMPLOYEE = `
  DELETE FROM employees WHERE emp_id = $1;
`;
