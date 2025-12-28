const fs = require('fs');
const path = require('path');
const db = require('./database');
const { execSync } = require('child_process');

async function deploy() {
    try {
        console.log('🚀 Starting Database Deployment...');

        // 1. Base Schema
        console.log('Checking Base Schema...');
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        await db.query(schema);

        // 2. Migrations (Columns added later)
        console.log('Running Migrations...');

        const tables = ['projects', 'internships', 'achievements'];

        // Link Visibility Columns
        const links = ['source_code', 'demo_video', 'live_demo'];
        for (const table of tables) {
            for (const link of links) {
                const colName = `${link}_visible`;
                await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${colName} BOOLEAN DEFAULT TRUE`);
            }
        }

        // Certificate Link Column
        for (const table of tables) {
            await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS certificate_link VARCHAR(255)`);
        }

        // Certificate Visibility Column (Include certifications table)
        for (const table of [...tables, 'certifications']) {
            await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS certificate_visible BOOLEAN DEFAULT TRUE`);
        }

        // Verify Link for Certifications
        await db.query(`ALTER TABLE certifications ADD COLUMN IF NOT EXISTS verify_link VARCHAR(500)`);

        // 3. Seeding (Only if empty)
        console.log('Checking if seeding needed...');
        // Check projects table as indicator
        const res = await db.query('SELECT COUNT(*) FROM projects');
        const count = parseInt(res.rows[0].count);

        if (count === 0) {
            console.log('Table empty. Running Seed...');
            try {
                execSync('node seed.js', { stdio: 'inherit' });
                console.log('Seeding process finished.');
            } catch (seedErr) {
                console.error('Seeding failed:', seedErr);
                // Don't fail deployment just because seed failed (e.g. partial data)
            }
        } else {
            console.log(`Database has ${count} projects. Skipping Seed.`);
        }

        // 4. Auto-Cleanup Visibility (Enforce rules)
        console.log('🧹 Cleaning up visibility flags...');
        const cleanupTables = ['projects', 'internships', 'achievements'];
        const cleanupLinks = [
            { link: 'source_code_link', visible: 'source_code_visible' },
            { link: 'demo_video_link', visible: 'demo_video_visible' },
            { link: 'live_demo_link', visible: 'live_demo_visible' },
            { link: 'certificate_link', visible: 'certificate_visible' }
        ];

        for (const table of cleanupTables) {
            for (const pair of cleanupLinks) {
                // Set visible = FALSE where link is NULL or empty
                await db.query(`
                    UPDATE ${table} 
                    SET ${pair.visible} = FALSE 
                    WHERE ${pair.link} IS NULL OR TRIM(${pair.link}) = ''
                `);
            }
        }

        // Certifications Cleanup
        await db.query(`
            UPDATE certifications 
            SET certificate_visible = FALSE 
            WHERE certificate_image_path IS NULL OR TRIM(certificate_image_path) = ''
        `);
        console.log('✨ Visibility flags optimized.');

        console.log('✅ Deployment DB Check Complete.');
        process.exit(0);

    } catch (e) {
        console.error('❌ Deploy DB Failed:', e);
        process.exit(1);
    }
}

deploy();
