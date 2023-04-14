
INSERT INTO departments (name) VALUES ('Sanitation');

INSERT INTO departments (name) VALUES ('Public Representation');


INSERT INTO roles (title, salary, department_id) VALUES ('Head Janitor', '120000.50', 1);

INSERT INTO roles (title, salary, department_id) VALUES ('Head of PR', '12.50', 2);

INSERT INTO roles (title, salary, department_id) VALUES ('PR Agent', '5.50', 2);


INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Schmidt', 1, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('George', 'Jetson', 2, NULL);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Fred', 'Flintstone', 2, 2);
