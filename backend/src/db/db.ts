import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { constituency, election, pal_candidates, pres_candidates, users } from './schema';

export const db = drizzle(process.env.DB_FILE_NAME!, {
    schema: {
        "users": users, 
        "election": election, 
        "constituency": constituency,
        "pres_candidates": pres_candidates,
        "pal_candidates": pal_candidates
    }
});