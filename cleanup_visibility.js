const db = require('./database');

async function cleanup() {
    try {
        console.log('Cleaning up visibility flags...');

        const tables = ['projects', 'internships', 'achievements'];
        const linkTypes = [
            { link: 'source_code_link', visible: 'source_code_visible' },
            { link: 'demo_video_link', visible: 'demo_video_visible' },
            { link: 'live_demo_link', visible: 'live_demo_visible' },
            { link: 'certificate_link', visible: 'certificate_visible' }
        ];

        for (const table of tables) {
            for (const pair of linkTypes) {
                // Set visible = FALSE where link is NULL or empty string
                const query = `
                    UPDATE ${table} 
                    SET ${pair.visible} = FALSE 
                    WHERE ${pair.link} IS NULL OR TRIM(${pair.link}) = ''
                `;
                const res = await db.query(query);
                console.log(`Updated ${table}.${pair.visible}: ${res.rowCount} rows`);
            }
        }

        // Certifications table (special case)
        const certQuery = `
            UPDATE certifications 
            SET certificate_visible = FALSE 
            WHERE certificate_image_path IS NULL OR TRIM(certificate_image_path) = ''
        `;
        const certRes = await db.query(certQuery);
        console.log(`Updated certifications.certificate_visible: ${certRes.rowCount} rows`);

        console.log('Cleanup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

cleanup();
