const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/wedding_whispers_db',
});

async function checkSchema() {
    try {
        const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'weddings';
    `);

        // Check specifically for template and language
        const hasTemplate = res.rows.some(r => r.column_name === 'template');
        const hasLanguage = res.rows.some(r => r.column_name === 'language');

        console.log('Columns present:', res.rows.map(r => r.column_name));
        console.log('FINAL CHECK - Has template:', hasTemplate);
        console.log('FINAL CHECK - Has language:', hasLanguage);

    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        pool.end();
    }
}

checkSchema();
