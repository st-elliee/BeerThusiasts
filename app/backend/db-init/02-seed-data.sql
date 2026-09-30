USE beerthusiasts;

-- Dummy data for brand table
INSERT INTO brand (brand_id, name, country_of_origin, website, description, established_year) VALUES
(1, 'Guinness', 'Ireland', 'https://www.guinness.com', 'An iconic Irish brewery founded in 1759, renowned for its commitment to quality and innovation in brewing.', 1759),
(2, 'Heineken', 'Netherlands', 'https://www.heineken.com', 'A global Dutch brewing company established in 1864, famous for its premium lagers and sustainable practices.', 1864),
(3, 'Budweiser', 'United States', 'https://www.budweiser.com', 'An American brewing giant since 1876, known for its classic lagers and cultural impact in the beer industry.', 1876),
(4, 'Corona', 'Mexico', 'https://www.corona.com', 'A Mexican brewery founded in 1925, celebrated for its light lagers and association with leisure and relaxation.', 1925),
(5, 'Stella Artois', 'Belgium', 'https://www.stellaartois.com', 'A Belgian brewing tradition dating back to 1366, recognized for its pilsners and rich heritage.', 1366),
(6, 'Carlsberg', 'Denmark', 'https://www.carlsberg.com', 'A Danish brewery established in 1847, pioneering in brewing science and known for its pilsners worldwide.', 1847),
(7, 'Becks', 'Germany', 'https://www.becks.com', 'A German brewing legacy since 1873, famous for its crisp pilsners and international appeal.', 1873),
(8, 'Pilsner Urquell', 'Czech Republic', 'https://www.pilsnerurquell.com', 'The original Czech pilsner brewery from 1842, setting the standard for pilsner beers globally.', 1842),
(9, 'Blue Moon', 'United States', 'https://www.bluemoonbrewing.com', 'An American craft brewery since 1995, known for its Belgian-style wheat beers and innovative flavors.', 1995),
(10, 'Sierra Nevada', 'United States', 'https://www.sierranevada.com', 'A pioneering American craft brewery founded in 1979, celebrated for its hoppy ales and environmental stewardship.', 1979);

