import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// Supabase PostgreSQL connection string from user
const connectionString = "postgresql://postgres:2725Sprj2725@db.pkzcpirbrilhtrzrlxrw.supabase.co:5432/postgres";

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

export const initSupabaseDb = async () => {
  try {
    const client = await pool.connect();
    
    // Create CMS tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS cms_content (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        section VARCHAR(100),
        status VARCHAR(20) DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS cms_gallery (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        alt_text VARCHAR(255),
        status VARCHAR(20) DEFAULT 'published',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cms_pages (
        page_id VARCHAR(100) PRIMARY KEY,
        page_name VARCHAR(100) NOT NULL,
        data JSONB NOT NULL DEFAULT '{}',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log("✅ Supabase PostgreSQL connected & tables initialized.");
    client.release();
  } catch (error) {
    console.error("❌ Failed to connect to Supabase PostgreSQL:", error);
  }
};
