const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/wedding_whispers_db',
});

async function updateDefaults() {
    try {
        console.log('Updating database defaults...');

        // Update default values for future columns
        await pool.query(`ALTER TABLE weddings ALTER COLUMN template SET DEFAULT 'garden'`);
        await pool.query(`ALTER TABLE weddings ALTER COLUMN language SET DEFAULT 'english'`);

        // Update existing rows to use new defaults (if that's what the user wants "always get these")
        await pool.query(`UPDATE weddings SET template = 'garden', language = 'english'`);

        console.log('Defaults updated and existing records set to Garden/English.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

updateDefaults();
