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
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve current folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads folder

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Sanitize filename to remove special chars
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'cert-' + uniqueSuffix + ext)
    }
});

const upload = multer({ storage: storage });

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

// 6. GET Stats
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
// Generic Save Endpoint
app.post('/api/admin/save', async (req, res) => {
    const { table, id, ...data } = req.body;

    // Whitelist allowed tables to prevent SQL injection
    const allowedTables = ['skills', 'projects', 'internships', 'certifications', 'achievements'];
    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    // Enforce visibility convention: If link is empty, force visibility to false
    const linkMap = {
        'source_code_link': 'source_code_visible',
        'demo_video_link': 'demo_video_visible',
        'live_demo_link': 'live_demo_visible',
        'certificate_link': 'certificate_visible',
        'certificate_image_path': 'certificate_visible'
    };

    for (const [linkCol, visibleCol] of Object.entries(linkMap)) {
        // Only if the incoming data actually contains the link field (to avoid overwriting on partial patches if any)
        // Since admin panel sends full object usually, this is fine.
        if (data.hasOwnProperty(linkCol)) {
            const val = data[linkCol];
            if (!val || String(val).trim() === '') {
                data[visibleCol] = false;
            }
        }
    }

    try {
        if (id) {
            // UDPATE existing item
            // Dynamically build SET clause
            const keys = Object.keys(data);
            const values = Object.values(data);
            const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

            await db.query(`UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, id]);
            res.json({ message: 'Item updated successfully' });
        } else {
            // INSERT new item
            const keys = Object.keys(data);
            const values = Object.values(data);
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
    const allowedTables = ['skills', 'projects', 'internships', 'certifications', 'achievements'];

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
    const allowedTables = ['skills', 'projects', 'internships', 'certifications', 'achievements'];

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

// Upload Endpoint
app.post('/api/admin/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the path relative to the server root
    res.json({ filePath: '/uploads/' + req.file.filename });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
