SELECT e.id, e.first_name, e.last_name, r.title, r.department, r.salary, m.employee_name AS manager 
FROM employee e
LEFT OUTER JOIN (SELECT r.id, r.title, d.name AS department, r.salary FROM role r JOIN department d ON r.dept_id = d.id) r ON e.role_id = r.id
LEFT OUTER JOIN (SELECT id, CONCAT(first_name, " ",last_name) as employee_name FROM employee) m ON e.manager_id = m.id;

SELECT r.id, r.title, d.name AS department, r.salary FROM role r JOIN department d ON r.dept_id = d.id;

SELECT id, CONCAT(first_name, " ",last_name) as employee_name
FROM employee;

SELECT d.name AS "" FROM department d;