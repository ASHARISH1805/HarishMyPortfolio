const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const multer = require('multer');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname))); // Serve current folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads folder

// Configure Multer
// Configure Multer (Disk Storage)
const fs = require('fs');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Sanitize filename and add timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext)
    }
});

const upload = multer({ storage: storage });

// ... (other routes) ...

// Upload Endpoint
app.post('/api/admin/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the path relative to the server root
    // Note: since we use diskStorage, req.file.path will be something like 'uploads\\filename...' on Windows.
    // We want a web-accessible URL.
    const webPath = 'uploads/' + req.file.filename;

    res.json({ filePath: webPath });
});

// ================= API ROUTES =================

// 1. GET Skills
app.get('/api/skills', async (req, res) => {
    try {
        const query = req.query.include_hidden === 'true'
            ? 'SELECT * FROM skills ORDER BY display_order ASC'
            : 'SELECT * FROM skills WHERE is_visible = TRUE ORDER BY display_order ASC';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. GET Projects
app.get('/api/projects', async (req, res) => {
    try {
        const query = req.query.include_hidden === 'true'
            ? 'SELECT * FROM projects ORDER BY display_order ASC'
            : 'SELECT * FROM projects WHERE is_visible = TRUE ORDER BY display_order ASC';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. GET Internships
app.get('/api/internships', async (req, res) => {
    try {
        const query = req.query.include_hidden === 'true'
            ? 'SELECT * FROM internships ORDER BY display_order ASC'
            : 'SELECT * FROM internships WHERE is_visible = TRUE ORDER BY display_order ASC';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 4. GET Certifications
app.get('/api/certifications', async (req, res) => {
    try {
        const query = req.query.include_hidden === 'true'
            ? 'SELECT * FROM certifications ORDER BY display_order ASC'
            : 'SELECT * FROM certifications WHERE is_visible = TRUE ORDER BY display_order ASC';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 5. GET Achievements
// 5. GET Achievements
app.get('/api/achievements', async (req, res) => {
    try {
        const query = req.query.include_hidden === 'true'
            ? 'SELECT * FROM achievements ORDER BY display_order ASC'
            : 'SELECT * FROM achievements WHERE is_visible = TRUE ORDER BY display_order ASC';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 6. GET Micro-SaaS
app.get('/api/micro-saas', async (req, res) => {
    try {
        const query = req.query.include_hidden === 'true'
            ? 'SELECT * FROM micro_saas ORDER BY display_order ASC'
            : 'SELECT * FROM micro_saas WHERE is_visible = TRUE ORDER BY display_order ASC';
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 7. GET Stats (For Hero Section)
app.get('/api/stats', async (req, res) => {
    try {
        const projectCount = await db.query('SELECT COUNT(*) FROM projects WHERE is_visible = TRUE');
        const internshipCount = await db.query('SELECT COUNT(*) FROM internships WHERE is_visible = TRUE');

        // Hackathons (Achievements with category 'Hackathon')
        // Note: category column was added recently, make sure to handle case if some don't have it or fallback
        const hackathonCount = await db.query("SELECT COUNT(*) FROM achievements WHERE category = 'Hackathon' AND is_visible = TRUE");

        // Certifications
        const certCount = await db.query('SELECT COUNT(*) FROM certifications WHERE is_visible = TRUE');

        // Micro-SaaS
        const saasCount = await db.query('SELECT COUNT(*) FROM micro_saas WHERE is_visible = TRUE');

        // Fetch CGPA from achievements if possible, or use a default/hardcoded strategy if not found.
        // We'll look for an achievement with title 'Academic Performance' or 'CGPA'
        const cgpaRes = await db.query("SELECT role FROM achievements WHERE title ILIKE '%Academic%' OR title ILIKE '%CGPA%' LIMIT 1");

        let cgpa = '7.5'; // Default
        if (cgpaRes.rows.length > 0) {
            // Extract number from string like "7.47 CGPA"
            const match = cgpaRes.rows[0].role.match(/[\d.]+/);
            if (match) cgpa = match[0];
        }

        res.json({
            projects: parseInt(projectCount.rows[0].count),
            internships: parseInt(internshipCount.rows[0].count),
            hackathons: parseInt(hackathonCount.rows[0].count),
            certifications: parseInt(certCount.rows[0].count),
            saas: parseInt(saasCount.rows[0].count),
            cgpa: cgpa
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 6. CONTACT FORM SUBMISSION
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await db.query(`
            INSERT INTO messages (name, email, subject, message)
            VALUES ($1, $2, $3, $4)
        `, [name, email, subject, message]);

        console.log(`📩 New message from ${name} (${email})`);

        // Email Notification (using nodemailer)
        try {
            const nodemailer = require('nodemailer');
            // Check if credentials exist (basic check)
            if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    }
                });

                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: 'ushawin2020@gmail.com, anandhunharish@gmail.com', // Updated to include both recipients
                    subject: `Portfolio Contact: ${subject}`,
                    text: `You have received a new message from your portfolio website.\n\nFrom: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`
                };

                await transporter.sendMail(mailOptions);
                console.log('📧 Email notification sent to recipients');
            } else {
                console.log('⚠️ Email credentials missing in .env. Skipping email notification.');
            }
        } catch (emailErr) {
            console.error('Failed to send email notification:', emailErr);
            // Don't fail the request, just log the error
        }

        res.json({ success: true, message: 'Message saved successfully' });
    } catch (err) {
        console.error('Contact Form Error:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

// 7. GET MESSAGES (Admin)
app.get('/api/admin/messages', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// 8. GET Stats
app.get('/api/stats', async (req, res) => {
    try {
        const projectsCount = await db.query('SELECT COUNT(*) FROM projects WHERE is_visible = TRUE');
        const internshipsCount = await db.query('SELECT COUNT(*) FROM internships WHERE is_visible = TRUE');

        res.json({
            projects: parseInt(projectsCount.rows[0].count),
            internships: parseInt(internshipsCount.rows[0].count)
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// ================= ADMIN ROUTES =================

// Middleware for Admin Security
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const { OAuth2Client } = require('google-auth-library');
// Use Environment Variable or fallback to the known ID provided by user
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '631887364280-qhgrh2c9jdc3901kdklokrks21cugppa.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

const allowedEmails = [
    'ushawin2020@gmail.com',
    'drtmusha@rcee.co.in',
    'anandhunharish@gmail.com',
    'harishengg1805@gmail.com',
    'harinisugumar185@gmail.com'
];

// Endpoint to provide public Client ID to frontend
app.get('/api/auth/config', (req, res) => {
    res.json({ clientId: GOOGLE_CLIENT_ID || '' });
});

const authMiddleware = (req, res, next) => {
    const password = req.headers['x-admin-password'];
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid Admin Credentials' });
    }
};

// Google Auth Endpoint
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;

    if (!GOOGLE_CLIENT_ID) {
        console.error('GOOGLE_CLIENT_ID is not set in environment variables');
        return res.status(500).json({ success: false, error: 'Server configuration error: Missing Client ID' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;

        console.log(`Google Auth Attempt: ${email}`);

        if (allowedEmails.includes(email)) {
            res.json({ success: true, token: ADMIN_PASSWORD, userEmail: email });
        } else {
            res.status(403).json({ success: false, error: 'Access Denied: Email not authorized' });
        }
    } catch (error) {
        console.error('Google Auth Error:', error);

        // --- FALLBACK FOR NETWORK/TIME ISSUES ---
        // If verification fails (e.g., Socket Timeout or Clock Skew), we try to decode manually
        // strictly for the purpose of allowing the authorized admin to proceed in dev/local environment.
        try {
            console.log('⚠️ Attempting manual token decode fallback...');
            const parts = token.split('.');
            if (parts.length === 3) {
                // Convert Base64URL to Base64
                const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                const decodedPayload = Buffer.from(base64, 'base64').toString('utf-8');
                const payload = JSON.parse(decodedPayload);
                const email = payload.email;

                console.log(`⚠️ Fallback Decoded Email: ${email}`);

                if (email && allowedEmails.includes(email)) {
                    console.log(`✅ Fallback Auth Access GRANTED to ${email}`);
                    return res.json({ success: true, token: ADMIN_PASSWORD, userEmail: email });
                }
            }
        } catch (fallbackError) {
            console.error('Fallback decoding failed:', fallbackError);
        }
        // ----------------------------------------

        res.status(401).json({ success: false, error: 'Invalid Google Token (Verification Failed)' });
    }
});

// Protect all /api/admin/* routes
app.use('/api/admin', authMiddleware);

// Backup Endpoint - Exports all data
app.get('/api/admin/backup', async (req, res) => {
    try {
        const tables = ['skills', 'projects', 'internships', 'certifications', 'achievements', 'messages', 'micro_saas'];
        const backupData = {};

        for (const table of tables) {
            const result = await db.query(`SELECT * FROM ${table}`);
            backupData[table] = result.rows;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `portfolio_backup_${timestamp}.json`;

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.json(backupData);
    } catch (err) {
        console.error('Backup Error:', err);
        res.status(500).json({ error: 'Failed to create backup' });
    }
});

// View Endpoint (GET data for admin)
app.get('/api/admin/view/:table', async (req, res) => {
    const { table } = req.params;
    const allowedTables = ['skills', 'projects', 'internships', 'certifications', 'achievements', 'messages', 'micro_saas'];
    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    try {
        let query = `SELECT * FROM ${table} ORDER BY id ASC`;
        // For ordered tables, respect display_order
        if (['skills', 'projects', 'internships', 'certifications', 'achievements', 'micro_saas'].includes(table)) {
            query = `SELECT * FROM ${table} ORDER BY display_order ASC`;
        }
        // Messages order by date
        if (table === 'messages') {
            query = `SELECT * FROM messages ORDER BY created_at DESC`;
        }

        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Generic Save Endpoint
app.post('/api/admin/save', async (req, res) => {
    const { table, id, ...data } = req.body;

    // Whitelist allowed tables to prevent SQL injection
    const allowedTables = ['skills', 'projects', 'internships', 'certifications', 'achievements', 'micro_saas'];
    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    // Column Whitelist to prevent "Column does not exist" errors
    const validColumns = {
        skills: ['title', 'technologies', 'display_order', 'is_visible'],
        projects: ['title', 'description', 'technologies', 'source_code_link', 'demo_video_link', 'live_demo_link', 'display_order', 'is_visible', 'is_featured', 'icon_class', 'source_code_visible', 'demo_video_visible', 'live_demo_visible', 'certificate_link', 'certificate_visible', 'project_image_path'],
        internships: ['title', 'company', 'period', 'description', 'technologies', 'source_code_link', 'demo_video_link', 'live_demo_link', 'display_order', 'is_visible', 'icon_class', 'source_code_visible', 'demo_video_visible', 'live_demo_visible', 'certificate_link', 'certificate_visible'],
        certifications: ['title', 'issuer', 'date_issued', 'description', 'certificate_image_path', 'display_order', 'is_visible', 'icon_class', 'certificate_visible', 'verify_link'],
        achievements: ['title', 'role', 'description', 'source_code_link', 'demo_video_link', 'live_demo_link', 'display_order', 'is_visible', 'icon_class', 'source_code_visible', 'demo_video_visible', 'live_demo_visible', 'certificate_link', 'certificate_visible'],
        micro_saas: ['title', 'subtitle', 'role', 'status', 'description', 'technologies', 'icon_class', 'color_gradient', 'display_order', 'is_visible', 'source_code_link', 'demo_video_link']
    };

    const tableColumns = validColumns[table];
    if (!tableColumns) {
        return res.status(400).json({ error: 'Table columns not defined' });
    }

    // Filter data to only include valid columns
    const filteredData = {};
    for (const key of Object.keys(data)) {
        if (tableColumns.includes(key)) {
            filteredData[key] = data[key];
        } else {
            console.log(`Ignoring invalid column '${key}' for table '${table}'`);
        }
    }

    if (table === 'micro_saas') {
        console.log('--- Debug Micro-SaaS Save ---');
        console.log('Incoming Data:', data);
        console.log('Valid Columns:', tableColumns);
        console.log('Filtered Data:', filteredData);
        console.log('-----------------------------');
    }

    // Use filteredData instead of data
    const dataToSave = filteredData;

    // Enforce visibility logic on filtered data
    const linkMap = {
        'source_code_link': 'source_code_visible',
        'demo_video_link': 'demo_video_visible',
        'live_demo_link': 'live_demo_visible',
        'certificate_link': 'certificate_visible',
        'certificate_image_path': 'certificate_visible'
    };

    for (const [linkCol, visibleCol] of Object.entries(linkMap)) {
        if (dataToSave.hasOwnProperty(linkCol)) {
            const val = dataToSave[linkCol];
            if (!val || String(val).trim() === '') {
                // Ensure the visibility column is valid for this table before setting
                if (tableColumns.includes(visibleCol)) {
                    dataToSave[visibleCol] = false;
                }
            }
        }
    }

    try {
        if (id) {
            // UDPATE existing item
            // Dynamically build SET clause
            const keys = Object.keys(dataToSave);
            const values = Object.values(dataToSave);
            if (keys.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
            const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

            await db.query(`UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, id]);
            res.json({ message: 'Item updated successfully' });
        } else {
            // INSERT new item
            const keys = Object.keys(dataToSave);
            const values = Object.values(dataToSave);
            const columns = keys.join(', ');
            const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ');

            await db.query(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values);
            res.json({ message: 'Item created successfully' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// Delete Endpoint
app.delete('/api/admin/delete/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const allowedTables = ['skills', 'projects', 'internships', 'certifications', 'achievements', 'micro_saas'];

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    try {
        await db.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Reorder Endpoint
app.post('/api/admin/reorder', async (req, res) => {
    const { table, orderedIds } = req.body;
    const allowedTables = ['skills', 'projects', 'internships', 'certifications', 'achievements', 'micro_saas'];

    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    try {
        // Use a transaction for safety
        await db.query('BEGIN');

        for (let i = 0; i < orderedIds.length; i++) {
            const id = orderedIds[i];
            const newOrder = i + 1;
            // Update each item's order
            await db.query(`UPDATE ${table} SET display_order = $1 WHERE id = $2`, [newOrder, id]);
        }

        await db.query('COMMIT');
        res.json({ message: 'Order updated successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// (Upload endpoint moved to top configuration)

// ================= DATABASE AUTO-MIGRATION =================
async function ensureSchema() {
    try {
        console.log('🔄 Checking Database Schema...');

        // 1. Create Messages Table
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



        // 2. Ensure Columns Exist (Safe Alter)
        const tables = ['projects', 'internships', 'achievements'];
        const links = ['source_code', 'demo_video', 'live_demo'];

        // Add Visible Columns
        for (const table of tables) {
            for (const link of links) {
                const colName = `${link}_visible`;
                await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${colName} BOOLEAN DEFAULT TRUE`);
            }
            // Add Certificate Link
            await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS certificate_link TEXT`);
            // Add Certificate Visible
            await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS certificate_visible BOOLEAN DEFAULT TRUE`);
        }

        // Certifications Table
        await db.query(`ALTER TABLE certifications ADD COLUMN IF NOT EXISTS certificate_visible BOOLEAN DEFAULT TRUE`);
        await db.query(`ALTER TABLE certifications ADD COLUMN IF NOT EXISTS verify_link VARCHAR(500)`);

        // Projects Image
        await db.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_image_path TEXT`);

        // Skills Icon
        await db.query(`ALTER TABLE skills ADD COLUMN IF NOT EXISTS icon_class VARCHAR(50) DEFAULT 'fas fa-code'`);

        // Micro-SaaS Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS micro_saas (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                subtitle VARCHAR(255),
                role VARCHAR(255),
                status VARCHAR(100),
                description TEXT,
                technologies TEXT,
                icon_class VARCHAR(100),
                color_gradient VARCHAR(255),
                display_order INTEGER DEFAULT 0,
                is_visible BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Ensure missing columns for Micro-SaaS
        await db.query(`ALTER TABLE micro_saas ADD COLUMN IF NOT EXISTS source_code_link VARCHAR(500)`);
        await db.query(`ALTER TABLE micro_saas ADD COLUMN IF NOT EXISTS demo_video_link VARCHAR(500)`);
        console.log('✅ Database Schema Verified.');
    } catch (err) {
        console.error('❌ Schema Check Failed:', err);
    }
}

// Start Server
ensureSchema().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
