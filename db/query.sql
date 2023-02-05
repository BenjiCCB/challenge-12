SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name, manager.first_name as manager_first, manager.last_name as manager_last
FROM employees
    JOIN employees manager ON manager.id = employees.manager_id
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id;



-- SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name
-- FROM employees
-- JOIN roles ON employees.role_id = roles.id
-- JOIN departments ON roles.department_id = departments.id;

-- **

-- SELECT employees.first_name, employees.last_name, manager.first_name as manager_firstname
-- FROM employees
--     JOIN employees manager ON manager.id = employees.manager_id;