require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

// 1. Get Wedding by Share Token
// Replaces: get_wedding_by_share_token RPC
app.get('/api/weddings/:token', asyncHandler(async (req, res) => {
    const { token } = req.params;
    const result = await pool.query(
        `SELECT 
      id, bride_name, groom_name, wedding_date, venue, 
      bride_photo, groom_photo, bride_parents, groom_parents, 
      rsvp_phone, rsvp_email, custom_message 
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
