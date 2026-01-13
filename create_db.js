const { Client } = require('pg');
require('dotenv').config();

async function createDatabase() {
    // Connect to 'postgres' database to create new db
    const connectionString = process.env.DATABASE_URL.replace('portfolio_db', 'postgres');
    const client = new Client({ connectionString });

    try {
        await client.connect();
        // Check if db exists
        const check = await client.query("SELECT 1 FROM pg_database WHERE datname = 'portfolio_db'");
        if (check.rowCount === 0) {
            console.log('Creating database portfolio_db...');
            await client.query('CREATE DATABASE portfolio_db');
            console.log('✅ Database created.');
        } else {
            console.log('Database already exists.');
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
}

createDatabase();
