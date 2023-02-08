-- -- View employees 
-- SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS department, manager.first_name as manager_first, manager.last_name as manager_last
    -- FROM employees
    -- JOIN employees manager ON manager.id = employees.manager_id
    -- JOIN roles ON employees.role_id = roles.id
    -- JOIN departments ON roles.department_id = departments.id
    -- ORDER BY employees.id;

-- -- Employees by manager (add template literal)
-- SELECT CONCAT(employees.first_name, " ", employees.last_name) AS Name, roles.title AS Title, CONCAT(manager.first_name, " ", manager.last_name) AS Manager
    -- FROM employees
    -- LEFT JOIN roles on employees.role_id = roles.id
    -- LEFT JOIN employees manager ON manager.id = employees.manager_id
    -- WHERE employees.manager_id = 2;


-- -- Employees by department (add template literal)
-- SELECT CONCAT(employees.first_name, " ", employees.last_name) AS Name, roles.title, departments.name AS Department
    -- FROM employees
    -- LEFT JOIN roles ON employees.role_id = roles.id
    -- LEFT JOIN departments ON roles.department_id = departments.id
    -- WHERE departments.id = 1;


-- -- Budgets by department
-- SELECT departments.id, departments.name AS Department, SUM(roles.salary) AS Total_Budget
    -- FROM employees 
    -- LEFT JOIN roles on employees.role_id = roles.id
    -- LEFT JOIN departments on roles.department_id = departments.id
    -- GROUP BY departments.id, departments.name;