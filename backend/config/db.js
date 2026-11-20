import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const { PGUSER, PGPASSWORD, PGHOST, PGDATABASE } = process.env;

// createa a connection to the database using the neon package and the environment variables
export const sql = neon(
    `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
);

// this sql function we export is used as a taged template literal to write SQL queries safely.

