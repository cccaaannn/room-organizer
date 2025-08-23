import { createServerFn } from "@tanstack/react-start";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import db from "@/db/init";
import { tags } from "@/db/schema";
import { currentUserMiddleware } from "@/middlewares/current-user-middleware";
import V from "@/utils/validation";


const UpdateTagScheme = z.object({
	id: z.string().uuid(),
	name: z.string().min(1, { message: "Name is required" }).max(250, { message: "Name must be less than 250 characters" }),
	description: z.string().max(1000, { message: "Description must be less than 500 characters" }),
	color: z.string().max(250, { message: "Name must be less than 250 characters" }).refine(V.isColor, { message: "Color must be a valid hex color" })
});

const updateTag = createServerFn({ method: "POST", response: "full" })
	.validator(f => UpdateTagScheme.parse(f))
	.middleware([currentUserMiddleware])
	.handler(async ctx => {
		const entity = await db.select()
			.from(tags)
			.where(and(
				eq(tags.id, ctx.data.id),
				eq(tags.userId, ctx.context.user.id)
			));

		if (entity.length === 0) {
			throw new Error("Not found");
		}

		if (entity[0].name !== ctx.data.name) {
			const existingTag = await db.select()
				.from(tags)
				.where(eq(tags.name, ctx.data.name));

			if (existingTag.length > 0) {
				throw new Error("Name is in use");
			}
		}

		return await db.update(tags)
			.set({
				name: ctx.data.name,
				description: ctx.data.description,
				color: ctx.data.color,
				updatedAt: sql`NOW()`
			})
			.where(eq(tags.id, ctx.data.id))
			.returning()
			.then(res => res[0]);
	});


export {
	updateTag,
	UpdateTagScheme
};
