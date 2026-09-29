-- NOTE: demo passwords for local testing only — change them in any real deployment.

-- Δημιουργία Διαχειριστή Συστήματος (Administrator)
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'AdminPass123!';
GRANT ALL PRIVILEGES ON beerthusiasts.* TO 'admin'@'localhost' WITH GRANT OPTION;

-- Δημιουργία Υπεύθυνου Καταστήματος (Pub Manager)
CREATE USER 'pub_manager'@'localhost' IDENTIFIED BY 'ManagerPass123!';
GRANT SELECT, INSERT, UPDATE, DELETE ON beerthusiasts.pub TO 'pub_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON beerthusiasts.pubhasbeer TO 'pub_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE ON beerthusiasts.supplier TO 'pub_manager'@'localhost';
GRANT SELECT, INSERT, UPDATE ON beerthusiasts.supplierorder TO 'pub_manager'@'localhost';
GRANT SELECT ON beerthusiasts.orders TO 'pub_manager'@'localhost';

-- Δημιουργία Εργαζόμενου (Employee)
CREATE USER 'employee'@'localhost' IDENTIFIED BY 'EmployeePass123!';
GRANT SELECT, INSERT ON beerthusiasts.orders TO 'employee'@'localhost';
GRANT SELECT, INSERT ON beerthusiasts.orderhasbeer TO 'employee'@'localhost';
GRANT SELECT ON beerthusiasts.pubhasbeer TO 'employee'@'localhost';

-- Δημιουργία Πελάτη (Customer)
CREATE USER 'customer'@'localhost' IDENTIFIED BY 'CustomerPass123!';
GRANT SELECT ON beerthusiasts.beer TO 'customer'@'localhost';
GRANT SELECT ON beerthusiasts.brand TO 'customer'@'localhost';
GRANT SELECT ON beerthusiasts.pub TO 'customer'@'localhost';
GRANT INSERT ON beerthusiasts.orders TO 'customer'@'localhost';
GRANT INSERT ON beerthusiasts.customerreviewsbeer TO 'customer'@'localhost';
GRANT UPDATE ON beerthusiasts.customer TO 'customer'@'localhost';