-- Dummy data for beer table
INSERT INTO beer (beer_id, name, country_of_origin, alcohol_content, description, price, brand_id, beer_kind, container_kind, volume_liters) VALUES
(1, 'Guinness Draught', 'Ireland', 4.20, 'The iconic Irish stout with a creamy head and rich, roasted flavor.', 5.50, 1, 'stout', 'bottle', 0.33),
(2, 'Guinness Extra Stout', 'Ireland', 7.50, 'A stronger version of the classic stout, with deeper malt flavors.', 6.00, 1, 'stout', 'can', 0.44),
(3, 'Heineken Lager', 'Netherlands', 5.00, 'A crisp, golden lager with a balanced bitterness and clean finish.', 4.50, 2, 'lager', 'bottle', 0.33),
(4, 'Budweiser Lager', 'United States', 5.00, 'A classic American lager, light-bodied with a smooth, refreshing taste.', 3.50, 3, 'lager', 'can', 0.35),
(5, 'Bud Light', 'United States', 4.20, 'A lighter version of Budweiser, with fewer calories and a crisp finish.', 3.00, 3, 'lager', 'can', 0.35),
(6, 'Corona Extra', 'Mexico', 4.60, 'A pale lager with a light, crisp taste, perfect for sunny days.', 4.00, 4, 'lager', 'bottle', 0.33),
(7, 'Stella Artois Lager', 'Belgium', 5.20, 'A European pilsner with a smooth, malty profile and subtle hop bitterness.', 5.00, 5, 'lager', 'bottle', 0.33),
(8, 'Stella Artois Cidre', 'Belgium', 4.50, 'A refreshing apple cider with a crisp, fruity flavor.', 4.50, 5, 'ale', 'bottle', 0.33),
(9, 'Carlsberg Lager', 'Denmark', 5.00, 'A Danish pilsner with a clean, balanced taste and golden color.', 4.20, 6, 'lager', 'bottle', 0.33),
(10, 'Carlsberg Elephant', 'Denmark', 7.20, 'A strong lager with a robust flavor and high alcohol content.', 5.80, 6, 'lager', 'can', 0.50),
(11, 'Becks Pilsner', 'Germany', 4.90, 'A classic German pilsner, crisp and refreshing with herbal notes.', 4.00, 7, 'lager', 'bottle', 0.33),
(12, 'Becks Dark', 'Germany', 4.90, 'A dark lager with malt richness and subtle sweetness.', 4.50, 7, 'lager', 'bottle', 0.33),
(13, 'Pilsner Urquell', 'Czech Republic', 4.40, 'The original pilsner, golden and hoppy with a clean finish.', 4.80, 8, 'lager', 'bottle', 0.50),
(14, 'Blue Moon Belgian White', 'United States', 5.40, 'A Belgian-style wheat beer with orange and coriander flavors.', 5.20, 9, 'weisse', 'bottle', 0.35),
(15, 'Sierra Nevada Pale Ale', 'United States', 5.60, 'A hoppy American pale ale with citrus and pine aromas.', 5.50, 10, 'ale', 'can', 0.35),
(16, 'Sierra Nevada Stout', 'United States', 5.80, 'A rich stout with roasted malt and chocolate notes.', 6.00, 10, 'stout', 'bottle', 0.33),
(17, 'Heineken 0.0', 'Netherlands', 0.00, 'A non-alcoholic lager with the same crisp taste as the original.', 3.50, 2, 'lager', 'can', 0.33),
(18, 'Budweiser Zero', 'United States', 0.00, 'A zero-calorie, zero-alcohol version of the classic lager.', 2.50, 3, 'lager', 'can', 0.35),
(19, 'Corona Light', 'Mexico', 4.10, 'A lighter version of Corona Extra, with fewer calories.', 3.80, 4, 'lager', 'bottle', 0.33),
(20, 'Stella Artois 0.0', 'Belgium', 0.00, 'A non-alcoholic pilsner maintaining the smooth profile.', 4.00, 5, 'lager', 'bottle', 0.33);

-- Dummy data for supplier table
INSERT INTO supplier (supplier_id, name, contact_person, email, phone, street, city, postal_code, country, afm) VALUES
(1, 'Global Beer Distributors', 'John Smith', 'john@globalbeer.com', '+1-555-1234', '123 Main St', 'New York', '10001', 'United States', '1234567890123'),
(2, 'European Brew Supplies', 'Anna Müller', 'anna@europeanbrew.com', '+49-30-987654', 'Bahnhofstrasse 45', 'Berlin', '10115', 'Germany', '9876543210987'),
(3, 'Pacific Imports Ltd', 'Carlos Rivera', 'carlos@pacificimports.com', '+52-55-456789', 'Avenida Reforma 100', 'Mexico City', '06500', 'Mexico', '4567890123456'),
(4, 'Irish Stout Suppliers', 'Liam O''Connor', 'liam@irishstout.com', '+353-1-234567', 'Dublin Road 78', 'Dublin', 'D02 X285', 'Ireland', '7890123456789'),
(5, 'Belgian Ale Partners', 'Marie Dubois', 'marie@belgianale.com', '+32-2-345678', 'Rue de la bière 22', 'Brussels', '1000', 'Belgium', '0123456789012'),
(6, 'Danish Brew Logistics', 'Erik Nielsen', 'erik@danishbrew.com', '+45-33-112233', 'Kongens Nytorv 1', 'Copenhagen', '1050', 'Denmark', '1122334455667'),
(7, 'German Import Co.', 'Hans Weber', 'hans@germanimport.com', '+49-69-445566', 'Zeil 50', 'Frankfurt', '60313', 'Germany', '4455667788990'),
(8, 'Czech Beer Exports', 'Pavel Novak', 'pavel@czechbeer.com', '+420-2-778899', 'Václavské náměstí 10', 'Prague', '110 00', 'Czech Republic', '7788990011223'),
(9, 'US Craft Suppliers', 'Emily Davis', 'emily@uscraft.com', '+1-415-667788', 'Market Street 200', 'San Francisco', '94102', 'United States', '6677889900114'),
(10, 'International Brew Alliance', 'Sophia Lee', 'sophia@intbrew.com', '+44-20-334455', 'Oxford Street 150', 'London', 'W1D 1BS', 'United Kingdom', '3344556677889');

