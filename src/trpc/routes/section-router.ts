import type { TRPCRouterRecord } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { sections } from "@/db/schema";
import { publicProcedure } from "@/trpc/init";


export const sectionRouter = {
	getAll: publicProcedure.query(() =>
		db.query.sections.findMany({
			orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
		})
	),
	getByFurnitureId: publicProcedure
		.input(z.string())
		.query(opts =>
			db.query.sections.findMany({
				where: eq(sections.furnitureId, opts.input),
				with: {
					furniture: true
				},
				orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
			})
		)
} satisfies TRPCRouterRecord;
