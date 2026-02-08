require('dotenv').config();
const { Client } = require('pg');

console.log('Loading .env file...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
    try {
        console.log('Attempting to connect using DATABASE_URL...');
        await client.connect();
        console.log('SUCCESS: Connected to database!');

        const res = await client.query('SELECT current_database(), current_user');
        console.log('Connected to:', res.rows[0]);

    } catch (err) {
        console.error('CONNECTION FAILED:', err.message);
        if (err.message.includes('password authentication failed')) {
            console.error('Diagnosis: Password reject for user.');
        }
    } finally {
        await client.end();
    }
}

testConnection();
