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
  `beer_id` int NOT NULL,
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
INSERT INTO `beer` VALUES (1,'Guinness Draught','Ireland',4.20,'Classic Irish stout',3.50,1,'stout','glass',0.50),(2,'Murphy\'s Red','Ireland',5.00,'Smooth Irish red ale',3.00,2,'ale','can',0.33),(3,'Budweiser Lager','USA',5.50,'Popular American lager',2.50,3,'lager','can',0.33),(4,'Heineken Lager','Netherlands',5.00,'Dutch lager',2.80,4,'lager','can',0.33),(5,'Mythos Lager','Greece',5.00,'Greek lager',2.50,5,'lager','can',0.33),(6,'Fix Hellas','Greece',5.00,'Historic Greek beer',2.70,6,'lager','glass',0.50),(7,'Corona Extra','Mexico',4.60,'Mexican lager',3.00,7,'lager','bottle',0.33),(8,'Carlsberg Pilsner','Denmark',5.00,'Danish lager',2.90,8,'lager','can',0.33),(9,'Stella Artois','Belgium',5.20,'Belgian lager',3.20,9,'lager','glass',0.50),(10,'Pilsner Urquell','Czech Republic',4.40,'Original pilsner',3.00,10,'lager','glass',0.50),(11,'Strong Lager','Germany',7.20,'High alcohol lager',3.80,10,'lager','bottle',0.50);
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
  `brand_id` int NOT NULL,
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
INSERT INTO `brand` VALUES (1,'Guinness','Ireland','www.guinness.com','Famous Irish stout',1759),(2,'Murphy','Ireland','www.murphys.com','Irish red ale',1856),(3,'Budweiser','USA','www.budweiser.com','American lager',1876),(4,'Heineken','Netherlands','www.heineken.com','Dutch lager',1873),(5,'Mythos','Greece','www.mythos.com','Greek lager',1997),(6,'Fix','Greece','www.fix.gr','Historic Greek beer',1864),(7,'Corona','Mexico','www.corona.com','Mexican lager',1925),(8,'Carlsberg','Denmark','www.carlsberg.com','Danish lager',1847),(9,'Stella Artois','Belgium','www.stellaartois.com','Belgian lager',1366),(10,'Pilsner Urquell','Czech Republic','www.pilsnerurquell.com','Original pilsner',1842);
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
  `customer_id` int NOT NULL,
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
INSERT INTO `customer` VALUES (1,'2023-01-10',50,'nikos@example.com','+306912345678','Egnatia 100','Thessaloniki','54622','Greece','Nikos','Papadopoulos','1995-06-15'),(2,'2024-05-20',20,'john@example.com','+12025550124','Broadway 200','New York','10003','USA','John','Smith','1990-08-20'),(3,'2022-03-12',15,'maria@example.com','+306912345679','Patision 50','Athens','10434','Greece','Maria','Kosta','1998-02-10'),(4,'2021-07-25',30,'george@example.com','+306912345680','Venizelou 12','Patras','26222','Greece','George','Ioannou','1985-11-05'),(5,'2020-09-18',40,'eleni@example.com','+306912345681','Dimokratias 20','Heraklion','71203','Greece','Eleni','Georgiou','1992-04-22'),(6,'2023-11-02',25,'kostas@example.com','+306912345682','Kountouriotou 15','Larissa','41223','Greece','Kostas','Papanikolaou','1997-09-12'),(7,'2024-01-30',10,'anna@example.com','+306912345683','Dimokratias 30','Volos','38222','Greece','Anna','Karagianni','1999-12-01'),(8,'2022-06-14',35,'nikos2@example.com','+306912345684','Averof 10','Ioannina','45222','Greece','Nikos','Christou','1988-07-07'),(9,'2021-12-05',45,'sofia@example.com','+306912345685','Venizelou 5','Kavala','65202','Greece','Sofia','Dimitriou','1993-03-19'),(10,'2020-04-21',60,'manolis@example.com','+306912345686','Sokratous 100','Rhodes','85101','Greece','Manolis','Antoniou','1980-01-25');
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
INSERT INTO `customerreviewsbeer` VALUES (1,1,'Amazing stout, very smooth!','2024-06-05',5.0),(2,2,'Not my taste, too bitter.','2024-06-06',2.0),(3,3,'Classic lager, refreshing.','2024-06-07',4.5),(4,4,'Too light for me.','2024-06-08',2.5),(5,5,'Great Greek lager!','2024-06-09',4.0),(6,6,'Historic taste, love it.','2024-06-10',5.0),(7,7,'Perfect with lime, very smooth.','2024-06-11',4.2),(8,8,'Balanced pilsner, good quality.','2024-06-12',3.8);
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
  `employee_id` int NOT NULL,
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
INSERT INTO `employee` VALUES (1,'2020-05-01',1200.00,'bartender1@pub.gr','evening','bartender','+302310111111','Nikos','Papadopoulos',1),(2,'2021-03-15',2000.00,'manager1@pub.gr','morning','manager','+302103333333','Eleni','Kosta',2),(3,'2022-07-10',950.00,'waiter1@pub.gr','night','waiter','+302610222222','Dimitris','Ioannou',3),(4,'2019-11-20',1100.00,'bartender2@pub.gr','evening','bartender','+302810333333','Maria','Georgiou',4),(5,'2023-01-05',1300.00,'cleaner1@pub.gr','morning','cleaner','+302410444444','Kostas','Papanikolaou',5),(6,'2020-09-12',1400.00,'manager2@pub.gr','morning','manager','+302421555555','Anna','Karagianni',6),(7,'2021-04-18',1000.00,'waiter2@pub.gr','night','waiter','+302651666666','Nikos','Christou',7),(8,'2018-06-25',1250.00,'bartender3@pub.gr','evening','bartender','+302510777777','Sofia','Dimitriou',8),(9,'2022-02-14',1350.00,'manager3@pub.gr','morning','manager','+302241888888','Manolis','Antoniou',9),(10,'2019-08-30',900.00,'cleaner2@pub.gr','night','cleaner','+302821999999','Maria','Kalogeraki',10);
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
INSERT INTO `orderhasbeer` VALUES (1,1,1,2,3.50,7.00),(2,1,3,1,2.50,2.50),(3,1,4,2,2.80,5.60),(4,1,5,2,3.20,6.40),(5,1,2,1,3.00,3.00),(6,1,6,2,4.25,8.50),(7,1,7,1,3.80,3.80);
/*!40000 ALTER TABLE `orderhasbeer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `status` enum('completed','pending','cancelled') DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `total_amount` decimal(6,2) DEFAULT NULL,
  `order_date` date DEFAULT NULL,
  `payment_method` enum('card','cash','check','bank_transaction') DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'completed',1,7.00,'2024-06-01','card'),(2,'pending',2,2.50,'2024-06-02','cash'),(3,'completed',3,5.60,'2024-06-03','card'),(4,'completed',4,6.40,'2024-06-04','cash'),(5,'pending',5,3.00,'2024-06-05','card'),(6,'completed',6,8.50,'2024-06-06','cash'),(7,'completed',7,4.20,'2024-06-07','card'),(8,'pending',8,9.00,'2024-06-08','cash'),(9,'completed',9,7.50,'2024-06-09','card'),(10,'completed',10,6.00,'2024-06-10','cash');
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
  `pub_id` int NOT NULL,
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
INSERT INTO `pub` VALUES (1,'Pub Thessaloniki','Maria Papadopoulou','+302310123456','Tsimiski 12','Thessaloniki','54621','Greece'),(2,'Pub Athens','Giorgos Nikolaou','+302103334455','Ermou 45','Athens','10563','Greece'),(3,'Pub Patras','Dimitris Ioannou','+302610223344','Korinthou 50','Patras','26221','Greece'),(4,'Pub Heraklion','Eleni Georgiou','+302810334455','Kalokairinou 20','Heraklion','71202','Greece'),(5,'Pub Larissa','Kostas Papanikolaou','+302410445566','Kountouriotou 15','Larissa','41222','Greece'),(6,'Pub Volos','Anna Karagianni','+302421556677','Dimokratias 30','Volos','38221','Greece'),(7,'Pub Ioannina','Nikos Christou','+302651667788','Averof 10','Ioannina','45221','Greece'),(8,'Pub Kavala','Sofia Dimitriou','+302510778899','Venizelou 5','Kavala','65201','Greece'),(9,'Pub Rhodes','Manolis Antoniou','+302241889900','Sokratous 100','Rhodes','85100','Greece'),(10,'Pub Chania','Maria Kalogeraki','+302821990011','Halidon 25','Chania','73131','Greece');
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
INSERT INTO `pubhasbeer` (`pub_id`, `beer_id`, `quantity_available`, `last_updated`, `reorder_threshold`, `storage_location`) VALUES (1,1,50.00,'2024-06-01',20.00,'Cellar A'),(1,3,10.00,'2024-06-01',15.00,'Fridge B'),(2,2,30.00,'2024-06-01',10.00,'Cellar C'),(2,4,25.00,'2024-06-02',10.00,'Fridge D'),(3,5,40.00,'2024-06-03',15.00,'Cellar E'),(4,6,20.00,'2024-06-04',10.00,'Fridge F'),(5,7,35.00,'2024-06-05',12.00,'Cellar G'),(6,8,18.00,'2024-06-06',10.00,'Fridge H'),(7,9,22.00,'2024-06-07',8.00,'Cellar I'),(8,10,15.00,'2024-06-08',10.00,'Fridge J');
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
  `supplier_id` int NOT NULL,
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
INSERT INTO `supplier` VALUES (1,'Irish Beverages Ltd','Sean O\'Connor','info@irishbev.ie','+3531234567','Main St','Dublin','10001','Ireland','IE123456789'),(2,'American Beer Imports','John Miller','sales@abimports.com','+12025550123','5th Ave','New York','10002','USA','US987654321'),(3,'Greek Drinks SA','Maria Papadopoulou','info@greekdrinks.gr','+302103334455','Ermou 45','Athens','10563','Greece','GR123456789'),(4,'Dutch Breweries BV','Hans Vermeer','contact@dutchbrew.nl','+31101234567','Damrak 10','Amsterdam','1012','Netherlands','NL123456789'),(5,'Mexican Imports SA','Carlos Lopez','ventas@meximports.mx','+525512345678','Av Reforma','Mexico City','01000','Mexico','MX123456789'),(6,'Danish Beer Export','Lars Jensen','export@danishbeer.dk','+4530123456','Nyhavn 20','Copenhagen','1051','Denmark','DK123456789'),(7,'Belgian Breweries SA','Jean Dupont','info@belbrew.be','+3221234567','Grand Place','Brussels','1000','Belgium','BE123456789'),(8,'Czech Beer Export','Pavel Novak','sales@czechbeer.cz','+420123456789','Namesti 1','Prague','11000','Czech Republic','CZ123456789'),(9,'UK Beer Distribution','William Smith','info@ukbeer.co.uk','+441234567890','Oxford St','London','W1D','UK','UK123456789'),(10,'German Beer GmbH','Karl Müller','kontakt@gerbeer.de','+491234567890','Berliner Str','Berlin','10115','Germany','DE123456789');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplierorder`
--

DROP TABLE IF EXISTS `supplierorder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplierorder` (
  `supplier_order_id` int NOT NULL,
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
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
