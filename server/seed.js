require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database...');

    // 1. Create a user
    const userRes = await client.query(`
      INSERT INTO public.users (email, password_hash)
      VALUES ('test@example.com', 'hashed_password')
      RETURNING id
    `);
    const userId = userRes.rows[0].id;
    console.log('Created User:', userId);

    // 2. Create a wedding
    const shareToken = 'test-wedding-123';
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
    const weddingId = weddingRes.rows[0].id;
    console.log('Created Wedding:', weddingId);

    // 3. Create events
    await client.query(`
      INSERT INTO public.wedding_events (wedding_id, event_type, custom_name, event_date, event_time, venue, description)
      VALUES 
      ($1, 'ceremony', 'Sangeet', NOW() + INTERVAL '29 days', '7:00 PM', 'Ballroom A', 'Dance and Music'),
      ($1, 'reception', 'Wedding Ceremony', NOW() + INTERVAL '30 days', '10:00 AM', 'Main Lawn', 'Traditional Ceremony')
    `, [weddingId]);
    console.log('Created Events');

    console.log('Seed completed successfully!');
    console.log('Access your invitation at: http://localhost:8081/invitation/' + shareToken);
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await client.end();
  }
}

seed();
