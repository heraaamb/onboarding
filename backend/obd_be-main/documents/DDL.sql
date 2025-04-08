CREATE TYPE user_role AS ENUM ('Employee', 'Admin', 'Dept_User', 'Super_Admin');
CREATE TYPE user_status AS ENUM ('Active', 'Inactive');
CREATE TYPE task_status AS ENUM ('Pending', 'In Progress', 'Completed');
CREATE TYPE query_status AS ENUM ('Open', 'In Progress', 'Resolved');

CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    department_id INT,
    status user_status DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL,
    joining_date DATE NOT NULL,
    department_id INT,
    supervisor_id INT,
    document_url TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE SET NULL,
    FOREIGN KEY (supervisor_id) REFERENCES employees(emp_id) ON DELETE SET NULL
);

CREATE TABLE onboarding_tasks (
    task_id SERIAL PRIMARY KEY,
    emp_id INT NOT NULL,
    assigned_by INT,
    department_id INT NULL,
    task_name VARCHAR(255) NOT NULL,
    description TEXT,
    status task_status DEFAULT 'Pending',
    due_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(user_id) ON DELETE SET NULL,
    FOREIGN KEY (department_id) REFERENCES departments(dept_id) ON DELETE SET NULL
);

CREATE TABLE employee_queries (
    query_id SERIAL PRIMARY KEY,
    emp_id INT NOT NULL,
    query_text TEXT NOT NULL,
    assigned_to INT,
    status query_status DEFAULT 'Open',
    due_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES employees(emp_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id) ON DELETE SET NULL
);


-- Triggers

CREATE OR REPLACE FUNCTION validate_supervisor_department()
RETURNS TRIGGER AS $$
DECLARE
    supervisor_dept_id INT;
BEGIN
    -- Only run if both department_id and supervisor_id are provided
    IF NEW.department_id IS NOT NULL AND NEW.supervisor_id IS NOT NULL THEN
        SELECT department_id INTO supervisor_dept_id
        FROM employees
        WHERE emp_id = NEW.supervisor_id;

        IF NEW.department_id != supervisor_dept_id THEN
            RAISE EXCEPTION 'Supervisor must be in the same department as employee.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_validate_supervisor_department
BEFORE INSERT OR UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION validate_supervisor_department();


-- Automatically mark onboarding as complete when all tasks are done
CREATE OR REPLACE FUNCTION update_onboarding_status()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM onboarding_tasks WHERE emp_id = NEW.emp_id AND status != 'Completed') = 0 THEN
        UPDATE employees SET onboarding_completed = true WHERE emp_id = NEW.emp_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_onboarding_status
AFTER UPDATE OF status ON onboarding_tasks
FOR EACH ROW EXECUTE FUNCTION update_onboarding_status();