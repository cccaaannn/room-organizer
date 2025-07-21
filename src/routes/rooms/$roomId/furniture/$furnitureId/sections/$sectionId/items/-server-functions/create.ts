import { createServerFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { items, itemsTags, relatedItems, sections } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";


const CreateItemScheme = z.object({
	sectionId: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" }),
	tags: z.array(z.string().uuid()),
	relatedItems: z.array(z.string().uuid())
});

const createItem = createServerFn({ method: "POST", response: "full" })
	.validator(f => CreateItemScheme.parse(f))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const existingSection = await db.select()
			.from(sections)
			.where(and(
				eq(sections.id, ctx.data.sectionId),
				eq(sections.userId, ctx.context.user.id)
			));

		if (existingSection.length === 0) {
			throw new Error("Section not found");
		}

		const entity: typeof items.$inferInsert = {
			name: ctx.data.name,
			description: ctx.data.description,
			sectionId: ctx.data.sectionId,
			userId: ctx.context.user.id
		};

		const existingEntity = await db.select()
			.from(items)
			.where(and(eq(items.name, ctx.data.name), eq(items.sectionId, ctx.data.sectionId)));

		if (existingEntity.length > 0) {
			throw new Error("Name is in use");
		}

		const created = await db.insert(items)
			.values(entity)
			.returning()
			.then(res => res[0]);

		if (ctx.data.tags && ctx.data.tags.length > 0) {
			await db.insert(itemsTags)
				.values(
					ctx.data.tags.map(tagId => ({ itemId: created.id, tagId }))
				);
		}

		if (ctx.data.relatedItems && ctx.data.relatedItems.length > 0) {
			await db.insert(relatedItems)
				.values(
					ctx.data.relatedItems.map(relatedItemId => ({ itemId: created.id, relatedItemId }))
				);
		}

		return created;
	});


export {
	createItem,
	CreateItemScheme
};
