"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INSERT_EMPLOYEE_QUERY = exports.GET_ALL_EMPLOYEE_QUERIES = void 0;
exports.GET_ALL_EMPLOYEE_QUERIES = `
    SELECT * FROM employee_queries;
`;
exports.INSERT_EMPLOYEE_QUERY = `
    INSERT INTO employee_queries (emp_id, query_text, )
`;
