import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { items, itemsTags, relatedItems } from "@/db/schema";


const UpdateItemScheme = z.object({
	id: z.string().uuid(),
	sectionId: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" }),
	tags: z.array(z.string().uuid()),
	relatedItems: z.array(z.string().uuid())
});

const updateItem = createServerFn({ method: "POST", response: "full" })
	.validator(f => UpdateItemScheme.parse(f))
	.handler(async ctx => {
		const entity = await db.select()
			.from(items)
			.where(eq(items.id, ctx.data.id));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		if (entity[0].name !== ctx.data.name) {
			const existingTag = await db.select()
				.from(items)
				.where(and(eq(items.name, ctx.data.name), eq(items.sectionId, ctx.data.sectionId)));

			if (existingTag.length > 0) {
				throw new Error("Name is in use");
			}
		}

		if (ctx.data.relatedItems.some(relatedItemId => relatedItemId === ctx.data.id)) {
			throw new Error("Item cannot be related to itself");
		}

		const updated = await db.update(items)
			.set({
				name: ctx.data.name,
				description: ctx.data.description,
				sectionId: ctx.data.sectionId,
				updatedAt: sql`NOW()`
			})
			.where(eq(items.id, ctx.data.id))
			.returning()
			.then(res => res[0]);

		// Delete existing relations
		await db.delete(itemsTags)
			.where(eq(itemsTags.itemId, ctx.data.id));

		await db.delete(relatedItems)
			.where(eq(relatedItems.itemId, ctx.data.id));

		// Insert new relations
		if (ctx.data.tags && ctx.data.tags.length > 0) {
			await db.insert(itemsTags)
				.values(
					ctx.data.tags.map(tagId => ({ itemId: updated.id, tagId }))
				);
		}
		if (ctx.data.relatedItems && ctx.data.relatedItems.length > 0) {
			await db.insert(relatedItems)
				.values(
					ctx.data.relatedItems.map(relatedItemId => ({ itemId: updated.id, relatedItemId }))
				);
		}

		return updated;
	});


export {
	updateItem,
	UpdateItemScheme
};
