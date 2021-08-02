INSERT INTO department (name)
VALUES ("Management"),
("Accounting"),
("Operations"),
("Human Resource"),
("Engineering"),
("Sales"),
("Marketing"),
("Support");

INSERT INTO role (title, salary, dept_id)
VALUES ("CEO", 150000, 1),
("COO", 145000, 1),
("Sr. Accountant", 80000, 2),
("Accountant", 70000, 2),
("Purchase", 70000, 3),
("Logistics", 70000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("William", "Kuo", 1, null),
("Jessica", "Guo", 2, 1),
("Swan", "Liao", 3, 2),
("Mike", "van Gessel", 6, 2);