import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { sections } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";


export const sectionRouter = {
	getAll: protectedProcedure.query(opts =>
		db.query.sections.findMany({
			where: eq(sections.userId, opts.ctx.session!.user.id),
			orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
		})
	),
	getByFurnitureId: protectedProcedure
		.input(z.string())
		.query(opts =>
			db.query.sections.findMany({
				where: and(
					eq(sections.userId, opts.ctx.session!.user.id),
					eq(sections.furnitureId, opts.input)
				),
				with: {
					furniture: true
				},
				orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
			})
		)
} satisfies TRPCRouterRecord;
