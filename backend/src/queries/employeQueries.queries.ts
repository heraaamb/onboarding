export const GET_ALL_EMPLOYEE_QUERIES = `
    SELECT * FROM employee_queries;
`;

export const INSERT_NEW_QUERY = `
    INSERT INTO employee_queries (emp_id, query_text, assigned_to) VALUES ($1,$2,$3)
`;