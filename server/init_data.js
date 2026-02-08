const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { Client } = require('pg');

console.log('Parameters:', {
    connectionString: process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED'
});

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function initData() {
    try {
        await client.connect();
        console.log('Connected to database...');

        // 1. Create a user
        console.log('Creating/Checking User...');
        // Check if user exists first to avoid dupes if re-run
        const userCheck = await client.query("SELECT id FROM public.users WHERE email = 'test@example.com'");
        let userId;

        if (userCheck.rows.length > 0) {
            userId = userCheck.rows[0].id;
            console.log('User already exists:', userId);
        } else {
            const userRes = await client.query(`
                INSERT INTO public.users (email, password_hash)
                VALUES ('test@example.com', 'hashed_password')
                RETURNING id
            `);
            userId = userRes.rows[0].id;
            console.log('Created User:', userId);
        }

        // 2. Create a wedding
        console.log('Creating/Checking Wedding...');
        const shareToken = 'test-wedding-123';
        const weddingCheck = await client.query("SELECT id FROM public.weddings WHERE share_token = $1", [shareToken]);
        let weddingId;

        if (weddingCheck.rows.length > 0) {
            weddingId = weddingCheck.rows[0].id;
            console.log('Wedding already exists:', weddingId);
        } else {
            const weddingRes = await client.query(`
            INSERT INTO public.weddings (
                user_id, bride_name, groom_name, wedding_date, venue, 
                share_token, custom_message, bride_parents, groom_parents,
                rsvp_phone, rsvp_email
            )
            VALUES (
                $1, 'Priya', 'Rahul', NOW() + INTERVAL '30 days', 'The Grand Palace, Mumbai',
                $2, 'We invite you to celebrate our special day!',
                'Mr. & Mrs. Sharma', 'Mr. & Mrs. Verma',
                '9876543210', 'rsvp@wedding.com'
            )
            RETURNING id
            `, [userId, shareToken]);
            weddingId = weddingRes.rows[0].id;
            console.log('Created Wedding:', weddingId);
        }

        // 3. Create events (Simplistic check)
        const eventsCheck = await client.query("SELECT id FROM public.wedding_events WHERE wedding_id = $1", [weddingId]);
        if (eventsCheck.rows.length === 0) {
            await client.query(`
            INSERT INTO public.wedding_events (wedding_id, event_type, custom_name, event_date, event_time, venue, description)
            VALUES 
            ($1, 'ceremony', 'Sangeet', NOW() + INTERVAL '29 days', '7:00 PM', 'Ballroom A', 'Dance and Music'),
            ($1, 'reception', 'Wedding Ceremony', NOW() + INTERVAL '30 days', '10:00 AM', 'Main Lawn', 'Traditional Ceremony')
            `, [weddingId]);
            console.log('Created Events');
        } else {
            console.log('Events already exist.');
        }

        console.log('Initialization completed successfully!');
        console.log('Access your invitation at: http://localhost:8081/invitation/' + shareToken);
    } catch (err) {
        console.error('Initialization failed:', err);
    } finally {
        await client.end();
    }
}

initData();