-- Dummy data for brandsuppliedbysupplier table
INSERT INTO brandsuppliedbysupplier (supplier_id, brand_id, supply_price) VALUES
(1, 1, 4.00),  -- Global supplies Guinness
(1, 2, 3.50),  -- Global supplies Heineken
(1, 3, 3.00),  -- Global supplies Budweiser
(2, 2, 3.60),  -- European supplies Heineken
(2, 5, 4.20),  -- European supplies Stella
(3, 3, 3.10),  -- Pacific supplies Budweiser
(3, 4, 3.80),  -- Pacific supplies Corona
(4, 1, 4.10),  -- Irish supplies Guinness
(5, 5, 4.30),  -- Belgian supplies Stella
(6, 6, 4.50),  -- Danish supplies Carlsberg
(6, 7, 4.00),  -- Danish supplies Becks
(7, 7, 3.90),  -- German supplies Becks
(7, 8, 4.20),  -- German supplies Pilsner Urquell
(8, 8, 4.30),  -- Czech supplies Pilsner Urquell
(8, 6, 4.40),  -- Czech supplies Carlsberg
(9, 9, 5.00),  -- US Craft supplies Blue Moon
(9, 10, 5.20),  -- US Craft supplies Sierra Nevada
(10, 1, 4.10),  -- International supplies Guinness
(10, 2, 3.60),  -- International supplies Heineken
(10, 4, 3.90);  -- International supplies Corona

-- Dummy data for customer table
INSERT INTO customer (customer_id, registration_date, loyalty_points, email, phone, street, city, postal_code, country, first_name, last_name, birth_date) VALUES
(1, '2023-01-15', 50, 'john.doe@example.com', '+1-555-1111', '456 Elm St', 'New York', '10002', 'United States', 'John', 'Doe', '1985-03-20'),
(2, '2023-05-10', 30, 'jane.smith@example.com', '+1-555-2222', '789 Oak Ave', 'Los Angeles', '90210', 'United States', 'Jane', 'Smith', '1990-07-15'),
(3, '2022-11-22', 100, 'mike.johnson@example.com', '+49-30-333333', 'Musterstrasse 12', 'Berlin', '10117', 'Germany', 'Mike', 'Johnson', '1982-12-05'),
(4, '2024-02-14', 0, 'anna.williams@example.com', '+44-20-444444', 'Baker Street 221B', 'London', 'NW1 6XE', 'United Kingdom', 'Anna', 'Williams', '1995-09-30'),
(5, '2023-08-30', 75, 'carlos.garcia@example.com', '+52-55-555555', 'Calle Principal 45', 'Mexico City', '06500', 'Mexico', 'Carlos', 'Garcia', '1988-04-12'),
(6, '2022-06-18', 120, 'sofia.patel@example.com', '+91-22-666666', 'MG Road 78', 'Mumbai', '400001', 'India', 'Sofia', 'Patel', '1975-11-25'),
(7, '2024-01-05', 10, 'liam.brown@example.com', '+353-1-777777', 'O''Connell Street 56', 'Dublin', 'D01 F5P2', 'Ireland', 'Liam', 'Brown', '1992-06-08'),
(8, '2023-12-01', 60, 'marie.dupont@example.com', '+33-1-888888', 'Rue de la Paix 34', 'Paris', '75002', 'France', 'Marie', 'Dupont', '1987-01-18'),
(9, '2023-03-25', 45, 'alex.taylor@example.com', '+61-2-999999', 'George Street 100', 'Sydney', '2000', 'Australia', 'Alex', 'Taylor', '1993-05-14'),
(10, '2022-09-10', 80, 'olivia.martinez@example.com', '+34-91-000000', 'Gran Via 50', 'Madrid', '28013', 'Spain', 'Olivia', 'Martinez', '1989-11-22'),
(11, '2024-04-18', 25, 'david.lee@example.com', '+82-2-111111', 'Myeongdong 30', 'Seoul', '04536', 'South Korea', 'David', 'Lee', '1991-08-09'),
(12, '2023-07-12', 90, 'emma.wilson@example.com', '+27-21-222222', 'Long Street 75', 'Cape Town', '8001', 'South Africa', 'Emma', 'Wilson', '1984-02-28'),
(13, '2022-12-05', 55, 'noah.garcia@example.com', '+54-11-333333', 'Avenida 9 de Julio 200', 'Buenos Aires', 'C1002', 'Argentina', 'Noah', 'Garcia', '1996-12-17'),
(14, '2024-05-30', 15, 'ava.johnson@example.com', '+55-21-444444', 'Copacabana 150', 'Rio de Janeiro', '22070-001', 'Brazil', 'Ava', 'Johnson', '1994-06-05'),
(15, '2023-10-20', 70, 'william.brown@example.com', '+39-06-555555', 'Via del Corso 80', 'Rome', '00186', 'Italy', 'William', 'Brown', '1986-10-11');

