SELECT employees.first_name, employees.last_name, employees.manager, roles.title, roles.salary, departments.name
FROM employees
JOIN roles ON employees.role_id = role.id;