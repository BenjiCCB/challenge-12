INSERT INTO departments (name)
VALUES ("Sales"),
       ("Ops"),
       ("Products");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 1000, 1),
       ("Engineer", 2000, 2),
       ("Marketer", 4000, 1);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bill", "Smith", 3, 2),
       ("Jane", "Doe", 2, 1),
       ("Mike", "Jones", 1, 1);