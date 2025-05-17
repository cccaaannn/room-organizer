import type { TRPCRouterRecord } from "@trpc/server";
import { desc, sql } from "drizzle-orm";

import db from "@/db/init";
import { publicProcedure } from "@/trpc/init";


export const roomRouter = {
	getAll: publicProcedure.query(() =>
		db.query.rooms.findMany({
			orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
		})
	)
} satisfies TRPCRouterRecord;

