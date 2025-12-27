const db = require('./database');

async function migrate() {
    try {
        console.log('Adding certificate_visible columns...');

        const tables = ['projects', 'internships', 'achievements'];

        for (const table of tables) {
            await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS certificate_visible BOOLEAN DEFAULT TRUE`);
            console.log(`Updated ${table}`);
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
