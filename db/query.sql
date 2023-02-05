SELECT roles.id, roles.title, roles.salary, roles.title, departments.name
FROM roles
    JOIN departments ON roles.department_id = departments.id;

