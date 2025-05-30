import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { sections } from "@/db/schema";


const UpdateSectionScheme = z.object({
	id: z.string().uuid(),
	furnitureId: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" })
});

const updateSection = createServerFn({ method: "POST", response: "full" })
	.validator(f => UpdateSectionScheme.parse(f))
	.handler(async ctx => {
		const entity = await db.select()
			.from(sections)
			.where(eq(sections.id, ctx.data.id));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		if (entity[0].name !== ctx.data.name) {
			const existingTag = await db.select()
				.from(sections)
				.where(and(eq(sections.name, ctx.data.name), eq(sections.furnitureId, ctx.data.furnitureId)));

			if (existingTag.length > 0) {
				throw new Error("Name is in use");
			}
		}

		return await db.update(sections)
			.set({
				name: ctx.data.name,
				description: ctx.data.description,
				furnitureId: ctx.data.furnitureId,
				updatedAt: sql`NOW()`
			})
			.where(eq(sections.id, ctx.data.id))
			.returning()
			.then(res => res[0]);
	});


export {
	updateSection,
	UpdateSectionScheme
};
