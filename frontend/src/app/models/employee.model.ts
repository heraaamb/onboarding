export interface Employee {
  employee_name: string;
  email: string;
  department_name: string;
  joining_date: Date | String| null;
  role: string;
  status: string;
  designation: string;
  supervisor_name: any;
  emp_id:number;
  fromEdit:boolean;
}