-- Dummy data for pub table
INSERT INTO pub (pub_id, name, manager_name, phone, street, city, postal_code, country) VALUES
(1, 'The Crown & Anchor', 'Maria Papadopoulou', '+302310123456', 'Tsimiski 12', 'Thessaloniki', '54621', 'Greece'),
(2, 'The Old Brewery House', 'Giorgos Nikolaou', '+302103334455', 'Ermou 45', 'Athens', '10563', 'Greece'),
(3, 'The Kings Arms', 'Dimitris Ioannou', '+302610223344', 'Korinthou 50', 'Patras', '26221', 'Greece'),
(4, 'The Bell Inn', 'Eleni Georgiou', '+302810334455', 'Kalokairinou 20', 'Heraklion', '71202', 'Greece'),
(5, 'The Plough & Harrow', 'Kostas Papanikolaou', '+302410445566', 'Kountouriotou 15', 'Larissa', '41222', 'Greece'),
(6, 'The Red Lion', 'Anna Karagianni', '+302421556677', 'Dimokratias 30', 'Volos', '38221', 'Greece'),
(7, 'The George & Dragon', 'Nikos Christou', '+302651667788', 'Averof 10', 'Ioannina', '45221', 'Greece'),
(8, 'The Royal Oak', 'Sofia Dimitriou', '+302510778899', 'Venizelou 5', 'Kavala', '65201', 'Greece'),
(9, 'The Three Tuns', 'Manolis Antoniou', '+302241889900', 'Sokratous 100', 'Rhodes', '85100', 'Greece'),
(10, 'The Greyhound Inn', 'Maria Kalogeraki', '+302821990011', 'Halidon 25', 'Chania', '73131', 'Greece');

