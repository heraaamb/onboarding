export const GET_ALL_EMPLOYEES = `
  SELECT * FROM employees;
`;

export const GET_ONBOARDING_EMPLOYEES = `
  SELECT * FROM employees 
  WHERE emp_id IN (
    SELECT emp_id FROM onboarding_tasks WHERE status != 'Completed'
  );
`;

export const CREATE_EMPLOYEE = `
  INSERT INTO employees (
    user_id, designation, joining_date, department_id, supervisor_id, document_url
  ) VALUES (
    $1, $2, $3, $4, $5, $6
  ) RETURNING *;
`;

export const EMPLOYEE_INSERT_QUERY = `
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

export const UPDATE_EMPLOYEE = `UPDATE employees
  SET $1 = $2
  WHERE emp_id = $3
  RETURNING *;
`; 

export const DELETE_EMPLOYEE = `
  DELETE FROM employees WHERE emp_id = $1;
`;
