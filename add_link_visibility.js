const db = require('./database');

async function migrate() {
    try {
        console.log('🔄 Adding visibility columns to tables...');

        const queries = [
            // Projects
            `ALTER TABLE projects ADD COLUMN IF NOT EXISTS source_code_visible BOOLEAN DEFAULT TRUE`,
            `ALTER TABLE projects ADD COLUMN IF NOT EXISTS demo_video_visible BOOLEAN DEFAULT TRUE`,
            `ALTER TABLE projects ADD COLUMN IF NOT EXISTS live_demo_visible BOOLEAN DEFAULT TRUE`,

            // Internships
            `ALTER TABLE internships ADD COLUMN IF NOT EXISTS source_code_visible BOOLEAN DEFAULT TRUE`,
            `ALTER TABLE internships ADD COLUMN IF NOT EXISTS demo_video_visible BOOLEAN DEFAULT TRUE`,
            `ALTER TABLE internships ADD COLUMN IF NOT EXISTS live_demo_visible BOOLEAN DEFAULT TRUE`,

            // Achievements
            `ALTER TABLE achievements ADD COLUMN IF NOT EXISTS source_code_visible BOOLEAN DEFAULT TRUE`,
            `ALTER TABLE achievements ADD COLUMN IF NOT EXISTS demo_video_visible BOOLEAN DEFAULT TRUE`,
            `ALTER TABLE achievements ADD COLUMN IF NOT EXISTS live_demo_visible BOOLEAN DEFAULT TRUE`
        ];

        for (const query of queries) {
            await db.query(query);
        }

        console.log('✅ Columns added successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err);
        process.exit(1);
    }
}

migrate();
