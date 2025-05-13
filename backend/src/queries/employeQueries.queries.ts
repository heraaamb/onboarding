export const GET_ALL_EMPLOYEE_QUERIES = `
    SELECT 
        u.name AS employee_name,
        eq.query_id,
        eq.query_text
    FROM 
        employee_queries eq
    JOIN 
        employees e ON eq.emp_id = e.emp_id
    JOIN 
        users u ON e.user_id = u.user_id;
`;
export const GET_ALL_OPEN_EMPLOYEE_QUERIES = `
    SELECT 
        u.name AS employee_name,
        eq.query_id,
        eq.query_text
    FROM 
        employee_queries eq
    JOIN 
        employees e ON eq.emp_id = e.emp_id
    JOIN 
        users u ON e.user_id = u.user_id
    WHERE
        eq.status = 'Open';
`;
export const GET_QUERIES_BY_EMPID = `
    SELECT 
        u.name AS employee_name,
        eq.query_id,
        eq.query_text,
        eq.response
    FROM 
        employee_queries eq
    JOIN 
        employees e ON eq.emp_id = e.emp_id
    JOIN 
        users u ON e.user_id = u.user_id
    WHERE
        eq.emp_id = $1;
`;

export const INSERT_NEW_QUERY = `
    INSERT INTO employee_queries (emp_id, query_text) VALUES ($1,$2);
`;

export const REPLY_TO_QUERY = `
    UPDATE employee_queries
    SET 
        response = $1, 
        status = 'Resolved'
    WHERE
        query_id = $2;
`;