-- Dummy data for employee table
INSERT INTO employee (employee_id, hire_date, salary, email, shift, position, phone, first_name, last_name, pub_id) VALUES
(1, '2020-05-01', 1200.00, 'bartender1@pub.com', 'evening', 'bartender', '+302310111111', 'James', 'Thompson', 1),
(2, '2021-03-15', 2000.00, 'manager1@pub.com', 'morning', 'manager', '+302103333333', 'Sarah', 'Wilson', 2),
(3, '2022-07-10', 950.00, 'waiter1@pub.com', 'night', 'waiter', '+302610222222', 'Michael', 'Davies', 3),
(4, '2019-11-20', 1100.00, 'bartender2@pub.com', 'evening', 'bartender', '+302810333333', 'Emma', 'Bennett', 4),
(5, '2023-01-05', 1300.00, 'cleaner1@pub.com', 'morning', 'cleaner', '+302410444444', 'Robert', 'Cooper', 5),
(6, '2020-09-12', 1400.00, 'manager2@pub.com', 'morning', 'manager', '+302421555555', 'Jessica', 'Miller', 6),
(7, '2021-04-18', 1000.00, 'waiter2@pub.com', 'night', 'waiter', '+302651666666', 'Daniel', 'Taylor', 7),
(8, '2018-06-25', 1250.00, 'bartender3@pub.com', 'evening', 'bartender', '+302510777777', 'Victoria', 'Harris', 8),
(9, '2022-02-14', 1350.00, 'manager3@pub.com', 'morning', 'manager', '+302241888888', 'Christopher', 'Clark', 9),
(10, '2019-08-30', 900.00, 'cleaner2@pub.com', 'night', 'cleaner', '+302821999999', 'Rachel', 'Martin', 10),
(11, '2020-02-07', 1150.00, 'bartender4@pub.com', 'evening', 'bartender', '+302310111112', 'Thomas', 'Anderson', 1),
(12, '2021-11-15', 950.00, 'waiter3@pub.com', 'night', 'waiter', '+302103333334', 'Laura', 'Lewis', 2),
(13, '2023-03-22', 1100.00, 'bartender5@pub.com', 'evening', 'bartender', '+302610222223', 'William', 'White', 3),
(14, '2020-07-09', 1050.00, 'waiter4@pub.com', 'morning', 'waiter', '+302810333334', 'Amanda', 'Jackson', 4),
(15, '2022-06-20', 1200.00, 'bartender6@pub.com', 'evening', 'bartender', '+302410444445', 'Edward', 'Robinson', 5),
(16, '2021-08-11', 950.00, 'waiter5@pub.com', 'morning', 'waiter', '+302421555556', 'Michelle', 'Garcia', 6),
(17, '2019-12-03', 1250.00, 'bartender7@pub.com', 'evening', 'bartender', '+302651666667', 'David', 'Martinez', 7),
(18, '2023-05-14', 1000.00, 'waiter6@pub.com', 'night', 'waiter', '+302510777778', 'Elizabeth', 'Rodriguez', 8),
(19, '2020-10-28', 1150.00, 'bartender8@pub.com', 'evening', 'bartender', '+302241888889', 'Joseph', 'Brown', 9),
(20, '2022-01-19', 950.00, 'waiter7@pub.com', 'morning', 'waiter', '+302821999990', 'Patricia', 'Green', 10);

-- Dummy data for customerreviewsbeer table
INSERT INTO customerreviewsbeer (beer_id, customer_id, comment, review_date, rating) VALUES
(1, 1, 'Classic stout, smooth and creamy. A must-try!', '2024-03-15', 4.5),
(2, 1, 'Stronger version, great for special occasions.', '2024-04-10', 4.0),
(3, 2, 'Refreshing lager, perfect for hot days.', '2024-05-20', 4.2),
(4, 3, 'Light and easy to drink, good value.', '2024-06-05', 3.8),
(5, 4, 'Even lighter, great for low-calorie options.', '2024-07-12', 4.0),
(6, 5, 'Tastes like vacation in a bottle!', '2024-08-18', 4.7),
(7, 6, 'Smooth pilsner, pairs well with food.', '2024-09-22', 4.3),
(8, 7, 'Unique cider option, fruity and crisp.', '2024-10-30', 3.5),
(1, 8, 'Love the Irish stout tradition.', '2024-11-14', 5.0),
(3, 7, 'Consistent quality every time.', '2024-12-01', 4.1),
(9, 9, 'Great Danish pilsner, very balanced.', '2024-01-10', 4.4),
(10, 10, 'Strong and flavorful, worth the price.', '2024-02-15', 4.6),
(11, 11, 'Crisp German pilsner, refreshing.', '2024-03-25', 4.2),
(12, 12, 'Nice dark lager, subtle sweetness.', '2024-04-30', 4.0),
(13, 13, 'Original pilsner, hoppy and clean.', '2024-05-05', 4.8),
(14, 14, 'Belgian white with great citrus notes.', '2024-06-20', 4.5),
(15, 15, 'Hoppy pale ale, perfect for IPA lovers.', '2024-07-25', 4.7),
(16, 9, 'Rich stout, chocolatey and smooth.', '2024-08-10', 4.9),
(17, 10, 'Non-alcoholic but still tasty.', '2024-09-15', 3.7),
(18, 11, 'Zero everything, surprisingly good.', '2024-10-20', 3.9),
(19, 12, 'Lighter Corona, still enjoyable.', '2024-11-25', 4.1),
(20, 13, 'Smooth non-alcoholic pilsner.', '2024-12-05', 4.2),
(4, 14, 'Reliable lager for everyday drinking.', '2024-01-20', 4.0),
(6, 15, 'Classic Corona, beach vibes.', '2024-02-28', 4.6),
(7, 9, 'Stella never disappoints.', '2024-03-10', 4.3);

