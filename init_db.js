const fs = require('fs');
const path = require('path');
const db = require('./database');

async function setupDatabase() {
    try {
        console.log('🔄 Reading schema.sql...');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

        console.log('🏗️ Creating tables...');
        await db.query(schema);

        console.log('✅ Tables created successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error setting up database:', err);
        process.exit(1);
    }
}

setupDatabase();
