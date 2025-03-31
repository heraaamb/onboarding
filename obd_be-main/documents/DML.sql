INSERT INTO departments (name) VALUES
('R&D'),        
('Operations'),
('HR'),        
('IT');        

INSERT INTO users (name, email, password_hash, role, department_id, status) VALUES
-- Admins
('Nick Fury', 'nick@shield.com', 'hashed_pw_1', 'Admin', 3, 'Active'), -- HR

-- Dept_Users
('Maria Hill', 'maria@shield.com', 'hashed_pw_2', 'Dept_User', 1, 'Active'), -- R&D
('Phil Coulson', 'phil@shield.com', 'hashed_pw_3', 'Dept_User', 2, 'Active'), -- Operations

-- Employees (Onboarding)
('Peter Parker', 'peter@avengers.com', 'hashed_pw_4', 'Employee', 1, 'Active'),
('Steve Rogers', 'steve@avengers.com', 'hashed_pw_5', 'Employee', 2, 'Active'),
('Wanda Maximoff', 'wanda@avengers.com', 'hashed_pw_6', 'Employee', 1, 'Active');

-- Supervisors are Maria Hill (user_id = 2) and Phil Coulson (user_id = 3)

INSERT INTO employees (user_id, designation, joining_date, department_id, supervisor_id, document_url)
VALUES
-- Peter Parker (emp_id = 1)
(4, 'Intern - Web Tech', '2025-03-15', 1, NULL, NULL),

-- Steve Rogers (emp_id = 2)
(5, 'Ops Trainee', '2025-03-15', 2, NULL, NULL),

-- Wanda Maximoff (emp_id = 3)
(6, 'AI Analyst', '2025-03-15', 1, 1, NULL); -- Supervisor: Peter


-- Assign tasks to Peter Parker
INSERT INTO onboarding_tasks (emp_id, assigned_by, department_id, task_name, description, status, due_date)
VALUES
(1, 1, 1, 'Intro to Stark Tech', 'Orientation on tech stack', 'Pending', '2025-03-25'),
(1, 1, 3, 'HR Documentation', 'Submit identity proof and address', 'Pending', '2025-03-26'),

-- Assign tasks to Steve Rogers
(2, 3, 2, 'Operations Briefing', 'Learn about SHIELD logistics', 'Pending', '2025-03-27'),

-- Assign tasks to Wanda
(3, 2, 1, 'R&D Policies', 'Go through R&D rules and project overview', 'Pending', '2025-03-28');


INSERT INTO employee_queries (emp_id, query_text, assigned_to, status, created_at)
VALUES
(1, 'Where can I find the Stark tech documentation?', 2, 'Open', NOW()),
(2, 'Is there a template for SHIELD reports?', 3, 'Open', NOW()),
(3, 'How do I access the secure vault for AI experiments?', 2, 'Open', NOW());