-- Dummy data for orders table
INSERT INTO orders (order_id, status, customer_id, pub_id, total_amount, order_date, payment_method) VALUES
(1, 'completed', 1, 1, 15.50, '2024-03-20', 'card'),
(2, 'pending', 2, 2, 8.00, '2024-05-25', 'cash'),
(3, 'completed', 3, 3, 22.00, '2024-06-10', 'bank_transaction'),
(4, 'cancelled', 4, 1, NULL, '2024-07-15', 'card'),
(5, 'completed', 5, 2, 12.50, '2024-08-22', 'check'),
(6, 'pending', 6, 3, 18.75, '2024-09-28', 'card'),
(7, 'completed', 7, 1, 9.00, '2024-10-05', 'cash'),
(8, 'completed', 8, 2, 25.00, '2024-11-18', 'bank_transaction'),
(9, 'pending', 1, 3, 14.00, '2024-12-05', 'card'),
(10, 'completed', 3, 1, 16.50, '2024-12-10', 'cash'),
(11, 'completed', 9, 2, 20.00, '2024-01-15', 'card'),
(12, 'pending', 10, 3, 11.50, '2024-02-20', 'cash'),
(13, 'completed', 11, 1, 28.00, '2024-03-30', 'bank_transaction'),
(14, 'cancelled', 12, 2, NULL, '2024-04-10', 'check'),
(15, 'completed', 13, 3, 15.75, '2024-05-18', 'card'),
(16, 'pending', 14, 1, 22.25, '2024-06-25', 'cash'),
(17, 'completed', 15, 2, 19.00, '2024-07-08', 'bank_transaction'),
(18, 'completed', 9, 3, 13.50, '2024-08-12', 'card'),
(19, 'pending', 10, 1, 17.00, '2024-09-05', 'check'),
(20, 'completed', 11, 2, 24.50, '2024-10-22', 'cash');

