import type { TRPCRouterRecord } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { furniture } from "@/db/schema";
import { publicProcedure } from "@/trpc/init";


export const furnitureRouter = {
	getAll: publicProcedure.query(() =>
		db.query.furniture.findMany({
			orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
		})
	),
	getByRoomId: publicProcedure
		.input(z.string())
		.query(opts =>
			db.query.furniture.findMany({
				where: eq(furniture.roomId, opts.input),
				with: {
					room: true
				},
				orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
			})
		),
	getById: publicProcedure
		.input(z.string())
		.query(opts =>
			db.query.furniture.findMany({
				where: eq(furniture.roomId, opts.input),
				with: {
					room: true
				},
				orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
			})
		)
} satisfies TRPCRouterRecord;
