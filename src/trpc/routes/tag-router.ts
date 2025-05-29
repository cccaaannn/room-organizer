import type { TRPCRouterRecord } from "@trpc/server";
import { desc, sql } from "drizzle-orm";

import db from "@/db/init";
import { publicProcedure } from "@/trpc/init";


export const tagRouter = {
	getAll: publicProcedure.query(() =>
		db.query.tags.findMany({
			orderBy: rooms => [desc(sql`coalesce(${rooms.updatedAt}, ${rooms.createdAt})`)]
		})
	)
} satisfies TRPCRouterRecord;