-- Dummy data for orderhasbeer table
INSERT INTO orderhasbeer (order_id, beer_id, line_number, quantity, price_per_unit, line_total) VALUES
(1, 1, 1, 2, 3.50, 7.00),
(1, 3, 2, 1, 2.50, 2.50),
(2, 4, 1, 2, 2.80, 5.60),
(3, 2, 1, 3, 3.00, 9.00),
(3, 5, 2, 2, 2.50, 5.00),
(3, 7, 3, 1, 3.00, 3.00),
(4, 6, 1, 2, 2.70, 5.40),
(4, 8, 2, 1, 2.90, 2.90),
(5, 7, 1, 3, 3.00, 9.00),
(5, 1, 2, 1, 3.50, 3.50),
(6, 4, 1, 2, 2.80, 5.60),
(6, 5, 2, 1, 2.50, 2.50),
(7, 3, 1, 4, 2.50, 10.00),
(7, 6, 2, 1, 2.70, 2.70),
(7, 2, 3, 1, 3.00, 3.00),
(8, 1, 1, 1, 3.50, 3.50),
(8, 4, 2, 2, 2.80, 5.60),
(9, 5, 1, 3, 2.50, 7.50),
(9, 7, 2, 1, 3.00, 3.00),
(9, 8, 3, 1, 2.90, 2.90),
(10, 9, 1, 2, 3.20, 6.40),
(10, 11, 2, 2, 3.80, 7.60),
(10, 10, 3, 1, 3.00, 3.00),
(11, 2, 1, 2, 3.00, 6.00),
(11, 6, 2, 3, 2.70, 8.10),
(11, 1, 3, 2, 3.50, 7.00),
(12, 3, 1, 1, 2.50, 2.50),
(13, 4, 1, 3, 2.80, 8.40),
(13, 5, 2, 2, 2.50, 5.00),
(13, 7, 3, 1, 3.00, 3.00),
(14, 8, 1, 2, 2.90, 5.80),
(14, 9, 2, 1, 3.20, 3.20),
(15, 10, 1, 2, 3.00, 6.00),
(15, 11, 2, 1, 3.80, 3.80),
(16, 1, 1, 3, 3.50, 10.50),
(16, 2, 2, 1, 3.00, 3.00),
(17, 6, 1, 2, 2.70, 5.40),
(17, 8, 2, 2, 2.90, 5.80),
(18, 3, 1, 1, 2.50, 2.50),
(18, 5, 2, 2, 2.50, 5.00),
(19, 4, 1, 2, 2.80, 5.60),
(19, 7, 2, 1, 3.00, 3.00),
(20, 10, 1, 1, 3.00, 3.00),
(20, 11, 2, 2, 3.80, 7.60),
(1, 5, 3, 2, 2.50, 5.00),
(2, 6, 2, 1, 2.70, 2.70),
(3, 9, 2, 2, 3.20, 6.40),
(5, 2, 2, 1, 3.00, 3.00),
(5, 8, 3, 2, 2.90, 5.80),
(6, 3, 2, 1, 2.50, 2.50),
(8, 12, 3, 1, 4.50, 4.50),
(9, 1, 4, 2, 3.50, 7.00),
(9, 2, 4, 1, 3.00, 3.00),
(10, 13, 4, 1, 4.80, 4.80),
(11, 7, 4, 1, 3.00, 3.00),
(11, 9, 5, 2, 3.20, 6.40),
(12, 5, 2, 2, 2.50, 5.00),
(13, 6, 4, 1, 2.70, 2.70),
(14, 2, 3, 2, 3.00, 6.00),
(14, 5, 4, 1, 2.50, 2.50),
(15, 9, 3, 2, 3.20, 6.40),
(16, 4, 2, 2, 2.80, 5.60),
(16, 6, 3, 1, 2.70, 2.70),
(17, 11, 3, 1, 3.80, 3.80),
(18, 6, 3, 2, 2.70, 5.40),
(19, 9, 3, 1, 3.20, 3.20),
(20, 13, 3, 2, 4.80, 9.60),
(1, 14, 4, 1, 5.20, 5.20),
(2, 15, 3, 2, 5.50, 11.00),
(3, 16, 3, 1, 6.00, 6.00),
(5, 17, 2, 1, 3.50, 3.50),
(6, 18, 3, 2, 2.50, 5.00),
(8, 19, 2, 1, 4.00, 4.00),
(11, 20, 6, 1, 4.20, 4.20);

