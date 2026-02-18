CREATE DATABASE IF NOT EXISTS fractal_test;
USE fractal_test;



-- Catálogo de productos
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Cabecera de Órdenes
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL, 
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    status ENUM('Pending', 'InProgress', 'Completed') DEFAULT 'Pending'
);

-- Detalle de productos por orden 
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL, 
    unit_price_at_time DECIMAL(10, 2) NOT NULL, 
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Datos de prueba para productos
INSERT INTO products (name, unit_price) VALUES 
('Procesador Intel i9', 550.00),
('Memoria RAM 16GB', 85.00),
('Disco SSD 1TB', 120.00);