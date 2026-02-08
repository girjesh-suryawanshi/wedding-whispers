const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/wedding_whispers_db',
});

async function migrate() {
    try {
        console.log('Starting migration...');

        // Add template column
        try {
            await pool.query(`ALTER TABLE weddings ADD COLUMN IF NOT EXISTS template TEXT DEFAULT 'rajasthani'`);
            console.log('Added template column');
        } catch (e) {
            console.log('Template column error (might exist):', e.message);
        }

        // Add language column
        try {
            await pool.query(`ALTER TABLE weddings ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'bilingual'`);
            console.log('Added language column');
        } catch (e) {
            console.log('Language column error (might exist):', e.message);
        }

        console.log('Migration complete');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        pool.end();
    }
}

migrate();
