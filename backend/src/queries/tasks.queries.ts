export const GET_ALL_TASKS = `
  SELECT 
      ot.task_id,
      u.name AS employee_name,
      ab.name AS assigned_by_name,
      d.name AS department_name,
      ot.task_name,
      ot.description,
      ot.status,
      ot.due_date,
      ot.created_at
  FROM onboarding_tasks ot
  JOIN employees e ON ot.emp_id = e.emp_id
  JOIN users u ON e.user_id = u.user_id
  LEFT JOIN users ab ON ot.assigned_by = ab.user_id
  LEFT JOIN departments d ON ot.department_id = d.dept_id;
`;

export const GET_DEPARTMENT_TASKS = `
  SELECT 
      ot.task_id,
      u.name AS employee_name,
      ab.name AS assigned_by_name,
      d.name AS department_name,
      ot.task_name,
      ot.description,
      ot.status,
      ot.due_date,
      ot.created_at
  FROM onboarding_tasks ot
  JOIN employees e ON ot.emp_id = e.emp_id
  JOIN users u ON e.user_id = u.user_id
  LEFT JOIN users ab ON ot.assigned_by = ab.user_id
  LEFT JOIN departments d ON ot.department_id = d.dept_id
  WHERE ot.department_id = $1;
`;

export const GET_EMPLOYEE_SPECIFIC_TASKS = `
  SELECT 
      ot.task_id,
      u.name AS employee_name,
      ab.name AS assigned_by_name,
      d.name AS department_name,
      ot.task_name,
      ot.description,
      ot.status,
      ot.due_date,
      ot.created_at
  FROM onboarding_tasks ot
  JOIN employees e ON ot.emp_id = e.emp_id
  JOIN users u ON e.user_id = u.user_id
  LEFT JOIN users ab ON ot.assigned_by = ab.user_id
  LEFT JOIN departments d ON ot.department_id = d.dept_id
  WHERE ot.emp_id = $1;
`;

export const DELETE_TASK = `
  DELETE FROM onboarding_tasks 
  WHERE task_id = $1;
`;

export const DELETE_TASK_EMPID = `
  DELETE FROM onboarding_tasks
  WHERE emp_id = $1;
`;

export const CREATE_TASK = `
INSERT INTO onboarding_tasks (
    emp_id,
    assigned_by,
    department_id,
    task_name,
    description,
    status,
    due_date
)
VALUES (
    (
        SELECT e.emp_id
        FROM employees e
        JOIN users u ON e.user_id = u.user_id
        WHERE u.name = $1
    ),
    (
        SELECT user_id
        FROM users
        WHERE name = $2
    ),
    (
        SELECT dept_id
        FROM departments
        WHERE name = $3
    ),
    $4, -- task_name
    $5, -- description
    'Pending', -- status
    $6  -- due_date
)
RETURNING *; 
`;

export const UPDATE_TASK_STATUS = `
  UPDATE onboarding_tasks 
  SET status = 'Completed'
  WHERE task_id = $1;
`;

// export const EDIT_TASK = `
//   UPDATE onboarding_tasks 
//   SET status = 'Completed'
//   WHERE task_id = $1;
// `;