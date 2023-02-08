INSERT INTO departments (name)
VALUES ("Sales"),
       ("Ops"),
       ("Product"),
       ("Finance");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 1000, 2),
       ("Engineer", 2000, 3),
       ("Accountant", 4000, 4),
       ("Marketer", 4000, 1);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Bill", "Smith", 1, 1),
       ("Jane", "Doe", 2, 1),
       ("Mike", "Davis", 3, 2),
       ("Eve", "Thomas", 3, 2),
       ("Rachel", "Woods", 2, 1),
       ("Bob", "Jones", 4, 2);