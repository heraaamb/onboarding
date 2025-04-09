export interface Task {

    employee_name: string | number;  // Allow both number and string
    assigned_by_name: string;
    department_name: string;
    task_id: number;
    task_name: string;
    description: string;
    due_date: string;
    fromEdit: boolean;
}
