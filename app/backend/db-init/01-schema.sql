DROP SCHEMA IF EXISTS `beerthusiasts`;
CREATE SCHEMA `beerthusiasts`;
USE `beerthusiasts`;


-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: beerthusiasts
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `beer`
--

DROP TABLE IF EXISTS `beer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `beer` (
  `beer_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `country_of_origin` varchar(45) DEFAULT NULL,
  `alcohol_content` decimal(4,2) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `price` decimal(4,2) DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `beer_kind` enum('lager','ale','stout','porter','weisse','ipa') DEFAULT NULL,
  `container_kind` enum('glass','can','boot','bottle') DEFAULT NULL,
  `volume_liters` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`beer_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `beer_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`brand_id`),
  CONSTRAINT `beer_chk_1` CHECK (((`alcohol_content` >= 0) and (`alcohol_content` <= 100))),
  CONSTRAINT `beer_chk_2` CHECK ((`price` >= 0)),
  CONSTRAINT `beer_chk_3` CHECK ((`volume_liters` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `beer`
--

LOCK TABLES `beer` WRITE;
/*!40000 ALTER TABLE `beer` DISABLE KEYS */;
/*!40000 ALTER TABLE `beer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `beerswithbrandinfo`
--

DROP TABLE IF EXISTS `beerswithbrandinfo`;
/*!50001 DROP VIEW IF EXISTS `beerswithbrandinfo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `beerswithbrandinfo` AS SELECT 
 1 AS `beer_id`,
 1 AS `brand_id`,
 1 AS `brand_name`,
 1 AS `country_of_origin`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `beerwithbrand`
--

DROP TABLE IF EXISTS `beerwithbrand`;
/*!50001 DROP VIEW IF EXISTS `beerwithbrand`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `beerwithbrand` AS SELECT 
 1 AS `beer_id`,
 1 AS `beer_name`,
 1 AS `brand_id`,
 1 AS `brand_name`,
 1 AS `country_of_origin`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
  `brand_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `country_of_origin` varchar(45) DEFAULT NULL,
  `website` varchar(45) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `established_year` smallint DEFAULT NULL,
  PRIMARY KEY (`brand_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brandsuppliedbysupplier`
--

DROP TABLE IF EXISTS `brandsuppliedbysupplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brandsuppliedbysupplier` (
  `supplier_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `supply_price` decimal(4,2) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`,`brand_id`),
  KEY `brand_id` (`brand_id`),
  CONSTRAINT `brandsuppliedbysupplier_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`),
  CONSTRAINT `brandsuppliedbysupplier_ibfk_2` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`brand_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brandsuppliedbysupplier`
--

LOCK TABLES `brandsuppliedbysupplier` WRITE;
/*!40000 ALTER TABLE `brandsuppliedbysupplier` DISABLE KEYS */;
/*!40000 ALTER TABLE `brandsuppliedbysupplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `registration_date` date DEFAULT NULL,
  `loyalty_points` int DEFAULT '0',
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `postal_code` varchar(12) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customerreviewsbeer`
--

DROP TABLE IF EXISTS `customerreviewsbeer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customerreviewsbeer` (
  `beer_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `comment` varchar(500) DEFAULT NULL,
  `review_date` date DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT NULL,
  PRIMARY KEY (`beer_id`,`customer_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `customerreviewsbeer_ibfk_1` FOREIGN KEY (`beer_id`) REFERENCES `beer` (`beer_id`),
  CONSTRAINT `customerreviewsbeer_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `customerreviewsbeer_chk_1` CHECK (((`rating` >= 0) and (`rating` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customerreviewsbeer`
--

LOCK TABLES `customerreviewsbeer` WRITE;
/*!40000 ALTER TABLE `customerreviewsbeer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customerreviewsbeer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `customersafter2022`
--

DROP TABLE IF EXISTS `customersafter2022`;
/*!50001 DROP VIEW IF EXISTS `customersafter2022`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `customersafter2022` AS SELECT 
 1 AS `customer_id`,
 1 AS `registration_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `hire_date` date DEFAULT NULL,
  `salary` decimal(6,2) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `shift` enum('morning','evening','night') DEFAULT NULL,
  `position` enum('bartender','manager','waiter','cleaner') DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `pub_id` int DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  KEY `pub_id` (`pub_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`pub_id`) REFERENCES `pub` (`pub_id`),
  CONSTRAINT `employee_chk_1` CHECK ((`salary` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `employeeshighsalarygreece`
--

DROP TABLE IF EXISTS `employeeshighsalarygreece`;
/*!50001 DROP VIEW IF EXISTS `employeeshighsalarygreece`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `employeeshighsalarygreece` AS SELECT 
 1 AS `employee_id`,
 1 AS `pub_id`,
 1 AS `salary`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `greekemployeeshighsalary`
--

DROP TABLE IF EXISTS `greekemployeeshighsalary`;
/*!50001 DROP VIEW IF EXISTS `greekemployeeshighsalary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `greekemployeeshighsalary` AS SELECT 
 1 AS `employee_id`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `salary`,
 1 AS `pub_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `orderhasbeer`
--

DROP TABLE IF EXISTS `orderhasbeer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderhasbeer` (
  `order_id` int NOT NULL,
  `line_number` int DEFAULT NULL,
  `beer_id` int NOT NULL,
  `quantity` int DEFAULT NULL,
  `price_per_unit` decimal(4,2) DEFAULT NULL,
  `line_total` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`order_id`,`beer_id`),
  KEY `beer_id` (`beer_id`),
  CONSTRAINT `orderhasbeer_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  CONSTRAINT `orderhasbeer_ibfk_2` FOREIGN KEY (`beer_id`) REFERENCES `beer` (`beer_id`),
  CONSTRAINT `orderhasbeer_chk_1` CHECK ((`quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderhasbeer`
--

LOCK TABLES `orderhasbeer` WRITE;
/*!40000 ALTER TABLE `orderhasbeer` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderhasbeer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `status` enum('completed','pending','cancelled') DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `pub_id` int DEFAULT NULL,
  `total_amount` decimal(6,2) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `payment_method` enum('card','cash','check','bank_transaction') DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`),
  KEY `pub_id` (`pub_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`pub_id`) REFERENCES `pub` (`pub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `positivebeerreviews`
--

DROP TABLE IF EXISTS `positivebeerreviews`;
/*!50001 DROP VIEW IF EXISTS `positivebeerreviews`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `positivebeerreviews` AS SELECT 
 1 AS `customer_id`,
 1 AS `beer_id`,
 1 AS `comment`,
 1 AS `rating`,
 1 AS `beer_name`,
 1 AS `brand_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `positivereviewswithbeerbrand`
--

DROP TABLE IF EXISTS `positivereviewswithbeerbrand`;
/*!50001 DROP VIEW IF EXISTS `positivereviewswithbeerbrand`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `positivereviewswithbeerbrand` AS SELECT 
 1 AS `beer_id`,
 1 AS `customer_id`,
 1 AS `rating`,
 1 AS `brand_id`,
 1 AS `description`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `pub`
--

DROP TABLE IF EXISTS `pub`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pub` (
  `pub_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `manager_name` varchar(45) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `postal_code` varchar(12) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`pub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pub`
--

LOCK TABLES `pub` WRITE;
/*!40000 ALTER TABLE `pub` DISABLE KEYS */;
/*!40000 ALTER TABLE `pub` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pubhasbeer`
--

DROP TABLE IF EXISTS `pubhasbeer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pubhasbeer` (
  `pub_id` int NOT NULL,
  `beer_id` int NOT NULL,
  `quantity_available` decimal(6,2) DEFAULT NULL,
  `last_updated` date DEFAULT NULL,
  `reorder_threshold` decimal(6,2) DEFAULT NULL,
  `storage_location` varchar(45) DEFAULT NULL,
  `remaining_until_reorder` decimal(6,2) GENERATED ALWAYS AS ((`quantity_available` - `reorder_threshold`)) STORED,
  PRIMARY KEY (`pub_id`,`beer_id`),
  KEY `beer_id` (`beer_id`),
  CONSTRAINT `pubhasbeer_ibfk_1` FOREIGN KEY (`pub_id`) REFERENCES `pub` (`pub_id`),
  CONSTRAINT `pubhasbeer_ibfk_2` FOREIGN KEY (`beer_id`) REFERENCES `beer` (`beer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pubhasbeer`
--

LOCK TABLES `pubhasbeer` WRITE;
/*!40000 ALTER TABLE `pubhasbeer` DISABLE KEYS */;
/*!40000 ALTER TABLE `pubhasbeer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `pubsneedrestock`
--

DROP TABLE IF EXISTS `pubsneedrestock`;
/*!50001 DROP VIEW IF EXISTS `pubsneedrestock`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `pubsneedrestock` AS SELECT 
 1 AS `pub_id`,
 1 AS `beer_id`,
 1 AS `remaining_until_reorder`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `pubstorestock`
--

DROP TABLE IF EXISTS `pubstorestock`;
/*!50001 DROP VIEW IF EXISTS `pubstorestock`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `pubstorestock` AS SELECT 
 1 AS `pub_id`,
 1 AS `beer_id`,
 1 AS `quantity_available`,
 1 AS `remaining_until_reorder`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `recentcustomers`
--

DROP TABLE IF EXISTS `recentcustomers`;
/*!50001 DROP VIEW IF EXISTS `recentcustomers`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `recentcustomers` AS SELECT 
 1 AS `customer_id`,
 1 AS `first_name`,
 1 AS `last_name`,
 1 AS `registration_date`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `supplier_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `contact_person` varchar(45) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `street` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `postal_code` varchar(12) DEFAULT NULL,
  `country` varchar(45) DEFAULT NULL,
  `afm` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`supplier_id`),
  UNIQUE KEY `afm` (`afm`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplierorder`
--

DROP TABLE IF EXISTS `supplierorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplierorder` (
  `supplier_order_id` int NOT NULL AUTO_INCREMENT,
  `order_date` date DEFAULT NULL,
  `status` enum('completed','pending','cancelled') DEFAULT NULL,
  `total_cost` decimal(10,2) DEFAULT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `actual_delivery_date` date DEFAULT NULL,
  `payment_method` enum('card','cash','check','bank_transaction') DEFAULT NULL,
  `reason_pending` varchar(45) DEFAULT NULL,
  `supplier_id` int DEFAULT NULL,
  `pub_id` int DEFAULT NULL,
  PRIMARY KEY (`supplier_order_id`),
  KEY `supplier_id` (`supplier_id`),
  KEY `pub_id` (`pub_id`),
  CONSTRAINT `supplierorder_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`supplier_id`),
  CONSTRAINT `supplierorder_ibfk_2` FOREIGN KEY (`pub_id`) REFERENCES `pub` (`pub_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplierorder`
--

LOCK TABLES `supplierorder` WRITE;
/*!40000 ALTER TABLE `supplierorder` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplierorder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `beerswithbrandinfo`
--

/*!50001 DROP VIEW IF EXISTS `beerswithbrandinfo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `beerswithbrandinfo` AS select `b`.`beer_id` AS `beer_id`,`br`.`brand_id` AS `brand_id`,`br`.`name` AS `brand_name`,`br`.`country_of_origin` AS `country_of_origin` from (`beer` `b` join `brand` `br` on((`b`.`brand_id` = `br`.`brand_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `beerwithbrand`
--

/*!50001 DROP VIEW IF EXISTS `beerwithbrand`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `beerwithbrand` AS select `b`.`beer_id` AS `beer_id`,`b`.`name` AS `beer_name`,`br`.`brand_id` AS `brand_id`,`br`.`name` AS `brand_name`,`br`.`country_of_origin` AS `country_of_origin` from (`beer` `b` join `brand` `br` on((`b`.`brand_id` = `br`.`brand_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `customersafter2022`
--

/*!50001 DROP VIEW IF EXISTS `customersafter2022`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `customersafter2022` AS select `customer`.`customer_id` AS `customer_id`,`customer`.`registration_date` AS `registration_date` from `customer` where (year(`customer`.`registration_date`) > 2022) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `employeeshighsalarygreece`
--

/*!50001 DROP VIEW IF EXISTS `employeeshighsalarygreece`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `employeeshighsalarygreece` AS select `e`.`employee_id` AS `employee_id`,`e`.`pub_id` AS `pub_id`,`e`.`salary` AS `salary` from (`employee` `e` join `pub` `p` on((`e`.`pub_id` = `p`.`pub_id`))) where ((`e`.`salary` > 1000) and (`p`.`country` = 'Greece')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `greekemployeeshighsalary`
--

/*!50001 DROP VIEW IF EXISTS `greekemployeeshighsalary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `greekemployeeshighsalary` AS select `e`.`employee_id` AS `employee_id`,`e`.`first_name` AS `first_name`,`e`.`last_name` AS `last_name`,`e`.`salary` AS `salary`,`p`.`name` AS `pub_name` from (`employee` `e` join `pub` `p` on((`e`.`pub_id` = `p`.`pub_id`))) where ((`e`.`salary` > 1000) and (`p`.`country` = 'Greece')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `positivebeerreviews`
--

/*!50001 DROP VIEW IF EXISTS `positivebeerreviews`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `positivebeerreviews` AS select `crb`.`customer_id` AS `customer_id`,`crb`.`beer_id` AS `beer_id`,`crb`.`comment` AS `comment`,`crb`.`rating` AS `rating`,`b`.`name` AS `beer_name`,`br`.`name` AS `brand_name` from ((`customerreviewsbeer` `crb` join `beer` `b` on((`crb`.`beer_id` = `b`.`beer_id`))) join `brand` `br` on((`b`.`brand_id` = `br`.`brand_id`))) where (`crb`.`rating` > 3) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `positivereviewswithbeerbrand`
--

/*!50001 DROP VIEW IF EXISTS `positivereviewswithbeerbrand`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `positivereviewswithbeerbrand` AS select `crb`.`beer_id` AS `beer_id`,`crb`.`customer_id` AS `customer_id`,`crb`.`rating` AS `rating`,`b`.`brand_id` AS `brand_id`,`b`.`description` AS `description` from (`customerreviewsbeer` `crb` join `beer` `b` on((`crb`.`beer_id` = `b`.`beer_id`))) where (`crb`.`rating` > 3) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `pubsneedrestock`
--

/*!50001 DROP VIEW IF EXISTS `pubsneedrestock`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `pubsneedrestock` AS select `pubhasbeer`.`pub_id` AS `pub_id`,`pubhasbeer`.`beer_id` AS `beer_id`,`pubhasbeer`.`remaining_until_reorder` AS `remaining_until_reorder` from `pubhasbeer` where (`pubhasbeer`.`remaining_until_reorder` <= 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `pubstorestock`
--

/*!50001 DROP VIEW IF EXISTS `pubstorestock`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `pubstorestock` AS select `pubhasbeer`.`pub_id` AS `pub_id`,`pubhasbeer`.`beer_id` AS `beer_id`,`pubhasbeer`.`quantity_available` AS `quantity_available`,`pubhasbeer`.`remaining_until_reorder` AS `remaining_until_reorder` from `pubhasbeer` where (`pubhasbeer`.`remaining_until_reorder` <= 0) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `recentcustomers`
--

/*!50001 DROP VIEW IF EXISTS `recentcustomers`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 SQL SECURITY INVOKER */
/*!50001 VIEW `recentcustomers` AS select `customer`.`customer_id` AS `customer_id`,`customer`.`first_name` AS `first_name`,`customer`.`last_name` AS `last_name`,`customer`.`registration_date` AS `registration_date` from `customer` where (`customer`.`registration_date` > '2022-01-01') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-18 14:40:32
