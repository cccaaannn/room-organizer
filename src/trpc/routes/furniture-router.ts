import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { furniture } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";


export const furnitureRouter = {
	getAll: protectedProcedure.query(opts =>
		db.query.furniture.findMany({
			where: eq(furniture.userId, opts.ctx.session!.user.id),
			orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
		})
	),
	getByRoomId: protectedProcedure
		.input(z.string())
		.query(opts =>
			db.query.furniture.findMany({
				where: and(
					eq(furniture.userId, opts.ctx.session!.user.id),
					eq(furniture.roomId, opts.input)
				),
				with: {
					room: true
				},
				orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
			})
		),
	getById: protectedProcedure
		.input(z.string())
		.query(opts =>
			db.query.furniture.findMany({
				where: and(
					eq(furniture.userId, opts.ctx.session!.user.id),
					eq(furniture.roomId, opts.input)
				),
				with: {
					room: true
				},
				orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
			})
		)
} satisfies TRPCRouterRecord;
