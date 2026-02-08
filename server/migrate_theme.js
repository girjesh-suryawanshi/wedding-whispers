import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/wedding_whispers_db',
});

async function migrate() {
    try {
        console.log('Migrating schema...');

        // Add template column if not exists
        await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'weddings' AND column_name = 'template') THEN
          ALTER TABLE weddings ADD COLUMN template TEXT DEFAULT 'rajasthani';
        END IF;
      END $$;
    `);

        // Add language column if not exists
        await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'weddings' AND column_name = 'language') THEN
          ALTER TABLE weddings ADD COLUMN language TEXT DEFAULT 'bilingual';
        END IF;
      END $$;
    `);

        console.log('Migration complete!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
