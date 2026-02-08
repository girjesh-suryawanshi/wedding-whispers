const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
console.log('Attempting to start on port:', port);

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../dist')));

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'))
    },
    filename: function (req, file, cb) {
        // Unique filename: timestamp-random.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// --- Auth Helper Functions ---
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
    const [salt, originalHash] = storedHash.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === originalHash;
}

// Helper for error handling
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// --- API Endpoints ---

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// --- Auth Endpoints ---

// POST /api/auth/signup
app.post('/api/auth/signup', asyncHandler(async (req, res) => {
    const { email, password, data } = req.body; // data contains optional fields like display_name
    const displayName = data?.display_name;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if user exists
        const userCheck = await client.query('SELECT id FROM public.users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const hashedPassword = hashPassword(password);
        const userRes = await client.query(
            'INSERT INTO public.users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );
        const user = userRes.rows[0];

        // Create profile
        await client.query(
            'INSERT INTO public.profiles (user_id, display_name) VALUES ($1, $2)',
            [user.id, displayName || email.split('@')[0]]
        );

        await client.query('COMMIT');

        // Return user session-like object
        res.json({
            user: { id: user.id, email: user.email },
            session: { access_token: 'mock-jwt-token', user: { id: user.id, email: user.email } }
        });
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}));

// POST /api/auth/signin
app.post('/api/auth/signin', asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query('SELECT id, email, password_hash FROM public.users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
        user: { id: user.id, email: user.email },
        session: { access_token: 'mock-jwt-token', user: { id: user.id, email: user.email } }
    });
}));

// GET /api/profiles/:userId
app.get('/api/profiles/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await pool.query('SELECT * FROM public.profiles WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(result.rows[0]);
}));

// 1. Create/Update Wedding
app.post('/api/weddings', asyncHandler(async (req, res) => {
    const weddingData = req.body;
    const {
        id, user_id, bride_name, groom_name, wedding_date, venue,
        bride_photo, groom_photo, bride_parents, groom_parents,
        rsvp_phone, rsvp_email, custom_message, share_token,
        template, language, events
    } = weddingData;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Upsert Wedding
        const weddingQuery = `
            INSERT INTO public.weddings (
                id, user_id, bride_name, groom_name, wedding_date, venue, 
                bride_photo, groom_photo, bride_parents, groom_parents, 
                rsvp_phone, rsvp_email, custom_message, share_token, 
                template, language, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
                bride_name = EXCLUDED.bride_name,
                groom_name = EXCLUDED.groom_name,
                wedding_date = EXCLUDED.wedding_date,
                venue = EXCLUDED.venue,
                bride_photo = EXCLUDED.bride_photo,
                groom_photo = EXCLUDED.groom_photo,
                bride_parents = EXCLUDED.bride_parents,
                groom_parents = EXCLUDED.groom_parents,
                rsvp_phone = EXCLUDED.rsvp_phone,
                rsvp_email = EXCLUDED.rsvp_email,
                custom_message = EXCLUDED.custom_message,
                share_token = EXCLUDED.share_token,
                template = EXCLUDED.template,
                language = EXCLUDED.language,
                updated_at = NOW()
            RETURNING id;
        `;

        const weddingValues = [
            id, user_id, bride_name, groom_name, wedding_date, venue,
            bride_photo, groom_photo, bride_parents, groom_parents,
            rsvp_phone, rsvp_email, custom_message, share_token,
            template || 'garden', language || 'english'
        ];

        const weddingRes = await client.query(weddingQuery, weddingValues);
        const savedWeddingId = weddingRes.rows[0].id;

        // Handle Events: Delete existing and insert new
        await client.query('DELETE FROM public.wedding_events WHERE wedding_id = $1', [savedWeddingId]);

        if (events && events.length > 0) {
            for (const event of events) {
                await client.query(`
                    INSERT INTO public.wedding_events (
                        id, wedding_id, event_type, custom_name, event_date, event_time, venue, description
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                `, [
                    event.id, savedWeddingId, event.type, event.customName || null,
                    event.date, event.time, event.venue || null, event.description || null
                ]);
            }
        }

        await client.query('COMMIT');
        res.json({ id: savedWeddingId, message: 'Wedding saved successfully' });
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}));

// 2. Get Wedding by Share Token
// Replaces: get_wedding_by_share_token RPC
app.get('/api/weddings/:token', asyncHandler(async (req, res) => {
    const { token } = req.params;
    const result = await pool.query(
        `SELECT 
      id, bride_name, groom_name, wedding_date, venue, 
      bride_photo, groom_photo, bride_parents, groom_parents, 
      rsvp_phone, rsvp_email, custom_message, 
      template, language
     FROM public.weddings 
     WHERE share_token = $1`,
        [token]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Wedding not found' });
    }

    res.json(result.rows[0]);
}));

// 2. Get Wedding Events by Wedding ID
// Replaces: get_wedding_events_by_wedding_id RPC
app.get('/api/weddings/:weddingId/events', asyncHandler(async (req, res) => {
    const { weddingId } = req.params;

    // Verify wedding exists and is public (has share token)
    const weddingCheck = await pool.query(
        'SELECT 1 FROM public.weddings WHERE id = $1 AND share_token IS NOT NULL',
        [weddingId]
    );

    if (weddingCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Wedding not found or not public' });
    }

    const result = await pool.query(
        `SELECT 
      id, event_type, custom_name, event_date, 
      event_time, venue, description 
     FROM public.wedding_events 
     WHERE wedding_id = $1 
     ORDER BY event_date ASC`,
        [weddingId]
    );

    res.json(result.rows);
}));

// 3. RSVP (Optional / Future)
// Currently mostly static in frontend, but ready for logic
app.post('/api/rsvp', asyncHandler(async (req, res) => {
    // Logic to save RSVP
    res.json({ message: 'RSVP received' });
}));

// Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the URL to access the file
    // Assuming server is reachable at same host/port for now, simplified
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// 3. Get Wedding by User ID (Private Dashboard)
app.get('/api/weddings/user/:userId', asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Simple UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
        return res.status(400).json({ error: 'Invalid User ID format' });
    }

    const result = await pool.query(
        `SELECT 
      id, bride_name, groom_name, wedding_date, venue, 
      bride_photo, groom_photo, bride_parents, groom_parents, 
      rsvp_phone, rsvp_email, custom_message, share_token, 
      template, language
     FROM public.weddings 
     WHERE user_id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        return res.json(null); // Return null if no wedding found for user
    }

    res.json(result.rows[0]);
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle SPA routing - return index.html for any unknown non-API routes
app.get('*', (req, res) => {
    // Don't intercept API routes (though they should be handled above)
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