-- Dummy data for pubhasbeer table
INSERT INTO pubhasbeer (pub_id, beer_id, quantity_available, last_updated, reorder_threshold, storage_location) VALUES
(1, 1, 50.00, '2024-12-01', 10.00, 'Shelf A1'),
(1, 3, 75.00, '2024-12-02', 15.00, 'Shelf A2'),
(1, 4, 60.00, '2024-12-03', 12.00, 'Shelf A3'),
(2, 2, 40.00, '2024-11-28', 8.00, 'Cooler B1'),
(2, 5, 55.00, '2024-11-29', 10.00, 'Cooler B2'),
(2, 7, 80.00, '2024-11-30', 20.00, 'Shelf B3'),
(3, 4, 45.00, '2024-12-04', 9.00, 'Bar C1'),
(3, 6, 70.00, '2024-12-05', 14.00, 'Bar C2'),
(3, 8, 30.00, '2024-12-06', 6.00, 'Fridge C3'),
(4, 1, 65.00, '2024-11-25', 13.00, 'Shelf D1'),
(4, 2, 50.00, '2024-11-26', 10.00, 'Shelf D2'),
(4, 7, 90.00, '2024-11-27', 18.00, 'Cooler D3'),
(5, 5, 55.00, '2024-12-07', 11.00, 'Bar E1'),
(5, 6, 40.00, '2024-12-08', 8.00, 'Bar E2'),
(5, 8, 85.00, '2024-12-09', 17.00, 'Fridge E3'),
(6, 9, 60.00, '2024-12-10', 12.00, 'Shelf F1'),
(6, 10, 45.00, '2024-12-11', 9.00, 'Cooler F2'),
(6, 11, 70.00, '2024-12-12', 14.00, 'Bar F3'),
(7, 1, 55.00, '2024-11-20', 11.00, 'Shelf G1'),
(7, 2, 40.00, '2024-11-21', 8.00, 'Cooler G2'),
(7, 3, 80.00, '2024-11-22', 16.00, 'Bar G3'),
(8, 5, 65.00, '2024-12-13', 13.00, 'Shelf H1'),
(8, 6, 50.00, '2024-12-14', 10.00, 'Fridge H2'),
(8, 7, 75.00, '2024-12-15', 15.00, 'Cooler H3'),
(9, 4, 55.00, '2024-11-15', 11.00, 'Bar I1'),
(9, 8, 40.00, '2024-11-16', 8.00, 'Shelf I2'),
(9, 10, 60.00, '2024-11-17', 12.00, 'Fridge I3'),
(10, 1, 70.00, '2024-12-16', 14.00, 'Shelf J1'),
(10, 11, 50.00, '2024-12-17', 10.00, 'Bar J2'),
(10, 9, 85.00, '2024-12-18', 17.00, 'Cooler J3');

-- Dummy data for supplierorder table
INSERT INTO supplierorder (supplier_order_id, order_date, status, total_cost, expected_delivery_date, actual_delivery_date, payment_method, reason_pending, supplier_id, pub_id) VALUES
(1, '2024-12-01', 'completed', 450.00, '2024-12-05', '2024-12-05', 'bank_transaction', NULL, 1, 1),
(2, '2024-12-02', 'completed', 320.00, '2024-12-06', '2024-12-06', 'card', NULL, 2, 2),
(3, '2024-12-03', 'pending', 280.00, '2024-12-10', NULL, NULL, 'Waiting for payment approval', 3, 3),
(4, '2024-12-04', 'completed', 380.00, '2024-12-08', '2024-12-08', 'bank_transaction', NULL, 4, 4),
(5, '2024-12-05', 'pending', 520.00, '2024-12-12', NULL, NULL, 'Driver delayed due to weather', 5, 5),
(6, '2024-12-06', 'completed', 410.00, '2024-12-10', '2024-12-10', 'card', NULL, 6, 6),
(7, '2024-12-07', 'cancelled', 350.00, '2024-12-14', NULL, NULL, 'Customer cancelled order', 7, 7),
(8, '2024-12-08', 'pending', 490.00, '2024-12-15', NULL, NULL, 'Awaiting stock availability', 8, 8),
(9, '2024-12-09', 'completed', 275.00, '2024-12-13', '2024-12-13', 'bank_transaction', NULL, 9, 1),
(10, '2024-12-10', 'pending', 560.00, '2024-12-17', NULL, NULL, 'Pending supplier confirmation', 10, 2);