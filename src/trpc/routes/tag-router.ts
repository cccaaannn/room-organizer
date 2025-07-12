import type { TRPCRouterRecord } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";

import db from "@/db/init";
import { tags } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";


export const tagRouter = {
	getAll: protectedProcedure.query(opts =>
		db.query.tags.findMany({
			where: eq(tags.userId, opts.ctx.session!.user.id),
			orderBy: rooms => [desc(sql`coalesce(${rooms.updatedAt}, ${rooms.createdAt})`)]
		})
	)
} satisfies TRPCRouterRecord;
