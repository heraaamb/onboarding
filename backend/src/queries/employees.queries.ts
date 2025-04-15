export const GET_ALL_EMPLOYEES = `
  SELECT 
      e.emp_id,
      u.name AS employee_name,
      u.email,
      e.joining_date,
      d.name AS department_name,
      u.role,
      u.status,
      e.designation,
      s.name AS supervisor_name
  FROM employees e
  JOIN users u ON e.user_id = u.user_id
  LEFT JOIN departments d ON e.department_id = d.dept_id
  LEFT JOIN employees es ON e.supervisor_id = es.emp_id
  LEFT JOIN users s ON es.user_id = s.user_id;
`;

export const GET_ONBOARDING_EMPLOYEES = `
  SELECT * FROM employees 
  WHERE emp_id IN (
    SELECT emp_id FROM onboarding_tasks WHERE status != 'Completed'
  );
`;

export const EMPLOYEE_INSERT_QUERY = `
  INSERT INTO employees (
    user_id, designation, joining_date, department_id, supervisor_id, document_url
  ) VALUES ($1, $2, $3, $4, $5, $6)
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


export const GET_EMPLOYEE_BY_ID = `
  SELECT * FROM employees WHERE emp_id = $1;
`;

