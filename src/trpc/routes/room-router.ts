import type { TRPCRouterRecord } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";

import db from "@/db/init";
import { rooms } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";


export const roomRouter = {
	getAll: protectedProcedure.query(opts =>
		db.query.rooms.findMany({
			where: eq(rooms.userId, opts.ctx.session!.user.id),
			orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
		})
	)
} satisfies TRPCRouterRecord;

