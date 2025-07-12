import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { items } from "@/db/schema";
import { protectedProcedure } from "@/trpc/init";


export const itemRouter = {
	getAll: protectedProcedure.query(opts =>
		db.query.items.findMany({
			where: eq(items.userId, opts.ctx.session!.user.id),
			with: {
				section: {
					with: {
						furniture: {
							with: {
								room: true
							}
						}
					}
				},
				itemsTags: {
					with: {
						tag: true
					}
				},
				relatedItems: true
			},
			orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
		})
	),
	getBySectionId: protectedProcedure
		.input(z.string())
		.query(opts =>
			db.query.items.findMany({
				where: and(
					eq(items.userId, opts.ctx.session!.user.id),
					eq(items.sectionId, opts.input)
				),
				with: {
					section: {
						with: {
							furniture: true
						}
					},
					itemsTags: {
						with: {
							tag: true
						}
					},
					relatedItems: true
				},
				orderBy: o => [desc(sql`coalesce(${o.updatedAt}, ${o.createdAt})`)]
			})
		),
	getById: protectedProcedure
		.input(z.string())
		.query(opts =>
			db.query.items.findFirst({
				where: and(
					eq(items.userId, opts.ctx.session!.user.id),
					eq(items.id, opts.input)
				),
				with: {
					section: {
						with: {
							furniture: true
						}
					},
					itemsTags: {
						with: {
							tag: true
						}
					},
					relatedItems: {
						with: {
							relatedItem: {
								with: {
									section: {
										with: {
											furniture: {
												with: {
													room: true
												}
											}
										}
									}
								}
							}
						}
					}
				}
			})
		)
} satisfies TRPCRouterRecord;
