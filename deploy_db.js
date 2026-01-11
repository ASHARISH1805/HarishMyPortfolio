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

        // Project Home Page Image
        await db.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_image_path TEXT`); // Ensure it exists
        await db.query(`ALTER TABLE projects ALTER COLUMN project_image_path TYPE TEXT`); // Upgrade to TEXT for Base64

        // Migration: Add icon_class to skills if missing
        await db.query(`ALTER TABLE skills ADD COLUMN IF NOT EXISTS icon_class VARCHAR(50) DEFAULT 'fas fa-code'`);

        // Upgrade Certificate Image Path to TEXT for Base64 support
        await db.query(`ALTER TABLE certifications ALTER COLUMN certificate_image_path TYPE TEXT`);

        // FIX: Upgrade certificate_link to TEXT in all relevant tables to support Base64 images
        const certTables = ['projects', 'internships', 'achievements'];
        for (const table of certTables) {
            await db.query(`ALTER TABLE ${table} ALTER COLUMN certificate_link TYPE TEXT`);
        }

        // ==========================================
        // FORCE UPDATE SKILLS (User Requirement)
        // ==========================================
        const { seedSkills } = require('./seed');
        await seedSkills();

        // 3. Seeding (Only if empty for other tables)
        console.log('Checking if seeding needed...');
        // Check projects table as indicator
        const res = await db.query('SELECT COUNT(*) FROM projects');
        const count = parseInt(res.rows[0].count);

        if (count === 0) {
            console.log('Table empty. Running Seed...');
            try {
                // Since seedSkills is already run, we can run the rest via seed.js or keep using execSync
                // But seed.js now has logic to avoid dupes if count is > 0, so safe to run.
                execSync('node seed.js', { stdio: 'inherit' });
                console.log('Seeding process finished.');
            } catch (seedErr) {
                console.error('Seeding failed:', seedErr);
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

        // 5. Create Messages Table (Contact Form)
        await db.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                subject VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read BOOLEAN DEFAULT FALSE
            )
        `);
        console.log('✅ Messages table ready.');

        console.log('✅ Deployment DB Check Complete.');
        process.exit(0);

    } catch (e) {
        console.error('❌ Deploy DB Failed:', e);
        process.exit(1);
    }
}

deploy();
