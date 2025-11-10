/**
 * Fix Duplicate Indexes Script
 * Removes duplicate indexes from users and departments tables
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixDuplicateIndexes() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'faith_archive',
      multipleStatements: true
    });

    console.log('Connected to database');
    console.log('Fixing duplicate indexes...\n');

    // Get all indexes for users table
    const [userIndexes] = await connection.execute(`
      SELECT 
        INDEX_NAME,
        COLUMN_NAME,
        SEQ_IN_INDEX
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'users'
      AND INDEX_NAME != 'PRIMARY'
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `, [process.env.DB_NAME || 'faith_archive']);

    console.log(`Found ${userIndexes.length} indexes on users table`);

    // Group indexes by column name
    const indexesByColumn = {};
    userIndexes.forEach(index => {
      if (!indexesByColumn[index.COLUMN_NAME]) {
        indexesByColumn[index.COLUMN_NAME] = [];
      }
      if (!indexesByColumn[index.COLUMN_NAME].includes(index.INDEX_NAME)) {
        indexesByColumn[index.COLUMN_NAME].push(index.INDEX_NAME);
      }
    });

    // Drop duplicate indexes (keep the first one, drop the rest)
    for (const [column, indexes] of Object.entries(indexesByColumn)) {
      if (indexes.length > 1) {
        console.log(`\nColumn '${column}' has ${indexes.length} indexes:`, indexes);
        
        // Keep the first index (usually the original), drop the rest
        const indexesToDrop = indexes.slice(1);
        
        for (const indexName of indexesToDrop) {
          try {
            console.log(`  Dropping index: ${indexName}`);
            await connection.execute(`DROP INDEX \`${indexName}\` ON \`users\``);
            console.log(`  ✓ Dropped index: ${indexName}`);
          } catch (error) {
            if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
              console.log(`  ⚠ Index ${indexName} doesn't exist or cannot be dropped`);
            } else {
              console.error(`  ✗ Error dropping index ${indexName}:`, error.message);
            }
          }
        }
      }
    }

    // Also check and fix departments table if needed
    const [deptIndexes] = await connection.execute(`
      SELECT 
        INDEX_NAME,
        COLUMN_NAME,
        SEQ_IN_INDEX
      FROM INFORMATION_SCHEMA.STATISTICS
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = 'departments'
      AND INDEX_NAME != 'PRIMARY'
      ORDER BY INDEX_NAME, SEQ_IN_INDEX
    `, [process.env.DB_NAME || 'faith_archive']);

    if (deptIndexes.length > 10) {
      console.log(`\nFound ${deptIndexes.length} indexes on departments table`);
      
      const deptIndexesByColumn = {};
      deptIndexes.forEach(index => {
        if (!deptIndexesByColumn[index.COLUMN_NAME]) {
          deptIndexesByColumn[index.COLUMN_NAME] = [];
        }
        if (!deptIndexesByColumn[index.COLUMN_NAME].includes(index.INDEX_NAME)) {
          deptIndexesByColumn[index.COLUMN_NAME].push(index.INDEX_NAME);
        }
      });

      for (const [column, indexes] of Object.entries(deptIndexesByColumn)) {
        if (indexes.length > 1) {
          console.log(`\nColumn '${column}' has ${indexes.length} indexes:`, indexes);
          const indexesToDrop = indexes.slice(1);
          
          for (const indexName of indexesToDrop) {
            try {
              console.log(`  Dropping index: ${indexName}`);
              await connection.execute(`DROP INDEX \`${indexName}\` ON \`departments\``);
              console.log(`  ✓ Dropped index: ${indexName}`);
            } catch (error) {
              if (error.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                console.log(`  ⚠ Index ${indexName} doesn't exist or cannot be dropped`);
              } else {
                console.error(`  ✗ Error dropping index ${indexName}:`, error.message);
              }
            }
          }
        }
      }
    }

    console.log('\n✓ Duplicate indexes fixed!');
    console.log('You can now restart the server.');

  } catch (error) {
    console.error('Error fixing duplicate indexes:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the script
fixDuplicateIndexes();

