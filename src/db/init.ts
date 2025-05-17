import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import * as authSchema from "@/db/auth-schema";
import * as schema from "@/db/schema";
import { env } from "@/env";


const db = drizzle({ connection: { connectionString: env.DATABASE_URL }, schema: { ...schema, ...authSchema } });

export default db;
