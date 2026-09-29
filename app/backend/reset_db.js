import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function resetDatabase() {
  const sqlDumpPath = path.join(process.cwd(), '..', 'db-init', '01-schema.sql');
  const dummyDataPath = path.join(process.cwd(), '..', 'db-init', '02-seed-data.sql');
  const sqlContent = fs.readFileSync(sqlDumpPath, 'utf-8');
  const dummyContent = fs.readFileSync(dummyDataPath, 'utf-8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    // First, drop all views to avoid "already exists" errors
    try {
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");
      const viewNames = [
        'beerswithbrandinfo',
        'beerwithbrand',
        'customersafter2022',
        'employeeshighsalarygreece',
        'greekemployeeshighsalary',
        'positivebeerreviews',
        'positivereviewswithbeerbrand',
        'pubsneedrestock',
        'pubstorestock',
        'recentcustomers'
      ];

      for (const viewName of viewNames) {
        try {
          await connection.query(`DROP VIEW IF EXISTS ${viewName}`);
        } catch (err) {
          // Silently ignore if view doesn't exist
        }
      }
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    } catch (err) {
      // Continue even if view dropping fails
    }

    // Then load the schema from dbDump.sql
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (err) {
        // Ignore harmless errors
        const isHarmless = 
          err.message.includes('already exists') ||
          err.message.includes('can\'t set to the value') ||
          err.message.includes('Variable') ||
          err.message.includes('character_set');
        
        if (!isHarmless) {
          console.log(`Executing: ${statement.substring(0, 50)}...`);
          console.error(`Error: ${err.message}`);
        }
      }
    }

    // TRUNCATE all data tables to clear the data from dbDump.sql before loading dummy data
    try {
      await connection.query("SET FOREIGN_KEY_CHECKS = 0");
      await connection.query("TRUNCATE TABLE orderhasbeer");
      await connection.query("TRUNCATE TABLE orders");
      await connection.query("TRUNCATE TABLE customerreviewsbeer");
      await connection.query("TRUNCATE TABLE customer");
      await connection.query("TRUNCATE TABLE pubhasbeer");
      await connection.query("TRUNCATE TABLE brandsuppliedbysupplier");
      await connection.query("TRUNCATE TABLE supplier");
      await connection.query("TRUNCATE TABLE beer");
      await connection.query("TRUNCATE TABLE brand");
      await connection.query("TRUNCATE TABLE supplierorder");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1");
      console.log("Cleared all data tables");
    } catch (err) {
      console.error("Error truncating tables:", err.message);
    }

    // Then load the dummy data
    const dummyStatements = dummyContent
      .split(';')
      .map(stmt => stmt.trim())
      // Remove comments from the beginning of statements  
      .map(stmt => stmt.replace(/^--[^\n]*\n/, '').trim())
      .filter(stmt => stmt.length > 0);

    for (const statement of dummyStatements) {
      try {
        if (statement.length > 0) {
          await connection.query(statement);
        }
      } catch (err) {
        if (statement.includes('INSERT INTO')) {
          console.log(`FAILED INSERT: ${statement.substring(0, 100)}...`);
          console.error(`Error: ${err.message}`);
        }
      }
    }

    console.log('✅ Database reset successfully with schema and dummy data!');
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
  } finally {
    await connection.end();
  }
}

resetDatabase();
