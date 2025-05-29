import type { TRPCRouterRecord } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { items } from "@/db/schema";
import { publicProcedure } from "@/trpc/init";


export const itemRouter = {
	getAll: publicProcedure.query(() =>
		db.query.items.findMany({
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
	getBySectionId: publicProcedure
		.input(z.string())
		.query(opts =>
			db.query.items.findMany({
				where: eq(items.sectionId, opts.input),
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
	getById: publicProcedure
		.input(z.string())
		.query(opts =>
			db.query.items.findFirst({
				where: eq(items.id, opts.input),
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
