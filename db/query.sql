SELECT emp.first_name, emp.last_name, manager.first_name as manager_firstname
FROM employees emp
JOIN employees manager 
ON emp.manager_id = manager.employee_id;


-- SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name
-- FROM employees
-- JOIN roles ON employees.role_id = roles.id
-- JOIN departments ON roles.department_id = departments.id;