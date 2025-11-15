import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';

const sql = process.env.DATABASE_URL;

const db = drizzle(sql);

export { db, sql };
